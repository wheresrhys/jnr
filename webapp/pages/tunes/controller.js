import {getAll} from '../../data/models/tunes';

export default async () => {
	ctx.controller = 'tunes';

	Object.assign(ctx.data, await getAll(ctx.query));
	ctx.data.q = ctx.query.q || '';
}