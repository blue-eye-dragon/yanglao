/**
 * 事项处理
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Form=require("form")
	var Form2=require("form-2.0.0")
	var Dialog=require("dialog");
	var enums  = require("enums");
	var Grid=require("grid");
	var store = require("store");
	var activeUser = store.get("user");
	require("../../../grid_css.css");
	var MatterProcessesGrid = require("./asset/matterprocessesgrid");
	var formtpl = require("../form2.tpl");
	var fetchProperties ="pkMatter," +
		"version," +
			"title," +
			"createTime," +
			"beginTime," +
			"sender.pkUser," +
			"sender.name," +
			"planFinishTime," +
			"finishTime," +
			"importance," +
			"processDuration," +
			"matterType," +
			"matterStatus," +
			"matterResult," +
			"content," +
			"fileName," +
			"richTextEditor," +
			"matterProcesses.pkMatterProcess," +
			"matterProcesses.sequenceNumber," +
			"matterProcesses.finishTime," +
			"matterProcesses.user.pkUser," +
			"matterProcesses.user.name," +
			"matterProcesses.user.version," +
			"matterProcesses.content," +
			"matterProcesses.status," +
			"matterProcesses.version";
	
	
    var template="<div class= 'el-newmatter'>" +
    		"<div class='J-subnav'></div>"+
    		"<div class='J-grid' ></div>"+
    		"<div class='J-form hidden' ></div>" +
    		"<div class='J-mpgrid hidden' ></div>" +
    		"</div>";
	
	var matterhandle = ELView.extend({
		events:{
		
		}, 
		attrs:{
			template:template
		},
		 getMpForm:function(data,widget){
				var mpform =new Form2({
					defaultButton:false,
					model:{
						id:"mpform",
						defaultButton:false,
						items:[{
							name:"pkMatterProcess",
							type:"hidden",
							defaultValue:data.pkMatterProcess,
						},{
							name:"version",
							type:"hidden",
							defaultValue:data.version || 0,
						},{
							name:"user",
							type:"hidden",
							defaultValue:data.user.pkUser,
						},{
							name:"name",
							label:"审批人",
							defaultValue:data.user.name || "",
							readonly:true,
							validate:["required"]
						},{
							name:"finishTime",
							label:"处理时间",
							defaultValue:moment.valueOf(),
							type:"date",
							readonly:true,
							validate:["required"]
						},{
							name:"status",
							label:"处理结果",
							type : "select",
							options:[{
								key:"Read",
								value:"已阅"
							},{
								key:"Pass",
								value:"通过"
							},{
								key:"NotPass",
								value:"驳回"
							},{
								key:"Plus",
								value:"加签"
							}],
							defaultValue:"Read",
							validate:["required"]
						},{
							name:"content",
							label:"审批意见",
							type : "textarea",
							defaultValue:"同意",
							validate:["required"]
						},{
							name:"plusChecker",
		     				label:"加签人",
		     				lazy:true,
		     				show:false,
		     				key:"pkUser",
		     				type:"select",
		     				url:"api/users/nofreeze",//TODO 用户角色：wulina
		     				params:{
									fetchProperties:"pkUser,name,version",
									seal:false
								}, 
		     				value:"name"
						}]
					}
				});
				widget.set("mpform",mpform);
				return mpform;
			},
		initComponent : function(params,widget) {
    		 var subnav=new Subnav({
    			 parentNode:".J-subnav",
    			 model:{
 					title:"代办事项",
 					items:[{
 						id:"search",
 						type:"search",
 						placeholder:"标题",
 						handler:function(str){
							var g = widget.get("grid");
							aw.ajax({
								url:"api/matter/search",
								data:{
									s:str,
									searchProperties:"title,send.name,fileName,matterResult,matterType,importance",
									fetchProperties:fetchProperties
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
 						}
 					},{
	   					 id : "importance",
						 type : "buttongroup",
						 tip : "重要程度",
						 items:enums["com.eling.elcms.oa.matter.model.Matter.Importance"],
						 all : {
								show : true,
								text : "全部"
							 },
						 handler : function(key,value){
							widget.get("grid").refresh();
						 }
 						
 					},{
	   					 id : "matterType",
						 type : "buttongroup",
						 tip : "事项类型",
						 items:enums["com.eling.elcms.oa.matter.model.Matter.MatterType"],
						 all : {
								show : true,
								text : "全部"
							 },
						 handler : function(key,value){
							widget.get("grid").refresh();
						 }
 					},{
 						id:"return",
 						text:"返回",
 						show:false,
 						type:"button",
 						handler:function(){
 							widget.get("subnav").show(["search","importance","matterType"]).hide(["return","subflow","subhandle"]);
							widget.show([".J-grid"]).hide([".J-form",".J-mpgrid"]);
 						}
 					},{
 						id:"subflow",
 						text:"流程日志",
 						show:false,
 						type:"button",
 						handler:function(){
							widget.get("subnav").hide(["search","importance","matterType","subhandle","subflow"]).show(["return"]);
							widget.show([".J-mpgrid"]).hide([".J-form",".J-grid"]);
 						}
 					}]
                 }
    		 });
    		 this.set("subnav",subnav);
    		 
    		 var grid=new Grid({
    			parentNode:".J-grid", 
 				url :"api/matter/queryUndo",
				params:function(){
					var subnav =widget.get("subnav");
					return {
						fetchProperties:fetchProperties,
						importance:subnav.getValue("importance"),
						matterType:subnav.getValue("matterType"),
						pkUser:activeUser.pkUser
					};
				},
 				model:{
 					columns:[{
 						name:"title",
 						label:"标题",
 						className:"twoColumn"
 					},{
 						name:"fileName",
 						label:"附件",
 						format:"detail",
						className:"twoColumn",
						formatparams:{
                            handler:function(index,data,rowEle){
                            	var url = "api/attachment/matter/file/"+data.pkMatter ;
                            	var el = document.createElement("a");
                            	document.body.appendChild(el);
                            	el.href = url; //url 是你得到的连接
                            	el.target = '_new'; //指定在新窗口打开
                            	el.click();
                            	document.body.removeChild(el);
                            }
						}
 						
 					},{
 						name:"sender.name",  
 						label:"发起人",
 						className:"oneColumn"
 					},{
 						name:"beginTime",  
 						label:"发起时间",
 						format:"date",
 						className:"oneColumn"
 					},{
 						name:"beginTime",  
 						label:"接受时间",
 						format:"date",
 						className:"oneColumn"
 					},{
 						name:"importance.value",  
 						label:"重要程度",
 						className:"oneColumn"
 					},{
 						name:"processDuration.value",  
 						label:"流程期限",
 						className:"oneColumn"
 					},{
 						name:"matterType.value",  
 						label:"事项类型",
 						className:"oneColumn"
 					},{
 						name:"operate",
 						label:"操作",
 						format:"button",
 						formatparams:[{
 							key:"gridflow", 
 							text:"流程日志",
 							handler:function(index,data,rowEle){
 								widget.get("matterprocessesgrid").refersh();
 								widget.get("subnav").hide(["search","importance","matterType","subhandle","subflow"]).show(["return"]);
 								widget.show([".J-mpgrid"]).hide([".J-form",".J-grid"]);
 								
 							}
 						},{
 							key:"gridhandle", 
 							text:"处理",
 							handler:function(index,data,rowEle){
 								var form =widget.get("form");
 								widget.get("subnav").hide(["search","importance","matterType"]).show(["return","subhandle","subflow"]);
 								widget.show([".J-form"]).hide([".J-mpgrid ",".J-grid"]);
 								widget.get("matterprocessesgrid").refersh();
 								form.setData(data);
 								form.setDisabled(true);
 								widget.get("form").getPlugin("richTextEditor").setHeight(300);
 							}
 						}]
 					}]
 				}
    		 });
    		 this.set("grid",grid);
       
    		 //form表单
 			 var form = new Form({
				parentNode:".J-form",
				model:{
					id:"matterform",
					defaultButton:false,
					layout:formtpl,
					items:[{
						name:"pkMatter",
						type:"hidden"
					},{
						name:"version",
						defaultValue:0,
						type:"hidden"
					},{
						name:"title",
					},{
						name:"importance",
	    				type:"select",
	    				options:enums["com.eling.elcms.oa.matter.model.Matter.Importance"],
	    				defaultValue:"Normal"
					},{
						name:"processDuration",
	    				type:"select",
	    				options:enums["com.eling.elcms.oa.matter.model.Matter.ProcessDuration"]
					},{
						name:"matterType",
	    				type:"select",
	    				options:enums["com.eling.elcms.oa.matter.model.Matter.MatterType"]
					},{
						name:"matterStatus",
						type:"select",
	    				options:enums["com.eling.elcms.oa.matter.model.Matter.MatterStatus"]
					},{
						name:"createUser",
	    				type:"select",
	    				keyField:"pkUser",
	    				valueField:"name",
	    				url : "api/users/nofreeze",
						params : function(){
							return {
								fetchProperties:
									"pkUser," +
									"name"
							}
						}
					},{
						name:"createTime",
						type:"date"
					},{
						name:"beginTime",
						type:"date"
					},{
						name:"fileName",
					},{ 
						name:"content",
						type:"textarea" 
					},{ 
						name:"richTextEditor",
						type:"richtexteditor"
					}]
				}
			});
			this.set("form",form); 
			
			this.set("matterprocessesgrid",MatterProcessesGrid.init(this,params));
    	 },
	});
	module.exports = matterhandle;
});
