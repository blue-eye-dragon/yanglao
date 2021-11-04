define(function(require,exports,module){
	var Form=require("form-2.0.0")
	var aw=require("ajaxwrapper");
	
	var BuyMedicineApp_form={
		init:function(widget){
			return new Form({
				parentNode:".J-form",													
				model:{
					id:"pkBuyMedicineApplication",
					defaultButton:false,
					items:[{
						name:"member",	
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",	
						label:"姓名",
						url:"api/member/query",
						params:function(){
							return {
								"memberSigning.room.building":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
						validate:["required"]					      
					},{
						name:"pkBuyMedicineApplication",
						type:"hidden"					
					},{
						name:"version",
						type:"hidden",
						defaultValue:0
					},{
						name:"buymedicinepapers",
						key:"pkPaperType",
						value:"name",
						label:"收取证件",
						type:"select",
						multi:true,
						url:"api/papertype/query",
						validate:["required"]
					},{
						name:"description",
						label:"备注",
					    type:"textarea"
					}]
				},
				cancelaction:function(){
					widget.show(".J-main-grid").hide(".J-form,.J-sub-grid");
				}
			});
		}
	};
	
	module.exports=BuyMedicineApp_form;
});