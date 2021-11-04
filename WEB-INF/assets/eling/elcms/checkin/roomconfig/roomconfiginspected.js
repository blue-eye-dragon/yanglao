define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Dialog=require("dialog-1.0.0");
	var store=require("store");
	var aw=require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var Company = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"入住配置验收",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/checkinimplement/search",
							data:{
								s:str,
								properties:"memberSigning.room.number,memberSigning.checkInDate,memberSigning.members.personalInfo.name,status",
								fetchProperties:"*,memberSigning.checkInDate,checkInRoomConfing.*,checkInRoomConfing.disposeUser.name,memberSigning.room.*" +
								",memberSigning.members,status.value,memberSigning.members.personalInfo.*",
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
						handler:function(){
							widget.get("subnav").show(["status","checkInStatus","search","time"]).hide(["return"]);
							widget.list2Card(false);
							return false;
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
						id:"status",
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
						"checkInRoomConfing.statusIn":widget.get("subnav").getValue("status"),
						status:widget.get("subnav").getValue("checkInStatus"),
						"memberSigning.checkInDate":time.start, 
						"memberSigning.checkInDateEnd":time.end,
						fetchProperties:"*,memberSigning.checkInDate,checkInRoomConfing.*,checkInRoomConfing.disposeUser.name,memberSigning.room.*" +
								",status.value,memberSigning.members,memberSigning.members.personalInfo.*,checkInRoomConfing.acceptanceUser.*",
					};
				},
				autoRender:false,
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号"
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
						key:"checkInRoomConfing.acceptanceUser.name",
						name:"验收人"
					},{
						key:"checkInRoomConfing.acceptanceDate",
						name:"验收时间",
						format:"date"
					},{
						key:"status.value",
						name:"入住准备状态"
					},{
						key:"checkInRoomConfing.status.value",
						name:"入住配置状态"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							text:"验收",
							show:function(data,row){
								if(row.status.key=="Doing" && row.checkInRoomConfing.status.key=="Pended"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								widget.setData(data.checkInRoomConfing.pkCIRoomConfig,data.memberSigning.room.number,widget); 
								widget.get("subnav").hide(["status","checkInStatus","search","time"]).show(["return"]);
								//设置4个checkbox
								$(".J-individuDemandConfirm").prop("checked",true);
								$(".J-beddingConfirm").prop("checked",true);
								$(".J-fitmentPosiConfirm").prop("checked",true);
								$(".J-keyNumberConfirm").prop("checked",true);
								widget.list2Card(true);
								//设置4个checkbox不可编辑
								$(".J-individuDemandConfirm").prop("disabled","disabled");
								$(".J-beddingConfirm").prop("disabled","disabled");
								$(".J-fitmentPosiConfirm").prop("disabled","disabled");
								$(".J-keyNumberConfirm").prop("disabled","disabled");
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					var params=widget.get("roomconfig");
					params.disposeUser=params.disposeUser.pkUser;
					params.status="Acceptance";
					params.acceptanceUser=store.get("user").pkUser;
					params.acceptanceDate=moment().valueOf();
					widget.save("api/checkinroomconfig/save",params,function(data){
						widget.get("list").refresh({
							"checkInRoomConfing.pkCIRoomConfig":params.pkCIRoomConfig,
							fetchProperties:"*,memberSigning.checkInDate,checkInRoomConfing.*,checkInRoomConfing.disposeUser.name,memberSigning.room.*" +
							",status.value,memberSigning.members,memberSigning.members.personalInfo.*,checkInRoomConfing.acceptanceUser.*",
						});
						widget.get("subnav").show(["status","checkInStatus","search","time"]).hide(["return"]);
						widget.list2Card(false);
					});
//					widget.save("api/checkinroomconfig/acceptance",$("#roomconfing").serialize(),function(data){
//						widget.get("list").refresh();
//						widget.list2Card(false);
//						widget.get("subnav").show(["status","checkInStatus"]).hide(["return"]);
//					});
				},
				cancelaction:function(){
					widget.list2Card(false);
					widget.get("subnav").show(["status","checkInStatus","search","time"]).hide(["return"]);
					return false;
				},
				model:{
					id:"roomconfing",
					saveText :"验收",
					items:[{
						name:"pkCIRoomConfig",
						type:"hidden"
					},{
						name:"version",
						type:"hidden"
					},{
						name:"roomnumber",
						label:"房间号",
						readonly:true
					},{
						name:"individuDemand",
						label:"个性化需求",
						format:function(){
							var h = '<div class="col-md-7 format_line">'+
									'	<input name="individuDemand" class="form-control J-individuDemand" value="" type="text" readonly="readonly/">' +
									'</div>' +
									'<label class="col-md-4 format_line control-label">个性化需求确认</label>' +
									'<div class="col-md-1 format_line"><label class="checkbox-inline">' +
									'	<input name="individuDemandConfirm" readonly="readonly" value="true" type="checkbox" class="J-individuDemandConfirm J-individuDemandConfirm-true">'+
									'</label></div>';
							return h;
						}
					},{
						name:"bedding",
						label:"床品（套）",
						format:function(){
							var h = '<div class="col-md-7 format_line">'+
									'	<input name="bedding" class="form-control J-bedding" value="" type="text" readonly="readonly/">' +
									'</div>' +
									'<label class="col-md-4 format_line control-label">床品确认</label>' +
									'<div class="col-md-1 format_line"><label class="checkbox-inline">' +
									'	<input name="beddingConfirm" value="true" type="checkbox" class="J-beddingConfirm J-beddingConfirm-true" />'+
									'</label></div>';
							return h;
						}
					},{
						name:"fitmentPosi",
						label:"家具位置",
						format:function(){
							var h = '<div class="col-md-7 format_line">'+
									'	<input name="fitmentPosi" class="form-control J-fitmentPosi" value="" type="text" readonly="readonly/">' +
									'</div>' +
									'<label class="col-md-4 format_line control-label">家具位置确认</label>' +
									'<div class="col-md-1 format_line"><label class="checkbox-inline">' +
									'	<input name="fitmentPosiConfirm" readonly="readonly" value="true" type="checkbox" class="J-fitmentPosiConfirm J-fitmentPosiConfirm-true">'+
									'</label></div>';
							return h;
						}
					},{
						name:"keyNumber",
						label:"钥匙数量",
						format:function(){
							var h = '<div class="col-md-7 format_line">'+
									'	<input name="keyNumber" class="form-control J-keyNumber" value="" type="text" readonly="readonly/">' +
									'</div>' +
									'<label class="col-md-4 format_line control-label">钥匙数量确认</label>' +
									'<div class="col-md-1 format_line"><label class="checkbox-inline">' +
									'	<input name="keyNumberConfirm" readonly="readonly" value="true" type="checkbox" class="J-keyNumberConfirm J-keyNumberConfirm-true">'+
									'</label></div>';
							return h;
						}
					},{
						name:"description",
						label:"备注",
						type:"textarea",
//						readonly:true
					}]
				}
			};
		},
		setData:function(pkCIRoomConfig,roomnumber,widget){
			aw.ajax({
				url:"api/checkinroomconfig/query",
				data:{
					pkCIRoomConfig:pkCIRoomConfig
				},
				success:function(data){
					if(data && data[0]){
						data[0].roomnumber=roomnumber;
						widget.set("roomconfig",data[0]);
						widget.get("card").setData(data[0]);
					}
				}
			});
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			    widget.get("list").refresh({
			    	pkCIImplement:params.pkFather,
			    	fetchProperties:"*,memberSigning.checkInDate,checkInRoomConfing.*,checkInRoomConfing.disposeUser.name,memberSigning.room.*" +
					",status.value,memberSigning.members,memberSigning.members.personalInfo.*,checkInRoomConfing.acceptanceUser.*"
			    });
			}else if(params && params.CheckInImplement){
				  widget.get("list").refresh({
					  pkCIImplement:params.CheckInImplement,
					  fetchProperties:"*,memberSigning.checkInDate,checkInRoomConfing.*,checkInRoomConfing.disposeUser.name,memberSigning.room.*" +
						",status.value,memberSigning.members,memberSigning.members.personalInfo.*,checkInRoomConfing.acceptanceUser.*"
				  });
			} else {
				widget.get("list").refresh();
			}
		}
	});
	module.exports = Company;
});