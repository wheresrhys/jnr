import {query, db} from '../../data/index';

import {getSetCollection} from '../../components/set/model';

export default function *() {
	this.controller = 'scheduler';
	this.data.orderBy = this.query.order || 'remind';
	this.data.sets = yield getSetCollection(this.data.orderBy);
}

