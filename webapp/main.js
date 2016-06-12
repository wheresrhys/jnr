'use strict';

window.log = console.log.bind(console);
window.logErr = (err) => {
	log(err);
	throw err;
};

import page from 'page';
import querystring from 'querystring';
import {configureRoutes} from './pages/index';
import {init as initDb} from './data';
import pages from './pages/index';
import enhance from './pages/enhancements';
import {updateNav} from './components/nav/enhancement';

import {loader as templateLoader} from 'templates';

let initialLoad = true;

function appify (controller) {
	return async (ctx) => {
		ctx.data = {};
		ctx.start = Date.now();
		ctx.query = querystring.parse(ctx.querystring);
		if (initialLoad) {
			ctx.initialLoad = true;
		}
		await controller(ctx);

		if (initialLoad) {
			initialLoad = false;
			enhance(ctx);
			return;
		}
		updateNav(ctx);

		console.log(`pages/${ctx.controller}${ctx.action ? '/' + ctx.action : ''}/tpl.html`);
		templateLoader.render(`pages/${ctx.controller}${ctx.action ? '/' + ctx.action : ''}/tpl.html`, ctx.data, (err, res) => {
			document.querySelector('main').innerHTML = res;
			enhance(ctx);
		});

	}
}

configureRoutes({
	get: page
}, func => {
	return appify(async (ctx) => {
		await func(ctx);
	})
});

initDb()
	.then(page.start);
