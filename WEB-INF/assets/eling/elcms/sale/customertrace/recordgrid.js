/**
 * 意向客户追踪
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Grid=require("grid-1.0.0");
	var recordgrid = {
			init:function(widget){
				return new Grid({
            	parentNode:".J-RecordGrid",
            	autoRender:false,
            	url:"api/contactrecord/query",
            	fetchProperties:"*,customer.*,visitWay.name,customer.cardType.name,creator.name",
            	params:function(){
 					var time=widget.get("subnav").getValue("time");
            		return{
            			"customer":$(".J-pkCustomer").attr("data-key"),
 						"visitDate":time.start,
 						"visitDateEnd":time.end,
            			"orderString":"visitDate:desc"
            		}
            	},
				model:{
					head:{
						title:"访问记录",
						buttons:[{
							id:"newVisit",
							text:"来访",
							handler:function(){
								widget._newRecord({key:"Visit",value:"来访"},widget,"returnRecord");
							}
						},{
							id:"newReturn",
							text:"回访",
							handler:function(){
								widget._newRecord({key:"Return",value:"回访"},widget,"returnRecord");
							}							
						}]
					},
					columns:[{
 						key:"visitDate",
						name:"访问时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						col:2
 					},{
 						key:"visitWay.name",
 						name:"访问方式",
 						col:1
 					},{
 						key:"type.value",
 						name:"访问类型",
 						col:1
 					},{
 						key:"customer.cardType.name",
 						name:"卡类型"	,
 						col:1
 					},{
 						key:"intention.value",
 						name:"本次意向",
 						col:1
 					},{
 						key:"content",
 						name:"沟通内容",
 						col:3
 					},{
 						key:"creator.name",
 						name:"记录人",
 						col:1
 					},{
 						key:"remindDate",
						name:"回访提醒时间",
						format : "date",
						col:1
 					},{
 						col:2,
						key:"operate",
						name : "操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("recordForm").reset();
								widget.get("recordForm").setData(data);
								widget.show([".J-RecordForm"]).hide([".J-CustomerGrid",".J-CustomerForm",".J-RecordGrid"]);
								widget.get("subnav").show(["returnRecord"]).hide(["search","newVisitRecord","intentionQuery","statusQuery","cardType","time","returnCustomer"]);	
							}
						}
//						,{
//							key:"delete",
//							icon:"remove",
//							handler:function(index,data,rowEle){
//								aw.del("api/contactrecord/" + data.pkContactRecord + "/delete",function(){
//		 	 						widget.get("recordGrid").refresh();
//		 	 					});
//							}						
//						}
						]			
 						
 					}]
				}
            });
        }
	}
	module.exports = recordgrid;	
});

