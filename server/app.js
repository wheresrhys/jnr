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
		user: 'wheresrhys',
		renderWrapper: true
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
	this.data.nav = Object.assign({}, routeMappings);
	delete this.data.nav.tune;
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
	tune: function *(next) {
		yield pages.tune.call(this);
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
import {api as tuneApi} from '../webapp/pages/tune/controller'
const apiControllers = {
	tune: function *(next) {
		yield tuneApi.call(this);
	}
};

import bodyParser from 'koa-bodyparser';

const apiMappings = {
	tune: ['/tunes/:tuneId'],
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

import {init} from '../webapp/pouch';

init()
	.then(() => app.listen(3000, function () {
		console.log(`listening on ${3000}`);
	}));