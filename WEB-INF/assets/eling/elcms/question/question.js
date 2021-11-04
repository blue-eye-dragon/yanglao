define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var store=require("store");
	var Grid = require("grid");
	var Form =require("form");
	var enmu = require("enums");
	var EditGrid=require("editgrid");
	require("./grid.css");
	var fetchProperties="pkQuestion," +
			"name," +
			"questionnaireType.pkQuestionnaireType," +
			"questionnaireType.name," +
			"type," +
			"description," +
			"version," +
			"optionCells.pkOptionCell," +
			"optionCells.sequence," +
			"optionCells.context," +
			"optionCells.score," +
			"optionCells.version" ;
	
	
	var template="<div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+ 
		"<div class='J-form hidden'></div>"+
		"<div class='J-optiongrid hidden'></div>";
	var Question = ELView.extend({
		events:{
			"click .J-options-detail":function(e){
				var widget = this;
				widget.show([".J-optiongrid",".J-form"]).hide([".J-grid"]);
				widget.get("subnav").hide(["add","search"]).show(["return"]);
				
				var grid = this.get("grid");
				var index = grid.getIndex(e.target);
				var data = grid.getData(index);
				
				//设置主表
				widget.get("form").setData(data);
				widget.get("form").setDisabled(true);
				
				//设置子列表
				widget.get("optiongrid").setDisabled(true);
				widget.compare(data.optionCells);
				widget.get("optiongrid").setData(data.optionCells);
				
				
				$(".J-grid-optiongrid-del").addClass("hidden");
			}
		},
		 attrs:{
         	template:template
         },
         initComponent:function(params,widget){
        	 var subnav=new Subnav({
 				parentNode:".J-subnav",
 				model:{
					title:params.title,
					items:[{
						id:"search",
						type:"search",
						placeholder : "搜索",
						handler:function(str) {
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/question/search",
								data:{
									s:str,
									questionnaireType:params.questionnaireType,
									searchProperties:
											"name," +
											"type," +
											"questionnaireType.name," +
											"description",
									fetchProperties:fetchProperties
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
									
								}
							});
						}
					},{
						id:"add",
						text:"新增",
						type:"button",
						show:true,
						handler:function(){
							widget.get("form").reset();
							widget.get("optiongrid").setData([]);
							widget.show([".J-optiongrid",".J-form"]).hide([".J-grid"]);
							widget.get("subnav").hide(["add","search"]).show(["return","save"]);
							$(".J-subnav-search-search").addClass("hidden");
						}
					},{
    					id:"return",
						text:"返回",
						type:"button",
						show:false,
						handler:function(){
							widget.hide([".J-optiongrid",".J-form"]).show([".J-grid"]);
							widget.get("subnav").show(["add","search"]).hide(["return","save"]);
							widget.get("form").setDisabled(false);
							widget.get("optiongrid").setDisabled(false);
							
							$(".J-grid-optiongrid-out").removeClass("hidden");
							$(".J-grid-optiongrid-del").removeClass("hidden");
							
						}
					},{

    					id:"save",
						text:"保存",
						type:"button",
						show:false,
						handler:function(){
							var data = widget.get("form").getData();
							data.questionnaireType=params.questionnaireType || 1
							if(!data.name){
								Dialog.alert({
									content : "请输入名称!"
								 });
								return false;
							}
							if(!data.type){
								Dialog.alert({
									content : "请输入题型!"
								 });
								return false;
							}
							
							var datas =widget.get("optiongrid").getData();
							var falg = false;
							if(datas.length == 0){
								Dialog.alert({
									content : "请添加答案项!"
								 });
								return false;
							}
							var list = [];
							for(var i in datas){
								list.push({
									pkOptionCell: datas[i].pkOptionCell || "",
									name : datas[i].name || "",
									sequence : datas[i].sequence || "",
									context : datas[i].context || "",
									score : datas[i].score ,
									version : datas[i].version 
								});
							}
							data.list = list;
							Dialog.alert({
                        		title:"提示",
                        		defaultButton : false,
                        		content:"正在保存，请稍后……"
                        	});
							aw.saveOrUpdate("api/question/save",aw.customParam(data),function(data){
								Dialog.close();
								widget.get("grid").refresh();
								widget.hide([".J-optiongrid",".J-form"]).show([".J-grid"]);
								widget.get("subnav").show(["add","search"]).hide(["return","save"]);
							});
						}
					
					}]
				}
        	 });
        	 this.set("subnav",subnav);
        	 
        	 var grid=new Grid({
        		parentNode:".J-grid",
 				model:{
 					url : "api/question/query",
 	 				params:function(){
 	 					return{
 	 						questionnaireType:params.questionnaireType || 1,
 	 						fetchProperties:fetchProperties
 	 					}
 	 				},
 					columns:[{
 						name:"name",
 						label:"题目",
 						className:"grid_20"
 					},{
 						name:"type.value",
 						label:"题型",
 						className:"grid_10"
 					},{
 						name:"questionnaireType.name",
 						label:"类型",
 						className:"grid_10"
 					},{
 						name:"description",
 						label:"描述",
 						className:"grid_40"
 					},{
 						name:"operate",
 						label:"操作", 	
 						format:"button",
 						formatparams:[{
 							id:"edit",
 							icon:"icon-edit",
 							handler:function(index,data,rowEle){
 								var cloneData = $.extend(true,{},data);
 								widget.show([".J-optiongrid",".J-form"]).hide([".J-grid"]);
 								widget.get("subnav").hide(["add","search"]).show(["return","save"]);
 								$(".J-subnav-search-search").addClass("hidden");
 								widget.get("optiongrid").setDisabled(false);
 								widget.get("form").setData(cloneData);
								widget.compare(cloneData.optionCells);
 								widget.get("optiongrid").setData(cloneData.optionCells);
 							}
 						},{
 							id:"delete",
 							icon:"icon-remove",
 							handler:function(index,data,rowEle){
 								aw.del("api/question/" + data.pkQuestion + "/delete",function(data){
 									widget.get("grid").refresh();
 								});
 							}
 						}]
 					}]
 				}
        	 });
        	this.set("grid",grid);
        	
        	var form=new Form({
        		parentNode:".J-form",
				model:{
					id:"questionform",
					defaultButton:false,
					items:[{
						name:"pkQuestion",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"题目",
						validate:["required"]
					},{
						name:"type",
						label:"题型",
						type:"select",
						options:enmu["com.eling.elcms.questionnaire.model.Question.Type"],
						validate:["required"]
					},{
						name:"description",
						label:"描述",
						type:"textarea"
					}]
				  }
        	});
        	this.set("form",form);
        	
        	var optiongrid=new EditGrid({
         		parentNode:".J-optiongrid",
         		autoRender:false,
  				model:{
  					id : "optiongrid",
  					head  :{
					        title:"答案项",
					},
  					columns:[{
  						name:"sequence",
  						label:"序号",
  						className:"grid_20",
  						editor : {
  							type : "text",
  							onAdd : function(plugins){
								var oldDatas = optiongrid.getData();
								
								var sequence = plugins["sequence"].getValue();
								
								var validateRet = widget.validate(sequence,oldDatas)
								
								if(validateRet){
									optiongrid.add({
										sequence : sequence,
										context:plugins["context"].getValue(),
										score:plugins["score"].getValue()
									});
									
									var newDatas = optiongrid.getData();
									widget.compare(newDatas);
									return true;
								}
								return false;
							},
							onEdit : function(editor,rowIndex,rowData){
								editor.setValue(rowData.sequence);
							},
							onChange : function(plugin,index,rowData){
								rowData.sequence = plugin.getValue();
								var oldDatas = optiongrid.getData();
								if(!rowData.sequence){
									return false;
								}
								var validateRet = widget.validate(rowData.sequence,oldDatas)
								if(validateRet){
									optiongrid.update(index,rowData)
									var newDatas = optiongrid.getData();
									widget.compare(newDatas);
									return true;
								}
								return false;
								
							}
						}
  					},{
  						name:"context",
  						label:"选项描述",
  						className:"grid_30",
  						editor : {
  							type : "text",
  							placeholder:"您可以输入()，表示为填空",
  							onEdit : function(editor,rowIndex,rowData){
								editor.setValue(rowData.context);
							},
							onChange : function(plugin,index,rowData){
								rowData.context = plugin.getValue();
								optiongrid.update(index,rowData)
							}
						}
  					},{
  						name:"score",
  						label:"选项对应分值",
  						className:"grid_30",
  						editor : {
  							type : "text",
  							onEdit : function(editor,rowIndex,rowData){
								editor.setValue(rowData.value);
							},
							onChange : function(plugin,index,rowData){
								rowData.score = plugin.getValue();
								optiongrid.update(index,rowData)
							}
						}
  					},{
  						name:"operate",
  						label:"操作", 	
  						format:"button",
  						formatparams:[{
  							id:"del",
  							text:"删除",
  							handler:function(index,data,rowEle){
  								optiongrid.remove(rowEle);
  							}
  						}]
  					}]
  				}
         	 });
         	this.set("optiongrid",optiongrid);
        	
         },
         compare:function(datas){
        	datas= datas.sort(function(a,b){
        		return a.sequence- b.sequence;
        	 });
        	this.get("optiongrid").setData(datas);
         },
         validate:function(sequence,datas){
				for ( var i in datas) {
					if(sequence  == datas[i].sequence){
						Dialog.alert({
							content : "该序号已存在!"
						 });
						return false;
					}
				}
				return true;
         },
	});		
	module.exports = Question;
});