'use strict';
require('isomorphic-fetch');
const _ = require('lodash');
const log = console.log.bind(console);
const shell = require('shellpromise');

function decomposeABC (abc) {
	return {
		meter: (abc.match(/M:(?:\s*)(.*)/) || [])[1],
		rhythm: (abc.match(/R:(?:\s*)(.*)/) || [])[1],
		mode: (abc.match(/K:(?:\s*)[A-Z]([A-Za-z]*)/) || [])[1],
		root: (abc.match(/K:(?:\s*)([A-Z](?:b|#)?)/) || [])[1],
		abc: abc.split(/(M|K|R):.*/i).pop().trim()
	}
}

function createCouchPractice (mongoPractice, tuneId, key, obj) {
	const practices = mongoPractice.lastPracticed && mongoPractice.lastPracticed.$date ? [{
		date: mongoPractice.lastPracticed.$date,
		urgency: mongoPractice.lastPracticeQuality === -1 ? 10 : mongoPractice.lastPracticeQuality === 1 ? 1 : 5
	}] : [];
	obj[tuneId] = obj[tuneId] || [];
	obj[tuneId].push({
		practices: practices,
		key: key,
		tunebook: mongoPractice.tunebook.replace('wheresrhys:', '')
	});
}


const tunes = require('../mongo-export/tunes').map(rec => {
	return {
		_id: rec.sessionId ? `session:${rec.sessionId}` : `wheresrhys:${rec._id.$oid}`,
		type: 'tune',
		mongoId: rec._id.$oid,
		abc: rec.abc,
		arrangements: [],
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

require('../mongo-export/arrangements').forEach(rec => {
	const tune = tunes.find(t => t.mongoId === rec.tune.$oid)

	tune.arrangements.push({
		abc: rec.abc,
		author: rec.author,
		meter: rec.meter,
		mode: rec.mode,
		rhythm: rec.rhythm,
		root: rec.root,
		variants: rec.variants
	})
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

tunes.forEach(tune => {
	if (tune.arrangements.length === 0) {
		tune.arrangements.unshift(decomposeABC(tune.abc));
	}
	tune.arrangements = _.uniq(tune.arrangements, 'abc');
	delete tune.abc;
})

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
		// TODO add meter here too
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


