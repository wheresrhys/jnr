import {db} from '../../../pouch/index';
import {render} from '../../../lib/abc-dom';

export default function (context, del) {
	render(document.querySelector('.tune__abc'));
	del.on('click', '.select-arrangement', function (ev) {
		ev.preventDefault();
		context.data.tune.arrangement = context.data.alternateArrangements[ev.target.dataset.arrangementIndex];
		db.put(context.data.tune);
	});
}