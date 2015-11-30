import {query, db} from '../pouch/index';

export function buildSet (set, tunes, transitions, tunesPerSet) {

	if (set.length >= tunesPerSet) {
		return set;
	}

	let nextTune = transitions.find(tr => tr.from.id === set[set.length -1]._id)

	if (nextTune) {
		nextTune = tunes.find(t => t._id === nextTune.to.id);
		if (nextTune) {
			set.push(tunes.splice(tunes.indexOf(nextTune), 1)[0]	)
		}
	}

	if (set.length >= tunesPerSet) {
		return set;
	}

	let prevTune = transitions.find(tr => tr.to.id === set[0]._id)
	if (prevTune) {
		prevTune = tunes.find(t => t._id === prevTune.from.id);
		if (prevTune) {
			set.unshift(tunes.splice(tunes.indexOf(prevTune), 1)[0])
		}
	}

	if (nextTune || prevTune) {
		return buildSet(set, tunes, transitions, tunesPerSet);
	}

	if (set.length === 1) {
		let currentTune = set[set.length -1];
		nextTune = tunes.find(t => t.meters[0] === currentTune.meters[0]);
		if (nextTune) {
			set.push(tunes.splice(tunes.indexOf(nextTune), 1)[0])
			return buildSet(set, tunes, transitions, tunesPerSet);
		}
	}
	return set;
}
import co from 'co';

export function* buildSets (tunes, setCount, tunesPerSet) {
	let t = Date.now();
	const transitions = yield query('tune-derivatives', {
		include_docs: true,
		keys: tunes.map(t => t._id)
	})
		.then(recs => recs.filter(rec => rec.type === 'transition'))
	const sets = [];
	while (tunes.length && sets.length <= setCount) {

		sets.push(buildSet([tunes.shift()], tunes, transitions, tunesPerSet))

	}
	return sets;
}