define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid");
	var Form=require("form-2.0.0")
	var Json = require("json");
	//多语
	var i18ns = require("i18n");
	require("./visitedregistration.css");
	var template="<div class='el-visitedregistration'><div class='J-subnav'></div>"+
 				"<div class='J-grid'></div>"+ 
 				"<div class='J-form hidden'></div>"+
 				"<div class='J-visitGrid hidden'></div>"+
 				"<div class='J-visitForm hidden'></div></div>";
        var visitedregistration  = ELView.extend({
        	events :{
        		"blur .J-form-visitedregistration-date-visitDate ":function(e){
        			var visitDate=this.get("visitForm").getValue("visitDate");
    				var checkInDate=this.get("form").getValue("checkInDate");
    				if(moment(visitDate).format("YYYY-MM-DD")<moment(checkInDate).format("YYYY-MM-DD")){
    					Dialog.alert({
    							content : "探望日期不得在住院日期之前!"
    						 });
    					this.get("visitForm").setValue("visitDate",checkInDate);
         				return false;
    				}
        		}
        	},
            attrs:{
            	template:template
            },
            initComponent:function(params,widget){
        			var subnav=new Subnav({
        				parentNode:".J-subnav",
        				model:{
        					title:"住院探望",
        					search : function(str) {
        						var g=widget.get("grid");
        						g.loading();
        						aw.ajax({
        							url:"api/patientregistration/search",
        							data:{
        								s:str,
        								"member.statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
     								    "member.memberSigning.status":"Normal",
     									"member.memberSigning.houseingNotIn":false,
        								status:"BeInHospital",
        								searchProperties:"member.personalInfo.name,"+
        						          "member.memberSigning.room.number,"+
        						          "hospital.name,"+
        						          "departmentsSickbed,"+
        						          "disease",
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
	                        				"secretary," +
	                        				"hospital.name" 
        							},
        							dataType:"json",
        							success:function(data){
        								g.setData(data);
        								
        							}
        						});
        					},
        					buttonGroup:[{
        						id:"building",
        						showAll:true,
        						showAllFirst:true,
        						handler:function(key,element){
        							widget.get("grid").refresh();
        						}
            				},{
            					id:"orderString",
            					tip:"排序",
        						items:[{
        							key:"checkInDate:desc",
        							value:"住院时间"
        						},{
        							key:"member.memberSigning.room.number",
        							value:"房间号"
        						}],
        						handler:function(key,element){
        							widget.get("grid").refresh()
        						}
            				}],
        					buttons:[{
        						id:"return",
        						text:"返回",
        						show:false,
        						handler:function(){
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							form.reset();
        							widget.hide([".J-form",".J-visitGrid",".J-visitForm"]).show(".J-grid");
        							subnav.hide(["return"]).show(["building","orderString"]);
        						}
        					}],
        				}
    				});
        			this.set("subnav",subnav);
            		
                    var grid=new Grid({
                    	parentNode:".J-grid",
                    	url : "api/patientregistration/query",
                    	params:function(){
                    		var subnav=widget.get("subnav");
                    		return {
                    			pkBuilding:subnav.getValue("building"),
                    			"member.statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
								"member.memberSigning.status":"Normal",
								"member.memberSigning.houseingNotIn":false,
                        		status:"BeInHospital",
                        		orderString:subnav.getValue("orderString"),
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
                        				"secretary," +
                        				"hospital.name" 
                        				,
                    		};
                    	},
                        model:{
                            columns:[{
                            	key:"member.personalInfo.name",
                            	className:"member",
        						name:i18ns.get("sale_ship_owner","会员")
                            },{
                            	key:"member.memberSigning.room.number",
                            	className:"roomnumber",
        						name:"房间号"
        					},{
            					key:"disease",
            					className:"reason",
        						name:"入院原因"
        					},{
        						key:"checkInDate",
        						className:"checkInDate",
        						name:"住院日期",
        						format:"date"
        					},{
        						key:"checkOutDate",
        						className:"checkOutDate",
        						name:"预计出院日期",
        						format:"date"
        					},{
        						key:"hospital.name",
        						className:"hospitalname",
        						name:"医院名称"
        					},{
        						key:"departmentsSickbed",
        						className:"department",
        						name:"科室/床位"
        					},{
        						key:"status.value",
        						className:"status",
        						name:"住院状态"
        					},{
        						key:"operate",
        						className:"operate",
        						name:"操作",
        						format:"button",
        						formatparams:[{
        							key:"edit",
        							text:"探望",
        							handler:function(index,data,rowEle){
        								var form= widget.get("form");
	        							var subnav= widget.get("subnav");
	        							var visitGrid= widget.get("visitGrid");
	        							form.reset();
	        							form.setDisabled(true);
	        							data.checkInDate=data.checkInDate?moment(data.checkInDate).format("YYYY-MM-DD"):"";
	        							data.checkOutDate=data.checkOutDate?moment(data.checkOutDate).format("YYYY-MM-DD"):"";
	        							data.remindStartTime=data.remindStartTime?moment(data.remindStartTime).format("YYYY-MM-DD"):"";
										form.setData(data);
										visitGrid.refresh();
	        							widget.show([".J-form",".J-visitGrid"]).hide(".J-grid");
	        							subnav.show(["return"]).hide(["building","orderString"]);
	        							subnav.setValue("search","");
        							}
        						}]
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
        						label:"住院日期"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"checkOutDate",	
        						label:"预计出院日期"
        						
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
        						buttons:[{
        							id:"add",
        							icon:"icon-plus",
        							handler:function(){
        								widget.hide(".J-visitGrid").show(".J-visitForm");
        								widget.get("visitForm").reset();
        								widget.get("visitForm").setValue("patientRegistration",widget.get("form").getValue("pkPatientRegistration"));
        							}
        						}]
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
        						name:"携带物品",
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
        							icon:"icon-edit",
        							handler:function(index,data,rowEle){
        								widget.hide(".J-visitGrid").show(".J-visitForm");
        								var form = widget.get("visitForm");
        								form.reset();
        								form.setData(data);
        								widget.get("visitForm").setValue("patientRegistration",widget.get("form").getValue("pkPatientRegistration"));
        							}
        						},{
        							key:"delete",	
        							icon:"icon-remove",
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
        			
        			var visitForm=new Form ({
        				parentNode:".J-visitForm",
        				saveaction:function(){
        					aw.saveOrUpdate("api/visitedregistration/add",$("#visitedregistration").serialize(),function(data){
        						widget.show(".J-visitGrid").hide(".J-visitForm");
        						widget.get("visitGrid").refresh();
        					});
        				},
        				cancelaction:function(){
        					widget.get("visitForm").reset();
        					widget.show(".J-visitGrid").hide(".J-visitForm");
        				},
        				model:{
        					id:"visitedregistration",
        					validate:{
        						position:"bottom"
        					},
        					items:[{
        						name:"pkVisitedRegistration",
        						type:"hidden",
        					},{
        						name:"version",
        						defaultValue:"0",
        						type:"hidden"
        					},{
        						name:"patientRegistration",
        						type:"hidden"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"visitDate",	
        						label:"探望日期",
        						type:"date",
    							mode:"Y-m-d",
    							defaultValue:moment().valueOf(),
    							validate : [ "required" ]
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"visitors",
        						multi:true,
        						label:"探望人",
    							key:"pkUser",
    							value:"name",
    							url:"api/user/role",//TODO 用户角色：wulina 秘书
    	        				params:{
    	        					roleIn:"6,11,12,18,19,20,21",
    								fetchProperties:"pkUser,name"
    							},
    							type:"select",
    							validate : [ "required" ]
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"carryitems",
        						label:"携带物品"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"carFare",
        						validate : [ "money" ],
        						defaultValue:"0",
        						label:"交通费"
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"giftAllowance",
        						label:"礼品费用",
        						defaultValue:"0",
        						validate : [ "money" ]
        					},{
        						className:{
        							container:"col-md-6",
        							label:"col-md-4"
        						},
        						name:"situation",
        						label:i18ns.get("sale_ship_owner","会员")+"情况",
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
        			this.set("visitForm",visitForm);
        			
                }
        });
        module.exports = visitedregistration ;
});
