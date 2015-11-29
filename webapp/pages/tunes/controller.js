import {query, db} from '../../pouch/index';
import view from './view/controller';

export default function *controller () {
	this.controller = 'tunes';
	if (this.params.action) {
		this.data.tune = yield db.get(this.params.tuneId);
		console.log(this.data.tune)
		yield view.call(this);
	} else {
		this.data.tunes = yield query('tunes', {
			include_docs: true,
			limit: this.query.limit ? Number(this.query.limit) : 10,
			skip: this.query.page ? (this.query.limit || 10) * (this.query.page - 1) : 0
		})
				.catch(logErr)
				.then(data => data.rows
					.map(t => t.doc)
				)
		this.data.pagination = {
			next: Number(this.query.page || 1) + 1,
			prev: Number(this.query.page || 1) - 1,
			perPage: this.query.limit || 10
		}
	}
}