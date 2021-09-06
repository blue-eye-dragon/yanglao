define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var store=require("store");
	var Dialog = require("dialog");
	//多语
	var i18ns = require("i18n");
	var Checkintelecom = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"燃气卡验收",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/checkinimplement/search",
							data:{
								s:str,
								properties:"memberSigning.room.number,memberSigning.checkInDate,memberSigning.members.personalInfo.name,status",
								fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
								"status.value,checkInNaturalGas.*,checkInNaturalGas.disposeUser.*,checkInNaturalGas.acceptanceUser.*"
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
		                    value:"待验收"
						},{
		                    key:"Acceptance",
		                    value:"已验收"
						},{
							key:"Acceptance,Pended",
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
						"checkInNaturalGas.statusIn":subnav.getValue("handle"),
						fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
							"status.value,checkInNaturalGas.*,checkInNaturalGas.disposeUser.*,checkInNaturalGas.acceptanceUser.*"
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
						key:"checkInNaturalGas.acceptanceUser.name",
						name:"验收人"
					},{
						key:"checkInNaturalGas.acceptanceDate",
						name:"验收时间",
						format:"date"
					},{
						key:"status.value",
						name:"入住准备状态"
					},{
						key:"checkInNaturalGas.status.value",
						name:"天然气开卡状态"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							text:"验收",
							show:function(data,row){
								if(row.status.key=="Doing" && row.checkInNaturalGas.status.key=="Pended"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								widget.setData(data.checkInNaturalGas.pkCINaturalGas,widget); 
								widget.list2Card(true);
								widget.get("subnav").show(["return"]).hide(["handle","time","checkInStatus","search"]);
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"grid",
				model:{
					head:{
						buttons:[{
							id:"gridsave",
							icon:"icon-save",
							handler:function(){
								Dialog.mask(true);
								var params=widget.get("checkin");
								params.disposeUser=params.disposeUser.pkUser;
								params.status="Acceptance";
								params.acceptanceUser=store.get("user").pkUser;
								params.acceptanceDate=moment().valueOf();
								aw.saveOrUpdate("api/checkinnaturalgas/save", params, function(data){
									Dialog.mask(false);
									widget.get("list").refresh({
										"checkInNaturalGas.pkCINaturalGas":params.pkCINaturalGas,
										fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
										"status.value,checkInNaturalGas.*,checkInNaturalGas.disposeUser.*,checkInNaturalGas.acceptanceUser.*"
									});
									widget.list2Card(false);
									widget.get("subnav").hide(["return"]).show(["handle","time","checkInStatus","search"]);
								});
							}
						}]
					},
					columns:[{
						key:"name",
						name:"名称"
					},{
						key:"money",
						name:"预充金额(元)"
					}]
				}
			};
		},
		setData:function(pkCINaturalGas,widget){
			var pushData = [];
			aw.ajax({
				url:"api/checkinnaturalgas/" + pkCINaturalGas + "/get",
				success:function(data){
					widget.set("checkin",data);
					if(data.naturalGas){
						pushData.push({
							name:"天然气",
							money:data.naturalGasMoney
						});
					}
					widget.get("card").setData(pushData);
				}
			});
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			    widget.get("list").refresh({
			    	pkCIImplement:params.pkFather,
			    	fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
					"checkInNaturalGas.*,status.value,checkInNaturalGas.disposeUser.*,checkInNaturalGas.acceptanceUser.*"
			    });
			}else if(params && params.CheckInImplement){
				  widget.get("list").refresh({
					  pkCIImplement:params.CheckInImplement,
					  fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
						"checkInNaturalGas.*,status.value,checkInNaturalGas.disposeUser.*,checkInNaturalGas.acceptanceUser.*"
				  });
			} else {
				widget.get("list").refresh();
			}
		}
	});
	module.exports = Checkintelecom;
});