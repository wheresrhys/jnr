'use strict';

const PouchDB = require('PouchDB');

const app = require('koa')();
const router = require('koa-router')();
const db = new PouchDB(process.env.POUCHDB_HOST);

const configureRoutes = require('../webapp/lib/configure-routes');

const serve = require('koa-static');

app.use(serve('webapp'));

app.use(function *(next) {
	this.html = `<!doctype html>
  <script src="/jspm_packages/system.js"></script>
  <script src="/config.js"></script>
  <script>
    System.import('main.js');
  </script>
  <a href='/tunes'>tunes</a>
  <a href='/learn'>learn</a>
  <a href='/rehearse'>rehearse</a>
  <a href='/sets'>sets</a>`
  yield next;
})

const controllers = {
	root: function *(next) {
	  this.body = this.html + 'Hello World: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ');
	},
	learn: function *(next) {
	  this.body = this.html + 'learn: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ');
	},
	rehearse: function *(next) {
	  this.body = this.html + 'rehearse: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ');
	},
	tunes: function *(next) {
	  this.body = this.html + 'tunes: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ');
	},
	sets: function *(next) {
	  this.body = this.html + 'sets: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ');
	}
};

configureRoutes(router, controllers);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);