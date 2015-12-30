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
import {updateNav} from './components/nav/enhancement';


let initialLoad = true;

// using [] as base url because a) it's truthy, so gets used b) [].toString = ''
const templateLoader = window.templateLoader = new nunjucks.Environment(new nunjucks.WebLoader([], {
	async: true,
	useCache: true
}))

function appify (generator) {
	return co.wrap(function* (ctx) {
		ctx.data = {};
		ctx.start = Date.now();
		ctx.query = querystring.parse(ctx.querystring);
		if (initialLoad) {
			ctx.initialLoad = true;
		}
		yield (co.wrap(generator))(ctx);

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

	})
}

configureRoutes({
	get: page
}, func => {
	return appify(function* (ctx) {
		yield func.call(ctx);
	})
});

page.start();
