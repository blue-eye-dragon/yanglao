/**
 * 服务费月报明细
 */
define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Dialog=require("dialog-1.0.0"); 
    var aw = require("ajaxwrapper");
    var params = null;
    var times = 0;
	var AnnualFeeMonthReport = BaseView.extend({
		events:{
			"change .J-btngroup-chargeStatus" : function(e){
				params.chargeStatus = widget.get("subnav").getValue("chargeStatus");
			}
		},
		initSubnav:function(widget){
		    params = widget.get("params") || {};
		    times=0;
			var min=moment().format("YYYY年MM月服务费明细");
			var years=[];
			for(var i=0;i<=moment().year()+5-2010;i++){
				var obj={};
				obj.key=2010+i;
				obj.value=2010+i;
				years.push(obj);
			}
			var months=[{
						key:01,value:"一月"
					},{
						key:02,value:"二月"
					},{
						key:03,value:"三月"
					},{
						key:04,value:"四月"
					},{
						key:05,value:"五月"
					},{
						key:06,value:"六月"
					},{
						key:07,value:"七月"
					},{
						key:08,value:"八月"
					},{
						key:09,value:"九月"
					},{
						key:10,value:"十月"
					},{
						key:11,value:"十一月"
					},{
						key:12,value:"十二月"
					}];
			var buttonGroup=[{
				   id:"building",
				   showAllFirst:true,
				   showAll:true,
				   handler:function(key,element){
						   widget.get("list").refresh();
					   }  
			   },{
		   		    id:"chargeStatus",
		   			showAll:true,
		   			showAllFirst:true,
					items:[{
						key:"UnCharge",
						value:"未收费"
					},{
						key:"Charged",
						value:"已收费"
					},{
						key:"Receiving",
						value:"已到账"
					}],
					handler:function(key,element){								
						widget.get("list").refresh();
					}
					},{
				   id:"year",
				   items:years,	
				   handler:function(key,element){
					   widget.get("list").refresh();
					   var year = widget.get("subnav").getValue("year");
					   var month = widget.get("subnav").getValue("month");
					   var monthFirstDay= year + "-" +month;
					   var title=moment(monthFirstDay).format("YYYY年MM月服务费明细");
					   widget.get("subnav").setTitle(title);
				   }
			   },{
				   id:"month",
				   items:months,	
				   handler:function(key,element){
					   widget.get("list").refresh();
					   var year = widget.get("subnav").getValue("year");
					   var month = widget.get("subnav").getValue("month");
					   var monthFirstDay= year + "-" +month;
					   var title=moment(monthFirstDay).format("YYYY年MM月服务费明细");
					   widget.get("subnav").setTitle(title);
				   }
			   }];
			return { 
				model:{
					title:min,
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/annualfees/search",
							data:{
								s:str,
								properties:"payer.memberSigning.room.number," +
										"payer.personalInfo.name,",
								fetchProperties:"*," +
										"payer.memberSigning.room.number," +
										"payer.personalInfo.name," +
										"operator.name," +
										"confirm.name," +
										"payer.personalInfo.mobilePhone," +
										"payer.personalInfo.phone"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.list2Card(false);
							}
						});
					},
					buttonGroup:buttonGroup,
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return{
				//url : params.chargeStatus == undefined || params.chargeStatus == ""?"api/annualfees/queryOrderByChargeStatus":"api/annualfees/queryByChargeStatus",
				url : "api/annualfees/queryByChargeStatus",
				params:function(){
/*					if(params.month == undefined && params.year == undefined){
						//把年份和月份拼起来
						var year = widget.get("subnav").getValue("year");
						var month = widget.get("subnav").getValue("month");
						var monthFirstDay= year + "-" +month;
						var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
						var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
						var chargeStatus = widget.get("subnav").getValue("chargeStatus");
					}else{*/
						//由统计表跳转到该页时
						if(times==0){//首次进到该页面时，状态用params的
							var year = params.year;
							var month = params.month;
							var monthFirstDay= year + "-" +month;
							var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
							var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
							var chargeStatus = params.chargeStatus;
							var building = params.pkBuilding;
						}else{//调整状态栏后，重新给状态赋值
							var chargeStatus = widget.get("subnav").getValue("chargeStatus");
							var year = widget.get("subnav").getValue("year");
							var month = widget.get("subnav").getValue("month");
							var monthFirstDay= year + "-" +month;
							var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
							var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
							var building = widget.get("subnav").getValue("building");
						}
						times ++;
//					}
					return {
						"chargeStatus":chargeStatus,
						"beginDate":moment(monthFirstDay).startOf("month").valueOf(),
						"beginDateEnd":moment(monthLastDay).endOf("month").valueOf(),
						"payer.memberSigning.room.building.pkBuilding":building,
						"payer.memberSigning.status":"Normal",
						"orderString":"endDate,payer.memberSigning.room.number",
						fetchProperties:"*," +
							"payer.memberSigning.room.number," +
							"payer.personalInfo.name," +
							"operator.name," +
							"confirm.name," +
							"payer.personalInfo.mobilePhone," +
							"payer.personalInfo.phone",
						};
				},
				model:{
					columns:[{
						key:"payer.memberSigning.room.number",
						name:"房间号"
					},{
						key:"payer.personalInfo.name",
						name:"付款人"
					},{
						key:"phone",
						name:"电话",
						format:function(row,value){
							if(value.payer.personalInfo){
								return  value.payer.personalInfo.mobilePhone||""+"/"+ value.payer.personalInfo.phone||"";
							}else{
								return "";
							}
						}
					},{
						key:"endDate",
						name:"到期日期",
						format:"date"
					},{
						key:"dueAnnualFees",
						name:"应收服务费"
					},{
						key:"realAnnualFees",
						name:"实收服务费"
					},{
						key:"chargeTime",
						name:"收费日期",
						format:"date"
					},{
						key:"operator.name",
						name:"经手人"
					},{
						key:"confirmTime",
						name:"到账日期",
						format:"date"
					},{
						key:"chargeStatus.value",
						name:"收费状态"
					}]
				}
			};
		},
		afterInitComponent:function(widget){
			if(params){
				//为标题栏赋值
				this.get("subnav").setValue("year",params.year);
				this.get("subnav").setValue("month",params.month);
				this.get("subnav").setValue("chargeStatus",params.chargeStatus);
				this.get("subnav").setValue("building",params.pkBuilding);
				var title=moment(params.year+"-"+params.month).format("YYYY年MM月服务费明细");
				this.get("subnav").setTitle(title);
			}else{
				this.get("subnav").setValue("year",moment().year());
				this.get("subnav").setValue("month",moment().month()+1);
				this.get("list").refresh();
			}
		}
	});
	module.exports = AnnualFeeMonthReport;
});
