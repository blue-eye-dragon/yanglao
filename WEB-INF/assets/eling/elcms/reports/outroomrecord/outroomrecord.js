define(function(require, exports, module) {
	var BaseView=require("baseview");
	var checkoutroomapproval = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"退房会员明细",
					time:{
						click:function(time){
						    widget.get("list").refresh({
						    	start:time.start,
								end:time.end,
								flowStatusIn:"Approval"
							});
						}
					},
					buttons:[]
				}
			};
		},
				
		initList:function(){
			return{
				url:"api/checkoutroom/queryreports",
				params:{
					fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name," +
						"member.personalInfo.sex," +
						"member.personalInfo.birthday," +
						"member.personalInfo.idNumber," +
						"member.personalInfo.address",
					flowStatusIn:"Approval"
				},
				model:{
					columns:[{
						key:"date",
						name:"退房时间",
						format:"date"
					},{
						key:"member.memberSigning.room.number",
						name:"房号"
					},{
						key:"member.personalInfo.name",
						name:"姓名"
					},{
						key:"member.personalInfo.sex.value",
						name:"性别"
					},{
						key:"member",
						name:"年龄",
						format:function(value,row){
							if(value.personalInfo.birthday=="" || value.personalInfo.birthday==null){
								return "";
							}
							else{
								return moment().diff(value.personalInfo.birthday,"year") +"岁";
							}
						}
					},{
						key:"member.personalInfo.idNumber",
						name:"证件号码"
					},{
						key:"member.personalInfo.address",
						name:"居住地址"
					}]
				}
			};
		}
	});
	module.exports = checkoutroomapproval;
});