import {db} from '../../data/index';
import {getTune} from '../../data/models/tune';
import {create} from '../../data/models/setting';
import {abcFromTune} from '../../lib/abc';
import isBrowser from '../../lib/is-browser';

export default async (ctx) => {
	ctx.controller = 'tune';

	ctx.data.tune = await getTune(ctx.params.tuneId);
	if (ctx.query.key) {
		ctx.data.tune.settings = ctx.data.tune.settings.filter(s => {
			return s.key.indexOf(ctx.query.key) === 0;
		});
	}
	ctx.data.settingIndex = ctx.query.setting || 1 ;
	if (ctx.data.tune.settings.length > 1) {
		ctx.data.paginate = true;
		ctx.data.nextSettingQuery = '?setting=' + ((ctx.data.settingIndex % ctx.data.tune.settings.length) + 1);
		if (ctx.query.key) {
			ctx.data.nextSettingQuery+= '&key=' + ctx.query.key;
		}
		ctx.data.abc = ctx.data.tune.getAbc(ctx.data.settingIndex - 1);
	} else {
		ctx.data.abc = ctx.data.tune.getAbc();
	}

	ctx.data.isActive = ctx.data.tune.isActiveInKeys && ctx.data.tune.isActiveInKeys.indexOf(ctx.data.abc.key) > -1
}

export const api = async () => {
	ctx.data.tune = await getTune(ctx.params.tuneId);
	if ('learn' in ctx.request.body) {
		await create(ctx.data.tune, ctx.request.body.key, ctx.request.body.settingIndex)
			.then(() => {
				ctx.response.redirect(ctx.request.header.referer);
			})
	}

};