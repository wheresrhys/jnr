export function decomposeABC (abc) {
	return {
		mode: (abc.match(/K:(?:\s*)[A-Z]([A-Za-z]*)/) || [])[1],
		root: (abc.match(/K:(?:\s*)([A-Z](?:b|#)?)/) || [])[1],
		abc: abc.split(/(M|K|R):.*/i).pop().trim().replace(/\! ?/g, '\n')
	}
}

export function decomposeKey (key) {

	return {
		mode: (key.match(/^[A-G](?:b|#)?(.*)/) || [,	''])[1].substr(0,3),
		root: (key.match(/^[A-G](?:b|#)?/) || [])[0]
	}
}