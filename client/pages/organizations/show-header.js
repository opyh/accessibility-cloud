import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Organizations } from '/both/api/organizations/organizations.js';
import { Licenses } from '/both/api/licenses/licenses.js';
import { Apps } from '/both/api/apps/apps.js';


import subsManager from '/client/lib/subs-manager';

Template.organizations_show_header.onCreated(() => {
  subsManager.subscribe('licenses.public');
});

Template.organizations_show_header.helpers({
  // FIXME: this sould be reused in header-sub
  organization() {
    if (FlowRouter._current.route.name.startsWith('organizations.')) {
      const organizationId = FlowRouter.getParam('_id');
      return Organizations.findOne({ _id: organizationId });
    }

    if (FlowRouter._current.route.name.startsWith('apps.')) {
      const appId = FlowRouter.getParam('_id');
      const app = Apps.findOne({ _id: appId });
      if (app) {
        return Organizations.findOne({ _id: app.organizationId });
      }
    }

    if (FlowRouter._current.route.name.startsWith('licenses.')) {
      const licenseId = FlowRouter.getParam('_id');
      const license = Licenses.findOne({ _id: licenseId });
      if (license) {
        return Organizations.findOne({ _id: license.organizationId });
      }
    }

    return {};
  },
});
