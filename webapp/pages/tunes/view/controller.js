import isBrowser from '../../../lib/is-browser';
const sessionUrl = isBrowser ? '/thesession-proxy/' : 'https://thesession.org/tunes/';

const cache = {};

export default function *controller () {

	console.log(this.data.tune)
	this.data.arrangement = this.data.tune.arrangement;

	if (this.data.tune.sessionId) {
		fetch(`${sessionUrl}${this.data.tune.sessionId}?format=json`)
			.then(res => res.json())
			.then(json => {
				cache[this.data.tune.sessionId] = json.settings
			})
	}
}