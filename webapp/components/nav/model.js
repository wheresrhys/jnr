export const model = {
	home: {
		label: 'Home',
		url: '/',
		pattern: /^\/$/
	},
	learn: {
		label: 'Learn',
		url: '/scheduler?order=learn',
		pattern: /^\/scheduler\?order=learn/
	},
	improve: {
		label: 'Improve',
		url: '/scheduler?order=improve',
		pattern: /^\/scheduler\?order=improve/
	},
	remind: {
		label: 'Remind',
		url: '/scheduler?order=remind',
		pattern: /^\/scheduler\?order=remind/
	},
	tunes: {
		label: 'Tunes',
		url: '/tunes',
		pattern: /^\/tune/
	},
}