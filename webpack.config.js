module.exports = {
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
					// presets: ['es2015'],
					plugins: ['transform-es2015-modules-commonjs']
				}
			},
			{
        test: /nunjucks\/browser\/nunjucks(-slim)?/,
        loader: 'exports?nunjucks'
      }
		]
	}
};