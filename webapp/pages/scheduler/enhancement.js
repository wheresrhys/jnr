import {init as initSetList} from '../../components/set-list/enhancement';
import {getAll} from '../../data/models/tunes';

const debounceCallback = func => {
	let timeout;
	return ev => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(ev), 200)
	}
}

export default function (del) {
	initSetList(del, this.data.list);
	const searchResultsEl = document.querySelector('.tune-search__results');
	del.on('keyup', '.tune-search input[type="search"]', debounceCallback(ev => {
		const term = ev.target.value;
		if (ev.target.value) {
			getAll({q: term, limit: 6, status: 'active'})
				.then(({tunes}) => {
					searchResultsEl.innerHTML = tunes.map(tune => {
						return `<a class="tune-search__result" href="href="/tunes/{{tune.id}}" data-tune-id=${tune.id}>${tune.name}</button>`;
					}).join('');
				})

		} else {
			searchResultsEl.innerHTML = '';
		}
	}));
	del.on('click', '.tune-search__result', ev => {
		ev.preventDefault();
		document.querySelector('.set-list').dispatchEvent(new CustomEvent('tune.add', {
			bubbles: true,
			detail: {
				tuneId: ev.target.dataset.tuneId
			}
		}));
	});

}