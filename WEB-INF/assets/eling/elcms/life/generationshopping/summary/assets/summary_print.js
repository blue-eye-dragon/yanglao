define(function(require,exports,module){
	var MultiRowGrid=require("multirowgrid");
	//多语
	var i18ns = require("i18n");
	var Summary_print={
		init:function(){
			return new MultiRowGrid({
				parentNode:".J-printGrid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					multiField:"shoppinglists",
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间",
						col:2
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
						col:2
					},{
						key:"shoppinglists",
						multiKey:"name",
						name:"物品",
						col:2,
						isMulti:true
					},{
						key:"shoppinglists",
						multiKey:"quantity",
						name:"数量",
						col:1,
						isMulti:true
					},{
						key:"shoppinglists",
						multiKey:"description",
						name:"描述",
						col:5,
						isMulti:true
					}]
				}
			});
		}
	};
	
	module.exports=Summary_print;
});