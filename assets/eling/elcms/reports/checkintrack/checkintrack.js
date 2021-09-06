define(function(require, exports, module) {
	var ElView=require("elview");
    var aw = require("ajaxwrapper");
    var Subnav = require("subnav");	
	var Grid=require("grid");
	var Dialog=require("dialog");
	var Form =require("form");
	var _ = require("underscore");
	var template=require("./checkintrack.tpl");
	
	var cache = {};
	

	function setTableData(model,aw,widget,memberShipCardNo){
		var search = widget.get("subnav").getValue("search");
		var status = widget.get("subnav").getValue("processStatus");
		var start = widget.get("subnav").getValue("signDate").start;
		var end = widget.get("subnav").getValue("signDate").end;
		var data ;
		if(memberShipCardNo){
			data = {
				"s":search,
				"status":status,
				"memberShipCardNo":memberShipCardNo,
				fetchProperties:"*"
			};
		} else {
			data = {
					"s":search,
					"status":status,
					"start":start,
					"end":end,
					"memberShipCardNo":memberShipCardNo,
					fetchProperties:"*"
				};
		}
		aw.ajax({
			url : "api/report/checkintrack",
			type : "POST",
			data : data,
			success : function(datas) {
				var data = {};
				data.length = datas.length;
				data.griddata = datas;
				model.data=data;
				widget.renderPartial(".J-grid-table");
			}
		});
	}	
	
	var CheckInTrack = ElView.extend({
		attrs:{
    		template:template,
    		model : {}
        },
        events:{
        	"click .J-checkintrack-ciimplement" : function(e){
        		var pkCheckInImplement = ($(e.target).attr("data-key")?$(e.target).attr("data-key"):-1);
        		this.openView({
        				url:"eling/elcms/checkin/confirm/confirm",
        				params:{
        					CheckInImplement : pkCheckInImplement
        				},
        				isAllowBack:true
        		});
                return false;
        	}
        },
		initComponent:function(params,widget){
			var model=this.get("model");
			
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"入住流程查询",
					items : [{
						id : "search",
						type : "search",
						placeholder : "卡号/权益人",
						handler : function(s){
							delete params.memberShipCardNo;
							setTableData(model,aw,widget);
							widget.renderPartial(".J-grid-table");
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
						id : "signDate",
						type : "daterange",
						tip : "签约日期",
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
							var start = widget.get("subnav").getValue("signDate").start;
							var end = widget.get("subnav").getValue("signDate").end;
							var URL = "api/checkintrack/toexcel?s="+s+"&status="+processStatus+"&schedulType=Secretary" +
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
				widget.get("subnav").setValue("signDate", time);
				setTableData(model,aw,widget,params.memberShipCardNo);
			} else {
				setTableData(model,aw,widget);
			}
			widget.renderPartial(".J-grid-table");
			
		},
		setEpitaph : function(){
			return {
				s : this.get("subnav").getValue("search"),
				processStatus : this.get("subnav").getValue("processStatus"),
				start : this.get("subnav").getValue("signDate").start,
				end : this.get("subnav").getValue("signDate").end,
			};
		}
	});
	module.exports = CheckInTrack;
});
