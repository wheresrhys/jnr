import tunes from './tunes/enhancement';
import tune from './tune/enhancement';
import rehearse from './rehearse/enhancement';
import learn from './learn/enhancement';
import home from './home/enhancement';

const map = {
	tunes: tunes,
	tune: tune,
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
