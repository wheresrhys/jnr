import {db} from '../../data/index';
import {render} from '../../lib/abc-dom';

export default function (del) {
	render(document.querySelector('.tune__abc'), this.data.abc);

	del.on('submit', '.tune__select-arrangement', ev => {
		ev.preventDefault();
		this.data.tune.arrangement = this.data.alternateArrangements[ev.target.querySelector('input[name="arrangement"]').value];
		db.put(this.data.tune);
		ev.target.parentNode.removeChild(ev.target);
		window.history.pushState({}, this.data.tune.name, window.location.pathname);
	});

	del.on('submit', '.tune__start-learning', ev => {
		ev.preventDefault();
		this.data.tune.settings.push({
			key: ev.target.querySelector('input[name="key"]').value,
			practices: [{
				date: new Date().toISOString(),
				urgency: 10
			}]
		});
		ev.target.parentNode.removeChild(ev.target);
		db.put(this.data.tune)
	});
}