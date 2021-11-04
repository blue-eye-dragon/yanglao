define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var MedicalInsurancetype = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"权益人情况报表",
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/ownerinfocompdegree"
			};
		}
	});
	module.exports = MedicalInsurancetype;
});