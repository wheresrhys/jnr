import tunes from './tunes/enhancement';
import rehearse from './rehearse/enhancement';
import sets from './sets/enhancement';
import learn from './learn/enhancement';
import home from './home/enhancement';

const map = {
	tunes: tunes,
	sets: sets,
	rehearse: rehearse,
	learn: learn,
	home: home
};

import Delegate from 'dom-delegate';

const del = Delegate();

export default function (ev) {
	del.destroy();
	del.root(document.querySelector('main'));
	return map[ev.controller](ev, del);
}
