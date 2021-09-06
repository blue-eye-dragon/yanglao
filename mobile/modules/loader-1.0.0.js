require(["../../requirejs/config.js"+"?v="+new Date().getTime(),"../../../assets/jquery/jquery/jquery"],function(config){
	var module = $("body").attr("data-module");
	require(["modules/"+module+"/"+module+"_main"]);
});