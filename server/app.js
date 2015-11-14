'use strict';
global.log = console.log.bind(console);
global.logErr = (err) => {
	log(err);
	throw err;
};

const app = require('koa')();
const router = require('koa-router')();
const pouch = require('../webapp/pouch');
const db = pouch.get();

const serve = require('koa-static');
app.use(serve('webapp'));
app.use(function *(next) {
	this.data = {
		user: 'wheresrhys'
	};
	yield next;
});

const routeConfig = require('../webapp/lib/route-config');

app.use(function *(next) {
	this.data.nav = routeConfig.mappings;
	yield next;
});

const controllers = {
	home: function *(next) {
	  this.tpl = 'home.marko';
	  yield next
	},
	learn: function *(next) {
	  this.tpl = 'learn.marko';
	  yield next
	},
	rehearse: function *(next) {
	  this.tpl = 'rehearse.marko';
	  yield next
	},
	tunes: function *(next) {
	  this.tpl = 'tunes.marko';
	  this.data.tunes = yield db.allDocs({include_docs: true})
	  	.then(data => data.rows
	  		.filter(t => t.doc.type === 'tune')
	  		.slice(0, 10)
	  		.map(t => t.doc)
	  	);
	  yield next
	},
	sets: function *(next) {
	  this.tpl = 'sets.marko';
	  yield next
	}
};

routeConfig.configureRoutes(router, controllers);

app
  .use(router.routes())
  .use(router.allowedMethods())

const marko = require('marko');

app
  .use(function *(next) {
	  this.body = marko.load(`./webapp/layout.marko`).stream(this);
	  this.type = 'text/html';
	})

pouch.init()
	.then(() => app.listen(3000));