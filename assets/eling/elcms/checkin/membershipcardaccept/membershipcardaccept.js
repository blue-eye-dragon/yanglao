define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var store=require("store");
	var Dialog=require("dialog");
	//多语
	var i18ns = require("i18n");
	var CheckinMemberAccept = BaseView.extend({
		events:{
			"click .J-operate" : function(e){
				Dialog.mask(true);
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var members = data.memberSigning.members;
				if(data){
					aw.ajax({
						url : "api/checkinmembershipcard/save",
						type : "POST",
						data : {
							pkCIMembershipCard:data.checkInMembershipCard.pkCIMembershipCard,
							status:"Acceptance",
							cardCurrency:true,
							acceptanceUser:store.get("user").pkUser,
							acceptanceDate:moment().valueOf(),
							version:data.checkInMembershipCard.version
						},
						success:function(result){	
							Dialog.mask(false);
							if(result){
								$(e.target).parents("td").text("已验收"),
								grid.refresh({
									pkCIImplement:data.pkCIImplement,
									fetchProperties:"*,checkInMembershipCard.cardAcceptConfirm2,checkInMembershipCard.cardAcceptConfirm1,memberSigning.checkInDate,memberSigning.members.pkMember,memberSigning.members.personalInfo.name,memberSigning.room.number," +
									"checkInMembershipCard.memberCardCurrencyMoney1,checkInMembershipCard.memberCardCurrencyMoney2,checkInMembershipCard.*,status.value,checkInMembershipCard.disposeUser.*,checkInMembershipCard.acceptanceUser.*"
									
								})
								
							}
						}
					});
			}

			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"卡验收",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/checkinimplement/search",
							data:{
								s:str,
								properties:"memberSigning.room.number,memberSigning.checkInDate,memberSigning.members.personalInfo.name,status",
								fetchProperties:"*,checkInMembershipCard.cardAcceptConfirm2,checkInMembershipCard.cardAcceptConfirm1,memberSigning.checkInDate,memberSigning.members.pkMember,memberSigning.members.personalInfo.name,memberSigning.room.number," +
								"checkInMembershipCard.memberCardCurrencyMoney1,checkInMembershipCard.memberCardCurrencyMoney2,checkInMembershipCard.*,status.value,checkInMembershipCard.disposeUser.*,checkInMembershipCard.acceptanceUser.*"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(key,element){
							widget.list2Card(false);
							widget.get("subnav").hide(["return"]).show(["handle","time","checkInStatus","search"]);
						}
					}],
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
					},{
						id:"handle",
						items:[{
		                    key:"Pended",
		                    value:"已处理"
						},{
		                    key:"Pending",
		                    value:"待处理"
						},{
		                    key:"Pend",
		                    value:"处理中"
						},{
		                    key:"NoRequiement",
		                    value:"无要求"
						},{
		                    key:"UnConfirmed",
		                    value:"未确认"
						},{
							key:"",
		                    value:"全部"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
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
				url : "api/checkInImplement/query",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						"memberSigning.checkInDate":time.start, 
						"memberSigning.checkInDateEnd":time.end,
						status:subnav.getValue("checkInStatus"),
						"checkInMembershipCard.status":subnav.getValue("handle"),
						fetchProperties:"*,checkInMembershipCard.cardAcceptConfirm2,checkInMembershipCard.cardAcceptConfirm1,memberSigning.checkInDate,memberSigning.members.pkMember,memberSigning.members.personalInfo.name,memberSigning.room.number," +
							"checkInMembershipCard.memberCardCurrencyMoney1,checkInMembershipCard.memberCardCurrencyMoney2,checkInMembershipCard.*,status.value,checkInMembershipCard.disposeUser.*,checkInMembershipCard.acceptanceUser.*"
					};
				},
				autoRender:false,
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号",
					},{
						key:"memberSigning.checkInDate",
						name:"入住时间",
						format:"date"
					},{
						key:"status.value",
						name:"入住准备状态"
					},{
						key:"checkInMembershipCard.status.value",
						name:i18ns.get("sale_ship_owner","会员")+"卡开卡状态"
					},{
						key:"checkInMembershipCard.acceptanceUser.name",
						name:"验收人"
					},{
						key:"checkInMembershipCard.acceptanceDate",
						name:"验收时间 ",
						format:"date"
					},{
						key:"memberSigning",
						name:i18ns.get("sale_ship_owner","会员")+"1",
						format:function(value,row){
							return value.members[0] ? value.members[0].personalInfo.name : "";
						}
					},{
						key:"checkInMembershipCard.memberCardCurrencyMoney1",
						name:"预充金额",
						col:"1"
					},{
						key:"memberSigning",
						name:i18ns.get("sale_ship_owner","会员")+"2",
						format:function(value,row){
							return value.members[1] ? value.members[1].personalInfo.name : "";
						}
					},{
						key:"checkInMembershipCard.memberCardCurrencyMoney2",
						name:"预充金额",
						col:"1"
					},{
						key:"memberSigning",
						name:"操作",
						format:function(value,row){
							
							if(row.status.key=="Doing"&&row.checkInMembershipCard.status.key=="Pended"){
								if(value.members.length!=0){
									 if(row.checkInMembershipCard.memberCardCurrencyMoney2!=null&&row.checkInMembershipCard.cardAcceptConfirm2==true){
				                        	ret = "<div>已验收</div>"; 
				                        }else{
				                        	return "button";
				                        }
										return ret; 
								}else{
									return "";
								}
							}else{
								return "";
							}
	                     },
	                     formatparams:[{
	                        key:"operate",
	                        text:"验收",
	                     }]
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			    widget.get("list").refresh({
			    	pkCIImplement:params.pkFather,
			    	fetchProperties:"*,checkInMembershipCard.cardAcceptConfirm2,checkInMembershipCard.cardAcceptConfirm1,memberSigning.checkInDate,memberSigning.members.pkMember,memberSigning.members.personalInfo.name,memberSigning.room.number," +
					"checkInMembershipCard.memberCardCurrencyMoney1,checkInMembershipCard.memberCardCurrencyMoney2,checkInMembershipCard.*,status.value,checkInMembershipCard.disposeUser.*,checkInMembershipCard.acceptanceUser.*"
			    });
			}else if(params && params.CheckInImplement){
				  widget.get("list").refresh({
					  pkCIImplement:params.CheckInImplement,
					  fetchProperties:"*,checkInMembershipCard.cardAcceptConfirm2,checkInMembershipCard.cardAcceptConfirm1,memberSigning.checkInDate,memberSigning.members.pkMember,memberSigning.members.personalInfo.name,memberSigning.room.number," +
						"checkInMembershipCard.memberCardCurrencyMoney1,checkInMembershipCard.memberCardCurrencyMoney2,checkInMembershipCard.*,status.value,checkInMembershipCard.disposeUser.*,checkInMembershipCard.acceptanceUser.*"
				  });
			} else {
				widget.get("list").refresh();
			}
		}
	});
	module.exports = CheckinMemberAccept;
});