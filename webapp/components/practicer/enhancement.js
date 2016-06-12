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

export function init (del, opts) {
	del.on('click', `#${opts.id} .practicer`, function (ev) {
		const container = getContainer(ev.target);
		const input = container.querySelector('[name="urgency"]');
		const settingId = getSettingId(ev.target);
		const score = Math.round(20 * (ev.clientX - container.offsetLeft) / container.clientWidth) / 2;

		input.value = score;

		container.setAttribute('data-practiced', '');
		container.dispatchEvent(new CustomEvent('tune.practiced', {
			bubbles: true,
			detail: {
				settingId: settingId
			}
		}))

		practice(settingId, input.value)

	});

}