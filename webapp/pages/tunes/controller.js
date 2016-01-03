import {getAll} from '../../data/models/tunes';

export default function *controller () {
	this.controller = 'tunes';

	Object.assign(this.data, yield getAll(this.query));
	this.data.q = this.query.q || '';
}