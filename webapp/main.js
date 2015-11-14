'use strict';

import page from 'page';
import {routeMappings, configureRoutes} from './lib/route-config';
// https://github.com/kentjs/koa-client
//
import pages from './pages/index';

const controllers = {
	home: function (e) {
	  console.log('Hello World: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	},
	learn: function (e) {
	  console.log('learn: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	},
	rehearse: function (e) {
	  console.log('rehearse: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	},
	tunes: function (e) {
		pages.tunes.call(this);
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
