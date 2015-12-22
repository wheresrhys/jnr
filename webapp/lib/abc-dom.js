

const abcConf = {
	scale: 0.6,
	paddingtop: 0,
	paddingbottom: 0,
	paddingright: 0,
	paddingleft: 0
}

export function render (el, str) {
	str = str || el.innerHTML;
	const div = document.createElement('div');
	el.parentNode.insertBefore(div, el);
	window.ABCJS.renderAbc(div, str, {}, abcConf, {});
	el.parentNode.removeChild(el);
}