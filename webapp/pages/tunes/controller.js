import {db} from '../../pouch';

export default function *controller () {
	this.data.tunes = yield db.allDocs({include_docs: true})
			.then(data => data.rows
				.filter(t => t.doc.type === 'tune')
				.slice(0, 10)
				.map(t => t.doc)
			);
}