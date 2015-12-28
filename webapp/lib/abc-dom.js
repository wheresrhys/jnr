import {decomposeABC, composeABC, limitLength} from './abc';

const abcConf = {
	scale: 0.6,
	paddingtop: 0,
	paddingbottom: 0,
	paddingright: 0,
	paddingleft: 0
};

export function render (el, str, preserveEl) {
	str = str || el.innerHTML;

	const abcObj = decomposeABC(str);
	// roughly 10 characters per symbol, roughly one to one correspondence between characters and symbols
	const availableWidth = el.parentNode.clientWidth;
	const availableCharacters = availableWidth / 10;
	abcObj.abc = limitLength(abcObj.abc, availableCharacters)

	str = composeABC(abcObj);
	let targetEl;
	if (preserveEl) {
		targetEl = el;
	} else {
		targetEl = document.createElement('div');
		el.parentNode.insertBefore(targetEl, el);
	}

	window.ABCJS.renderAbc(targetEl, str, {}, Object.assign(abcConf, {
		staffwidth: availableWidth
	}), {});
	if (!preserveEl) {
		el.parentNode.removeChild(el);
	}
}

// 10px per character