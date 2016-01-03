import {getSetCollection} from '../../components/set/model';
import {init as initPracticers} from '../../components/practicer/enhancement';
import {init as initSets} from '../../components/set/enhancement';
import co from 'co';

function getContainer (el) {
	while (!el.classList.contains('set')) {
		el = el.parentNode;
	}
	return el;
}

export default function (del) {

	initPracticers(del);
	initSets(del);

	del.on('tune.practiced', '.practicer', ev => {
		const container = getContainer(ev.target);

		if (this.data.orderBy !== 'learn') {
			if (container.querySelector('.practicer:not([data-practiced])')) {
				return;
			}
		}

		container.parentNode.removeChild(container);

		co.wrap(getSetCollection)(this.data.orderBy, 1, [ev.detail.tuneId].concat(Array.from(del.rootEl.querySelectorAll('[data-tune-id]')).map(el => el.dataset.tuneId)))
			.then(sets => {
				templateLoader.render(`components/set/tpl.html`, {
					set: sets[0]
				}, (err, res) => {
					document.querySelector('.set-list').insertAdjacentHTML('beforeend', res);
				});
			});
	})
}