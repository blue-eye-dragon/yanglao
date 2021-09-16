var express = require('express')

var webpack = require("webpack")
var webpackConfig = require("./webpack.config")
var webpackDevConfig = require("./webpack.develop.config");
var WebpackDevServer = require("webpack-dev-server")

for(var i in webpackDevConfig.entry){
    webpackDevConfig.entry[i].unshift("webpack-dev-server/client?http://192.168.1.4:3000/", "webpack/hot/dev-server")
}
var devConfig = Object.create(webpackConfig);
devConfig = Object.assign(webpackConfig,webpackDevConfig)
var compiler = webpack(devConfig);

var server = new WebpackDevServer(compiler,{
    proxy: {
        '*/api/*': {
            target:"http://192.168.1.4:8080/",
            rewrite: function(req) {
                req.url = "http://192.168.1.4:8080/com.eling.elcms.community/"+req.url;
            }
        }
    },
    hot: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    publicPath: "/",
    stats: {
        colors: true
    }
});

server.listen(3000, "192.168.1.4", function() {});
