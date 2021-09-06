
define(function(require, exports, module) {
	var EditGrid =require("editgrid");
	var aw = require("ajaxwrapper");
	var memberchange_membergrid = {
			init:function(params,widget){
					var membergrid=new EditGrid({
		         		parentNode:".J-membergrid",
		         		autoRender:false,
		  				model:{
		  					id : "membergrid",
		  					allowAdd:false,
		  					columns:[{
								name : "member.personalInfo.name",
								label : "会员",
							},{
		  						name:"changeTime",
		  						label:"变更时间",
		  						format:"date"
		  					},{
		  						name:"assessmentDetail.personalInfo.name",
		  						label:"变更后会员",
		  						editor:{
		  							name:"assessmentDetail",
		  							label:"评估单号",
		  							type:"select",
		  							keyField:"pkMemberAssessmentDetail",
		  							valueField:"personalInfo.name",
		  							url:"api/memberassessmentdetail/querynotuserd",
		  							params:function(){
		  								return {
		  									fetchProperties:"pkMemberAssessmentDetail,personalInfo.name,version"
		  								};
		  							},
		  							onEdit : function(editor,rowIndex,rowData){
									},
				  					onChange : function(editor,rowIndex,rowData){
										//更新模型
										rowData.assessmentDetail = editor.getData(editor.getValue());
										membergrid.update(rowIndex,rowData);
									}
		  						}
		  					}]
		  				}
		         	 });
					return membergrid;
			 }
	}
	module.exports = memberchange_membergrid;
});