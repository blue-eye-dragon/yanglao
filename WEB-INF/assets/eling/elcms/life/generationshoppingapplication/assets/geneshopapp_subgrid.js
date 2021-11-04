define(function(require,exports,module){
	//多语
	var i18ns = require("i18n");
	var EditGrid = require("editgrid-1.0.0");
	var aw=require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	
	var SubGrid={
		init:function(widget){
			return new  EditGrid({
				parentNode:".J-subList",
				url:"api/generationshoppingapplication/shoppingqueryall",
				autoRender:false,
				params:function(){
					return {
						"member" : widget.get("subnav").getValue("defaultMembers"),
						flowStatusIn : "Temporary,Commited" || widget.get("subnav").getValue("application")
					};
				},
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								this.addRow();
							}
						},{
							id:"history",
							icon:"icon-list-ul",
							handler:function(){
								widget.hide(".J-subList").show(".J-history-grid");
								widget.get("history").refresh();
							}
						},{
							id:"save",
							icon:"icon-save",
							handler:function(){
								var data={
									pkGenerationShoppingApplication:$(".J-list").attr("data-key"),
									member:widget.get("subnav").getValue("defaultMembers")
								};
								if(data.member==""){
									Dialog.alert({
										content:"请选择"+i18ns.get("sale_ship_owner","会员")
									});
									return;
								}
								var datas = this.getEditData();
								if(datas.length == 0){
									Dialog.alert({
										content:"请先添加物品！"
									});
									return;
								}
								for(var i = 0 ;i<datas.length;i++){
									if(datas[i].name.length == 0 ){
										Dialog.alert({
										content:"请输入第"+(i+1)+"行物品名称!"
										});
										return false;
									}
									if(datas[i].quantity.length == 0){
										Dialog.alert({
										content:"请输入第"+(i+1)+"行物品数量!"
										});
										return false;
									}
								}
								
								data.shoppinglistsParams=datas;
								aw.saveOrUpdate("api/generationshoppingapplication/save",aw.customParam(data),function(data){
									widget.show(".J-list").hide(".J-subList");
									widget.get("subnav").show(["add"]).hide(["return"]);
									widget.get("grid").refresh();
								});
							}
						}]
					},
					columns:[{
						key : "name",
						name : "物品名称",
						type:"text"
					},{
						key : "quantity",
						name : "数量",
						type:"text"
					},{
						key:"description",
						name:"描述",
						type:"text"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"delete",	
							icon:"remove",
							handler:function(index,data,rowEle){
								this.delRow(index);
							}
						}]
					}]
				}
			});
		}
	};
	
	module.exports=SubGrid;
});