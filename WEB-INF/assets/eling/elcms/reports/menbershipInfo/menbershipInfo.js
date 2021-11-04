/**
 * 会员信息完善度查询-社区
 */
define(function(require,exports,module){
	var BaseView=require("baseview");
	
	var MemberInfoDegree=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"会员信息完成度报表",
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/menbershipinformation"
			};
		}
	});
	
	module.exports=MemberInfoDegree;
});