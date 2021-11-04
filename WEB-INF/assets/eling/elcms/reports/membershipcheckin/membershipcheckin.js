/**
 * 会籍卡入住情况
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	//多语
	var i18ns = require("i18n");
	var MembershipCheckIn = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title: i18ns.get("reports_ship_title","会籍卡入住情况"),
					buttonGroup:[{}]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				autoRender : false,
				model:{
					datas : {
						id : "des",
					}
				},
				parentNode:".J-list",
				url:"api/report/membershipcontract1",
				params:function(){
					return {
					};
				},
			});
			this.set("grid",grid);
		},
		afterInitComponent:function(params,widget){
			widget.get("grid").refresh();
		},
	});
	module.exports = MembershipCheckIn;
});