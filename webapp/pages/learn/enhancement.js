import {db} from '../../pouch/index';
import {render} from '../../lib/abc-dom';
import {composeABC} from '../../lib/abc';
import {getSetCollection} from './controller';

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

	del.on('mousedown', '.concealer', function (ev) {
		const input = ev.target.nextElementSibling;
		let increasing = input.value < 9;
		ev.target.oscillator = setInterval(() => {
			input.value = Number(input.value) + (increasing ? 0.5 : -0.5);
			if (input.value == 1) {
				increasing = true;
			}
			if (input.value == 10) {
				increasing = false;
			}
		}, 30);
	});

	del.on('mouseup', '.concealer', function (ev) {
		ev.target.oscillator && clearInterval(ev.target.oscillator);
		ev.target.nextElementSibling.dispatchEvent(new Event('change', {bubbles: true}))
	});

	del.on('change', '[name="practiceQuality"]', function (ev) {
		const container = getContainer(ev.target);
		container.parentNode.removeChild(container);
		const tuneId = getTuneId(ev.target);
		db.get(tuneId)
			.then(tune => {
				tune.repertoire[ev.target.parentNode.querySelector('[name="repertoireIndex"]').value].practices.unshift({
					date: new Date().toISOString(),
					urgency: ev.target.value
				});
				if (tune.repertoire.length > 5) {
					tune.repertoire.pop();
				}
				db.put(tune);
			});
		co.wrap(getSetCollection)(1, [tuneId].concat(Array.from(rootEl.querySelectorAll('[data-tune-id]')).map(el => el.dataset.tuneId)))
			.then(sets => {
				templateLoader.render(`components/set/tpl.html`, {
					set: sets[0]
				}, (err, res) => {
					document.querySelector('main ul').insertAdjacentHTML('beforeend', res);
				});
			});
	});

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
