define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var Grid=require("simplereportgrid");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var memberqualification = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		afterInitComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"学历状态统计"
				}
			});
			aw.ajax({
				url:"api/report/memberqualifications",
				dataType:"json",
				success:function(data){
					var head=["楼号"];
					for(var i=0;i<11;i++){
						head=head.concat([i18ns.get("sale_ship_owner","会员")+"总数","男"+i18ns.get("sale_ship_owner","会员")+"数量","男"+i18ns.get("sale_ship_owner","会员")+"比例","女"+i18ns.get("sale_ship_owner","会员")+"数量","女"+i18ns.get("sale_ship_owner","会员")+"比例"]);
					}
//					head.push("合计");
					data.head=head;
					
					var grid=new Grid({
						parentNode:".J-list",
						model:{
							exColumns:[{
								colspan:1
							},{
								name:"小学",
								colspan:5
							},{
								name:"中学",
								colspan:5
							},{
								name:"中专",
								colspan:5
							},{
								name:"高职",
								colspan:5
							},{
								name:"大专",
								colspan:5
							},{
								name:"大本",
								colspan:5
							},{
								name:"硕士",
								colspan:5
							},{
								name:"博士",
								colspan:5
							},{
								name:"无学历",
								colspan:5
							},{
								name:"其他",
								colspan:5
							},{
								name:"合计",
								colspan:5
							}]
						}
					});
					grid.setData(data);
					widget.set("list",grid);
				}
			});
		}
	});
	module.exports = memberqualification;
});