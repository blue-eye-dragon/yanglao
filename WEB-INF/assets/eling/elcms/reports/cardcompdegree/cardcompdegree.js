/**
 * 一卡通注册情况汇总报表
 */
define(function(require,exports,module){
	var BaseView=require("baseview");
	
	var CardCompDegree=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"一卡通注册情况汇总报表",
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/cardcompdegree"
			};
		}
	});
	
	module.exports=CardCompDegree;
});