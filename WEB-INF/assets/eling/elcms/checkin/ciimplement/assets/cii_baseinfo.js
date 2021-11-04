define(function(require,exports,module){
	var Form=require("form-2.0.0")
	var init=function(){
		var form=new Form({
			parentNode:"#cibaseinfo",
			model:{
				id:"cibaseinfoform",
				defaultButton:false,
				items:[{
					name:"pkCIImplement",
					type:"hidden",
				},{
					name:"version",
					type:"hidden",
					defaultValue:"0"
				},{
					name:"memberSigning",
					type:"hidden"
				},{
					name:"buildingname",
					label:"楼号",
					readonly:true
				},{
					name:"roomnumber",
					label:"房间号",
					readonly:true
				},{
					name:"checkInDate",
					type:"date",
					mode:"Y-m-d",
					label:"入住时间",
					validate:["required"]
				},{
					name:"memberphone",
					label:"联系固定电话",
					readonly:true
				},{
					name:"annualFeesPayStatus",
					label:"服务费交纳状态",
					readonly:true
				},{
					name:"mobilephone",
					label:"联系移动电话",
					readonly:true
				},{
					name:"emergencycontact",
					label:"紧急联系人",
					readonly:true
				}]
			}
		});
		seajs.on("el-event-checkinimplement-edit",function(data){
			var result={};
			result.pkCIImplement=data.pkCIImplement;
			result.version=data.version;
			result.status=data.status.key;
			result.memberSigning=data.memberSigning.pkMemberSigning;
			result.buildingname=data.memberSigning.room.building.name;
			result.roomnumber=data.memberSigning.room.number;
			result.annualFee=data.memberSigning.annualFee;
			result.membershipCardFee=data.memberSigning.card.cardType.cardTypeMoney;
			result.checkInDate = data.checkInDate ? moment(data.checkInDate).valueOf() : "";
			var members=data.memberSigning.members || [];
			//两个会员的phone用逗号隔开
			var phones="";
			for(var i=0;i<members.length;i++){
				phones+=members[i].personalInfo.phone ? (members[i].personalInfo.phone + "，") : ""; 
			}
			result.memberphone=phones.substring(0,phones.length-1);
			//两个会员的移动电话
			var mobiles="";
			for(var j=0;j<members.length;j++){
				mobiles+=members[j].personalInfo.mobilePhone ? (members[j].personalInfo.mobilePhone + "，") : ""; 
			}
			result.mobilephone=mobiles.substring(0,mobiles.length-1);
			//紧急联系人
			var ecPersons=data.memberSigning.ecPersons || [];
			var ecPerson="";
			for(var k=0;k<ecPersons.length;k++){
				ecPerson+=ecPersons[k].name ? (ecPersons[k].name + "，") : "";
			}
			result.emergencycontact=ecPerson.substring(0,ecPerson.length-1);
			result.checkInDate=data.memberSigning.checkInDate;
			result.annualFeesPayStatus = data.memberSigning.annualFeesPayStatus;
			form.setData(result);
		});
		return form;
	};
	
	module.exports=init;
});