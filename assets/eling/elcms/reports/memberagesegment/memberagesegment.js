define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var Grid=require("simplereportgrid");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var memberagesegment = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		afterInitComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"年龄段统计"
				}
			});
			aw.ajax({
				url:"api/report/memberagesegment",
				dataType:"json",
				success:function(data){
					var head=["楼号"];
					for(var i=0;i<6;i++){
						head=head.concat(["男"+i18ns.get("sale_ship_owner","会员")+"数量","男"+i18ns.get("sale_ship_owner","会员")+"比例","女"+i18ns.get("sale_ship_owner","会员")+"数量","女"+i18ns.get("sale_ship_owner","会员")+"比例"]);
					}
					head.push(i18ns.get("sale_ship_owner","会员")+"总数");
					data.head=head;
					
					var grid=new Grid({
						parentNode:".J-list",
						model:{
							exColumns:[{
								colspan:1
							},{
								name:"50-59",
								colspan:4
							},{
								name:"60-69",
								colspan:4
							},{
								name:"70-79",
								colspan:4
							},{
								name:"80-89",
								colspan:4
							},{
								name:"90-99",
								colspan:4
							},{
								name:"100以上",
								colspan:4
							},{
								colspan:1
							}]
						}
					});
					grid.setData(data);
					widget.set("list",grid);
				}
			});
		}
	});
	module.exports = memberagesegment;
});