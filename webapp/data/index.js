// TODO: http://pouchdb.com/2014/06/17/12-pro-tips-for-better-code-with-pouchdb.html


import PouchDB from 'pouchdb';
import * as tunes from './indexes/tunes';
import * as transitions from './indexes/transitions';
import * as learn from './indexes/learn';
import * as remind from './indexes/remind';
import * as improve from './indexes/improve';
import * as settings from './indexes/settings';
import isBrowser from '../lib/is-browser';

const indexes = {
	transitions: transitions,
	tunes: tunes,
	learn: learn,
	remind: remind,
	improve: improve,
	settings: settings
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