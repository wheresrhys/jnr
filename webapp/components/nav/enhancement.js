import {model} from './model';
const navContainer = document.querySelector('.nav');

export function updateNav (ctx) {
	const current = navContainer.querySelector('[data-current]');
	for(let link in model) {
		if (model[link].pattern.test(ctx.path)) {
			const next = navContainer.querySelector(`[data-nav-link=${link}]`);
			if (next !== current) {
				current.removeAttribute('data-current');
				next.setAttribute('data-current', '');
			}
			return;
		}
	}
}