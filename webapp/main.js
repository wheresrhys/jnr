'use strict';

import page from 'page';
import configureRoutes from 'lib/configure-routes';

const controllers = {
	root: function (e) {
	  console.log('Hello World: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	},
	learn: function (e) {
	  console.log('learn: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	},
	rehearse: function (e) {
	  console.log('rehearse: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	},
	tunes: function (e) {
	  console.log('tunes: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	},
	sets: function (e) {
	  console.log('sets: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	}
};

configureRoutes({
	get: page
}, controllers);

page.start();
