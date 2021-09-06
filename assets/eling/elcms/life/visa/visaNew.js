define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	var form = require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
	//多语
	var i18ns = require("i18n");
	var visa=BaseView.extend({
		events:{
			"change .J-endTime":function(e){
				var widget=this;
				var card =widget.get("card");
				var endTime = card.getValue("endTime");
				if(endTime){
					card.setValue("remindTime",moment(endTime).subtract("months",1).format("YYYY-MM-DD"));
				}
				
			},
			"change .J-member":function(e){
				var widget=this;
				var card =widget.get("card");
				var pkMember = card.getValue("member");
				if(pkMember){
					var member=	card.getData("member",{
							pk:pkMember
						});
					card.setValue("membernumber",member.memberSigning.room.number);
				}else{
					card.setValue("membernumber","");
				}
				
			}
			
		},
		
		initSubnav:function(widget){
			return {
				model:{
					title:"外籍签证登记",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/visa/search",
							data:{
								s:str,
								properties:
										"member.memberSigning.room.number," +
										"member.personalInfo.name," +
										"member.personalInfo.nameEn,"+
										"member.personalInfo.sex,"+
										"visaNumber,"+
										"member.personalInfo.citizenship.name," +
										"member.personalInfo.idType,"+
										"member.personalInfo.idNumber,"+
										"description",
										fetchProperties:"*,member.personalInfo.name,member.personalInfo.nameEn,member.personalInfo.pkPersonalInfo" +
										",member.memberSigning.room.number,member.personalInfo.sex,member.personalInfo.citizenship.name" +
										",member.personalInfo.birthday,member.personalInfo.idNumber,member.personalInfo.idType,member.pkMember",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
					
					
					buttonGroup:[{
						id:"orderString",
						items:[{
							key:"endTime:desc",
							value:"签证到期日期"
						},{
							key:"remindTime:desc",
							value:"提醒日期"
						},{
							key:"member.memberSigning.room.number",
							value:"房间号"
						}],
						handler:function(key,element){
							widget.get("list").refresh()
						}
					},{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					},{
						id:"status",
						showAll:true,
						showAllFirst:true,
						items:[{
							key:"Normal",
							value:"正常"
						},{
							key:"Termination",
							value:"终止"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
				}
			};
		},
		initList:function(widget){
			return {
				url:"api/visa/query",
				params:function(){
					return {
						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
						"member.statusIn":"Normal,Out,Nursing,Behospitalized,Waitting,NotLive,NursingAndBehospitalized",
						"status":widget.get("subnav").getValue("status"),
						"orderString":widget.get("subnav").getValue("orderString"),
						fetchProperties:"*,member.personalInfo.name,member.personalInfo.nameEn,member.personalInfo.pkPersonalInfo" +
								",member.memberSigning.room.number,member.personalInfo.sex,member.personalInfo.citizenship.name" +
								",member.personalInfo.birthday,member.personalInfo.idNumber,member.personalInfo.idType,member.pkMember",
					};
				},
				model:{
					columns:[{
 						key:"member.memberSigning.room.number",
 						name:"房间号", 
 						format:"detail",
 						formatparams:[{
 							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
 						}]
 					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")+"姓名"
					},{
						key:"member.personalInfo.nameEn",
						name:"英文名"
					},{
						key:"member.personalInfo.sex.value",
						name:"性别"
					},{
						key:"member.personalInfo.citizenship.name",
						name:"国籍",
					},{
						key:"member.personalInfo.idType",
						name:"证件类型",
						format:function(row,value){
							var type="";
							if(row=="IdentityCard"){
								type="身份证";
							}else if(row=="Passport"){
								type="护照";
							}else if(row=="DrivingLicence"){
								type="驾驶证";
							}else if(row=="HKandMacaoPermits"){
								type="港澳通行证";
							}else if(row=="TaiwanTrafficPermit"){
								type="台湾通行证";
							}else if(row=="Other"){
								type="其他";
							}
							return type;
						}
					},{
						key:"member.personalInfo.idNumber",
						name:"证件号",
					},{
						key:"visaNumber",
						name:"签证号",
					},{
						key:"member.personalInfo.birthday",
						name:"出生年月",
						format:"date"
					},{
						key:"endTime",
						name:"签证到期日期",
						format:"date"
					},{
						key:"remindTime",
						name:"提醒日期",
						format:"date"
					},{
						key:"description",
						name:"备注",
					},{
						key:"operate",
						name:"操作",
						format:function(row,value){
							if(value.status){
								if(value.status.key=="Termination"){
									return "已作废";
								}else{
									return "button";
								}	
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
								widget.get("card").setValue("roomnumber",data.member.memberSigning.room.number);
								widget.get("card").setAttribute("member","readonly",true);
								widget.get("card").setValue("remindTime",moment(data.remindTime).format("YYYY-MM-DD"));
							}
						},{
							key:"delete",
							text:"作废",
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否作废？",
									confirm:function(){
										aw.ajax({
											url:"api/visa/cancel",
											data:{
												pkVisa:data.pkVisa,
												status:"Termination",
												version:data.version
											},
											dataType:"json",
											success:function(data){
												widget.get("list").refresh();
											}
										});
									}
								});
							
								
								
								
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
					widget.save("api/visa/save",$("#visa").serialize(),function(){
						widget.get("card").setAttribute("member","readonly",false);
						widget.list2Card(false);
						widget.get("list").refresh();
					});
				},
				//取消按钮
				 cancelaction:function(){
					 widget.get("card").reset();
					 widget.list2Card(false);
				 },
				model:{
					id:"visa",
					items:[{
						name:"pkVisa",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:0
					},{
						name:"status",
						type:"hidden",
						defaultValue:"Normal",
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/member/queryForeigner",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							return {
								pkBuilding:widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
     					validate:["required"]
					},{
						name:"roomnumber",
						label:"房间号",
						readonly:true
					},{
						name:"startTime",
						label:"签证日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"endTime",
						label:"截止日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"remindTime",
						label:"提醒时间",
						readonly:true,
						validate:["required"]
					},{
						name:"visaNumber",
						label:"签证号",
						validate:["required"]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		},		
	});
	module.exports=visa;
});
