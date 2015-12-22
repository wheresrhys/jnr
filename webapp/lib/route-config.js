'use strict';

export const routeMappings = {
	home: ['/'],
	learn: ['/learn', '/learn/:tunebook'],
	rehearse: ['/rehearse', '/rehearse/:tunebook'],
	tunes: ['/tunes'],
	tune: ['/tunes/:tuneId', '/tunes/:tuneId/:action'],
	thesession: ['/thesession-proxy/:tuneId']
};

export function configureRoutes(router, controllers) {
	for(let name in routeMappings) {
		if (controllers[name]) {
			routeMappings[name].forEach(pattern => {
				router.get(pattern, controllers[name]);
			});
		}
	}
}


