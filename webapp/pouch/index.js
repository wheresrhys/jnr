import PouchDB from 'pouchdb';
import * as t from './indexes/tunes';
import * as tr from './indexes/transitions';
import * as l from './indexes/learn';
import * as r from './indexes/rehearse';
import isBrowser from '../lib/is-browser';

const indexes = {
	'transitions': tr,
	'tunes': t,
	'learn': l,
	'rehearse': r
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

export function updateTunes () {
	const firstPage = fetch('https://thesession.org/members/61738/tunebook?format=json')
		.then(res => res.json())

	firstPage
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
		.then(newTunes => {
			console.log(newTunes);
			query('tunes')
				.then(existingTunes => existingTunes.reduce((obj, tune) => {
					obj[tune.id] = true;
					return obj;
				}, {}))
				.then(existingTunesMap => {
					newTunes
						.filter(t => {
							return !existingTunesMap['session:' + t.id]
						})
						.forEach(t => {
							// get from session
							// put in pot
						})
				})
		})
}
// import textSearch from '../lib/search';
// export function search (docType, field) {
//   return createIndex(indexName)
//     .then(() => db.query(`${docType}/index`, {
//       include_docs: true
//     }))
//     .then()
// }


// // save the design doc
// db.put(ddoc).catch(function (err) {
//   if (err.status !== 409) {
//     throw err;
//   }
//   // ignore if doc already exists
// }).then(function () {
//   // find docs where title === 'Lisa Says'
//   return db.query('index', {
//     key: 'Lisa Says',
//     include_docs: true
//   });
// }).then(function (result) {
//   // handle result
// }).catch(function (err) {
//   console.log(err);
// });