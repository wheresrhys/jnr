import {query, db} from '../../pouch/index';

import {buildSets} from '../../lib/set-constructor';

export default function *controller () {
	this.controller = 'rehearse';
	const tunes = yield query('learn', {
		include_docs: true,
		limit: 200,
		descending: false,
		startkey: ["mandolin"],
		endkey: ["mandolin", {}]
	})
	this.data.sets = yield buildSets(tunes, 20, 4);
}