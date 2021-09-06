define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Verform=require("form-1.0.0");
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
    var template="<div class='J-subnav'></div>"+
    		"<div class='J-grid' ></div>"+ 
    		"<div class='J-shackapplyapprovesettingform hidden' ></div>";
	var ShackApplyApproveSetting = ELView.extend({
		attrs:{
			template:template
		},
		initComponent : function(params,widget) { 
    		 var subnav=new Subnav({
    			 parentNode:".J-subnav",
    			 model:{
 					title:"暂住申请审批设置",
 					items:[{
 						 id:"adds",
  					    text:"新增",
  					    type:"button",
  					    handler:function(){  
  							$(".J-grid,.J-adds").addClass("hidden");
  							$(".J-shackapplyapprovesettingform").removeClass("hidden");	   
  							widget.get("shackapplyapprovesettingform").reset();		
  							return false;
  						}
 					}], 
                 }
    		 });
    		 this.set("subnav",subnav);
    		 
    		 var grid=new Grid({
    			parentNode:".J-grid",
 				url :"api/shackapplyapprovesetting/query", 
 				fetchProperties:"*,approver.name",
 				model:{
 					columns:[{
 						key:"days",
 						name:"大于等于的暂住天数"
 					},{
 						key:"approver.name",
 						name:"审批人"
 					},{
						key:"operate",
						name:"操作", 	
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){ 
								$(".J-grid,.J-adds").addClass("hidden");
								$(".J-shackapplyapprovesettingform").removeClass("hidden");
								widget.get("shackapplyapprovesettingform").reset();
								widget.get("shackapplyapprovesettingform").setData(data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/shackapplyapprovesetting/" + data.pkShackApplyApproveSetting + "/delete",function(){
		 	 						widget.get("grid").refresh();
		 	 					});
							}						
						}]					
 					}]
 				}
    		 });
    		 this.set("grid",grid);
    

 			 var shackapplyapprovesettingform=new Verform({
				parentNode:".J-shackapplyapprovesettingform",
			   	saveaction:function(){
		                    aw.saveOrUpdate("api/shackapplyapprovesetting/save",$("#shackapplyapprovesetting").serialize(),function(){
							widget.get("grid").refresh();  
							$(".J-shackapplyapprovesettingform").addClass("hidden"); 
							$(".J-grid,.J-adds").removeClass("hidden"); 
						}); 	  
 				},
				//取消按钮
  				cancelaction:function(){
  						$(".J-shackapplyapprovesettingform").addClass("hidden"); 
  						$(".J-grid,.J-adds").removeClass("hidden");  		
  				},
				model:{
					id:"shackapplyapprovesetting",
					items:[{
						name:"days",
						label:"大于等于的暂住天数",			
						validate:["required"]
					},{
						name:"approver",
						key:"pkUser", 
						value:"name",
						label:"审批人",
						url:"api/shackapplyapprovesetting/queryCommunityAdministrator",  
						params:{
							fetchProperties:"pkUser,name"
						},
						type:"select",
						validate:["required"]
					},{
						name:"pkShackApplyApproveSetting",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					}]
				}		
			});
			this.set("shackapplyapprovesettingform",shackapplyapprovesettingform);
   
    	 },
	});
	module.exports = ShackApplyApproveSetting;
});
