import {getSetCollection} from '../set/model';
import {init as initPracticers} from '../practicer/enhancement';
import {init as initSets} from '../set/enhancement';
import {loader as templateLoader} from 'templates';

function getSetContainer (el) {
	while (!el.classList.contains('set')) {
		el = el.parentNode;
	}
	return el;
}

export function init (del, opts) {
	const setListEl = document.querySelector(`#${opts.id}`);
	initPracticers(del, {id: opts.id});
	initSets(del, {id: opts.id});
	del.on('tune.practiced', `#${opts.id} .practicer`, ev => {
		const container = getSetContainer(ev.target);

		if (container.querySelector('.practicer:not([data-practiced])')) {
			return;
		}

		container.parentNode.removeChild(container);

		getSetCollection(opts.orderBy, 1, [ev.detail.tuneId].concat(Array.from(del.rootEl.querySelectorAll('[data-tune-id]')).map(el => el.dataset.tuneId)))
			.then(sets => {
				templateLoader.render(`components/set/tpl.html`, {
					set: sets[0]
				}, (err, res) => {
					setListEl.insertAdjacentHTML('beforeend', res);
				});
			});
	})
}