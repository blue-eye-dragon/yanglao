/**
 * 紧急求助统计
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog = require("dialog-1.0.0");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var emergencysummary = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"+"<div class='J-list2'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"紧急求助统计",
					buttons:[{
    					id:"refresh",
						text:"刷新",
						show:true,
						handler:function(){
							widget.get("grid").refresh();
		 					widget.get("grid2").refresh();
						}
					}],
					time:{
						tip:"求助时间",
		 				click:function(time){
		 					widget.get("grid").refresh();
		 					widget.get("grid2").refresh();
		 				}
					}
 			    }
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				autoRender : false,
				model:{
					datas : {
						id : "count",
						click : function(data){
							//点击单元格事件，data就是你查回来的本单元格对应的数据
							if(data.count == "0"){
								return ;
							}else{
								widget.openView({
									url:"eling/elcms/ward/emergencyrescue/emergencyrescue",
									params:{
										type:data.type,
										flowStatus:data.flowStatus,
										hospitalize:data.hospitalize,
										start : widget.get("subnav").getValue("time").start,
										end : widget.get("subnav").getValue("time").end
									},
									isAllowBack:true
								});
							}
						}
					}
				},
				parentNode:".J-list",
				url:"api/sos/summary",
				params:function(){
					return {
						"sosTime":widget.get("subnav").getValue("time").start,
						"sosTimeEnd":widget.get("subnav").getValue("time").end,
					};
				},
			});
			this.set("grid",grid);
			
			var grid2=new ReportGrid({
				autoRender : false,
				model:{
					datas : {
						id : "count",
						click : function(data){
							//点击单元格事件，data就是你查回来的本单元格对应的数据
							if(data.count == "0"){
								return ;
							}else{
								widget.openView({
									url:"eling/elcms/ward/emergencyrescue/emergencyrescue",
									params:{
										type1:data.type,
										flowStatus:data.flowStatus,
										hospitalize:data.hospitalize,
										start : widget.get("subnav").getValue("time").start,
										end : widget.get("subnav").getValue("time").end
									},
									isAllowBack:true
								});
							}
						}
					}
				},
				parentNode:".J-list2",
				url:"api/sos/summary2",
				params:function(){
					return {
						"sosTime":widget.get("subnav").getValue("time").start,
						"sosTimeEnd":widget.get("subnav").getValue("time").end,
					};
				},
			});
			this.set("grid2",grid2);
		},
		afterInitComponent:function(params,widget){
			Dialog.alert({
        		title:"提示",
        		showBtn:false,
        		content:"正在加载，请稍后……"
        	});
			if(params&&params.end){
				widget.get("subnav").setValue("time",{
					start:params.start,
					end:params.end
				});
			}
			aw.ajax({
				url : "api/sos/summary2",
				type : "POST",
				data : {
					"sosTime":widget.get("subnav").getValue("time").start,
					"sosTimeEnd":widget.get("subnav").getValue("time").end,
				},
				success:function(data){	
					widget.get("grid2")._setData(data);
				}
			});
			aw.ajax({
				url : "api/sos/summary",
				type : "POST",
				data : {
					"sosTime":widget.get("subnav").getValue("time").start,
					"sosTimeEnd":widget.get("subnav").getValue("time").end,
				},
				success:function(data){	
					Dialog.close();
					widget.get("grid")._setData(data);
				}
			});
//			widget.get("grid").refresh();
//			widget.get("grid2").refresh();
//			widget.element.find(".J-grid-table").append("<td class='J-date'><pre>合计</pre></td><td class='J-apportionMoney text-right'><pre>"+1+"</pre></td>");
		},setEpitaph : function(){
			return {
				start:this.get("subnav").getValue("time").start,
				end:this.get("subnav").getValue("time").end,
			};
		}
	});
	module.exports = emergencysummary;
});