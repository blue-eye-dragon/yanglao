define(function(require,exports,module){
	var EditGrid=require("editgrid-1.0.0");
	var aw = require("ajaxwrapper");
	var Dialog = require("dialog-1.0.0");
	
	var utils={
		init:function(params,widget){
			return new EditGrid({
				parentNode:".J-paper",
				url:"api/buymedicineapplication/checkquery",
				params:function(){
					return{
						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
					 	checked:"false",
					 	eagerFetchProperties:"buyMedicinePapers,items",
					}
				},
				model:{
					isCheckbox:true,
					head:{
						title:"核对证件",
						buttons:[{
							id:"add",
							icon:"icon-save",
							handler:function(){
								var old=widget.get("grid1").getSelectedData();
								if(old.length==0){
									Dialog.alert({
		                        		title:"提示",
		                        		content:"请先选择核对记录！"
		                        	});
									return;
								}
								var pkTypes="";
		                     	for(var i=0; i<old.length;i++){
		                     		pkTypes+=old[i].pkBuyMedicinePaer+",";
		                     	}
		                     	Dialog.alert({
	                        		title:"提示",
	                        		showBtn:false,
	                        		content:"正在保存，请稍后……"
	                        	});
		                         aw.ajax({
		                             url : "api/buymedicineapplication/paperschecked",
		                             type : "POST",
		                             data : {
		                            	 pkTypes:pkTypes,
		                             },
		                             success : function(data){
		                            	 Dialog.close();
		                            	 widget.hide([".J-paper"]).show([".J-grid"]);
		                            	 widget.get("subnav").hide(["return"]).show(["checkticket","checkmedicine","checkpaper","datatype","building"]);
		                            	 widget.get("grid").refresh(null,function(){
		                            		 widget.getTotalMny();
		                            	 });
		                            	 widget.get("grid1").refresh();
		                             }
		                         });
							}
						}]
					},
					columns:[{
		                key:"number",
		                name:"房间号"
					},{
		                key:"name",
		                name:"姓名"
					},{
						key:"papersname",
		                name:"证件核对"
					}]
				}
			});
		}
	};
	
	module.exports=utils;
});