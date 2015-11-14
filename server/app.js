// Set up some useful global utilities
global.log = console.log.bind(console);
global.logErr = (err) => {
	log(err);
	throw err;
};

// create a koa app and initialise the database
import koa from 'koa';
const app = koa();
import * as pouch from '../webapp/pouch';
const db = pouch.db;

// static assets
import serve from 'koa-static';
app.use(serve(process.env.WEB_ROOT || 'webapp'));

// dump out useful global config
app.use(function *(next) {
	this.data = {
		user: 'wheresrhys'
	};
	yield next;
});

// routing
import koaRouter from 'koa-router';
const router = koaRouter();
import {routeMappings, configureRoutes} from '../webapp/lib/route-config';

app.use(function *(next) {
	this.data.nav = routeMappings;
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

pouch.init()
	.then(() => app.listen(3000));