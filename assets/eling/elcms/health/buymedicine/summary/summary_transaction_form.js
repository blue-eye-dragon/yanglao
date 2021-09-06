define(function(require,exports,module){
	var Form=require("form-2.0.0")
	var aw=require("ajaxwrapper");
	
	var utils={
		initComponent:function(widget){
			var transactionForm=new Form({
				parentNode:".J-transactionForm",
				saveaction:function(){
					aw.saveOrUpdate("api/buymedicinetransferlog/updateflowstatusdown",$("#buymedicinetransferlog").serialize(),function(){
						widget.show([".J-transferGrid"]).hide([".J-transactionForm"]);
						widget.get("transferGrid").refresh();
						widget.set("status","transfer");
					});
				},
				cancelaction:function(){
					widget.show([".J-transferGrid"]).hide([".J-transactionForm"]);
					widget.set("status","transfer");
				},
				model:{
					id:"buymedicinetransferlog",
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
						name:"description",
						label:"备注",	
						type:"textarea",
						validate:["required"]
					}]
				}
			});
			return transactionForm;
		}
	};
	
	module.exports=utils;
});