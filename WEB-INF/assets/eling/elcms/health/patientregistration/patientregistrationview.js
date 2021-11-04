define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var Form = require("form");
	var Json = require("json");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
 				"<div class='J-grid'></div>" +
 				"<div class='J-form hidden'></div>";
        var patientregistrationview  = ELView.extend({
        	events:{
        		"change .J-form-patientForm-select-accompanyType" : function(e){
					var form=this.get("patientForm");
					var accompanyType=form.getValue("accompanyType");
					if(accompanyType=="SecretaryAccompany"){
						form.show("secretary");
					}else{
						form.hide("secretary");
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
						form.setValue("status","WaittingHospital");
					}
				},
        	},
            attrs:{
            	template:template
            },
            initComponent:function(params,widget){
        			var subnav=new Subnav({
        				parentNode:".J-subnav",
        				model:{
        					title:i18ns.get("sale_ship_owner","会员")+"住院记录",
        				}
    				});
        			this.set("subnav",subnav);
            		
                    var grid=new Grid({
                    	parentNode:".J-grid",
                    	autoRender : false,
                        model:{
                        	url : "api/patientregistration/querymember",
                        	 params : function(){
                        		 var params=widget.get("params");
                                 return {
                                	 "pkMember":params.pkMember,
             						fetchProperties :"pkPatientRegistration," +
             								"version," +
             								"disease," +
             								"checkInDate," +
             								"checkOutDate," +
             								"remindStartDay," +
             								"hospital.pkHospital," +
             								"hospital.name," +
             								"status.value," +
             								"departmentsSickbed," +
             								"accompanyType.value," +
             								"secretary.pkUser," +
             								"secretary.name," +
             								"afterTreatment," +
             								"dischargeDiagnosis," +
             								"backDrug," +
             								"doctorAdvised," +
             								"description," +
             								"isTransfer.value," +
             								"turnOutRegistration.pkPatientRegistration," +
             								"turnOutRegistration.hospital.pkHospital," +
             								"turnOutRegistration.hospital.name"

                                 };
                             },
                            columns:[{
                            	name:"disease",
        						label:"住院原因",
        						col:1,
                            },{
                            	name:"checkInDate",
        						label:"住院日期",
        						format:"date",
        						col:1,
        					},{
            					name:"checkOutDate",
        						label:"出院日期",
        						format:"date",
        						col:3,
        					},{
        						name:"hospital.name",
        						label:"医院名称",
        						col:1,
        					},{
        						name:"status.value",
        						label:"住院状态",
        						col:1,
        					},{
        						name:"operate",
        						label:"操作",
        						format:"button",
        						col:2,
        						formatparams : [{
        							id : "edit",
        							icon : "icon-edit",
        							handler : function(index,data,rowEle) {
        								var form=widget.get("patientForm");
        								if(data.accompanyType==null||data.accompanyType.key!="SecretaryAccompany"){
        									form.hide("secretary");
        		    					}else{
        		    						form.show("secretary");
        		    					}
        								form.setData(data);
        								if(data.turnOutRegistration){
        									form.setValue("turnOutRegistrationpk",data.turnOutRegistration.pkPatientRegistration);
        									form.setValue("turnOutHospitalname",data.turnOutRegistration.hospital.name);
        									form.setValue("orgCheckOutDate",data.turnOutRegistration.checkOutDate);
        									form.setValue("orgStatus",data.turnOutRegistration.status.value);
        								}else{
        									form.setValue("turnOutHospitalname","");
        								}
        								if(data.isTransfer==null){
        									form.setValue("isTransfer","false");
        								}
        								form.setValue("checkOutDate",data.checkOutDate?data.checkOutDate:null);
        								form.setDisabled(["isTransfer","turnOutHospitalname"],true);
        								widget.show(".J-form").hide(".J-grid");
        							}
        						},{
        							id : "delete",
        							icon : "icon-remove",
        							handler : function(index,data,rowEle) {
        								aw.del("api/patientregistration/"+ data.pkPatientRegistration+ "/delete",function() {
        									widget.get("patientGrid").refresh();
        								});
        							}
        						},{
        							id:"transfer",
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
        											 form.setDisabled(["isTransfer","turnOutHospitalname"],true);
        											widget.show(".J-form").hide(".J-grid");
        										}
        									}
        								});
        								
        							}
        						}]
        					}]
                        },
                    });
                    this.set("grid",grid);
                    
                    var patientForm = new Form({
        				parentNode : ".J-form",  
        				saveaction : function() {
        					var inParams=widget.get("params");
        					var examForm=widget.get("patientForm");
        					if(examForm.getValue("status")=="BeInHospital"){
        						var gridDatas=widget.get("grid").getData();
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
        					if(examForm.getValue("isTransfer")=="true"){
        						url="api/patientregistration/saveTransfer";
        					}else{
        						url="api/patientregistration/save";
        					}
        					var params="turnOutRegistration="+examForm.getValue("turnOutRegistrationpk")+"&member="+inParams.pkMember+"&"+$("#patientForm").serialize();
        					aw.saveOrUpdate(url,params,function(data) {
        						if (data.msg!="操作成功") {
        							Dialog.alert({
        								content : data.msg
        							});
        							return false;
        						}
        						widget.hide(".J-form").show(".J-grid");
        						widget.get("grid").refresh();
        						
        					});
        				},
        				cancelaction : function() {
        					widget.hide(".J-form").show(".J-grid");
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
        						name : "checkInDate",
        						label : "住院日期",
        						type : "date",
        						mode : "YYYY-MM-DD",
        						validate : [ "required" ]
        					},{
        						name : "checkOutDate",
        						label : "出院日期",
        						type : "date",
        						mode : "YYYY-MM-DD"
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
        					}]
        				}
        			});
        			this.set("patientForm", patientForm);
                    
                },
                afterInitComponent : function(params,widget) {
                	if(params&&params.pkFather){
                		aw.ajax({
		   					url : "api/member/query",
		   					type : "POST",
		   					data : {
		   						"pkMember":params.pkMember,
		   						fetchProperties:"personalInfo.name,memberSigning.room.number"
		   					},
		   					success : function(datas) {
		   						widget.get("grid").refresh();
		   						widget.get("subnav").setTitle(i18ns.get("sale_ship_owner","会员")+"住院记录："+datas[0].memberSigning.room.number+"  "+datas[0].personalInfo.name);
		   					}
		   				});
                		
                	}
                	
            	 }
        });
        module.exports = patientregistrationview ;
});
