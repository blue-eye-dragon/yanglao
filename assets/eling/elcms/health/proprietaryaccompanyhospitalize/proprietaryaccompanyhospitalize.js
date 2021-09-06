define(function(require, exports, module) {
	var BaseView=require("baseview");
    var Dialog=require("dialog-1.0.0");
    require("../../grid_css.css");
	//多语
	var i18ns = require("i18n");
	var ProprietaryAccompanyHospitalize = BaseView.extend({
		
		events:{
			"change .J-member" : function(){
				this.get("card").load("diseaseDetails");
			}
		},

		initSubnav:function(widget){
			return {
				model:{
					title:"专属陪同就医",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					}],
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							$(".J-card,.J-return").addClass("hidden");
							$(".J-list,.J-add,.J-building,.J-time").removeClass("hidden");						
						}
					},{
						id:"add",
						text:"新增",
						handler:function(){
							$(".J-list,.J-add").addClass("hidden");
							$(".J-card,.J-return,.J-building,.J-time").removeClass("hidden");
							var data={
								transportation:{key:"EmergencyCar",value:"120"},
								continueAttention:{key:"Yes",value:"是"},
								service:{key:"Free",value:"无偿"},
								diseaseType:{key:"General",value:"普通门诊"}
							};
							widget.get("card").reset();
							widget.get("subnav").hide(["time"])
							widget.get("card").setData(data);
							return false;
						}
					}],
					time:{
						click:function(time){
							widget.get("list").refresh();
						}
					}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/proprietaryaccompanyhospitalize/query",
				fetchProperties:"*,diseaseDetails.name,member.memberSigning.room.number,member.personalInfo.name,member.pkMember,diseaseDetails.pkDiseaseDetail,member.personalInfo.name,hospital.name,member.memberSigning.room.number,member.memberSigning.room.building.*",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
						return {
							createDate:time.start,
							createDateEnd:time.end,
							"member.memberSigning.room.building":subnav.getValue("building")
						};
					
				},
				model:{
					columns:[{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
						format:"detail",
						className:"oneColumn",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("subnav").hide(["building","time"]);
								widget.get("card").load("diseaseDetails",{
									params:{
										member:data.member.pkMember
									},
									callback:function(){
										widget.edit("detail",data);
									}
								});
							}
						}]
					},{
						key:"member.memberSigning.room.number",
						name:"房间号",
						className:"oneColumn",
					},{
						key:"createDate",
						name:"看病日期",	
						format:"date"						
					},{
						key:"accompanyDateStart",
						name:"陪同开始时间",	
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						className:"oneHalfColumn",
					},{
						key:"accompanyDateEnd",
						name:"陪同结束时间",	
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						className:"oneHalfColumn",
					},{
						key:"diseaseDetails",
						name:"疾病",			
						format:function(value,row){ 
							var val="";							
							for (var int = 0; int < value.length; int++) {
							val=val+"、"+value[int].name; 
						 }	
							return value ? val.substr(1) : "" ;
						},
						className:"twoColumn",
					},{
						key:"diseaseType.value",
						name:"就诊类型",
						className:"oneColumn",
					},{
						key:"hospital.name",
						name:"医院",
						className:"twoColumn",
					},{
						key:"operate",
						name:"操作",
						format:"button",
						className:"oneColumn",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("subnav").hide(["building","time"]);
								widget.get("card").load("diseaseDetails",{
									params:{
										member:data.member.pkMember
									},
									callback:function(){
										widget.edit("edit",data);
									}
								});
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/proprietaryaccompanyhospitalize/" + data.pkProprietaryAccompanyHospitalize + "/delete");
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
					var data=$("#proprietaryaccompanyhospitalize").serializeArray();
					var form=widget.get("card").getData();
					var createDate=form.createDate;
					var accompanyDateStart=form.accompanyDateStart;
					var accompanyDateEnd=form.accompanyDateEnd;
        			if(createDate>accompanyDateStart){
        				Dialog.alert({
							content:"陪同开始时间不能小于看病日期！"
						});
        				return;
        			}
        			//CheckInNursingHomeRegistered
        			//data.sendTime!=""&&moment(data.sendTime).isAfter(moment(Number(data.checkInDate)), 'day')
        			if(accompanyDateStart>accompanyDateEnd){
        				Dialog.alert({
							content:"陪同结束时间不能小于陪同开始时间！"
						});
        				return;
        			}
					widget.save("api/proprietaryaccompanyhospitalize/save",$("#proprietaryaccompanyhospitalize").serialize(),function(data){
						if(data.msg == "已存在"){
							Dialog.alert({
								content:"该日期已存在记录"
							});
							return {
								forward:false
							};
						}
						else{
							widget.get("list").refresh();
						}
					});
					widget.get("subnav").show(["time","building"]);
				},
				model:{
					id:"proprietaryaccompanyhospitalize",
					items:[{
						name:"pkProprietaryAccompanyHospitalize",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
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
						name:"createDate",
						label:"看病日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"accompanyDateStart",
						label:"陪同开始时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"accompanyDateEnd",
						label:"陪同结束时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"diseaseDetails",
						key : "pkDiseaseDetail",
						label : "疾病",
						value : "name",
						type : "select",
						url : "api/diseasedetail/querybymember",		
						lazy:true,
						params:function(){
							return {
								pkMember:widget.get("card").getValue("member")
							};
						},
						multi:true,
						validate : [ "required" ]
					},{
						name:"diseaseType",
						label:"就诊类型",						
						type:"radiolist",
						list:[{
							key:"Emergent",
							value:"急诊"
						},{
							key:"General",
							value:"普通门诊"
						}],
					    validate:["required"]
					},{
						name:"transportation",
						label:"交通",						
						type:"radiolist",
						list:[{
							key:"EmergencyCar",
							value:"120"
						},{
							key:"Other",
							value:"其他"
						}],
					    validate:["required"]
					},{
						name:"expenses",
						label:"费用(元)",
						validate:["required"]
					},{
						name:"service",
						label:"服务",						
						type:"radiolist",
						list:[{
							key:"Paid",
							value:"有偿"
						},{
							key:"Free",
							value:"无偿"
						}],
					    validate:["required"]
					},{							
						name:"hospital",
						label:"就诊医院",
						url:"api/hospital/query",
						key:"pkHospital",
						value:"name",
						type:"select",
						validate:["required"]
				
					},{
						name:"hospitalDepartment",
						label:"科室",
						validate:["required"]
					},{
						name:"diseaseReason",
						label:"陪同原因",
						type:"textarea",
						height:100
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = ProprietaryAccompanyHospitalize;
});