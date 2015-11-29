import {query, db} from '../../pouch/index';

function buildSet (set, tunes, transitions) {

	if (set.length >= 4) {
		return set;
	}

	let nextTune = transitions.find(tr => tr.from.tuneId === set[set.length -1]._id)

	if (nextTune) {
		nextTune = tunes.find(t => t._id === nextTune.to.tuneId);
		if (nextTune) {
			set.push(tunes.splice(tunes.indexOf(nextTune), 1)[0]	)
		}
	}

	if (set.length >= 4) {
		return set;
	}

	let prevTune = transitions.find(tr => tr.to.tuneId === set[0]._id)
	if (prevTune) {
		prevTune = tunes.find(t => t._id === prevTune.from.tuneId);
		if (prevTune) {
			set.unshift(tunes.splice(tunes.indexOf(prevTune), 1)[0])
		}
	}

	if (nextTune || prevTune) {
		return buildSet(set, tunes, transitions);
	}

	if (set.length === 1) {
		let currentTune = set[set.length -1];
		nextTune = tunes.find(t => t.rhythm === currentTune.rhythm);
		if (nextTune) {
			set.push(tunes.splice(tunes.indexOf(nextTune), 1)[0])
			return buildSet(set, tunes, transitions);
		}

	}
	return set;

}

export default function *controller () {
	this.controller = 'learn';
	const tunes = yield query('learn', {
		include_docs: true,
		limit: 200,
		startkey: ["wheresrhys:mandolin"],
		endkey: ["wheresrhys:mandolin", {}]
	})
	const transitions = yield query('tune-derivatives', {
		include_docs: true,
		keys: tunes.map(t => t._id)
	})
		.then(recs => recs.filter(rec => rec.type === 'transition'))

	this.data.sets = [];
	while (tunes.length && this.data.sets.length < 15) {
		this.data.sets.push(buildSet([tunes.shift()], tunes, transitions))
	}
}