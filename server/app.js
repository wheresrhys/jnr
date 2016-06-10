// Set up some useful global utilities
global.log = console.log.bind(console);
global.logErr = (err) => {
	log(err);
	throw err;
};

import 'isomorphic-fetch';

// create a koa app and initialise the database
import Koa from 'koa';
const app = new Koa();
const convert = require('koa-convert');

// handle errors
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		log(err);
		log(ctx);
	}
});

// static assets
import serve from 'koa-static';
import mount from 'koa-mount';
app.use(serve('public'));

// enable dynamic template loading in dev
if (process.env !== 'production') {
	app.use(mount('/templates', serve('webapp')));
}

// templating and global setup
import {model as nav} from '../webapp/components/nav/model';
import nunjucks from 'nunjucks';
nunjucks.configure('webapp', { autoescape: true });

app.use(async (ctx, next) => {
	// useful bits and pieces for the view
	ctx.data = {
		nav: nav,
		pouchHost: process.env.POUCHDB_HOST,
		user: 'wheresrhys',
		renderWrapper: true,
		currentUrl: ctx.request.url
	};

	await next();

	ctx.body = nunjucks.render(`pages/${ctx.controller}/${ctx.params && ctx.params.action ? ctx.params.action + '/' : ''}tpl.html`, ctx.data);
	ctx.type = 'text/html';
});

// routing
import qs from 'koa-qs';
import koaRouter from 'koa-router';
import {configureRoutes} from '../webapp/pages';

qs(app);
const router = koaRouter();

configureRoutes(router, func => {
	return async (ctx, next) => {
		await func(ctx);
		await next();
	}
});

import {api as tuneApi} from '../webapp/pages/tune/controller'
import {api as settingApi} from '../webapp/pages/setting/controller'

const apiControllers = {
	tune: async (ctx, next) => {
		await tuneApi(ctx);
	},
	setting: async (ctx, next) => {
		await settingApi(ctx);
	}
};

import bodyParser from 'koa-bodyparser';

const apiMappings = {
	tune: ['/tunes/:tuneId'],
	setting: ['/settings/:settingId']
};

for (let name in apiMappings) {
	if (apiControllers[name]) {
		apiMappings[name].forEach(pattern => {
			router.post('/api' + pattern, bodyParser(), apiControllers[name]);
		});
	}
}

app
	.use(router.routes())
	.use(router.allowedMethods())

import {init} from '../webapp/data';

init()
	.then(() => app.listen(process.env.PORT || 3001, function () {
		console.log(`listening on ${process.env.PORT || 3001}`);
	}))
	.catch(logErr);