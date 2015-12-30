import tunesEnhancement from './tunes/enhancement';
import tuneEnhancement from './tune/enhancement';
import schedulerEnhancement from './scheduler/enhancement';

const enhancements = {
	tunes: tunesEnhancement,
	tune: tuneEnhancement,
	scheduler: schedulerEnhancement
};

import Delegate from 'dom-delegate';

const del = Delegate();

export default function (ctx) {
	del.destroy();
	del.root(document.querySelector('main'));
	return enhancements[ctx.controller].call(ctx, del);
}