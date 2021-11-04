var webpack = require('webpack');
var entryConfig = require("./entry.config");

module.exports = {
	entry: entryConfig,
    devtool: "inline-source-map",
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('shared.js'),
      new webpack.DefinePlugin({
    	  'process.env.NODE_ENV': JSON.stringify('development')
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
}