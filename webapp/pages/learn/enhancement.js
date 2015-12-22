import {db} from '../../pouch/index';
import {render} from '../../lib/abc-dom';
import {composeABC} from '../../lib/abc';

const rootEl = document.querySelector('main');

export default function (context, del) {
	console.log(context);
	del.on('click', '.tune__render', function (ev) {
		ev.preventDefault();
		const tuneId = ev.target.dataset.tuneId;
		db.get(tuneId)
			.then(tune => {
				const scoreEl = ev.target.parentNode.querySelector('.tune__score');
				render(ev.target.parentNode.querySelector('.tune__score'), composeABC(tune), true);
				rootEl.dispatchEvent(new CustomEvent('clearScore', {
					detail: {
						ignoreEl: scoreEl
					}
				}))
			})



		// context.data.tune.arrangement = context.data.alternateArrangements[ev.target.dataset.arrangementIndex];
		// db.put(context.data.tune);
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
