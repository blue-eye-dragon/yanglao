define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Editgrid=require("editgrid");
	var Form=require("form");
	var enums = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	require("../../grid_css.css");
	
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-form hidden' ></div>" +
	"<div class='J-griditem hidden'></div>";
	
	var ServicePackage = ELView.extend({
		attrs:{
            template:template
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"服务套餐",
					items :[{
						id : "search",
						type : "search",
						placeholder : "按名称搜索",
						handler : function(str){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/generalServicePackage/search",
								data:{
									s:str,
									searchProperties:"name",
									fetchProperties:"pkGeneralServicePackage,name,description,createDate,create,state,version" 
//									"servicePackageItems,servicePackageItems.pkGeneralServicePackageItem," +
//									"servicePackageItems.count," +
//									"servicePackageItems.cycle," +
//									"servicePackageItems.version," +
//									"servicePackageItems.serviceItem," +
//									"servicePackageItems.serviceItem.pkGeneralServiceItem," +
//									"servicePackageItems.serviceItem.name," +
//									"servicePackageItems.serviceItem.unit",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
					},{
						id : "state",
						type :"buttongroup",
						tip : "套餐状态",
			   			showAll:true,
			   			items:enums["com.eling.elcms.service.model.UseStatus"],
						handler : function(key,element){
							subnav.setValue("search","");
							widget.get("grid").refresh();
						}
					},{
						id :"add",
						type : "button",
						text : "新增",
						handler : function(){
							subnav.setValue("search","");
							var form=widget.get("form");
							form.reset();
							widget.get("griditem").setData(null);
							$(".J-grid-servicePackageItems-delete").removeClass("hidden");
							widget.get("subnav").hide(["search","add","state"]).show(["save","return"]);
							widget.hide([".J-grid"]).show([".J-form",".J-griditem"]);
						}
					},{
						id :"save",
						type : "button",
						text : "保存",
						show : false,
						handler : function(){
							var form=widget.get("form");
							var data = form.getData();
							if(data.name=="" || data.name.length>15){
								Dialog.alert({
    								content : "请确认套餐名称！"
    							 });
    	     				    return false;
							}
							var datas =widget.get("griditem").getData();
							var list = [];
							for(var i in datas){
								if(datas[i].serviceItem&&datas[i].serviceItem.pkGeneralServiceItem){
									list.push({
										serviceItem : datas[i].serviceItem.pkGeneralServiceItem,
										count : datas[i].count,
										cycle : datas[i].cycle.key,
										version : datas[i].version || 0
									});
								}
							}
							if(list.length==0){
								Dialog.alert({
    								content : "至少设置一个服务项目！"
    							 });
    	     				    return false;
							}
							data.list = list;
							aw.saveOrUpdate("api/generalServicePackage/save",aw.customParam(data),function(data){
								widget.show([".J-grid"]).hide([".J-form",".J-griditem"]);
								widget.get("subnav").hide(["return","save"]).show(["search","add","state"]);
								widget.get("subnav").setValue("state",data.state.key);
								widget.get("grid").refresh();
								form.reset();
							});
						}
					},{
						id : "return",
						type :"button",
						text : "返回",
						show : false,
						handler : function(){
							widget.get("subnav").show(["search","add","state"]).hide(["save","return"]);
							widget.show([".J-grid"]).hide([".J-form",".J-griditem"]);
							widget.get("grid").refresh();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url : "api/generalServicePackage/query",
					params:function(){
						var subnav = widget.get("subnav");
						return{
							state : subnav.getValue("state"),
							fetchProperties:"pkGeneralServicePackage,name,description,createDate,create,state,version" 
						}
					},
					columns : [{
						name : "name",
						label : "套餐名称",
						className:"twoColumn",
						format:"detail",
						formatparams:{
 							key:"detail",
							handler:function(index,data,rowEle){
								var form = widget.get("form");
								aw.ajax({
    								url:"api/generalServicePackageItem/query",
    								data:{
    									servicePackage:data.pkGeneralServicePackage,
    									fetchProperties:"pkGeneralServicePackageItem," +
    										"count," +
    										"cycle," +
    										"version," +
    										"serviceItem," +
    										"serviceItem.pkGeneralServiceItem," +
    										"serviceItem.name," +
    										"serviceItem.unit",
    								},
    								dataType:"json",
    								success:function(data1){
    									if(data1.length>0){
    										form.setData(data);
                            				form.setValue("state",data.state.key);
                            				widget.get("griditem").setData(data1);
                            				form.setDisabled(true);
                            				widget.get("griditem").setDisabled(true);
                            				$(".J-grid-servicePackageItems-delete").addClass("hidden");
                            				widget.get("subnav").show(["return"]).hide(["add","search","state","save"]);
    										widget.show([".J-form",".J-griditem"]).hide(".J-grid");
    									}
    								}
                            	});
							}
 						}
					},{
						name : "description",
						label : "描述",
						className:"threeColumn",
					},{
						name : "state.value",
						label : "状态",
						className:"twoColumn",
					},{
						name : "operate",
                        label : "操作",
                        format : "button",
                        className:"oneColumn",
                        formatparams : [{
	                            id : "edit",
	                            icon : "icon-edit",
	                            handler : function(index,data,rowELe){
	                            	var form=widget.get("form");
	                            	aw.ajax({
	    								url:"api/generalServicePrice/query",
	    								data:{
	    									"serviceType":"ServicePackage",
	    									generalServicePackage:data.pkGeneralServicePackage
	    								},
	    								dataType:"json",
	    								success:function(data1){
	    									if(data1.length>0){
	    										Dialog.alert({
	    											title : "提示",
	    											content : "数据被引用无法修改",
	    										});
	    									}else{
	    										aw.ajax({
	    		    								url:"api/generalServicePackageItem/query",
	    		    								data:{
	    		    									servicePackage:data.pkGeneralServicePackage,
	    		    									fetchProperties:"pkGeneralServicePackageItem," +
	    		    										"count," +
	    		    										"cycle," +
	    		    										"version," +
	    		    										"serviceItem," +
	    		    										"serviceItem.pkGeneralServiceItem," +
	    		    										"serviceItem.name," +
	    		    										"serviceItem.unit",
	    		    								},
	    		    								dataType:"json",
	    		    								success:function(data1){
	    		    									if(data1.length>0){
	    		    										form.setData(data);
	    		                            				form.setValue("state",data.state.key);
	    		                            				widget.get("griditem").setData(data1);
	    		                            				$(".J-grid-servicePackageItems-delete").removeClass("hidden");
	    		                            				widget.get("subnav").show(["return","save"]).hide(["add","search","state"]);
	    		    										widget.show([".J-form",".J-griditem"]).hide(".J-grid");
	    		    									}
	    		    								}
	    		                            	});
    										}
	    								}
	    							});
							}
						},{
							key:"startusing",
							text:"启用",
							show:function(value,row){								
								if(row.state.key=='Disable' || row.state.key=="Init"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否确认启用服务项目？",
									confirm:function(){
										data.state='Using';
										datas = {
												pkGeneralServicePackage : data.pkGeneralServicePackage,
												state : 'Using',
												version : data.version
										}
        								aw.saveOrUpdate("api/generalServicePackage/save",aw.customParam(datas),function(data){
        									widget.get("subnav").setValue("state",'Using');
        	        						widget.get("grid").refresh();
        	        					});
									}
								});
							}
						},{
							key:"disable",
							text:"停用",
							show:function(value,row){
								if(row.state.key=='Using'){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否确认停用服务项目？",
									confirm:function(){
										data.state='Disable';
										datas = {
												pkGeneralServicePackage : data.pkGeneralServicePackage,
												state : 'Disable',
												version : data.version
										};
        								aw.saveOrUpdate("api/generalServicePackage/save",aw.customParam(datas),function(data){
        									widget.get("subnav").setValue("state",'Disable');
        	        						widget.get("grid").refresh();
        	        					});
									}
								});
							}
						},{
							key:"delete",	
							icon:"icon-remove",
							handler:function(index,data,rowEle){
								aw.del("api/generalServicePackage/" + data.pkGeneralServicePackage + "/delete",function(){
									widget.get("grid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var form = new Form({
				parentNode:".J-form",
                    model : {
    					id : "generalServicePackage",
    					defaultButton:false,
	                    items : [{
	                    	name:"pkGeneralServicePackage",
							type:"hidden"
	                    },{
	                    	name:"version",
	                    	defaultValue : "0",
							type:"hidden"
	                    },{
	                    	name:"state",
	                    	defaultValue : "Init",
							type:"hidden"
	                    },{
	                    	name:"name",
							label:"套餐名",
							validate:["required"],
							exValidate: function(value){
								if(value.length>15){
									return "编码不得超过15位";
								}else{
									return true;
									 }
								}
	                    },{
		   					name:"description",
							label:"描述",
							type:"textarea",
	                    }]
                    }
			});
			this.set("form",form);
			
			var griditem = new Editgrid({
				parentNode:".J-griditem",
				model : {
					id : "servicePackageItems",
					head : {
						title : "服务项目",
					},
					columns : [{
						name : "serviceItem.name",
						label : "服务项目",
						className:"twoColumn",
						editor : {
							type : "select",
							url : "api/generalServiceItem/query",
							params : function(){
								return {
									state:"Using",
									fetchProperties:"pkGeneralServiceItem,name,unit" 
								}
							},
							keyField : "pkGeneralServiceItem",
							valueField : "name",
							onAdd : function(plugins){
								var oldDatas = griditem.getData();
								
								var curItem = plugins["serviceItem.name"];
								
								var item = curItem.getData(curItem.getValue());
								
								if(item.name){
									var validateRet = widget.itemValidate(item,oldDatas);
									
									if(validateRet){
										griditem.add({
											cycle : {
												key : "None",
												value : "无"
											},
											count : 1,
											serviceItem : item,
										});
										return true;
									}
								}
								return false;
							},
							onEdit : function(plugin,index,rowData){
								plugin.setValue(rowData);
							},
							onChange : function(editor,rowIndex,rowData){
								
								var allData = editor.getData();
								
								var it = editor.getValue();
								for(var i in allData){
									if(allData[i].pkGeneralServiceItem == it){
										item = allData[i];
										break;
									}
								}
								
								var oldDatas = griditem.getData();
								
								var validateRet = widget.itemValidate(item,oldDatas);
								
								if(validateRet){
//									griditem.setText(rowIndex,"serviceItem.name",editor.getText());
									rowData.serviceItem = item;
									griditem.update(rowIndex,rowData);
								}else{
									editor.setData(rowData);
								}
								
							}
						}
					},{
						name : "cycle.value",
						label : "周期",
						className:"twoColumn",
						editor : {
							name : "cycle",
							type : "select",
							options :enums["com.eling.elcms.service.model.GeneralServicePackageItem.Cycle"],
							onEdit : function(editor,rowIndex,rowData){
								editor.setValue(rowData.cycle.key);
							},
							onChange : function(editor,rowIndex,rowData){
								if(editor.getValue()){
									griditem.setText(rowIndex,"cycle.value",editor.getText());
									rowData.cycle = {
											key : editor.getValue(),
											value : editor.getText()
										}
									griditem.update(rowIndex,rowData);
								}else{
									Dialog.alert({
										content : "请选择周期!"
									 });
									return false;
								}
							}
						}
					},{
						name : "count",
						label : "数量",
						className:"twoColumn",
						editor : {
							type : "text",
							onEdit : function(editor,rowIndex,rowData){
								editor.setValue(rowData.fees);
							},
							onChange : function(plugin,index,rowData){
								if(plugin.getValue() =="" || isNaN(plugin.getValue()) || parseInt(plugin.getValue())<0){
		    	     				Dialog.alert({
		    								content : "数量只能为正数！"
		    							 });
		    	     				return false;
		    	     			}else{
									rowData.count = plugin.getValue();
									griditem.update(index,rowData);
		    	     			}
							}
						}
					},{
						name : "serviceItem.unit.value",
						label : "单位",
						className:"twoColumn",
					},{
						name : "operate",
                        label : "操作",
                        format : "button",
                        className:"oneColumn",
                        formatparams : [{
							key:"delete",	
							icon:"icon-remove",
							handler:function(index,data,rowEle){
								griditem.remove(rowEle);
							}
						}]
					}]
				}
			});
			this.set("griditem",griditem);
		},
		itemValidate:function(item,datas){
			for ( var i in datas) {
				if(item.pkGeneralServiceItem  == datas[i].serviceItem.pkGeneralServiceItem){
					Dialog.alert({
						content : "该服务项目已存在!"
					 });
					return false;
				}
			}
			return true;
     },
	});
	module.exports = ServicePackage;
});
