import {query} from '../index';

let updatePromise;
export const allTunes = {
	all: [],
	activeIds: {}
};


function fetchTunes () {
	const firstPage = fetch('https://thesession.org/members/61738/tunebook?format=json')
		.then(res => res.json())

	return firstPage
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
				t.id = 'thesession:' + t.id
			});
			return tunes;
		})
}

// TODO - should maintain an in memory cache of tunes,
// tunes last updated should be stateless on server but stateful in the browser
let tunesLastUpdated = 0;

export function update () {
	if (updatePromise) {
		return updatePromise;
	}

	if (allTunes.all.length && Date.now() - tunesLastUpdated < 1000 * 60 * 10) {
		return Promise.resolve();
	}

	tunesLastUpdated = Date.now();

	const personalTunes = query('tunes', {include_docs: true})
		.then(existingTunes => {
			return existingTunes.map(tune => {
				return {
					id: tune._id,
					name: tune.name,
					type: tune.type
				};
			})
		});

	const activeTunes = query('settings', {include_docs: true})
		.then(settings => settings.length ? settings.reduce((obj, setting) => {
			_addSetting(obj, setting.tuneId, setting.key);
			return obj;
		}) : {})

	return updatePromise = Promise.all([fetchTunes(), personalTunes, activeTunes])
		.then(res => {
			const tunes = res[0];
			const personalTunes = res[1];
			const activeTunes = res[2];
			personalTunes.forEach(pt => {
				if (!tunes.some((t, i) => {
					if (t.name.replace(/^(The|Y) /, '') > pt.name.replace(/^(The|Y) /, '')) {
						tunes.splice(i, 0, pt);
						return true;
					}
				})) {
					tunes.push(pt)
				}
			});
			tunes.forEach(t => {
				t.isActive = !!activeTunes[t.id];
			});
			allTunes.all = tunes;
			allTunes.activeIds = activeTunes;
			updatePromise = null;
		})
}

function _addSetting (obj, tuneId, key) {
	obj[tuneId] = obj[tuneId] || [];
	obj[tuneId].push(key);
}

export function addSetting(tuneId, key) {
	return update()
		.then(() => {
			_addSetting(allTunes.activeIds, tuneId, key)
			allTunes.all.find(t => t.id === tuneId).isActive = true;
		})

}

import * as liquidMetal from 'liquidmetal';

function search (term, tunes) {

	if (term.length < 3)  {
		return tunes;
	} else {

		return tunes
			.filter(function (tune) {
				tune.score = liquidMetal.score(tune.name, term) > 0
				return tune.score > 0;
			})
			.sort(function(t1, t2) {
				return t1.score === t2.score ? 0 : t1.score > t2.score ? -1: 1
			});
	}


	return tunes;

}

export function getAll (opts) {
	opts = opts || {};
	const limit = opts.limit ? Number(opts.limit) : 15;
	const start = ((opts.page || 1) - 1) * limit;

	return update()
		.then(() => {
			let tunes = opts.status ? allTunes[opts.status] : allTunes.all;
			if (opts.q) {
				tunes = search(opts.q, tunes).slice(0, limit);
			} else {
				tunes = tunes.slice(start, start + limit);
			}
			return {
				tunes: tunes,
				pagination: {
					next: Number(opts.page || 1) + 1,
					prev: Number(opts.page || 1) - 1,
					perPage: limit
				}
			}
		});
}


