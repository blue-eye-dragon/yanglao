define(function(require, exports, module) {
	var BaseView=require("baseview");
	var MedicalInsurancetype = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"性格类型"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/charactertype/query",
				model:{
					columns:[{
						key:"name",
						name:"性格类型",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
							}
						}]
					},{
						key:"description",
						name:"性格类型描述"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/charactertype/" + data.pkCharacterType + "/delete");
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					widget.save("api/charactertype/save",$("#charactertype").serialize());
				},
				model:{
					id:"charactertype",
					items:[{
						name:"pkCharacterType",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"性格类型",
						validate:["required"]
					},{
						name:"description",
						label:"性格类型描述",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = MedicalInsurancetype;
});