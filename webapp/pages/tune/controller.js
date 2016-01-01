import {db} from '../../data/index';
import {getTune} from '../../data/models/tune';
import isBrowser from '../../lib/is-browser';

export default function *() {
	this.controller = 'tune';

	Object.assign(this.data, yield getTune(this.params.tuneId))

	this.data.arrangement = this.data.tune.arrangement;

	if (this.data.tune.sessionId) {
		const arrangementsCount = this.data.alternateArrangements.length;
		if (arrangementsCount > 1) {
			this.data.paginate = true;
			if ('arrangement' in this.query) {
				const arrangementIndex = this.query.arrangement % arrangementsCount;
				this.data.arrangement = this.data.alternateArrangements[arrangementIndex];
				this.data.nextArrangement = (arrangementIndex + 1) % arrangementsCount;
				this.data.arrangementIndex = arrangementIndex;
				this.data.unsaved = true;
			} else {
				this.data.nextArrangement = 0;
			}

		}
	}
}

export function* api () {
	Object.assign(this.data, yield getTune(this.params.tuneId))
	if ('arrangement' in this.request.body) {
		this.data.tune.arrangement = this.data.alternateArrangements[this.request.body.arrangement];
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