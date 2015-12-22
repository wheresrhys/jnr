import isBrowser from '../../../lib/is-browser';
import {decomposeABC,decomposeKey} from '../../../lib/abc';
const sessionUrl = isBrowser ? '/thesession-proxy/' : 'https://thesession.org/tunes/';

const cache = {};

export default function *controller () {

	this.data.arrangement = this.data.tune.arrangement;

	if (this.data.tune.sessionId) {
		if (!cache[this.data.tune.sessionId]) {

			yield fetch(`${sessionUrl}${this.data.tune.sessionId}?format=json`)
				.then(res => res.json())
				.then(json => {
					cache[this.data.tune.sessionId] = json.settings.map(setting => Object.assign(decomposeABC(setting.abc), decomposeKey(setting.key)));
				});
		}
		this.data.alternateArrangements = cache[this.data.tune.sessionId] || [];

		const arrangementsCount = this.data.alternateArrangements.length;
		if (arrangementsCount) {
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