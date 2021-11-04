/**
 * 摄像头列表
 */
define(function(require, exports, module) {
	var aw = require("ajaxwrapper");
    var ELView=require("elview");
    var Dialog=require("dialog");
	var Subnav = require("subnav"); 
    var template = require("./hkmonitor.tpl");
    require("./hkmonitor.css");
	var hkmonitor = ELView.extend({
		attrs:{
        	template:template,
        	model : {
        		data:{}
        	},
        },
        events : {
	        "click .J-cameralist ul li" : function(e){
	        	var pkMonitor=$(e.target).attr("data-key");
	        	 aw.ajax({
						url: "api/monitor/query",
						data : {
							pkMonitor:pkMonitor,
							fetchProperties:"monitor.coordinate,monitor.pkMonitor,monitor.name,monitor.ip,monitor.port,monitor.password,monitor.description,base64Urlmain,serverUrl"
	                    },
						success: function(data){
							$("iframe").attr("src",data[0].serverUrl+"/video/player/"+data[0].base64UrlSub+".do");
							$(".J-video h3").text(data[0].monitor.name || 0);
							$(".J-video h3").prepend("<img src='assets/eling/elcms/hkmonitor/assets/jjbj-shexiang.png'>");
						}
				});
	        }
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"摄像头列表",
					items:[],
				}
			});
			this.set("subnav",subnav);
		  },
		  afterInitComponent : function(params,widget){
			  aw.ajax({
					url: "api/monitor/query",
					data : {
						fetchProperties:"monitor.coordinate,monitor.pkMonitor,monitor.name,monitor.ip,monitor.port,monitor.password,monitor.description,base64Urlmain,serverUrl"
                    },
					success: function(data){
						$("iframe").attr("src",data[0].serverUrl+"/video/player/"+data[0].base64UrlSub+".do");
						data.size = data.length;
						widget.get("model").data = data;
						widget.renderPartial(".J-cameralist");
						$(".J-video h3").text(data[0].monitor.name || 0);
						$(".J-video h3").prepend("<img src='assets/eling/elcms/hkmonitor/assets/jjbj-shexiang.png'>")
					}
				});
		  }
	});
	module.exports = hkmonitor;
});
