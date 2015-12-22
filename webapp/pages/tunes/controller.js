import {query, db} from '../../pouch/index';
import view from './view/controller';
import edit from './edit/controller';

export default function *controller (isApiCall) {
	this.controller = 'tunes';
	if (this.params.action) {
		this.data.tune = yield db.get(this.params.tuneId);
		if (this.params.action === 'view') {
			yield view.call(this);
		}
		if (this.params.action === 'edit') {

			yield view.call(this, isApiCall);
		}
	} else {
		this.data.tunes = yield query('tunes', {
			include_docs: true,
			limit: this.query.limit ? Number(this.query.limit) : 10,
			skip: this.query.page ? (this.query.limit || 10) * (this.query.page - 1) : 0
		})
		this.data.pagination = {
			next: Number(this.query.page || 1) + 1,
			prev: Number(this.query.page || 1) - 1,
			perPage: this.query.limit || 10
		}
	}
}