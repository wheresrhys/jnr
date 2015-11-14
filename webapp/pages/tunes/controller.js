import {query} from '../../pouch';

export default function *controller () {
	this.data.tunes = yield query('tunes', {
		include_docs: true,
		limit: this.query.limit || 10,
		skip: this.query.page ? (this.query.limit || 10) * this.query.page : 0
	})
			.catch(logErr)
			.then(data => data.rows
				.map(t => t.doc)
			)

}