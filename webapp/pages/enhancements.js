import tunes from './tunes/enhancement';
import tune from './tune/enhancement';
import scheduler from './scheduler/enhancement';
import home from './home/enhancement';
import transition from './transition/enhancement';

const enhancements = {
	tunes: tunes,
	tune: tune,
	scheduler: scheduler,
	home: home,
	transition: transition
};

import Delegate from 'dom-delegate';

const del = Delegate();

export default function (ctx) {
	del.destroy();
	del.root(document.querySelector('main'));
	return enhancements[ctx.controller] && enhancements[ctx.controller].call(ctx, del);
}