define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var store=require("store");
	var Dialog=require("dialog");
	//多语
	var i18ns = require("i18n");
	var Checkintelecom = BaseView.extend({
		events:{
		},
		initSubnav:function(widget){
			return {
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"卡开卡",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/checkinimplement/search",
							data:{
								s:str,
								properties:"memberSigning.room.number,memberSigning.checkInDate,memberSigning.members.personalInfo.name,status",
								fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
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
		                    key:"Pending",
		                    value:"待处理"
						},{
		                    key:"Pend",
		                    value:"处理中"
						},{
		                    key:"Pended",
		                    value:"已处理"
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
						fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.pkMember,memberSigning.members.personalInfo.name,memberSigning.room.number," +
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
						key:"checkInMembershipCard.disposeUser.name",
						name:"处理人"
					},{
						key:"checkInMembershipCard.disposeDate",
						name:"处理时间 ",
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
						format:function(value,row){
							if(row.memberSigning.members[0]!=null&&row.checkInMembershipCard.status.key=="Pending"){
								return "<input class='form-control J-grid-td-input-checkInMembershipCard-memberCardCurrencyMoney1' type='text' value='0'>";
							}else if(value!=null&&row.checkInMembershipCard!=null&&row.checkInMembershipCard.status.key=="Pended"){
								return value;
							}else{
								return "";
							}
						},
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
						format : function(value,row){
							if(row.memberSigning.members[1]!=null&&row.checkInMembershipCard.status.key=="Pending"){
								return "<input class='form-control J-grid-td-input-checkInMembershipCard-memberCardCurrencyMoney2' type='text' value='0'>";
							}else if(value!=null&&row.checkInMembershipCard!=null&&row.checkInMembershipCard.status.key=="Pended"){
								return value;
							}else{
								return "";
							}
						},
						col:"1"
					},{
						key:"memberSigning",
						name:"操作",
						format:function(value,row){
							if(row.status.key=="Doing"&&row.checkInMembershipCard.status.key=="Pending"){
								if(value.members.length!=0){
									 if(row.checkInMembershipCard.memberCardCurrencyMoney2!=null){
				                        	ret = "<div>已处理</div>"; 
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
	                        text:"处理",
	                        handler:function(index,data,row){
	                        	Dialog.mask(true);
	                        	var members = data.memberSigning.members;
	            				var memberCardCurrencyMoney1 = row.find(".J-grid-td-input-checkInMembershipCard-memberCardCurrencyMoney1").val();
	            				var memberCardCurrencyMoney2 = row.find(".J-grid-td-input-checkInMembershipCard-memberCardCurrencyMoney2").val();
	            				if(data){
	            					aw.ajax({
	            						url : "api/checkinmembershipcard/save",
	            						type : "POST",
	            						data : {
	            							pkCIMembershipCard:data.checkInMembershipCard.pkCIMembershipCard,
	            							status:"Pended",
	            							cardCurrency:true,
	            							memberCardCurrencyMoney1:memberCardCurrencyMoney1,
	            							memberCardCurrencyMoney2:memberCardCurrencyMoney2,
	            							disposeUser:store.get("user").pkUser,
	            							disposeDate:moment().valueOf(),
	            							version:data.checkInMembershipCard.version
	            						},
	            						success:function(result){
	            							Dialog.mask(false);
	            							if(result){
	            								row.parents("td").text("已处理"),
	            								widget.get("list").refresh({
	            									pkCIImplement:data.pkCIImplement,
	            									fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.pkMember,memberSigning.members.personalInfo.name,memberSigning.room.number," +
	            									"checkInMembershipCard.memberCardCurrencyMoney1,checkInMembershipCard.memberCardCurrencyMoney2,checkInMembershipCard.*,status.value,checkInMembershipCard.disposeUser.*,checkInMembershipCard.acceptanceUser.*"
	            									
	            								})
	            								
	            							}
	            						}
	            					});
	            				}
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
			    	fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
					"checkInMembershipCard.memberCardCurrencyMoney1,checkInMembershipCard.memberCardCurrencyMoney2,checkInMembershipCard.*,status.value,checkInMembershipCard.disposeUser.*,checkInMembershipCard.acceptanceUser.*"
			    });
			}else if(params && params.CheckInImplement){
				  widget.get("list").refresh({
					  pkCIImplement:params.CheckInImplement,
					  fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
						"checkInMembershipCard.memberCardCurrencyMoney1,checkInMembershipCard.memberCardCurrencyMoney2,checkInMembershipCard.*,status.value,checkInMembershipCard.disposeUser.*,checkInMembershipCard.acceptanceUser.*"
				  });
			} else {
				widget.get("list").refresh();
			}
		}
	});
	module.exports = Checkintelecom;
});