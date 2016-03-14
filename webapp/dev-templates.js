import nunjucks from 'nunjucks';
export const loader = window.templateLoader = new nunjucks.Environment(new nunjucks.WebLoader('/templates', {
	async: true,
	useCache: true
}));