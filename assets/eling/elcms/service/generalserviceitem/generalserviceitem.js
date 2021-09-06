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
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"服务项目",
					items :[{
						id : "search",
						type : "search",
						placeholder : "按名称搜索",
						handler : function(str){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/generalServiceItem/search",
								data:{
									s:str,
									searchProperties:"name",
									fetchProperties:"pkGeneralServiceItem,"+
													"type,"+
													"unit,"+
													"create.pkUser,"+
													"create.name,"+
													"code,"+
													"name,"+
													"state,"+
													"description,"+
													"createDate,"+
													"supplier,"+
													"supplier.name,"+
													"supplier.pkSupplier,"+
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
							form.hide(["state"]);
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
					url : "api/generalServiceItem/query",
					params:{
						fetchProperties:"pkGeneralServiceItem,supplier.pkSupplier.name,supplier,supplier.name,supplier.pkSupplier,type,unit,create.pkUser,create.name,code,name,state,description,createDate,version",
					},
					columns : [{
						name : "code",
						label : "编码",
						className:"twoColumn",
					},{
						name : "name",
						label : "名称",
						className:"twoColumn",
						format:"detail",
						formatparams:{
 							key:"detail",
							handler:function(index,data,rowEle){
								var form = widget.get("form");
								form.setData(data);
								form.setDisabled(true);
								widget.get("subnav").show(["return"]).hide(["add","search"]);
								widget.show(".J-form").hide(".J-grid");
							}
 						}
					},{
						name : "type.value",
						label : "类型",
						className:"oneColumn",	
					},{
						name : "unit.value",
						label : "计费单位",
						className:"oneColumn",	
					},{
						name : "supplier",
						label : "服务商",
						className:"twoColumn",
						format:function(value,row){
							var name= "";
							if(value.length>0){
								for(var i =0 ;i<value.length;i++){
									if(i<value.length-1){
										name+= value[i].name+"、";
									}else{
										name+= value[i].name;
									}
								}
							}else{
								name="无";
							}
							return name;
						}
						
					},{
						name : "state.value",
						label : "状态",
						className:"oneColumn",
					},{
						name : "description",
						label : "描述",
						className:"twoColumn",	
					},{
						 name : "operate",
	                        label : "操作",
	                        format : "button",
	                        className:"twoColumn",
	                        formatparams : [{
	                            id : "edit",
	                            icon : "icon-edit",
	                            handler : function(index,data,rowELe){
	                            	var form=widget.get("form");
	                            	form.reset();
	                            	form.setDisabled(false);
	                            	aw.ajax({
	    								url:"api/generalServicePrice/query",
	    								data:{
	    									"serviceType":"ServiceItem",
	    									generalServiceItem:data.pkGeneralServiceItem
	    								},
	    								dataType:"json",
	    								success:function(data1){
	    									if(data1.length>0){
	    										Dialog.alert({
	    											title : "提示",
	    											content : "数据被引用无法修改",
	    										});
	    									}else{
	    										form.setData(data);
	    										widget.get("subnav").show(["return"]).hide(["add","search"]);
	    										widget.show(".J-form").hide(".J-grid");
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
														pkGeneralServiceItem : data.pkGeneralServiceItem,
														state : 'Using',
														version : data.version
										}
        								aw.saveOrUpdate("api/generalServiceItem/add",aw.customParam(datas),function(data){
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
												pkGeneralServiceItem : data.pkGeneralServiceItem,
												state : 'Disable',
												version : data.version
										};
        								aw.saveOrUpdate("api/generalServiceItem/add",aw.customParam(datas),function(data){
        	        						widget.get("grid").refresh();
        	        					});
									}
								});
							}
						},{
							key:"delete",	
							icon:"icon-remove",
							
							handler:function(index,data,rowEle){
								aw.del("api/generalServiceItem/" + data.pkGeneralServiceItem + "/delete",function(){
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
						aw.saveOrUpdate("api/generalServiceItem/add",aw.customParam(form.getData()),function(data){
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
    					id : "generalServiceItem",
                    items : [{
                    	name:"pkGeneralServiceItem",
						type:"hidden"
                    },{
                    	name:"version",
                    	defaultValue : "0",
						type:"hidden"
                    },{
                    	name:"code",
						label:"编码",
						validate:["required"],
						exValidate: function(value){
							if(value.length>15){
								return "编码不得超过15位";
							}else{
								return true;
							 }
						}
                    },{
                    	name:"name",
						label:"名称",
						validate:["required"],
						exValidate: function(value){
							if(value.length>15){
								return "名称不得超过15位";
							}else{
								return true;
							 }
						}
                    },{
                    	name:"type",
						label:"类型",
						type:"select",
						options:[{
							key:"Cleaning",
							value:"保洁"
						},{
							key:"LifeService",
							value:"生活服务"
						},{
							key:"LifeNursing",
							value:"生活护理"
						},{
							key:"HealthService",
							value:"健康服务"
						},{
							key:"Rehabilitation",
							value:"康复护理"
						},{
							key:"HealthInspection",
							value:"健康巡查"
						},{
							key:"Emergencyhelp",
							value:"紧急求助"
						},{
							key:"AccompanyMedical",
							value:"陪同就医"
						},{
							key:"HappyService",
							value:"快乐服务"
						},{
							key:"Haircut",
							value:"理发"
						},{
							key:"CompoundFood",
							value:"配餐"	
						}],
						validate:["required"]
                    },{
                    	name:"unit",
						label:"计费单位",
						type:"select",
						options:[{
							key:"Hour",
							value:"小时"
						},{
							key:"Time",
							value:"次"
						},{
							key:"Piece",
							value:"件"
						}],
						validate:["required"]
                    },{
                    	name:"supplier",
						label:"服务商",
						url : "api/supplier/query",
    					keyField:"pkSupplier",
    					valueFiled:"name",
    					params : function(){
                            return {
                            	fetchProperties:"name,pkSupplier",
                            };
                        },
                        format:function(data){
                        	return data.name
                        },
                        type : "select",
                        multi : true
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
						name:"state",
						label:"状态",
						type:"select",
						defaultValue:{
							key:"Init",
							value:"初始"
						},		
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
