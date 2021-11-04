define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	//多语
	var i18ns = require("i18n");
	var init=function(widget){
		var grid=new Grid({
			parentNode:"#cicardownerinfo",
			autoRender:false,
			model:{
				columns:[{
					key:"membershipCardno",
					name:i18ns.get("sale_card_name","会籍卡号"),
				},{
					key:"personalInfo.name",
					name:"权益人",
				},{
					key:"personalInfo.sex.value",
					name:"性别"
				},{
					key:"personalInfo.birthday",
					name:"年龄",
					format:"age"
				},{
					key:"personalInfo.mobilePhone",
					name:"电话"
				}]
			}
		});
		return grid;
	};
	
	module.exports=init;
});