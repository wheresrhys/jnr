export function decomposeABC (abc) {
	return {
		meter: (abc.match(/M:(?:\s*)(.*)/) || [])[1],
		rhythm: (abc.match(/R:(?:\s*)(.*)/) || [])[1],
		mode: (abc.match(/K:(?:\s*)[A-Z]([A-Za-z]*)/) || [])[1],
		root: (abc.match(/K:(?:\s*)([A-Z](?:b|#)?)/) || [])[1],
		abc: abc.split(/(M|K|R):.*/i).pop().trim()
	}
};