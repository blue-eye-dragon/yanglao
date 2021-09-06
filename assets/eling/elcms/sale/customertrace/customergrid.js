/**
 * 意向客户追踪
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Grid=require("grid-1.0.0");
	var store = require("store");
	var activeUser = store.get("user");
	var customergrid = {
			init:function(widget,params){
				return new Grid({
            	parentNode:".J-CustomerGrid",
            	autoRender:false,
				url:"api/customer/query",
				fetchProperties:"*,cardType.pkMemberShipCardType,cardType.name",
 				params:function(){
 					var time=widget.get("subnav").getValue("time");
 					return { 
 						intention:widget.get("subnav").getValue("intentionQuery"), 
 						status:widget.get("subnav").getValue("statusQuery"),
 						cardType:widget.get("subnav").getValue("cardType"),
 						lastVisitDate:time.start,
 						lastVisitDateEnd:time.end,
						"orderString":"lastVisitDate:desc"
 					}; 
				},
				model:{					
					columns:[{
						key:"name",
						name:"姓名",
						format:"detail",
						className:"width_name",
 						formatparams:[{
 							key:"nameDetail",
							handler:function(index,data,rowEle){ 
								widget.get("customerForm").setData(data);
		        				$(".J-pkCustomer").attr("data-key",data.pkCustomer);
								widget.get("recordGrid").refresh();
								widget.show([".J-CustomerForm",".J-RecordGrid"]).hide([".J-CustomerGrid",".J-RecordForm"]);
								widget.get("subnav").show(["returnCustomer"]).hide(["search","returnRecord","newVisitRecord","intentionQuery","statusQuery","cardType","time"]);
							}
 						}]
					},{
						key:"phoneNumber",
						name:"联系电话",
						className:"width_phone"
					},{
						key:"intention.value",
						name:"意向",
						className:"width_int"
					},{
						key:"cardType.name",
						name:"意向卡类型",
						className:"width_card"
					},{
						key:"status.value",
						name:"状态",
						className:"width_status"
					},{
						key:"lastVisitDate",
						name:"最新来访时间",
						className:"width_visit",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
						key:"lastReturnDate",
						name:"最新回访时间",
						className:"width_return",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
						key:"operate",
						name : "操作",
						className:"width_op",
						format:"button",
						formatparams:[{
							key:"visit",
							text:"来访",
							handler:function(index,data,rowEle){
								$(".J-pkCustomer").attr("data-key",data.pkCustomer);
								widget._newRecord({key:"Visit",value:"来访"},widget,"returnCustomer");
							}
						},{
							key:"return",
							text:"回访",
							handler:function(index,data,rowEle){
								$(".J-pkCustomer").attr("data-key",data.pkCustomer);
								widget._newRecord({key:"Return",value:"回访"},widget,"returnCustomer");
							}
						}]
					}]
				}
            });
		}
	}

	module.exports = customergrid;	
});

