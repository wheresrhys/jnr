import {db} from '../index';
import {ABC} from '../../lib/abc';

export function getAbc (settingId) {
	return db.get(settingId)
		.then(setting => {
			return new ABC({
				key: setting.key,
				rhythm: setting.rhythm,
				abc: setting.abc
			});
		})

}

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