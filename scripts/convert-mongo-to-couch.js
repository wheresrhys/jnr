require('isomorphic-fetch');
const shell = require('shellpromise');
const types = [
	'arrangements',
	'dodgyPractices',
	'dodgyTunes',
	'oldperformances',
	'oldsets',
	'oldtunes',
	'pieces',
	'sets',
	'tunes',
	'users'
];

const tunes = require('../mongo-export/tunes').map(rec => {
	return {
		id: rec._id.$oid,
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

shell(`curl -X DELETE ${process.env.POUCHDB_HOST}`)
	.then(() => shell(`curl -X PUT    ${process.env.POUCHDB_HOST}`))
	.then(() => Promise.all([
		fetch(`${process.env.POUCHDB_HOST}/_bulk_docs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({docs: tunes})
		})
	]));
