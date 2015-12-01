import {query, db} from '../../pouch/index';

import {buildSets} from '../../lib/set-constructor';

export default function *controller () {
	this.controller = 'learn';
	const tunes = yield query('learn', {
		include_docs: true,
		limit: 150,
		descending: true,
		startkey: ["mandolin", {}],
		endkey: ["mandolin"]
	})
	this.data.sets = yield buildSets(tunes, 8, 2);
}