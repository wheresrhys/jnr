export const debounceCallback = func => {
	let timeout;
	return ev => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(ev), 200)
	}
}