define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");

	var EmergencyContact = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"紧急联系人查询",
					buttons : [],
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("subnav").load({
								id:"defaultMembers",
								params:{
									"memberSigning.room.building.pkBuilding":key,
									fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
								},
								callback:function(data){
									widget.get("list").refresh();
								}
							});
						}
					},{
						id : "defaultMembers",
						handler : function(key, element) {
							widget.get("list").refresh();
						}
					}]
                }
			};
		},
		initList:function(widget){
			return {
				autoRender:false,
    			url:"api/emergencycontactperson/query",
    			params : function() {
    				return {
    					"memberSigning.members.pkMember" : widget.get("subnav").getValue("defaultMembers")
    				}
    			},
 				fetchProperties:"personalInfo.name," +
					"memberSigning.room.number," +
					"personalInfo.phone," +
					"personalInfo.mobilePhone," +
					"personalInfo.address",
 				model : {
 					columns:[{
 						name : "房间号",
 						key : "memberSigning.room.number"
 					},{
 						name : "紧急联系人",
 						key : "personalInfo.name"
 					},{
 						name : "手机",
 						key : "personalInfo.mobilePhone"
 					},{
 						name : "电话",
 						key : "personalInfo.phone"
 					},{
 						name : "地址",
 						key : "personalInfo.address"
 					}]
 				}
			};
		},
		afterInitComponent : function(params, widget) {
			widget.get("subnav").load({
				id : "defaultMembers",
				params : {
					"memberSigning.room.building" : widget.get("subnav").getValue("building"),
					fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
				},
				callback : function() {
					widget.get("list").refresh();
				}
			});
		}
	});

	module.exports = EmergencyContact;
});