define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var Verform = require("form-1.0.0"); 
	var Form=require("form-2.0.0")
	var Json = require("json");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
 				"<div class='J-grid'></div>"+ 
 				"<div class='J-form hidden'></div>" +
 				"<div class='J-visitGrid hidden'></div>"
 				;
        var patientregistration  = ELView.extend({
        	events:{
        		"change .J-accompanyType" : function(e){
					var pk=$(e.target).find("option:selected").attr("value");
					if(pk=="SecretaryAccompany"){
						$(".J-secretary").parent().parent().removeClass("hidden");
					}else{
						$(".J-secretary").parent().parent().addClass("hidden");
					}
				},
				"click .J-detail" : function(e){
					var widget = this;
					
					var grid= widget.get("grid");
					var index = grid.getIndex(e.target);
					var data = grid.getSelectedData(index);
					var form= widget.get("form");
					var subnav= widget.get("subnav");
					var visitGrid= widget.get("visitGrid");
					form.reset();
					data.checkInDate =data.checkInDate? moment(data.checkInDate).format("YYYY-MM-DD"):"";
					data.checkOutDate =data.checkOutDate? moment(data.checkOutDate).format("YYYY-MM-DD"):"";
					form.setData(data);
					form.setDisabled(true);
					form.setData(data);
					visitGrid.refresh();
					widget.show([".J-form",".J-visitGrid"]).hide(".J-grid");
					subnav.show(["return"]).hide(["building","status","time","search"]);
					
				}
    		},
            attrs:{
            	template:template
            },
            initComponent:function(params,widget){
        			var subnav=new Subnav({
        				parentNode:".J-subnav",
        				model:{
        					title:i18ns.get("sale_ship_owner","会员")+"住院记录",
        					search : function(str) {
        						var g=widget.get("grid");
        						g.loading();
        						aw.ajax({
        							url:"api/patientregistration/search",
        							data:{
        								s:str,
        								"member.statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
     								    "member.memberSigning.status":"Normal",
     									"member.memberSigning.houseingNotIn" : false,
        								searchProperties:"member.personalInfo.name,"+
        						          "member.memberSigning.room.number,"+
        						          "hospital.name",
        						        fetchProperties:"checkInDate," +
	                        				"checkOutDate," +
	                        				"disease," +
	                        				"illness.name," +
	                        				"departmentsSickbed," +
	                        				"pkPatientRegistration," +
	                        				"status," +
	                        				"version," +
	                        				"remindStartTime," +
	                        				"accompanyType," +
	                        				"secretary.name," +
	                        				"afterTreatment," +
	                        				"dischargeDiagnosis," +
	                        				"doctorAdvised," +
	                        				"backDrug," +
	                        				"description," +
	                        				"registrant.name," +
	                        				"member.pkMember," +
	                        				"member.personalInfo.name," +
	                        				"member.memberSigning.room.number," +
	                        				"member.memberSigning.room.pkRoom," +
	                        				"secretary," +
	                        				"hospital.name" 
        							},
        							dataType:"json",
        							success:function(data){
        								g.setData(data);
        								
        							}
        						});
        					},
        					buttons:[{
        						id:"return",
        						text:"返回",
        						show:false,
        						handler:function(){
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							form.reset();
        							subnav.setValue("search","");
        							$(".J-secretary").parent().parent().addClass("hidden");
        							widget.hide([".J-form",".J-visitGrid"]).show(".J-grid");
        							subnav.hide(["return"]).show(["building","status","time","search"]);
        						}
        					}],
        					buttonGroup:[{
        						id:"building",
        						showAll:true,
        						handler:function(key,element){
        							widget.get("grid").refresh();
        							widget.get("subnav").setValue("search","");
//        							widget.get("form").load("member");
        						}
            				},{
            					id:"status",
            					items:[{
            						key:"WaittingHospital",
            						value:"未入住"
            					},{
            						key:"BeInHospital",
            						value:"住院中"
            					},{
            						key:"LeaveHospital",
            						value:"已出院"
            					}],
            					handler:function(key,element){
            						widget.get("grid").refresh();
            						widget.get("subnav").setValue("search","");
            					}
            				}],
            				time:{
        						tip:"住院日期范围",
        						click:function(time){
        						   widget.get("subnav").setValue("search","");
             					   widget.get("grid").refresh();
             					 
             				   },
             				   ranges : {
             				      "本月": [moment().startOf("month"), moment().endOf("month")]
             				   }
        					},
        				}
    				});
        			this.set("subnav",subnav);
            		
                    var grid=new Grid({
                    	parentNode:".J-grid",
						autoRender : false,
                    	url : "api/patientregistration/query",
                    	params:function(){
                    		var subnav=widget.get("subnav");
                    		return {
                    			"member.memberSigning.room.building":subnav.getValue("building"),
                    			"member.statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
								"member.memberSigning.status":"Normal",
								"member.memberSigning.houseingNotIn" : false,
								"checkInDate":subnav.getValue("time").start,
								"checkInDateEnd":subnav.getValue("time").end,
                        		status:subnav.getValue("status"),
                        		fetchProperties:"checkInDate," +
                				"checkOutDate," +
                				"disease," +
                				"illness.name," +
                				"departmentsSickbed," +
                				"pkPatientRegistration," +
                				"status," +
                				"version," +
                				"remindStartTime," +
                				"accompanyType," +
                				"secretary.name," +
                				"afterTreatment," +
                				"dischargeDiagnosis," +
                				"doctorAdvised," +
                				"backDrug," +
                				"description," +
                				"registrant.name," +
                				"member.pkMember," +
                				"member.personalInfo.name," +
                				"member.memberSigning.room.number," +
                				"member.memberSigning.room.pkRoom," +
                				"secretary," +
                				"hospital.name" 
                    		};
                    	},
                        model:{
                            columns:[{
                            	key:"member.personalInfo.name",
        						name:i18ns.get("sale_ship_owner","会员"),
        						col:1,
        						format:function(value,row){
        							var result=value+" "+(row.member.memberSigning.room!=null?row.member.memberSigning.room.number:"");
        							return "<a href='javascript:void(0);' style='color:red;' class='J-detail' >"+result+"</a>";
        						}
                            },{
                            	key:"illness",
        						name:"疾病",
        						format:function(value,row){
        							var result="";
        							for(var i=0;i<value.length;i++){
        								if(i==(value.length-1)){
        									result+=value[i].name;
        								}else{
        									result+=value[i].name+"、";
        								}
        								
        							}
        							return result;
        						},
        						col:1,
        					},{
            					key:"disease",
        						name:"入院原因",
        						col:3,
        					},{
        						key:"checkInDate",
        						name:"住院日期",
        						col:1,
        						format:"date"
        					},{
        						key:"checkOutDate",
        						name:"预计出院日期",
        						col:1,
        						format:"date"
        					},{
        						key:"hospital.name",
        						name:"医院名称",
        						col:2,
        					},{
        						key:"departmentsSickbed",
        						name:"科室/床位",
        						col:2,
        					},{
        						key:"status.value",
        						name:"住院状态",
//        						col:1,
        					}]
        				}
                    });
                    this.set("grid",grid);
                        
                    var form=new Form({
        				parentNode:".J-form",
        				model:{
        					id:"patientregistration",
        					defaultButton:false,
        					items:[{
        						name:"pkPatientRegistration",
        						type:"hidden",
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"member.personalInfo.name",
        						label:i18ns.get("sale_ship_owner","会员")
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"member.memberSigning.room.number",
        						label:"房间号"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"disease",
        						label:"入院原因",
        						type : "textarea",
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"checkInDate",
        						label:"住院日期",
        						mode : "YYYY-MM-DD"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"checkOutDate",	
        						label:"预计出院日期",
        						mode : "YYYY-MM-DD"
        						
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name : "hospital.name",
								label : "医院"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"departmentsSickbed",
        						label:"科室/床位",
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"accompanyType.value",
        						label:"陪同类型"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
    							name:"secretary.name",
    							label:"秘书陪同人",
    						},{
    							className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"status.value",
        						label:"住院状态"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"afterTreatment",
        						label:"治疗经过",
        						type : "textarea"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"dischargeDiagnosis",
        						label:"出院诊断",
        						type : "textarea"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"backDrug",
        						label:"带回药品",
        						type : "textarea"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"doctorAdvised",
        						label:"医生建议",
        						type : "textarea"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
								name : "description",
								label : "备注",
								type : "textarea"
							}]
        				}
        			});
        			this.set("form",form);
        			
        			var visitGrid = new Grid({
        				parentNode:".J-visitGrid",
        				autoRender:false,
        				url:"api/visitedregistration/query",
        				params:function(){
        					return{
        						"patientRegistration":widget.get("form").getValue("pkPatientRegistration"),
        						fetchProperties:"pkVisitedRegistration," +
        								"visitDate," +
        								"visitors.name," +
        								"visitors.pkUser," +
        								"carryitems," +
        								"carFare," +
        								"giftAllowance," +
        								"situation," +
        								"description," +
        								"registrant.name," +
        								"version"
        					}
        				},
        				model:{
        					head:{
        						title:"探望记录", 
        					},
        					columns:[{
        						key : "visitors",
        						name : "探望人",
        						format:function(value,row){
        							var name= "";
        							if(value.length>0){
        								for(var i =0 ;i<value.length;i++){
        									if(i<value.length-1){
        										name+= value[i].name+"、";
        									}else{
        										name+= value[i].name;
        									}
        								}
        							}else{
        								name="无";
        							}
        							return name;
        						}
        					},{
        						key :"visitDate",
        						name : "探望时间",
        						format:"date"
        					},{
        						key:"carryitems",
        						name:"描述",
        					},{
        						key:"situation",
        						name:i18ns.get("sale_ship_owner","会员")+"情况",
        					},{
        						key:"registrant.name",
        						name:"登记人",
        					},{
        						key:"operate",
        						name:"操作",
        						format:"button",
        						formatparams:[{
        							key:"edit",	
        							icon:"edit",
        							handler:function(index,data,rowEle){
        								widget.hide(".J-visitGrid").show(".J-visitForm");
        								var form = widget.get("visitForm");
        								form.reset();
        								form.setData(data);
        								widget.get("visitForm").setValue("patientRegistration",widget.get("form").getValue("pkPatientRegistration"));
        							}
        						},{
        							key:"delete",	
        							icon:"remove",
        							handler:function(index,data,rowEle){
        								aw.del("api/visitedregistration/" + data.pkVisitedRegistration + "/delete",function(){
        									widget.get("visitGrid").refresh();
        								});
        							}
        						}]
        					}]
        				}
        			})
        			this.set("visitGrid",visitGrid);
                },
        		afterInitComponent : function(params,widget) {
        			if (params && params.pkFather) {
        				aw.ajax({
        					url : "api/patientregistration/query",
        					type : "POST",
        					data : {
        						pkPatientRegistration : params.pkFather,
        						fetchProperties:"checkInDate," +
                				"checkOutDate," +
                				"disease," +
                				"departmentsSickbed," +
                				"pkPatientRegistration," +
                				"status," +
                				"version," +
                				"remindStartTime," +
                				"accompanyType," +
                				"secretary.name," +
                				"afterTreatment," +
                				"dischargeDiagnosis," +
                				"doctorAdvised," +
                				"backDrug," +
                				"description," +
                				"registrant.name," +
                				"member.pkMember," +
                				"member.personalInfo.name," +
                				"member.memberSigning.room.number," +
                				"member.memberSigning.room.pkRoom," +
                				"member.memberSigning.room.building.pkBuilding," +
                				"secretary," +
                				"hospital.name" 
							},
        					success : function(result) {
        						widget.get("subnav").setValue("building",result[0].member.memberSigning.room.building.pkBuilding);
                				widget.get("subnav").setValue("status",result[0].status.key);
        						widget.get("grid").setData(result);
        					}
        				});
        			}else if(params.flg=="transferregistration"&&params.pkBuilding&&params.pkMember&&params.status){
        				widget.get("subnav").setValue("building",params.pkBuilding);
        				widget.get("subnav").setValue("status",params.status);
        				this.get("grid").refresh();
        			} else {
        				this.get("grid").refresh();
        			}
            	 }
        });
        module.exports = patientregistration ;
});
