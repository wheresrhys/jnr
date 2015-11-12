'use strict';

const mappings = {
	home: ['/'],
	learn: ['/learn', '/learn/:tunebook'],
	rehearse: ['/rehearse', '/rehearse/:tunebook'],
	tunes: ['/tunes', '/tunes/:action/:tuneId'],
	sets: ['/sets', '/sets/:action/:tuneId']
};

module.exports = {
	mappings: mappings,
	configureRoutes: function (router, controllers) {
		for(let name in mappings) {
			mappings[name].forEach(pattern => {
				router.get(pattern, controllers[name]);
			});
		}
	}
};
