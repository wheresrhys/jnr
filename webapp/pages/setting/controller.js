import {query, db} from '../../data/index';

export const api = async(ctx) => {
	ctx.data.setting = await db.get(ctx.params.settingId);

	if ('urgency' in ctx.request.body) {
		const practices = ctx.data.setting.practices;
		practices.unshift({
			date: new Date().toISOString(),
			urgency: ctx.request.body.urgency
		})
		if (practices.length > 5) {
			practices.pop();
		}
		await db.put(ctx.data.setting)
			.then(() => {
				ctx.response.redirect(ctx.request.header.referer);
			})
	}

};