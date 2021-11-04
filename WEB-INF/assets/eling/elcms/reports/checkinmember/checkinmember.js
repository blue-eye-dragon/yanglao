define(function(require, exports, module) {
	var BaseView=require("baseview");
	var checkinmember = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"新入住会员明细",
					time:{
						click:function(time){
							widget.get("list").refresh();
						}
					},
					buttons:[]
				}
			};
		},
				
		initList:function(widget){
			return{
				url:"api/member/query",
				params:function(){
					var time=widget.get("subnav").getValue("time");
					return {
						"memberSigning.checkInDate":time.start,
						"memberSigning.checkInDateEnd":time.end,
						fetchProperties:"*,memberSigning.room.number,personalInfo.name,memberSigning.checkInDate," +
							"personalInfo.sex.value," +
							"personalInfo.birthday," +
							"personalInfo.idNumber," +
							"personalInfo.address"
					};
				},
				model:{
					columns:[{
						key:"memberSigning.checkInDate",
						name:"入住时间",
						format:"date"
					},{
						key:"memberSigning.room.number",
						name:"房号"
					},{
						key:"personalInfo.name",
						name:"姓名",
					},{
						key:"personalInfo.sex.value",
						name:"性别",
					},{
						key:"personalInfo.birthday",
						name:"年龄",
						format:"age"
					},{
						key:"personalInfo.idNumber",
						name:"证件号码",
					},{
						key:"personalInfo.address",
						name:"居住地址",
					}]
				}
			};
		}
	});
	module.exports = checkinmember;
});