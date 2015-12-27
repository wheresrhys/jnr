import tunes from './tunes/enhancement';
import tune from './tune/enhancement';
import rehearse from './rehearse/enhancement';
import learn from './learn/enhancement';

const map = {
	tunes: tunes,
	tune: tune,
	rehearse: rehearse,
	learn: learn,
};

import Delegate from 'dom-delegate';

const del = Delegate();

export default function (ctx) {
	del.destroy();
	del.root(document.querySelector('main'));
	return map[ctx.controller].call(ctx, del);
}
