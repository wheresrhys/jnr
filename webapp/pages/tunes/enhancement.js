import view from './view/enhancement';

export default function (ev, del) {
	if (ev.params.action) {
		if (ev.params.action === 'view') {
			view(ev, del);
		}
	}
}