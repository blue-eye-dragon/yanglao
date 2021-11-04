define(function(require,exports,module){
	var Subnav_condition = {
		building : function(){
			return{
				id:"building",
				type:"buttongroup",
				tip:"楼宇",
				business : "refreshWidgets"
			};
		},
		finishStatus : function(){
			return {
				id:"status",
				type:"buttongroup",
				tip:"任务状态",
				items:[{key:true,value:"待处理"},{key:false,value:"已完成"}],
				business : "refreshWidgets"
			};
		},
		time:function(){
			return {
				id:"time",
				type:"time",
				defaultTime:"今天",
				business : "refreshWidgets"
			};
		},
		searchMemberByRoomNameCardNO : function(){
			return {
				id : "searchMemberByRoomNameCardNO",
				type : "search",
				placeholder:"会员：房间号/姓名/卡号",
				business : "searchMemberByRoomNameCardNO"
			};
		},
		searchMemberByIdentify : function(){
			return {
				id : "searchMemberByIdentify",
				type : "search",
				placeholder:"会员：身份证",
				business : "searchMemberByIdentify"
			};
		},
		searchMemberByIdentifyAndNumber : function(){
			return {
				id : "searchMemberByIdentifyAndNumber",
				type : "search",
				placeholder:"会员：身份证号/卡号",
				business : "searchMemberByIdentifyAndNumber"
			};
		}
	};
	
	var Engine = {
		resolve : function(config,widget){
			return {
				subnav : this.getSubnavConfig(config),
				dashboard : this.getDashboardConfig(config),
				widgets : this.getWidgets(config)
			}
		},
		getSubnavConfig : function(config){
			var items = [];
				
			var dependencies = config.dependencies || [];	
			for(var i=0;i<dependencies.length;i++){
				items.push(Subnav_condition[dependencies[i]]());
			}
			
			return {
				title : config.title,
				items : items
			};
		},
		getDashboardConfig : function(config){
			return {
				top:{
					items:config.top || [],
					columnClass:"col-xs-4 col-sm-1"
				},
				bottom:{
					groups : config.bottom
				}
			};
		},
		getWidgets : function(config){
			var widgets = [];
			var groups = config.bottom || [];
			for(var i=0;i<groups.length;i++){
				var columns = groups[i].columns || [];
				for(var j=0;j<columns.length;j++){
					var items = columns[j].items || [];
					for(var k=0;k<items.length;k++){
						widgets.push(items[k]);
					}
				}
			}
			return widgets;
		}
	};
	
	module.exports = Engine;
});