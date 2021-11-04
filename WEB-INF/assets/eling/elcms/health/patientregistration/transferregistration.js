define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var Json = require("json");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
 				"<div class='J-grid'></div>";
        var transferregistration  = ELView.extend({
        	events:{
			 "click .J-detail" : function(e){
				 var pkFather=$(e.target).attr("data-key2");
					this.openView({
						url:"eling/elcms/health/patientregistration/patientregistration",
						params:{
							pkFather:pkFather,
						},
						isAllowBack:true
					});
				}
		},
            attrs:{
            	template:template
            },
            initComponent:function(params,widget){
        			var subnav=new Subnav({
        				parentNode:".J-subnav",
        				model:{
        					title:i18ns.get("sale_ship_owner","会员")+"转诊记录",
        					items:[{
        						id : "searchMember",
        						type : "search",
        						placeholder : i18ns.get("sale_ship_owner","会员")+"名称/房间号",
        						handler : function(str){
            						var g=widget.get("grid");
            						g.loading();
            						aw.ajax({
            							url:"api/patientregistration/searchtransferreport",
            							data:{
            								s:str,
            								"member.statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
         								    "member.memberSigning.status":"Normal",
         									"member.memberSigning.houseingNotIn" : false,
         								    "isTransfer":"true",
            								searchProperties:"member.personalInfo.name,"+
            						          "member.memberSigning.room.number",
            						        fetchProperties:"pkMember," +
                              				"nameAndRoom," +
                              				"sex," +
                              				"telephone," +
                              				"pkHealthData," +
                              				"firstClassHospitals," +
                              				"thirdClassHospitals," +
                              				"pkPatientRegistration," +
                              				"hospitalName," +
                              				"checkInDate," +
                              				"tipDate" ,
            							},
            							dataType:"json",
            							success:function(data){
            								g.setData(data);
            								
            							}
            						});
        						}
        					},{
        						id : "building",
        						type : "buttongroup",
        						tip:"楼号",
        						keyField : "pkBuilding",
        						valueField : "name",
        						url : "api/building/query",
        						lazy:true,
        						all : {
        							show : true
        						},
        						params : function(){
        							return {
        								"useType":"Apartment",
        								fecthProperties:"pkBuilding,name"
        							};
        						},
        						handler : function(key,value){
        							widget.get("grid").refresh();
        						}
        					},{
        						id : "checkInDate",
        						type : "daterange",
        						//TODO:李晓晨修复daterange
//        						ranges : function(){
//        							return {
//        								"本月": [moment().startOf("month"), moment().endOf("month")]
//        							}
//        					        
//        						},
        						handler : function(time){
        							widget.get("grid").refresh();
        						},
        						tip : "住院日期"
        					},{
        						id : "return",
        						type : "button",
        						text : "返回",
        						show:false,
        						handler : function(){
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							form.reset();
        							$(".J-secretary").parent().parent().addClass("hidden");
        							widget.hide([".J-form",".J-visitGrid"]).show(".J-grid");
        							subnav.hide(["return"]).show(["building","status"]);
        						}
        					},{

        						id : "toexcel",
        						type : "button",
        						text : "导出",
        						handler : function(){ 
        							var subnav=widget.get("subnav");
        							window.open("api/patientregistration/transferreporttoexcel?checkInDate="+subnav.getValue("checkInDate").start+
                                			"&checkInDateEnd="+subnav.getValue("checkInDate").end+
                                			"&member.memberSigning.room.building="+subnav.getValue("building")+
                                			"&member.statusIn=Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized"+
            								"&member.memberSigning.status=Normal&member.memberSigning.houseingNotIn=false&isTransfer=true"
        									);
        								return false;
        		 					}
        					
        					}]
        				}
    				});
        			this.set("subnav",subnav);
            		
                    var grid=new Grid({
                    	parentNode:".J-grid",
                    	autoRender : false,
                        model:{
                        	url : "api/patientregistration/querytransferreport",
                        	params:function(){
                        		var subnav=widget.get("subnav");
                        		return {
                        			"checkInDate":subnav.getValue("checkInDate").start,
                        			"checkInDateEnd":subnav.getValue("checkInDate").end,
                        			"member.memberSigning.room.building":subnav.getValue("building"),
                        			"member.statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
    								"member.memberSigning.status":"Normal",
 									"member.memberSigning.houseingNotIn":false,
                            		"isTransfer":"true",
                            		fetchProperties:"pkMember," +
                            				"nameAndRoom," +
                            				"sex," +
                            				"telephone," +
                            				"pkHealthData," +
                            				"firstClassHospitals," +
                            				"thirdClassHospitals," +
                            				"pkPatientRegistration," +
                            				"hospitalName," +
                            				"checkInDate," +
                            				"tipDate" ,
                        		};
                        	},
                            columns:[{
                            	name:"nameAndRoom",
        						label:i18ns.get("sale_ship_owner","会员"),
        						col:1,
        						format:function(value,row){
        							return "<a href='javascript:void(0);' style='color:red;' class='J-detail' data-key='"+row.pkMember+"'  data-key2='"+row.pkPatientRegistration+"' >"+value+"</a>";
        						}
                            },{
            					name:"sex",
        						label:"性别",
        						col:1,
        					},{
        						name:"telephone",
        						label:"联系方式",
        						col:1,
        					},{
        						name:"firstClassHospitals",
        						label:"一级定点医院",
        						col:2,
        					},{
        						name:"thirdClassHospitals",
        						label:"三级定点医院",
        						col:2,
        					},{
        						name:"hospitalName",
        						label:"转诊医院",
        						col:2,
        					},{
        						name:"checkInDate",
        						label:"住院日期",
        						col:1,
        						format:"date"
        					},{
        						name:"tipDate",
        						label:"提醒日期",
        						format:"date",
        						col:1,
        					}]
        				}
                    });
                    this.set("grid",grid);
                },
                setEpitaph:function(){
        			var subnav=this.get("subnav");
        			return {
        				pkBuilding:subnav.getValue("building"),
        				time:subnav.getValue("checkInDate").start,
        				timeEnd:subnav.getValue("checkInDate").end,
        			};
        		},
                afterInitComponent : function(params,widget) {
                	var subnav = widget.get("subnav");
                	if(params&&params.time){
                		widget.get("subnav").load("building",{
                    		callback:function(){
                    			widget.get("subnav").setValue("building",params.pkBuilding);
                    			widget.get("subnav").setValue("checkInDate",{
                                     start : params.time,
                                     end : params.timeEnd
                                 });
                    			widget.get("grid").refresh();
                    		}
                    	});
                	}else{
                		widget.get("subnav").load("building",{
                    		callback:function(){
                    			widget.get("grid").refresh();
                    		}
                    	});
                	}
                	//重新设置subnav上日期范围的ranges
                	//TODO：李晓晨修复daterange
                	$(".ranges ul li").eq(0).addClass("hidden");
                	$(".ranges ul li").eq(1).addClass("hidden");
            	 }
        });
        module.exports = transferregistration ;
});
