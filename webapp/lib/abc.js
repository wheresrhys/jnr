import isBrowser from './is-browser';

const meterMap = {
	jig: '6/8',
	'slip jig': '9/8',
	slide: '12/8',
	polka: '2/4',
	waltz: '3/4'
};

function handleOrphans (abcArray) {
	// handle orphan 1st/second time bars
	if ((/1|2/.test(abcArray[0]) && abcArray[1] === ' ') || (abcArray[0] === '[' && /1|2/.test(abcArray[1]))) {
		abcArray.unshift('|');
	}
	return abcArray;
}

function measureEffectiveLength (abcStr) {
	return abcStr.replace(/("[A-G](?:b|#)?m?"|&gt;)/g, '').length
}

export class ABC {
	constructor (obj) {
		this.mode = (obj.key.match(/^[A-G](?:b|#)?(.*)/) || [, ''])[1].substr(0,3);
		this.root = (obj.key.match(/^[A-G](?:b|#)?/) || [])[0];
		this.abc = obj.abc.replace(/\!/g, '\n').split(/(R|M|K)\:.*/g).pop();
		this.rhythm = obj.rhythm;
		this.meter = meterMap[obj.rhythm] || '4/4';
		this.key = this.root + this.mode;
	}

	toString (length) {
		return `K: ${this.key}\nM: ${this.meter}\nR: ${this.rhythm}\n${this.wrap(length)}`;
	}

	wrap (length) {
		let abcStr = this.abc;
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
		return abcLines.filter(l => !!l).join('\n');
	}
}