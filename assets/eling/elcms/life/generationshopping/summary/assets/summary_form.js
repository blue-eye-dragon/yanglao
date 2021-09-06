define(function(require,exports,module){
	var Form=require("form-2.0.0")
	var aw=require("ajaxwrapper");
	
	var Summary_form={
		init:function(params,widget){
			return new Form({
				parentNode:".J-form",
				saveaction:function(){
					aw.saveOrUpdate("api/generationshoppingapplicationsummary/save",$("#generationshoppingapplicationsummary").serialize(),function(data){
						widget.show(".J-grid").hide(".J-form");
						widget.get("subnav").hide(["return"]).show(["print","secretaryArrange","billcode","commit","showUnSummary"]);
						//设置title负责人
//						var grid=widget.get("grid");
//						var form=widget.get("form");
//						var principal=form.getData("principal",{
//							pk:data.principal.pkUser
//						});
//						grid.setTitle(grid.getTitle().split("（")[0]+"（负责人："+principal.name+"）");
					});
				},
				cancelaction:function(){
					widget.show(".J-grid").hide(".J-form");
					widget.get("subnav").hide(["return"]).show(["print","secretaryArrange","billcode","commit","showUnSummary"]);
				},
				model:{
					id:"generationshoppingapplicationsummary",
					items:[{
						name:"pkGenerationShoppingApplicationSummary",
						type:"hidden"
					},{
						name:"purchaser",
						key:"pkUser",
						value:"name",
						label:"代购物秘书",
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
		}	
	};
	
	module.exports=Summary_form;
});