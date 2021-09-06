 define(function(require,exports,module){
	var Grid = require("grid");
	var saveCardGrid={
			init:function(widget,params){
				return new Grid({
	        		parentNode:params.parentNode,
					model:{
						id:"saveCardGrid",
						url:"api/checkroomsavecarddetail/query", 
						className : "text-center",
						params : function(){
							var subnav=widget.get("subnav");
							return {
								pkBuilding:subnav.getValue("building"),
								start:moment(subnav.getValue("date").start).format("YYYY-MM-DD"),
								end :moment(subnav.getValue("date").end).format("YYYY-MM-DD")
							}
						},
						columns:[{
							name:"applyDate",
							label:"申请日期"
						},{
							name:"roomNumber",
							label:"房号"
						},{
							name:"roomType",
							label:"房型"
						},{
							name:"card",
							label:"卡号"
						},{
							name:"equitys",
							label:"权益人"
						},{
							name:"members",
							label:"会员"
						},{
							name:"membersAge",
							label:"会员年龄"
						},{
							name:"annualFees",
							label:"年费标准"
						},{
							name:"realAnnualFees",
							label:"实际年费"
						},{
							name:"annualFeesBegin",
							label:"年费起算日期"
						},{
							name:"annualFeesEnd",
							label:"年费到期日期"
						},{
							name:"checkoutDate",
							label:"退房日期"
						},{
							name:"realcheckoutDate",
							label:"实际离房日期"
						},{
							name:"annualCheckOutFee",
							label:"年费结转（退）金额"
						},{
							name:"checkouReason",
							label:"退房原因"
						},{
							name:"description",
							label:"备注"
						},{
							name:"checkoutMonth",
							label:"完成当月"
						}]
					},
				});
			}
		}
	module.exports=saveCardGrid  ;
})


