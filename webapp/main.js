'use strict';
window.log = console.log.bind(console);
window.logErr = (err) => {
	log(err);
	throw err;
};
import page from 'page';
import co from 'co';
import querystring from 'querystring';
import {routeMappings, configureRoutes} from './lib/route-config';
// https://github.com/kentjs/koa-client
//
import pages from './pages/index';

function updateNav (e) {
	console.log(e);
}

function koaify (e) {
	e.data = {};
	e.query = querystring.parse(e.querystring);
}

const controllers = {
	home: co.wrap(function* (e) {
		koaify(e);
		updateNav(e);
	}),
	learn: co.wrap(function* (e) {
		koaify(e);
		updateNav(e);
	}),
	rehearse: co.wrap(function* (e) {
		koaify(e);
		updateNav(e);
	}),
	tunes: co.wrap(function* (e) {
		koaify(e);
		updateNav(e);
		yield pages.tunes.call(e);
		console.log(e.data);
	}),
	sets: co.wrap(function* (e) {
		koaify(e);
		updateNav(e);
	})
};

configureRoutes({
	get: page
}, controllers);

page.start();
