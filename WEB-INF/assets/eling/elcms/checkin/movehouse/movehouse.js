define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	var Dialog=require("dialog");
	var store=require("store");
	//多语
	var i18ns = require("i18n");
	var Company = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"入住派车处理",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/checkinimplement/search",
							data:{
								s:str,
								properties:"memberSigning.room.number,memberSigning.checkInDate,memberSigning.members.personalInfo.name,status",
								fetchProperties:"*,status.value,memberSigning.checkInDate,checkInMoveHouse.*,memberSigning.room.*,memberSigning.members,memberSigning.members.personalInfo.*"
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
							widget.list2Card(false);
							widget.show(".J-status,.J-checkInStatus,.J-time,.J-search").hide(".J-return");
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
		                    key:"Pending",
		                    value:"待处理"
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
						status:widget.get("subnav").getValue("checkInStatus"),
						"checkInMoveHouse.status":widget.get("subnav").getValue("status"),
						fetchProperties:"*,status.value,memberSigning.checkInDate,checkInMoveHouse.*,memberSigning.room.*,memberSigning.members,memberSigning.members.personalInfo.*"
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
							var ret = value.members[0] ? value.members[0].personalInfo.name : "";
							var mobilePhone=value.members[0] ? value.members[0].personalInfo.mobilePhone : "";
							if(mobilePhone){
								ret+=" "+mobilePhone;
							}
							return ret;
						}
					},{
						key:"memberSigning",
						name:i18ns.get("sale_ship_owner","会员")+"2",
						format:function(value,row){
							var ret = value.members[1] ? value.members[1].personalInfo.name : "";
							var mobilePhone=value.members[1] ? value.members[1].personalInfo.mobilePhone : "";
							if(mobilePhone){
								ret+=" "+mobilePhone;
							}
							return ret;
						}
					},{
						key:"status.value",
						name:"入住准备状态"
					},{
						key:"checkInMoveHouse.status.value",
						name:"派车状态"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							text:"处理",
							show:function(data,row){
								if(row.status.key=="Doing" && row.checkInMoveHouse.status.key=="Pending"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								widget.setData(data.checkInMoveHouse.pkCIMovehouse,data.memberSigning.room.number,widget); 
								widget.hide(".J-status,.J-checkInStatus,.J-time,.J-search").show(".J-return");
								widget.list2Card(true);
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					var data=widget.get("card").getData();
					data.disposeDate=moment().valueOf();
					data.disposeUser=store.get("user").pkUser;
					data.status="Pended";
					data.sendCar=true;
					data.sendCarConfirm=true;
					widget.save("api/checkinmovehouse/save",data,function(){
						widget.list2Card(false);
						widget.show(".J-status,.J-checkInStatus,.J-time,.J-search").hide(".J-return");
						widget.get("list").refresh({
							"checkInMoveHouse.pkCIMovehouse":data.pkCIMovehouse,
							fetchProperties:"*,status.value,memberSigning.checkInDate,checkInMoveHouse.*,memberSigning.room.*,memberSigning.members,memberSigning.members.personalInfo.*"
						});
						return false;
					});
				},
				//取消按钮
  				cancelaction:function(){
  					widget.list2Card(false);
					widget.show(".J-status,.J-checkInStatus,.J-time,.J-search").hide(".J-return");
					return false;
  				},
				model:{
					id:"movehouse",
					items:[{
						name:"pkCIMovehouse",
						type:"hidden"
					},{
						name:"version",
						type:"hidden"
					},{
						name:"roomnumber",
						label:"房间号",
						readonly:true
					},{
						name:"moveHouseDate",
						label:"派车时间",
						readonly:true
					},{
						name:"address",
						label:"派车地址",
						type:"textarea",
						readonly:true
					},{
						name:"corpName",
						label:"公司名称"
					},{
						name:"driverName",
						label:"司机名称"
					},{
						name:"driverPhone",
						label:"司机电话"
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		},
		setData:function(pkCIMovehouse,roomnumber,widget){
			aw.ajax({
				url:"api/checkinmovehouse/query",
				data:{
					pkCIMovehouse:pkCIMovehouse
				},
				success:function(data){
					if(data && data[0]){
						data[0].roomnumber=roomnumber;
						if(data[0].moveHouseDate){
							data[0].moveHouseDate=moment(data[0].moveHouseDate).format("YYYY-MM-DD HH:mm");
						}
						widget.get("card").setData(data[0]);
					}
				}
			});
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			    widget.get("list").refresh({
			    	pkCIImplement:params.pkFather,
			    	fetchProperties:"*,status.value,memberSigning.checkInDate,checkInMoveHouse.*,memberSigning.room.*,memberSigning.members,memberSigning.members.personalInfo.*"
			    });
			}else if(params && params.CheckInImplement){
				widget.get("list").refresh({
					pkCIImplement:params.CheckInImplement,
					fetchProperties:"*,status.value,memberSigning.checkInDate,checkInMoveHouse.*,memberSigning.room.*,memberSigning.members,memberSigning.members.personalInfo.*"
				});
			} else {
				widget.get("list").refresh();
			}
		} 
	});
	module.exports = Company;
});