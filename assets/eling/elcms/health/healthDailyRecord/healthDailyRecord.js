define(function(require, exports, module) {
	var ELView = require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");
	var Tab = require("tab");
	var Grid = require("grid-1.0.0");
	var Form = require("form-2.0.0")
	var Dialog = require("dialog-1.0.0");
	var store = require("store");
	var HealthStandard = require("healthstandard");
	var activeUser=store.get("user");
	var enmu = require("enums");
	//多语
	var i18ns = require("i18n");
	var healthDailyRecord = ELView.extend({
		attrs : {
			template : "<div class='J-subnav'></div>"
				+ "<div class='J-tab'></div>"
				+ "<div class='J-main-date hidden'></div>"
		},
		_toEdit:function(mark){
			var params=this.get("params");
			if(!params){
				var subnav=this.get("subnav");
				if(mark){
					var title="健康日志："+subnav.getText("defaultMembers");
					subnav.setTitle(title);
					subnav.hide(["defaultMembers"]);
				}else{
					subnav.setTitle("健康日志");
					subnav.show(["defaultMembers"]);
				}
				
			}
		},
		_initGrid : function() {
			this.get("healthGrid").refresh();
			this.get("diseaseGrid").refresh();
			this.get("nextExamGrid").refresh();
			this.get("patientGrid").refresh();
			this.get("phyStatusGrid").refresh();
			this.get("reportGrid").refresh();
			this.get("AllerGrid").refresh();
			this.get("medRecGrid").refresh();
			this.get("phaTakGrid").refresh();
		},
		getMember:function(){
			var params=this.get("params");
			if(params && params.pkMember){
				return params.pkMember;
			}else{
				return this.get("subnav").getValue("defaultMembers");
			}
		},
		//刷新疾病下拉框
		refreshDisease:function(){
			//复诊提醒、就诊记录、用药记录表单中的疾病字段要跟着刷新
			//由于重复的地方太多，不能每个地方都调用ajax，否则会有效率问题
			//目前采用的方法时，调用一个疾病下拉框的刷新事件，获取新的疾病列表，再调用setData方法，重新刷新
			//后续改成不刷新
			var params=this.get("params");
			var subnav=this.get("subnav");
			var medRecForm=this.get("medRecForm");
			var phaTakForm=this.get("phaTakForm");
			var nextExamForm=this.get("nextExamForm");
			var diseaseForm=this.get("diseaseForm");
			nextExamForm.load("diseaseDetail",{
				params:{
					pkMember:this.getMember()
				},
				callback:function(){
					var oldData=nextExamForm.getData("diseaseDetail");
					medRecForm.load("diseaseDetails",{
						options:oldData
					});
					phaTakForm.load("diseaseDetails",{
						options:oldData
					});
					diseaseForm.load("diseaseDetail");
				}
			});
		},
		//刷新药品
		refreshMeicine:function(){
			this.get("phaTakForm").load("medicine",{
				params:{
					"member":this.getMember(),
					fetchProperties:"pkMedicine,name,generalName"
				}
			});
		},
		refreshHospital:function(){
			var nextExamForm=this.get("nextExamForm");
			var patientForm=this.get("patientForm");
			var medRecForm=this.get("medRecForm");
			nextExamForm.load("hospital",{
				callback:function(){
					var data=nextExamForm.getData("hospital");
					patientForm.setData("hospital",data);
					medRecForm.setData("hospital",data);
				}
			});
		},
		//刷新健康数据采集人
		refreshHealthDataCreator:function(building){
			this.get("healthForm").load("creator",{
				params:{
					pkRole:20,
					pkBuilding:building,
					fetchProperties:"pkUser,name",
				}
			});
		},
		events : {
			"change .J-form-nextExamForm-date-remindStartTime" : function(e){
				var form=this.get("nextExamForm");
				var remindStartTime=form.getValue("remindStartTime");
				var date=form.getValue("date");
				if(remindStartTime){
					if(moment().isAfter(remindStartTime,"minutes")){
						Dialog.alert({
							content:"提醒开始时间不能早于系统当前时间！"
						});
						form.setValue("remindStartTime",moment().valueOf());
						return;
					}
					if(moment(remindStartTime).isAfter(date,"minutes")){
						Dialog.alert({
							content:"提醒开始时间不能晚于复诊时间！"
						});
						form.setValue("remindStartTime",moment().valueOf());
						return;
					}
					
				} 
			},
			"change .J-form-nextExamForm-date-date" : function(e){
				var form=this.get("nextExamForm");
				var date=form.getValue("date");
				if(date){
					if(moment().isAfter(date,"minutes")){
						Dialog.alert({
							content:"复诊时间不能早于系统当前时间！"
						});
						form.setValue("date",moment().valueOf());
						return;
					}
				}
			},
			"change .J-form-phaTakForm-date-startTime" : function(e){
				var form=this.get("phaTakForm");
				var date=form.getValue("startTime");
				if(date>moment()){
					Dialog.alert({
						content:"开始时间不能晚于当前时间！"
					});
					form.setValue("startTime",moment().valueOf());
					return false;
				}
			},
			//住院登记时间校验
			"change .J-form-patientForm-date-checkInDate" : function(e){
				var form=this.get("patientForm");
				var checkInDate = form.getValue("checkInDate");
				if(moment(checkInDate).isAfter(moment(),"minutes")){
					form.setValue("status","WaittingHospital");
				}else if(moment(checkInDate).isBefore(moment(),"minutes")){
					form.setValue("status","BeInHospital");
				}
			},
			
			//住院登记出院时间校验
			"change .J-form-patientForm-date-checkOutDate" : function(e){
				var form=this.get("patientForm");
				var checkOutDate=form.getValue("checkOutDate");
				var checkInDate = form.getValue("checkInDate");
				if(moment(checkInDate).isAfter(checkOutDate,"minutes")){
					Dialog.alert({
						content:"出院日期不能早于住院日期！"
					});
					form.setValue("checkOutDate","");
					return;
				}
				if(moment(checkInDate).isBefore(moment(),"minutes")){
					form.setValue("status","BeInHospital");
				}
			},
			//过敏史“发现时间”校验
			"change .J-form-AllerForm-date-date" : function(e){
				var form=this.get("AllerForm");
				var date=form.getValue("date");
				if(date>moment()){
					Dialog.alert({
						content:"发现时间不能晚于今天！"
					});
					form.setValue("date",moment().valueOf());
					return;
				}
			},
			
			//家庭医生巡检记录“记录时间”校验
			"change .J-form-reportForm-date-updateTime" : function(e){
				var form=this.get("reportForm");
				var updateTime=form.getValue("updateTime");
				if(updateTime>moment()){
					Dialog.alert({
						content:"记录时间不能晚于今天！"
					});
					form.setValue("updateTime",moment().valueOf());
					return;
				}
			},
			
			//就诊记录“就诊时间”校验
			"change .J-form-medRecForm-date-date" : function(e){
				var form=this.get("medRecForm");
				var date=form.getValue("date");
				if(date>moment()){
					Dialog.alert({
						content:"就诊时间不能晚于今天！"
					});
					form.setValue("date",moment().valueOf());
					return;
				}
			},
			
			//日常记录“时间”校验
			"change .J-form-phystatusrecord-date-date" : function(e){
				var form=this.get("phyStatusForm");
				var date=form.getValue("date");
				if(date>moment()){
					Dialog.alert({
						content:"日期不能晚于今天！"
					});
					form.setValue("date",moment().valueOf());
					return;
				}
			},
			
			"change .J-form-patientForm-select-accompanyType" : function(e){
				var form=this.get("patientForm");
				var accompanyType=form.getValue("accompanyType");
				if(accompanyType=="SecretaryAccompany"){
					form.show("secretary");
				}else{
					form.hide("secretary");
				} 
			},
			"click .J-form-diseasehistoryForm-radiolist-diseaseStatus" : function(e) {
				var diseasehistoryForm=this.get("diseaseForm");
				var value = diseasehistoryForm.getValue("diseaseStatus");
				if(value=="RECURE"){
					diseasehistoryForm.show("cureTime");
				}else{
					diseasehistoryForm.hide("cureTime");
					diseasehistoryForm.setValue("cureTime","");
				}
			},
			
			"blur .J-grid-title-input-healthGrid" : function(e) {
				var hour = parseFloat($(e.target).val());
				var pkMember=this.getMember();
				var date=$(".J-main-date").attr("data-key");
				if (hour) {
					aw.ajax({
						url : "api/action/save/healthdata",
						type : "POST",
						data : {
							pkMember : pkMember,
							date : date,
							workHour : hour
						}
					});
				}
				return false;
			},
			
			"blur .J-grid-title-input-phyStatusGrid" : function(e) {
				var hour = parseFloat($(e.target).val());
				var pkMember=this.getMember();
				var date=$(".J-main-date").attr("data-key");
				if (hour) {
					aw.ajax({
						url : "api/action/save/healthstatus",
						type : "POST",
						data : {
							pkMember : pkMember,
							date : date,
							workHour : hour
						}
					});
				}
				return false;
			},
			"change .J-form-healthDataForm-date-createDate":function(e){
				var form=this.get("healthForm");
				var date=form.getValue("createDate");
				if(date>moment()){
					Dialog.alert({
						content:"采集时间不能在当前日期之后"
					});
					form.setValue("createDate",moment().valueOf());
					return;
				}
			},
			"change .J-form-healthDataForm-select-type" : function(e){
				var pkType  =  this.get("healthForm").getValue("type");
				if(pkType){
					var type =  this.get("healthForm").getData("type",{
						pk:pkType,
					});
					if(type&&pkType){
						this.get("healthForm").setValue("value1","");
						this.get("healthForm").setLabel("value1",type.name1);
						this.get("healthForm").show("valueStatus1");	
						if(type.name2){
							this.get("healthForm").show("value2");
							this.get("healthForm").setValue("value2","");
							this.get("healthForm").setLabel("value2",type.name2);	
							this.get("healthForm").show("valueStatus2");	
						}else{
							this.get("healthForm").hide("value2");
							this.get("healthForm").setValue("value2","");
							this.get("healthForm").hide("valueStatus2");	
							this.get("healthForm").setValue("valueStatus2",{});
						}
						if(type.name3){
							this.get("healthForm").show("value3");
							this.get("healthForm").setValue("value3","");
							this.get("healthForm").setLabel("value3",type.name3);
							this.get("healthForm").show("valueStatus3");	
						}else{
							this.get("healthForm").hide("value3");
							this.get("healthForm").setValue("value3","");
							this.get("healthForm").hide("valueStatus3");	
							this.get("healthForm").setValue("valueStatus3",{});
						}
						if(type.name4){
							this.get("healthForm").show("value4");
							this.get("healthForm").setValue("value4","");
							this.get("healthForm").setLabel("value4",type.name4);
							this.get("healthForm").show("valueStatus4");	
						}else{
							this.get("healthForm").hide("value4");
							this.get("healthForm").setValue("value4","");
							this.get("healthForm").hide("valueStatus4");	
							this.get("healthForm").setValue("valueStatus4",{});
						}
						if(type.name5){
							this.get("healthForm").show("value5");
							this.get("healthForm").setValue("value5","");
							this.get("healthForm").setLabel("value5",type.name5);	
							this.get("healthForm").show("valueStatus5");	
						}else{
							this.get("healthForm").hide("value5");
							this.get("healthForm").setValue("value5","");
							this.get("healthForm").hide("valueStatus5");	
							this.get("healthForm").setValue("valueStatus5",{});
						}
						if(type.name6){
							this.get("healthForm").show("value6");
							this.get("healthForm").setValue("value6","");
							this.get("healthForm").setLabel("value6",type.name6);
							this.get("healthForm").show("valueStatus6");	
						}else{
							this.get("healthForm").hide("value6");
							this.get("healthForm").setValue("value6","");
							this.get("healthForm").hide("valueStatus6");	
							this.get("healthForm").setValue("valueStatus6",{});
						}
					}
				}else{
					this.get("healthForm").setLabel("value1","测量值1");
					this.get("healthForm").show("valueStatus1");
					this.get("healthForm").setLabel("valueStatus1","测量值状态");
					this.get("healthForm").show("value2");
					this.get("healthForm").setLabel("value2","测量值2");
					this.get("healthForm").show("valueStatus2");
					this.get("healthForm").setLabel("valueStatus2","测量值状态");
					this.get("healthForm").show("value3");
					this.get("healthForm").setLabel("value3","测量值3");
					this.get("healthForm").show("valueStatus3");
					this.get("healthForm").setLabel("valueStatus3","测量值状态");
					this.get("healthForm").show("value4");
					this.get("healthForm").setLabel("value4","测量值4");
					this.get("healthForm").show("valueStatus4");
					this.get("healthForm").setLabel("valueStatus4","测量值状态");
					this.get("healthForm").show("value5");
					this.get("healthForm").setLabel("value5","测量值5");
					this.get("healthForm").show("valueStatus5");
					this.get("healthForm").setLabel("valueStatus5","测量值状态");
					this.get("healthForm").show("value6");
					this.get("healthForm").setLabel("value6","测量值6");
					this.get("healthForm").show("valueStatus6");
					this.get("healthForm").setLabel("valueStatus6","测量值状态");
				}
			} 
		},
		initComponent : function(params,widget) {
			var defMember = null;
			var inParams=widget.get("params");
			// 初始化subnav
			var subnav = new Subnav({
				parentNode : ".J-subnav",
				model : {
					title : "健康日志",
					buttonGroup : [{
						id : "building",
						show : false,
						handler : function(key, element) {
							widget.get("subnav").load({
								id : "defaultMembers",
								params : {
									"memberSigning.room.building" : key,
									"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
									"memberSigning.status":"Normal",
									"memberSigning.houseingNotIn" : false,
									fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number,status",
								},
								callback : function(data) {
									if(data.length){
										widget.defMember = widget.get("subnav").getData("defaultMembers",widget.getMember());
										widget._initGrid();
										widget.refreshDisease();
										widget.refreshMeicine();
									}else{
										widget.get("healthGrid").setData([]);
										widget.get("diseaseGrid").setData([]);
										widget.get("nextExamGrid").setData([]);
										widget.get("patientGrid").setData([]);
										widget.get("phyStatusGrid").setData([]);
										widget.get("reportGrid").setData([]);
										widget.get("AllerGrid").setData([]);
										widget.get("medRecGrid").setData([]);
										widget.get("phaTakGrid").setData([]);
									}
									
								}
							});
							//楼宇切换需要重新加载健康数据的采集人
							widget.refreshHealthDataCreator(key);
						}
					},{
						id : "defaultMembers",
						handler : function(key, element) {
							widget.defMember = widget.get("subnav").getData("defaultMembers",widget.getMember());
							widget._initGrid();
							widget.refreshDisease();
							widget.refreshMeicine();
						}
					}],
					buttons:[{
						id:"finish",
						text:"完成",
						show:false,
						handler:function() {
							aw.ajax({
								url : "api/healthRout/finish",
								type : "POST",
								data : {
									pkMember : widget.getMember(),
									date : $(".J-main-date").attr("data-key")
								},
								dataType : "json",
								success : function(result) {
									$(".J-btn-goBack").click();
								}
							});
							return false;
						}
					}]
				}
			});
			this.set("subnav", subnav);
			
			var tab = new Tab({
				parentNode : ".J-tab",
				autoRender : true,
				model : {
					items:[{
						id : "memHealth",
						title : "健康数据"
					},{
						id : "memDisease",
						title : "疾病史"
					},{
						id : "memNextExam",
						title : "复诊提醒"
					},{
						id : "memPatient",
						title : "住院记录"
					},{
						id : "memPhyStatus",
						title : "日常记录"
					},{
						id : "memReport",
						title : "家庭医生巡检记录"
					},{
						id : "memAller",
						title : "过敏史"
					},{
						id : "memMedRec",
						title : "就诊记录"
					},{
						id : "memPhaTak",
						title : "用药记录"
					}
					]
				}
			});
			
			// 渲染页签一：健康数据
			var healthForm = new Form({
				parentNode : "#memHealth",
				saveaction : function() {
					var form  = widget.get("healthForm");
					var data = form.getData();
					var typedata = form.getData("type",{
						pk:data.type
					});
					if(data.value1){
						if(typedata.inputNumeric1){
							if(isNaN(Number(data.value1))){
								Dialog.alert({
									content:typedata.name1+"类型只能输入数字！"
								});
								return;
							}
						}
					}
					if(data.value2){
						if(typedata.inputNumeric2){
							if(isNaN(Number(data.value2))){
								Dialog.alert({
									content:typedata.name2+"类型只能输入数字！"
								});
								return;
							}
						}
					}
					if(data.value3){
						if(typedata.inputNumeric3){
							if(isNaN(Number(data.value3))){
								Dialog.alert({
									content:typedata.name3+"类型只能输入数字！"
								});
								return;
							}
						}
					}
					if(data.value4){
						if(typedata.inputNumeric4){
							if(isNaN(Number(data.value4))){
								Dialog.alert({
									content:typedata.name4+"类型只能输入数字！"
								});
								return;
							}
						}
					}
					if(data.value5){
						if(typedata.inputNumeric5){
							if(isNaN(Number(data.value5))){
								Dialog.alert({
									content:typedata.name5+"类型只能输入数字！"
								});
								return;
							}
						}
					}
					if(data.value6){
						if(typedata.inputNumeric6){
							if(isNaN(Number(data.value6))){
								Dialog.alert({
									content:typedata.name6+"类型只能输入数字！"
								});
								return;
							}
						}
					}
					var params="member="+widget.getMember()+"&"+$("#healthDataForm").serialize()+
					"&"+"creator="+$("select.J-form-healthDataForm-select-creator").val()+
					"&"+"recordDate="+$(".J-form-healthDataForm-date-recordDate").val();
					aw.saveOrUpdate("api/healthexamdata/save",params, function() {
						widget._toEdit(false);
						widget.hide("#memHealth .el-form").show("#memHealth .el-grid");
						widget.get("healthGrid").refresh();
					});
				},
				cancelaction : function() {
					widget._toEdit(false);
					widget.hide("#memHealth .el-form").show("#memHealth .el-grid");
				},
				model : {
					id : "healthDataForm",
					items : [{
						name : "pkHealthExamData",
						type : "hidden"
					},{
						name : "version",
						type : "hidden",
						defaultValue : "0"
					},{
						name:"source",
						type:"hidden",
						defaultValue:"Manual",
						
					},{
						name : "type",
						label : "数据类型",
						type : "select",
						key	: "pkHealthExamDataType",
						url:"api/healthexamdatatype/query",
						params:{
							fetchProperties:"pkHealthExamDataType,name,name1,name2,name3,name4,name5,name6,inputNumeric1,inputNumeric2,inputNumeric3,inputNumeric4,inputNumeric5,inputNumeric6",
						},
						value:"name",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate : [ "required" ]
					}, {
						name:"hospital",
						label:"医院",
						type:"select",
						key:"pkHospital",
						url:"api/hospital/query",
						value:"name",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name : "value1",
						label : "测量值1",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						},
						validate : [ "required"]
					},{
						name:"valueStatus1",
						label:"测量值状态",
						type:"select",
						options:enmu["com.eling.elcms.health.model.BaseHealthExamData.ValueStatus"],
						defaultValue:"Normal",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						}
					},{
						name : "value2",
						label : "测量值2",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						}
					},{
						name:"valueStatus2",
						label:"测量值状态",
						type:"select",
						options:enmu["com.eling.elcms.health.model.BaseHealthExamData.ValueStatus"],
						defaultValue:"Normal",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						}
					},{
						name : "value3",
						label : "测量值3",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						}
					},{
						name:"valueStatus3",
						label:"测量值状态",
						type:"select",
						options:enmu["com.eling.elcms.health.model.BaseHealthExamData.ValueStatus"],
						defaultValue:"Normal",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						}
					},{
						name : "value4",
						label : "测量值4",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						}
					},{
						name:"valueStatus4",
						label:"测量值状态",
						type:"select",
						options:enmu["com.eling.elcms.health.model.BaseHealthExamData.ValueStatus"],
						defaultValue:"Normal",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						}
					},{
						name : "value5",
						label : "测量值5",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						}
					},{
						name:"valueStatus5",
						label:"测量值状态",
						type:"select",
						options:enmu["com.eling.elcms.health.model.BaseHealthExamData.ValueStatus"],
						defaultValue:"Normal",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						}
					},{
						name : "value6",
						label : "测量值6",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						}
					},{
						name:"valueStatus6",
						label:"测量值状态",
						type:"select",
						options:enmu["com.eling.elcms.health.model.BaseHealthExamData.ValueStatus"],
						defaultValue:"Normal",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						style:{
							label:"height:40px;",
						}
					},{
						label:"记录人",
						name:"creator",
						type:"select",
						key:"pkUser",
						url:"api/users",//TODO 用户角色：wulina
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
						},
						value:"name",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						readonly:true,
						validate : [ "required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
					},{
						name : "createDate",
						label : "采集时间",
						type : "date",
						mode : "Y-m-d H:i",
						step:30,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate : [ "required" ]
					}]
				}
			});
			this.set("healthForm", healthForm);
			
			var healthGrid = new Grid({
				parentNode : "#memHealth",
				url : "api/healthexamdata/query",
				params:function(){
					return {
						"member.pkMember" : widget.getMember(),
						fetchProperties:"pkHealthExamData,version,type.pkHealthExamDataType,type.name,type.name1,type.name2,type.name3,type.name4,type.name5,type.name6,value1,value2,value3,value4,value5,value6,recordDate,createDate,creator.pkUser,creator.name,source,description" +
						",hospital.pkHospital,hospital.name"
					};
				},
				autoRender : false,
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function() {
								if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:i18ns.get("sale_ship_owner","会员")+"已过世！"
									})
									return;
								}
								widget.get("healthForm").reset();
								var form = widget.get("healthForm");
								form.load("creator",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让creator可用
										var userSelect=form.getData("creator","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("creator",activeUser.pkUser);
										}
										var creator=form.getData("creator","");
										creator.push(activeUser);
										form.setData("creator",creator);
										form.setValue("creator",activeUser);
									}
								});
								$(".J-form-healthDataForm-select-creator").attr("disabled",true);
								$(".J-form-healthDataForm-date-recordDate").attr("disabled",true);
								widget.hide("#memHealth .el-grid").show("#memHealth .el-form");
								widget.get("healthForm").setLabel("value1","测量值1");
								widget.get("healthForm").show("value2");
								widget.get("healthForm").setLabel("value2","测量值2");
								widget.get("healthForm").show("value3");
								widget.get("healthForm").setLabel("value3","测量值3");
								widget.get("healthForm").show("value4");
								widget.get("healthForm").setLabel("value4","测量值4");
								widget.get("healthForm").show("value5");
								widget.get("healthForm").setLabel("value5","测量值5");
								widget.get("healthForm").show("value6");
								widget.get("healthForm").setLabel("value6","测量值6");
								widget.get("healthForm").setValue("createDate",moment());
								var flag = false ;
								var userdata  = widget.get("healthForm").getData("creator","");
								for(var i=0;i<userdata.length;i++){
									if(userdata[i].pkUser==activeUser.pkUser){
										flag=true;
									}
								}
								if(flag){
									widget.get("healthForm").setValue("creator",activeUser);
								}
							}
						} ],
					},
					columns : [{
						col:1,
						key : "type.name",
						name : "名称",
					},{
						col:2,
						key : "createDate",
						name : "采集时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						col:2,
						key : "hospital.name",
						name : "医院",
					},{
						col:4,
						key : "description",
						name : "测试值",
					},{
						col:1,
						key : "creator.name",
						name : "记录人",
					},{
						col:1,
						key : "recordDate",
						name : "记录时间",
						format : "date",
					},{
						col:1,
						key : "source",
						name : "操作",
						format:function(row,value){
							if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						format:function(value,row){
							if(value.key == "Device"){
								return value.value;
							}else if(value.key=="HealthExam"){
								return value.value;
							}else if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"health_edit",
							icon:"edit",
							handler:function(index,data,rowEL){
								$(".J-form-healthDataForm-select-creator").attr("disabled",true);
								$(".J-form-healthDataForm-date-recordDate").attr("disabled",true);
								widget._toEdit(true);
								data.pkMember = widget.getMember();
								widget.get("healthForm").setData(data);
								var form =widget.get("healthForm");
								form.load("creator",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var creator=form.getData("creator","");
										creator.push(data.creator);
										form.setData("creator",creator);
										form.setValue("creator",data.creator);
									}
								});
								widget.get("healthForm").setLabel("value1",data.type.name1);
								if(data.type.name2){
									widget.get("healthForm").setLabel("value2",data.type.name2);
									widget.get("healthForm").show("value2");
									widget.get("healthForm").show("valueStatus2");
								}else{
									widget.get("healthForm").hide("value2");
									widget.get("healthForm").hide("valueStatus2");
									widget.get("healthForm").setValue("valueStatus2",{});
								}
								if(data.type.name3){
									widget.get("healthForm").setLabel("value3",data.type.name3);
									widget.get("healthForm").show("value3");
									widget.get("healthForm").show("valueStatus3");
								}else{
									widget.get("healthForm").hide("value3");
									widget.get("healthForm").hide("valueStatus3");
									widget.get("healthForm").setValue("valueStatus3",{});
								}
								if(data.type.name4){
									widget.get("healthForm").setLabel("value4",data.type.name4);
									widget.get("healthForm").show("value4");
									widget.get("healthForm").show("valueStatus4");
								}else{
									widget.get("healthForm").hide("value4");
									widget.get("healthForm").hide("valueStatus4");
									widget.get("healthForm").setValue("valueStatus4",{});
								}
								if(data.type.name5){
									widget.get("healthForm").setLabel("value5",data.type.name5);
									widget.get("healthForm").show("value5");
									widget.get("healthForm").show("valueStatus5");
								}else{
									widget.get("healthForm").hide("value5");
									widget.get("healthForm").hide("valueStatus5");
									widget.get("healthForm").setValue("valueStatus5",{});
								}
								if(data.type.name6){
									widget.get("healthForm").setLabel("value6",data.type.name6);
									widget.get("healthForm").show("value6");
									widget.get("healthForm").show("valueStatus6");
								}else{
									widget.get("healthForm").hide("value6");
									widget.get("healthForm").hide("valueStatus6");
									widget.get("healthForm").setValue("valueStatus6",{});
								}
								widget.get("healthForm").setValue("source","Manual");
								widget.hide("#memHealth .el-grid").show("#memHealth .el-form");
							}
						},{
							key:"health_del",
							icon:"remove",
							handler:function(index,data,rowEL){
								aw.del("api/healthexamdata/"+ data.pkHealthExamData + "/delete",function() {
									widget._toEdit(false);
									widget.get("healthGrid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("healthGrid", healthGrid);
			this.$("#memHealth .el-form").addClass("hidden");
			
			
			// 渲染页签二：疾病史
			var diseaseForm = new Form({
				parentNode : "#memDisease",
				saveaction : function() {
					var params="member="+ widget.getMember()+ "&"+ $("#diseasehistoryForm").serialize()+
					"&"+"recordPerson="+$("select.J-form-diseasehistoryForm-select-recordPerson").val()+
					"&"+"recordDate="+$(".J-form-diseasehistoryForm-date-recordDate").val();
					var diseaseTime = widget.get("diseaseForm").getValue("diseaseTime");
					var cureTime = widget.get("diseaseForm").getValue("cureTime");
					if(diseaseTime!=""&&moment(diseaseTime).isAfter(moment(), 'day')){
						Dialog.alert({
							content:"患病时间不能在今天之后"
						});
						return;
					}
					if(cureTime!=""&&moment(cureTime).isAfter(moment(), 'day')){
						Dialog.alert({
							content:"治愈时间不能在今天之后"
						});
						return;
					}
					if(diseaseTime!=""&&cureTime!=""&&moment(diseaseTime).isAfter(moment(cureTime), 'day')){
						Dialog.alert({
							content:"治愈时间应晚于患病时间"
						});
						return;
					}
					aw.saveOrUpdate("api/diseasehistory/add",params,function(data) {
						widget._toEdit(false);
						widget.refreshDisease();
						widget.get("diseaseGrid").refresh();
						widget.hide("#memDisease .el-form").show("#memDisease .el-grid");
					});
				},
				cancelaction : function() {
					widget._toEdit(false);
					widget.hide("#memDisease .el-form").show("#memDisease .el-grid");
				},
				model:{
					id:"diseasehistoryForm",
					items:[{
						name:"pkDiseaseHistory",
						type:"hidden"
					}, {
						name:"version",
						type:"hidden",
						defaultValue:"0"
					}, {
						name:"diseaseDetail",
						label:"疾病",
						key:"pkDiseaseDetail",
						value:"name",
						url:"api/diseasedetail/query",
						type:"select",
						lazy:true,
						validate:[ "required" ]
					},{
						name:"diseaseTime",
						label:"患病时间",
						type:"date",
						mode : "Y-m-d H:i",
						step:30,
						defaultValue:moment()
					},{
						name:"attentions",
						label:"备注",
						type:"textarea"
					},{
						name:"diseaseStatus",
						label:"状态",
						type:"radiolist",
						list:[{
							key:"BEILL",
							value:"患病中",
							isDefault:true
						},{
							key:"RECURE",
							value:"已治愈"
						}],
						validate:["required"]
					},{
						name:"cureTime",
						label:"治愈时间",
						type : "date",
						mode : "Y-m-d H:i",
						step:30,
						show:false
					},{
						name:"recordPerson",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						defaultValue : activeUser.pkUser,
						validate:["required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					}]
				}
			});
			this.set("diseaseForm", diseaseForm);
			
			var diseaseGrid = new Grid({
				parentNode : "#memDisease",
				url : "api/diseasehistory/query",
				autoRender:false,
				params:function(){
					return {
						"member":widget.getMember(),
						fetchProperties:"*,diseaseDetail.name,diseaseDetail.pkDiseaseDetail,recordPerson.name,recordDate"
					};
				},
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function() {
								if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:i18ns.get("sale_ship_owner","会员")+"已过世！"
									})
									return;
								}
								widget.get("diseaseForm").reset();
								var form = widget.get("diseaseForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让recordPerson可用
										var userSelect=form.getData("recordPerson","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("recordPerson",activeUser.pkUser);
										}
										var recordPerson=form.getData("recordPerson","");
										recordPerson.push(activeUser);
										form.setData("recordPerson",recordPerson);
										form.setValue("recordPerson",activeUser);
									}
								});
								$(".J-form-diseasehistoryForm-select-recordPerson").attr("disabled",true);
								$(".J-form-diseasehistoryForm-date-recordDate").attr("disabled",true);
								widget.get("diseaseForm").load("diseaseDetail");
								widget.show("#memDisease .el-form").hide("#memDisease .el-grid");
							}
						}]
					},
					columns:[{
						key : "diseaseDetail.name",
						name : "疾病"
					},{
						key : "diseaseTime",
						name : "患病时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key : "cureTime",
						name : "治愈时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"diseaseStatus.value",
						name:"状态"
					},{
						key:"recordPerson.name",
						name:"记录人"
					},{
						key:"recordDate",
						name:"记录日期",
						format:"date",
					},{
						key:"operate",
						name:"操作",
						format:function(row,value){
							if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key : "edit",
							icon : "edit",
							handler : function(index,data,rowEle) {
								$(".J-form-diseasehistoryForm-select-recordPerson").attr("disabled",true);
								$(".J-form-diseasehistoryForm-date-recordDate").attr("disabled",true);
								widget._toEdit(true);
								var form=widget.get("diseaseForm");
								form.setData(data);
								var form =widget.get("diseaseForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var recordPerson=form.getData("recordPerson","");
										recordPerson.push(data.recordPerson);
										form.setData("recordPerson",recordPerson);
										form.setValue("recordPerson",data.recordPerson);
									}
								});
								widget.show("#memDisease .el-form").hide("#memDisease .el-grid");
								var diseaseStatus=data.diseaseStatus.key;
								//如果疾病状况是已治愈，则需要显示治愈时间，否则隐藏
								if(diseaseStatus=="RECURE"){
									form.show("cureTime");
								}else{
									form.hide("cureTime");
								}
							}
						},{
							key : "delete",
							icon : "remove",
							handler : function(index,data,rowEle) {
								aw.del("api/diseasehistory/"+ data.pkDiseaseHistory+ "/delete",function() {
									widget._toEdit(false);
									widget.refreshDisease();
									widget.get("diseaseGrid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("diseaseGrid", diseaseGrid);
			this.$("#memDisease .el-form").addClass("hidden");
			
			// 渲染页签三：复诊记录
			var nextExamForm = new Form({
				parentNode : "#memNextExam",
				saveaction : function() {
					var examForm=widget.get("nextExamForm");
					var disease=examForm.getValue("diseaseDetail");
					var etcommdata=examForm.getValue("etcommdata");
					var date=examForm.getValue("date");
					var remindStartTime=examForm.getValue("remindStartTime");
					if(!disease && !etcommdata){
						Dialog.alert({
							content : "疾病名称和健康数据中必填一个"
						});
						return false;
					}
					if(moment(date).valueOf() <= moment(remindStartTime).valueOf()) {
						Dialog.alert({
							content : "提醒开始时间不能晚于复诊时间"
						});
						return false;
					}
					if(remindStartTime){
						if(moment().isAfter(remindStartTime,"minutes")){
							Dialog.alert({
								content:"提醒开始时间不能早于系统当前时间！"
							});
							examForm.setValue("remindStartTime",moment().valueOf());
							return;
						}
						if(moment(remindStartTime).isAfter(date,"minutes")){
							Dialog.alert({
								content:"提醒开始时间不能晚于复诊时间！"
							});
							examForm.setValue("remindStartTime",moment().valueOf());
							return;
						}
						
					} 
					if(date){
						if(moment().isAfter(date,"minutes")){
							Dialog.alert({
								content:"复诊时间不能早于系统当前时间！"
							});
							examForm.setValue("date",moment().valueOf());
							return;
						}
					}
					
					var params="member="+widget.getMember()+ "&"+ $("#nextExamForm").serialize()+
					"&"+"recordPerson="+$("select.J-form-nextExamForm-select-recordPerson").val()+
					"&"+"recordDate="+$(".J-form-nextExamForm-date-recordDate").val();
					aw.saveOrUpdate("api/examrecord/save",params,function() {
						widget._toEdit(false);
						widget.hide("#memNextExam .el-form").show("#memNextExam .el-grid");
						widget.get("nextExamGrid").refresh();
					});
				},
				cancelaction : function() {
					widget._toEdit(false);
					widget.hide("#memNextExam .el-form").show("#memNextExam .el-grid");
				},
				model : {
					id : "nextExamForm",
					items : [ {
						name : "pkExaminationRecord",
						type : "hidden"
					},{
						name : "diseaseDetail",
						key : "pkDiseaseDetail",
						label : "疾病",
						value : "name",
						type : "select",
						url : "api/diseasedetail/querybymember",
						lazy : true
					},{
						name:"etcommdata",
						label:"健康数据",
						type:"textarea"
					}, {
						name:"date",
						label:"复诊时间",
						type:"date",
						mode:"Y-m-d H:i",
						step:30,
						validate:["required"]
					}, {
						name:"remindStartTime",
						label:"提醒开始时间",
						type:"date",
						mode:"Y-m-d H:i",
						step:30,
						validate:["required"]
					}, {
						name : "hospital",
						label : "复诊医院",
						type:"select",
						key:"pkHospital",
						url:"api/hospital/query",
						lazy:true,
						value:"name",
						validate : [ "required" ]
					}, {
						name : "doctor",
						label : "主治医生",
						type : "text"
					},{
						name:"recordPerson",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						defaultValue : activeUser.pkUser,
						validate:["required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					}]
				}
			});
			this.set("nextExamForm", nextExamForm);
			this.$("#memNextExam .el-form").addClass("hidden");
			
			var nextExamGrid = new Grid({
				parentNode : "#memNextExam",
				url : "api/examrecord/queryNext",
				params:function(){
					return {
						fetchProperties : "*,hospital.name,diseaseDetail.name,member.pkMember,etcommdata.name,recordPerson.name,recordDate",
						pkMember:widget.getMember()
					};
				},
				autoRender : false,
				model : {
					head : {
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler : function() {
								if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:i18ns.get("sale_ship_owner","会员")+"已过世！"
									})
									return;
								}
								widget.get("nextExamForm").reset();
								var form = 	widget.get("nextExamForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让registrant可用
										var userSelect=form.getData("recordPerson","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("recordPerson",activeUser.pkUser);
										}
										var recordPerson=form.getData("recordPerson","");
										recordPerson.push(activeUser);
										form.setData("recordPerson",recordPerson);
										form.setValue("recordPerson",activeUser);
									}
								});
								$(".J-form-nextExamForm-select-recordPerson").attr("disabled",true);
								$(".J-form-nextExamForm-date-recordDate").attr("disabled",true);
								widget.get("nextExamForm").load("diseaseDetail",{
									params:{
										pkMember:widget.getMember()
									},
								});
								widget.hide(["#memNextExam .el-grid"]).show(["#memNextExam .el-form"]);
							}
						}]
					},
					columns:[{
						key : "diseaseDetail.name",
						name : "疾病"
					},{
						key : "etcommdata",
						name : "健康数据"
					},{
						key : "date",
						name : "复诊时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key : "hospital.name",
						name : "复诊医院"
					},{
						key : "doctor",
						name : "主治医生"
					},{
						key:"recordPerson.name",
						name:"记录人"
					},{
						key:"recordDate",
						name:"记录日期",
						format:"date",
					},{
						key : "operate",
						name : "操作",
						format:function(row,value){
							if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						formatparams : [{
							key : "edit",
							icon : "edit",
							handler : function(index,result,rowEle) {
								$(".J-form-nextExamForm-select-recordPerson").attr("disabled",true);
								$(".J-form-nextExamForm-date-recordDate").attr("disabled",true);
								widget._toEdit(true);
								widget.get("nextExamForm").setData(result);
								var form =widget.get("nextExamForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var recordPerson=form.getData("recordPerson","");
										recordPerson.push(result.recordPerson);
										form.setData("recordPerson",recordPerson);
										form.setValue("recordPerson",result.recordPerson);
									}
								});
								widget.hide(["#memNextExam .el-grid"]).show(["#memNextExam .el-form"]);
							}
						},{
							key : "delete",
							icon : "remove",
							handler : function(index,data,rowEle) {
								aw.del("api/examrecord/"+ data.pkExaminationRecord+ "/delete",function() {
									widget._toEdit(false);
									widget.get("nextExamGrid").refresh();
									widget.hide(["#memNextExam .el-form"]).show(["#memNextExam .el-grid"]);
								});
							}
						}]
					}]
				}
			});
			this.set("nextExamGrid", nextExamGrid);
			
			// 渲染页签四：住院登记
			var patientForm = new Form({
				parentNode : "#memPatient",  
				saveaction : function() {
					var examForm=widget.get("patientForm");
					if(examForm.getValue("status")=="BeInHospital"){
						var gridDatas=widget.get("patientGrid").getData();
						var cout=0;
						for(var i=0;i<gridDatas.length;i++){
							if(gridDatas[i].status.key=="BeInHospital"&&gridDatas[i].pkPatientRegistration!=examForm.getValue("pkPatientRegistration")){
								cout++;
							}
						}
						if(cout>=1){
							Dialog.alert({
								content : "该"+i18ns.get("sale_ship_owner","会员")+"已存在一条住院中记录!"
							});
							return false;
						}
					}
					var checkInDate=examForm.getValue("checkInDate");
					var checkOutDate=examForm.getValue("checkOutDate");
					var orgCheckOutDate=examForm.getValue("orgCheckOutDate");
					var orgStatus=examForm.getValue("orgStatus");
					
					if(orgCheckOutDate&&orgCheckOutDate>checkInDate&&orgStatus&&orgStatus=="已入住"){
						Dialog.alert({
							content : "转诊日期早于转院前数据的出院时间，请先修改转院前数据的出院时间!"
						});
						return false;
					}
					
					var url="";
					
					var params="turnOutRegistration="+examForm.getValue("turnOutRegistrationpk")+
					"&member="+widget.getMember()+"&"+$("#patientForm").serialize()+
					"&"+"recordDate="+$(".J-form-patientForm-date-recordDate").val();
					
					if(examForm.getValue("isTransfer")=="true"){
						url="api/patientregistration/saveTransfer";
					}else{
						url="api/patientregistration/save";
					} 
					aw.saveOrUpdate(url,params,function(data) {
						if (data.msg!="操作成功") {
							Dialog.alert({
								content : data.msg
							});
							return false;
						}
						//修改默认会员的状态，方便下次校验
						var status = widget.get("patientForm").getValue("status");
						if(status == "BeInHospital"){
							widget.defMember.status.key = "Behospitalized";
							widget.defMember.status.value = "住院";
						}else if (status == "LeaveHospital"){
							widget.defMember.status.key = "Normal";
							widget.defMember.status.value = "在住";
						}	
						widget._toEdit(false);
						widget.hide("#memPatient .el-form").show("#memPatient .el-grid");
						widget.get("patientGrid").refresh();
						
					});
				},
				cancelaction : function() {
					widget._toEdit(false);
					widget.hide("#memPatient .el-form").show("#memPatient .el-grid");
				},
				model : {
					id : "patientForm",
					items : [{
						name : "pkPatientRegistration",
						type : "hidden",
					},{
						name : "version",
						defaultValue : "0",
						type : "hidden"
					},{
						name : "disease",
						label : "入院原因",
						type : "textarea",
						validate : [ "required" ]
					},{
						name : "illness",
						label : "疾病",
						type : "select",
						multi : true,
						key:"pkDisease",
						value:"name",
						url:"api/disease/query",
						params:{
							fetchProperties:"pkDisease,name"
						},
					},{
						name : "checkInDate",
						label : "住院日期",
						type : "date",
						mode : "Y-m-d H:i",
						step :30,
						validate : [ "required" ]
					},{
						name : "checkOutDate",
						label : "出院日期",
						type : "date",
						mode : "Y-m-d H:i",
						step :30,
					},{
						name : "remindStartDay",
						label : "提前提醒天数 ",
						validate : ["number"],
					},{
						name : "hospital",
						label : "医院",
						type:"select",
						key:"pkHospital",
						url:"api/hospital/query",
						lazy:true,
						value:"name",
						validate : [ "required" ]
					},{
						name:"departmentsSickbed",
						label:"科室/床位",
						validate:["required"]
					},{
						name:"accompanyType",
						label:"陪同类型",
						type:"select",
						url:"api/enum/com.eling.elcms.health.model.PatientRegistration.AccompanyType",
						validate:["required"],
					},{
						name:"secretary",
						key:"pkUser",
						value:"name",
						url:"api/user/role",//TODO 用户角色：wulina 秘书
						params:{
							roleIn:"6,11,12,18,19,20,21",
							fetchProperties:"pkUser,name"
						},
						label:"秘书陪同人",
						type:"select",
						show:false
					}, {
						name : "status",
						label : "住院状态",
						url:"api/enum/com.eling.elcms.health.model.PatientRegistration.Status",
						type : "select",
						validate : [ "required" ],
						defaultValue:"BeInHospital",
					},{
						name:"afterTreatment",
						label:"治疗经过",
						type : "textarea"
					},{
						name:"dischargeDiagnosis",
						label:"出院诊断",
						type : "textarea"
					},{
						name:"backDrug",
						label:"带回药物",
						type : "textarea"
					},{
						name:"doctorAdvised",
						label:"医生建议",
						type : "textarea"
					},{
						name : "description",
						label : "备注",
						type : "textarea"
					},{
						name : "isTransfer",
						label: "转诊",
						type:"select",
						defaultValue:"false",
						options : [ {
							key : false,
							value : "否"
						}, {
							key : true,
							value : "是"
						} ],
					},{
						name:"turnOutHospitalname",
						label:"转出医院",
						type:"text",
					},{
						name:"turnOutRegistrationpk",
						type:"hidden",
					},{
						name:"orgCheckOutDate",
						type:"hidden",
					},{
						name:"orgStatus",
						type:"hidden",
					},{
						name:"registrant",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
//						defaultValue : activeUser.pkUser,
						
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					}]
				}
			});
			this.set("patientForm", patientForm);
			
			var patientGrid = new Grid({
				parentNode : "#memPatient",
				url : "api/patientregistration/querymember",
				autoRender : false,
				params:function(){
					return {
						pkMember:widget.getMember(),
						fetchProperties : "*,illness.pkDisease,illness.name,disease,hospital.name,member.pkMember,member.personalInfo.name,member.memberSigning.room.number," +
						"member.memberSigning.room.pkRoom,registrant.name,recordDate",
					};
				},
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:i18ns.get("sale_ship_owner","会员")+"已过世！"
									})
									return;
								}
								
								if(widget.defMember.status.key != "Normal"){
									Dialog.alert({
										content:"当前"+i18ns.get("sale_ship_owner","会员")+"不是在住园区状态，不能增加住院记录！"
									})
									return;
								}
								
								var form=widget.get("patientForm");
								form.reset();
								form.load("registrant",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让registrant可用
										var userSelect=form.getData("registrant","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("registrant",activeUser.pkUser);
										}
										var registrant=form.getData("registrant","");
										registrant.push(activeUser);
										form.setData("registrant",registrant);
										form.setValue("registrant",activeUser);
									}
								});
								form.setValue("registrant",activeUser);
								$(".J-form-patientForm-select-registrant").attr("disabled",true);
								$(".J-form-patientForm-date-recordDate").attr("disabled",true);
								form.setAttribute("isTransfer","readonly","readonly");
								form.setAttribute("turnOutHospitalname","readonly","readonly");
								widget.hide("#memPatient .el-grid").show("#memPatient .el-form");
							}
						}]
					},
					columns : [{
						key : "disease",
						name : "入院原因",
						col:2
					},{
						key : "checkInDate",
						name : "住院日期",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						col:2
					},{
						key : "checkOutDate",
						name : "出院日期",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						col:2
					},{
						key : "hospital.name",
						name : "医院名称",
						col:2
					},{
						key : "status.value",
						name : "住院状态",
						col:1
					},{
						key:"registrant.name",
						name:"记录人",
						col:1
					},{
						key:"recordDate",
						name:"记录日期",
						format:"date",
						col:1
					},{
						key : "operate",
						name : "操作",
						format:function(row,value){
							if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						col:1,
						formatparams : [{
							key : "edit",
							icon : "edit",
							handler : function(index,data,rowEle) {
								widget._toEdit(true);
								data.member=widget.getMember();
								var form=widget.get("patientForm");
								form.reset();
								$(".J-form-patientForm-select-registrant").attr("disabled",true);
								$(".J-form-patientForm-date-recordDate").attr("disabled",true);
								form.setData(data);
								form.load("registrant",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var registrant=form.getData("registrant","");
										registrant.push(data.registrant);
										form.setData("registrant",registrant);
										form.setValue("registrant",data.registrant);
										if(data.accompanyType==null||data.accompanyType.key!="SecretaryAccompany"){
											form.hide("secretary");
										}else{
											form.show("secretary");
										}
									}
								});
								if(data.illness){
									form.setValue("illness",data.illness);
								}
								if(data.turnOutRegistration){
									form.setValue("turnOutRegistrationpk",data.turnOutRegistration.pkPatientRegistration);
									form.setValue("turnOutHospitalname",data.turnOutRegistration.hospital.name);
									form.setValue("orgCheckOutDate",data.turnOutRegistration.checkOutDate!=null?data.turnOutRegistration.checkOutDate:"");
									form.setValue("orgStatus",data.turnOutRegistration.status.value);
								}
								
								form.setAttribute("isTransfer","readonly","readonly");
								form.setAttribute("turnOutHospitalname","readonly","readonly");
								widget.show("#memPatient .el-form").hide("#memPatient .el-grid");
							}
						},{
							key : "delete",
							icon : "remove",
							handler : function(index,data,rowEle) {
								aw.del("api/patientregistration/"+ data.pkPatientRegistration+ "/delete",function() {
									widget._toEdit(false);
									//修改默认会员的状态，方便下次校验
									if(data.status.key == "BeInHospital"){
										widget.defMember.status.key = "Normal";
										widget.defMember.status.value = "在住";
									}									
									widget.get("patientGrid").refresh();
								});
							}
						},{
							key:"transfer",
							text:"转诊",
							show:function(value,row){
								if(row.status.key=="BeInHospital"){
									return true;
								}else if(row.status.key=="LeaveHospital"){
									return false;
								}
							},
							handler : function(index,data,rowEle) {
								aw.ajax({
									url : "api/patientregistration/queryTransfer",
									type : "POST",
									data : {
										"turnOutRegistration":data.pkPatientRegistration,
									},
									success : function(datas) {
										if(datas!=0){
											Dialog.alert({
												content : "该记录已生成了转院记录，请在转院记录中修改!"
											});
											return false;
										}else{
											widget._toEdit(true);
											var form=widget.get("patientForm");
											form.reset();
											form.setValue("isTransfer","true");
											form.setValue("turnOutHospitalname",data.hospital.name);
											form.setValue("turnOutRegistrationpk",data.pkPatientRegistration);
											var mdata=form.getData("hospital");
											for(var i=0;i<mdata.length;i++){
												if(mdata[i].pkHospital==data.hospital.pkHospital){
													mdata.splice(i,1);;
													break;
												}
											}
											form.setData("hospital",mdata);
											
											form.setAttribute("isTransfer","readonly","readonly");
											form.setAttribute("turnOutHospitalname","readonly","readonly");
											widget.show("#memPatient .el-form").hide("#memPatient .el-grid");
										}
									}
								});
								
							}
						}]
					}]
				}
			});
			this.set("patientGrid", patientGrid);
			this.$("#memPatient .el-form").addClass("hidden");
			
			// 渲染页签五：身体状况
			var phyStatusForm = new Form({
				parentNode : "#memPhyStatus",
				saveaction : function() {
					var params="member="+widget.getMember()+"&"+$("#phystatusrecord").serialize()+
					"&"+"recorder="+$("select.J-form-phystatusrecord-select-recorder").val()+
					"&"+"recordDate="+$(".J-form-phystatusrecord-date-recordDate").val();
					aw.saveOrUpdate("api/memberdailyrecord/save",params,function(data) {
						widget._toEdit(false);
						widget.hide("#memPhyStatus .el-form").show("#memPhyStatus .el-grid");
						widget.get("phyStatusGrid").refresh();
					});
				},
				// 取消按钮
				cancelaction : function() {
					widget._toEdit(false);
					widget.hide("#memPhyStatus .el-form").show("#memPhyStatus .el-grid");
				},
				model : {
					id : "phystatusrecord",
					items : [{
						name : "pkMemberDailyRecord",
						type : "hidden"
					},{
						name:"record",
						label:"描述",
						type:"textarea",
						validate:["required"]
					},{
						name : "type",
						type : "hidden",
						defaultValue : "Health"
					},{
						name:"date",
						label:"业务日期",
						type:"date",
						mode:"Y-m-d H:i",
						step:30,
						validate:["required"]
					},{
						name : "recorder",
						value : "pkUser",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						defaultValue : activeUser.pkUser,
						validate:["required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					}]
				}
			});
			this.set("phyStatusForm", phyStatusForm);
			
			var phyStatusGrid = new Grid({
				parentNode : "#memPhyStatus",
				url : "api/memberdailyrecord/queryByPkmember",
				autoRender : false,
				params:function(){
					return {
						pkMember : widget.getMember(),
						fetchProperties : "*,recorder.name,date,recordDate",
						type : "Health"
					};
				},
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function() {
								if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:i18ns.get("sale_ship_owner","会员")+"已过世！"
									})
									return;
								}
								widget.get("phyStatusForm").reset();
								var form =widget.get("phyStatusForm");
								form.load("recorder",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让recordPerson可用
										var userSelect=form.getData("recorder","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("recorder",activeUser.pkUser);
										}
										var recorder=form.getData("recorder","");
										recorder.push(activeUser);
										form.setData("recorder",recorder);
										form.setValue("recorder",activeUser);
									}
								});
								$(".J-form-phystatusrecord-select-recorder").attr("disabled",true);
								$(".J-form-phystatusrecord-date-recordDate").attr("disabled",true);
								widget.show("#memPhyStatus .el-form").hide("#memPhyStatus .el-grid");
							}
						}],
						input : (params && ("eling/elcms/schedule/healthRoutSchedule/healthRoutSchedule" == params.fatherNode || "eling/elcms/schedule/healthRoutToDoList/healthRoutToDoList" == params.fatherNode))
					},
					columns : [{
						col:2,
						key : "date",
						name : "业务日期",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{	
						col:5,
						key : "record",
						name : "描述"
					},{
						col:2,
						key : "recorder.name",
						name : "记录人"
					},{
						key:"recordDate",
						name:"记录日期",
						format:"date",
						col:2,
					},{
						col:1,
						key : "operate",
						name : "操作",
						format:function(row,value){
							if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						formatparams : [{
							key : "edit",
							icon : "edit",
							handler : function(index,data,rowEle) {
								$(".J-form-phystatusrecord-select-recorder").attr("disabled",true);
								$(".J-form-phystatusrecord-date-recordDate").attr("disabled",true);
								widget._toEdit(true);
								widget.get("phyStatusForm").setData(data);
								var form =widget.get("phyStatusForm");
								form.load("recorder",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var recorder=form.getData("recorder","");
										recorder.push(data.recorder);
										form.setData("recorder",recorder);
										form.setValue("recorder",data.recorder);
									}
								});
								widget.show("#memPhyStatus .el-form").hide("#memPhyStatus .el-grid");
							}
						},{
							key : "delete",
							icon : "remove",
							handler : function(index,data,rowEle) {
								aw.del("api/memberdailyrecord/"+ data.pkMemberDailyRecord+ "/delete",function() {
									widget._toEdit(false);
									widget.get("phyStatusGrid").refresh();
									widget.hide("#memPhyStatus .el-form").show("#memPhyStatus .el-grid");
								});
							}
						}]
					}]
				}
			});
			this.set("phyStatusGrid", phyStatusGrid);
			this.$("#memPhyStatus .el-form").addClass("hidden");
			
			// 渲染页签六：健康报告
			var reportForm = new Form({
				parentNode:"#memReport",
				saveaction:function() {
					var params="member="+widget.getMember()+"&"+ $("#reportForm").serialize()+
				   "&"+"recordPerson="+$("select.J-form-reportForm-select-recordPerson").val()+
					"&"+"recordDate="+$(".J-form-reportForm-date-recordDate").val();
					aw.saveOrUpdate("api/doctorevaluation/save",params,function() {
						widget._toEdit(false);
						widget.hide("#memReport .el-form").show("#memReport .el-grid");
						widget.get("reportGrid").refresh();
					});
				},
				cancelaction : function() {
					widget._toEdit(false);
					widget.hide("#memReport .el-form").show("#memReport .el-grid");
				},
				model : {
					id : "reportForm",
					items : [ {
						name : "pkDoctorEvaluation",
						type : "hidden"
					},{
						name : "version",
						type : "hidden"
					},{
						name : "updateTime",
						label : "业务时间",
						type : "date",
						mode:"Y-m-d H:i",
						defaultValue : moment().valueOf(),
						step:30,
						validate : [ "required" ]
					},{
						name : "description",
						label : "描述",
						type : "textarea",
						validate : [ "required" ]
					},{
						name:"doctor",
						key:"pkUser",
						value:"name",
						url:"api/user/role",//TODO 用户角色：wulina 健康秘书
//        				params:{
//        					roleIn:"8,12,20",
//							fetchProperties:"pkUser,name"
//						}, 
						lazy:true,
						label:"家庭医生",
						type:"select",
						validate : [ "required" ]
					},{
						name : "recordPerson",
						value : "pkUser",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						defaultValue : activeUser.pkUser,
						validate:["required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					}]
				}
			});
			this.set("reportForm", reportForm);
			
			var reportGrid = new Grid({
				parentNode : "#memReport",
				url : "api/doctorevaluation/query",
				params:function(){
					return {
						member : widget.getMember(),
						fetchProperties : "*,doctor.name,recordPerson.name"
					};
				},
				autoRender : false,
				model : {
					head : {
						buttons : [ {
							id : "add",
							icon : "icon-plus",
							handler : function() {
								if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:i18ns.get("sale_ship_owner","会员")+"已过世！"
									})
									return;
								}
								widget.get("reportForm").load("doctor",{
									params:{
										roleIn : "8,12,20",
										fetchProperties:"pkUser,name"
									},
									callback:function(data){
										var  form = widget.get("reportForm");
										form.reset();
										form.load("recordPerson",{
											params:{
												fetchProperties:"pkUser,name"
											},
											callback:function(){
												//当前用户是管理员时，让recordPerson可用
												var userSelect=form.getData("recordPerson","");
												var flag = false;
												for(var  i =  0 ; i<userSelect.length;i++ ){
													if(userSelect[i].pkUser == activeUser.pkUser){
														flag= true;
														break;
													}
												}
												if(flag){
													form.setValue("recordPerson",activeUser.pkUser);
												}
												var creator=form.getData("recordPerson","");
												creator.push(activeUser);
												form.setData("recordPerson",creator);
												form.setValue("recordPerson",activeUser);
											}
										});
										$(".J-form-reportForm-select-recordPerson").attr("disabled",true);
										$(".J-form-reportForm-date-recordDate").attr("disabled",true);
										widget.show("#memReport .el-form").hide("#memReport .el-grid");
										if(data.length>0){
											var userSelect=form.getData("doctor","");
											var flag = false;
											for(var  i =  0 ; i<userSelect.length;i++ ){
												if(userSelect[i].pkUser == activeUser.pkUser){
													flag= true;
													break;
												}
											}
											if(flag){
												form.setValue("doctor",activeUser.pkUser);
											}
										}
										
									}
								});
							}
						} ]
					},
					columns : [{
						key : "updateTime",
						name : "业务时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						col:2
					},{
						key : "doctor.name",
						name : "家庭医生",
						col:1
					},{
						key : "description",
						name : "描述",
						col:5
					},{
						key : "recordPerson.name",
						name : "记录人",
						col:1
					},{
						key:"recordDate",
						name:"记录日期",
						format:"date",
						col:1
					},{
						key : "operate",
						name : "操作",
						format:function(row,value){
							if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						col:1,
						formatparams : [{
							key : "edit",
							icon : "edit",
							handler : function(index,data,rowEle) {
								var report  =data;
								var  form = widget.get("reportForm");
								form.load("doctor",{
									params:{
										roleIn : "8,12,20",
										fetchProperties:"pkUser,name"
									},
									callback:function(data){
										var  form = widget.get("reportForm");
										form.reset();
										$(".J-form-reportForm-select-recordPerson").attr("disabled",true);
										$(".J-form-reportForm-date-recordDate").attr("disabled",true);
										form.setData(report);
										widget.show("#memReport .el-form").hide("#memReport .el-grid");
									}
								});
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var recordPerson=form.getData("recordPerson","");
										recordPerson.push(data.recordPerson);
										form.setData("recordPerson",recordPerson);
										form.setValue("recordPerson",data.recordPerson);
									}
								});
							}
						},{
							key : "delete",
							icon : "remove",
							handler : function(index,data,rowEle) {
								aw.del("api/doctorevaluation/"+ data.pkDoctorEvaluation+ "/delete",function() {
									widget._toEdit(false);
									widget.get("reportGrid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("reportGrid", reportGrid);
			this.$("#memReport .el-form").addClass("hidden");
			
			// 渲染页签七：过敏史
			var AllerForm = new Form({
				parentNode : "#memAller",
				saveaction : function() {
					var params="member="+ widget.getMember() + "&"+ $("#AllerForm").serialize()+
					"&"+"recordPerson="+$("select.J-form-AllerForm-select-recordPerson").val()+
					"&"+"recordDate="+$(".J-form-AllerForm-date-recordDate").val();
					aw.saveOrUpdate("api/allergichistory/add",params,function() {
						widget._toEdit(false);
						widget.hide("#memAller .el-form").show("#memAller .el-grid");
						widget.get("AllerGrid").refresh();
					});
				},
				cancelaction : function() {
					widget._toEdit(false);
					widget.hide("#memAller .el-form").show("#memAller .el-grid");
				},
				model:{
					id:"AllerForm",
					items:[{
						name:"pkAllergicHistory",
						type:"hidden"
					},{
						name:"name",
						label:"过敏源名称",
						validate:["required"]
					},{
						name:"date",
						label:"发现时间",
						type:"date",
						mode:"Y-m-d H:i",
						step:30,
						validate:["required"]
					}, {
						name:"allergicType",
						label:"过敏源类型",
						type:"select",
						options:[{
							key:"MEDICINE",
							value:"药物"
						},{
							key:"FOOD",
							value:"食物"
						},{
							key:"OTHER",
							value:"其他"
						}],
						validate : [ "required" ]
					}, {
						name : "attentions",
						label : "备注",
						type : "textarea",
						validate : [ "required" ]
					},{
						name : "recordPerson",
						value : "pkUser",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						defaultValue : activeUser.pkUser,
						validate:["required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					}]
				}
			});
			this.set("AllerForm", AllerForm);
			
			var AllerGrid = new Grid({
				parentNode : "#memAller",
				url : "api/allergichistory/query",
				params:function(){
					return {
						"member":widget.getMember(),
						fetchProperties : "*,recordPerson.name",
						type:"过敏史"
					};
				},
				autoRender:false,
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:i18ns.get("sale_ship_owner","会员")+"已过世！"
									})
									return;
								}
								widget.get("AllerForm").reset();
								var form =widget.get("AllerForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让recordPerson可用
										var userSelect=form.getData("recordPerson","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("recordPerson",activeUser.pkUser);
										}
										var creator=form.getData("recordPerson","");
										creator.push(activeUser);
										form.setData("recordPerson",creator);
										form.setValue("recordPerson",activeUser);
									}
								});
								$(".J-form-AllerForm-select-recordPerson").attr("disabled",true);
								$(".J-form-AllerForm-date-recordDate").attr("disabled",true);
								widget.show("#memAller .el-form").hide("#memAller .el-grid");
							}
						}]
					},
					columns:[{
						key: "name" ,
						name:"过敏源名称"
					},{
						key:"date",
						name:"发现时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
					},{
						key: "allergicType" ,
						name:"过敏源名称",
						format:function(value,row){
							if (value == "MEDICINE") {
								return "药物";
							} else if (value == "FOOD") {
								return "食物";
							} else if (value == "OTHER") {
								return "其他";
							} else{
								return "";
							}
						}
					},{
						key : "attentions",
						name : "备注"
					},{
						key : "recordPerson.name",
						name : "记录人"
					},{
						key:"recordDate",
						name:"记录日期",
						format:"date",
					},{
						key : "operate",
						name : "操作",
						format:function(row,value){
							if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						formatparams : [{
							key : "edit",
							icon : "edit",
							handler : function(index,data,rowEle) {
								$(".J-form-AllerForm-select-recordPerson").attr("disabled",true);
								$(".J-form-AllerForm-date-recordDate").attr("disabled",true);
								widget._toEdit(true);
								widget.get("AllerForm").setData(data);
								var form =widget.get("AllerForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var recordPerson=form.getData("recordPerson","");
										recordPerson.push(data.recordPerson);
										form.setData("recordPerson",recordPerson);
										form.setValue("recordPerson",data.recordPerson);
									}
								});
								widget.hide("#memAller .el-grid").show("#memAller .el-form");
							}
						},{
							key : "delete",
							icon : "remove",
							handler : function(index,data,rowEle) {
								aw.del("api/allergichistory/"+ data.pkAllergicHistory+ "/delete",function() {
									widget._toEdit(false);
									widget.get("AllerGrid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("AllerGrid", AllerGrid);
			this.$("#memAller .el-form").addClass("hidden");
			
			// 渲染页签八：就诊记录
			var medRecForm = new Form({
				parentNode : "#memMedRec",
				saveaction : function() {
					var params="member="+ widget.getMember() + "&"+ $("#medRecForm").serialize()+
					"&"+"recordPerson="+$("select.J-form-medRecForm-select-recordPerson").val()+
					"&"+"recordDate="+$(".J-form-medRecForm-date-recordDate").val();
					aw.saveOrUpdate("api/medicalrecords/add",params,function() {
						widget._toEdit(false);
						widget.hide("#memMedRec .el-form").show("#memMedRec .el-grid");
						widget.get("medRecGrid").refresh();
					});
				},
				cancelaction : function() {
					widget._toEdit(false);
					widget.hide("#memMedRec .el-form").show("#memMedRec .el-grid");
				},
				model:{
					id:"medRecForm",
					items:[{
						name : "pkMedicalRecords",
						type : "hidden"
					},{
						name : "reason",
						label : "就诊原因",
						type:"textarea"
					}, {		
						name:"diseaseDetails",
						label:"疾病",
						key:"pkDiseaseDetail",
						value:"name",
						type:"select",
						url:"api/diseasedetail/querybymember",
						lazy:true,
						multi:true,
						validate:["required"]
					}, {
						name : "date",
						label : "就诊时间",
						type : "date",
						mode:"Y-m-d H:i",
						step:30,
						validate : [ "required" ]
					}, {
						name : "hospital",
						label : "就诊医院",
						type:"select",
						key:"pkHospital",
						url:"api/hospital/query",
						lazy:true,
						value:"name",
						validate : [ "required" ]
					}, {
						name : "offices",
						label : "科室"
					},{
						name : "summary",
						label : "处理",
						type:"textarea"
					},{
						name : "description",
						label : "备注",
						type:"textarea"
					},{
						name : "recordPerson",
						value : "pkUser",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						defaultValue : activeUser.pkUser,
						validate:["required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					}]
				}
			});
			this.set("medRecForm", medRecForm);
			
			var medRecGrid = new Grid({
				parentNode : "#memMedRec",
				autoRender:false,
				url : "api/medicalrecords/query",
				params:function(){
					return {
						member:widget.getMember(),
						//fetchProperties : "*,recordPerson.name,recordPerson",
						type : "就诊记录"
					};
				},
				fetchProperties:"*,diseaseDetails.name,diseaseDetails.pkDiseaseDetail,hospital.name,recordPerson.name,recordPerson",
				model : {
					head : {
						buttons : [ {
							id : "add",
							icon : "icon-plus",
							handler : function() {
								if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:i18ns.get("sale_ship_owner","会员")+"已过世！"
									})
									return;
								}
								widget.get("medRecForm").reset();
								var form =widget.get("medRecForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让recordPerson可用
										var userSelect=form.getData("recordPerson","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("recordPerson",activeUser.pkUser);
										}
										var creator=form.getData("recordPerson","");
										creator.push(activeUser);
										form.setData("recordPerson",creator);
										form.setValue("recordPerson",activeUser);
									}
								});
								$(".J-form-medRecForm-select-recordPerson").attr("disabled",true);
								$(".J-form-medRecForm-date-recordDate").attr("disabled",true);
								widget.show("#memMedRec .el-form").hide("#memMedRec .el-grid");
							}
						} ]
					},
					columns : [{
						col:1,
						key:"reason",
						name : "就诊原因"
					},{
						col:1,
						key: "diseaseDetails" ,
						name:"疾病",
						format:function(value,row){
							var names = "";
							for (var i=0;i<value.length;i++) {
								names += value[i].name+" ";
							}
							return names;
						}
					},{
						col:2,
						key: "date" ,
						name:"就诊时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
					},{
						col:1,
						key : "hospital.name",
						name : "就诊医院"
					},{
						col:1,
						key : "offices",
						name : "科室"
					},{
						col:2,
						key : "summary",
						name : "处理"
					},{
						col:1,
						key : "recordPerson.name",
						name : "记录人"
					},{
						col:1,
						key:"recordDate",
						name:"记录日期",
						format:"date",
					},{
						col:1,
						key : "operate",
						name : "操作",
						format:function(row,value){
							if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						formatparams : [{
							key : "edit",
							icon : "edit",
							handler : function(index,data,rowEle) {
								$(".J-form-medRecForm-select-recordPerson").attr("disabled",true);
								$(".J-form-medRecForm-date-recordDate").attr("disabled",true);
								widget._toEdit(true);
								widget.get("medRecForm").setData(data);
								var form =widget.get("medRecForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var recordPerson=form.getData("recordPerson","");
										recordPerson.push(data.recordPerson);
										form.setData("recordPerson",recordPerson);
										form.setValue("recordPerson",data.recordPerson);
									}
								});
								widget.show("#memMedRec .el-form").hide("#memMedRec .el-grid");
							}
						},{
							key : "delete",
							icon : "remove",
							handler : function(index,data,rowEle) {
								aw.del("api/medicalrecords/"+ data.pkMedicalRecords+ "/delete",function() {
									widget._toEdit(false);
									widget.get("medRecGrid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("medRecGrid", medRecGrid);
			this.$("#memMedRec .el-form").addClass("hidden");
			
			// 渲染页签九：用药记录
			var phaTakForm = new Form({
				parentNode : "#memPhaTak",
				saveaction : function() {
					var params="member="+widget.getMember()+"&"+$("#phaTakForm").serialize()+
					"&"+"recordPerson="+$("select.J-form-phaTakForm-select-recordPerson").val()+
					"&"+"recordDate="+$(".J-form-phaTakForm-date-recordDate").val();
					var startTime = parseInt(widget.get("phaTakForm").getValue("startTime"));
					var endTime = parseInt(widget.get("phaTakForm").getValue("endTime"));
					if(!isNaN(endTime)){
						if(startTime>=endTime){
							Dialog.alert({
								content:"结束时间应晚于开始时间"
							});
							return;
						}
					}
					aw.saveOrUpdate("api/pharmacytakenotes/add",params,function(data) {
						widget._toEdit(false);
						widget.hide("#memPhaTak .el-form").show("#memPhaTak .el-grid");
						widget.get("phaTakGrid").refresh();
					});
					
				},
				cancelaction : function() {
					widget._toEdit(false);
					widget.hide(["#memPhaTak .el-form"]).show(["#memPhaTak .el-grid"]);
				},
				model : {
					id : "phaTakForm",
					items : [{
						name : "pkPharmacyTakeNotes",
						type : "hidden",
					},{
						name : "version",
						defaultValue : "0",
						type : "hidden"
					},{
						name:"medicine",
						key:"pkMedicine",
						label:"药品",
						value:"name,generalName",
						type : "select",
						lazy:true,
						url : "api/medicine/query",
						validate : [ "required" ]
					}, {
						name:"diseaseDetails",
						label : "疾病",
						key:"pkDiseaseDetail",
						value : "name",
						type : "select",
						url:"api/diseasedetail/querybymember",
						lazy:true,
						multi:true,
						validate:["required"]
					},{
						name:"direction",
						label:"用法",
						validate : [ "required" ]
					},{
						name:"dosage",
						label:"剂量",
						validate : [ "required" ]
					},{
						name:"startTime",
						label:"开始时间",
						type : "date",
						mode : "Y-m-d H:i",
						step:30,
						validate : [ "required" ]
					},{
						name:"endTime",
						label:"结束时间",
						type : "date",
						mode : "Y-m-d H:i",
						step:30,
					},{
						name : "recordPerson",
						value : "pkUser",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						defaultValue : activeUser.pkUser,
						lazy:true,
						validate:["required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
					}]
				}
			});
			this.set("phaTakForm", phaTakForm);
			
			var phaTakGrid = new Grid({
				parentNode : "#memPhaTak",
				url : "api/pharmacytakenotes/query",
				fetchProperties : "*,diseaseDetails.name,diseaseDetails.pkDiseaseDetail,medicine.name,medicine.generalName,recordPerson.name",
				params:function(){
					return {
						member : widget.getMember(),
						type : "用药记录"
					};
				},
				autoRender : false,
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
									Dialog.alert({
										content:i18ns.get("sale_ship_owner","会员")+"已过世！"
									})
									return;
								}
								widget.get("phaTakForm").reset();
								var form =widget.get("phaTakForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										//当前用户是管理员时，让recordPerson可用
										var userSelect=form.getData("recordPerson","");
										var flag = false;
										for(var  i =  0 ; i<userSelect.length;i++ ){
											if(userSelect[i].pkUser == activeUser.pkUser){
												flag= true;
												break;
											}
										}
										if(flag){
											form.setValue("recordPerson",activeUser.pkUser);
										}
										var creator=form.getData("recordPerson","");
										creator.push(activeUser);
										form.setData("recordPerson",creator);
										form.setValue("recordPerson",activeUser);
									}
								});
								$(".J-form-phaTakForm-select-recordPerson").attr("disabled",true);
								$(".J-form-phaTakForm-date-recordDate").attr("disabled",true);
								widget.show("#memPhaTak .el-form").hide("#memPhaTak .el-grid");
							}
						}]
					},
					columns : [{
						key : "medicine",
						name : "药品",
						format : function(value, row) {
							return value.name+(value.generalName || "");
						}
					},{
						key: "diseaseDetails" ,
						name:"疾病",
						format:function(value,row){
							var names = "";
							for (var i=0;i<value.length;i++) {
								names += value[i].name+" ";
							}
							return names;
						}
					},{
						key : "direction",
						name : "用法",
					},{
						key:"dosage",
						name:"剂量"
					},{
						key : "startTime",
						name : "开始时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key : "endTime",
						name : "结束时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key : "recordPerson.name",
						name : "记录人"
					},{
						key:"recordDate",
						name:"记录日期",
						format:"date",
					},{
						key : "operate",
						name : "操作",
						format:function(row,value){
							if(inParams&&inParams.flg&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{
								return "button";
							}
						},
						formatparams : [{
							key : "edit",
							icon : "edit",
							handler : function(index,data,rowEle) {
								$(".J-form-phaTakForm-select-recordPerson").attr("disabled",true);
								$(".J-form-phaTakForm-date-recordDate").attr("disabled",true);
								widget._toEdit(true);
								widget.get("phaTakForm").setData(data);
								var form =widget.get("phaTakForm");
								form.load("recordPerson",{
									params:{
										fetchProperties:"pkUser,name"
									},
									callback:function(){
										var recordPerson=form.getData("recordPerson","");
										recordPerson.push(data.recordPerson);
										form.setData("recordPerson",recordPerson);
										form.setValue("recordPerson",data.recordPerson);
									}
								});
								widget.hide("#memPhaTak .el-grid").show("#memPhaTak .el-form");
							}
						},{
							key : "delete",
							icon : "remove",
							handler : function(index,data,rowEle) {
								aw.del("api/pharmacytakenotes/"+ data.pkPharmacyTakeNotes+ "/delete",function(){
									widget._toEdit(false);
									widget.get("phaTakGrid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("phaTakGrid", phaTakGrid);
			this.$("#memPhaTak .el-form").addClass("hidden");
			
			//容器类组件要放到最后设置，然后放到最后销毁
			this.set("tab", tab);
		},
		afterInitComponent : function(params,widget) {
			var subnav = this.get("subnav");
			if (params && params.fatherNode && params.pkMember) {
				// 复诊提醒待办，会员全景，健康巡检计划，健康巡检待办
				aw.ajax({
					url : "api/member/"+widget.getMember(),
					type : "POST",
					data : {
						fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number,status",
					},
					dataType : "json",
					success : function(data) {
						widget.defMember = data;
						subnav.setTitle("健康日志：" + params.name);
						widget.refreshDisease();
						widget.refreshMeicine();
						widget.refreshHospital();
						$(".J-main-date").attr("data-key", params.date);
						widget._initGrid();
						if ("eling/elcms/schedule/healthRoutSchedule/healthRoutSchedule" == params.fatherNode
								|| "eling/elcms/schedule/healthRoutToDoList/healthRoutToDoList" == params.fatherNode) {
							subnav.show(["finish"]);
						}
					}
				});
			} else {
				// 从菜单和秘书工作台打开，需要加载会员
				subnav.show([0]);
				subnav.load({
					id : "defaultMembers",
					params : {
						"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"memberSigning.room.building" : subnav.getValue("building"),
						fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number,status",
					},
					callback : function(data) {
						if(data.length>0){
							widget.defMember = data[0];
							widget._initGrid();
							widget.refreshDisease();
							widget.refreshMeicine();
							widget.refreshHospital();
						}
						
					}
				});
			}
		}
	});
	module.exports = healthDailyRecord;
});
