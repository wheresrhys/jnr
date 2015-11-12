'use strict';

const PouchDB = require('PouchDB');

const app = require('koa')();
const router = require('koa-router')();
const db = new PouchDB(process.env.POUCHDB_HOST);

const serve = require('koa-static');
app.use(serve('webapp'));

const configureRoutes = require('../webapp/lib/configure-routes');

const controllers = {
	root: function *(next) {
	  this.data = {page: 'Hello World: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ')};
	  this.tpl = 'root';
	  yield next
	},
	learn: function *(next) {
	  this.data = {page: 'learn: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ')};
	  this.tpl = 'learn';
	  yield next
	},
	rehearse: function *(next) {
	  this.data = {page: 'rehearse: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ')};
	  this.tpl = 'rehearse';
	  yield next
	},
	tunes: function *(next) {
	  this.data = {page: 'tunes: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ')};
	  this.tpl = 'tunes';
	  yield next
	},
	sets: function *(next) {
	  this.data = {page: 'sets: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ')};
	  this.tpl = 'sets';
	  yield next
	}
};

configureRoutes(router, controllers);

app
  .use(router.routes())
  .use(router.allowedMethods())

const marko = require('marko');

app
  .use(function *(next) {
	  this.body = marko.load(`./webapp/views/pages/${this.tpl}.marko`).stream(this.data);
	  this.type = 'text/html';
	})

app.listen(3000);