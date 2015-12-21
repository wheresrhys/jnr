import isBrowser from '../../../lib/is-browser';
const sessionUrl = isBrowser ? '/thesession-proxy/' : 'https://thesession.org/tunes/';

const cache = {};

export default function *controller () {
	const arrangementsCount = this.data.tune.arrangements.length;
	if (arrangementsCount) {
		const arrangementIndex = this.query.arrangement ? this.query.arrangement % arrangementsCount: 0;
		this.data.arrangement = this.data.tune.arrangements[arrangementIndex];
		this.data.nextArrangement = (arrangementIndex + 1) % arrangementsCount;
	} else {
		this.data.arrangement = this.data.tune.arrangements[0];
	}
	if (this.data.tune.sessionId) {
		fetch(`${sessionUrl}${this.data.tune.sessionId}?format=json`)
			.then(res => res.json())
			.then(json => {
				cache[this.data.tune.sessionId] = json.settings
			})
	}
}