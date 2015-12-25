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

function createCouchPractice (mongoPractice, tuneId, key, obj) {
	if (mongoPractice.tunebook !== 'wheresrhys:mandolin') {
		return;
	}

	const practices = mongoPractice.lastPracticed && mongoPractice.lastPracticed.$date ? [{
		date: dates[Math.floor(Math.random() * 6)],
		urgency: mongoPractice.lastPracticeQuality === -1 ? 10 : mongoPractice.lastPracticeQuality === 1 ? 1 : 5
	}] : [];

	obj[tuneId] = obj[tuneId] || [];
	obj[tuneId].push({
		practices: practices,
		key: key,
		tunebook: mongoPractice.tunebook.replace('wheresrhys:', '')
	});

}


let tunes = require('../mongo-export/tunes').map(rec => {
	return {
		_id: rec.sessionId ? `session:${rec.sessionId}` : `wheresrhys:${rec._id.$oid}`,
		type: 'tune',
		mongoId: rec._id.$oid,
		abc: rec.abc,
		author: rec.author,
		keys: rec.keys,
		meter: rec.meters[0],
		name: rec.name,
		oldId: rec.oldId && rec.oldId.$oid,
		quality: rec.quality,
		rhythm: rec.rhythms[0],
		repertoire: [],
		sessionId: rec.sessionId
	};
});

let sets = require('../mongo-export/sets').map(s => {
	return {
		type: 'set',
		mongoId: s._id.$oid,
		name: s.name,
		tunes: s.tunes.map((t, i) => {
			return {
				id: tunes.find(tune => tune.mongoId === t.$oid)._id,
				key: s.keys[i]
			}
		})
	};
});

let pieces = require('../mongo-export/pieces').reduce((obj, rec) => {
	if (rec.type === 'tune') {
		const tune = tunes.find(t => t.mongoId === rec.srcId.$oid)

		createCouchPractice(rec, tune._id, tune.keys[0], obj);

	} else {
		const set = sets.find(s => s.mongoId === rec.srcId.$oid)
		set.tunes.map(tune => {
			createCouchPractice(rec, tune.id, tune.key, obj);
		})
	}
	return obj;
}, {});


Object.keys(pieces).forEach(tuneId => {
	tunes.find(t => t._id === tuneId).repertoire = _.uniq(pieces[tuneId], function(n) {
	  return n.tunebook + n.key
	})
})

tunes = tunes.filter(tune => {
	if (tune.repertoire.length) {
		tune.arrangement = decomposeABC(tune.abc);
		delete tune.abc;
		return true;
	}
});

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
		body: JSON.stringify({docs: tunes.concat(transitions)})
	}))
		.catch(log)


