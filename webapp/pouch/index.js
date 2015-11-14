const PouchDB = require('PouchDB');
const indexes = {
  'tune-derivatives': require('./indexes/tune-derivatives'),
  'tune-derivatives-by-type': require('./indexes/tune-derivatives-by-type')
};

export const db = new PouchDB(process.env ? process.env.POUCHDB_HOST : 'jnr');

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