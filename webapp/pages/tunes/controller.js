import {query} from '../../pouch/index';

export default function *controller (isApiCall) {
	this.controller = 'tunes';
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