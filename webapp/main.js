'use strict';
window.log = console.log.bind(console);
window.logErr = (err) => {
	log(err);
	throw err;
};
import page from 'page';
import co from 'co';
import nunjucks from 'nunjucks/browser/nunjucks-slim';
import templates from './templates';
import querystring from 'querystring';
import {routeMappings, configureRoutes} from './lib/route-config';
import pages from './pages/index';

function updateNav (e) {
	console.log(e);
}

function koaify (e) {
	e.data = {};
	e.query = querystring.parse(e.querystring);
}

function render(e) {
	document.querySelector('main').innerHTML = nunjucks.render(e.tpl, e.data);
}

function appify (generator) {
	return co.wrap(function* (e) {
		koaify(e);
		updateNav(e);
		yield(co.wrap(generator))(e);
		render(e)
	})
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
	tunes: appify(function* (e) {
		yield pages.tunes.call(e);
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
