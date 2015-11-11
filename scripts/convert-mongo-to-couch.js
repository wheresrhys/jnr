'use strict';
require('isomorphic-fetch');

const log = console.log.bind(console)
const shell = require('shellpromise');
const fetchres = require('fetchres');

const tunes = require('../mongo-export/tunes').map(rec => {
	return {
		type: 'tune',
		mongoId: rec._id.$oid,
		abc: rec.abc,
		abcId: rec.abcId.$oid,
		arrangements: rec.arrangements.map(a => a.$oid),
		author: rec.author,
		keys: rec.keys,
		meters: rec.meters,
		name: rec.name,
		oldId: rec.oldId && rec.oldId.$oid,
		quality: rec.quality,
		rhythms: rec.rhythms,
		sessionId: rec.sessionId
	};
});

const sets = require('../mongo-export/sets').map(rec => {
	return {
		type: 'set',
		mongoId: rec._id.$oid,
		keys: rec.keys,
		name: rec.name,
		tuneIds: rec.tunes.map(t => t.$oid)
	};
});

const arrangements = require('../mongo-export/arrangements').map(rec => {
	return {
		type: 'arrangement',
		abc: rec.abc,
		author: rec.author,
		meter: rec.meter,
		mode: rec.mode,
		rhythm: rec.rhythm,
		root: rec.root,
		tuneId: rec.tune.$oid,
		variants: rec.variants
	}
});

const pieces = require('../mongo-export/pieces').reduce((arr, rec) => {
	if (rec.type === 'tune') {
		arr.push({
			type: 'piece',
			practices: [{
				date: rec.lastPracticed && rec.lastPracticed.$date,
				urgency: rec.lastPracticeQuality === -1 ? 10 : rec.lastPracticeQuality === 1 ? 1 : 5
			}],
			tuneId: rec.srcId.$oid,
			tunebook: rec.tunebook
		})
	} else {
		arr = arr.concat(sets.find(s => s.mongoId === rec.srcId.$oid).tuneIds.map((t, i) => {
			return {
				type: 'piece',
				practices: [{
					date: rec.lastPracticed && rec.lastPracticed.$date,
					urgency: rec.lastPracticeQuality === -1 ? 10 : rec.lastPracticeQuality === 1 ? 1 : 5
				}],
				tuneId: t,
				tunebook: rec.tunebook
			}
		}))
	}

	return arr;
}, []);

shell(`curl -X DELETE ${process.env.POUCHDB_HOST}`)
	.then(() => shell(`curl -X PUT ${process.env.POUCHDB_HOST}`))
	.then(() => fetch(`${process.env.POUCHDB_HOST}/_bulk_docs`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({docs: tunes})
	}))
	.then(() => fetch(`${process.env.POUCHDB_HOST}/_all_docs?include_docs=true`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json'
			}
		})
		.then(fetchres.json)
		.then(tunes => tunes.rows.map(t => t.doc)))
		.then(tunes => {
			//pieces mongoIds => newIds
			pieces = pieces.map(p => {
				p.tuneId = tunes.find(t => t.mongoId === p.tuneId)._id;
				return p;
			})
			arrangements = arrangements.map(a => {
				a.tuneId = tunes.find(t => t.mongoId === a.tuneId)._id;
				return a;
			})
			sets = sets.map(s => {
				s.tuneIds = s.tuneIds.map(id => tunes.find(t => t.mongoId === id)._id);
				delete s.mongoId;
				return s;
			})
		})
		.then(() => fetch(`${process.env.POUCHDB_HOST}/_bulk_docs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({docs: pieces.concat(sets, arrangements)})
		})
		.catch(log))


