 define(function(require,exports,module){
	var Grid = require("grid");
	var changeGrid={
			init:function(widget,params){
				return new Grid({
	        		parentNode:params.parentNode,
					model:{
						id:"changeGrid",
						url:"api/changeroomdetail/query", 
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
							name:"equitys",
							label:"权益人"
						},{
							name:"members",
							label:"会员"
						},{
							name:"card",
							label:"卡号"
						},{
							name:"oldRoomNumber",
							label:"原房号"
						},{
							name:"oldRoomType",
							label:"户型"
						},{
							name:"oldAnnualFees",
							label:"年费标准"
						},{
							name:"newRoomNumber",
							label:"所换房号"
						},{
							name:"newRoomType",
							label:"户型"
						},{
							name:"newAnnualFees",
							label:"年费标准"
						},{
							name:"applyDate",
							label:"申请换房日期"
						},{
							name:"realChangeDate",
							label:"实际换房日期"
						},{
							name:"changeReason",
							label:"换房原因"
						},{
							name:"description",
							label:"备注"
						},{
							name:"completeMonth",
							label:"完成当月"
						}]
					},
				});
			}
		}
	module.exports=changeGrid  ;
})


