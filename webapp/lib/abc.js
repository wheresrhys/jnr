export function decomposeABC (abc) {
	return {
		mode: (abc.match(/K:(?:\s*)[A-Z]([A-Za-z]*)/) || [])[1],
		root: (abc.match(/K:(?:\s*)([A-Z](?:b|#)?)/) || [])[1],
		meter: (abc.match(/M:(?:\s*)(\d+\/\d+)/) || [])[1],
		rhythm: (abc.match(/R:(?:\s*)([a-z]+)/i) || [])[1],
		abc: abc.split(/(M|K|R):.*/i).pop().trim().replace(/\! ?/g, '\n')
	}
}

export function composeABC (abcObj, tune) {
	abcObj = abcObj || tune.arrangement;

	return `K: ${abcObj.root}${abcObj.mode}
M: ${abcObj.meter || tune.meter}
R: ${abcObj.rhythm || tune.rhythm}
${abcObj.abc}`
}

export function decomposeKey (key) {

	return {
		mode: (key.match(/^[A-G](?:b|#)?(.*)/) || [, ''])[1].substr(0,3),
		root: (key.match(/^[A-G](?:b|#)?/) || [])[0]
	}
}

function handleOrphans (abcArray) {
	// handle orphan 1st/second time bars
	if ((/1|2/.test(abcArray[0]) && abcArray[1] === ' ') || (abcArray[0] === '[' && /1|2/.test(abcArray[1]))) {
		abcArray.unshift('|');
	}
	return abcArray;
}

function measureEffectiveLength (str) {
	return str.replace(/"[A-G](?:b|#)?m?"/g, '').length
}

export function limitLength (abcStr, length) {
	const abcLines = abcStr.split('\n');
	if (length < 15) {
		throw new Error('Ridiculous length constraint for an ABC');
	}
	if (abcLines.some(l => l.length > length)) {
		const abcChars = abcLines.map(line => {
			return line + (/\|$/.test(line) ? '' : '|');
		}).join('').split('');
		let compressedAbc = [];
		let newLine = '';
		let bar = '';
		let char;

		while (abcChars.length) {

			while ((char = abcChars.shift()) !== '|') {
				bar += char;
			}
			bar += char;

			if (abcChars[0] === '|') {
				bar += abcChars.shift();
			}

			let effectiveLength = measureEffectiveLength(newLine + bar)
			if (effectiveLength < length) {
				newLine += bar;
				bar = '';
				continue;
			}

			if (effectiveLength === length) {
				compressedAbc.push(newLine + bar);
				newLine = '';
				handleOrphans(abcChars)
			} else {
				compressedAbc.push(newLine);
				newLine = handleOrphans(bar.split('')).join('');
			}
			bar = '';
		}
		if (newLine) {
			compressedAbc.push(newLine);
		}

		return compressedAbc.join('\n').replace(/\|{3,}/g, '||');
	}
	return abcLines.join('\n');
}