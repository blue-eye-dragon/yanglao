define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper"); 
	var Dialog=require("dialog-1.0.0");
	//多语
	var i18ns = require("i18n");
	var examrecord = BaseView.extend({
		events:{
			"change .J-member":function(e){
				var card=this.get("card");
				var pk=card.getValue("member");
				card.load("diseaseDetail",{
					params:{
						pkMember:pk,
						fetchProperties:"pkDiseaseDetail,name"
                	}
				});
			}
		}, 
		initSubnav:function(widget){ 
			return {
				model:{
					title:"复诊提醒",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				autoRender:false,
				url : "api/examrecord/queryNext",
				fetchProperties:"*,hospital.name,diseaseDetail.name,member.memberSigning.room.number,member.personalInfo.name,member.pkMember,diseaseDetail.pkDiseaseDetail",
				params:function(){
					return {
						pkBuilding:widget.get("subnav").getValue("building")
					};
				},
				model:{
					columns:[{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
//								widget.get("card").load("diseaseDetail",{
//									params:{
//										pkMember:data.disease.member.pkMember,
//										fetchProperties:"pkDiseaseDetail,name"
//									},
//									callback:function(){
										data.member=data.member;
										data.room=data.member.memberSigning.room.number;
										widget.edit("detail",data);
//									}
//								});
							}
						}]
					},{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"diseaseDetail.name",
						name:"疾病"
					},{
						key : "etcommdata",
						name : "健康数据"
					},{
						key:"date",
						name:"复诊时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"hospital.name",
						name:"复诊医院"
					},{
						key:"doctor",
						name:"主治医生"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
//								widget.get("card").load("diseaseDetail",{
//									params:{
//										pkMember:data.disease.member.pkMember,
//										fetchProperties:"pkDiseaseHistory,name"
//									},
//									callback:function(){
										data.member=data.member;
										data.room=data.member.memberSigning.room.number;
										widget.edit("edit",data);
//									}
//								});
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/examrecord/" + data.pkExaminationRecord + "/delete");
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
					var data=$("#examrecord").serializeArray();
 					var checkDate =  moment(data[4].value).valueOf();
 					if(checkDate !=null){
 						var remindStartTime = moment(data[5].value).valueOf();
 						if(remindStartTime !=null){
 	 						if(remindStartTime>= checkDate){
 	 							Dialog.alert({
 	 								content:"提醒开始时间不能晚于复诊时间"
 	 	 						});
 	 							return {
 									forward:false
 								};
 	 	 					}
 						}
 					}
 					widget.save("api/examrecord/save",$("#examrecord").serialize());
				},
				model:{
					id:"examrecord",
					items:[{
						name:"pkExaminationRecord",
						type:"hidden"
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/member/query",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							return {
								"memberSigning.room.building":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
						validate:["required"]
					},{
						name:"diseaseDetail",
						key:"pkDiseaseDetail",
						label:"疾病",
						value:"name",
						type:"select",
						url : "api/diseasedetail/querybymember",
						validate:["required"]
					},{
						name : "etcommdata",
						label : "健康数据",
						type:"textarea"
					},{
						name:"date",
						label:"复诊时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"remindStartTime",
						label:"提醒开始时间",
						type:"date",
						mode:"Y-m-d H:i"
					},{
						name : "hospital",
						label : "复诊医院",
						type:"select",
						key:"pkHospital",
						url:"api/hospital/query",
						value:"name",
						validate : [ "required" ]
					},{
						name:"doctor",
						label:"主治医生",
						type:"text"
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
				aw.ajax({
					url : "api/examrecord/query",
					type : "POST",
					data : {
						pkExaminationRecord : params.pkFather,
						fetchProperties:"*,hospital.name,diseaseDetail.name,member.memberSigning.room.number,member.personalInfo.name,member.pkMember,diseaseDetail.pkDiseaseDetail",
					},
					success : function(result) {
						widget.get("list").setData(result);
					}
				});
			} else {
				this.get("list").refresh(params);
			}
    	}
	});
	module.exports = examrecord;
});