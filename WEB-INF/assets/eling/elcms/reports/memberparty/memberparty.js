/**
 * 会员党派统计
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	//多语
	var i18ns = require("i18n");
	var ReportGrid=require("reportgrid");
	var MembershipCheckIn = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					//title:"会员党派统计",
					title:i18ns.get("sale_ship_owner","会员")+"党派统计",
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
				url:"api/report/memberparty",
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