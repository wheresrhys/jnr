'use strict';

const PouchDB = require('PouchDB');

const app = require('koa')();
const router = require('koa-router')();
const db = new PouchDB(process.env.POUCHDB_HOST);

const serve = require('koa-static');
app.use(serve('webapp'));
app.use(function *(next) {
	this.data = {};
	yield next;
});

const routeConfig = require('../webapp/lib/route-config');

app.use(function *(next) {
	this.data.nav = routeConfig.mappings;
	yield next;
})



const controllers = {
	home: function *(next) {
	  this.data.tpl = 'home.marko';
	  yield next
	},
	learn: function *(next) {
	  this.data.tpl = 'learn.marko';
	  yield next
	},
	rehearse: function *(next) {
	  this.data.tpl = 'rehearse.marko';
	  yield next
	},
	tunes: function *(next) {
	  this.data.tpl = 'tunes.marko';
	  yield next
	},
	sets: function *(next) {
	  this.data.tpl = 'sets.marko';
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
	  this.body = marko.load(`./webapp/views/layout.marko`).stream(this.data);
	  this.type = 'text/html';
	})

app.listen(3000);