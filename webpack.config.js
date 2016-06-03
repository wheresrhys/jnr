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
					plugins: ['transform-es2015-modules-commonjs']
				}
			},
			{
        test: /nunjucks\/browser\/nunjucks(-slim)?/,
        loader: 'exports?nunjucks'
      }
		]
	},
	resolve: {
		alias: {
			nunjucks: 'nunjucks/browser/nunjucks.js',
			templates: __dirname + '/webapp/dev-templates.js'
		}
	}
};

if (process.env.PRODUCTION_BUILD) {
	conf.resolve.alias.nunjucks = 'nunjucks/browser/nunjucks-slim.js';
	conf.resolve.alias.templates = __dirname + '/webapp/prod-templates.js'
	conf.resolve.alias['compiled-templates'] = __dirname + '/public/templates.js'
}

module.exports = conf;