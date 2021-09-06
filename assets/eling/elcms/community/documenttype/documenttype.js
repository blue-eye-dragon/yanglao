define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Form=require("form");
	var emnu = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	require("../../grid_css.css");
	var Dialog = require("dialog");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-form hidden' ></div>";
	var Service = ELView.extend({
		attrs:{
            template:template
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"文档类型",
					items :[{
						id : "search",
						type : "search",
						placeholder : "按名称搜索",
						handler : function(str){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/documentType/search",
								data:{
									s:str,
									searchProperties:"name",
								fetchProperties:"pkDocumentType,"+
												"create.pkUser,"+
												"create.name,"+
												"name,"+
												"description,"+
												"createDate,"+
												"version",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
									
									widget.get("subnav").show(["search","add"]).show(["all"]);
								}
							});
						}
					},{
						id : "all",
						type :"button",
						text : "全部",
						show : false,
						handler : function(){
							widget.get("subnav").show(["search","add"]).hide(["all"]);
							widget.get("grid").refresh();
							
						}
					},{
						id :"add",
						type : "button",
						text : "新增",
						handler : function(){
							var form=widget.get("form");
							form.reset();
							var arr = form.getData("create");
							for(var i in arr)
								{
								   if(activeUser.pkUser==arr[i].pkUser)
									   {
									   form.setValue("create",activeUser.pkUser)
									   }
								}
							widget.get("subnav").hide(["search","add"]).show(["return"]);
							widget.hide([".J-grid"]).show([".J-form"]);
						}
					},{
						id : "return",
						type :"button",
						text : "返回",
						show : false,
						handler : function(){
							widget.get("subnav").show(["search","add"]).hide(["return"]);
							widget.show([".J-grid"]).hide([".J-form"]);
						}
					}]
				}
			});
			this.set("subnav",subnav);
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url : "api/documentType/query",
					params:{
						fetchProperties:"pkDocumentType,name,description,version",
					},
					columns : [{
						name : "name",
						label : "名称",
						className:"fourColumn",
					},{
						name : "description",
						label : "描述",
						className:"fourColumn",
					},{
						 name : "operate",
	                        label : "操作",
	                        className:"fourColumn",
	                        format : "button",
	                        formatparams : [{
	                            id : "edit",
	                            icon : "icon-edit",
	                            handler : function(index,data,rowELe){
	                              	var form=widget.get("form")
	                            	aw.ajax({
	    								url:"api/documentmanagement/query",
	    								data:{
	    									documentType:data.pkDocumentType
	    								},
	    								dataType:"json",
	    								success:function(data1){
	    									if(data1.length>0){
	    										Dialog.alert({
	    											title : "提示",
	    											content : "数据被引用无法修改",
	    										});
	    									}
	    									else
	    										{
	    										form.setData(data);
	    		    							widget.get("subnav").show(["return"]).hide(["add","search"]);
	    		    							widget.show(".J-form").hide(".J-grid");
	    										}
	    								}
	    							});
	                            	
	    							   
	    								}
						},{
							key:"delete",	
							icon:"icon-remove",
							
							handler:function(index,data,rowEle){
								aw.del("api/documentType/" + data.pkDocumentType + "/delete",function(){
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
					saveaction : function(){
						aw.saveOrUpdate("api/documentType/add",aw.customParam(form.getData()),function(data){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").hide(["return"]).show(["search","add"]);
							widget.get("grid").refresh();
						});
                    },
                    cancelaction : function(){
                    	widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("subnav").hide(["return"]).show(["search","add"]);
						widget.get("grid").refresh();
                    },
                    model : {
    					id : "documentType",
                    items : [{
                    	name:"pkDocumentType",
						type:"hidden"
                    },{
                    	name:"version",
                    	defaultValue : "0",
						type:"hidden"
                    },{
                    	name:"name",
						label:"名称",
						validate:["required"]
                    },{
	                    name:"create",
						label:"创建人",
						keyField:"pkUser",
	    				url:"api/users",
	    				validate:["required"],
	    				params:{
							fetchProperties:"pkUser,name"
						},
						valueField:"name",
						type : "select",							
                    },{
                    	name:"createDate",
						label:"创建时间",
	                    type:"date",
	                    defaultValue:moment().valueOf(),
						validate:["required"],
                    },{
	   					name:"description",
						label:"描述",
						type:"textarea",
                    }]
				}
			});
			this.set("form",form);
		},
	});
	module.exports = Service;
});
