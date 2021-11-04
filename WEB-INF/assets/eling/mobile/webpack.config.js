var fs = require('fs');
var path = require("path");
var webpack = require('webpack');

var basepath = "../../../../../../../../com.eling.elcms.system-web/" +
    "com.eling.elcms.system-web/src/main/webapp/assets/eling/mobile";
basepath = path.resolve(basepath);

var alias = {};
fs.readdirSync(basepath).map(function(dir,index,dirs){
    alias[dir] = path.join(basepath,dir).replace(/\\/g,"/");
});

module.exports = {
    output: {
        path: __dirname,
        filename: '[name]/index.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: [/node_modules/],
            loaders: ["react-hot","babel"]
        },{
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }]
    },
    resolve: {
        alias: alias
    }
}
