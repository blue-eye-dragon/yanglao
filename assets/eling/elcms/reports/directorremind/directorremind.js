define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw=require("ajaxwrapper");
	var template=require("./directorremind.tpl");
	
	var directorremind = ELView.extend({
		attrs:{
			template:template,
			model : {}
		},
		
		initComponent:function(params,widget){		
			var model=this.get("model");
			var subnav=new Subnav({
				parentNode:".J-subnav",
					model:{
						title:"",
					}
			});
			this.set("subnav",subnav);
		},
		afterInitComponent:function(params,widget){
			var model=widget.get("model");
			if(params){
				var remindType = params.remindType;
				if("patient" == remindType){
					widget.get("subnav").setTitle("楼栋理事提醒（住院）");
				}else if("birth" == remindType){
					widget.get("subnav").setTitle("楼栋理事提醒（生日）");
				}else{
					widget.get("subnav").setTitle("楼栋理事提醒（外出）");
				}
				aw.ajax({
					url : "api/directorremind/query",
					type : "POST",
					data : {
						"remindType":remindType
					},
					dataType:"json",
					success:function(data){

						/*var arr = new Array();
						arr[0] = data[0]+data[0].memberInfos[0];
						for(var i=0;i<data[0].memberInfos.length;i++){
							arr[i+1] = data[0].memberInfos[i+1];
						}*/
						model.data=data;
						widget.renderPartial(".J-grid-table");
					}
				});
			}
		}
	});
	module.exports = directorremind;
});