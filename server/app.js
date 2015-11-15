// Set up some useful global utilities
global.log = console.log.bind(console);
global.logErr = (err) => {
	log(err);
	throw err;
};

// create a koa app and initialise the database
import koa from 'koa';
const app = koa();

// static assets
import serve from 'koa-static';
app.use(serve('public'));

// dump out useful global config
app.use(function *(next) {
	this.data = {
		user: 'wheresrhys'
	};
	yield next;
});


// routing
import qs from 'koa-qs';
qs(app);
import koaRouter from 'koa-router';
const router = koaRouter();
import {routeMappings, configureRoutes} from '../webapp/lib/route-config';
import pages from '../webapp/pages';

app.use(function *(next) {
	this.data.nav = routeMappings;
	yield next;
});

const controllers = {
	home: function *(next) {
		this.tpl = './pages/home/tpl.marko';
		yield next
	},
	learn: function *(next) {
		this.tpl = './pages/learn/tpl.marko';
		yield next
	},
	rehearse: function *(next) {
		this.tpl = './pages/rehearse/tpl.marko';
		yield next
	},
	tunes: function *(next) {
		yield pages.tunes.call(this);
		yield next
	},
	sets: function *(next) {
		this.tpl = './pages/sets/tpl.marko';
		yield next
	}
};

configureRoutes(router, controllers);

app
	.use(router.routes())
	.use(router.allowedMethods())

// templating
import marko from 'marko';

app
	.use(function *(next) {
		this.body = marko.load(`./webapp/layout.marko`).stream(this);
		this.type = 'text/html';
	})

import {init} from '../webapp/pouch';

init()
	.then(() => app.listen(3000));