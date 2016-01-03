import {practice} from '../../data/models/setting';

function getContainer (el) {
	while (!el.classList.contains('practicer')) {
		el = el.parentNode;
	}
	return el;
}

function getSettingId (el) {
	return getContainer(el).dataset.settingId;
}

export function init (del) {

	del.on('mousedown', '.practicer__wrapper', function (ev) {
		const container = getContainer(ev.target);
		const input = container.querySelector('[name="urgency"]');
		const bar = container.querySelector('.practicer__bar');

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

	del.on('mouseup', '.practicer__wrapper', function (ev) {
		const container = getContainer(ev.target);
		container.oscillator && clearInterval(container.oscillator);
		const settingId = getSettingId(ev.target);
		container.setAttribute('data-practiced', '');
		container.dispatchEvent(new CustomEvent('tune.practiced', {
			bubbles: true,
			detail: {
				settingId: settingId
			}
		}))

		practice(settingId, container.querySelector('[name="urgency"]').value)

	});

}