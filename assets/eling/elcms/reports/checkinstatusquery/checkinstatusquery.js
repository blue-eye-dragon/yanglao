define(function(require, exports, module) {
	var ElView=require("elview");
    var aw = require("ajaxwrapper");
    var Subnav = require("subnav");	
	var Grid=require("grid");
	
	var template =  "<div>"+
					"<div class='J-subnav'></div>"+
					"<div class='J-grid'></div>"+
					"</div>"
	
	var checkinstatusquery = ElView.extend({
		attrs:{
    		template:template,
    		model : {}
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会员入住状态查询",
					items : [{
						id : "search",
						type : "search",
						placeholder : "卡号",
						handler : function(str){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/checkinstatusquery/query",
								data:{
									s:str,
			                        fetchProperties:"*"
				                    
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
					},{
						id : "processDate",
						type : "daterange",
						tip : "办理日期",
						ranges : {
							"最近一年": [moment().subtract(11, 'month').startOf('month'),moment().endOf('month')],
						},
						defaultRange : "最近一年",
						minDate: "2015-01-01",
						maxDate: "2050-12-31",
						handler : function(time){
							widget.get("subnav").setValue("search","");
							widget.get("grid").refresh();
						}
					},{
						id:"toexcel",
						type : "button",
						text:"导出",
						handler:function(){ 
							var s = widget.get("subnav").getValue("search");
							var start = widget.get("subnav").getValue("processDate").start;
							var end = widget.get("subnav").getValue("processDate").end;
							window.open("api/checkinstatusquery/toexcel?s="+s+
									"&start="+start+"&end="+end);
							return false;
						}				
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				autoRender:false,
				model:{
					url : "api/checkinstatusquery/query",
                    params : function(){
                        return {
                        	s : widget.get("subnav").getValue("search"),
                        	start : widget.get("subnav").getValue("processDate").start,
                        	end : widget.get("subnav").getValue("processDate").end,
                        	fetchProperties : "*"
                        };
                    },
                    columns : [{
                    	name : "memberShipCardNo",
                        label : "会籍卡"
                    },{
                    	name : "checkInTrack.value",
                        label : "入住",
                        format:"detail",
    					formatparams:{
    						key:"checkInTrackDetail",
    						handler:function(index,data,rowEle){
    							widget.openView({
									url:"eling/elcms/reports/checkintrack/checkintrack",
									params:{
										memberShipCardNo : data.memberShipCardNo,
										start : widget.get("subnav").getValue("processDate").start,
			                        	end : widget.get("subnav").getValue("processDate").end,
			                        	processStatus : "Process"
									},
									isAllowBack:true
								});
    						}
    					}
                    },{
                    	name : "checkOutLivingTrack.value",
                        label : "退住",
                        format:"detail",
    					formatparams:{
    						key:"detail",
    						handler:function(index,data,rowEle){
    							widget.openView({
									url:"eling/elcms/reports/checkoutlivingtrack/checkoutlivingtrack",
									params:{
										memberShipCardNo : data.memberShipCardNo,
										start : widget.get("subnav").getValue("processDate").start,
			                        	end : widget.get("subnav").getValue("processDate").end,
			                        	processStatus : "Process"
									},
									isAllowBack:true
								});
    						}
    					}
                    },{
                    	name : "checkOutRoomTrack.value",
                        label : "退房",
                        format:"detail",
    					formatparams:{
    						key:"checkOutRoomTrackDetail",
    						handler:function(index,data,rowEle){
    							widget.openView({
									url:"eling/elcms/reports/checkoutroomtrack/checkoutroomtrack",
									params:{
										memberShipCardNo : data.memberShipCardNo,
										start : widget.get("subnav").getValue("processDate").start,
			                        	end : widget.get("subnav").getValue("processDate").end,
			                        	processStatus : "Process"
									},
									isAllowBack:true
								});
    						}
    					}
                    },{
                    	name : "checkOutRoomRepairTrack.value",
                        label : "退房维修",
                        format:"detail",
                        formatparams:{
    						key:"checkOutRoomRepairTrackDetail",
    						handler:function(index,data,rowEle){
    							widget.openView({
									url:"eling/elcms/reports/checkoutrepairtrack/checkoutrepairtrack",
									params:{
										memberShipCardNo : data.memberShipCardNo,
										start : widget.get("subnav").getValue("processDate").start,
			                        	end : widget.get("subnav").getValue("processDate").end,
			                        	processStatus : "Process"
									},
									isAllowBack:true
								});
    						}
    					}
                    },{
                    	name : "checkOutCardTrack.value",
                        label : "退卡",
                        format:"detail",
                        formatparams:{
    						key:"checkOutCardTrackDetail",
    						handler:function(index,data,rowEle){
    							widget.openView({
									url:"eling/elcms/reports/checkoutcardtrack/bowoutmembershipcontracttrack",
    								params:{
										memberShipCardNo : data.memberShipCardNo,
										start : widget.get("subnav").getValue("processDate").start,
			                        	end : widget.get("subnav").getValue("processDate").end,
			                        	processStatus : "Process"
									},
									isAllowBack:true
								});
    						}
    					}
                    }]
				}
			});
			this.set("grid",grid);
			
		},
		afterInitComponent:function(params,widget){
			if (params){				
				widget.get("subnav").setValue("search", params.s);
				var time = {};
				time.start = params.start;
				time.end = params.end;
				widget.get("subnav").setValue("processDate", time);
				widget.get("grid").refresh();
			} else {
				widget.get("grid").refresh();
			}
		},
		setEpitaph : function(){
			return {
				s : this.get("subnav").getValue("search"),
				start : this.get("subnav").getValue("processDate").start,
				end : this.get("subnav").getValue("processDate").end
			};
		}
	});
	module.exports = checkinstatusquery;
});
