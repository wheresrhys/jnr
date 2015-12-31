import {db} from '../../data/index';
import isBrowser from '../../lib/is-browser';
import {decomposeABC,decomposeKey} from '../../lib/abc';

const cache = {};

function *getArrangements (tune) {

	if (!tune.sessionId) {
		return Promise.resolve([])
	}

	if (cache[tune.sessionId]) {
		return Promise.resolve(cache[tune.sessionId]);
	}

	return fetch(`https://thesession.org/tunes/${tune.sessionId}?format=json`)
		.then(res => res.json())
		.then(json => {
			cache[tune.sessionId] = json.settings.map(setting => Object.assign(decomposeABC(setting.abc), decomposeKey(setting.key)));
			return cache[tune.sessionId];
		})
		.catch(() => []);
}

function *getFullTune (tuneId) {
	const tune = yield db.get(tuneId);
	return {
		tune: tune,
		alternateArrangements: yield getArrangements(tune)
	}
}

export default function *() {
	this.controller = 'tune';

	Object.assign(this.data, yield getFullTune(this.params.tuneId))

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
	Object.assign(this.data, yield getFullTune(this.params.tuneId))
	if ('arrangement' in this.request.body) {
		this.data.tune.arrangement = this.data.alternateArrangements[this.request.body.arrangement];
		yield db.put(this.data.tune)
			.then(() => {
				this.response.redirect(this.request.header.referer);
			})
	} else if ('practiceQuality' in this.request.body) {
		this.data.tune.settings[this.request.body.settingIndex].practices.unshift({
			date: new Date().toISOString(),
			urgency: this.request.body.practiceQuality
		})
		if (this.data.tune.settings.length > 5) {
			this.data.tune.settings.pop();
		}
		yield db.put(this.data.tune)
			.then(() => {
				this.response.redirect(this.request.header.referer);
			})
	}

};