'use strict';
require('isomorphic-fetch');
const _ = require('lodash');
const log = console.log.bind(console);
const shell = require('shellpromise');
const fetchres = require('fetchres');
const tuneUpdates = [];
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
		repertoire: [],
		sessionId: rec.sessionId
	};
});

let sets = require('../mongo-export/sets').map(rec => {
	return {
		type: 'set',
		mongoId: rec._id.$oid,
		keys: rec.keys,
		name: rec.name,
		tuneIds: rec.tunes.map(t => t.$oid)
	};
});

let arrangements = require('../mongo-export/arrangements').map(rec => {
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


function createCouchPractice (mongoPractice, id, key, obj) {
	const practices = mongoPractice.lastPracticed && mongoPractice.lastPracticed.$date ? [{
		date: mongoPractice.lastPracticed.$date,
		urgency: mongoPractice.lastPracticeQuality === -1 ? 10 : mongoPractice.lastPracticeQuality === 1 ? 1 : 5
	}] : [];
	obj[id] = obj[id] || [];
	obj[id].push({
		practices: practices,
		key: key,
		tunebook: mongoPractice.tunebook
	});
}

let pieces = require('../mongo-export/pieces').reduce((obj, rec) => {
	if (rec.type === 'tune') {
		const tune = tunes.find(t => t.mongoId === rec.srcId.$oid)
		createCouchPractice(rec, rec.srcId.$oid, tune.keys[0], obj);
	} else {
		const set = sets.find(s => s.mongoId === rec.srcId.$oid)
		set.tuneIds.map((id, i) => {
			createCouchPractice(rec, id, set.keys[i], obj);
		})
	}

	return obj;
}, {});

let transitions = new Set();

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
		.then(res => res.json())
		.then(tunes => tunes.rows)
		.then(tunes => {

			Object.keys(pieces).forEach(tuneId => {

				const tuneDoc = tunes.find(t => t.doc.mongoId === tuneId).doc;
				tuneDoc.repertoire = _.uniq(pieces[tuneId], function(n) {
				  return n.tunebook + n.key
				});
				tuneUpdates.push(tuneDoc);
			})

			arrangements = arrangements.map(a => {
				a.tuneId = tunes.find(t => t.doc.mongoId === a.tuneId)._id;
				return a;
			})

			sets = sets.map(s => {

				s.tuneIds = s.tuneIds.map(id => tunes.find(t => t.doc.mongoId === id)._id);

				s.tunes = s.tuneIds.map((id, i) => {
					return {
						tuneId: tunes.find(t => t._id === id)._id,
						key: s.keys[i]
					}
				});

				delete s.tuneIds;
				delete s.mongoId;
				return s;
			})

			sets.map(s => s.tunes)
				.forEach(arr => arr.forEach((tuneObj, i) => {
					if (i > 0) {
						transitions.add([arr[i-1].tuneId, arr[i-1].key, tuneObj.tuneId, tuneObj.key].join('|'))
					}
				}));

			transitions = Array.from(transitions)
				.map(t => {
					t = t.split('|');
					// TODO add meter here too
					return {
						type: 'transition',
						from: {
							tuneId: t[0],
							key: t[1]
						},
						to: {
							tuneId: t[2],
							key: t[3]
						}
					}
				});


		})
		.then(() => fetch(`${process.env.POUCHDB_HOST}/_bulk_docs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({docs: tuneUpdates.concat(sets, arrangements, transitions)})
		}))
		.catch(log)
	)


