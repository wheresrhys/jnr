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
		yield pages.home.call(this);
		yield next
	},
	learn: function *(next) {
		yield pages.learn.call(this);
		yield next
	},
	rehearse: function *(next) {
		yield pages.rehearse.call(this);
		yield next
	},
	tunes: function *(next) {
		yield pages.tunes.call(this);
		yield next
	},
	sets: function *(next) {
		yield pages.sets.call(this);
		yield next
	}
};

configureRoutes(router, controllers);

app
	.use(router.routes())
	.use(router.allowedMethods())

// templating
import nunjucks from 'nunjucks';
nunjucks.configure('webapp', { autoescape: true });

app
	.use(function *(next) {
		this.body = nunjucks.render(this.tpl.replace('tpl.html', 'page.tpl.html'), this.data);
		this.type = 'text/html';
	})

import {init} from '../webapp/pouch';

init()
	.then(() => app.listen(3000));