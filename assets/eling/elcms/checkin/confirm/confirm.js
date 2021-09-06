define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
    var Dialog=require("dialog-1.0.0"); 
  //多语
	var i18ns = require("i18n");
    var fetch = "*,memberSigning.members.personalInfo.name,memberSigning.checkInDate,memberSigning.room.number,memberSigning.members.pkMember,"+
    "checkInFurinshing.status,checkInFurinshing.confirmUser.name," +
    "checkInMembershipCard.status,checkInMembershipCard.disposeUser.name,checkInMembershipCard.acceptanceUser.name," +
    "checkInNaturalGas.status,checkInNaturalGas.disposeUser.name,checkInNaturalGas.acceptanceUser.name," +
    "checkInRoomConfing.status,checkInRoomConfing.disposeUser.name,checkInRoomConfing.acceptanceUser.name," +
    "checkInTelecom.status,checkInTelecom.disposeUser.name,checkInTelecom.acceptanceUser.name," +
    "checkInMoveHouse.status,checkInMoveHouse.disposeUser.name,checkInMoveHouse.confirmUser.name," +
    "checkInOrderflowers.status,checkInOrderflowers.orderUser.name,checkInOrderflowers.confirmUser.name";
    
	var confirm = BaseView.extend({		
		initSubnav:function(widget){ 
			return {
				model:{
					title:"入住确认",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/checkinimplement/searchconfirm",
							data:{
								s:str,
								properties:"*,memberSigning.room.number,memberSigning.checkInDate,memberSigning.members.personalInfo.name",
								fetchProperties:fetch,
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
					buttonGroup:[{
						id:"checkInStatus",
						items:[{
		                    key:"Doing",
		                    value:"准备中"
						},{
		                    key:"Initial",
		                    value:"初始"
						},{
		                    key:"Edited",
		                    value:"已设置"
						},{
		                    key:"Confirmed",
		                    value:"已确认"
						},{
							key:"",
		                    value:"全部"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
					buttons:[],
					time:{
						ranges:{
							 "本月": [moment().startOf("month"), moment().endOf("month")], 
						     "今年": [moment().startOf("year"), moment().endOf("year")] 
						},
						defaultTime:"今年",
						click:function(time){
							widget.get("list").refresh();
						}
					}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/checkInImplement/queryconfirm",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						// 入住准备落实单 审核 通过
						"memberSigning.checkInDate":time.start, 
						"memberSigning.checkInDateEnd":time.end,
						status:widget.get("subnav").getValue("checkInStatus"),
						fetchProperties:fetch
					};
				},
				autoRender:false,
				model:{
//					isCheckbox:true,
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号"
					},{
						key:"memberSigning.checkInDate",
						name:"入住日期",
						format:"date"
					},{
						key:"memberSigning",
						name:i18ns.get("sale_ship_owner","会员")+"1",
						format:function(value,row){
							return value.members[0] ? value.members[0].personalInfo.name : "";
						}
					},{
						key:"memberSigning",
						name:i18ns.get("sale_ship_owner","会员")+"2",
						format:function(value,row){
							return value.members[1] ? value.members[1].personalInfo.name : "";
						}
					},{
						key:"checkInFurinshing.status.value",
						name:"固定资产",
						format:function(value,row){
							if (row.checkInFurinshing&&row.checkInFurinshing.confirmUser){
								if(value=="未确认"){
									return value+"("+row.checkInFurinshing.confirmUser.name+")";
								}
							}
							return value;
						}
					},{
						key:"checkInRoomConfing.status.value",
						name:"房间配置",
						format:function(value,row){
							if(value=="待处理" || value=="处理中"){
								return value+((row.checkInRoomConfing&&row.checkInRoomConfing.disposeUser)?"("+row.checkInRoomConfing.disposeUser.name+")":"");
							}else if(value=="已处理"){
								return value+((row.checkInRoomConfing&&row.checkInRoomConfing.acceptanceUser)?"("+row.checkInRoomConfing.acceptanceUser.name+")":"");
							}else{
								return value;
							}
						}
					},{	
						key:"checkInTelecom.status.value",
						name:"电信",
						format:function(value,row){
							if(value=="待处理" || value=="处理中"){
								return value+((row.checkInTelecom&&row.checkInTelecom.disposeUser)?"("+row.checkInTelecom.disposeUser.name+")":"");
							}else if(value=="已处理"){
								return value+((row.checkInTelecom&&row.checkInTelecom.acceptanceUser)?"("+row.checkInTelecom.acceptanceUser.name+")":"");
							}else{
								return value;
							}
						}
					},{
						key:"checkInNaturalGas.status.value",
						name:"天然气",
						format:function(value,row){
							if(value=="待处理" || value=="处理中"){
								return value+((row.checkInNaturalGas&&row.checkInNaturalGas.disposeUser)?"("+row.checkInNaturalGas.disposeUser.name+")":"");
							}else if(value=="已处理"){
								return value+((row.checkInNaturalGas&&row.checkInNaturalGas.acceptanceUser)?"("+row.checkInNaturalGas.acceptanceUser.name+")":"");
							}else{
								return value;
							}
						}
					},{
						key:"checkInMembershipCard.status.value",
						name:"一卡通",
						format:function(value,row){
							if(value=="待处理" || value=="处理中"){
								return value+((row.checkInMembershipCard&&row.checkInMembershipCard.disposeUser)?"("+row.checkInMembershipCard.disposeUser.name+")":"");
							}else if(value=="已处理"){
								return value+((row.checkInMembershipCard&&row.checkInMembershipCard.acceptanceUser)?"("+row.checkInMembershipCard.acceptanceUser.name+")":"");
							}else{
								return value;
							}
						}
					},{
						key:"checkInMoveHouse.status.value",
						name:"派车处理",
						format:function(value,row){
							if(value=="待处理" || value=="处理中"){
								return value+((row.checkInMoveHouse&&row.checkInMoveHouse.disposeUser)?"("+row.checkInMoveHouse.disposeUser.name+")":"");
							}else if(value=="已处理"){
								return value+((row.checkInMoveHouse&&row.checkInMoveHouse.disposeUser)?"("+row.checkInMoveHouse.disposeUser.name+")":"");
							}else{
								return value;
							}
						}
					},{
						key:"status.value",
						name:"状态"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							text:"确认",
							show:function(data,row){
								if(row.status.key!="Confirmed"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEL){
							 if(data.status.key!="Doing"){
										Dialog.alert({
	    									content : "入住落实状态不是准备中，不能确认!"
	    								 });
	    								return false;
									}else{
										if(data.checkInFurinshing.status.key!="NoRequiement"&&data.checkInFurinshing.status.key!="Acceptance"){
							 				Dialog.alert({
		    									content : "固定资产未验收，不能确认!"
		    								 });
		    								return false;
										}
										if(data.checkInRoomConfing.status.key!="NoRequiement"&&data.checkInRoomConfing.status.key!="Acceptance"){
											Dialog.alert({
		    									content : "房间配置未验收，不能确认!"
		    								 });
		    								return false;
										}
										if(data.checkInTelecom.status.key!="NoRequiement"&&data.checkInTelecom.status.key!="Acceptance"){
											Dialog.alert({
		    									content : "电信未验收，不能确认!"
		    								 });
		    								return false;
										}
										if(data.checkInNaturalGas.status.key!="NoRequiement"&&data.checkInNaturalGas.status.key!="Acceptance"){
											Dialog.alert({
		    									content : "天然气未验收，不能确认!"
		    								 });
		    								return false;
										}
										if(data.checkInMembershipCard.status.key!="NoRequiement"&&data.checkInMembershipCard.status.key!="Acceptance"){
											Dialog.alert({
		    									content : "一卡通未验收，不能确认!"
		    								 });
		    								return false;
										}
										if(data.checkInMoveHouse.status.key!="NoRequiement"&&data.checkInMoveHouse.status.key!="Pended"){
											Dialog.alert({
		    									content : "派车待处理，不能确认!"
		    								 });
		    								return false;
										}
										if(data.checkInOrderflowers.status&&data.checkInOrderflowers.status.key!="NoRequiement"&&data.checkInOrderflowers.status.key!="Served"){
											Dialog.alert({
		    									content : "入住订花未送达，不能确认!"
		    								 });
		    								return false;
										}
									}
									
									Dialog.confirm({
										title:"提示",
										content:"入住确认？",
										confirm:function(){
											aw.ajax({
				                                url : "api/checkInImplement/confirm",
				                                type : "POST",
				                                data : {
				                               	 	pk:data.pkCIImplement,
				                                },
				                                success : function(result){
				                            	    widget.get("list").refresh({
				                            	    	pkCIImplement:data.pkCIImplement,
				                            	    	fetchProperties:fetch
		                            	    		});
				                                }
				                            });
										}
									});
							}
						}]
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			    widget.get("list").refresh({
			    	pkCIImplement:params.pkFather,
			    	fetchProperties:fetch
			    });
			}else if(params && params.CheckInImplement){
				widget.get("list").refresh({
					pkCIImplement:params.CheckInImplement,
					fetchProperties:fetch
				});
			} else {
				widget.get("list").refresh();
			}
		} 
	});
	module.exports = confirm;
});