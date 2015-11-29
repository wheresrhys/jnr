import {query, db} from '../../pouch/index';

export default function *controller () {
	this.controller = 'learn';
	this.data.tunes = yield query('learn', {
		include_docs: true,
		limit: this.query.limit ? Number(this.query.limit) : 30,
		skip: this.query.page ? (this.query.limit || 30) * (this.query.page - 1) : 0,
		startkey: ["wheresrhys:mandolin"],
		endkey: ["wheresrhys:mandolin", {}]
	})
			.then(data => data.rows
				.map(t => t.doc.tuneId)
			)
			.then(ids => {
				return db.allDocs({
					include_docs: true,
					keys: ids
				})
			})
			// .then(data => console.log(data.rows[0].doc))
			.then(data => data.rows
				.map(t => t.doc)
			)
			.catch(logErr)

	this.data.pagination = {
		next: Number(this.query.page || 1) + 1,
		prev: Number(this.query.page || 1) - 1,
		perPage: this.query.limit || 30
	}
}