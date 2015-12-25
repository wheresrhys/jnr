import {query, db} from '../../pouch/index';

import {buildSets} from '../../lib/set-constructor';

export default function *() {
	this.controller = 'rehearse';
	this.data.sets = yield getSetCollection();
}

export function* getSetCollection (number, excludedTunes) {
	let tunes = yield query('rehearse', {
		include_docs: true,
		limit: 120,
		descending: false,
		startkey: ["mandolin"],
		endkey: ["mandolin", {}]
	});

	if (excludedTunes) {
		tunes = tunes.filter(t => excludedTunes.indexOf(t._id) === -1)
	}
	return yield buildSets(tunes, number || 10, 4);
}
