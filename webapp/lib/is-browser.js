export default function () {
	try {
		return !!window;
	} catch(e) {
		return false;
	}
}
