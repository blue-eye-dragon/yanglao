define(function(require,exports,module){
	//多语
	var i18ns = require("i18n");
	var MultiRowGrid = require("multirowgrid");
	var Dialog=require("dialog-1.0.0");
	var aw=require("ajaxwrapper");
	
	function showSubGrid(widget,data,isEdit){
		//1.将当前点击主表的行的id存放在J-list上
		$(".J-list").attr("data-key",data.pkGenerationShoppingApplication);
		$(".J-list").attr("data-version",data.version);
		//2.隐藏主表，显示子表
		widget.hide(".J-list").show(".J-subList");
		//3.隐藏新增按钮，显示返回按钮，显示会员按钮
		var subnav=widget.get("subnav");
		subnav.hide(["add"]).show(["return","defaultMembers"]);
		//4.重新设置会员buttongroup
		subnav.setValue("building",data.member.memberSigning.room.building.pkBuilding);
		subnav.load({
			id:"defaultMembers",
			params:{
				"memberSigning.room.building":widget.get("subnav").getValue("building"),
				fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
			},
        	callback:function(){
        		subnav.setValue("defaultMembers",data.member.pkMember);
        		
        		//5.重新设置子表的title
        		var subgrid=widget.get("subgrid");
        		subgrid.setTitle(subnav.getText("defaultMembers"));
        		//6.刷新子表
        		subgrid.refresh(null,function(){
        			if(!isEdit){
        				subgrid.disabledRow();
        				//取消subgrid新增按钮和保存按钮
        				$(".J-grid-head-add,.J-grid-head-save,.J-grid-head-history").addClass("hidden");
        				//取消各行的编辑和删除按钮
        				subgrid.$(".J-edit,.J-delete").addClass("hidden");
        				$(".J-subList").removeClass("edit").addClass("detail");
        			}else{
        				//取消subgrid新增按钮和保存按钮
        				$(".J-grid-head-add,.J-grid-head-save,.J-grid-head-history").removeClass("hidden");
        				//取消各行的编辑和删除按钮
        				subgrid.$(".J-edit,.J-delete").removeClass("hidden");
        				$(".J-subList").removeClass("detail").addClass("edit");
        			}
        		});
        	}
		});
//		subnav.setValue("defaultMembers",data.member.pkMember);
//		
//		//5.重新设置子表的title
//		var subgrid=widget.get("subgrid");
//		subgrid.setTitle(subnav.getText("defaultMembers"));
//		//6.刷新子表
//		subgrid.refresh(null,function(){
//			if(!isEdit){
//				subgrid.disabledRow();
//				//取消subgrid新增按钮和保存按钮
//				$(".J-grid-head-add,.J-grid-head-save,.J-grid-head-history").addClass("hidden");
//				//取消各行的编辑和删除按钮
//				subgrid.$(".J-edit,.J-delete").addClass("hidden");
//				$(".J-subList").removeClass("edit").addClass("detail");
//			}else{
//				//取消subgrid新增按钮和保存按钮
//				$(".J-grid-head-add,.J-grid-head-save,.J-grid-head-history").removeClass("hidden");
//				//取消各行的编辑和删除按钮
//				subgrid.$(".J-edit,.J-delete").removeClass("hidden");
//				$(".J-subList").removeClass("detail").addClass("edit");
//			}
//		});
	}
	
	var MainGrid={
		init:function(widget){
			return new MultiRowGrid({
				parentNode:".J-list",		
				url:"api/generationshoppingapplication/query",
				fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.building.name,member.memberSigning.room.building.pkBuilding,member.memberSigning.room.number,shoppinglists.name,shoppinglists.quantity,shoppinglists.description",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"member.memberSigning.room.building":subnav.getValue("building"),
						 member:subnav.getValue("defaultMembers"),
						 flowStatusIn:"Temporary,Commited" || subnav.getValue("application")
					};
				},
				model:{
					isCheckbox:true,
					multiField:"shoppinglists",
					columns:[{
						key : "member",
						name : i18ns.get("sale_ship_owner","会员"),
						col:2,
						format:function(value,row){
							return value.memberSigning.room.number + " " + value.personalInfo.name;
						}
					},{
						key:"shoppinglists",
						multiKey:"name",
						name:"物品名称",
						col:2,
						isMulti:true
					},{
						key:"shoppinglists",
						multiKey:"quantity",
						name:"数量",
						col:2,
						isMulti:true
					},{
						key:"shoppinglists",
						name:"描述",
						multiKey:"description",
						col:3,
						isMulti:true
					},{
						key:"flowStatus",
						name:"状态",
						col:1,
						format:function(value,row){
							if(value=="Commited"){
								return "已提交";
							}
							else{
								return "button";
							}
						},
						formatparams:[{
							key:"commit",
							text:"提交",
							handler:function(index,data,rowEle){
								aw.ajax({
									url : "api/generationshoppingapplication/submitapplication",
									type : "POST",
									data : {
										pkGenerationShoppingApplication:data.pkGenerationShoppingApplication
									},
									success : function(data){
										if(data.msg=="提交成功"){
											widget.get("grid").refresh();
										}else{
											Dialog.tip({
												title:data.msg
											});
										}
									}	
								});
							}
						}]
					},{
						key:"flowStatus",
						name:"操作",
						col:2,
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								showSubGrid(widget,data,true);
							}
						},{
							key:"delete",	
							icon:"remove",
							handler:function(index,data,rowEle){
								Dialog.confirm({
									content:"确认要删除吗？",
									confirm:function(){
										aw.ajax({
											url : "api/generationshoppingapplication/" + data.pkGenerationShoppingApplication + "/delete",
											type : "POST",
											success : function(data){
												widget.get("grid").refresh();	
											}	
										});
									}
								});
							}
						}]
					}]
				}
			});
		}
	};
	
	module.exports=MainGrid;
});