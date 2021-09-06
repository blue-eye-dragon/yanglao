var webpack = require('webpack');
var entryConfig = require("./entry.config");

module.exports = {
	entry: entryConfig,
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('shared.js'),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
}