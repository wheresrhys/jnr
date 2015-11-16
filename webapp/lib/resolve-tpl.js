let templateMap;

export default function (path) {
	if (templateMap) {
		return templateMap[path];
	} else {
		return path;
	}

}

export function setMap (map) {
	templateMap = map;
}



// // const egg = 'hat';
// const marko = require('marko');
// const tpl = require('./pages/tunes/tpl.marko.js');
// var template = marko.load(tpl);
// document.querySelector('main').innerHTML = template.renderSync({ name: 'Frank' });
// console.log('chek')