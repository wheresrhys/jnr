import {query, db} from '../../pouch/index';

import {buildSets} from '../../lib/set-constructor';

export default function *() {
	this.controller = 'learn';
	this.data.sets = yield getSetCollection();
}


export function* getSetCollection (number, excludedTunes) {

	let tunes = yield query('learn', {
		include_docs: true,
		limit: 100,
		descending: true,
		startkey: ["mandolin", {}],
		endkey: ["mandolin"]
	})

	if (excludedTunes) {
		tunes = tunes.filter(t => excludedTunes.indexOf(t._id) === -1)
	}
	return yield buildSets(tunes, number || 8, 2);

}
