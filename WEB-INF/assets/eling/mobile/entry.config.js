var fs = require('fs');
var path = require("path");
var elcmEntryConfig = require("../../../../../../../../e-ling/elcms/src/main/webapp/assets/eling/mobile/entry.config");

var ignores = ["node_modules",".idea"];
var entryConfig = {};

fs.readdirSync(__dirname).map(function(dir,index,dirs){
	var sp = path.join(__dirname,dir);
	if(fs.statSync(sp).isDirectory()){
		if(ignores.indexOf(dir) == -1){
			entryConfig[dir]=[path.join(sp,"component",dir)];
		}
	}
});

entryConfig = Object.assign(entryConfig,elcmEntryConfig);

module.exports = entryConfig;
