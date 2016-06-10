import {query, db} from '../../data/index';

import {getSetCollection} from '../../components/set/model';

export default async (ctx) => {
	ctx.controller = 'home';
	const listTypes = ['learn', 'improve', 'remind'];
	const lists = await Promise.all(listTypes.map(type => getSetCollection(type, 2)));

	ctx.data.lists = lists.map((list, i) => {
		return {
			orderBy: listTypes[i],
			id: `set-list--${listTypes[i]}`,
			sets: list
		}
	})
}

