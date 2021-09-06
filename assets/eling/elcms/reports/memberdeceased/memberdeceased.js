define(function(require,exports,module){
	var BaseView=require("baseview");
	
	var MemberAverageAge=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"历史过世会员统计",
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/memberdeceased"
			};
		}
	});
	
	module.exports=MemberAverageAge;
});