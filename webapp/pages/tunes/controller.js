import {query} from '../../data/index';

export default function *controller () {
	this.controller = 'tunes';

	const limit = this.query.limit ? Number(this.query.limit) : 20;

	this.data.tunes = yield query('tunes', {
		include_docs: true,
		limit: limit,
		skip: this.query.page ? limit * (this.query.page - 1) : 0
	})
	this.data.pagination = {
		next: Number(this.query.page || 1) + 1,
		prev: Number(this.query.page || 1) - 1,
		perPage: limit
	}
}