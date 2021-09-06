/**
 * 汇报关系
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Form=require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
	var Grid=require("grid-1.0.0");
	require("../../../grid_css.css");
	
    var template="<div class='J-subnav'></div>"+
    		"<div class='J-grid ' ></div>"+
    		"<div class='J-form hidden' ></div>";
	
	var reportrelation = ELView.extend({
		events:{}, 
		attrs:{
			template:template
		},
		initComponent : function(params,widget) {
    		 var subnav=new Subnav({
    			 parentNode:".J-subnav",
    			 model:{
 					title:"汇报关系设置",
 					items:[{
 						id:"add",
 						text:"新增",
 						type:"button",
 						handler:function(){
 							widget.get("subnav").hide(["add"]).show(["return"]);
 							widget.hide([".J-grid"]).show([".J-form"]);
 							widget.get("form").reset();
 							widget.get("form").setAttribute("createDate","disabled","disabled");
 							return false;
 						}
 					},{
 						id:"return",
 						text:"返回",
 						show:false,
 						type:"button",
 						handler:function(){
 							widget.get("subnav").show(["add"]).hide(["return"]);
 							widget.show([".J-grid"]).hide([".J-form"]);
 							widget.get("grid").refresh();
 							return false;
 						}
 					}]
                 }
    		 });
    		 this.set("subnav",subnav);
    		 
    		 var grid=new Grid({
    			parentNode:".J-grid", 
 				url :"api/reportrelation/query",
 				fetchProperties:"name," +
 						"userTo.name," +
 						"userTo.pkUser," +
 						"userFrom.name," +
 						"userFrom.pkUser," +
 						"description," +
 						"createDate," +
 						"version," +
 						"pkReportRelation",
 						params:function(){
 							return {};
 						},
 				model:{
 					columns:[{
 						key:"name",
 						name:"汇报关系名称",
 						className:"twoColumn"
 					},{
 						key:"userTo.name",  
 						name:"汇报对象",
 						className:"twoColumn"
 					},{
 						key:"userFrom.name",  
 						name:"汇报人",
 						className:"twoColumn"
 					},{
 						key:"description",  
 						name:"备注",
 						className:"twoColumn"
 					},{
 						key:"operate",
 						name:"操作",
 						className:"oneColumn",
 						format:"button",
 						formatparams:[{
 							key:"detil",
 							icon:"edit",
 							handler:function(index,data,rowEle){
 								widget.get("form").setData(data);
 								widget.get("subnav").hide(["add"]).show(["return"]);
 	 							widget.hide([".J-grid"]).show([".J-form"]);
 							}
 						},{
 							key:"delete",
 							icon:"remove",
 							handler:function(index,data,rowEle){
 								aw.del("api/reportrelation/" + data.pkReportRelation + "/delete",function(data) {
 									  widget.get("grid").refresh();
 								});
 							}
 						}]
 					}]
 				}
    		 });
    		 this.set("grid",grid);
       
    		 //form表单
 			 var form = new Form({
				parentNode:".J-form",
			   	saveaction:function(){
           		 	aw.saveOrUpdate("api/reportrelation/save",$("#reportrelation").serialize(),function(){						
						widget.get("grid").refresh(); 
						widget.show(".J-grid").hide(".J-form");
						widget.get("subnav").hide("return").show("add");
           		 		});
					},
				//取消按钮
  				cancelaction:function(){
  					widget.show(".J-grid").hide(".J-form");
					widget.get("subnav").hide("return").show("add");
  				},
				model:{
					id:"reportrelation",
					items:[{
						name:"name",
						label:"汇报关系名称",
						validate:["required"],
						exValidate: function(value){
							if(value.length>15){
								return "不能超过15个字符";
							}else{
								return true;
							}
						}
					},{
						name:"userTo",
						label:"汇报对象",
						type:"select",
	    				key:"pkUser",
	    				url:"api/users",//TODO 用户角色：wulina
	    				params:{
							fetchProperties:"pkUser,name"
						},
						value:"name",
						validate:["required"]
					},{
						name:"userFrom",
						label:"汇报人",
						type:"select",
	    				key:"pkUser",
	    				url:"api/users",//TODO 用户角色：wulina
	    				params:{
							fetchProperties:"pkUser,name"
						},
						value:"name",
						validate:["required"]
					},{
						name:"createDate",
						label:"创建时间",
						type:"date",
						defaultValue:moment()
					},{ 
						name:"description",
						label:"备注",
						type:"textarea" 
					},{
						name:"version", 
						defaultValue:"0",
						type:"hidden"
					},{
						name:"pkReportRelation",
						type:"hidden"
					}]
				}
			});
			this.set("form",form); 
    	 },
	});
	module.exports = reportrelation;
});
