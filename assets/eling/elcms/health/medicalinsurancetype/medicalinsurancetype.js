define(function(require, exports, module) {
	var BaseView=require("baseview");
	var MedicalInsurancetype = BaseView.extend({
		initSubnav:function(){
			return {
				model:{
					title:"医保类型"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/medicalinsurance/query",
				model:{
					columns:[{
						key:"name",
						name:"医保类型",
						col:2,
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"description",
						col:8,
						name:"医保类型描述"
					},{
						key:"operate",
						name:"操作",
						col:2,
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								widget.edit("edit",data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/medicalinsurance/" + data.pkMedicalInsurance + "/delete");
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					widget.save("api/medicalinsurance/save",$("#medicalinsurance").serialize());
				},
				model:{
					id:"medicalinsurance",
					items:[{
						name:"pkMedicalInsurance",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"医保类型",
						validate:["required"]
					},{
						name:"description",
						label:"医保类型描述",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = MedicalInsurancetype;
});