define(function(require, exports, module) {
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Grid = require("grid");
	var emnu = require("enums");
	var FunctionProperties={
		queryActRoom :function(startTime,endTime,grid){
	   		 var data = {};
	   		 data.startTime=startTime;
	   		 data.endTime=endTime;
	   		 data.fetchProperties="pkActivityRoom," +
				   		 		  "name," +
								  "room.number," +
								  "galleryful," +
								  "theme," +
								  "openingTime," +
								  "endingTime"
	   		 aw.ajax({
				url:"api/activityroom/queryIdlebyTimes",
				data:aw.customParam(data),
				dataType:"json",
				success:function(data){
					grid.setData(data);
					actRoomData = data;
				}
			})
        },
        refreshActivitySelect : function(widget){
            aw.ajax({
            	url : "api/activityroomreserve/queryactivity",
				data : {
					fetchProperties:"pkActivity,theme",
                 },
				dataType:"json",
				type : "POST",
				success : function(result){
					var form = widget.get("form")
					form.setData("activity",result);
				}
			});
        },
        activityRoomGrid : function(widget){
          	 return new Grid({
          		 isInitPageBar:false,
                   model:{
                       columns:[{
                           key:"name",
                           name:"活动室"
                       },{
                       	key:"room.number",
                       	name:"房间号"
                       },{
   						key:"galleryful",
   						name:"可容纳人数"
   					},{
   						key:"theme",
   						name:"主题"
   					},{
   						key:"openingTime",
   						name:"开放时间",
   						format:"date"
   					},{
   						key:"endingTime",
   						name:"结束时间",
   						format:"date"
   					},{
   						key:"operate",
   						name:"操作",
   						format:"button",
   						formatparams:[{
   							key:"order",
   							text:"预订",
   							handler:function(index,data,rowEle){
   								var form=widget.get("form");
   								form.setValue("activityRoom",data.pkActivityRoom);
   								form.setValue("activityRoomName",data.name);
   								Dialog.close();
   							}
   						}]
   					}]
   				}
           });
        },
        getWeek : function(startTime){
        	var result;
        	var week = moment(startTime).weekday();
        	switch (week) {
        	case 1:
        		result = "星期一"
        		break;
        	case 2:
        		result = "星期二"
        		break;
        	case 3:
        		result = "星期三"
        		break;
        	case 4:
        		result = "星期四"
        		break;
        	case 5:
        		result = "星期五"
        		break;
        	case 6:
        		result = "星期六"
        		break;
        	default :
        		result = "星期日"
        		break;
        	}
        	return result;
        }
	}
	module.exports = FunctionProperties;
})