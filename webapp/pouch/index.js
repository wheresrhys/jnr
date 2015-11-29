import PouchDB from 'pouchdb';
import * as tdbt from './indexes/tune-derivatives-by-type';
import * as t from './indexes/tunes';
import * as td from './indexes/tune-derivatives';
import * as l from './indexes/learn';
import isBrowser from '../lib/is-browser';

const indexes = {
  'tune-derivatives': td,
  // 'tune-derivatives-by-type': tdbt,
  'tunes': t,
  'learn': l
};

export const db = new PouchDB(isBrowser() ? 'jnr' : process.env.POUCHDB_HOST);

if (isBrowser()) {
  PouchDB.sync('jnr', `${location.protocol}//${location.hostname}:5984/jnr`);
}

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
    .then(data => data.rows.map(r => r.doc))
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