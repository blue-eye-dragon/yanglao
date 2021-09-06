define(function(require,exports,module){
	var Form=require("form-2.0.0")
	var aw=require("ajaxwrapper");
	var utils={
		initComponent:function(widget){
			var secretaryForm=new Form({
				parentNode:".J-secretaryForm",
				saveaction:function(){
					aw.saveOrUpdate("api/accompanyhospitalizesummary/save",$("#accompanyHospitalizeSummary").serialize(),function(){
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
					id:"accompanyHospitalizeSummary",
					items:[{
						name:"pkAccompanyHospitalizeSummary",
						type:"hidden",
					},{
						name:"purchaser",
						key:"pkUser",
						value:"name",
						label:"代配药秘书",
						multi:true,
						url:"api/users",
						params:{
							role:6,
							fetchProperties:"name,pkUser"
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