import {getAll} from '../../data/models/tune';
import querystring from 'querystring';

const debounceCallback = func => {
	let timeout;
	return ev => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(ev), 200)
	}
}

export default function (del) {
	del.on('keyup', '.tune-search input[type="search"]', debounceCallback(ev => {
		const term = ev.target.value;
		Object.assign(this.query, {q: term})
		window.history.pushState({}, 'Search: ' + term, '/tunes?' + querystring.stringify(this.query));
		getAll(this.query)
			.then(tunes => {
				templateLoader.render(`pages/tunes/list.html`, {
					tunes: tunes.tunes
				}, (err, res) => {
					document.querySelector('.tune-list').innerHTML = res;
				});
			})
	}));

	// del.on('click', '.tune-list__tune__delete', debounceCallback(ev => {
	// 	const term = ev.target.value;
	// 	Object.assign(this.query, {q: term})
	// 	window.history.pushState({}, 'Search: ' + term, '/tunes?' + querystring.stringify(this.query));
	// 	getAll(this.query)
	// 		.then(tunes => {
	// 			templateLoader.render(`pages/tunes/list.html`, {
	// 				tunes: tunes.tunes
	// 			}, (err, res) => {
	// 				document.querySelector('.tune-list').innerHTML = res;
	// 			});
	// 		})
	// }));
}