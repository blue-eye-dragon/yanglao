define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var Dialog = require("dialog");
	//多语
	var i18ns = require("i18n");
var furnshing = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{ 
					title:"入住资产确认",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/checkinimplement/search",
							data:{
								s:str,
								properties:"memberSigning.room.number,memberSigning.checkInDate,memberSigning.members.personalInfo.name,status",
								fetchProperties:"memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
								"memberSigning.room.pkRoom,status.value,checkInFurinshing.confirmUser.name,checkInFurinshing.confirmDate," +
								"checkInFurinshing.status,checkInFurinshing.version,checkInFurinshing.pkCIFurnishing",
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
							widget.get("subnav").show(["handle","checkInStatus","search","time"]).hide(["save","return"]);
							widget.list2Card(false);
							return false;
						}
					},{
						id:"save",
						text:"确认",
						show:false,
						handler:function(){
							Dialog.mask(true);
							var	data={};
							data.pkCIFurnishing=$(".J-card").attr("data-pk");
							data.status="Pended";
							data.version=$(".J-card").attr("data-version");
							aw.ajax({
								url:"api/checkinfurnishing/save",
								type:"POST",
								data:aw.customParam(data),
								success:function(data){
									Dialog.mask(false);
									$(".J-card").attr("data-pk","");
									$(".J-card").attr("data-version","");
									widget.get("list").refresh({
										"checkInFurinshing.pkCIFurnishing":data.pkCIFurnishing,
										fetchProperties:"memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
										"memberSigning.room.pkRoom,status.value,checkInFurinshing.confirmUser.name,checkInFurinshing.confirmDate," +
										"checkInFurinshing.status,checkInFurinshing.version,checkInFurinshing.pkCIFurnishing"
									});
									widget.get("subnav").show(["handle","checkInStatus","search","time"]).hide(["save"],["return"]);
									widget.list2Card(false);
									return false;
								}
							});
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
		                    key:"UnConfirmed",
		                    value:"未确认",
						},{
		                    key:"Pended",
		                    value:"已确认"
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
				url : "api/checkinfurnishing/query",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return{
						"memberSigning.checkInDate":time.start, 
						"memberSigning.checkInDateEnd":time.end,
						status:widget.get("subnav").getValue("checkInStatus"),
						"checkInFurinshing.status":widget.get("subnav").getValue("handle")
					};
				},
				fetchProperties:"memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
					"memberSigning.room.pkRoom,status.value,checkInFurinshing.confirmUser.name,checkInFurinshing.confirmDate," +
					"checkInFurinshing.status,checkInFurinshing.version,checkInFurinshing.pkCIFurnishing",
				autoRender:false,
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号",
					},{
						key:"memberSigning.checkInDate",
						name:"入住时间",
						format:"date",
					},{
						key:"memberSigning",
						name:i18ns.get("sale_ship_owner","会员")+"1",
						format:function(value,row){
							if(!value || value.members[0]==null){
								return "";
							}
							return value.members[0].personalInfo.name;
						}
					},{
						key:"memberSigning",
						name:i18ns.get("sale_ship_owner","会员")+"2",
						format:function(value,row){
							if(!value || value.members[1]==null){
								return "";
							}
							return value.members[1].personalInfo.name;
						}
					},{
						key:"checkInFurinshing.confirmUser.name",
						name:"确认人"
					},{
						key:"checkInFurinshing.confirmDate",
						name:"确认时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"status.value",
						name:"入住准备状态"
					},{
						key:"checkInFurinshing.status.value",
						name:"入住资产确认状态",
						format:function(value,row){
							return value=row.checkInFurinshing.status.key=="UnConfirmed"?"未确认":"已确认"
						}
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							text:"确认",
							show:function(data,row){
								if(row.status.key=="Doing" && row.checkInFurinshing.status.key=="UnConfirmed"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								widget.list2Card(true);
								$(".J-card").attr("data-pk",data.checkInFurinshing.pkCIFurnishing);
								$(".J-card").attr("data-version",data.checkInFurinshing.version);
								widget.get("card").refresh({
									pkRoom:data.memberSigning.room.pkRoom
								});
								widget.get("subnav").show(["save"],["return"]).hide(["handle","checkInStatus","search","time"]);
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType : "grid",
				autoRender:false,
				url:"api/checkinfurnishing/queryAssetNameByRoom",
				model : {
					columns:[{
						key:"",
						name:"资产目录名称"
					},{
						key:"",
						name:"资产卡片名称"	
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			    widget.get("list").refresh({
			    	pkCIImplement:params.pkFather,
			    	fetchProperties:"memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
					"memberSigning.room.pkRoom,status.value,checkInFurinshing.confirmUser.name,checkInFurinshing.confirmDate," +
					"checkInFurinshing.status,checkInFurinshing.version,checkInFurinshing.pkCIFurnishing",
			    });
			}else if(params && params.CheckInImplement){
				  widget.get("list").refresh({
					  pkCIImplement:params.CheckInImplement,
					  fetchProperties:"memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
						"memberSigning.room.pkRoom,status.value,checkInFurinshing.confirmUser.name,checkInFurinshing.confirmDate," +
						"checkInFurinshing.status,checkInFurinshing.version,checkInFurinshing.pkCIFurnishing",
				  });
			} else {
				widget.get("list").refresh();
			}
		}
	});
	module.exports = furnshing;
});