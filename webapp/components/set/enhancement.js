import {db} from '../../data/index';
import {practice} from '../../data/models/tune';
import {render} from '../../lib/abc-dom';
import {composeABC} from '../../lib/abc';

function getContainer (el) {
	while (!el.classList.contains('set')) {
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


export function init (del) {

	del.on('click', '.set__dismiss', function (ev) {
		ev.preventDefault();
		const container = getContainer(ev.target)
		Array.from(container.querySelectorAll('.tune-rater')).map(el => {
			practice(getTuneId(el), el.querySelector('[name="repertoireIndex"]').value, 3);
		});
		container.parentNode.removeChild(container);
	});

	del.on('click', '.set__tune-render', function (ev) {
		ev.preventDefault();
		db.get(getTuneId(ev.target))
			.then(tune => {
				const container = getContainer(ev.target);
				const manuscript = container.querySelector('.set__tune-score')
				render(manuscript, composeABC(tune.arrangement, tune), true);
				container.dispatchEvent(new CustomEvent('score.rendered', {
					bubbles: true,
					detail: {
						manuscript: manuscript
					}
				}))
			})
	});
}