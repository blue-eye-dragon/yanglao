define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
    var Dialog=require("dialog-1.0.0");
	//多语
	var i18ns = require("i18n");
	var checkinnursinghomeregisteredconfirm = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"入住颐养院确认",
					buttonGroup:[{
						id:"building",
						tip:"楼宇",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"flowStatus",
						tip:"状态",
						items:[{
							key:"NotConfirm",
							value:"未确认"
						},{
							key:"Confirm",
							value:"已确认"
						},{
							key:"",
							value:"全部"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
					buttons:[{
						id:"Confirm",
						text:"确认",
						handler:function(){
							var old=widget.get("list").getSelectedData();
							var pks="";
                         	for(var i=0; i<old.length;i++){
                         		pks+=old[i].pkCheckInNursingHomeRegistered+",";
                         	}
                            aw.ajax({
                                url : "api/checkinnursinghomeregistered/Confirm",
                                type : "POST",
                                data : {
                               	 	pk:pks,
                                },
                               success : function(data){
                            	   if(data.msg){
                            		   Dialog.tip({
                            			   title:data.msg
                            		   });
                            	   }
                            	   widget.get("list").refresh();
                                }
                            });
						}
					},{
                        id : "toexcel",
                        text : "导出",
                        handler : function(){
                        	window.open("api/checkinnursinghomeregistered/toexcel?pkBuilding="+widget.get("subnav").getValue("building")
                        			+ "&flowStatus="+widget.get("subnav").getValue("flowStatus")); 
                        	return false;
                        }                    
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/checkinnursinghomeregistered/query",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						pkBuilding:subnav.getValue("building"),
						flowStatus:subnav.getValue("flowStatus"),
						fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number," +
								"member.memberSigning.room.pkRoom,member.memberSigning.card.cardType.name"
					};
				},
				model:{
					isCheckbox:true,
					columns:[{
						col:1,
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						col:1,
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						col:1,
						key:"checkInDate",
						name:"入住日期",
						format:"date"
					},{
						col:1,
						key:"checkOutDate",
						name:"返回日期",
						format:"date"
					},{
						col:1,
						key:"roomNumber",
						name:"颐养院房间号"
					},{
						col:1,
						key:"causes",
						name:"入住原因"
					},{
						col:1,
						key:"member.memberSigning.card.cardType.name",
						name:"卡型"
					},{
						col:1,
						key:"checkinType.value",
						name:"入住类型"
					},{
						col:1,
						key:"description",
						name:"备注"
					},{
						col:1,
						key:"status.value",
						name:"住院状态"
					},{
						col:1,
						key:"flowStatus.value",
						name:"状态"
					}]
				}
			};
		}
	});
	module.exports = checkinnursinghomeregisteredconfirm;
});