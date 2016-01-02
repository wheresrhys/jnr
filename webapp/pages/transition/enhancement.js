import {getAll, getTune} from '../../data/models/tune';
import querystring from 'querystring';

import {debounceCallback} from '../../lib/ui-utils';

function getPicker (el) {
	while (!el.classList.contains('setting-picker')) {
		el = el.parentNode;
	}
	return el;
}

function getTuneEl (el) {
	while (!el.classList.contains('setting-picker__tune')) {
		el = el.parentNode;
	}
	return el;
}

export default function (del) {
	del.on('keyup', '.setting-picker input[type="search"]', debounceCallback(ev => {
		const term = ev.target.value;
		const listContainer = ev.target.parentNode.querySelector('.tune-list');
		window.history.pushState({}, 'Search: ' + term, '/tunes?' + querystring.stringify(this.query));
		getAll({q: term, limit: 5})
			.then(tunes => {
				templateLoader.render(`pages/transition/tune-list.html`, {
					tunes: tunes.tunes
				}, (err, res) => {
					listContainer.innerHTML = res;
				});
			})
	}));

	del.on('click', '.select-tune', ev => {
		ev.preventDefault();
		const tune = getTuneEl(ev.target);
		const picker = getPicker(ev.target);
		const tuneId = tune.dataset.tuneId;
		getTune(tuneId)
			.then(tune => {
				picker.innerHTML = tune.tune.keys[0] + tuneId;
			})
		// then fetch tune details, get available keys and select one
		//
	});
}