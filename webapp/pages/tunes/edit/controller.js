
export default function *controller () {
	const arrangementsCount = this.data.tune.arrangements.length;
	const arrangementIndex = this.query.arrangement ? this.query.arrangement % arrangementsCount: 0;
	this.data.arrangementIndex = arrangementIndex || 0;
	if (arrangementsCount) {
		this.data.arrangement = this.data.tune.arrangements[arrangementIndex];
		this.data.nextArrangement = (arrangementIndex + 1) % arrangementsCount;
	} else {
		this.data.arrangement = this.data.tune.arrangements[0];
	}
	if (this.data.tune.sessionId) {
		fetch(`https://thesession.org/tunes/${this.data.tune.sessionId}?format=json`)
			.then(res => res.json())
			.then(log)
	}
}