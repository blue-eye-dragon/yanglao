define(function(require, exports, module) {
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Form=require("form")
	var Dialog=require("dialog");
	var Grid = require("grid");
	var enmu = require("enums");
	require("./grid.css");
	var ComponentProperties={
		getSubnav : function(widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"入住类型调整",
					items:[{
						id:"searchs",
						type:"search",
						placeholder : "会籍卡号",
						handler : function(str) {
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/checkintypeadjust/search",
								data:{
									s : str,
									properties : "membershipContract.membershipCard.name",
									"orderString" : "adjustDate:desc",
									fetchProperties : "pCheckInTypeAdjust," +
							 		"membershipContract.pkMembershipContract,membershipContract.membershipCard.name," +
							 		"membershipContract.checkInType," +
							 		"membershipContract.signDate," +
							 		"membershipContract.room.pkRoom," +
							 		"membershipContract.room.number," +
							 		"membershipContract.memberAssessment.pkMemberAssessment," +
							 		"membershipContract.memberAssessment.assessmentNumber," +
							 		"membershipContract.memberAssessment.flowStatus," +
							 		"membershipContract.memberShipFees," +
							 		"originalCheckInType," +
							 		"adjustDate," +
							 		"operator.pkUser," +
							 		"operator.name," +
							 		"description," +
							 		"version",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
					},{
						id : "refresh",
						type : "button",
						text : "刷新",
						handler : function(time){
							widget.get("grid").refresh();
						},
					},{
						id : "createDateRange",
						type : "daterange",
						tip : "调整日期",
						ranges : {
							"今天": [moment().startOf("days"),moment().endOf("days")],
					        "本年": [moment().startOf("year"), moment().endOf("year")]
						},
						defaultRange : "本年",
						handler : function(time){
							widget.get("grid").refresh();
						},
					},{
						id : "add",
						type : "button",
						text : "新增",
						handler:function(){
							widget.get("subnav").hide(["createDateRange","searchs","add","refresh"]).show(["return"]);
							widget.show([".J-form"]).hide([".J-grid"]);
							widget.get("form").reset();
						}
					},{
						id : "return",
						type : "button",
						text : "返回",
						show : false,
						handler:function(){
							widget.get("subnav").show(["createDateRange","searchs","add","refresh"]).hide(["return"]);
							widget.hide([".J-form",".J-detailForm"]).show([".J-grid"]);
						}
					}]
				}
			});
			return subnav;
		},
		getGrid : function(widget){
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url : "api/checkintypeadjust/query",
					params:function(){
						 var subnav=widget.get("subnav");
						 return { 
							 "adjustDate" : subnav.getValue("createDateRange").start,
							 "adjustDateEnd" : subnav.getValue("createDateRange").end,
							 "orderString" : "adjustDate:desc",
							 fetchProperties : "pCheckInTypeAdjust," +
							 		"membershipContract.pkMembershipContract,membershipContract.membershipCard.name," +
							 		"membershipContract.checkInType," +
							 		"membershipContract.signDate," +
							 		"membershipContract.room.pkRoom," +
							 		"membershipContract.room.number," +
							 		"membershipContract.memberAssessment.pkMemberAssessment," +
							 		"membershipContract.memberAssessment.assessmentNumber," +
							 		"membershipContract.memberAssessment.flowStatus," +
							 		"membershipContract.memberShipFees," +
							 		"originalCheckInType," +
							 		"adjustDate," +
							 		"operator.pkUser," +
							 		"operator.name," +
							 		"description," +
							 		"version",
						 }
					},
					columns : [{
						name : "membershipContract.membershipCard.name",
                        label : "会籍卡号",
                        format:"detail",
                        className : "grid_10",
                        formatparams:{
                            key:"detail",
                            handler:function(index,data,rowEle){
                            	var detailForm = widget.get("detailForm");
                            	detailForm.setData(data);
                            	detailForm.setValue("cardNname",data.membershipContract.membershipCard.name);
                            	detailForm.setValue("roomNumber",data.membershipContract.room.number);
                            	detailForm.setValue("signDate",data.membershipContract.signDate);
                            	detailForm.setValue("memberShipFees",data.membershipContract.memberShipFees);
                            	detailForm.setValue("memberAssessment",data.membershipContract.memberAssessment);
                            	var memberAssessmentStatus = "";
        						for(var i=0;i<data.membershipContract.memberAssessment.length;i++){
        							if(i==data.membershipContract.memberAssessment.length-1){
        								memberAssessmentStatus += data.membershipContract.memberAssessment[i].flowStatus.value;
        							} else {
        								memberAssessmentStatus += data.membershipContract.memberAssessment[i].flowStatus.value +"、";
        							}
        						}
        						detailForm.setValue("assessmentStatus",memberAssessmentStatus);
                            	detailForm.setDisabled(true);
                            	widget.get("subnav").hide(["createDateRange","searchs","add","refresh"]).show(["return"]);
    							widget.show([".J-detailForm"]).hide([".J-grid"]);
                            }
                       }
					},{
						name : "originalCheckInType.value",
                        label : "原入住类型",
                        className : "grid_10",
					},{
						name : "membershipContract.signDate",
                        label : "签约日期",
                        format : "date",
                        className : "grid_10",
					},{
						name : "membershipContract.checkInType.value",
                        label : "调整后入住类型"
					},{
						name : "adjustDate",
                        label : "调整日期",
                        className : "grid_10",
                        format : "date"
					},{
						name : "description",
                        label : "备注",
                        className : "grid_40",
					},{
						name : "operator.name",
                        label : "经手人",
                        className : "grid_10",
					}]
				}
			});
			return grid;
		},
		getForm : function(widget){
			var form = new Form({
				parentNode:".J-form",
				model : {
					id : "form",
					saveaction : function(){
						var form = widget.get("form");
						var data = form.getData();
						Dialog.confirm({
							setStyle:function(){},
							content : "请确认：是否要将会籍卡号为"+form.getValue("membershipCard.name")+"，房间号为"+form.getPlugin("room").getText()+"的会籍签约入住类型由"+form.getPlugin("originalCheckInType").getText()+"调整成入住！(注：调整完成后，无法修改)",
							confirm:function(){
								data.membershipContract = form.getValue("pkMembershipContract");
								aw.saveOrUpdate("api/checkintypeadjust/savemembersigningstatus",aw.customParam(data),function(data){
									widget.get("subnav").show(["createDateRange","searchs","add","refresh"]).hide(["return"]);
									widget.hide([".J-form"]).show([".J-grid"]);
									widget.get("grid").refresh();
								})
							}
						});
					},
                    cancelaction : function(){
                    	widget.get("subnav").show(["createDateRange","searchs","add","refresh"]).hide(["return"]);
						widget.hide([".J-form"]).show([".J-grid"]);
                    },
                    items : [{
                    	name : "pkMembershipContract",
                        type : "hidden",
                    },{
                        name : "membershipCard.name",
                        label : "会籍卡号",
                        type:"autocomplete",
                        url:"api/membershipcontract/search",
    					keyField:"membershipCard.name",
    					queryParamName : "s",
    					useCache:false,
    					validate:["required"],
    					maxItemsToShow:10,
    					params:{
    						searchProperties : "membershipCard.name",
    						fetchProperties:"pkMembershipContract,signDate," +
    								"checkInType,room.pkRoom,room.number," +
    								"memberAssessment.pkMemberAssessment," +
    								"memberAssessment.assessmentNumber," +
    								"memberAssessment.flowStatus," +
    								"memberShipFees,membershipCard.name"
    					},
    					format : function(data,value){
							return data.membershipCard.name;
    					},
    					onItemSelect : function(data){//TODO autocomplete
    						var form = widget.get("form");
    						if(data.checkInType.key == "CheckIn"){
    							Dialog.alert({
    								content : data.membershipCard.name+"对应的入住类型为"+data.checkInType.value+",不能进行调整!"
    							 });
    							form.reset();
    							return false;
    						}else if(data.checkInType.key == "NotIn"){
    							form.getPlugin("room").setReadonly(false);
    							form.setValue("room",null);
    						}else{
    							form.setValue("room",data.room);
    							form.getPlugin("room").setReadonly(true);
    						}
    						//带出会籍签约相关的属性
    						form.setData(data);
    						form.setValue("originalCheckInType",data.checkInType.key);
    						form.setValue("membershipContract.memberAssessment",data.memberAssessment);
    						var memberAssessmentStatus = "";
    						for(var i=0;i<data.memberAssessment.length;i++){
    							if(i==data.memberAssessment.length-1){
    								memberAssessmentStatus += data.memberAssessment[i].flowStatus.value;
    							} else {
    								memberAssessmentStatus += data.memberAssessment[i].flowStatus.value +"、";
    							}
    						}
    						form.setValue("assessmentStatus",memberAssessmentStatus);
    					},
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                        name : "originalCheckInType",
                        label : "原入住类型",
                        type : "select",
                        readonly : true,
                        options : enmu["com.eling.elcms.sale.model.MembershipContract.CheckInType"],
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                    	name:"room",
						label:"房间号",
						readonly:true,
						type : "select",
						url:"api/room/query",
						keyField:"pkRoom",
						valueField:"number",
						validate:["required"],
						params:{
							status:"Empty",
							useType:"Apartment",
    						fetchProperties:"pkRoom," +
    								"number"
    					},
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name : "signDate",
						label : "签约日期",
						type : "date",
						readonly : true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
                    	name : "memberShipFees",
                        label : "会籍卡费",
                        readonly : true,
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
						name : "newCheckInType",
						label : "调整后入住类型",
						validate:["required"],
						type : "select",
                        options : enmu["com.eling.elcms.sale.model.MembershipContract.CheckInType"],
                        defaultValue : "CheckIn",
                        readonly : true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"membershipContract.memberAssessment",
						label:"评估单号",
						type:"select",
						key:"pkMemberAssessment",
						value:"assessmentNumber",
						url:"api/memberassessment/querynotcontract",
						multi:true,
						validate:["required"],
						params:function(){
							return {
								"flowStatus" : "Approved",
								fetchProperties:"room.status,pkMemberAssessment,assessmentNumber,room.number,room.pkRoom,flowStatus"
							};
						},
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                    	name : "assessmentStatus",
                        label : "评估状态",
                        readonly : true,
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                    	name : "adjustDate",
                        label : "调整日期",
                        type : "date",
                        validate:["required"],
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                    	name:"operator",
						label:"经手人",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/user/role?roleIn=3,17",//TODO 用户角色：wulina
						validate:["required"],
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                    	name : "description",
                        label : "备注",
                        type : "textarea",
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    }]
				}
			});
			return form;
		},
		getDetailForm : function(widget){
			var detailForm = new Form({
				parentNode:".J-detailForm",
				model : {
					id : "detailForm",
                    items : [{
                        name : "cardNname",
                        label : "会籍卡号",
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                        name : "originalCheckInType",
                        label : "原入住类型",
                        type : "select",
                        options : enmu["com.eling.elcms.sale.model.MembershipContract.CheckInType"],
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                    	name:"roomNumber",
						label:"房间号",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name : "signDate",
						label : "签约日期",
						type : "date",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
                    	name : "memberShipFees",
                        label : "会籍卡费",
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
						name : "membershipContract.checkInType",
						label : "调整后入住类型",
						validate:["required"],
						type : "select",
                        options : enmu["com.eling.elcms.sale.model.MembershipContract.CheckInType"],
                        defaultValue : "CheckIn",
                        readonly : true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"memberAssessment",
						label:"评估单号",
						type:"select",
						key:"pkMemberAssessment",
						value:"assessmentNumber",
						url:"api/memberassessment/querynotcontract",
						multi:true,
						params:function(){
							return {
								fetchProperties:"room.status,pkMemberAssessment,assessmentNumber,room.number,room.pkRoom,flowStatus"
							};
						},
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                    	name : "assessmentStatus",
                        label : "评估状态",
                        readonly : true,
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                    	name : "adjustDate",
                        label : "调整日期",
                        type : "date",
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                    	name:"operator",
						label:"经手人",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/user/role?roleIn=3,17",//TODO 用户角色：wulina
						validate:["required"],
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    },{
                    	name : "description",
                        label : "备注",
                        type : "textarea",
                        className:{
							container:"col-md-6",
							label:"col-md-4"
						}
                    }]
				}
			});
			return detailForm;
		}
	}
	module.exports=ComponentProperties;
})