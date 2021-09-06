define(function(require, exports, module){
	var BaseView=require("baseview");
	var Dialog = require("dialog-1.0.0");
	var aw=require("ajaxwrapper");
	var store =require("store");
	//多语
	var i18ns = require("i18n");
	var CheckOutCardApply = BaseView.extend({
		events:{
			"change .J-form-checkoutcard-select-membershipContract":function(e){
				var card=this.get("card");
				//1.获取下拉框的pk
				var pks = card.getValue("membershipContract");
				//2.通过获取的pk得到该pk的整条数据
				var current=card.getData("membershipContract",{
					pk:pks
				});
				card.setValue("cardType",current.membershipCard.cardType.name);
				card.setValue("memberShipFees",current.memberShipFees);
				card.load("proposer",{
					params:{
						"pkCard":current.membershipCard.pkMemberShipCard,
						fetchProperties:"pkPersonalInfo,name"
					},
                	callback:function(){
                	}
				});
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"退卡申请",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/checkoutcardapply/search",
							data:{
								s:str,
								properties:"membershipContract.membershipCard.name," +
										"membershipContract.membershipCard.cardType.name" +
										"proposer.name,"+
										"operator.name",
								fetchProperties:"*,membershipContract.membershipCard.name," +
										"membershipContract.membershipCard.cardType.name," +
										"membershipContract.memberShipFees," +
										"membershipContract.personalCardowners," +
										"proposer.name,"+
										"operator.name",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.list2Card(false);
							}
						});
					},
					buttons:[{
						id:"add",
						text:"新增",
						type:"button",
						handler:function(){
							widget.get("card").reset();
							widget.list2Card(true);
							widget.get("subnav").hide(["time","search","flowStatusIn"]);
							return false;
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						type:"button",
						handler:function(){
							widget.get("card").reset();
							widget.list2Card(false);
							widget.get("subnav").hide(["return"]).show("time").show("search").show(["flowStatusIn"]);
							return false;
						}
					}],
					buttonGroup:[{
			   			 id:"flowStatusIn",
			   			 showAll:true,
			   			 showAllFirst:true,
							items:[{
								key:"Submit",
								value:"提交"
							},{
								key:"Approval",
								value:"通过"
							},{
								key:"Reject",
								value:"驳回"
							}],
							handler:function(key,element){								
								widget.get("list").refresh();
							}
						}],
     			   time:{
					 	ranges:{
					 		"本月": [moment().startOf("month"), moment().endOf("month")],
					 		"三月内": [moment().subtract("month", 3).startOf("days"),moment().endOf("days")],
							"半年内": [moment().subtract("month", 6).startOf("days"),moment().endOf("days")],
							},
						defaultTime:"本月",
        				click:function(time){
        					widget.get("list").refresh();
        					console.info(widget.get("subnav").getValue("time").start);
						}
					}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/checkoutcardapply/query",
				fetchProperties:"*,membershipContract.membershipCard.name," +
						"membershipContract.membershipCard.cardType.name," +
						"membershipContract.memberShipFees," +
						"proposer.name," +
						"operator.name",
				params:function(){
					return {
						"createDate":widget.get("subnav").getValue("time").start,
						"createDateEnd":widget.get("subnav").getValue("time").end,
						"flowStatus":widget.get("subnav").getValue("flowStatusIn"),
					};
				},
				model:{
					columns:[{
						key:"membershipContract.membershipCard.name",
						name:i18ns.get("sale_card_name","会籍卡号"),
					},{
						key:"membershipContract.membershipCard.cardType.name",
						name:"卡号类型"
					},{
						key:"proposer.name",
						name:"申请人"
					},{
						key:"membershipContract.memberShipFees",
						name:"会籍卡费"
					},{
						key:"refunded",
						name:"是否退费",
						format:function(row,value){
							if(row){
								return "是";
							}else{
								return "否";
							}
						}
					},{
						key:"createDate",
						name:"申请日期",
						format:"date"
					},{
						key:"checkOutCardDate",
						name:"退卡日期 ",
						format:"date"
					},{
 						key:"flowStatus.value",
 						name:"状态"
 					},{
						key:"operator.name",
						name:"经手人"
					},{
						name:"查看权益人",
						format:"button",
						formatparams:[{
							key:"cardowner",
							text:"查看权益人",
							handler:function(index,data,rowEle){
								//个人
								widget.openView({
									url:"eling/elcms/sale/people/people",
									params:{
										pkMembershipContract : data.membershipContract.pkMembershipContract
									}
								});
							}
						}]
					},{
						key:"operate",
						name:"操作",
						format:function(value,row){
							if(row.flowStatus.key=="Submit"){
								return "button";
							}else{
								return "";
							}   
 						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								data.cardType = data.membershipContract.membershipCard.cardType.name;
								data.memberShipFees = data.membershipContract.memberShipFees;
								//重新对申请人下拉框赋值
								var proposerseldata=widget.get("card").getData("proposer");
								if(data.proposer){
									proposerseldata.push(data.proposer);
								}
								widget.get("subnav").hide("time").hide("search").hide(["flowStatusIn"]);
								widget.edit("edit",data);
								widget.get("card").setModel("proposer",proposerseldata || []);
								if(data.proposer){
									widget.get("card").setValue("proposer",data.proposer || "");
								}
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/checkoutcardapply/" + data.pkCheckOutCardApply + "/delete");
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return{
				compType:"form-2.0.0",
				saveaction:function(){
					widget.save("api/checkoutcardapply/save",$("#checkoutcard").serialize());
					widget.get("subnav").hide(["return"]).show("time").show("search").show(["flowStatusIn"]);
				},
				cancelaction:function(){
					widget.get("card").reset();
					widget.list2Card(false);
					widget.get("subnav").hide(["return"]).show("time").show("search").show(["flowStatusIn"]);
				},
				model:{
					id:"checkoutcard",
					items:[{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"pkCheckOutCardApply",
						type:"hidden"
					},{
						name:"flowStatus",
						type:"hidden",
						defaultValue:"Submit"
					},{
						name:"membershipContract",
						label:"会籍卡",
						type:"select",
						key:"pkMembershipContract",
						value:"membershipCard.name",
						url:"api/membershipcontract/queryNormal",
						params:{
							status:"Normal",//查询条件
							fetchProperties:"*,membershipCard.*,membershipCard.name,membershipCard.cardType.name"
						},
						multi:false,
						validate:["required"]
					},{
						name:"cardType",
						label:"卡类型",
						readonly:true
					},{
						name:"memberShipFees",
						label:"会籍卡费",
						readonly:true
					},{
						name:"proposer",
						label:"申请人",
						type:"select",
						url:"api/personalinfo/queryPersonalInfoByCard",
						key:"pkPersonalInfo",
						value:"name",
						lazy:true
					},{
						name:"checkOutCardDate",
						label:"退卡日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					
					},{
						name:"refunded",
						label:"是否退费",
						type:"radiolist",
						list:[{
							key:true,
							value:"是",
						},{
							key:false,
							value:"否"
						}],
						validate:["required"]
					},{
						name:"createDate",
						label:"申请日期",
						type:"date",
						mode:"Y-m-d",
						defaultValue:moment(),
						validate:["required"]
					},{
						name:"checkOutReason",
						label:"退卡原因",
						type:"textarea",
						height:"100"
					},{
						name:"operator",
						label:"经手人",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/user/role",//TODO 用户角色：wulina 销售
						params:{
        					roleIn:"3,17",
							fetchProperties:"pkUser,name"
						},
						multi:false,
						validate:["required"]
					}]
				}
			};
		}
			
	});
	module.exports = CheckOutCardApply;	
});