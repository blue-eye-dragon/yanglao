define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var Dialog = require("dialog-1.0.0");
	
	var HealthExamDataType = BaseView.extend({	
		initSubnav:function(widget){
			return {
				model:{
					title:"健康数据类型",
					search : function(str) {
						var g=widget.get("list");
						 subnav=widget.get("subnav");
						g.loading();
						aw.ajax({
							url:"api/healthexamdatatype/search",
							data:{
								s:str,
								properties:"name,name1,name2,name3,name4,name5,name6",
								
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
					buttons:[{
						id:"all",
						text:"全部",
						handler:function(){
							widget.get("list").refresh();
						}
					},{
						id:"add",
						text:"新增",
						handler:function(){
							widget.list2Card(true);
							subnav=widget.get("subnav");
							subnav.hide(["all","add"]).show(["return"]);
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.list2Card(false);
							subnav=widget.get("subnav");
							subnav.show(["all","add"]).hide(["return"]);
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/healthexamdatatype/query",	
				model:{
					columns:[{
						col:"1",
						key:"name",
						name:"名称"					
					},{
						col:"1",
						key:"name1",
						name:"测量值1的名称"					
					},{
						col:"1",
						key:"name2",
						name:"测量值2的名称"					
					},{
						col:"1",
						key:"name3",
						name:"测量值3的名称"					
					},{
						col:"1",
						key:"name4",
						name:"测量值4的名称"					
					},{
						col:"1",
						key:"name5",
						name:"测量值5的名称"					
					},{
						col:"1",
						key:"name6",
						name:"测量值6的名称"					
					},{
						col:"4",
						key:"description",
						name:"描述 "					
					},{
						col:"1",
 						key:"preset",
						name:"操作",
						format:function(value,row){
							if(value){
								return "系统数据";
							}else{
								return "button";
							}
    					},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
								widget.get("subnav").hide(["all","add"]).show(["return"]);
								if(data.inputNumeric1){
									if(data.inputNumeric1 != "false"){
										$(".J-form-healthexamdatatype-checklist-inputNumeric1").prop("checked",true);
									}
								}
								if(data.inputNumeric2){
									if(data.inputNumeric2 != "false"){
										$(".J-form-healthexamdatatype-checklist-inputNumeric2").prop("checked",true);
									}
								}
								if(data.inputNumeric3){
									if(data.inputNumeric3 != "false"){
										$(".J-form-healthexamdatatype-checklist-inputNumeric3").prop("checked",true);
									}
								}
								if(data.inputNumeric4){
									if(data.inputNumeric4 != "false"){
										$(".J-form-healthexamdatatype-checklist-inputNumeric4").prop("checked",true);
									}
								}
								if(data.inputNumeric5){
									if(data.inputNumeric5 != "false"){
										$(".J-form-healthexamdatatype-checklist-inputNumeric5").prop("checked",true);
									}
								}
								if(data.inputNumeric6){
									if(data.inputNumeric6 != "false"){
										$(".J-form-healthexamdatatype-checklist-inputNumeric6").prop("checked",true);
									}
								}
								
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/healthexamdatatype/" + data.pkHealthExamDataType + "/delete");
							}
						}]
 					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					var card = widget.get("card");
					var data = card.getData();
					if(data.inputNumeric1[0]== undefined){
						data.inputNumeric1[0]=false;
					}
					if(data.name2){
						if(data.inputNumeric2[0]== undefined){
							data.inputNumeric2[0]=false;
						}
					}
					if(data.name3){
						if(data.inputNumeric3[0]== undefined){
							data.inputNumeric3[0]=false;
						}
					}
					if(data.name4){
						if(data.inputNumeric4[0]== undefined){
							data.inputNumeric4[0]=false;
						}
					}
					if(data.name5){
						if(data.inputNumeric5[0]== undefined){
							data.inputNumeric5[0]=false;
						}
					}
					if(data.name6){
						if(data.inputNumeric6[0]== undefined){
							data.inputNumeric6[0]=false;
						}
					}
					widget.save("api/healthexamdatatype/save",aw.customParam(data),function(data){
						widget.get("list").refresh();
						widget.get("subnav").show(["all","add"]).hide(["return"]);
					});
				},
				//取消按钮
  				cancelaction:function(){
  					widget.get("subnav").show(["all","add"]).hide(["return"]);
					widget.list2Card(false);
  				},
				model:{
					id:"healthexamdatatype",
					validate:{
						position:"bottom"
					},
					items:[{
						name:"pkHealthExamDataType",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"名称",
						validate:["required"],
        				className:{
							container:"col-md-6",
							label:"col-md-5"
						}
					},{
						name:"description",
						label:"描述",
        				className:{
							container:"col-md-6",
							label:"col-md-3"
						}
					},{
						name:"name1",
						label:"测量值1的名称",
						validate:["required"],
        				className:{
							container:"col-md-6",
							label:"col-md-5"
						}
					},{
        				name:"inputNumeric1",
        				label:"",
        				type:"checklist",
        				list:[{
        					key:true,
        					value:"是否数字"
        				}],
        				className:{
							container:"col-md-4",
							label:"col-md-1"
						}
					},{
						name:"name2",
						label:"测量值2的名称",
        				className:{
							container:"col-md-6",
							label:"col-md-5"
						}
					},{
        				name:"inputNumeric2",
        				label:"",
        				type:"checklist",
        				list:[{
        					key:true,
        					value:"是否数字"
        				}],
        				className:{
							container:"col-md-4",
							label:"col-md-1"
						}
					},{
						name:"name3",
						label:"测量值3的名称",
        				className:{
							container:"col-md-6",
							label:"col-md-5"
						}
					},{
        				name:"inputNumeric3",
        				label:"",
        				type:"checklist",
        				list:[{
        					key:true,
        					value:"是否数字"
        				}],
        				className:{
							container:"col-md-4",
							label:"col-md-1"
						}
					},{
						name:"name4",
						label:"测量值4的名称",
        				className:{
							container:"col-md-6",
							label:"col-md-5"
						}
					},{
        				name:"inputNumeric4",
        				label:"",
        				type:"checklist",
        				list:[{
        					key:true,
        					value:"是否数字"
        				}],
        				className:{
							container:"col-md-4",
							label:"col-md-1"
						}
					},{
						name:"name5",
						label:"测量值5的名称",
        				className:{
							container:"col-md-6",
							label:"col-md-5"
						}
					},{
        				name:"inputNumeric5",
        				label:"",
        				type:"checklist",
        				list:[{
        					key:true,
        					value:"是否数字"
        				}],
        				className:{
							container:"col-md-4",
							label:"col-md-1"
						}
					},{
						name:"name6",
						label:"测量值6的名称",
        				className:{
							container:"col-md-6",
							label:"col-md-5"
						}
					},{
        				name:"inputNumeric6",
        				label:"",
        				type:"checklist",
        				list:[{
        					key:true,
        					value:"是否数字"
        				}],
        				className:{
							container:"col-md-4",
							label:"col-md-1"
						}
					},{
						name:"preset",
						type:"hidden",
						defaultValue:"false"
					}]
				}
			};
		}
	});
	module.exports = HealthExamDataType;
});