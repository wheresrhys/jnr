'use strict';
window.log = console.log.bind(console);
window.logErr = (err) => {
	log(err);
	throw err;
};
import page from 'page';
import co from 'co';
import nunjucks from 'nunjucks/browser/nunjucks';
import querystring from 'querystring';
import {routeMappings, configureRoutes} from './lib/route-config';
import pages from './pages/index';
import enhance from './pages/enhancements';

let initialLoad = true;

function updateNav (ev) {
	console.log(ev);
}

// using [] as base url because a) it's truthy, so gets used b) [].toString = ''
const templateLoader = window.templateLoader = new nunjucks.Environment(new nunjucks.WebLoader([], {async: true}))

function appify (generator) {
	return co.wrap(function* (ev) {
		ev.data = {};
		ev.query = querystring.parse(ev.querystring);

		yield (co.wrap(generator))(ev);

		if (initialLoad) {
			initialLoad = false;
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
	}),
	learn: appify(function* (ev) {
		yield pages.learn.call(ev);
	}),
	rehearse: appify(function* (ev) {
		yield pages.rehearse.call(ev);
	}),
	tunes: appify(function* (ev) {
		yield pages.tunes.call(ev);
	}),
	tune: appify(function* (ev) {
		yield pages.tune.call(ev);
	})
};

configureRoutes({
	get: page
}, controllers);

page.start();
