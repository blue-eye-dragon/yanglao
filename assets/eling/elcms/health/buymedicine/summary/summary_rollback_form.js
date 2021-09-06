define(function(require,exports,module){
	var Form=require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
	var aw=require("ajaxwrapper");
	var utils={
		initComponent:function(widget){
			var rollbackForm=new Form({
				parentNode:".J-rollbackForm",
				saveaction:function(){
					aw.saveOrUpdate("api/buymedicinetransferlog/flowstatusup",$("#transferlog").serialize(),function(data){
						if(data.msg){
 							Dialog.alert({
								content:data.msg
							});
 						}
						widget.show([".J-transferGrid"]).hide([".J-rollbackForm"]);
						widget.get("transferGrid").refresh(); 
						widget.set("status","transfer");
					});
				},
				cancelaction:function(){
					widget.show([".J-transferGrid"]).hide([".J-rollbackForm"]);
					widget.set("status","transfer");
				},
				model:{
					id:"transferlog",
					items:[{
						name:"pkBuyMedicineTransferLog",
						type:"hidden"
					},{
						name:"pkBuyMedicineTransferLog_prev",
						type:"hidden"
					},{
						name:"pkBuyMedicineTransferLog_next",
						type:"hidden"
					},{
						name:"returnPerson",
						label:"回退人",
						readonly:true
					},{
						name:"password",
						label:"回退人的登录密码",
						validate:["required"]
					}]
				}
			});
			return rollbackForm;
		}
	};
	
	module.exports=utils;
});