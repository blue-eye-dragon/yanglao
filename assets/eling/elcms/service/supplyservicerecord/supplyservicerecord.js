define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Form=require("form");
	var emnu = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	require("../../grid_css.css");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-form hidden' ></div>";
	var Service = ELView.extend({
		attrs:{
            template:template
		},
		events : {
			"change .J-form-supplyservicerecord-select-generalServiceItem":function(e){
				var form=this.get("form");
				var  generalServiceItem=form.getValue("generalServiceItem");
				var generalServiceItemdata = form.getData("generalServiceItem");
				aw.ajax({
					url:"api/generalServiceItem/query",
					data:{
						pkGeneralServiceItem:generalServiceItem,
						fetchProperties:"name,pkGeneralServiceItem,supplier,supplier.small,supplier.name,supplier.pkSupplier"
					},
					dataType:"json",
					success:function(data){
						if("租车"==data[0].name){
							form.show("line");
						}else{
							form.hide("line");
						}
						var arr = new Array();
						for(var i in data[0].supplier){
							if(data[0].supplier[i].small){
								arr.push(data[0].supplier[i])
							}
						}
						form.setData("supplier",arr)
					}
				});
			},
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"小型服务商服务情况",
					items :[{
						id:"generalServiceItem",
						tip:"服务项目",
						type :"buttongroup",
						keyField :"pkGeneralServiceItem",
						valueField :"name",
						url:"api/generalServiceItem/queryBySupplier",
						showAll:true,
   						showAllFirst:true,
						params : function(){
                            return {
                            	small:true,
                            	state :"Using",
                            	fetchProperties:"name,pkGeneralServiceItem",
                            };
                        },
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
						id : "date",
						tip : "服务日期",
						type : "daterange",
						ranges : {
							"上月": [moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")],
					        "本月": [moment().startOf("month"), moment().endOf("month")],
					     },
						defaultRange : "本月",
						handler : function(time){
							widget.get("grid").refresh();
						},
					},{
						id : "add",
						type : "button",
						text : "新增",
						handler : function(){
							var form=widget.get("form");
							form.reset();
							form.hide("line");
							form.load("recorder",{
								params:{
									fetchProperties:"pkUser,name"
								},
								callback:function(data){
									//当前用户是管理员时，让recordPerson可用
									var userSelect=form.getData("recorder","");
								//	userSelect.push(activeUser);
									var flag = false;
									for(var  i =  0 ; i<userSelect.length;i++ ){
										if(userSelect[i].pkUser == activeUser.pkUser){
											flag= true;
											break;
										}
									}
									if(flag){
										form.setValue("recorder",activeUser.pkUser);
									}
									var recorder=form.getData("recorder","");
									recorder.push(activeUser);
									form.setData("recorder",recorder);
									form.setValue("recorder",activeUser);
								}
							});
							widget.get("subnav").hide(["add"]).show(["return"]);
							widget.hide([".J-grid"]).show([".J-form"]);
							widget.get("grid").refresh();
						}
					},{
						id : "return",
						type : "button",
						text : "返回",
						show : false,
						handler : function(){
							widget.get("subnav").show(["add"]).hide(["return"]);
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("grid").refresh();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url : "api/supplyservicerecord/query",
					params:function(){
						var subnav=widget.get("subnav");
						return{
							"generalServiceItem.pkGeneralServiceItem":subnav.getValue("generalServiceItem"),
							"date": subnav.getValue("date").start,
							"dateEnd":subnav.getValue("date").end,
							fetchProperties:
							"pkSupplyServiceRecord,"+
							"generalServiceItem,"+
							"generalServiceItem.name,"+
							"generalServiceItem.pkGeneralServiceItem,"+
							"supplier,"+
							"supplier.name,"+
							"supplier.pkSupplier,"+
							"recorder.pkUser,"+
							"recorder.name,"+
							"server,"+
							"phone,"+ 
							"date,"+
							"line,"+
							"description,"+
							"recordDate,"+
							"version",
						}
						
					},
					columns : [{
						name : "generalServiceItem.name",
						label : "服务项目",
						className:"oneHalfColumn",
					},{
						name : "supplier.name",
						label : "服务商",
						className:"twoColumn",
					},{
						name : "server",
						label : "服务人员",
						className : "twoColumn",	
					},{
						name : "phone",
						label : "服务电话",
						className :"oneHalfColumn"
					},{
						name : "date",
						label : "服务日期",
						format :"date",
						className:"oneHalfColumn",	
					},{
						name : "recorder.name",
						label : "记录人",
						className:"oneHalfColumn",
					},{
						name : "recordDate",
						label : "记录日期",
						format : "date",
						className : "oneHalfColumn",	
					},{
						 name : "operate",
	                        label : "操作",
	                        format : "button",
	                        className :"twoColumn",
	                        formatparams : [{
	                            id : "edit",
	                            icon : "icon-edit",
	                            handler : function(index,data,rowELe){
	                            	var form=widget.get("form")
	                				if("租车"!=data.generalServiceItem.name){
	                					form.hide("line");
	                				}else{
	                					form.show("line");
	                				}
	                            	aw.ajax({
	                					url:"api/generalServiceItem/query",
	                					data:{
	                						pkGeneralServiceItem:data.generalServiceItem.pkGeneralServiceItem,
	                						fetchProperties:"name,pkGeneralServiceItem,supplier,supplier.small,supplier.name,supplier.pkSupplier"
	                					},
	                					dataType:"json",
	                					success:function(data1){
	                						var arr = new Array();
	                						for(var i in data1[0].supplier){
	                							if(data1[0].supplier[i].small){
	                								arr.push(data1[0].supplier[i]);
	                							}
	                						}
	                						form.setData("supplier",arr);
	                						form.setValue("supplier",data.supplier.pkSupplier);
	                					}
	                				});
	    							form.setData(data);
	                            	form.setValue("generalServiceItem",data.generalServiceItem.pkGeneralServiceItem);
	                            	
	    							widget.get("subnav").show(["return"]).hide(["add"]);
	    							widget.show(".J-form").hide(".J-grid");
							}
						},{
							key : "delete",	
							icon : "icon-remove",
							handler:function(index,data,rowEle){
								aw.del("api/supplyservicerecord/" + data.pkSupplyServiceRecord + "/delete",function(){
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
						aw.saveOrUpdate("api/supplyservicerecord/save",aw.customParam(form.getData()),function(data){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").hide(["return"]).show(["add"]);
							widget.get("grid").refresh();
						});
                    },
                    cancelaction : function(){
                    	widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("subnav").hide(["return"]).show(["add"]);
						widget.get("grid").refresh();
                    },
                    model : {
    					id : "supplyservicerecord",
                    items : [{
                    	name : "pkSupplyServiceRecord",
						type : "hidden"
                    },{
                    	name : "version",
                    	defaultValue : "0",
						type : "hidden"
                    },{
                    	name : "generalServiceItem",
						label : "服务项目",
    					url : "api/generalServiceItem/queryBySupplier",
    					keyField : "pkGeneralServiceItem",
    					valueFiled : "name",
    					params : function(){
                            return {
                            	state :"Using",
                            	small: true,
                            	fetchProperties:"name,pkGeneralServiceItem",
                            };
                        },
                        format:function(data){
                        	return   data.name
                        },
                        type : "select",
						validate : ["required"],
                    },{
                    	name : "supplier",
						label : "服务商",
    					keyField : "pkSupplier",
    					valueFiled : "name",
                        format:function(data){
                        	return   data.name
                        },
                        type : "select",
						validate : ["required"],
                    },{
                    	name : "server",
						label : "服务人员",
						validate : ["required"],
                    },{
                    	name : "phone",
						label : "服务人员电话",
						validate : ["required"]
                    },{
                    	name : "line",
                    	label : "服务线路",
                    	validate : ["required"]
                    },{
                    	name : "date",
						label : "服务日期",
	                    type : "date",
	                    defaultValue : moment().valueOf(),
						validate : ["required"],
                    },{
	                    name : "recorder",
						label : "记录人",
						keyField : "pkUser",
	    				url : "api/users",
	    				validate : ["required"],
	    				params:{
							fetchProperties:"pkUser,name"
						},
						valueField : "name",
						type : "select",	
						readonly : true,
                    },{
                    	name : "recordDate",
						label : "记录时间",
	                    type : "date",
	                    readonly : true,
	                    defaultValue : moment().valueOf(),
						validate : ["required"],
                    },{
	   					name : "description",
						label : "描述",
						type : "textarea",
                    }]
				}
			});
			this.set("form",form);
		},
	});
	module.exports = Service;
});
