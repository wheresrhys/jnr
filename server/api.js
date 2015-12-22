import {db} from '../webapp/pouch/index';

export default {
	tune: function *() {
		this.data.tune.arrangement = this.data.alternateArrangements[this.request.body.arrangement];
		yield db.put(this.data.tune)
			.then(() => this.response.redirect(this.request.url.replace('edit', 'view').replace('/api', ''	)))
	}
};
