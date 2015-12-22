import {db} from '../../../pouch/index'

export default function (context, del) {
	del.on('click', '.select-arrangement', function (ev) {
		ev.preventDefault();
		context.data.tune.arrangement = context.data.alternateArrangements[ev.target.dataset.arrangementIndex];
		db.put(context.data.tune);
	});
}