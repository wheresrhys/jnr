import {query, db} from '../../pouch/index';

import {buildSets} from '../../lib/set-constructor';

export default function *() {
	this.controller = 'scheduler';
	this.data.orderBy = this.query.order || 'rehearse';
	this.data.sets = yield getSetCollection(this.data.orderBy);
}

const orderingConfigs = {
	rehearse: {
		tunesToFetch: 120,
		descending: false,
		setsToReturn: 10,
		tunesPerSet: 4
	},
	learn: {
		tunesToFetch: 8,
		descending: true,
		setsToReturn: 8,
		tunesPerSet: 1
	},
	improve: {
		tunesToFetch: 100,
		descending: false,
		setsToReturn: 8,
		tunesPerSet: 2
	}
}

export function* getSetCollection (ordering, number, excludedTunes) {
	const config = orderingConfigs[ordering];
	let tunes = yield query(ordering, {
		include_docs: true,
		limit: config.tunesToFetch,
		descending: config.descending
	});

	if (excludedTunes) {
		tunes = tunes.filter(t => excludedTunes.indexOf(t._id) === -1)
	}
	return yield buildSets(tunes, number || config.setsToReturn, config.tunesPerSet);
}
