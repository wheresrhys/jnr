import 'compiled-templates';

import nunjucks from 'nunjucks';
import extend from './nunjucks-extensions';
const env = new nunjucks.Environment()
extend(env);
export const loader = env;

