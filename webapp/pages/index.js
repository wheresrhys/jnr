import tunes from './tunes/controller';
import tune from './tune/controller';
import rehearse from './rehearse/controller';
import learn from './learn/controller';
import home from './home/controller';

const pages = {
	tunes: tunes,
	tune: tune,
	rehearse: rehearse,
	learn: learn,
	home: home
};

export const routeMappings = {
	home: ['/'],
	learn: ['/learn', '/learn/:tunebook'],
	rehearse: ['/rehearse', '/rehearse/:tunebook'],
	tunes: ['/tunes'],
	tune: ['/tunes/:tuneId', '/tunes/:tuneId/:action']
};

export function configureRoutes(router, wrapper) {
	for(let name in routeMappings) {
		if (pages[name]) {
			const controller = wrapper(pages[name]);
			routeMappings[name].forEach(pattern => {
				router.get(pattern, controller);
			});
		}
	}
}
