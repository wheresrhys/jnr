require('babel-core/register')({
	plugins:[
		'transform-es2015-modules-commonjs',
		// 'syntax-async-functions',
		// 'transform-async-functions',

		'transform-async-to-generator'
	]
});
require('./app');