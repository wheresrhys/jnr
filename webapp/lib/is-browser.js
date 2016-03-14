export default (function () {
	return process.title === 'browser';
	try {
		return !!window;
	} catch(e) {
		return false;
	}
})();
