import {db} from '../../data/index';
import {render} from '../../lib/abc-dom';

export default function (del) {
	render(document.querySelector('.tune__abc'));
	del.on('submit', 'form.select-arrangement', ev => {
		ev.preventDefault();
		this.data.tune.arrangement = this.data.alternateArrangements[ev.target.querySelector('input[name="arrangement"]').value];
		db.put(this.data.tune);
	});
}