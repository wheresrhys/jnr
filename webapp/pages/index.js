import tunes from './tunes/controller';
import tune from './tune/controller';
import scheduler from './scheduler/controller';

const controllers = {
	scheduler: scheduler,
	tunes: tunes,
	tune: tune
};

const routeMappings = {
	scheduler: ['/scheduler'],
	tunes: ['/tunes'],
	tune: ['/tunes/:tuneId', '/tunes/:tuneId/:action']
};

export function configureRoutes(router, wrapper) {
	for(let name in routeMappings) {
		if (controllers[name]) {
			const controller = wrapper(controllers[name]);
			routeMappings[name].forEach(pattern => {
				router.get(pattern, controller);
			});
		}
	}
}
