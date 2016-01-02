import tunes from './tunes/controller';
import tune from './tune/controller';
import scheduler from './scheduler/controller';
import home from './home/controller';
import transition from './transition/controller';

const controllers = {
	scheduler: scheduler,
	tunes: tunes,
	tune: tune,
	home: home,
	transition: transition
};

const routeMappings = {
	scheduler: ['/scheduler'],
	tunes: ['/tunes'],
	tune: ['/tunes/:tuneId', '/tunes/:tuneId/:action'],
	home: ['/'],
	transition: ['/transition']
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
