/* globals L */

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/stevezhu:lodash';
import { PlaceInfos } from '/both/api/place-infos/place-infos.js';
import { getCurrentPlaceInfo } from './get-current-place-info';
import { getApiUserToken } from '/client/lib/api-tokens';
import PromisePool from 'es6-promise-pool';
import buildFeatureCollectionFromArray from '/both/lib/build-feature-collection-from-array';

import 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const PLACES_BATCH_SIZE = 2000;
const CONCURRENCY_LIMIT = 3;
const DEFAULT_NUMBER_OF_PLACES_FETCHED = 10000;

// Extend Leaflet-icon to support colors and category-images
L.AccessibilityIcon = L.Icon.extend({
  options: {
    number: '',
    shadowUrl: null,
    iconSize: new L.Point(27, 27),
    iconAnchor: new L.Point(13, 25),
    popupAnchor: new L.Point(0, -33),
    className: 'leaflet-div-icon accessiblity',
  },

  createIcon() {
    const div = document.createElement('div');
    const img = this._createImg(this.options.iconUrl);
    div.appendChild(img);
    this._setIconStyles(div, 'icon');
    return div;
  },

  createShadow() {
    return null;
  },
});

function getColorForWheelchairAccessiblity(placeData) {
  try {
    if (placeData.properties.accessibility.accessibleWith.wheelchair === true) {
      return 'green';
    } else if (placeData.properties.accessibility.accessibleWith.wheelchair === false) {
      return 'red';
    }
  } catch (e) {
    console.warn('Failed to get color for', placeData, e);
  }
  return 'grey';
}

function centerOnCurrentPlace(map) {
  const place = getCurrentPlaceInfo();
  if (place) {
    map.setView(place.geometry.coordinates.reverse(), 18);
  }
}

const idsToShownMarkers = {};

function filterShownMarkers(featureCollection) {
  const result = {};
  result.features = featureCollection.features
    .filter(feature => !idsToShownMarkers[feature.properties._id]);
  result.featureCount = result.features.length;
  return result;
}

function showPlacesOnMap(markerClusterGroup, map, unfilteredFeatureCollection) {
  const featureCollection = filterShownMarkers(unfilteredFeatureCollection);

  // console.log('Adding', featureCollection.features.length, 'new places to map...');
  if (featureCollection.features && featureCollection.features.length) {
    const geojsonLayer = new L.geoJson(featureCollection, { // eslint-disable-line new-cap
      pointToLayer(feature, latlng) {
        const id = feature.properties._id;
        if (idsToShownMarkers[id]) {
          return idsToShownMarkers[id];
        }
        const categoryIconName = _.get(feature, 'properties.category') || 'place';
        const color = getColorForWheelchairAccessiblity(feature);

        const acIcon = new L.AccessibilityIcon({
          iconUrl: `/icons/categories/${categoryIconName}.png`,
          className: `ac-marker ${color}`,
          // iconSize: [27, 27],
        });
        const marker = L.marker(latlng, { icon: acIcon });
        marker.on('click', () => {
          FlowRouter.go('placeInfos.show', {
            _id: FlowRouter.getParam('_id'),
            limit: FlowRouter.getParam('limit'),
            placeInfoId: feature.properties._id,
          });
        });
        idsToShownMarkers[id] = marker;
        return marker;
      },
    });

    const markers = markerClusterGroup || L.markerClusterGroup({
      polygonOptions: {
        color: '#08c',
        weight: 1,
      },
    });
    markers.addLayer(geojsonLayer, { chunkedLoading: true });
    map.addLayer(markers);
    map.fitBounds(markers.getBounds().pad(0.02));
    centerOnCurrentPlace(map);
    return markers;
  }
  return null;
}

async function getPlacesBatch(skip, limit, sendProgress) {
  // console.log('Get places batch, skip', skip, 'limit', limit);
  const hashedToken = await getApiUserToken();
  const options = {
    params: { skip, limit, includeSourceIds: FlowRouter.getParam('_id') },
    headers: { Accept: 'application/json', 'X-User-Token': hashedToken },
  };

  return new Promise((resolve, reject) => {
    HTTP.get(Meteor.absoluteUrl('place-infos'), options, (error, response) => {
      if (error) {
        reject(error);
      } else {
        sendProgress(response.data);
        resolve(response);
      }
    });
  });
}

