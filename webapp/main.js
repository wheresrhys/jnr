'use strict';
window.log = console.log.bind(console);
window.logErr = (err) => {
	log(err);
	throw err;
};
import page from 'page';
import co from 'co';
import marko from 'marko';
import querystring from 'querystring';
import {routeMappings, configureRoutes} from './lib/route-config';
import pages from './pages/index';
import pageTemplates from './_template-map';

for (let key in pageTemplates) {
	pageTemplates[key] = marko.load(pageTemplates[key]);
}

function updateNav (e) {
	console.log(e);
}

function koaify (e) {
	e.data = {};
	e.query = querystring.parse(e.querystring);
}

function render(e) {
	var template = pageTemplates[e.tpl];
	document.querySelector('main').innerHTML = template.renderSync(e.data);
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
		render(e)
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
