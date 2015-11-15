import {query, db} from '../../pouch/index';
import view from './view/controller';

export default async (ctx) => {
	if (this.params.action) {
		ctx.tpl = `tunes/${ctx.params.action}/tpl.marko`;
		ctx.data.tune = await db.get(ctx.params.tuneId);
		// await view.call(ctx);
	} else {
		ctx.tpl = 'tunes/tpl.marko';
		ctx.data.tunes = await query('tunes', {
			include_docs: true,
			limit: ctx.query.limit || 10,
			skip: ctx.query.page ? (ctx.query.limit || 10) * ctx.query.page : 0
		})
				.catch(logErr)
				.then(data => data.rows
					.map(t => t.doc)
				)
	}
}