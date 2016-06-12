import nunjucks from 'nunjucks';
import extend from './nunjucks-extensions';
window.templateLoader = new nunjucks.Environment(new nunjucks.WebLoader('/templates', {
	async: true,
	useCache: true
}));
extend(window.templateLoader);

export const loader = window.templateLoader;

