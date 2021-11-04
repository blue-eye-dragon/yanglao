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
	
	var ServicePrice = ELView.extend({
		attrs:{
            template:template
		},
		events:{
			"change .J-form-generalServicePrice-select-serviceType":function(e){
				var form=this.get("form");
				var  serviceType=form.getValue("serviceType");
				if(serviceType=="ServiceItem"){
					this.hide([".J-griditem"]);
					aw.ajax({
						url:"api/generalServiceItem/query",
						data:{
							state : "Using",
							fetchProperties:"pkGeneralServiceItem," +
											"name," +
											"unit," +
											"version",
						},
						dataType:"json",
						success:function(data){
							for(var i in data){
								data[i].pk=data[i].pkGeneralServiceItem;
							}
							form.setData("servicename",data);
							form.setValue("servicename","");
							form.setValue("price","");
							form.setValue("unit","");
							form.setValue("description","");
							
							form.setValue("serviceType",serviceType);
						}
					});
				}else if(serviceType=="ServicePackage"){
					this.show([".J-griditem"]);
					this.get("griditem").setData("");
					aw.ajax({
						url:"api/generalServicePackage/query",
						data:{
							state : "Using",
							fetchProperties:"pkGeneralServicePackage,name,description,createDate,state,version"
						},
						dataType:"json",
						success:function(data){
							for(var i in data){
								data[i].pk=data[i].pkGeneralServicePackage;
							}
							form.setData("servicename",data);
							form.setValue("servicename","");
							form.setValue("price","");
							form.setValue("unit","");
							form.setValue("description","");
							form.setValue("serviceType",serviceType);
						}
					});
				}
			},
			"change .J-form-generalServicePrice-select-servicename":function(e){
				var form = this.get("form");
				var griditem = this.get("griditem");
				var subnav = this.get("subnav");
				
				form.setValue("price","");
				form.setValue("unit","");
				form.setValue("description","");
				
				var serviceType=form.getValue("serviceType");
				var vai=form.getValue("servicename");
				var data=form.getData("servicename");
				var curItem;
				for(var i in data){
					if(data[i].pk==vai){
						curItem = data[i];
					}
				}
				if(serviceType=="ServiceItem"){
					form.setValue("unit",curItem.unit.value);
					form.setValue("pk",curItem.pk);
				}else if(serviceType=="ServicePackage"){
					form.setValue("unit","套");
					form.setValue("pk",curItem.pk);
					aw.ajax({
						url:"api/generalServicePackageItem/query",
						data:{
							servicePackage:curItem.pkGeneralServicePackage,
							fetchProperties:"pkGeneralServicePackageItem," +
											"count," +
											"cycle," +
											"version," +
											"serviceItem," +
											"serviceItem.pkGeneralServiceItem," +
											"serviceItem.name," +
											"serviceItem.unit," +
											"serviceItem.state",
						},
						dataType:"json",
						success:function(datas){
							griditem.setData(datas);
							var disable="";
							for(var i=0;i<datas.length;i++){
								if(datas[i].serviceItem.state.value=="停用"){
									disable+=datas[i].serviceItem.name+",";
								}else if(i==(datas.length-1)&& datas[i].serviceItem.state.value=="停用"){
									disable+=datas[i].serviceItem.name;
								}
							}
							if(disable!=""){
								Dialog.alert({
									content : "该套餐中"+disable+"项目已停用，启用后才可以定义价格！",
								});
								subnav.hide("save");
							}else{
								subnav.show("save");
							}
							return;
						
						}
					});
				}
			}
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"服务价格定义",
					items :[{
						id : "search",
						type : "search",
						placeholder : "按名称搜索",
						handler : function(str){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/generalServicePrice/search",
								data:{
									s:str,
									searchProperties:"name",
									fetchProperties:"name,price,unit,description,serviceType," +
									"servicePrice.pkGeneralServicePrice," +
									"servicePrice.serviceType," +
									"servicePrice.description," +
									"servicePrice.price," +
									"servicePrice.name," +
									"servicePrice.version," +
									"servicePrice.generalServiceItem.pkGeneralServiceItem," +
									"servicePrice.generalServiceItem.name," +
									"servicePrice.generalServiceItem.unit," +
									"servicePrice.generalServicePackage.pkGeneralServicePackage," +
									"servicePrice.generalServicePackage.name" 
								},
								dataType:"json",
								success:function(data){
									widget.get("subnav").show(["all"]);
									g.setData(data);
								}
							});
						}
					},{
						id : "all",
						type :"button",
						text : "全部",
						show : false,
						handler : function(){
							widget.get("subnav").hide(["all"]);
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
							form.setDisabled("unit",true);
							widget.get("subnav").hide(["search","add","all"]).show(["save","return"]);
							widget.hide([".J-grid"]).show([".J-form"]);
						}
					},{
						id :"save",
						type : "button",
						text : "保存",
						show : false,
						handler : function(){
							var form=widget.get("form");
							var data = form.getData();
							if(data.price ==""|| isNaN(data.price) || parseInt(data.price)<0){
								Dialog.alert({
    								content : "请确认价格！"
    							 });
    	     				    return false;
							}
							if(data.serviceType=="ServiceItem"){
								data.generalServiceItem=data.pk;
							}else if(data.serviceType=="ServicePackage"){
								data.generalServicePackage=data.pk;
							}
							aw.saveOrUpdate("api/generalServicePrice/save",aw.customParam(data),function(data){
								widget.show([".J-grid"]).hide([".J-form",".J-griditem"]);
								widget.get("subnav").hide(["return","save"]).show(["search","add"]);
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
							widget.get("subnav").show(["search","add"]).hide(["save","return"]);
							widget.show([".J-grid"]).hide([".J-form",".J-griditem"]);
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url : "api/generalServicePrice/queryprice",
					params:function(){
						var subnav = widget.get("subnav");
						return{
							fetchProperties:"name,price,unit,description,serviceType," +
									"servicePrice.pkGeneralServicePrice," +
									"servicePrice.serviceType," +
									"servicePrice.description," +
									"servicePrice.price," +
									"servicePrice.name," +
									"servicePrice.version," +
									"servicePrice.generalServiceItem.pkGeneralServiceItem," +
									"servicePrice.generalServiceItem.name," +
									"servicePrice.generalServiceItem.unit," +
									"servicePrice.generalServicePackage.pkGeneralServicePackage," +
									"servicePrice.generalServicePackage.name",
						}
					},
					columns : [{
						name : "servicePrice.name",
						label : "价格名称",
						className:"twoColumn",
						format:"detail",
						formatparams:{
 							key:"detail",
							handler:function(index,data,rowEle){

                            	var form=widget.get("form");
                            	
//                            	aw.ajax({
//    								url:"api/generalcharges/query",
//    								data:{
//    									GeneralServicePackage:data.pkGeneralServicePackage
//    								},
//    								dataType:"json",
//    								success:function(data1){
//    									if(data1.length>0){
//    										Dialog.alert({
//    											title : "提示",
//    											content : "数据被引用无法修改",
//    										});
//    									}
//    									else
//    										{
//    										}
//    								}
//    							});
                            	form.setData(data);
                            	form.setValue("name",data.servicePrice.name);
								form.setValue("pkGeneralServicePrice",data.servicePrice.pkGeneralServicePrice);
								form.setValue("version",data.servicePrice.version);
                            	if(data.serviceType.value=="服务项目"){
                            		aw.ajax({
                						url:"api/generalServiceItem/query",
                						data:{
                							state : "Using",
                							fetchProperties:"pkGeneralServiceItem," +
                											"name," +
                											"unit," +
                											"version",
                						},
                						dataType:"json",
                						success:function(datas){
                							for(var i in datas){
                								datas[i].pk=datas[i].pkGeneralServiceItem;
                							}
                							form.setData("servicename",datas);
                							data.servicePrice.generalServiceItem.pk = data.servicePrice.generalServiceItem.pkGeneralServiceItem;
    	                            		form.setValue("servicename",data.servicePrice.generalServiceItem);
    	                            		form.setValue("pk",data.servicePrice.generalServiceItem.pkGeneralServiceItem);
                						}
                					});
                            		
                            	}else if(data.serviceType.value=="服务套餐"){
                            		aw.ajax({
                						url:"api/generalServicePackage/query",
                						data:{
                							state : "Using",
                							fetchProperties:"pkGeneralServicePackage,name,description,createDate,state,version"
                						},
                						dataType:"json",
                						success:function(datas){
                							for(var i in datas){
                								datas[i].pk=datas[i].pkGeneralServicePackage;
                							}
                							form.setData("servicename",datas);
                							data.servicePrice.generalServicePackage.pk = data.servicePrice.generalServicePackage.pkGeneralServicePackage;
    	                            		form.setValue("servicename",data.servicePrice.generalServicePackage);
    	                            		form.setValue("pk",data.servicePrice.generalServicePackage.pkGeneralServicePackage);
    	                            		aw.ajax({
    	                						url:"api/generalServicePackageItem/query",
    	                						data:{
    	                							servicePackage:data.servicePrice.generalServicePackage.pkGeneralServicePackage,
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
    	                						success:function(data){
    	                							widget.show([".J-griditem"]);
    	                							widget.get("griditem").setData(data);
    	                						}
    	                					});
                						}
                					});
                            	}
                            	form.setDisabled(true);
								widget.get("subnav").show(["return","save"]).hide(["add","search"]);
								widget.show([".J-form"]).hide(".J-grid");
						
							}
 						}
					},{
						name : "name",
						label : "项目/套餐名称",
						className:"twoColumn",
					},{
						name : "price",
						label : "价格(元)",
						className:"oneColumn",
					},{
						name : "unit",
						label : "单位",
						className:"oneColumn",
					},{
						name : "description",
						label : "说明",
						className : "twoColumn",
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
	                            	form.setDisabled(false);
	                            	form.setData(data);
	                            	form.setValue("name",data.servicePrice.name);
									form.setValue("pkGeneralServicePrice",data.servicePrice.pkGeneralServicePrice);
									form.setValue("version",data.servicePrice.version);
	                            	if(data.serviceType.value=="服务项目"){
	                            		aw.ajax({
	                						url:"api/generalServiceItem/query",
	                						data:{
	                							state : "Using",
	                							fetchProperties:"pkGeneralServiceItem," +
	                											"name," +
	                											"unit," +
	                											"version",
	                						},
	                						dataType:"json",
	                						success:function(datas){
	                							for(var i in datas){
	                								datas[i].pk=datas[i].pkGeneralServiceItem;
	                							}
	                							form.setData("servicename",datas);
	                							data.servicePrice.generalServiceItem.pk = data.servicePrice.generalServiceItem.pkGeneralServiceItem;
	    	                            		form.setValue("servicename",data.servicePrice.generalServiceItem);
	    	                            		form.setValue("pk",data.servicePrice.generalServiceItem.pkGeneralServiceItem);
	                						}
	                					});
	                            		
	                            	}else if(data.serviceType.value=="服务套餐"){
	                            		aw.ajax({
	                						url:"api/generalServicePackage/query",
	                						data:{
	                							state : "Using",
	                							fetchProperties:"pkGeneralServicePackage,name,description,createDate,state,version"
	                						},
	                						dataType:"json",
	                						success:function(datas){
	                							for(var i in datas){
	                								datas[i].pk=datas[i].pkGeneralServicePackage;
	                							}
	                							form.setData("servicename",datas);
	                							data.servicePrice.generalServicePackage.pk = data.servicePrice.generalServicePackage.pkGeneralServicePackage;
	    	                            		form.setValue("servicename",data.servicePrice.generalServicePackage);
	    	                            		form.setValue("pk",data.servicePrice.generalServicePackage.pkGeneralServicePackage);
	    	                            		aw.ajax({
	    	                						url:"api/generalServicePackageItem/query",
	    	                						data:{
	    	                							servicePackage:data.servicePrice.generalServicePackage.pkGeneralServicePackage,
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
	    	                						success:function(data){
	    	                							widget.show([".J-griditem"]);
	    	                							widget.get("griditem").setData(data);
	    	                						}
	    	                					});
	                						}
	                					});
	                            	}
	                            	form.setDisabled("unit",true);
									widget.get("subnav").show(["return","save"]).hide(["add","search"]);
									widget.show([".J-form"]).hide(".J-grid");
							}
						},{
							key:"delete",	
							icon:"icon-remove",
							handler:function(index,data,rowEle){
								aw.del("api/generalServicePrice/" + data.servicePrice.pkGeneralServicePrice + "/delete",function(){
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
					id : "generalServicePrice",
					defaultButton:false,
                    items : [{
                    	name:"pkGeneralServicePrice",
						type:"hidden"
                    },{
                    	name:"version",
                    	defaultValue : "0",
						type:"hidden"
                    },{
                    	name:"pk",
						type:"hidden"
                    },{
                    	name:"name",
						label:"价格名称",
						validate:["required"],
                    },{
                    	name:"serviceType",
						label:"类别",
						type:"select",
						options:enums["com.eling.elcms.service.model.GeneralServicePrice.ServiceType"],
						validate:["required"],
                    },{
                    	name:"servicename",
						label:"项目/套餐名称",
						lazy:true,
						type:"select",
						keyField:"pk",
    					valueField:"name",
						validate:["required"]
                    },{
                    	name:"price",
						label:"价格",
						validate:["required"]
                    },{
                    	name:"unit",
						label:"单位",
                    },{
	   					name:"description",
						label:"说明",
						type:"textarea",
                    }]
                }
			});
			this.set("form",form);
			
			var griditem = new Grid({
				parentNode:".J-griditem",
				model : {
					id : "servicePackageItems",
					head : {
						title : "服务项目",
					},
					columns : [{
						name : "serviceItem.name",
						label : "项目名称",
						className:"twoColumn",
					},{
						name : "cycle.value",
						label : "周期",
						className:"twoColumn",
					},{
						name : "count",
						label : "数量",
						className:"twoColumn",
					},{
						name : "serviceItem.unit.value",
						label : "单位",
						className:"twoColumn",
					}]
				}
			});
			this.set("griditem",griditem);
		},
	});
	module.exports = ServicePrice;
});
