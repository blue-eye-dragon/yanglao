define(function(require,exports,module){
	var BaseView=require("baseview");
	
	var RoomUsage=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"房间信息用途报表",
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				compType:"simplereportgrid",
				url:"api/report/roominformationuse"
			};
		}
	});
	
	module.exports=RoomUsage;
});