async function getPlaces(limit, onProgress = () => {}) {
  let progress = 0;
  let numberOfPlacesToFetch = 0;
  const sendProgress = (responseData) => {
    progress += responseData.featureCount;
    onProgress({
      featureCollection: responseData,
      percentage: numberOfPlacesToFetch ? 100 * progress / numberOfPlacesToFetch : 0,
    });
    return responseData;
  };

  // The first batch's response contains the total number of features to fetch.
  const firstResponseData = (await getPlacesBatch(0, PLACES_BATCH_SIZE, sendProgress)).data;
  progress = firstResponseData.featureCount;
  numberOfPlacesToFetch = Math.min(firstResponseData.totalFeatureCount, limit);
  // console.log('We have to fetch', numberOfPlacesToFetch, 'places.');

  // Allow only 3 running requests at the same time. Without this, all requests
  // would be started at the same time leading to timeouts.
  function *generatePromises() {
    if (numberOfPlacesToFetch <= PLACES_BATCH_SIZE) {
      return;
    }
    for (let i = 1; i < (numberOfPlacesToFetch / PLACES_BATCH_SIZE); i++) {
      yield getPlacesBatch(i * PLACES_BATCH_SIZE, PLACES_BATCH_SIZE, sendProgress);
    }
  }
  const pool = new PromisePool(generatePromises(), CONCURRENCY_LIMIT);
  return pool.start();
}

Template.sources_show_page_map.onCreated(function created() {
  this.isLoading = new ReactiveVar(true);
  this.loadError = new ReactiveVar();
  this.loadProgress = new ReactiveVar();
  this.isClustering = new ReactiveVar();
});

['isLoading', 'loadError', 'loadProgress'].forEach(helper =>
  Template.sources_show_page_map.helpers({
    [helper]() { return Template.instance()[helper].get(); },
  })
);

function initializeMap(instance) {
  check(Meteor.settings.public.mapbox, String);

  const map = L.map(instance.find('.map'), {
    doubleClickZoom: false,
  }).setView([49.25044, -123.137], 13);

  window.map = map;

  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicGl4dHVyIiwiYSI6ImNpc2tuMWx1eDAwNHQzMnBremRzNjBqcXIifQ.3jo3ZXnwCVxTkKaw0RPlDg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'accesssibility-cloud',
    accessToken: Meteor.settings.public.mapbox,
  }).addTo(map);

  return map;
}

let markerClusterGroup = null;

Template.sources_show_page_map.onRendered(function sourcesShowPageOnRendered() {
  const map = initializeMap(this);

  const instance = this;
  let currentSourceId = null;

  function removeMarkers() {
    // console.log('Removing marker clusters.');
    Object.keys(idsToShownMarkers).forEach(key => delete idsToShownMarkers[key]);
    if (markerClusterGroup) {
      map.removeLayer(markerClusterGroup);
      markerClusterGroup = null;
    }
  }

  async function loadPlaces(limit, onProgress) {
    // console.log('Loading places...');
    instance.isLoading.set(true);
    instance.loadError.set(null);
    instance.loadProgress.set({});
    return getPlaces(limit, onProgress);
  }

  this.autorun(() => {
    if (!Meteor.userId()) { return; }

    const newSourceId = FlowRouter.getParam('_id');
    if (newSourceId !== currentSourceId) {
      removeMarkers();
      currentSourceId = newSourceId;
    }

    FlowRouter.watchPathChange();
    const limit = Number(FlowRouter.getQueryParam('limit')) || DEFAULT_NUMBER_OF_PLACES_FETCHED;

    const routeName = FlowRouter.getRouteName();
    const isShowingASinglePlace = routeName === 'placeInfos.show';
    let placesPromise;

    if (isShowingASinglePlace) {
      // console.log('Showing a single place...');
      const placeInfoId = FlowRouter.getParam('placeInfoId');
      const doc = PlaceInfos.findOne(placeInfoId);
      const place = doc && PlaceInfos.convertToGeoJSONFeature(doc);
      const featureCollection = buildFeatureCollectionFromArray([place]);
      markerClusterGroup = showPlacesOnMap(markerClusterGroup, map, featureCollection);
      placesPromise = Promise.resolve();
    } else {
      const isDisplayingFewerMarkersThanBefore = this.currentLimit && limit <= this.currentLimit;
      if (isDisplayingFewerMarkersThanBefore) {
        return;
      }

      this.currentLimit = limit;

      placesPromise = loadPlaces(limit, ({ featureCollection, percentage }) => {
        markerClusterGroup = showPlacesOnMap(markerClusterGroup, map, featureCollection);
        instance.loadProgress.set({ percentage });
      });
    }

    placesPromise
      .then(
        () => {
          instance.isLoading.set(false);
        },
        (error) => {
          instance.loadError.set(error);
          instance.isLoading.set(false);
        }
      );
    FlowRouter.setQueryParams({ limit });
  });

  this.autorun(() => centerOnCurrentPlace(map));
});
