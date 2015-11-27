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

let justLoaded = true;
function updateNav (e) {
	console.log(e);
}

function appify (generator) {
	return co.wrap(function* (e) {
		if (justLoaded) {
			justLoaded = false;
			return;
		}
		e.data = {};
		e.query = querystring.parse(e.querystring);
		updateNav(e);
		yield(co.wrap(generator))(e);
		document.querySelector('main').innerHTML = nunjucks.render(e.tpl, e.data);
	})
}

const controllers = {
	home: appify(function* (e) {
		yield pages.home.call(e);
	}),
	learn: appify(function* (e) {
		yield pages.learn.call(e);
	}),
	rehearse: appify(function* (e) {
		yield pages.rehearse.call(e);
	}),
	tunes: appify(function* (e) {
		yield pages.tunes.call(e);
	}),
	sets: appify(function* (e) {
		yield pages.sets.call(e);
	})
};

configureRoutes({
	get: page
}, controllers);

page.start();
