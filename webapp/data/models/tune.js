import {db} from '../index';

export function practice (tuneId, settingIndex, urgency) {

	return db.get(tuneId)
		.then(tune => {
			const practices = tune.settings[settingIndex].practices;

			practices.unshift({
				date: new Date().toISOString(),
				urgency: urgency
			});
			if (practices.length > 5) {
				practices.pop();
			}
			db.put(tune);
		});

}