import {db} from '../../data/index';
import {getTune} from '../../data/models/tune';
import {abcFromTune} from '../../lib/abc';
import isBrowser from '../../lib/is-browser';

export default function *() {
	this.controller = 'tune';

	this.data.tune = yield getTune(this.params.tuneId);

	if (this.data.tune.isFromTheSession) {
		const settingsCount = this.data.tune.settings.length;
		if (settingsCount > 1) {
			this.data.paginate = true;
			if ('setting' in this.query) {
				const settingIndex = this.query.setting % settingsCount;
				this.data.nextSetting = (settingIndex + 1) % settingsCount;
				this.data.settingIndex = settingIndex;
				this.data.abc = this.data.tune.getAbc(settingIndex);
			} else {
				this.data.abc = this.data.tune.getAbc();
				this.data.nextSetting = 0;
			}
		} else {
			this.data.abc = this.data.tune.getAbc();
		}
	} else {
		this.data.abc = this.data.tune.getAbc();
	}
}

export function* api () {
	this.data.tune = yield getTune(this.params.tuneId);
	if ('setting' in this.request.body) {
		this.data.tune.setting = this.data.tune.settings[this.request.body.settingIndex];
		yield db.put(this.data.tune)
			.then(() => {
				this.response.redirect(this.request.header.referer);
			})
	} else if ('urgency' in this.request.body) {
		const practices = this.data.tune.settings[this.request.body.settingIndex].practices;
		practices.unshift({
			date: new Date().toISOString(),
			urgency: this.request.body.urgency
		})
		if (practices.length > 5) {
			practices.pop();
		}
		yield db.put(this.data.tune)
			.then(() => {
				this.response.redirect(this.request.header.referer);
			})
	} else if ('learn' in this.request.body) {
		this.data.tune.settings.push({
			key: this.request.body.key,
			practices: [{
				date: new Date().toISOString(),
				urgency: 10
			}]
		});
		yield db.put(this.data.tune)
			.then(() => {
				this.response.redirect(this.request.header.referer);
			})
	}

};