import {getAll} from '../../data/models/tune';

export default function *controller () {
	this.controller = 'tunes';

	const limit = this.query.limit ? Number(this.query.limit) : 20;
	const start = ((this.query.page || 1) - 1) * limit;

	const tunes = yield getAll();
	this.data.tunes = tunes.slice(start, start + limit);
	this.data.pagination = {
		next: Number(this.query.page || 1) + 1,
		prev: Number(this.query.page || 1) - 1,
		perPage: limit
	}
}