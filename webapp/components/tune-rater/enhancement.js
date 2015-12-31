import {practice} from '../../data/models/tune';

function getContainer (el) {
	while (!el.classList.contains('tune-rater')) {
		el = el.parentNode;
	}
	return el;
}

function getTuneId (el) {
	return getContainer(el).dataset.tuneId;
}

export function init (del) {

	del.on('mousedown', '.tune-rater__concealer', function (ev) {
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

	del.on('mouseup', '.tune-rater__concealer', function (ev) {
		ev.target.oscillator && clearInterval(ev.target.oscillator);
		const container = getContainer(ev.target)
		const tuneId = getTuneId(ev.target);

		container.dispatchEvent(new CustomEvent('tune.practiced', {
			bubbles: true,
			detail: {
				tuneId: tuneId
			}
		}))

		practice(tuneId, container.querySelector('[name="settingIndex"]').value, container.querySelector('[name="practiceQuality"]').value)

	});

}