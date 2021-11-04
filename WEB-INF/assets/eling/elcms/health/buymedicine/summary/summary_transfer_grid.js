define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var utils={
		initComponent:function(widget){
			var transferGrid=new Grid({
				parentNode:".J-transferGrid",
				autoRender:false,
				url:"api/buymedicinetransferlog/query",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						fetchProperties:"*," +
							"buyMedicineflowdefine.name," +
							"buyMedicineflowdefine.role.name," +
							"summary.apps.buyMedicinePapers.papertype.name," +
							"summary.apps.ticket," +
							"summary.apps.money," +
							"buyMedicineflowdefine.returnPerson.name," +
							"summary.description," +
							"user.name",
						summary:subnav.getValue("billcode")
					};
				},
				model:{
					columns:[{
						key:"buyMedicineflowdefine.name",
						name:"交接时点"
					},{
						key:"buyMedicineflowdefine.role.name",
						name:"角色"
					},{
						key:"summary",
						name:"证件",
						format:function(value,row){
							var result = 0;
							for(var i=0;i<value.apps.length;i++){
								var temp=value.apps[i] || [];
								for(var j=0;j<temp.buyMedicinePapers.length;j++){
									if(temp.buyMedicinePapers[j].papertype.name || []){
										result++;
									}
								} 	
							}
							return result;
						}
					},{
						key:"summary",
						name:"发票",
						format:function(value,row){
							var result = 0;
							for(var i=0;i<value.apps.length;i++){
								if(value.apps[i].ticket == null){
									result = 0;
								}
								else{
									result += value.apps[i].ticket;
								}
							}
							return result;
						}
					},{
						key:"summary",
						name:"金额(元)",
						format:function(value,row){
							var result = 0;
							for(var i=0;i<value.apps.length;i++){
								if(value.apps[i].money == null){
									result = 0;
								}
								else{
									result += value.apps[i].money;
								}
							}
							return result;	
						}
					},{
						key:"user.name",
						name:"交接人"
					},{
						key:"summary.description",
						name:"备注"
					},{
						key:"flowStatus",
						name:"操作",
						format:function(value,row){
							if(value == "Transaction"){
								return "<div><a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-transaction btn btn-xs' >办理</a></div>"; 
							}else if(value == "Rollback"){
								return "<div><a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-rollback btn btn-xs' >回退</a></div>"; 
							}else{
								return "";
							}
						}
					}]
				}
			});
			return transferGrid;
		}
	};
	
	module.exports=utils;
});