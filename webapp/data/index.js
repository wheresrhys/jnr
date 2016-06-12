// TODO: http://pouchdb.com/2014/06/17/12-pro-tips-for-better-code-with-pouchdb.html


import PouchDB from 'pouchdb';
import * as transitions from './indexes/transitions';
import * as learn from './indexes/learn';
import * as remind from './indexes/remind';
import * as improve from './indexes/improve';
import * as settings from './indexes/settings';
import isBrowser from '../lib/is-browser';

const indexes = {
	transitions: transitions,
	learn: learn,
	remind: remind,
	improve: improve,
	settings: settings
};

let pouch;

if (isBrowser) {
	pouch = new PouchDB('jnr', {adapter: 'websql'});
	// websql not supported by this browser - fallback to indexDB
	if (!pouch.adapter) {
		pouch = new PouchDB('jnr');
	}

	if (pouch.adapter) {
		PouchDB.sync('jnr', window.pouchHost || `${location.protocol}//${location.hostname}:5984/jnr`, {
			push: {
				live: true
			}
		});
	} else {
		// websql and indexDB not supported by this browser - fallback to online only
	  pouch = new PouchDB(window.pouchHost || `${location.protocol}//${location.hostname}:5984/jnr`)
	}
} else {
	pouch = new PouchDB(process.env.POUCHDB_HOST);
}

function testOfflineDb() {
	//handle iOS chrome bug
	return pouch.put({test: true})
		.then(() => true)
		.catch(() => {
			pouch = new PouchDB(window.pouchHost || `${location.protocol}//${location.hostname}:5984/jnr`);
			return false;
		})
}

export function db () {
	return pouch;
}

export function init () {
	return isBrowser ? testOfflineDb() : Promise.resolve(true)
		.then(createIndices => {
			if (!createIndices) {
				return pouch;
			}
			return Promise.all(Object.keys(indexes).map(createIndex))
				.then(() => pouch)
				.catch(logErr);
		});
}

export function createIndex (indexName) {
	if (indexes[indexName].isInitialised) {
		return Promise.resolve();
	}
	return db().put(indexes[indexName].ddoc).catch(function (err) {
		if (err.status !== 409) {
			throw err;
		}
	})
}

export function query (indexName, options) {
	return createIndex(indexName)
		.then(() => db().query(`${indexName}/index`, options))
		.then(data => {
			if (options && options.include_docs) {
				return data.rows.map(r => r.doc);
			} else {
				return data.rows;
			}
		})
}