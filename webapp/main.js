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
import enhance from './pages/enhancements-index';
let justLoaded = true;
function updateNav (e) {
	console.log(e);
}

function appify (generator, controller) {
	return co.wrap(function* (e) {
		e.action = e.params.action;
		e.controller = controller;
		e.data = {};
		e.query = querystring.parse(e.querystring);

		if (justLoaded) {
			justLoaded = false;
			enhance(e);
			return;
		}
		updateNav(e);
		yield (co.wrap(generator))(e);
		document.querySelector('main').innerHTML = nunjucks.render(`pages/${e.controller}${e.action ? '/' + e.action : ''}/tpl.html`, e.data);
		enhance(e);
	})
}

const controllers = {
	home: appify(function* (e) {
		yield pages.home.call(e);
	}, 'home'),
	learn: appify(function* (e) {
		yield pages.learn.call(e);
	}, 'learn'),
	rehearse: appify(function* (e) {
		yield pages.rehearse.call(e);
	}, 'rehearse'),
	tunes: appify(function* (e) {
		yield pages.tunes.call(e);
	}, 'tunes'),
	sets: appify(function* (e) {
		yield pages.sets.call(e);
	}, 'sets')
};

configureRoutes({
	get: page
}, controllers);

page.start();
