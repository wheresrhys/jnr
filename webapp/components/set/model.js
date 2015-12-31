import {query, db} from '../../data/index';

const configs = {
	rehearse: {
		tunesToFetch: 120,
		descending: false,
		setsToReturn: 10,
		tunesPerSet: 4,
		dismissable: true
	},
	learn: {
		tunesToFetch: 8,
		descending: true,
		setsToReturn: 8,
		tunesPerSet: 1
	},
	improve: {
		tunesToFetch: 100,
		descending: false,
		setsToReturn: 8,
		tunesPerSet: 3
	}
}

function getRepertoire (tune, key) {
	for(let i = 0; i < tune.repertoire.length; i++) {
		if (tune.repertoire[i].key === key) {
			return i
		}
	}
}

function findAdjacentTune (direction, tuneContainer, opts) {
	let transition;
	const toInspect = direction === 'next' ? 'from' : 'to';
	const toReturn = direction === 'next' ? 'to' : 'from';
	if (tuneContainer.key) {
		transition = opts.transitions.find(tr => tr[toInspect].id === tuneContainer.tune._id && tr[toInspect].key === tuneContainer.key);
	} else {
		transition = opts.transitions.find(tr => tr[toInspect].id === tuneContainer.tune._id);
	}

	if (transition) {
		const tune = opts.tunes.find(t => t._id === transition[toReturn].id);
		if (tune) {
			opts.tunes.splice(opts.tunes.indexOf(tune), 1);
			if (!tuneContainer.key) {
				tuneContainer.key = transition[toInspect].key
				tuneContainer.repertoireIndex = getRepertoire(tuneContainer.tune, transition[toInspect].key)
			}
			return {
				tune: tune,
				key: transition[toReturn].key,
				repertoireIndex: getRepertoire(tune, transition[toReturn].key),
				dismissable: opts.dismissable
			}
		}
	}
};

function rescueSet (set, opts) {
	const currentTune = set[set.length -1];

	currentTune.repertoireIndex = 0;
	currentTune.key = currentTune.tune.repertoire[0].key;

	const tune = opts.tunes.find(t => t.meter === currentTune.tune.meter && t.repertoire.length);
	opts.tunes.splice(opts.tunes.indexOf(tune), 1);

	set.push({
		tune: tune,
		key: tune.repertoire[0].key,
		repertoireIndex: 0,
		dismissable: opts.dismissable
	})

	return buildSet(set, opts);

}

export function buildSet (set, opts) {
	if (set.length >= opts.tunesPerSet) {
		return set;
	}

	let nextTune = findAdjacentTune('next', set[set.length -1], opts);

	if (nextTune) {
		set.push(nextTune);
	}

	if (set.length >= opts.tunesPerSet) {
		return set;
	}

	let prevTune = findAdjacentTune('prev', set[0], opts);

	if (prevTune) {
		set.unshift(prevTune)
	}

	if (nextTune || prevTune) {
		return buildSet(set, opts);
	}

	if (set.length === 1) {
		return rescueSet(set, opts);
	}

	return set;
}

export function* buildSets (opts) {
	opts.transitions = yield query('transitions', {
		include_docs: true,
		// Don't bother filtering by tune key here
		// In the browser performance is about half as good compared to just getting all transitions
		// and running Array.find against the whole set
		// keys: tunes.map(t => t._id)
	})

	// simplest case - just return tunes wrapped in set container
	if (opts.tunesPerSet === 1) {
		return opts.tunes.slice(0, opts.setCount).map(tune => {
			return {
				dismissable: opts.dismissable,
				tunes: [{
					tune,
					key: tune.repertoire[0].key,
					repertoireIndex: 0,
				}]
			};
		})
	}

	const sets = [];

	while (opts.tunes.length && sets.length < opts.setCount) {

		sets.push({
			dismissable: opts.dismissable,
			tunes: buildSet([{
				tune: opts.tunes.shift(),
				key: null
			}], opts)
		})
	}
	return sets;
}

export function* getSetCollection (ordering, number, excludedTunes) {
	const config = configs[ordering];
	let tunes = yield query(ordering, {
		include_docs: true,
		limit: config.tunesToFetch,
		descending: config.descending
	});

	if (excludedTunes) {
		tunes = tunes.filter(t => excludedTunes.indexOf(t._id) === -1)
	}
	return yield buildSets({
		tunes,
		setCount: number || config.setsToReturn,
		tunesPerSet: config.tunesPerSet,
		dismissable: config.dismissable
	});
}