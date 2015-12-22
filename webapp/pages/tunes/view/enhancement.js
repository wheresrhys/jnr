import {db} from '../../../pouch/index';
import {render} from '../../../lib/abc-dom';

export default function (context, del) {
	render(document.querySelector('.tune__abc'));
	del.on('submit', 'form.select-arrangement', function (ev) {
		ev.preventDefault();
		context.data.tune.arrangement = context.data.alternateArrangements[ev.target.querySelector('input[name="arrangement"]').value];
		db.put(context.data.tune);
	});
}