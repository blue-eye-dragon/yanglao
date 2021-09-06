define(function(require,exports,module){
	var MultiRowGrid=require("multirowgrid");
	//多语
	var i18ns = require("i18n");
	var Summary_grid={
		init:function(params,widget){
			return new MultiRowGrid({
				parentNode:".J-grid",
				url:"api/generationshoppingapplication/query",
				params:{
					flowStatusIn:"Commited",
					fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,shoppinglists.name,shoppinglists.quantity,shoppinglists.description"
				},
				model:{
					isCheckbox:true,
					multiField:"shoppinglists",
					head:{
						title:""
					},
					columns:[{
						key:"member",
						name:i18ns.get("sale_ship_owner","会员"),
						format:function(value,row){
							return value.memberSigning.room.number + " " + value.personalInfo.name;
						},
						col:2
					},{
						key:"shoppinglists",
						multiKey:"name",
						name:"物品",
						isMulti:true,
						col:2
					},{
						key:"shoppinglists",
						name:"数量",
						multiKey:"quantity",
						isMulti:true,
						col:1
					},{
						key:"shoppinglists",
						name:"描述",
						multiKey:"description",
						col:5,
						isMulti:true
					},{
						key:"flowStatus",
						name:"申请单状态",
						col:5,
						format:function(value,row){
							if(value == "Commited"){
								return "已提交";
							}else if(value == "Printed"){
								return "购买中";
							}else if(value == "Bought"){
								return "已买回";
							}else if(value == "Closed"){
								return "已发放";
							}else{
								return "";
							}
						}
					}]
				}
			});
		}
	};
	
	module.exports=Summary_grid;
});