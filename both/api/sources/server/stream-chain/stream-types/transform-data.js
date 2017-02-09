import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/stevezhu:lodash';
import entries from '/both/lib/entries';
import { Categories } from '/both/api/categories/categories.js';
const { Transform } = Npm.require('zstreams');

const categoryIdForSynonyms = {};
function updateCategories() {
  console.log('Updating categories...');
  Categories.find({}).fetch().forEach(category => {
    category.synonyms.forEach(s => {
      if (s) {
        categoryIdForSynonyms[s] = category._id;
      }
    });
  });
}

function compileMapping(fieldName, javascript) {
  // eslint-disable-next-line no-unused-vars
  const helpers = {
    OSM: {
      fetchNameFromTags(tags) {
        if (tags == null) {
          return '?';
        }

        return tags.name || 'object';
      },
      fetchCategoryFromTags(tags) {
        if (tags === undefined) {
          return 'empty';
        }

        const matchingTag = _.find(Object.keys(tags), (tag) => {
          const categoryId = `${tag}=${tags[tag]}`.toLowerCase().replace(' ', '_');
          return categoryIdForSynonyms[categoryId];
        });

        if (matchingTag) {
          const categoryId = `${matchingTag}=${tags[matchingTag]}`
            .toLowerCase()
            .replace(' ', '_');
          return categoryIdForSynonyms[categoryId];
        }
        return 'undefined';
      },
    },
    AXSMaps: {
      estimateRatingFor(obj, voteCount) {
        const maxVotes = _.max([
          obj.spacious,
          obj.ramp,
          obj.parking,
          obj.quiet,
          obj.secondentrance,
        ]);

        if (maxVotes === 0) {
          return undefined;
        }

        return voteCount / maxVotes;
      },
      estimateFlagFor(obj, voteCount) {
        const maxVotes = _.max([
          obj.spacious,
          obj.ramp,
          obj.parking,
          obj.quiet,
          obj.secondentrance,
        ]);

        if (maxVotes === 0) {
          return undefined;
        }

        return voteCount / maxVotes > 0.5;
      },
      getCategoryFromList(categories) {
        if (!categories) {
          return 'undefined';
        }

        for (let i = 0; i < categories.length; ++i) {
          const c = categoryIdForSynonyms[categories[i]];
          if (c) {
            return c;
          }
        }
        return 'undefined';
      },
      guessGeoPoint(lngLat) {
        if (!lngLat) {
          return null;
        }
        let coordinates = lngLat;
        if (lngLat[1] < -20 || lngLat[1] > 60) {
          coordinates = [lngLat[1], lngLat[0]];
        }
        return { coordinates, type: 'Point' };
      },
    },
    extractNumber(str) {
      const match = str.match(/-?\d+\.?\d*/);
      return match && Number(match[0]);
    },
  };

  // Should be moved to a sandbox at some point. https://nodejs.org/api/vm.html
  // eslint-disable-next-line no-eval
  return eval(`(d) => (${javascript})`);
}

function compileMappings(mappings) {
  const result = {};
  for (const [fieldName, javascript] of entries(mappings)) {
    try {
      result[fieldName] = compileMapping(fieldName, javascript);
    } catch (error) {
      if (error instanceof SyntaxError) {
        error.message = `${error.message} (in field '${fieldName}')`;
      }
      throw error;
    }
  }
  return result;
}

export class TransformData {
  constructor({ mappings }) {
    check(mappings, Object);

    updateCategories();

    let hadError = false;

    this.stream = new Transform({
      writableObjectMode: true,
      readableObjectMode: true,
      transform(chunk, encoding, callback) {
        try {
          if (hadError) { return; }

          this.compiledMappings = this.compiledMappings || compileMappings(mappings);

          const output = {};

          for (const [fieldName, fn] of entries(this.compiledMappings)) {
            const value = fn(chunk);
            if (fieldName.match(/-/)) {
              // Field name is probably a key path like 'a-b-c'
              if (value !== undefined && value !== null) {
                // Don't polute database with undefined properties
                _.set(output, fieldName.replace(/-/g, '.'), value);
              }
            } else {
              output[fieldName] = value;
            }
          }
          output.properties = output.properties || {};
          output.properties.originalData = JSON.stringify(chunk);
          callback(null, output);
        } catch (error) {
          hadError = true;
          this.emit('error', error);
          callback(error);
          return;
        }
      },
    });

    this.lengthListener = length => this.stream.emit('length', length);
    this.pipeListener = source => {
      this.source = source;
      source.on('length', this.lengthListener);
    };
    this.stream.on('pipe', this.pipeListener);


    this.stream.unitName = 'places';
  }

  dispose() {
    delete this.compiledMappings;
    this.stream.removeListener('pipe', this.pipeListener);
    delete this.pipeListener;
    if (this.source) {
      this.source.removeListener('length', this.lengthListener);
    }
    delete this.lengthListener;
    delete this.source;
    delete this.stream;
  }

  static getParameterSchema() {
    return new SimpleSchema({});
  }
}
