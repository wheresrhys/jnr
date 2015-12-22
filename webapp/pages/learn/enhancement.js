import {db} from '../../pouch/index';
import {render} from '../../lib/abc-dom';
import {composeABC} from '../../lib/abc';
import {getSetCollection} from './controller';
import {init as initTuneRaters} from '../../components/tune-rater/index'
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

export default function (context, del) {

	initTuneRaters(del);

	del.on('click', '.tune__render', function (ev) {
		ev.preventDefault();
		db.get(getTuneId(ev.target))
			.then(tune => {
				const scoreEl = ev.target.parentNode.querySelector('.tune__score');
				render(ev.target.parentNode.querySelector('.tune__score'), composeABC(tune), true);
				rootEl.dispatchEvent(new CustomEvent('clearScore', {
					detail: {
						ignoreEl: scoreEl
					}
				}))
			})
	});

	del.on('tune.practiced', '.tune-rater', function (ev) {
		const container = getContainer(ev.target);
		container.parentNode.removeChild(container);
		co.wrap(getSetCollection)(1, [ev.detail.tuneId].concat(Array.from(rootEl.querySelectorAll('[data-tune-id]')).map(el => el.dataset.tuneId)))
			.then(sets => {
				templateLoader.render(`components/set/tpl.html`, {
					set: sets[0]
				}, (err, res) => {
					document.querySelector('main ul').insertAdjacentHTML('beforeend', res);
				});
			});
	})

	del.on('clearScore', function (ev) {
		Array.from(rootEl.querySelectorAll('.tune__score'))
			.forEach(el => {
				if (el !== ev.detail.ignoreEl) {
					el.innerHTML = '';
					el.removeAttribute('style');
				}
			})
	});
}
