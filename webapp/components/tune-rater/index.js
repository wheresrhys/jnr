function getContainer (el) {
	while (!el.classList.contains('tune-rater')) {
		el = el.parentNode;
	}
	return el;
}

function getTuneId (el) {
	getContainer(el).dataset.tuneId;
}

export function init (del) {

	del.on('mousedown', '.tune-rater__concealer', function (ev) {
		const input = ev.target.nextElementSibling;
		let increasing = input.value < 9;
		ev.target.oscillator = setInterval(() => {
			input.value = Number(input.value) + (increasing ? 0.5 : -0.5);
			if (input.value == 1) {
				increasing = true;
			}
			if (input.value == 10) {
				increasing = false;
			}
		}, 30);
	});

	del.on('mouseup', '.tune-rater__concealer', function (ev) {
		ev.target.oscillator && clearInterval(ev.target.oscillator);
		getContainer(ev.target).dispatchEvent(new CustomEvent('tune.practiced', {
			bubbles: true,
			detail: {
				tuneId: getTuneId(ev.target)
			}
		}))
	});

	del.on('change', '.tune-rater [name="practiceQuality"]', function (ev) {

		const tuneId = getTuneId(ev.target);

		getContainer(ev.target).dispatchEvent(new CustomEvent('tune.practiced', {
			bubbles: true,
			detail: {
				tuneId: tuneId
			}
		}))

		db.get(tuneId)
			.then(tune => {
				tune.repertoire[ev.target.parentNode.querySelector('[name="repertoireIndex"]').value].practices.unshift({
					date: new Date().toISOString(),
					urgency: ev.target.value
				});
				if (tune.repertoire.length > 5) {
					tune.repertoire.pop();
				}
				db.put(tune);
			});

	});

}