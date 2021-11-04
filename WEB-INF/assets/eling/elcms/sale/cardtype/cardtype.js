define(function(require, exports, module) {
	var BaseView=require("baseview");
	//多语
	var i18ns = require("i18n");
	var MemberShipCardType = BaseView.extend({
		initSubnav:function(){
			return {
				model:{
					title: i18ns.get("sale_card_typetitle","会籍卡类别定义")
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/cardtype/query",
				fetchProperties:"*,community.name",
				model:{
					columns:[{
						key:"name",
						name:"名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"community.name",
						name:"所属社区"
					},{
						key:"quantityLimit",
						name: i18ns.get("sale_card_name","会籍卡")+"上限"
					},{
						key:"isBindRoom",
						name:"绑定房间",
						format:function(value,row){
							return value ? "是" : "否";
						}
					},{
						key:"isExperience",
						name: i18ns.get("sale_card_isexperience","是否体验卡"),
						format:function(value,row){
							return value ? "是" : "否";
						}
					},{
						key:"cardTypeMoney",
						name: i18ns.get("charge_shipfees_confees","卡费")+"（元）"
					},{
						key:"description",
						name:"说明"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/cardtype/" + data.pkMemberShipCardType + "/delete");
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
					widget.save("api/cardtype/add",$("#cardtype").serialize());
				},
				model:{
					id:"cardtype",
					items:[{
						name:"pkMemberShipCardType",
						type:"hidden",
						show:false
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"name",
						label:"名称",
						validate:["required"]
					},{
						name:"community",
						label:"所属社区",
						type:"select",
						url:"api/community/query",
						key:"pkCommunity",
						value:"name",
						validate:["required"],
					},{
						name:"quantityLimit",
						label:i18ns.get("sale_card_name","会籍卡")+"上限",
						validate:["required","number"]
						
					},{
						name:"isBindRoom",
						label:"绑定房间",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}],
						validate:["required"]
					},{
						name:"isExperience",
						label:i18ns.get("sale_card_isexperience","是否体验卡"),
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}],
						validate:["required"]
					},{
						name:"cardTypeMoney",
						label:i18ns.get("charge_shipfees_confees","卡费")+"（元）",
						validate:["number"]
					},{
						name:"description",
						label:"说明",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = MemberShipCardType;
});