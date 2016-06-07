import {query, db} from '../../data/index';

import {getSetCollection} from '../../components/set/model';

export default function *() {
	this.controller = 'scheduler';
	this.data.list = {};
	this.data.list.orderBy = this.query.order || 'remind';
	this.data.list.id = `set-list--${this.data.list.orderBy}`;
	this.data.list.sets = yield getSetCollection(this.data.list.orderBy);
}

