define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
    var housekeepingconfirm = BaseView.extend({
        initSubnav:function(widget){
        	return {
        		model:{
        			title:"保洁确认",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.list2Card(false);
							widget.get("subnav").hide(["return"]).show(["flowStatus","building"]);
						}
					}],
 					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
 						id:"flowStatus",
 						items:[{
 		                    key:"Unconfirmed",
 		                    value:"待确认"
 						},{
 							key:"Finish",
 							value:"确认完毕"
 						}],
 						handler:function(key,element){
 							widget.get("list").refresh();
 						}
 					}]
              }
        	};
        },
        initList:function(widget){
        	return {
        		url:"api/housekeepingappointed/query",
        		params:function(){
        			var subnav=widget.get("subnav");
        			return {
        				flowStatus:subnav.getValue("flowStatus"),
        				"member.memberSigning.room.building":subnav.getValue("building"),
        				fetchProperties:"*,member.personalInfo.name,housekeepingType.name,member.memberSigning.room.number," +
        					"member.memberSigning.room.pkRoom,housekeepingers.name,housekeepingers.phone,confirmPerson.name"
        			};
    			},
    			model:{
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						key:"housekeepingType.name",
						name:"保洁类型"
					},{
						key:"appointedDate",
						name:"预约时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"housekeepingers.name",
						name:"保洁员"
					},{
						key:"housekeepingers.phone",
						name:"保洁员电话"
					},{
						key:"confirmPerson.name",
						name:"确认人"
					},{
						key:"descriptionConfirm",
						name:"备注"
					},{
	                    key:"flowStatus",
	                    name : "操作",
	                    format:function(value,row){
	                       if(value.key=="Unconfirmed"){
	                    	   return "button";
	                       }else{
	                    	   return "";
	                       }
	                    },
	                    formatparams:[{
	                    	key:"reset",
	                    	text:"确认",
	                    	handler:function(index,data,rowEL){
	                    		widget.edit("edit",data);
								widget.get("subnav").show(["return"]).hide(["flowStatus","building"]);
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
        			widget.save("api/housekeepingappointed/confirm",$("#housekeepingappointed").serialize(),function(data){
        				widget.get("list").refresh();
        				widget.list2Card(false);
						widget.get("subnav").hide(["return"]).show(["flowStatus","building"]);
					});
				},
				cancelaction:function(){
					widget.list2Card(false);
					widget.get("subnav").hide(["return"]).show(["flowStatus","building"]);
				},
				model:{
					id:"housekeepingappointed",
					items:[{
						name:"pkHousekeepingAppointed",
						type:"hidden"
					},{
						name:"version",
						type:"hidden"
					},{
						name:"descriptionConfirm",
						label:"备注",	
						type:"textarea",
						validate:["required"]
					}]
				}
        	};
        }
    });
    module.exports = housekeepingconfirm;	
});