// Set up some useful global utilities
global.log = console.log.bind(console);
global.logErr = (err) => {
	log(err);
	throw err;
};

// create a koa app and initialise the database
import Koa from 'koa';
const app = new Koa();
const convert = require('koa-convert');

// static assets
import serve from 'koa-static';
app.use(convert(serve(process.env.WEB_ROOT)));

// dump out useful global config
app.use(async (ctx, next) => {
	ctx.data = {
		user: 'wheresrhys'
	};
	await next;
});


// routing
import qs from 'koa-qs';
qs(app);
import koaRouter from 'koa-router';
const router = koaRouter();
import {routeMappings, configureRoutes} from '../webapp/lib/route-config';
import pages from '../webapp/pages';

app.use(async (ctx, next) => {
	ctx.data.nav = routeMappings;
	await next;
});

const controllers = {
	home: async (ctx, next) => {
		ctx.tpl = 'home/tpl.marko';
		console.log('asdasd')
		await next
	},
	learn: async (ctx, next) => {
		ctx.tpl = 'learn/tpl.marko';
		await next
	},
	rehearse: async (ctx, next) => {
		ctx.tpl = 'rehearse/tpl.marko';
		await next
	},
	tunes: async (ctx, next) => {
		await pages.tunes.call(ctx);
		await next
	},
	sets: async (ctx, next) => {
		ctx.tpl = 'sets/tpl.marko';
		await next
	}
};

configureRoutes(router, controllers);

app
	.use(convert(router.routes()))
	.use(convert(router.allowedMethods()))

// templating
import marko from 'marko';

app
	.use(async (ctx, next) => {
		ctx.body = marko.load(`./webapp/layout.marko`).stream(ctx);
		ctx.type = 'text/html';
	})

import {init} from '../webapp/pouch';

init()
	.then(() => app.listen(3000));