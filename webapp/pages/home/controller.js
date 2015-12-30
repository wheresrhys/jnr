import {query, db} from '../../pouch/index';

import {getSetCollection} from '../../components/set/model';

export default function *() {
	this.controller = 'home';
	this.data.orderBy = this.query.order || 'rehearse';
	const listTypes = ['learn', 'improve', 'rehearse'];
	const lists = yield listTypes.map(function *(type) {
		return yield getSetCollection(type, 2)
	});

	this.data.lists = lists.map((list, i) => {
		return {
			orderBy: listTypes[i],
			sets: list
		}
	})
}

