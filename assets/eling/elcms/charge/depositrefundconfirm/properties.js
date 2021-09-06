define(function(require,exports,module){
	var Properties={
		customize_title : function(widget){
			if(widget.get("params")&&widget.get("params").customize&&widget.get("params").customize=="qinheyuan"){
				//亲和源环境
				return "预约金退款确认";
			}
			if(widget.get("params")&&widget.get("params").customize&&widget.get("params").customize=="linxuan"){
				//海宁林轩环境
				return "订金退款确认";
			}
		},
	}
	module.exports=Properties;
});