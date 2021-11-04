var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config");
var webpackProConfig = require("./webpack.product.config");

var elcmEntryConfig = require("../../../../../../../../e-ling/elcms/src/main/webapp/assets/eling/mobile/entry.config");

var del =require("del");

gulp.task("default",function(callback){
    var buildConfig = Object.create(webpackConfig);
    buildConfig = Object.assign(webpackConfig,webpackProConfig)
    webpack(buildConfig, function(err, stats) {
        if(err) {
            throw new gutil.PluginError("webpack:build", err);
        }
        gutil.log("[build]", stats.toString({
            colors: true
        }));

        //删除依赖项目生成的文件
        // for(var i in elcmEntryConfig){
        //     del([i])
        // }

        callback();
    });
});