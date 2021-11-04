define(function(require, exports, module) {
	var ElView=require("elview");
    var aw = require("ajaxwrapper");
    var Subnav = require("subnav");	
	var Grid=require("grid");
	var _ = require("underscore");
	var template=require("./assets/checkoutlivingtrack.tpl");
	
	var cache = {};
	

	function setTableData(model,aw,widget,memberShipCardNo){
		var search = widget.get("subnav").getValue("search");
		var status = widget.get("subnav").getValue("processStatus");
		var start = widget.get("subnav").getValue("createDate").start;
		var end = widget.get("subnav").getValue("createDate").end;
		aw.ajax({
			url : "api/report/checkoutlivingtrack",
			type : "POST",
			data : {
				"s":search,
				"status":status,
				"start":start,
				"end":end,
				"memberShipCardNo":memberShipCardNo,
				fetchProperties:"*"
			},
			success : function(datas) {
				var data = {};
				data.length = datas.length;
				data.griddata = datas;
				model.data=data;
				widget.renderPartial(".J-grid-table");
			}
		});
	}	
	
	var checkoutlivingtrack = ElView.extend({
		attrs:{
    		template:template,
    		model : {}
        },
		initComponent:function(params,widget){
			var model=this.get("model");
			
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"退住查询",
					items : [{
						id : "search",
						type : "search",
						placeholder : "卡号",
						handler : function(s){
							setTableData(model,aw,widget);
							widget.renderPartial(".J-grid-table");
							delete params.memberShipCardNo;
						}
					},{
						id : "processStatus",
						type : "buttongroup",
						tip : "办理状态",
						items : [{
							key : "Process",
							value : "办理中"
						},{
							key : "Finished",
							value : "已完成"
						}],
						handler : function(key,text){
							delete params.memberShipCardNo;
							widget.get("subnav").setValue("search","");
							setTableData(model,aw,widget);
							widget.renderPartial(".J-grid-table");
						}
					},{
						id : "createDate",
						type : "daterange",
						tip : "申请日期",
						ranges : {
							"最近一年": [moment().subtract(11, 'month').startOf('month'),moment().endOf('month')],
						},
						defaultRange : "最近一年",
						minDate: "2015-01-01",
						maxDate: "2050-12-31",
						handler : function(time){
							delete params.memberShipCardNo;
							widget.get("subnav").setValue("search","");
							setTableData(model,aw,widget);
							widget.renderPartial(".J-grid-table");
						}
					},{
						id:"toexcel",
						type : "button",
						text:"导出",
						handler:function(){ 
							var s = widget.get("subnav").getValue("search");
							var processStatus = widget.get("subnav").getValue("processStatus");
							var start = widget.get("subnav").getValue("createDate").start;
							var end = widget.get("subnav").getValue("createDate").end;
							var URL = "api/report/checkoutlivingtracktoexcel?s="+s+"&status="+processStatus+"&schedulType=Secretary" +
							"&start="+start+"&end="+end;
							if (params && params.memberShipCardNo) {
								URL += "&memberShipCardNo=" + params.memberShipCardNo;
							}
							window.open(URL);
							return false;
						}				
					}]
				}
			});
			this.set("subnav",subnav);
			
		},
		afterInitComponent:function(params,widget){
			var model=widget.get("model");
			var params = widget.get("params");
			if (params){				
				widget.get("subnav").setValue("search", params.s);
				widget.get("subnav").setValue("processStatus", params.processStatus);
				var time = {};
				time.start = params.start;
				time.end = params.end;
				widget.get("subnav").setValue("createDate", time);
				setTableData(model,aw,widget,params.memberShipCardNo);
			} else {
				setTableData(model,aw,widget);
			}
			widget.renderPartial(".J-grid-table");
		},
	});
	module.exports = checkoutlivingtrack;
});
