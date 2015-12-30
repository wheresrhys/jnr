import {getSetCollection} from './controller';
import {init as initTuneRaters} from '../../components/tune-rater/enhancement';
import {init as initSets} from '../../components/set/enhancement';
import co from 'co';

const rootEl = document.querySelector('main');

function getContainer (el) {
	while (el.nodeName.toUpperCase() !== 'LI') {
		el = el.parentNode;
	}
	return el;
}

function getTuneId (el) {
	while (!el.dataset.tuneId) {
		el = el.parentNode;
	}
	return el.dataset.tuneId;
}

export default function (del) {

	initTuneRaters(del);
	initSets(del);

	// del.on('tune.practiced', '.tune-rater', ev => {
	// 	const container = getContainer(ev.target);

	// 	if (this.data.orderBy === 'rehearse') {
	// 		ev.target.setAttribute('data-practiced', '');

	// 		if (container.querySelector('.tune-rater:not([data-practiced])')) {
	// 			return;
	// 		}
	// 	}

	// 	container.parentNode.removeChild(container);
	// 	co.wrap(getSetCollection)(this.data.orderBy, 1, [ev.detail.tuneId].concat(Array.from(rootEl.querySelectorAll('[data-tune-id]')).map(el => el.dataset.tuneId)))
	// 		.then(sets => {
	// 			templateLoader.render(`components/set/tpl.html`, {
	// 				set: sets[0]
	// 			}, (err, res) => {
	// 				document.querySelector('.set-list').insertAdjacentHTML('beforeend', res);
	// 			});
	// 		});
	// })

	del.on('score.rendered', '.set__tune-score', ev => {
		Array.from(rootEl.querySelectorAll('.set__tune-score'))
			.forEach(el => {
				if (el !== ev.detail.manuscript) {
					el.innerHTML = '';
					el.removeAttribute('style');
				}
			})
	});
}