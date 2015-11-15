import isBrowser from '../lib/is-browser';
let templateMap;

export default function (path) {
	if (templateMap) {
		console.log('asdas')
		return templateMap[path];
	} else {
		return path;
	}

}

export function setMap (map) {
	templateMap = map;
}
