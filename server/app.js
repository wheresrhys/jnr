'use strict';

const PouchDB = require('PouchDB');

const app = require('koa')();
const router = require('koa-router')();
const db = new PouchDB(process.env.POUCHDB_HOST);

// const routeConfig =
const routeConfig = require('../shared/route-config');

const controllers = {
	root: function *(next) {
	  this.body = 'Hello World: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ');
	},
	learn: function *(next) {
	  this.body = 'learn: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ');
	},
	rehearse: function *(next) {
	  this.body = 'rehearse: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ');
	},
	tunes: function *(next) {
	  this.body = 'tunes: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ');
	},
	sets: function *(next) {
	  this.body = 'sets: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' ');
	}
};

for(let name in routeConfig) {
	routeConfig[name].forEach(pattern => {
		router.get(pattern, controllers[name]);
	});
}

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);