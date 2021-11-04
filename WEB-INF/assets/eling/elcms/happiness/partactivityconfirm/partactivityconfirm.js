/**
 * 参加活动确认
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var Grid = require("grid");
	var aw = require("ajaxwrapper");
	//var enmu = require("enums");
	var Dialog=require("dialog");
	//多语
	var i18ns = require("i18n");
	var template="<div class='el-partactivityconfirm'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-activityTitle hidden' style='font-size:20px;margin-left:2%;margin-top:10px;'></div>" +
	"<div class='J-grid'></div>" +
	"<div class='J-recordgrid hidden'></div>"+
	"<div class='J-PkActivity hidden'></div>"+
	"<div class='J-pageFlg hidden'></div>"+
	"</div>";
	
	var supplementGrid=require("./supplementgrid");
	
	var partactivityconfirm = ELView.extend({
		attrs:{
			template:template
		},
		_batchConfim:function(widget,participate){
			
			var recordgrid=widget.get("recordgrid");
			var data =recordgrid.getSelectedData();
			var pks=[];
			for ( var i in data) {
				if(data[i].partStatus.key == "PendConfirm"){
					pks.push(data[i].pkActivitysignup);
				}
			}
			Dialog.confirm({
				content : data.length+"人确认"+(participate?"":"不")+"参加活动？",
				confirm : function(){
					Dialog.loading(true);
					aw.ajax({
						url:"api/activitysignup/batchconfim",
						data:{
							pks:pks.toString(),
							participate:participate
						},
						dataType:"json",
						success:function(data){
							Dialog.loading(false);
							widget.get("recordgrid").refresh();
						},
						error:function(){
							Dialog.loading(false);
						}
					});	
				}
			});
		},
		_showSupplementDialog : function (widget){
			Dialog.confirm({
				title : "报名补录",
				defaultButton : false,
				setStyle : function(){
					$(".el-dialog-modal .modal").css({
						width: "70%",
						height: "80%",
						left: "15%",
						top: "10%",
						"overflow-y": "scroll"
					});
				},
				buttons : [{
					id : "save",
					text : "保存",
					className : "btn-primary",
					handler : function(){
						var datas = widget.get("supplementG").getData();
						
						var members = [];
						for(var i in datas){
							members[i] = datas[i].member.pkMember;
						}
						var data = {};
						data.activity = $(".J-PkActivity").attr("data-key");
						data.members = members;
						aw.ajax({
							url:"api/activitysignup/savesupplement",
							data:aw.customParam(data),
							dataType:"json",
							success:function(data){
								Dialog.close();
								widget.get("recordgrid").refresh();
								widget.get("grid").refresh();
							},
							error:function(data){
								Dialog.close();
								widget.get("recordgrid").refresh();
								widget.get("grid").refresh();
							}
						});
					}        							
				},{
					id : "cancle",
					text : "取消",
					handler : function(){
						Dialog.close();
					}        							
				}]
			});
			supplementGrid.init(widget);
		},
		events:{
			"click .J-activity-theme":function(ele){
				var grid =this.get("grid");
				var index = grid.getIndex(ele.target);
				var data = grid.getData(index);
				$(".J-pageFlg").attr("data-key", "activity");
				var params = this.get("params");
				this.openView({
					url:"eling/elcms/happiness/activitysignupquery/activitysignupquery",
					params:{
						activitysignupqueryType : (params ? params.activitysignupType : ""),
						pkActivity : data.activity.pkActivity
					},
					isAllowBack:true
				});
			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"参加活动确认",
					items : [{
						id : "searchTheme",
						type : "search",
						placeholder : "活动主题",
						handler : function(str){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/activitysignup/queryStatus",
								data:{
									s:str,
									type:(params ? params.activitysignupType : ""),
									sc:widget.get("subnav").getValue("searchTheme"),
									"activity.status":widget.get("subnav").getValue("status"),
									start:widget.get("subnav").getValue("activitystartDate").start,
									end:widget.get("subnav").getValue("activitystartDate").end,
									fetchProperties : "activity.pkActivity," +
									"activity.theme," +
									"activity.activityStartTime," +
									"activity.activityEndTime," +
									"activity.users," +
									"activity.users.name," +
									"activity.users.pkUser," +
									"activity.mostActivityNumber," +
									"activity.status," +
									"enrollIn," + 
									"notEnrollIn," +
									"enrollNotIn,"+
									"activitySignup.pkActivitysignup," +
									"activitySignup.member.memberSigning.room.number," +
									"activitySignup.member.personalInfo.name," +
									"activitySignup.member.personalInfo.sex," +
									"activitySignup.member.personalInfo.phone," +
									"activitySignup.member.personalInfo.idNumber," +
									"activitySignup.member.personalInfo.mobilePhone,"+
									"activitySignup.registrationTime," +
									"activitySignup.activityStatus," +
									"activitySignup.type," +
									"activitySignup.actual",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
							
						}
					},{
						id : "status",
						type : "buttongroup",
						tip : "活动状态",
						items:[{
							key : "",
							value : "全部"
						},{
							key : "NotBegin",
							value : "未启动"
						},{
							key : "SigningUp",
							value : "报名中"
						},{
							key : "Beginning",
							value : "进行中"
						},{
							key : "End",
							value : "结束"
						},{
							key : "Cancel",
							value : "作废"
						}],
						handler : function(key, element) {
							subnav.setValue("searchTheme","");
							widget.get("grid").refresh();
						}
					},{
						tip:"活动开始时间",
						id : "activitystartDate",
						type : "daterange",
						ranges:{
							"上周":[moment().subtract(1,"weeks").startOf("week"), moment().subtract(1,"weeks").endOf("week")],
							"本周": [moment().startOf("week"), moment().endOf("week")],
							"本月": [moment().startOf("month"), moment().endOf("month")],
							"上月": [moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")],
						},
						defaultRange : "本月",
						minDate: "1930-05-31",
						maxDate: "2020-12-31",
						handler : function(time){
							subnav.setValue("searchTheme","");
							widget.get("grid").refresh();
						}
					},{
						id : "building",
						type : "buttongroup",
						tip : "楼宇",
						keyField : "pkBuilding",
						valueField : "name",
						show : false,
						showAll : true,
						showAllFirst : true,
						url : "api/building/query",
						params : function() {
							return {
								"useType" : "Apartment",
								fecthProperties : "pkBuilding,name"
							};
						},
						handler : function(key, element) {
							widget.get("recordgrid").refresh();
							
						}
						
					},{
						id : "partStatus",
						type : "buttongroup",
						tip : "参加状态",
						show : false,
						items:[{
							key : "Part,NotPart,PendConfirm",
							value : "全部"
						},{
							key : "Part",
							value : "参加"
						},{
							key : "NotPart",
							value : "未参加"
						},{
							key : "PendConfirm",
							value : "待确认"
						}],
						//items : enmu["com.eling.elcms.happiness.model.Activitysignup.ActivityStatus"],
//						all : {
//							show : true,
//							text : "全部",
//							position : "top"
//						},
						handler : function(key, element) {
							widget.get("recordgrid").refresh();
						}
					},{
						id : "betch",
						type : "buttongroup",
						tip : "批量操作",
						show : false,
						items:[{
							key : "In",
							value : "参加（批量）"
						},{
							key : "NotIn",
							value : "不参加（批量）"
						}],
						handler : function(key, element) {
							if(key == "In"){
								widget._batchConfim(widget,true);
							}else if(key == "NotIn"){
								widget._batchConfim(widget,false);
							}
						}
					},{
						id : "signupSupplement",
						text : "报名补录",
						type : "button",
						show : false,
						handler : function(){
							aw.ajax({
								url:"api/activitysignup/query",
								data : {
									activity:$(".J-PkActivity").attr("data-key"),
									activityStatus:"Supplement",
									fetchProperties:"*," +
									"member.pkMember," +
									"member.status," +
									"member.personalInfo.name," +
									"member.personalInfo.sex,"+
									"member.personalInfo.birthday," +
									"member.personalInfo.idType," +
									"member.personalInfo.idNumber," +
									"member.personalInfo.phone," +
									"member.personalInfo.mobilePhone,"+
									"member.memberSigning.room.number"
								},
								dataType:"json",
								success:function(data){ 
									widget._showSupplementDialog(widget);
									widget.get("supplementG").setData(data);
								}
							});
						}
					},{
						id : "signupSupplement",
						text : "报名补录",
						type : "button",
						show : false,
						handler : function(){
							aw.ajax({
								url:"api/activitysignup/query",
								data : {
									activity:$(".J-PkActivity").attr("data-key"),
									activityStatus:"Supplement",
									fetchProperties:"*," +
									"member.pkMember," +
									"member.status," +
									"member.personalInfo.name," +
									"member.personalInfo.sex,"+
									"member.personalInfo.birthday," +
									"member.personalInfo.idType," +
									"member.personalInfo.idNumber," +
									"member.personalInfo.phone," +
									"member.personalInfo.mobilePhone,"+
									"member.memberSigning.room.number"
								},
								dataType:"json",
								success:function(data){ 
									widget._showSupplementDialog(widget);
									widget.get("supplementG").setData(data);
								}
							});
						}
					},{
						id : "return",
						text : "返回",
						type : "button",
						show : false,
						handler : function(){
							var subnav= widget.get("subnav");
							widget.get("grid").refresh();
							widget.hide([".J-recordgrid",".J-activityTitle"]).show([".J-grid"]);
							subnav.hide(["return","signupSupplement","partStatus","betch","building"]).show(["activitystartDate","searchTheme","status"]);
						}
					}]
				}
			});  
			this.set("subnav",subnav);
			
			var grid = new Grid({
				autoRender : false,
				parentNode : ".J-grid",
				model:{
					url : "api/activitysignup/queryStatus",
					params : function(){
						return {
							type:(params ? params.activitysignupType : ""),
							sc:widget.get("subnav").getValue("searchTheme"),
							"activity.status":widget.get("subnav").getValue("status"),
							start:widget.get("subnav").getValue("activitystartDate").start,
							end:widget.get("subnav").getValue("activitystartDate").end,
							fetchProperties : "activity.pkActivity," +
							"activity.theme," +
							"activity.activityStartTime," +
							"activity.activityEndTime," +
							"activity.users," +
							"activity.users.name," +
							"activity.users.pkUser," +
							"activity.mostActivityNumber," +
							"activity.status," +
							"activity.registrationStartTimen," +
							"activity.registrationEndTimen," +
							"enrollIn," + 
							"notEnrollIn," +
							"enrollNotIn," +
							"pendConfirm," +
							"partTotal,"+
							"activitySignup.pkActivitysignup," +
							"activitySignup.member.memberSigning.room.number," +
							"activitySignup.member.personalInfo.name," +
							"activitySignup.member.personalInfo.sex," +
							"activitySignup.member.personalInfo.phone," +
							"activitySignup.member.personalInfo.idNumber," +
							"activitySignup.member.personalInfo.mobilePhone,"+
							"activitySignup.registrationTime," +
							"activitySignup.activityStatus," +
							"activitySignup.type," +
							"activitySignup.partStatus",
						}
					},
					columns:[{
						name : "activity.theme",
						label : "活动主题",
						format:function(row,value){
							return "<a href='javascript:void(0);' style='color:red;' class='J-activity-theme'>"+value.activity.theme+"</a>";
						}
					},{
						name : "activity.activityStartTime",
						label : "活动开始时间",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						format:"date",
					},{
						name : "activity.activityEndTime",
						label : "活动结束时间",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						format:"date",
					},{
						name : "activity.users",
						label : "秘书负责人",
						format:function(value,row){
							var names = "";
							for (var i=0;i<value.length;i++) {
								names += value[i].name+",";
							}
							return names.substr(0, names.length-1);
						}
					},{
						name : "activity.status.value",
						label : "活动状态",
					},
//					{
//						name : "activity.mostActivityNumber",
//						label : "报名人数上限",
//					},
					{
						name : "pendConfirm",
						label : "待确认",
					},{
						name : "enrollIn",
						label : "报名已参加",
					},{
						name : "enrollNotIn",
						label : "报名未参加",
					},{
						name : "notEnrollIn",
						label : "未报名已参加",
					},{
						name : "partTotal",
						label :"参加总人数",
					},{
						name : "operate",
						label : "操作",
						format:"button",
						formatparams:[{
							id : "check",
							text : "活动确认",
							handler : function(index,data,rowEL){
								var recordgrid= widget.get("recordgrid");
								recordgrid.setData(data.activitySignup);
								$(".J-PkActivity").attr("data-key", data.activity.pkActivity);
								$(".J-activityTitle").text(moment(data.activity.activityStartTime).format("YYYY-MM-DD HH:mm")+" "+data.activity.theme);
								widget.hide([".J-grid"]).show([".J-recordgrid",".J-activityTitle"]);
								widget.get("subnav").setValue("partStatus", "Part,NotPart,PendConfirm");
								widget.get("subnav").hide(["activitystartDate","searchTheme","status"]).show(["partStatus","signupSupplement","return","betch","building"]);
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var recordgrid = new Grid({
				parentNode : ".J-recordgrid",
				autoRender : false,
				model:{
					url : "api/activitysignup/query",
					isInitPageBar:false,
					isCheckbox:true,
					params : function(){
						return {
							activity:$(".J-PkActivity").attr("data-key"),
							activityStatusIn:"Success,Queuing,Supplement",
							"member.memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
							partStatusIn:widget.get("subnav").getValue("partStatus"),
							fetchProperties:"*," +
							"member.pkMember," +
							"member.status," +
							"member.personalInfo.name," +
							"member.personalInfo.sex,"+
							"member.personalInfo.birthday," +
							"member.personalInfo.idType," +
							"member.personalInfo.idNumber," +
							"member.personalInfo.phone," +
							"member.personalInfo.mobilePhone,"+
							"member.memberSigning.room.number"
						}
					},
					columns:[{
						name : "member",
						label : i18ns.get("sale_ship_owner","会员"),
						format:function(row,value){
							return value.member.memberSigning.room.number+" "+value.member.personalInfo.name;
						},
					},{
						name:"member.personalInfo.sex.value",
						label:i18ns.get("sale_ship_owner","会员")+"姓别"
					},{
						name : "member.personalInfo.idNumber",
						label : "身份证号码",
					},{
						name : "member.personalInfo.mobilePhone",
						label : "联系方式",
						format:function(value,row){
							var phone = row.member.personalInfo.phone;
							var mobile = row.member.personalInfo.mobilePhone;
							var str = "";
							if(phone!=""){
								str += phone;
							}
							if (phone!="" && mobile!=""){
								str += "/";
							}
							if(mobile!=""){
								str += mobile;
							}	
							return str;
						}
					},{
						name : "registrationTime",
						label : "报名时间",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm:ss"
						},
						format:"date",
					},{
						name : "activityStatus.value",
						label : "报名状态",
					},{
						name : "partStatus.value",
						label : "参加状态",
						format:function(value,row){
							if(row.partStatus==null){
								return "待确认";
							}else{
								if(row.partStatus.key=='Part'){
									return "参加";
								}else if(row.partStatus.key=='NotPart'){
									return "未参加";
								}else{
									return "待确认";
								}
							}
						}
					},{
						name : "operate",
						label : "操作",
						format:"button",
						formatparams:[{
							id : "confirm",
							text : "参加",
							show:function(value,row){        								
								if(row.partStatus && (row.partStatus.key=='Part' || row.partStatus.key=='NotPart')){
									return false;
								}else{
									return true;
								}
							},
							handler:function(index,data,rowEL){
								Dialog.confirm({
									content : data.member.memberSigning.room.number+" "+data.member.personalInfo.name+" 确认参加活动？",
									confirm : function(){
	                        			aw.ajax({
	        								url:"api/activitysignup/"+data.pkActivitysignup+"/saveactual?a=true",
	        								dataType:"json",
	        								success:function(data){ 
	        									widget.get("recordgrid").refresh();
	        								}
	        							});
									}
								});
							}
						},{
							id : "unconfirm",
							text : "未参加",
							show:function(value,row){        								
								if(row.partStatus && (row.partStatus.key=='Part' || row.partStatus.key=='NotPart')){
									return false;
								}else{
									return true;
								}
							},
							handler:function(index,data,rowEL){
								Dialog.confirm({
									content : data.member.memberSigning.room.number+" "+data.member.personalInfo.name+" 确认未参加活动？",
									confirm : function(){
	                        			aw.ajax({
	        								url:"api/activitysignup/"+data.pkActivitysignup+"/saveactual?a=false",
	        								dataType:"json",
	        								success:function(data){ 
	        									widget.get("recordgrid").refresh();
	        								}
	        							});
									}
								});
							}
						},{
							id : "activityreport",
							text : "活动报告",
							handler : function(index,data,rowEL){
								$(".J-pageFlg").attr("data-key", "activityreport");
								var params = widget.get("params");
								widget.openView({
									url:"eling/elcms/happiness/memberactivityreport/memberactivityreport",
									params:{
										activityreportType : (params ? params.activitysignupType : ""),
										activity : $(".J-PkActivity").attr("data-key")
									},
									isAllowBack:true
								});
							}
						}
						]
					}]
				}
			});
			this.set("recordgrid",recordgrid);
		},
		memberValidate:function(member,datas){
			for ( var i in datas) {
				if(member.pkMember  == datas[i].member.pkMember){
					Dialog.alert({
						content : "该"+i18ns.get("sale_ship_owner","会员")+"已存在!",
						confirm : function(){
							$(".el-dialog-mask")[$(".el-dialog-mask").length-1].remove();
							$(".el-dialog-modal")[$(".el-dialog-modal").length-1].remove()
							return false;
						}
					});
					return false;
				}
			}
			return true;
		},
		setEpitaph:function(){
			var subnav=this.get("subnav");
			var params = this.get("params");
			return {
				activitysignupType:(params ? params.activitysignupType : ""),
				start : this.get("subnav").getValue("activitystartDate").start,
				end : this.get("subnav").getValue("activitystartDate").end,
				activity : $(".J-PkActivity").attr("data-key"),
				partStatus : this.get("subnav").getValue("partStatus"),
				"member.memberSigning.room.building.pkBuilding":this.get("subnav").getValue("building"),
				title : $(".J-activityTitle").text(),
				flg : $(".J-pageFlg").attr("data-key")
			};
		},
		afterInitComponent:function(params,widget){
			var subnav=this.get("subnav");
			if(params){
				if (params.activity){
					$(".J-PkActivity").attr("data-key", params.activity);
				}
				if (params.activityStatus){
					subnav.setValue("activityStatus", params.activityStatus);
				}
				if (params.title){
					$(".J-activityTitle").text(params.title);
				}
				if (params.start && params.end){
					var date = {};
					date.start = params.start;
					date.end = params.end;
					subnav.setValue("activitystartDate", date);
				}
				if(params.flg == "activityreport"){
					widget.get("grid").refresh();
					widget.get("recordgrid").refresh();
					widget.hide([".J-grid"]).show([".J-recordgrid",".J-activityTitle"]);
					widget.get("subnav").hide(["activitystartDate","searchTheme","status"]).show(["partStatus","signupSupplement","return","betch","building"]);
				}else{
					widget.get("grid").refresh();
				}
			}			
		}
	});
	module.exports=partactivityconfirm;
});