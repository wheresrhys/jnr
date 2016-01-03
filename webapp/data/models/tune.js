import {db} from '../index';
import {ABC} from '../../lib/abc';
import {allTunes, update as updateTunes} from './tunes';

const cache = {};

function getSessionTune (tuneId) {
	if (cache[tuneId]) {
		return Promise.resolve(cache[tuneId])
	}
	return fetch(`https://thesession.org/tunes/${tuneId.replace(/^thesession\:/, '')}?format=json`)
	.then(res => res.json())
	.then(json => {
		json._id = 'thesession:' + json.id;
		json.isFromTheSession = true;
		cache[tuneId] = json;
		return json;
	});
}

function getAbc (settingIndex, key) {
	if (key) {
		this.settings = this.settings.filter(s => {
			return s.key.indexOf(key) === 0;
		});
	}
	const setting = this.settings[settingIndex || 0];

	return new ABC({
		key: setting.key,
		rhythm: this.type,
		abc: setting.abc
	});
}

function tuneModel () {
	return Object.assign(this, {
		getAbc: getAbc,
		isActiveInKeys: allTunes.activeIds[this._id]
	});
}

export function getTune (tuneId) {
	const tunePromise = /^thesession/.test(tuneId) ? getSessionTune(tuneId) : db.get(tuneId);
	return Promise.all([tunePromise, updateTunes()])
		.then(res => tuneModel.apply(res[0]))
}