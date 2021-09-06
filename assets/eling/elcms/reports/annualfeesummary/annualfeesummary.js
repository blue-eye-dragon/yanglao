/**
 * 服务费年度汇总
 */

define(function(require,exports,module){
	var BaseView=require("baseview");
	
	var AnnualfeeSummary=BaseView.extend({
		initSubnav:function(widget){
			var items=[];
			for(var i=0;i<=parseInt(moment().format("YYYY"))+5-2005;i++){
				var obj={};
				obj.key=2005+i;
				obj.value=2005+i;
				items.push(obj);
			}
			return {
				model:{
					title:"服务费年度汇总表",
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"year",
						items:items,	
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				autoRender:false,
				url:"api/report/annualfeesummary",
				params:function(){
					return {
						year:widget.get("subnav").getValue("year"),
						pkBuilding:widget.get("subnav").getValue("building")
					};
				}
			};
		},afterInitComponent:function(params,widget){
			widget.get("subnav").setValue("year",parseInt(moment().format("YYYY")));
			widget.get("list").refresh();
		}
	});
	
	module.exports=AnnualfeeSummary;
});