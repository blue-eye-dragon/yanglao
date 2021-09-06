define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var TryLiveBatch = BaseView.extend({
		events:{
			"change .J-tryLiveProduct":function(e){
				var card=this.get("card");
				var pkTryLiveProduct = card.getValue("tryLiveProduct");
				if(pkTryLiveProduct){
					aw.ajax({
						url : "api/tryliveproducts/query",
						type : "POST",
						data : {
							pkTryLiveProduct:pkTryLiveProduct,
						},
						success:function(data){	
							card.setValue("days",data[0].days);
						}
					});
				}else{
					card.reset();
				}
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"体验批次",
					  search:function(str) {
		            	   widget.get("list").loading();
							aw.ajax({
								url:"api/trylivebatch/search",
								data:{
									s:str,
									properties:"tryLiveDate,batchcode,days,description,peoples,tryLiveProduct.name",
								    fetchProperties:"*,tryLiveProduct.name"
								},
								dataType:"json",
								success:function(data){
									widget.get("list").setData(data);
								}
							});
						},
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-list,.J-adds,.J-time,.J-search").hide(".J-card,.J-return");
						}
					},{
						id:"adds",
						text:"新增",
						handler:function(){
							widget.show(".J-card,.J-return").hide(".J-list,.J-adds,.J-time,.J-search");
							widget.get("card").reset();
							return false;
						}
					}],
					time:{
						click:function(time){
							widget.get("list").refresh();
						}
					}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/trylivebatch/query",
				fetchProperties:"*,tryLiveProduct.*",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
						return {
							tryLiveDate:time.start,
							tryLiveDateEnd:time.end
						};
					
				},
				model:{
					columns:[{
 						key:"tryLiveProduct.name",
 						name:"体验产品",
 					},{
						key:"batchcode",
						name:"批次号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								widget.show(".J-card,.J-return").hide(".J-list,.J-adds,.J-time,.J-search");
							}
						}]
					},{
						key:"tryLiveDate",
						name:"日期",	
						format:"date"	
					},{
						key:"peoples",
						name:"人数(位)",										
					},{
						key:"days",
						name:"天数(天)",										
					},{
						key:"operate",
						name:"操作", 	
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
								widget.show(".J-card,.J-return").hide(".J-list,.J-adds,.J-time,.J-search");
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/trylivebatch/" + data.pkTryLiveBatch + "/delete");
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){	
					widget.save("api/trylivebatch/save",$("#trylivebatch").serialize());
					widget.show(".J-list,.J-adds,.J-time,.J-search").hide(".J-card,.J-return");
				},
				
				//取消按钮
  				cancelaction:function(){
  					widget.show(".J-list,.J-adds,.J-time,.J-search").hide(".J-card,.J-return");
  				},
				model:{
					id:"trylivebatch",
					items:[{
						name:"pkTryLiveBatch",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"tryLiveProduct",
						key:"pkTryLiveProduct",
						value:"name",
						label:"体验产品",
						url:"api/tryliveproducts/query",
						params:{
							fetchProperties:"name,pkTryLiveProduct"
						},
						type:"select",
						validate:["required"]
					},{
						name:"batchcode",
						label:"批次号",
						validate:["required"]
					},{
						name:"tryLiveDate",
						label:"日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"peoples",
						label:"人数(位)",
						validate:["required"]
					},{
						name:"days",
						label:"天数(天)",
						validate:["required"]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = TryLiveBatch;
});