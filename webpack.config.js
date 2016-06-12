// TODO include abcjs in the bundle
const conf = {
	context: __dirname,
	entry: "./webapp/main.js",
	output: {
			path: __dirname + "/public",
			filename: "main.js"
	},
	devtool: 'sourcemap',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					plugins: [
						'transform-es2015-modules-commonjs',
						'transform-async-to-generator',
						['transform-runtime', {polyfills: false}]
					],
					presets: [
						'es2015'
					]
				}
			},
			{
				test: /nunjucks\/browser\/nunjucks(-slim)?/,
				loader: 'exports?nunjucks'
			}
		]
	},
	resolve: {}
};

const path = require('path');
if (process.env.PRODUCTION_BUILD) {
	console.log(__dirname);
	conf.resolve.alias = {
		nunjucks: 'nunjucks/browser/nunjucks-slim.js',
		templates: path.join(__dirname, '/webapp/prod-templates.js'),
		'compiled-templates': path.join(__dirname, '/public/templates.js')
	}
} else {
	conf.resolve.alias = {
		nunjucks: 'nunjucks/browser/nunjucks.js',
		templates: path.join(__dirname, '/webapp/dev-templates.js')
	}
}

module.exports = conf;