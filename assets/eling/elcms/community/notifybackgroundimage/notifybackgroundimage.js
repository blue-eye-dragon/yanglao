define(function(require,exports,module){
	var ELView=require("elview");
	var template=require("./notifybackgroundimage.tpl");
	var Subnav=require("subnav-1.0.0");
	require("jquery.ajaxfileupload");
	
	var NotifyBackgroundImage=ELView.extend({
		attrs:{
			template:template
		},
		events:{
			"change #J-fileupload" : function(e){
				this.fileUpload($(e.target).attr("data-key"),$(e.target).attr("data-type"));
			}
		},
		fileUpload:function(mark,type){
			var url="api/attachment/background/"+mark;
			$.ajaxFileUpload({
                url:url, 
                secureuri:false,
                fileElementId:'J-fileupload',
                dataType: 'json',
                success: function (data){
                	if(data.msg=="success"){
                		$(".J-"+type+"-picture").attr("src",url);
                	}
                }
            });
		},
		initComponent:function(){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"通知背景图设置",
					buttons:[{
						id:"half",
						text:"纯文字公告半屏背景图上传",
						handler:function(){
							$("#J-fileupload").attr("data-key","notifyhalf");
							$("#J-fileupload").attr("data-type","half");
							$("#J-fileupload").click();
						}
					},{
						id:"full",
						text:"纯文字公告全屏背景图上传",
						handler:function(){
							$("#J-fileupload").attr("data-key","notifyfull");
							$("#J-fileupload").attr("data-type","full");
							$("#J-fileupload").click();
						}
					},{
						id:"activity",
						text:"活动室环境监控背景图上传",
						handler:function(){
							$("#J-fileupload").attr("data-key","activityhalf");
							$("#J-fileupload").attr("data-type","activity");
							$("#J-fileupload").click();
						}
					}]
				}
			});
		}
	});
	
	module.exports=NotifyBackgroundImage;
});