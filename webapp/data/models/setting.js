import {db} from '../index';
import {ABC} from '../../lib/abc';
import {addSetting} from './tunes';

export function getAbc (settingId) {
	return db().get(settingId)
		.then(setting => {
			return new ABC({
				key: setting.key,
				rhythm: setting.rhythm,
				abc: setting.abc
			});
		})

}

export function practice (settingId, urgency) {

	return db().get(settingId)
		.then(setting => {
			setting.practices.unshift({
				date: new Date().toISOString(),
				urgency: urgency
			});
			if (setting.practices.length > 5) {
				setting.practices.pop();
			}
			return db().put(setting);
		});
}

export function create(tune, key, settingIndex) {
	const abc = tune.getAbc(settingIndex, key);
	addSetting(tune._id, abc.key);

	return db().put({
		_id: `${tune._id}|${abc.key}`,
		practices: [{
			date: new Date().toISOString(),
			urgency: 10
		}],
		key: abc.key,
		abc: abc.abc,
		name: tune.name,
		rhythm: abc.rhythm,
		tuneId: tune._id,
		docType: 'setting'
	})
}