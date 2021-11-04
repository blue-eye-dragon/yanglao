define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var Company = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"体验产品",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-list,.J-adds,.J-search").hide(".J-card,.J-return");
						}
					},{
						id:"adds",
						text:"新增",
						handler:function(){
							widget.show(".J-card,.J-return").hide(".J-list,.J-adds,.J-search");
							widget.get("card").reset();
							return false;
						}
					}],
					   search:function(str) {
		            	   widget.get("list").loading();
							aw.ajax({
								url:"api/tryliveproducts/search",
								data:{
									s:str,
									properties:"name,days,price,description,cardType.name",
								    fetchProperties:"*,cardType.name"
								},
								dataType:"json",
								success:function(data){
									widget.get("list").setData(data);
								}
							});
						}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/tryliveproducts/query",
				params:{
					fetchProperties:"*,cardType.name"
				},
				model:{
					columns:[{
						key:"name",
						name:"产品名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								widget.edit("detail",data);
								widget.show(".J-card,.J-return").hide(".J-list,.J-adds,.J-search");
								return false;
							} 
						}]
					},{
						key:"days",
						name:"天数"
					},{
						key:"price",
						name:"价格"
					},{
						key:"description",
						name:"备注"
					},{
						key:"cardType.name",
						name:"卡类型"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								widget.edit("edit",data);
								widget.show(".J-card,.J-return").hide(".J-list,.J-adds,.J-search");
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/tryliveproducts/" + data.pkTryLiveProduct + "/delete");
								return false;
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
					widget.save("api/tryliveproducts/save",$("#trylive").serialize());
					widget.show(".J-list,.J-adds,.J-search").hide(".J-card,.J-return");
				},
				//取消按钮
  				cancelaction:function(){
  					widget.show(".J-list,.J-adds,.J-search").hide(".J-card,.J-return");
  				},
				model:{
					id:"trylive",
					items:[{
						name:"pkTryLiveProduct",
						type:"hidden"
					},{
						name:"name",
						label:"产品名称",
						validate:["required"]
					},{
						name:"days",
						label:"天数",
					},{
						name:"price",
						label:"价格"
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					},{
						name:"cardType",
						label:"卡号类型",
						type:"select",
						url:"api/cardtype/query",
						key:"pkMemberShipCardType",
						value:"name",
						validate:["required"]
					}]
				}
			};
		}
	});
	module.exports = Company;
});