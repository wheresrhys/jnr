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

	del.on('mousedown', '.tune-rater__wrapper', function (ev) {
		const input = ev.target.nextElementSibling;
		const bar = ev.target.firstElementChild;
		const container = getContainer(ev.target);
		let increasing = input.value < 9;

		container.oscillator = setInterval(function () {
			input.value = Number(input.value) + (increasing ? 0.5 : -0.5);
			if (input.value == 1) {
				increasing = true;
			}
			if (input.value == 10) {
				increasing = false;
			}
			const badness = 1 - ((input.value - 1)/ 9);
			const hue = 120 * badness;
			const yellowDimming = 10;
			// by solving ax^2 + bx + c
			const luminescence = ((yellowDimming / 3600) * hue * hue) - ((yellowDimming / 30) * hue) + 50;
			bar.style.backgroundColor = `hsl(${hue}, 95%, ${luminescence}%)`;
			bar.style.transform = `translateX(-${100 * badness}%)`;
		}, 30);
	});

	del.on('mouseup', '.tune-rater__wrapper', function (ev) {
		const container = getContainer(ev.target);
		container.oscillator && clearInterval(container.oscillator);
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