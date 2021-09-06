define(function(require,exports,module){
	var EditGrid=require("editgrid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var aw=require("ajaxwrapper");
	var Consult=require("./app_consult");
	//多语
	var i18ns = require("i18n");
	var BuyMedicineApp_grid={
		init:function(widget){
			//列表
			return new EditGrid({
				parentNode:".J-sub-grid",
				autoRender:false,
				url:"api/buymedicineapplication/itemsqueryall",
				params:{
					fetchProperties:"*,medicine.name,medicine.code,medicine.specification,medicine.manufacturer,medicine.description"
				},
				model:{
					idAttribute:"pkMedicine",
					head:{
						buttons:[
//						 {
//							id:"add",
//							icon:"icon-plus",
//							handler:function(){
//								this.addRow();
//							}
//						},
						{
							id:"list",
							icon:"icon-plus",
							handler:function(){
								Dialog.showComponent({
									title:"请选择药品",
									isSearch:true,
									search:function(s){
										Consult.search(s);
									},
									confirm:function(){
										var datas=Consult.getSelectedData();
										var data=[];
										var subgrid=widget.get("subgrid");
										if(datas[0].medicine){//历史药品
											for(var i=0;i<datas.length;i++){
												data.push(datas[i].medicine);
											}
											subgrid.addRow(data);
										}else{
											subgrid.addRow(datas);
										}
//										var length=$(".J-sub-grid tbody tr").size()-1;
//										for(var i=0;i<datas.length;i++){
//											subgrid.disabledRow(length-i,[0]);
//										}
									}
								},Consult.consult(widget));
							}
						},{
							id:"save",
							icon:"icon-save",
							handler:function(){
								//主表单的数据
								var params=widget.get("form").getData();
								if(!params.member || params.buymedicinepapers.length==0){
									Dialog.tip({
										title:"请填写"+i18ns.get("sale_ship_owner","会员")+"和证件"
									});
									return;
								}
								//子表的数据
								params.itemsParams=[];
								var subData=widget.get("subgrid").getEditData();
								if(subData.length==0){
									Dialog.alert({
										content:"请填写药品"
									});
									return false;
								}else if(subData.length!=0){
									for(var i=0;i<subData.length;i++){
										if(!/^\+?[1-9]\d*$/.test(subData[i].quantity)
												||subData[i].quantity =="" 
												|| subData[i].quantity.length >= 9){
											Dialog.alert({
												content:"请填入正确的数量!"
											});
											return false;
										}
									}
								}
								for(var i=0;i<subData.length;i++){
									var temp={};
									var idAttribute=widget.get("subgrid").getIDAttribute(i);
									if(idAttribute){
										//获取药的pk，如果有，证明是从参照中选择的已经存在的要，则只需要传递pk
										temp.medicine={};
										temp.medicine.pkMedicine=idAttribute;
									}else{
										//新增的药
										temp.medicine=subData[i];
									}
									temp.quantity=subData[i].quantity;
									params.itemsParams.push(temp);
								}
								aw.saveOrUpdate("api/buymedicineapplication/save",aw.customParam(params),function(data){
									widget.get("grid").refresh();
									widget.show(".J-main-grid").hide(".J-sub-grid,.J-form");
									widget.get("subnav").hide(["return"]).show(["add","application","batchSubmit"]);
								});
							}
						}]
					},
					columns:[{
						key : "name",
						name : "药品名称（专用名/通用名）",
						format:function(value,row){
							if(row && row.generalName){
								return row.name + "/" + row.generalName;
							}else{
								return row.name;
							}
						}
					},{
						key : "specification",
						name : "规格"
					},{
						key:"quantity",
						name:"数量（只能输入数字）",
						type:"text"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"deleteitem",	
							icon:"remove",
							type:"danger",
							handler:function(index,data,rowEle){
								widget.get("subgrid").delRow(index);
							}
						}]
					}]
				}
			});
		}	
	};
	
	module.exports=BuyMedicineApp_grid;
});