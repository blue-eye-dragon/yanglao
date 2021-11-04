define(function(require,exports,module){
	var Dialog=require("dialog-1.0.0");
	var Grid=require("grid-1.0.0");
	var aw=require("ajaxwrapper");
	var Histoty={
		init:function(widget){
			return new  Grid({
				parentNode:".J-history-grid",	
				url:"api/generationshoppinglist/queryshoppingbypkmember",
				params:function(){
					return {
						member:widget.get("subnav").getValue("defaultMembers"),
						flowStatusIn:["Commited","Printed","Bought","Closed"]
					};
				},
				autoRender:false,
				model:{
					isCheckbox:true,
					head:{
						title:"历史购物记录",
						buttons:[{
							id:"addHistoryToSub",
							icon:"icon-save",
							handler:function(){
								var data=this.getSelectedData();
								if(data.length==0){
		                     		 Dialog.tip({
										title:"请选中您要添加的物品"
									 });
								}else{
									widget.get("subgrid").addRow(data);
									widget.show(".J-subList").hide(".J-history-grid");
								}
							}
						},{
							id:"returnSublist",
							icon:"icon-reply",
							handler:function(){
								widget.hide(".J-history-grid").show(".J-subList");
							}
						}]
					},
					columns:[{
						key : "name",
						name : "物品名称"
					},{
						key:"quantity",
						name:"数量"
					},{
						key:"description",
						name:"描述"
					}]
				}
			});
		}	
	};
	
	module.exports=Histoty;
});