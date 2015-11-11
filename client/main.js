'use strict';

const routeConfig = require('../shared/route-config');
const page = import default from 'page';

const configureRoutes = require('../shared/configure-routes');

const controllers = {
	root: function *(next) {
	  console.log('Hello World: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' '));
	},
	learn: function *(next) {
	  console.log('learn: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' '));
	},
	rehearse: function *(next) {
	  console.log('rehearse: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' '));
	},
	tunes: function *(next) {
	  console.log('tunes: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' '));
	},
	sets: function *(next) {
	  console.log('sets: ' + Object.keys(this.params).map(k => k + ':' + this.params[k]).join(' '));
	}
};

configureRoutes(page, controllers)

// document.body.addEventListener('click', function (ev) {
// 	var el = getInternalLink(ev.target)
// 	if (el) {
// 		if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) {
// 			return;
// 		}
// 		ev.preventDefault();
// 		router.navigate(el.getAttribute('href'), { trigger: true })
// 		return false;
// 	}
// });