/**
 * 活动室详情
 * @author zp
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>" +
	 "<div class='J-detailgrid hidden'></div>";
	var end;
	var detaildata ={};
	
	function loadGrid(widget){
		Dialog.loading(true);
		var now = moment();
		end = now;
		aw.ajax({
			url : "api/activityroomdetail/queryDetail",
			type : "POST",
			data : {
				"startTime":moment().startOf('day').valueOf(),
				"startTimeEnd":moment().endOf('day').valueOf(),
				"endTime":moment().startOf('day').valueOf(),
				"endTimeEnd":moment().endOf('day').valueOf(),
				"inTime":moment().startOf('day').valueOf(),
				"inTimeEnd":now.valueOf(),
            	fetchProperties:"activityRoom.pkActivityRoom," +
            			"activityRoom.name," +
            			"activityRoom.room.number," +
            			"activityRoom.locator," +
            			"activitys," +
            			"personNum," +
            			"members.pkMember," +
            			"members.memberSigning.room.number," +
            			"members.personalInfo.name," +
            			"members.personalInfo.sex," +
            			"members.personalInfo.birthday," +
            			"members.memberSigning.room.telnumber",
			},
			success : function(datas) {
				Dialog.loading(false);

				var grid=widget.get("grid");
				grid.setData(datas);
				grid.setTitle(moment().format('YYYY年MM月DD日'));
			}
		});
	}

    var ActivityRoomDetail = ELView.extend({
        attrs:{
        	template:template
        },
        events:{
			"click .J-detail" : function(e){
				var grid = this.get("grid");
				var index = grid.getIndex(e.target);
				var data = grid.getData(index);
				var detailgrid = this.get("detailgrid");
				detaildata = data;
				detailgrid.setData(data.members);
				detailgrid.setTitle(data.activityRoom.name+"活动室"+data.personNum+"人");
				this.get("subnav").setTitle("活动室到场人数");
				this.show([".J-detailgrid"]).hide(".J-grid");
				this.get("subnav").hide(["refresh","toexcel"]).show(["return","toexceldetail"]);
			}
		},
        initComponent:function(params,widget){
        	var subnav=new Subnav({
			parentNode:".J-subnav",
               model:{
            	    title:"活动室详情",
            	    items : [{
            	    	id : "refresh",
						type : "button",
						text : "刷新",
						handler : function(key,value){
							loadGrid(widget,key);
						}
					},{
            	    	id : "toexcel",
						type : "button",
						text : "导出",
						handler : function(key,value){
							window.open("api/activityroomdetail/toexcel?startTime="+moment().startOf('day').valueOf()+
							"&startTimeEnd="+moment().endOf('day').valueOf()+
							"&endTime="+moment().startOf('day').valueOf()+
							"&endTimeEnd="+moment().endOf('day').valueOf()+
							"&inTime="+moment().startOf('day').valueOf()+
							"&inTimeEnd="+end.valueOf());
							return false;
						}
					},{
						id : "toexceldetail",
						type : "button",
						show : false,
						text : "导出",
						handler : function(key,value){
							var members = [];
							for(var i in detaildata.members){
								members.push(detaildata.members[i].pkMember);
							}
							window.open("api/activityroomdetail/toexceldetail?members="+members+
									"&activity="+detaildata.activityRoom.name+
									"&personNum="+detaildata.personNum);
									return false;
						}
					},{
						id : "return",
						type : "button",
						show : false,
						text : "返回",
						handler : function(key,value){
							widget.show([".J-grid"]).hide(".J-detailgrid");
							widget.get("subnav").show(["refresh","toexcel"]).hide(["return","toexceldetail"]);
						}
					}]
               	 }
			});
			this.set("subnav",subnav);
    			
            var grid=new Grid({
        		parentNode:".J-grid",
        		autoRender:false,
                model:{
                    columns:[{
                        name:"activityRoom.name",
                        label:"名称",
                    },{
						name:"activityRoom.room.number",
						label:"房间号",
					},{
						name:"activityRoom.locator",
						label:"定位探头",
						format:function(value,row){
							if(value){
								return "有";
							}else{
								return "无";
							}
						}
					},{
						name:"activitys",
						label:"活动名称",
					},{
						name:"personNum",
						label:"到场人数",
						format:function(value,row){
							return "<a href='javascript:void(0);' style='color:red;' class='J-detail'>"+value+"</a>";
						},
					}]
				}
            });
            this.set("grid",grid);
            
            var detailgrid=new Grid({
        		parentNode:".J-detailgrid",
        		autoRender:false,
                model:{
                    columns:[{
                        name:"personalInfo.name",
                        label:"会员",
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
            this.set("detailgrid",detailgrid);
            
            
        },
        afterInitComponent:function(params,widget){
    		var subnav=widget.get("subnav");
       	 	loadGrid(widget);
		}
    });
    module.exports = ActivityRoomDetail;
});