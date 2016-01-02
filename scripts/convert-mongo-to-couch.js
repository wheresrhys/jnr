'use strict';

require('babel-core/register')({
	plugins:['transform-es2015-modules-commonjs']
});
require('isomorphic-fetch');
const _ = require('lodash');
const log = console.log.bind(console);
const shell = require('shellpromise');

const decomposeABC = require('../webapp/lib/abc').decomposeABC;

const dates = [
	new Date().toISOString(),
	new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
	new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
	new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
	new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
	new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
]

function createCouchPractice (opts) {
	if (opts.practice.tunebook !== 'wheresrhys:mandolin') {
		return;
	}

	const practices = opts.practice.lastPracticed && opts.practice.lastPracticed.$date ? [{
		date: dates[Math.floor(Math.random() * 6)],
		urgency: opts.practice.lastPracticeQuality === -1 ? 10 : opts.practice.lastPracticeQuality === 1 ? 1 : 5
	}] : [];

	opts.obj[opts.tuneId] = opts.obj[opts.tuneId] || [];
	opts.obj[opts.tuneId].push({
		practices: practices,
		key: opts.key,
		abc: opts.abc,
		name: opts.name,
		tuneId: opts.tuneId
	});

}


// only create tunes for non session
// mirror structure of thesession

const mongoTunes = require('../mongo-export/tunes')

let tunes = mongoTunes
	.filter(rec => !rec.sessionId)
	.map(rec => {

		return {
			_id: `user-61738:${rec._id.$oid}`,
			name: rec.name,
			docType: 'tune',
			type: rec.rhythms[0],
			tunebooks: 1,
			aliases: [],
			settings: [
				{
					key: rec.keys[0],
					abc: decomposeABC(rec.abc).abc
				}
			],
			mongoId: rec._id.$oid
		};
	});

let sets = require('../mongo-export/sets').map(s => {
	return {
		docType: 'set',
		mongoId: s._id.$oid,
		name: s.name,
		tunes: s.tunes.map((t, i) => {
			const tune = mongoTunes.find(rec => rec._id.$oid === t.$oid);
			return {
				id: tune.sessionId ? `thesession:${tune.sessionId}`: `user-61738:${tune._id.$oid}`,
				$oid: t.$oid,
				key: s.keys[i]
			}
		})
	};
});

let settings = require('../mongo-export/pieces').reduce((obj, rec) => {
	if (rec.type === 'tune') {
		const tune = mongoTunes.find(tune => tune._id.$oid === rec.srcId.$oid)
		createCouchPractice({
			practice: rec,
			tuneId: tune.sessionId ? `thesession:${tune.sessionId}`: `user-61738:${tune._id.$oid}`,
			key: tune.keys[0],
			abc: tune.abc,
			name: tune.name,
			obj: obj
		});

	} else {
		const set = sets.find(s => s.mongoId === rec.srcId.$oid)
		set.tunes.map(tune => {
			const mongoTune = mongoTunes.find(rec => rec._id.$oid === tune.$oid)
			createCouchPractice({
				practice: rec,
				tuneId: tune.id,
				key: tune.key,
				abc: mongoTune.abc,
				name: mongoTune.name,
				obj: obj
			});
		})
	}
	return obj;
}, {});


settings = Object.keys(settings).reduce((arr, tuneId) => {
	return arr.concat(settings[tuneId])
}, [])

settings.forEach(s => {
	s._id = `${s.tuneId}|${s.key}`;
});

settings = _.uniq(settings, '_id');

let transitions = new Set();

sets.map(s => s.tunes)
	.forEach(arr => arr.forEach((tuneObj, i) => {
		if (i > 0) {
			transitions.add([arr[i-1].id, arr[i-1].key, tuneObj.id, tuneObj.key].join('|'))
		}
	}));

transitions = Array.from(transitions)
	.map(t => {
		const tunes = t.split('|');
		return {
			_id: t,
			type: 'transition',
			from: {
				id: tunes[0],
				key: tunes[1]
			},
			to: {
				id: tunes[2],
				key: tunes[3]
			}
		}
	});


shell(`curl -X DELETE ${process.env.POUCHDB_HOST}`)
	.then(() => shell(`curl -X PUT ${process.env.POUCHDB_HOST}`))
	.then(() => fetch(`${process.env.POUCHDB_HOST}/_bulk_docs`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({docs: tunes.concat(transitions, settings)})
	}))
		.catch(log)


