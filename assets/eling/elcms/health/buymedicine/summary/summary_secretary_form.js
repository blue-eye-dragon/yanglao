define(function(require,exports,module){
	var Form=require("form-2.0.0")
	var aw=require("ajaxwrapper");
	var utils={
		initComponent:function(widget){
			var secretaryForm=new Form({
				parentNode:".J-secretaryForm",
				saveaction:function(){
					aw.saveOrUpdate("api/buymedicineapplicationsummary/save",$("#buymedicineapplicationsummary").serialize(),function(){
						widget.hide([".J-secretaryForm"]).show([".J-grid"]);
						widget.get("subnav").hide(["return"]).show(["billcode","commit","transfer","secretaryArrange","print"]);
						widget.set("status","");
					});
				},
				cancelaction:function(){
					widget.hide([".J-secretaryForm"]).show([".J-grid"]);
					widget.get("subnav").hide(["return"]).show(["billcode","commit","transfer","secretaryArrange","print"]);
					widget.set("status","");
				},	
				model:{
					id:"buymedicineapplicationsummary",
					items:[{
						name:"pkBuyMedicineApplicationSummary",
						type:"hidden",
					},{
						name:"purchaser",
						key:"pkUser",
						value:"name",
						label:"代配药秘书",
						multi:true,
						url:"api/user/role",//TODO 用户角色：wulina 秘书
        				params:{
        					roleIn:"6,11,12,18,19,20,21",
							fetchProperties:"pkUser,name"
						}, 
						type:"select",
						validate:["required"]
					},{
						name:"principal",
						key:"pkUser",
						label:"本次负责人",
						value:"name",
						type:"select",
						validate:["required"]
					}]
				}
			});
			return secretaryForm;
		}
	};
	
	module.exports=utils;
});