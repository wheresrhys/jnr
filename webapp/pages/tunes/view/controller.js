
export default function *controller () {
	const arrangementsCount = this.data.tune.arrangements.length;
	if (arrangementsCount) {
		const arrangementIndex = this.query.arrangement ? this.query.arrangement % arrangementsCount: 0;
		this.data.arrangement = this.data.tune.arrangements[arrangementIndex];
		this.data.nextArrangement = (arrangementIndex + 1) % arrangementsCount;
	} else {
		this.data.arrangement = this.data.tune.arrangements[0];
	}
}