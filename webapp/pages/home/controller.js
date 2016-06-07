import {query, db} from '../../data/index';

import {getSetCollection} from '../../components/set/model';

export default function *() {
	this.controller = 'home';
	const listTypes = ['learn', 'improve', 'remind'];
	const lists = yield listTypes.map(function *(type) {
		return yield getSetCollection(type, 2)
	});

	this.data.lists = lists.map((list, i) => {
		return {
			orderBy: listTypes[i],
			id: `set-list--${listTypes[i]}`,
			sets: list
		}
	})
}

