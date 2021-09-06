define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Form=require("form");
	var emnu = require("enums");
	require("../../grid_css.css");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-form hidden' ></div>";
	var Service = ELView.extend({
		attrs:{
            template:template
		},
		 events:{
				"change .J-form-documentManagement-file-contractfile":function(e){
					var size=e.target.files[0].size;
					var name = e.target.files[0].name;
					var form =this.get("form"); 
					if(Number(size)>10485760){
							Dialog.alert({
								content : "请上传小于10MB的文件",
								confirm : function(){
									Dialog.close();
									form.reset();
								}
							});
						}else{
							size=Math.ceil(size/1024);
							size=parseFloat(size).toLocaleString()
							form.setValue("size",size+"KB"||"");
							form.setValue("name",name);
					}
				},
				"change .J-form-documentManagement-text-name":function(e){
					var form =this.get("form");
					
					$(".J-form-documentManagement-file-contractfile .form-control").val(form.getValue("name"));
				}
		 },
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"文档管理",
					items :[{
						id : "search",
						type : "search",
						placeholder : "按类型或创建人搜索",
						handler : function(str){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/documentmanagement/search",
								data:{
									s:str,
									searchProperties:"documentType.name,create.name,description",
								fetchProperties:"pkDocumentManagement,"+
												"create.pkUser,"+
												"create.name,"+
												"name,"+
												"description,"+
												"createDate,"+
												"size,"+
												"documentType.pkDocumentType,"+
												"documentType.name,"+
												"create,"+
												"version",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
									widget.get("subnav").show(["search","add"]).show(["all"]);
								}
							});
						}
					},,{
						id : "createDate",
						type : "daterange",
						tip : "创建时间",
						ranges : {
							"今天": [moment().startOf("days"),moment().endOf("days")],
					        "本月": [moment().startOf("month"), moment().endOf("month")]
						},
						defaultRange : "本月",
						handler : function(){
							widget.get("grid").refresh();
						},
					},{
						id : "all",
						type :"button",
						text : "全部",
						show : false,
						handler : function(){
							widget.get("subnav").show(["search","add"]).hide(["all"]);
							widget.show([".J-daterange"]);
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
							widget.hide([".J-grid",".J-daterange"]).show([".J-form"]);
						}
					},{
						id : "return",
						type :"button",
						text : "返回",
						show : false,
						handler : function(){
							widget.get("subnav").show(["search","add"]).hide(["return"]);
							widget.show([".J-daterange"]);
							widget.show([".J-grid"]).hide([".J-form"]);
						}
					}]
				}
			});
			this.set("subnav",subnav);
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url : "api/documentmanagement/query",
					params:function(){
						return { 
							createDate : widget.get("subnav").getValue("createDate").start,
							createDateEnd : widget.get("subnav").getValue("createDate").end,
							fetchProperties:"pkDocumentManagement,name,description,version,size,documentType.pkDocumentType,createDate,create.pkUser,create.name,documentType.name",
						}
					},
					columns : [{
						 name:"documentType.name",
						 label:"文档类型",
						 className:"twoColumn",
					},{
						name : "name",
						label : "文件",
						format:"detail",
						className:"twoColumn",
						formatparams:{
                            handler:function(index,data,rowEle){
                            	var url = "api/attachment/documentmanagement/contractfile/"+data.name;
                            	var el = document.createElement("a");
                            	document.body.appendChild(el);
                            	el.href = url; //url 是你得到的连接
                            	el.target = '_new'; //指定在新窗口打开
                            	el.click();
                            	document.body.removeChild(el);
                            }
						}
					},{
						name : "description",
						label : "描述",
						className:"twoHalfColumn",
					},{
						name:"size",
						label:"大小",
						className:"oneHalfColumn",
					},{
						name:"create.name",
						label:"创建人",
						className:"oneHalfColumn",
					},{
						name:"createDate",
						label:"创建时间",
						format:"date",
						className:"twoColumn",
					},{
						 name : "operate",
	                        label : "操作",
	                        format : "button",
	                        className:"oneHalfColumn",
	                        formatparams : [{
	                            id : "edit",
	                            icon : "icon-edit",
	                    	handler:function(index,data,rowEle){
								var grid=widget.get("grid");
								var form = widget.get("form");
								form.reset();
								form.setData(data);	
								$(".J-form-documentManagement-file-contractfile .form-control").val(data.name);
								form.download("contractfile","api/attachment/documentmanagement/contractfile/"+data.name);
								widget.get("subnav").show(["return"]).hide(["add","search"]);
    							widget.show(".J-form").hide(".J-grid");
    							}
						},{
							key:"delete",	
							icon:"icon-remove",
							handler:function(index,data,rowEle){
								aw.del("api/documentmanagement/" + data.pkDocumentManagement + "/delete",function(){
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
						aw.saveOrUpdate("api/documentmanagement/save",aw.customParam(form.getData()),function(data){
							var form = widget.get("form");
	          				form.upload("contractfile","api/attachment/documentmanagement/contractfile/"+data.name);
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
    					id : "documentManagement",
                    items : [{
                    	name:"pkDocumentManagement",
						type:"hidden"
                    },{
                    	name:"version",
                    	defaultValue : "0",
						type:"hidden"
                    },{
                    	name:"contractfile",
						label:"文件",
						type:"file",
						maxSize : 51,
						validate:["required"]
                    },{
                    	name:"documentType",
						label:"文档类型",
						type:"select",
    					url : "api/documentType/query",
    					keyField:"pkDocumentType",
    					valueFiled:"name",
    					params : function(){
                            return {
                            	fetchProperties:"pkDocumentType,name,",
                            };
                        },
                        format:function(data,value){
                        	return data.name;
                        },
                        validate:["required"],
                    },{
                    	name:"size",
                    	label:"大小",
                    	readonly:true,
                    },{
                    	name:"name",
                    	label:"名称",
                    	readonly:true,
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
