'use strict';
window.log = console.log.bind(console);
window.logErr = (err) => {
	log(err);
	throw err;
};
import page from 'page';
import co from 'co';
import nunjucks from 'nunjucks/browser/nunjucks';
// import templates from './templates';
import querystring from 'querystring';
import {routeMappings, configureRoutes} from './lib/route-config';
import pages from './pages/index';
import enhance from './pages/enhancements-index';
let justLoaded = true;
function updateNav (ev) {
	console.log(ev);
}

// using [] as base url because a) it's truthy, so gets used b) [].toString = ''
const templateLoader = new nunjucks.Environment(new nunjucks.WebLoader([], {async: true}))

function appify (generator, controller) {
	return co.wrap(function* (ev) {
		ev.action = ev.params.action;
		ev.controller = controller;
		ev.data = {};
		ev.query = querystring.parse(ev.querystring);

		yield (co.wrap(generator))(ev);

		if (justLoaded) {
			justLoaded = false;
			enhance(ev);
			return;
		}
		updateNav(ev);

		console.log(`pages/${ev.controller}${ev.action ? '/' + ev.action : ''}/tpl.html`);
		templateLoader.render(`pages/${ev.controller}${ev.action ? '/' + ev.action : ''}/tpl.html`, ev.data, (err, res) => {
			document.querySelector('main').innerHTML = res;
			enhance(ev);
		});

	})
}

const controllers = {
	home: appify(function* (ev) {
		yield pages.home.call(ev);
	}, 'home'),
	learn: appify(function* (ev) {
		yield pages.learn.call(ev);
	}, 'learn'),
	rehearse: appify(function* (ev) {
		yield pages.rehearse.call(ev);
	}, 'rehearse'),
	tunes: appify(function* (ev) {
		yield pages.tunes.call(ev);
	}, 'tunes'),
	sets: appify(function* (ev) {
		yield pages.sets.call(ev);
	}, 'sets')
};

configureRoutes({
	get: page
}, controllers);

page.start();
