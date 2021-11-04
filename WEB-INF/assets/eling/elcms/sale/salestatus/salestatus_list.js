define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw  = require("ajaxwrapper");
	
	var visitorrecord = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"销售全景",
				}
			};
		},
		initList:function(widget){
			return {
				fetchProperties:"*,cardType.name,member.personalInfo.name,personalInfo.birthday,personalInfo.sex.value,personalInfo.phone",
				model:{
					head:{
                		title:"卡号：  房间号：  入住日期："
                	},
					columns:[{
						key:"cardType.name",
						name:"类型",
					},{
						key:"member.personalInfo.name",
						name:"姓名"
					},{
						key:"personalInfo.sex.value",
						name:"性别",
					},{

						key:"personalInfo.birthday",
						name:"年龄",
						format:function(value,row){
							return moment().diff(value,"year");
						}
					
					},{
						key:"personalInfo.phone",
						name:"电话"
					}]
				}
			};
		},
	});
	module.exports = visitorrecord;
});