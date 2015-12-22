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
app.use(serve(process.env.WEB_ROOT))

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
	},
	thesession: function *(next) {
		yield fetch(`https://thesession.org/tunes/${this.params.tuneId}?format=json`)
			.then(res => res.json())
			.then(json => {
				this.type = 'application/json';
				this.body = JSON.stringify(json);
			})
	}
};

configureRoutes(router, controllers);


import api from './api';
import bodyParser from 'koa-bodyparser';

const apiMappings = {
	tunes: ['/tunes/:action/:tuneId'],
};

const apiControllers = {
	tunes: function *(next) {
		yield pages.tunes.call(this, true);
		yield api.tunes.call(this);
	}
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
		this.body = nunjucks.render(`pages/${this.controller}/${this.params.action ? this.params.action + '/' : ''}page.tpl.html`, this.data);
		this.type = 'text/html';
	})

import {init} from '../webapp/pouch';

init()
	.then(() => app.listen(3000, function () {
		console.log(`listening on ${3000}`);
	}));