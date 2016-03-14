// Set up some useful global utilities
global.log = console.log.bind(console);
global.logErr = (err) => {
	log(err);
	throw err;
};

import 'isomorphic-fetch';
// create a koa app and initialise the database
import koa from 'koa';
const app = koa();

// static assets
import serve from 'koa-static';
import mount from 'koa-mount';
app.use(serve('public'));

// enable dynamic template loading in dev
if (process.env !== 'production') {
	app.use(mount('/templates', serve('webapp')));
}

// dump out useful global config
app.use(function *(next) {
	this.data = {
		user: 'wheresrhys',
		renderWrapper: true,
		currentUrl: this.request.url
	};
	yield next;
});

// routing
import qs from 'koa-qs';
qs(app);
import koaRouter from 'koa-router';
const router = koaRouter();

import {configureRoutes} from '../webapp/pages';
import {model as nav} from '../webapp/components/nav/model';

app.use(function *(next) {
	this.data.nav = nav;
	yield next;
});

configureRoutes(router, func => {
	return function *(next) {
		yield func.call(this);
		yield next
	}
});

import {api as tuneApi} from '../webapp/pages/tune/controller'
import {api as settingApi} from '../webapp/pages/setting/controller'
const apiControllers = {
	tune: function *(next) {
		yield tuneApi.call(this);
	},
	setting: function *(next) {
		yield settingApi.call(this);
	}
};

import bodyParser from 'koa-bodyparser';

const apiMappings = {
	tune: ['/tunes/:tuneId'],
	setting: ['/settings/:settingId']
};

for(let name in apiMappings) {
	if (apiControllers[name]) {

		apiMappings[name].forEach(pattern => {
			router.post('/api' + pattern, bodyParser(), apiControllers[name]);
		});
	}
}

app
	.use(router.routes())
	.use(router.allowedMethods())

// templating
import nunjucks from 'nunjucks';
nunjucks.configure('webapp', { autoescape: true });

app
	.use(function *(next) {
		this.body = nunjucks.render(`pages/${this.controller}/${this.params && this.params.action ? this.params.action + '/' : ''}tpl.html`, this.data);
		this.type = 'text/html';
	})

import {init} from '../webapp/data';

init()
	.then(() => app.listen(3000, function () {
		console.log(`listening on ${3000}`);
	}));