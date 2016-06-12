import {query, db} from '../../data/index';

const configs = {
	remind: {
		tunePoolSize: 120,
		descending: false,
		setsToReturn: 10,
		tunesPerSet: 4,
		dismissable: true
	},
	learn: {
		tunePoolSize: 8,
		descending: true,
		setsToReturn: 8,
		tunesPerSet: 1
	},
	improve: {
		tunePoolSize: 100,
		descending: false,
		setsToReturn: 8,
		tunesPerSet: 3,
		dismissable: true
	}
}

function findAdjacentTune (direction, setting, opts) {
	const toInspect = direction === 'next' ? 'from' : 'to';
	const toReturn = direction === 'next' ? 'to' : 'from';
	const transition = opts.transitions.find(tr => tr[toInspect].id === setting.tuneId && tr[toInspect].key === setting.key);

	if (transition) {
		const setting = opts.settings.find(setting => setting.tuneId === transition[toReturn].id && transition[toReturn].key === setting.key);
		if (setting) {
			return setting;
		}
	}
};

function rescueSet (set, opts) {
	const setting = opts.settings.shift();
	setting.isNewTransition = true;
	set.push(setting)
	return buildSet(set, opts);
}

export function buildSet (set, opts) {
	if (set.length >= opts.tunesPerSet) {
		return set;
	}

	let nextTune = findAdjacentTune('next', set[set.length - 1], opts);

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

export const buildSets = async (opts) => {
	opts.transitions = await query('transitions', {
		include_docs: true,
		// Don't bother filtering by setting key here
		// In the browser performance is about half as good compared to just getting all transitions
		// and running Array.find against the whole set
		// keys: settings.map(t => t._id)
	})

	// simplest case - just return settings wrapped in set container
	if (opts.tunesPerSet === 1) {
		return opts.settings.slice(0, opts.setCount).map(setting => {
			return {
				dismissable: opts.dismissable,
				tunes: [setting]
			};
		})
	}

	const sets = [];

	while (opts.settings.length && sets.length < opts.setCount) {

		sets.push({
			dismissable: opts.dismissable,
			tunes: buildSet([opts.settings.shift()], opts)
		})
	}
	return sets;
}

export const getSetCollection = async (ordering, number, excludedTunes) => {
	const config = configs[ordering];
	let settings = await query(ordering, {
		include_docs: true,
		limit: config.tunePoolSize,
		descending: config.descending
	});
	if (excludedTunes) {
		settings = settings.filter(setting => excludedTunes.indexOf(setting.tuneId) === -1)
	}
	return buildSets({
		settings,
		setCount: number || config.setsToReturn,
		tunesPerSet: config.tunesPerSet,
		dismissable: config.dismissable
	});
}

export function getSetFromTune(tuneId, length) {
	if (length > 1) {
		throw 'unsupported';
	}
	return query('learn', {
		key: tuneId,
		include_docs: true,
		limit: 1
	})
		.then(tunes => {
			return buildSets({
				settings: tunes,
				setCount: 1,
				tunesPerSet: length
			})
				.then(sets => sets[0])
		})


}