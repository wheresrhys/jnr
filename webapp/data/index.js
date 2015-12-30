import PouchDB from 'pouchdb';
import * as tunes from './indexes/tunes';
import * as transitions from './indexes/transitions';
import * as learn from './indexes/learn';
import * as rehearse from './indexes/rehearse';
import * as improve from './indexes/improve';
import isBrowser from '../lib/is-browser';

const indexes = {
	'transitions': transitions,
	'tunes': tunes,
	'learn': learn,
	'rehearse': rehearse,
	'improve': improve
};

let pouch;

if (isBrowser) {
	pouch = new PouchDB('jnr', {adapter: 'websql'});
	if (!pouch.adapter) { // websql not supported by this browser
		pouch = new PouchDB('jnr');
	}
	PouchDB.sync('jnr', `${location.protocol}//${location.hostname}:5984/jnr`, {
		push: {
			live: true
		}
	});
} else {
	pouch = new PouchDB(process.env.POUCHDB_HOST);
}

export const db = pouch;

export function init () {
	return Promise.all(Object.keys(indexes).map(createIndex))
		.then(() => db)
		.catch(logErr);
}

export function createIndex (indexName) {
	if (indexes[indexName].isInitialised) {
		return Promise.resolve();
	}
	return db.put(indexes[indexName].ddoc).catch(function (err) {
		if (err.status !== 409) {
			throw err;
		}
	})
		.then(() => indexes[indexName].isInitialised = true);
}

export function query (indexName, options) {
	return createIndex(indexName)
		.then(() => db.query(`${indexName}/index`, options))
		.then(data => {
			if (options && options.include_docs) {
				return data.rows.map(r => r.doc);
			} else {
				return data.rows;
			}
		})
}

let allTunes;
// TODO - should maintain an in memory cache of tunes,
// tunes last updated should be stateless on server but stateful in the browser
let tunesLastUpdated;

export function updateTunes () {
	if (allTunes && Date.now() - tunesLastUpdated < 1000 * 60 * 10) {
		return Promise.resolve(allTunes);
	}

	tunesLastUpdated = Date.now();
	const firstPage = fetch('https://thesession.org/members/61738/tunebook?format=json')
		.then(res => res.json())

	return firstPage
		.then(json => {
			if (json.pages > 100) {
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
			return query('tunes')
				.then(existingTunes => existingTunes.reduce((obj, tune) => {
					obj[tune.id] = true;
					return obj;
				}, {}))
				.then(existingTunesMap => {
					return tunes
						.filter(t => {
							return !existingTunesMap['session:' + t.id]
						})
				})
		})
		.then(tunes => Promise.all(tunes.map(tune => {
			return fetch(`https://thesession.org/tunes/${tune.id}?format=json`)
				.then(res => res.json());
		})))
		.then(tunes => {
			allTunes = tunes;
			console.log(tunes[0])
			return tunes
		})
}

export function getTunes () {
	return updateTunes();
}

// import textSearch from '../lib/search';
// export function search (docType, field) {
//   return createIndex(indexName)
//     .then(() => db.query(`${docType}/index`, {
//       include_docs: true
//     }))
//     .then()
// }