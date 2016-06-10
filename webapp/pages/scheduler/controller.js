import {query, db} from '../../data/index';

import {getSetCollection} from '../../components/set/model';

export default async (ctx) => {
	ctx.controller = 'scheduler';
	ctx.data.list = {};
	ctx.data.list.orderBy = ctx.query.order || 'remind';
	ctx.data.list.id = `set-list--${ctx.data.list.orderBy}`;
	ctx.data.list.sets = await getSetCollection(ctx.data.list.orderBy);
}

