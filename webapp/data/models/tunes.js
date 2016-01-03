import {query} from '../index';

let tunesFetch;
let allTunes = {
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
				t.id = 'thesession:' + t.id
			});
			return query('tunes', {include_docs: true})
				.then(existingTunes => {
					existingTunes.forEach(tune => {
						const reducedTune = {
							id: tune._id,
							name: tune.name,
							type: tune.type
						};
						if (!tunes.some((t, i) => {
							if (t.name.replace(/^(The|Y) /, '') > reducedTune.name.replace(/^(The|Y) /, '')) {
								tunes.splice(i, 0, reducedTune);
								return true;
							}
						})) {
							tunes.push(reducedTune)
						}
					});
					return tunes;
				});
		})
		.then(tunes => {
			allTunes.all = tunes;
			tunesFetch = null;
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

	return updateTunes()
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


