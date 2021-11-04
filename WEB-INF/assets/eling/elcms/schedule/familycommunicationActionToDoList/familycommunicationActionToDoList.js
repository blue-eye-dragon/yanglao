define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	require("../../grid_css.css");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>";
	var Service = ELView.extend({
		attrs:{
            template:template
		},
		 events:{},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"本月未沟通",
					items :[{
						id:"toexcel",
						type:"button",
						text:"导出",
						handler:function(){
								 window.open("api/familycommunication/queryUncommunictionMemberDetailToexcel?recordDate="+params.recordDate+
										 "&recordDateEnd="+params.recordDateEnd+
										 "&memberSigning.room.building.pkBuilding="+params.pkBuilding+
										 "&member.memberSigning.room.building.pkBuilding="+params.pkBuilding+
										 "&statusIn="+params.statusIn);
								 return false;
						}
					}],
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url:"api/familycommunication/queryUncommunictionMemberDetail",
					params:function(){
						return {
						recordDate: params.recordDate,
						recordDateEnd: params.recordDateEnd,
						"memberSigning.room.building.pkBuilding" : params.pkBuilding,
						"member.memberSigning.room.building.pkBuilding" : params.pkBuilding,
						statusIn: "Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
						fetchProperties:"name," +
							"sex," +
							"age," +
							"relatives,"+
							"relation"
						}
					},
					head:{
						title : "未沟通会员明细",
					},
					columns : [{
						name : "name",
						label : "姓名",
						className:"oneHalfColumn",
					},{
						name :  "sex",
						label : "性别",
						className:"oneHalfColumn",
					},{
						name : "age",
						label : "年龄",
						className:"oneHalfColumn",
					},{
						name : "relatives",
						label : "家属",
						className:"oneHalfColumn",
					},{
						name : "relation",
						label : "关系",
					}]
				}
			});
			this.set("grid",grid);
		},
	});
	module.exports = Service;
});
