define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var store=require("store");
	var enmu = require("enums");	
	var tools = require("tools");	
	var EditGrid=require("editgrid");
	
	var template="<div class='J-subnav'></div>"
		+"<div class='J-typegrid'></div>";
	
	var BasicHealthDataType = ELView.extend({	
		events:{
		},
		attrs:{
			template:template
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"基础健康类型",
					items : [{
						id : "search",
						type : "search",
						placeholder : "健康数据类型",
						handler : function(str){
							var g=widget.get("typegrid");
							subnav=widget.get("subnav");
							g.loading();
							aw.ajax({
								url:"api/basichealthdatatype/search",
								data:{
									s:str,
									properties:"healthDataType.name",
									fetchProperties:"*,healthDataType.name,healthDataType.version",
								},
								dataType:"json",
								success:function(data){
									widget.get("typegrid").setData(data);
								}
							});
                        }
					},{
						id : "all",
						text : "全部",
                        type : "button",
                        handler : function(){
                        	aw.ajax({
                				url:"api/basichealthdatatype/query",
                				data:{
                					fetchProperties:"*,healthDataType.name,healthDataType.version",
                				},
                				dataType:"json",
                				success:function(data){
                					widget.get("typegrid").setData(data);
                				}
                			});
                        }
					},{
    					id:"save",
						text:"保存",
                        type : "button",
						handler:function(){
							var data =widget.get("typegrid").getData();
							if(data.length == 0){
								Dialog.alert({
									content : "请添加健康数据类型!"
								 });
								return false;
							}
							var datas = {};
							datas.basicTypes = data;
							aw.saveOrUpdate("api/basichealthdatatype/save",aw.customParam(datas),function(data){
								Dialog.alert({
									content : "保存成功!"
								});
							});
						}
					}]					
				}
			});
			this.set("subnav",subnav);
			
			var typegrid=new EditGrid({
				parentNode:".J-typegrid",
				model:{
					id : "typegrid",
					columns:[{
						name:"healthDataType.name",
						label:"健康数据类型",
						editor : {
							type : "autocomplete",
							placeholder:"请输入健康数据类型",
							url : "api/healthexamdatatype/search",
							params : function(){
								return {
									searchProperties:"name",
									fetchProperties:"pkHealthExamDataType,name,version" 
								}
							},
							queryParamName : "s",
							//代表所选的选项的值是哪一个字段的值
							keyField : "pkHealthExamDataType",
							//代表选项下拉框中显示的值
							format : function(data){
								return data.name;
							},
							onAdd : function(plugins){
								var oldDatas = typegrid.getData();								
								var curType = plugins["healthDataType.name"].getData();								
								var validateRet = widget.typeValidate(curType,oldDatas)
								
								if(validateRet){
									typegrid.add({
										healthDataType : curType
									});
									return true;
								}else{
									Dialog.alert({
				        				content : "该项目已存在!"
				        			});
								}
								return false;
							},
							onEdit : function(editor,rowIndex,rowData){
								var curType = editor.getData();
								if(widget.typeValidate(curType,typegrid.getData())){									
									editor.setData(rowData.healthDataType);
								}else{
									Dialog.alert({
										content : "该项目已存在!"
									});
								}
							},
							onChange : function(editor,rowIndex,rowData){
								//仅进行视图操作
								var curType = editor.getData();
								if(widget.typeValidate(curType,typegrid.getData())){
									//更新模型
									rowData.healthDataType = editor.getData();
									typegrid.update(rowIndex,rowData);
								}else{
									//恢复之前的值
									editor.setData(rowData.healthDataType);
				        			Dialog.alert({
				        				content : "该项目已存在!"
				        			});
								}
							}
						}
					},{
						name : "iorder",
						label : "序号",
						editor : {
							type : "text",
							placeholder:"请输入序号",
							onEdit : function(editor,rowIndex,rowData){
								if (editor.getValue()){
									if(!(/(^[1-9]{1}[0-9]{0,2}$)/i.test(editor.getValue()))){
										Dialog.alert({
											content : "请输入1-999之间的有效数字!"
										 });
									}else{
										var curOrder = editor.getValue();
										if(widget.orderValidate(curOrder,typegrid.getData())){
											editor.setValue(rowData.iorder);
										}else{
											editor.setValue(curOrder);
											Dialog.alert({
						        				content : "该序号已存在!"
						        			});
										}
									}
								}								
							},
							onChange : function(editor,rowIndex,rowData){
								if(editor.getValue()){
									if(!( /(^[1-9]{1}[0-9]{0,2}$)/i.test(editor.getValue()))){
										Dialog.alert({
											content : "请输入1-999之间的有效数字!"
										 });
									}else{
										var curOrder = editor.getValue();
										if(widget.orderValidate(curOrder,typegrid.getData())){
											rowData.iorder = editor.getValue();
											typegrid.update(rowIndex,rowData);	
										}else{
											editor.setValue(curOrder);
											Dialog.alert({
						        				content : "该序号已存在!"
						        			});
										}										
									}
								}
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
								typegrid.remove(rowEle);
								if(data.pkBasicHealthDataType){									
									aw.saveOrUpdate("api/basichealthdatatype/"+data.pkBasicHealthDataType+"/delete", function(){});
								}
							}
						}]
//						{
//							id:"edit",
//							text:"保存",
//							show:function(value,row){
//								return true;
//							},
//							handler:function(index,data,rowEle){
//								aw.saveOrUpdate("api/basichealthdatatype/save",aw.customParam(data), function(){
//									Dialog.alert({
//										content : "保存成功!"
//									 });
//								});
//							}
//						},

					}]
				}
			});
			this.set("typegrid",typegrid);
		},
        typeValidate:function(type,datas){
        	for ( var i in datas) {
        		if(type.pkHealthExamDataType  == datas[i].healthDataType.pkHealthExamDataType){
        			return false;
        		}
        	}
        	return true;
        },
        orderValidate:function(order,datas){
        	for ( var i in datas) {
        		if(order  == datas[i].iorder){
        			return false;
        		}
        	}
        	return true;
        },
        afterInitComponent:function(params,widget){
        	aw.ajax({
				url:"api/basichealthdatatype/query",
				data:{
					fetchProperties:"*,healthDataType.name,healthDataType.version",
				},
				dataType:"json",
				success:function(data){
					widget.get("typegrid").setData(data);
				}
			});
        	
		}		
	});
	module.exports = BasicHealthDataType;
});