import {db, query} from '../index';

let activeTunes = {};
let tunesFetch;
let allTunes = {
	active: [],
	inactive: [],
	all: []
};

// TODO - should maintain an in memory cache of tunes,
// tunes last updated should be stateless on server but stateful in the browser
let tunesLastUpdated = 0;
export function updateTunes () {
	if (tunesFetch) {
		return tunesFetch;
	}

	if (allTunes.all.length && Date.now() - tunesLastUpdated < 1000 * 60 * 10) {
		return Promise.resolve();
	}

	tunesLastUpdated = Date.now();
	const firstPage = fetch('https://thesession.org/members/61738/tunebook?format=json')
		.then(res => res.json())

	return tunesFetch = firstPage
		.then(json => {
			if (json.pages > 1) {
				return Promise.all(
					[firstPage].concat(
						Array.from({length: json.pages - 1})
							.map((v, i) => {
								return fetch('https://thesession.org/members/61738/tunebook?format=json&page=' + (i + 2))
									.then(res => res.json())
									.catch(logErr)
							})
						)
				)
					.then(arr => arr.reduce((arr, json) => {
						return arr.concat(json.tunes)
					}, []))
			} else {
				return json.tunes;
			}
		})
		.then(tunes => {
			tunes.forEach(t => {
				t.id = 'session:' + t.id
			});
			return query('tunes', {include_docs: true})
				.then(existingTunes => existingTunes.reduce((obj, tune) => {
					if (!/^session:/.test(tune._id)) {
						const reducedTune = {
							id: tune._id,
							name: tune.name,
							type: tune.rhythm
						};
						if (!tunes.some((t, i) => {
							if (t.name.replace(/^(The|Y) /, '') > reducedTune.name.replace(/^(The|Y) /, '')) {
								tunes.splice(i, 0, reducedTune);
								return true;
							}
						})) {
							tunes.push(reducedTune)
						}

						if (tune.settings.length) {
							obj[tune._id] = true;
						}
					} else {
						obj[tune._id] = true;
					}
					return obj;
				}, {}))
				.then(existingTunesMap => {
					activeTunes = existingTunesMap;
					return tunes
				})
		})
		.then(tunes => {
			allTunes.all = tunes;
			allTunes.inactive = tunes.filter(t => {
				return !activeTunes[t.id]
			})
			allTunes.active = tunes.filter(t => {
				return activeTunes[t.id]
			})
			tunesFetch = null;
		})
}

export function getAll (opts) {
	opts = opts || {};
	return updateTunes()
		.then(() => {
			return opts.status ? allTunes[opts.status] : allTunes.all
		});
}

export function practice (tuneId, settingIndex, urgency) {

	return db.get(tuneId)
		.then(tune => {
			const practices = tune.settings[settingIndex].practices;

			practices.unshift({
				date: new Date().toISOString(),
				urgency: urgency
			});
			if (practices.length > 5) {
				practices.pop();
			}
			db.put(tune);
		});
}