define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>";
	
	function loadGrid(widget,room){
		aw.ajax({
			url : "api/location/queryareamember",
			type : "POST",
			data : {
				"pkRoom":room,
            	fetchProperties:"pkMember," +
            			"personalInfo.pkPersonalInfo," +
            			"personalInfo.name," +
            			"personalInfo.birthday," +
            			"personalInfo.sex," +
            			"memberSigning.pkMemberSigning," +
            			"memberSigning.card.pkMemberShipCard," +
            			"memberSigning.membershipContract.pkMembershipContract," +
            			"memberSigning.room.pkRoom," +
            			"memberSigning.room.number," +
            			"memberSigning.room.building.pkBuilding," +
            			"memberSigning.room.telnumber",
			},
			success : function(datas) {
				widget.get("grid").setData(datas);
				var subnav=widget.get("subnav");
				widget.get("grid").setTitle(subnav.getText("activityRoom")+"会员数"+datas.length);
			}
		});
	}

    var ActivityRoomMemberNum = ELView.extend({
        attrs:{
        	template:template
        },
        events:{
			"click .J-detail" : function(e){
				var flg=$(e.target).attr("data-key3");
				this.openView({
					url:"eling/elcms/membercenter/member/member",
					params:{
						pkBuilding:$(e.target).attr("data-key5"),
						pkMemberSigning:$(e.target).attr("data-key2"),
						pkRoom:$(e.target).attr("data-key3"),
						pkMember:$(e.target).attr("data-key"),
						pkCard:$(e.target).attr("data-key4"),
						flg:"activityroommembernum"
					},
				});
			}
		},
        initComponent:function(params,widget){
        	var subnav=new Subnav({
			parentNode:".J-subnav",
               model:{
            	    title:"活动室会员查看",
            	    items : [{
            	    	id : "activityRoom",
						type : "buttongroup",
						keyField : "room.pkRoom",
						valueField : "name",
						tip:"活动室",
						handler : function(key,value){
							loadGrid(widget,key);
						}
					}]
               	 }
			});
			this.set("subnav",subnav);
    			
            var grid=new Grid({
        		parentNode:".J-grid",
        		autoRender:false,
                model:{
                	url : "api/location/queryareamember",
	            	params : function(){
	                    return {
	                    	"pkRoom":widget.get("subnav").getValue("activityRoom"),
	                    	fetchProperties:"pkMember," +
	                    			"personalInfo.pkPersonalInfo," +
	                    			"personalInfo.name," +
	                    			"personalInfo.birthday," +
	                    			"personalInfo.sex," +
	                    			"memberSigning.pkMemberSigning," +
	                    			"memberSigning.card.pkMemberShipCard," +
	                    			"memberSigning.membershipContract.pkMembershipContract," +
	                    			"memberSigning.room.pkRoom," +
	                    			"memberSigning.room.number," +
	                    			"memberSigning.room.building.pkBuilding," +
	                    			"memberSigning.room.telnumber",
	                    };
	                },
                    columns:[{
                        name:"personalInfo.name",
                        label:"姓名",
                        format:function(value,row){
                        	var room=row.memberSigning.room;
                        	var build="";
                        	if(room){
                        		build=row.memberSigning.room.building.pkBuilding;
                        	}
    						return "<a href='javascript:void(0);' style='color:red;' class='J-detail' data-key='"+row.pkMember+"' " +
    								"data-key2='"+row.memberSigning.pkMemberSigning+"' " +
    								"data-key4='"+row.memberSigning.card.pkMemberShipCard+"' " +
    								"data-key3='"+widget.get("subnav").getValue("activityRoom")+"' " +
    								"data-key5='"+build+"'>"+value+"</a>";
    					}
                    },{
						name:"personalInfo.birthday",
						label:"年龄",
						format:"age"
					},{
						name:"personalInfo.sex.value",
						label:"性别"
					},{
						name:"memberSigning.room.number",
						label:"房间号"
					},{
						name:"memberSigning.room.telnumber",
						label:"房间电话"
					}]
				}
            });
            this.set("grid",grid);
        },
        afterInitComponent:function(params,widget){
    		var subnav=widget.get("subnav");
	       	subnav.load("activityRoom",{
	       		url : "api/activityroom/query",
	       		params : function(){
	       			return {
	       				fetchProperties : "pkActivityRoom,name,room.pkRoom"
					};
	       		 },
	             callback : function(data){
	            	 if(params){
	            		widget.get("subnav").setValue("activityRoom",params.pkRoom);
	             		loadGrid(widget,params.pkRoom);
	             	}else{
	               	 loadGrid(widget,data[0].room.pkRoom);
	             	}
	             }
	       	})
		}
    });
    module.exports = ActivityRoomMemberNum;
});