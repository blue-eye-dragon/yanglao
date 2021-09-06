/**
 * 消息推送设置
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Verform=require("form-2.0.0")
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var enmu = require("enums");
	
    var template="<div class='J-subnav'></div>"+
    		"<div class='J-grid' ></div>"+ 
    		"<div class='J-infopushsettingform hidden' ></div>";
	var InfoPushSetting = ELView.extend({
		events:{
			"change select.J-form-infopushsetting-select-targetType" : function(e){ 
				var  targetType = this.get("infopushsettingform").getValue("targetType");
				if(targetType=="Role"){
					this.get("infopushsettingform").show("toRole"); 
					this.get("infopushsettingform").setLabel("toRole","角色");
					this.get("infopushsettingform").hide("toUser"); 
				}else if(targetType=="User"){
					this.get("infopushsettingform").show("toUser"); 
					this.get("infopushsettingform").setLabel("toUser","用户");
					this.get("infopushsettingform").hide("toRole");
				}else{
					this.get("infopushsettingform").hide("toRole");
					this.get("infopushsettingform").hide("toUser"); 
				}
			}
		}, 
		attrs:{
			template:template
		},
		initComponent : function(params,widget) { 
    		 var subnav=new Subnav({
    			 parentNode:".J-subnav",
    			 model:{
 					title:"消息推送设置",
 					items:[{
 						id:"search",
 				       type:"search",
 				       handler:function(str) { 
 	 	            	   widget.get("grid").loading();
 	 						aw.ajax({
 	 							url:"api/infopushsetting/search",
 	 							data:{
 	 								s:str, 
 	 								properties:"*,toRole.name,toUser.name,setter.name",         
 	 							    fetchProperties:"*,toRole.name,toUser.name,setter.name"          
 	 							},
 	 							dataType:"json",
 	 							success:function(data){
 	 								widget.get("grid").setData(data);
 	 								widget.show(".J-grid,.J-search").hide(".J-infopushsettingform,.J-return"); 
 	 							}
 	 						});
 	 					}

 					},{
 						    id:"return",
	  						text:"返回",
	  						type:"button",
	  						show:false,
	  						handler:function(){
	  							widget.show(".J-grid,.J-search,.J-targetType,.J-serviceType").hide(".J-infopushsettingform,.J-return");
	  							return false;
	  						}
 					},{
						 id:"targetType", 
						  type:"buttongroup",
						  showAll:true,
						  showAllFirst:true,
						  items:enmu["com.eling.elcms.basedoc.model.TargetType"],
							handler:function(key,element){
								widget.get("grid").refresh(); 
							}
					},{

						 id:"serviceType", 
						  type:"buttongroup",
						  showAll:true,
						  showAllFirst:true,
						  items:enmu["com.eling.elcms.community.model.InfoPushSetting.ServiceType"],
						  handler:function(key,element){
							widget.get("grid").refresh(); 
						  }
					
					}]
                 }
    		 });
    		 this.set("subnav",subnav);
    		 
    		 var grid=new Grid({
    			parentNode:".J-grid",
 				url :"api/infopushsetting/query", 
 				fetchProperties:"*,toRole.name,toUser.name,setter.name",
 				params:function(){
 					return { 
 						targetType:widget.get("subnav").getValue("targetType"),  
 						serviceType:widget.get("subnav").getValue("serviceType"),  
					}; 
				},
 				model:{
 					columns:[{
 						key:"description",
 						name:"描述"
 					},{
 						key:"serviceType.value",
 						name:"业务类型"
 					},{
 						key:"targetType.value",
 						name:"推送目标类型"
 					},{
 						key:"toRole.name",
 						name:"推送到角色"
 					},{
 						key:"toUser.name",
 						name:"推送到人"
 					},{
 						key:"settingDate",
 						name:"设置日期",
 						format:"date",
 						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
 					},{
 						key:"setter.name",
 						name:"设置人"
 					},{
						key:"operate",
						name:"操作", 	
						format:"button",
						formatparams:[{
							key:"setting",
							text:"设置",
							handler:function(index,data,rowEle){ 
								widget.hide(".J-grid,.J-search,.J-targetType,.J-serviceType").show(".J-infopushsettingform,.J-return");
								widget.get("infopushsettingform").reset();
								if(data.targetType&&data.targetType.key=="Role"){
									widget.get("infopushsettingform").show("toRole"); 
									widget.get("infopushsettingform").setLabel("toRole","角色"); 
									widget.get("infopushsettingform").setValue("toRole",data.toRole);
								}else if(data.targetType&&data.targetType.key=="User"){
									widget.get("infopushsettingform").show("toUser");    
									widget.get("infopushsettingform").setLabel("toUser","用户");
									widget.get("infopushsettingform").setValue("toUser",data.toUser);
								}
								widget.get("infopushsettingform").setValue("targetType",data.targetType);
								widget.get("infopushsettingform").setValue("description",data.description);
								widget.get("infopushsettingform").setValue("pkInfoPushSetting",data.pkInfoPushSetting);
								widget.get("infopushsettingform").setValue("version",data.version);
								return false;
							}
						}]					
 					}]
 				}
    		 });
    		 this.set("grid",grid);
    

 			 var infopushsettingform=new Verform({
				parentNode:".J-infopushsettingform",
			   	saveaction:function(){
		                    aw.saveOrUpdate("api/infopushsetting/save",$("#infopushsetting").serialize(),function(data){
							widget.get("grid").refresh({
								pkInfoPushSetting:data.pkInfoPushSetting
							});  
							$(".J-infopushsettingform,.J-return").addClass("hidden"); 
							$(".J-grid,.J-search").removeClass("hidden"); 
						}); 	  
 				},
				//取消按钮
  				cancelaction:function(){
  					widget.show(".J-grid,.J-search,.J-targetType,.J-serviceType").hide(".J-infopushsettingform,.J-return");
  				},
				model:{
					id:"infopushsetting",
					items:[{
						name:"description",
						label:"描述",
						readonly:true
					},{
						name:"targetType",
						label:"推送目标类型",
						type:"select",
						url:"api/enum/com.eling.elcms.basedoc.model.TargetType",
						validate:["required"]
					},{
						name:"toRole", 
						key:"pkRole",
						value:"name",
						label:"角色",
						url:"api/role/query",    
						params:{
							fetchProperties:"pkRole,name" 
						},
						type:"select",
						validate:["required"],
						show:false
					},{
						name:"toUser", 
						key:"pkUser",
						value:"name",
						label:"用户",
						url:"api/users*", //TODO 用户角色：wulina
						params:{
							fetchProperties:"pkUser,name" 
						},
						type:"select",
						validate:["required"],
						show:false
					},{
						name:"pkInfoPushSetting",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					}]
				}		
			});
			this.set("infopushsettingform",infopushsettingform);
   
    	 },
	});
	module.exports = InfoPushSetting;
});
