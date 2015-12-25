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
import {configureRoutes} from './pages/index';
import pages from './pages/index';
import enhance from './pages/enhancements';

let initialLoad = true;

function updateNav (ev) {
	// console.log(ev);
}

// using [] as base url because a) it's truthy, so gets used b) [].toString = ''
const templateLoader = window.templateLoader = new nunjucks.Environment(new nunjucks.WebLoader([], {
	async: true,
	useCache: true
}))

function appify (generator) {
	return co.wrap(function* (ev) {
		ev.data = {};
		ev.start = Date.now();
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

configureRoutes({
	get: page
}, func => {
	return appify(function* (ev) {
		yield func.call(ev);
	})
});

page.start();
