const abcConf = {
	scale: 0.6,
	paddingtop: 0,
	paddingbottom: 0,
	paddingright: 0,
	paddingleft: 0
};

export function render (el, str, preserveEl) {
	str = str || el.innerHTML;
	let targetEl;
	if (preserveEl) {
		targetEl = el;
	} else {
		targetEl = document.createElement('div');
		el.parentNode.insertBefore(targetEl, el);
	}

	window.ABCJS.renderAbc(targetEl, str, {}, abcConf, {});
	if (!preserveEl) {
		el.parentNode.removeChild(el);
	}
}