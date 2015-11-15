import PouchDB from 'pouchdb';
import * as tdbt from './indexes/tune-derivatives-by-type';
import * as t from './indexes/tunes';
import * as td from './indexes/tune-derivatives';

const indexes = {
  'tune-derivatives': td,
  'tune-derivatives-by-type': tdbt,
  'tunes': t
};
let dbName;

try {
  dbName = process.env.POUCHDB_HOST;
} catch (e) {
  dbName = 'jnr';
}
export const db = new PouchDB(dbName);

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
}
// import textSearch from '../lib/search';
// export function search (docType, field) {
//   return createIndex(indexName)
//     .then(() => db.query(`${docType}/index`, {
//       include_docs: true
//     }))
//     .then()
// }