import {db} from '../../data/index';
import {practice, getAbc} from '../../data/models/setting';
import {render} from '../../lib/abc-dom';

const rootEl = document.querySelector('main');

function getContainer (el) {
	while (!el.classList.contains('set')) {
		el = el.parentNode;
	}
	return el;
}


function getTuneContainer (el) {
	while (!el.classList.contains('set__tune')) {
		el = el.parentNode;
	}
	return el;
}

function getTuneId (el) {
	while (!el.dataset.tuneId) {
		el = el.parentNode;
	}
	return el.dataset.tuneId;
}

function getSettingId (el) {
	while (!el.dataset.settingId) {
		el = el.parentNode;
	}
	return el.dataset.settingId;
}

function constructTransition (el) {
	const container = getTuneContainer(el);
	const prevContainer = container.previousElementSibling;
	const doc = {
		from: {
			id: prevContainer.dataset.tuneId,
			key: prevContainer.dataset.tuneKey
		},
		to: {
			id: container.dataset.tuneId,
			key: container.dataset.tuneKey
		},
		type: 'transition'
	};
	doc._id = `${doc.from.id}|${doc.from.key}|${doc.to.id}|${doc.to.key}`;
	return doc;
}


export function init (del) {

	del.on('click', '.set__dismiss', function (ev) {
		ev.preventDefault();
		const container = getContainer(ev.target)
		Array.from(container.querySelectorAll('.practicer')).map(el => {
			if (!el.hasAttribute('data-practiced')) {
				practice(getSettingId(el), 3);
			}
		});
		container.parentNode.removeChild(container);
	});

	del.on('click', '.set__tune-render', function (ev) {
		ev.preventDefault();
		getAbc(getSettingId(ev.target))
			.then(abc => {
				const container = getContainer(ev.target);
				const manuscript = container.querySelector('.set__tune-score')
				render(manuscript, abc, true);
				container.dispatchEvent(new CustomEvent('score.rendered', {
					bubbles: true,
					detail: {
						manuscript: manuscript
					}
				}))
			})
	});

	del.on('score.rendered', '.set', ev => {
		const manuscript = ev.target.querySelector('.set__tune-score');
		Array.from(rootEl.querySelectorAll('.set__tune-score'))
			.forEach(el => {
				if (el !== ev.detail.manuscript) {
					el.innerHTML = '';
					el.removeAttribute('style');
				}
			})
	});

	del.on('click', '.set__save-transition', function (ev) {
		ev.preventDefault();
		const container = getTuneContainer(ev.target);
		const doc = constructTransition(container);
		db.put(doc)
			.then(() =>	container.classList.remove('set__tune--new-transition'))
	});

	del.on('click', '.set__remove-transition', function (ev) {
		ev.preventDefault();
		const container = getTuneContainer(ev.target);
		const doc = constructTransition(container);
		db.get(doc._id)
			.then(doc => db.remove(doc))
			.then(() => container.classList.add('set__tune--new-transition'))
	});

}