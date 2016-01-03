import {db} from '../../data/index';
import {getTune} from '../../data/models/tune';
import {abcFromTune} from '../../lib/abc';
import isBrowser from '../../lib/is-browser';

export default function *() {
	this.controller = 'tune';

	this.data.tune = yield getTune(this.params.tuneId);
	if (this.query.key) {
		this.data.tune.settings = this.data.tune.settings.filter(s => {
			return s.key.indexOf(this.query.key) === 0;
		});
	}
	if (this.data.tune.settings.length > 1) {
		this.data.paginate = true;
		this.data.settingIndex = this.query.setting || 1 ;
		this.data.nextSettingQuery = '?setting=' + ((this.data.settingIndex % this.data.tune.settings.length) + 1);
		if (this.query.key) {
			this.data.nextSettingQuery+= '&key=' + this.query.key;
		}
		this.data.abc = this.data.tune.getAbc(this.data.settingIndex - 1);
	} else {
		this.data.abc = this.data.tune.getAbc();
	}

	this.data.isActive = this.data.tune.isActiveInKeys.indexOf(this.data.abc.key) > -1
}

export function* api () {
	this.data.tune = yield getTune(this.params.tuneId);
	if ('learn' in this.request.body) {
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