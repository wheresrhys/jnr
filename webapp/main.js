'use strict';

import page from 'page';
import {routeMappings, configureRoutes} from './lib/route-config';
// https://github.com/kentjs/koa-client
//
import pages from './pages/index';

function updateNav (e) {
	console.log(this);
	console.log(e);
	console.log('asdsa')
	console.log('highlight nav item', e.params)
}

const controllers = {
	home: function (e) {
		updateNav (e)
	  console.log('Hello World: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	},
	learn: function (e) {
		updateNav (e)
	  console.log('learn: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	},
	rehearse: function (e) {
		updateNav (e)
	  console.log('rehearse: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	},
	tunes: function (e) {
		updateNav (e)
		pages.tunes.call(this);
	  console.log('tunes: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	},
	sets: function (e) {
		updateNav (e)
	  console.log('sets: ' + Object.keys(e.params).map(k => k + ':' + e.params[k]).join(' '));
	}
};

configureRoutes({
	get: page
}, controllers);

page.start();
