import {query, db} from '../../data/index';

export function* api () {
	this.data.setting = yield db.get(this.params.settingId);

	if ('urgency' in this.request.body) {
		const practices = this.data.setting.practices;
		practices.unshift({
			date: new Date().toISOString(),
			urgency: this.request.body.urgency
		})
		if (practices.length > 5) {
			practices.pop();
		}
		yield db.put(this.data.setting)
			.then(() => {
				this.response.redirect(this.request.header.referer);
			})
	}

};