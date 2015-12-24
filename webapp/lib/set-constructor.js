import {query, db} from '../pouch/index';

function getRepertoire (tune, key) {
	for(let i = 0; i < tune.repertoire.length; i++) {
		if (tune.repertoire[i].key === key) {
			return i
		}
	}
}

function findAdjacentTune (direction, tuneContainer, transitions, tunes) {
	let transition;
	const toInspect = direction === 'next' ? 'from' : 'to';
	const toReturn = direction === 'next' ? 'to' : 'from';
	if (tuneContainer.key) {
		transition = transitions.find(tr => tr[toInspect].id === tuneContainer.tune._id && tr[toInspect].key === tuneContainer.key);
	} else {
		transition = transitions.find(tr => tr[toInspect].id === tuneContainer.tune._id);
	}

	if (transition) {
		const tune = tunes.find(t => t._id === transition[toReturn].id);
		if (tune) {
			tunes.splice(tunes.indexOf(tune), 1);
			if (!tuneContainer.key) {
				tuneContainer.key = transition[toInspect].key
				tuneContainer.repertoireIndex = getRepertoire(tuneContainer.tune, transition[toInspect].key)
			}
			return {
				tune: tune,
				key: transition[toReturn].key,
				repertoireIndex: getRepertoire(tune, transition[toReturn].key)
			}
		}
	}
};

function rescueSet (set, tunes, transitions, tunesPerSet) {
	const currentTune = set[set.length -1];

	currentTune.repertoireIndex = 0;
	currentTune.key = currentTune.tune.repertoire[0].key;

	const tune = tunes.find(t => t.meter === currentTune.tune.meter && t.repertoire.length);
	tunes.splice(tunes.indexOf(tune), 1);

	set.push({
		tune: tune,
		key: tune.repertoire[0].key,
		repertoireIndex: 0
	})

	return buildSet(set, tunes, transitions, tunesPerSet);

}

export function buildSet (set, tunes, transitions, tunesPerSet) {
	if (set.length >= tunesPerSet) {
		return set;
	}

	let nextTune = findAdjacentTune('next', set[set.length -1], transitions, tunes);

	if (nextTune) {
		set.push(nextTune);
	}

	if (set.length >= tunesPerSet) {
		return set;
	}

	let prevTune = findAdjacentTune('prev', set[0], transitions, tunes);

	if (prevTune) {
		set.unshift(prevTune)
	}

	if (nextTune || prevTune) {
		return buildSet(set, tunes, transitions, tunesPerSet);
	}

	if (set.length === 1) {
		return rescueSet(set, tunes, transitions, tunesPerSet);
	}

	return set;
}

export function* buildSets (tunes, setCount, tunesPerSet) {
	const transitions = yield query('tune-derivatives', {
		include_docs: true,
		keys: tunes.map(t => t._id)
	})
		.then(recs => recs.filter(rec => rec.type === 'transition'))
	const sets = [];
	while (tunes.length && sets.length < setCount) {

		sets.push(buildSet([{
			tune: tunes.shift(),
			key: null
		}], tunes, transitions, tunesPerSet))

	}
	return sets;
}