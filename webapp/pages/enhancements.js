import tunesEnhancement from './tunes/enhancement';
import tuneEnhancement from './tune/enhancement';
import schedulerEnhancement from './scheduler/enhancement';
import homeEnhancement from './home/enhancement';

const enhancements = {
	tunes: tunesEnhancement,
	tune: tuneEnhancement,
	scheduler: schedulerEnhancement,
	home: homeEnhancement
};

import Delegate from 'dom-delegate';

const del = Delegate();

export default function (ctx) {
	del.destroy();
	del.rootEl = document.querySelector('main');
	del.root(del.rootEl);
	return enhancements[ctx.controller] && enhancements[ctx.controller].call(ctx, del);
}