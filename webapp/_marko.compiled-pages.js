import marko from 'marko';
const obj = {};

obj['./pages/home/tpl.marko'] = marko.load('./pages/home/tpl.marko');
obj['./pages/learn/tpl.marko'] = marko.load('./pages/learn/tpl.marko');
obj['./pages/rehearse/tpl.marko'] = marko.load('./pages/rehearse/tpl.marko');
obj['./pages/sets/tpl.marko'] = marko.load('./pages/sets/tpl.marko');
obj['./pages/tunes/tpl.marko'] = marko.load('./pages/tunes/tpl.marko');
obj['./pages/tunes/view/tpl.marko'] = marko.load('./pages/tunes/view/tpl.marko');

export default obj;
