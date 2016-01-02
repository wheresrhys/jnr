import {getAll} from '../../data/models/tune';

export default function *controller () {
	this.controller = 'transition';

	// Object.assign(this.data, yield getAll(this.query));
	// this.data.q1 = this.query.q || '';
}