import {db, query} from '../index';

export function practice (settingId, urgency) {

	return db.get(settingId)
		.then(setting => {
			setting.practices.unshift({
				date: new Date().toISOString(),
				urgency: urgency
			});
			if (setting.practices.length > 5) {
				setting.practices.pop();
			}
			db.put(setting);
		});
}