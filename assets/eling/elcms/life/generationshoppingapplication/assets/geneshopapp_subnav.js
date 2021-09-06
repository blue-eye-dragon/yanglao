define(function(require,exports,module){
	var Subnav=require("subnav-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var aw=require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var GeneShopApp_subnav={
		init:function(widget){
			return new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"代购物申请单",
					search:function(str) {
						widget.get("grid").loading();
						aw.ajax({
							url:"api/generationshoppingapplication/search",
							data:{
								s:str,
								properties:"member.personalInfo.name,member.memberSigning.room.number,shoppinglists.name,shoppinglists.quantity,shoppinglists.description,flowStatus",
							   fetchProperties:"*,flowStatus,member.personalInfo.name,member.memberSigning.room.number,shoppinglists.name,shoppinglists.quantity,shoppinglists.description"
							},
							dataType:"json",
							success:function(data){
								widget.get("grid").setData(data);
							}
						});
					},
					buttonGroup:[{
						id:"building",
						showAll:"true",
						showAllFirst:"true",
						handler:function(key,element){
							//刷新会员
							var subnav=widget.get("subnav");
							var subgrid=widget.get("subgrid");
							subnav.setValue("defaultMembers","");
							if(key==""){
								subnav.hide("defaultMembers");
							}else{
								subnav.show("defaultMembers");
								subnav.load({
									id:"defaultMembers",
									params:{
										"memberSigning.room.building":widget.get("subnav").getValue("building"),
										fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
									},
									callback:function(){
										subgrid.setTitle(subnav.getText("defaultMembers"));
										if($(".J-list").hasClass("hidden")){
											//编辑页面刷新subgrid
											subgrid.refresh(null,function(){
												if($(".J-subList").hasClass("detail")){
													widget.get("subgrid").disabledRow();
													subgrid.$(".J-edit,.J-delete").addClass("hidden");
												}
											});
										}
									}
								});
							}
							//列表页面刷新主列表
							if(!$(".J-list").hasClass("hidden")){
								widget.get("grid").refresh();
							}
						}
					},{
						id:"defaultMembers",
						show:false,
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							//设置subgrid的title
							var subgrid=widget.get("subgrid");
							subgrid.setTitle(this.getText("defaultMembers"));
							if($(".J-list").hasClass("hidden")){
								//根据会员和状态查询,只有在编辑状态下切换会员时，由于subgrid刷新拿不到主表主键，所有重新发请求
								aw.ajax({
									url:"api/generationshoppingapplication/query",
									dataType:"json",
									data:{
										member : key,
										flowStatusIn : "Temporary,Commited",
										fetchProperties:"pkGenerationShoppingApplication,version,shoppinglists.*"
									},
									success:function(data){
										//设置subgrid
										if(data && data[0]){
											subgrid.setData(data[0].shoppinglists);
											//回写$(".J-list")的data-key
											$(".J-list").attr("data-key",data[0].pkGenerationShoppingApplication).
												attr("data-version",data[0].version);
										}else{
											subgrid.setData([]);
											$(".J-list").removeAttr("data-key").removeAttr("data-version");
										}
										if($(".J-subList").hasClass("detail")){
											subgrid.disabledRow();
											subgrid.$(".J-edit,.J-delete").addClass("hidden");
										}
									}
								});
							}else{
								widget.get("grid").refresh();
							}
						}
					}],
					buttons:[{
						id:"add",
						text:"申请",
						handler:function(){
							var subnav=widget.get("subnav");
							if(!this.getValue("defaultMembers")){
								Dialog.alert({
									//content:"该楼没有会员"
									content:"请选择"+i18ns.get("sale_ship_owner","会员")
								});
								return;
							}
							//根据当前会员查询该会员未提交和已提交的申请单
							aw.ajax({
								url:"api/generationshoppingapplication/query",
								dataType:"json",
								data:{
									member:subnav.getValue("defaultMembers"),
									flowStatusIn : "Temporary,Commited",
									fetchProperties:"pkGenerationShoppingApplication,version,shoppinglists.*"
								},
								success:function(data){
									var subgrid=widget.get("subgrid");
									if(data && data[0]){
										//0.设置主键和版本号
										$(".J-list").attr("data-key",data[0].pkGenerationShoppingApplication);
										$(".J-list").attr("data-version",data[0].version);
										//1.设置子列表的title
										var title=subnav.getText("defaultMembers");
										subgrid.setTitle(title);
										subgrid.setData(data[0].shoppinglists);
									}else{
										subgrid.setData([]);
										$(".J-list").removeAttr("data-key").removeAttr("data-version");
									}
									//2.隐藏主列表，显示子列表
									widget.hide(".J-list").show(".J-subList");
									//3.隐藏新增按钮，显示返回按钮，显示会员按钮
									widget.get("subnav").hide(["add"]).show(["return","defaultMembers"]);
								}
							});
						}
					},{
						id:"return",
						text:"返回",
						show:false,	
						handler:function(){
							//1.隐藏子列表，显示主列表
							widget.hide(".J-subList,.J-history-grid").show(".J-list");
							//2.隐藏新增按钮，显示隐藏返回按钮，隐藏会员按钮
							this.hide(["return","defaultMembers"]).show(["add"]);
							widget.get("subnav").setValue("building","");
							widget.get("grid").refresh({
//								"member.memberSigning.room.building":"",
//								 member:"",
								 flowStatusIn:"Temporary,Commited" || subnav.getValue("application"),
								fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.building.name,member.memberSigning.room.building.pkBuilding,member.memberSigning.room.number,shoppinglists.name,shoppinglists.quantity,shoppinglists.description",
								
							});
						}
					},{
						id:"batchSubmit",
						text:"批量提交",
						handler:function(){
							var datas=widget.get("grid").getSelectedData();
							var params="";
							for(var i=0;i<datas.length;i++){
								params+=datas[i].pkGenerationShoppingApplication+",";
							}
							if(datas.length!=0){
								Dialog.confirm({
									content:"确定要批量提交吗？点击确定，列表中勾选的申请单将会被提交",
									confirm:function(){
										aw.ajax({
											url : "api/generationshoppingapplication/batchsubmitapplication",
											type : "POST",
											data : {
												pks:params.substring(0,params.length-1)
											},
											success : function(data){
												if(data.msg){
													Dialog.tip({
														title:data.msg
													});
												}
												widget.get("grid").refresh();
											}	
										});
									}
								});
							}else{
								Dialog.alert({
									content:"没有选中的数据"
								});
							}
						}
					}]
				}
			});
		}	
	};
	
	module.exports=GeneShopApp_subnav;
});


//{
//	id:"application",
//	items:[{
//		key:"Temporary",
//		value:"未提交"
//	},{
//		key:"Commited",
//		value:"已提交"
//	},{
//		key:"Printed",
//		value:"购买中"
//	},{
//		key:"Bought",
//		value:"已买回"
//	},{
//		key:"Closed",
//		value:"已发放"
//	},{
//		key:"Temporary,Commited,Printed,Closed,Bought",
//		value:"全部"
//	}],
//	handler:function(key,element){
//		if($(".J-list").hasClass("hidden")){
//			widget.get("subgrid").refresh(null,function(){
//				if($(".J-subList").hasClass("detail")){
//					widget.get("subgrid").disabledRow();
//					widget.get("subgrid").$(".J-edit,.J-delete").addClass("hidden");
//				}
//			});
//		}else{
//			widget.get("grid").refresh();
//		}
//	}
//},