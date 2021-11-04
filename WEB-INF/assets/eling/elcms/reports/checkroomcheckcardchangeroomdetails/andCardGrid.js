 define(function(require,exports,module){
	var Grid = require("grid");
	var andCardGrid={
			init:function(widget,params){
				return new Grid({
	        		parentNode:params.parentNode,
					model:{
						id:"andCardGrid",
						url:"api/checkroomandcarddetail/query", 
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
							name:"signupDate",
							label:"签约日期"
						},{
							name:"checkinDate",
							label:"入住日期"
						},{
							name:"checkoutDate",
							label:"退房日期"
						},{
							name:"checkoutcardDate",
							label:"退卡日期"
						},{
							name:"checkoutcardMonth",
							label:"退卡周期/月"
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
							name:"membersSex",
							label:"性别"
						},{
							name:"membersAge",
							label:"会员年龄"
						},{
							name:"membersPhone",
							label:"电话、手机"
						},{
							name:"cardType",
							label:"卡型"
						},{
							name:"roomNumber",
							label:"房号"
						},{
							name:"roomType",
							label:"房型"
						},{
							name:"annualFees",
							label:"年费标准（万）"
						},{
							name:"cardFees",
							label:"卡费（万）"
						},{
							name:"saleUser",
							label:"销售员"
						},{
							name:"checkoutCardReason",
							label:"退卡原因"
						},{
							name:"realChectoutFees",
							label:"实际退卡金额"
						},{
							name:"complete",
							label:"完成情况"
						},{
							name:"completeMonth",
							label:"完成当月"
						}]
					},
				});
			}
		}
	module.exports=andCardGrid  ;
})


