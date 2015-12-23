export function decomposeABC (abc) {
	return {
		mode: (abc.match(/K:(?:\s*)[A-Z]([A-Za-z]*)/) || [])[1],
		root: (abc.match(/K:(?:\s*)([A-Z](?:b|#)?)/) || [])[1],
		abc: abc.split(/(M|K|R):.*/i).pop().trim().replace(/\! ?/g, '\n')
	}
}

export function composeABC (tune, abcObj) {
	abcObj = abcObj || tune.arrangement;

	return `K: ${abcObj.root}${abcObj.mode}
M: ${tune.meter}
R: ${tune.rhythm}
${abcObj.abc}`
}

export function decomposeKey (key) {

	return {
		mode: (key.match(/^[A-G](?:b|#)?(.*)/) || [,	''])[1].substr(0,3),
		root: (key.match(/^[A-G](?:b|#)?/) || [])[0]
	}
}