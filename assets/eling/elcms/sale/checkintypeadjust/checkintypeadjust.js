/**
 * 入住类型调整（“选房不入住/买卡不选房”调整为“入住”）
 * chenJF
 */
define(function(require,exports,module){
	var ELView =require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var store = require("store");
	var activeUser = store.get("user");
	//引入导航条，列表等组件
	var ComponentProperties = require("./assets/componentproperties");
	var template="<div class = 'el-checkintypeadjust'>"+
	 "<div class = 'J-subnav'></div>"+
	 "<div class = 'J-grid'></div>"+
	 "<div class = 'J-form hidden'></div>"+
	 "<div class = 'J-detailForm hidden'></div>"+
	 "</div>";
	var checkintypeadjust=ELView.extend({
		attrs:{
        	template:template
        },
		events : {
			"change .J-form-form-select-membershipContract-memberAssessment" : function(e){
				var form = this.get("form");
				var pkmas = form.getValue("membershipContract.memberAssessment");
				if(pkmas==""||pkmas==null){
					form.setValue("assessmentStatus",null);
				} else {
					/*var memberAssessment = form.getData("membershipContract.memberAssessment",{
						pk:pkmas
					});*/
					var status="";
					var memberAssessment = form.getData("membershipContract.memberAssessment");
					for(var i=0;i<memberAssessment.length;i++){
						for(var j=0;j<pkmas.length;j++){
							if(memberAssessment[i].pkMemberAssessment == pkmas[j]){
								status+=memberAssessment[i].flowStatus.value+",";
							}
						}
					}
					status=status.substring(0,status.length-1);
					form.setValue("assessmentStatus",status);
				}
			}
		},
		initComponent:function(params,widget){
			//初始化导航条
			var subnav = ComponentProperties.getSubnav(widget);
			this.set("subnav",subnav);
			//初始化列表
			var grid = ComponentProperties.getGrid(widget);
			this.set("grid",grid);
			//初始化表单
			var form = ComponentProperties.getForm(widget);
			this.set("form",form);
			//初始化显示详情的表单
			var detailForm = ComponentProperties.getDetailForm(widget);
			this.set("detailForm",detailForm);
		}
	})
	module.exports = checkintypeadjust;
})