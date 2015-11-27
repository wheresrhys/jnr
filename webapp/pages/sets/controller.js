import {query, db} from '../../pouch/index';
// import view from './view/controller';

export default function *controller () {
	this.controller = 'sets';
	// if (this.params.action) {
	// 	this.tpl = `pages/tunes/${this.params.action}/tpl.html`;
	// 	this.data.tune = yield db.get(this.params.tuneId);
	// 	// yield view.call(this);
	// } else {
		// this.data.tunes = yield query('tunes', {
		// 	include_docs: true,
		// 	limit: this.query.limit ? Number(this.query.limit) : 10,
		// 	skip: this.query.page ? (this.query.limit || 10) * this.query.page : 0
		// })
		// 		.catch(logErr)
		// 		.then(data => data.rows
		// 			.map(t => t.doc)
		// 		)
	// }
}