'use strict';

export const routeMappings = {
	home: ['/'],
	learn: ['/learn', '/learn/:tunebook'],
	rehearse: ['/rehearse', '/rehearse/:tunebook'],
	tunes: ['/tunes', '/tunes/:action/:tuneId'],
	sets: ['/sets', '/sets/:action/:tuneId']
};

export function configureRoutes(router, controllers) {
	for(let name in routeMappings) {
		routeMappings[name].forEach(pattern => {
			router.get(pattern, controllers[name]);
		});
	}
}
