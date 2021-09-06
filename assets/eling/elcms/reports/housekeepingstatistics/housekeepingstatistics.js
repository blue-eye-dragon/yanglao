/*
 * 保洁统计表 
 */
define(function(require,exports,module){
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var housekeepingstatistics = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+
			         "<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			//subnav
			var subnav = new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"保洁统计表",
					time:{
						click:function(time){
							widget.get("grid").refresh();
						}
					}
				}
			});
			this.set("subnav",subnav);
			
			//grid
			var grid = new ReportGrid({
				parentNode:".J-list",
				url:"api/report/housekeepingstatistics",
				params:function(){
					var time=widget.get("subnav").getValue("time");
					return{
						start:time.start,
						end:time.end
					};
				},
				model:{
					datas : {
						id:"count"
					}
				}
			});
			this.set("grid",grid);
		}
	});
	module.exports=housekeepingstatistics;
});