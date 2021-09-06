 define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var tpl=require("./activityroomcontrol.tpl");
	require("./activityroomcontrol.css");
	var Subnav=require("subnav-1.0.0");
	var InnerEnvironment=require("inner_environment");
	var OuterEnvironment=require("outer_environment");
	
	var ch={
		"1":"一",
		"2":"二",
		"3":"三",
		"4":"四",
		"5":"五",
		"6":"六",
		"0":"日"
	};
	
	var ActivityRoomControl=ELView.extend({
		attrs:{
			template:tpl,
			model:{}
		},
		_getData:function(widget){
			//查询天气预报
			if(this.get("outer")){
				this.get("outer").destroy();
			}
			if(this.get("inner")){
				this.get("inner").destroy();
			}
			var outer=new OuterEnvironment({
				parentNode:".J-out"
			});
			outer.render();
			outer.initWeather();
			this.set("outer",outer);
			//渲染环境数据
			var inner=new InnerEnvironment({
				parentNode:".J-inner"
			});
			inner.render();
			this.set("inner",inner);
			inner.refresh({
				last:true,
				pkActivityRoom:widget.get("subnav").getValue("activityroom")
			});
			//渲染活动
			aw.ajax({
				url:"api/activity/query",
				dataType:"json",
				data:{
					eagerFetchProperties:"interestGroups",
					activityRoom:widget.get("subnav").getValue("activityroom"),
					cycle:false
				},
				success:function(data){
					for(var i=0;i<data.length;i++){
						if(data[i].isCircle){
							//循环活动
							data[i].weekday="每周日";
							var startTime=moment(data[i].activityStartTime).format("HH:mm");
							var entTime=moment(data[i].activityEndTime).format("HH:mm");
							data[i].timerange=entTime+"-"+startTime;
						}else{
							//非循环活动
							//要比较开始时间和结束时间是否在同一天
							var start=moment(data[i].activityStartTime);
							var end=moment(data[i].activityEndTime);
							if(start.format("YYYY-MM-DD") == end.format("YYYY-MM-DD")){
								//如果是只占一天的活动
								data[i].timerange=start.format("MM月DD日")+"（"+"周"+ch[start.format("e")]+"）"+start.format("HH:mm")+"-"+end.format("HH:mm");
							}else{
								//如果不是同一天的活动，哇塞，那就扯淡了
								//处理第一天
								data[i].timerange=start.format("MM月DD日")+"（"+"周"+ch[start.format("e")]+"）"+start.format("HH:mm")+"-"+end.format("HH:mm");
								start.add("days",1);
								while(start.format("YYYY-MM-DD")<=end.format("YYYY-MM-DD")){
									var temp={
										theme:data[i].theme,
										timerange:start.format("MM月DD日")+"（"+"周"+ch[start.format("e")]+"）全天"
									};
									data.splice(i+1,0,temp);
									start.add("days",1);
									i++;
								}
								//处理最后一天
								var lastData={
									theme:data[i].theme,
									timerange:start.format("MM月DD日")+"（"+"周"+ch[start.format("e")]+"）00:00"+"-"+end.format("HH:mm")
								};
								data.splice(i+1,0,lastData);
								i++;
							}
						}
					}
					for(var j=0;j<data.length;j++){
						if(j>8){
							data[j].show="hidden";
						}
					}
					widget.get("model").activityroom=widget.get("subnav").getText("activityroom");
					widget.get("model").activities=data;
					widget.renderPartial(".J-notify-container");
				}
			});
		},
		initComponent:function(){
			window.setInterval(function(){
				var lastActive=$(".J-activitydetail:visible").last();
				$(".J-activitydetail").addClass("hidden");
				for(var i=0;i<8;i++){
					if(lastActive.next().length!=0){
						lastActive.next().removeClass("hidden");
						lastActive=lastActive.next();
					}else if(i==0){
						lastActive=$(".J-activitydetail").first();
						lastActive.removeClass("hidden");
					}
				}
			},10000);
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					buttonGroup:[{
						id:"activityroom",
						key:"pkActivityRoom",
						value:"name",
						handler:function(key,element){
							widget._getData(widget);
						}
					}],
					buttons:[{
						id:"fullscreen"
					},{
						id:"returnfullscreen"
					}]
				}
			});
			this.set("subnav",subnav);
		},
		afterInitComponent:function(params,widget){
			var subnav=this.get("subnav");
			subnav.load({
				id:"activityroom",
				url:"api/activityroom/query",
				callback:function(){
					if(params && params.pkActivityRoom){
						subnav.setValue("activityroom",params.pkActivityRoom);
					}
					widget._getData(widget);
					widget.renderPartial(".J-notify-container");
				}
			});
			var href =window.location.href;
			if(href.indexOf("view")>0){
				var timerefersh=setInterval(function(){
					window.location.reload();
				},60*1000);
				this.set("timerefersh",timerefersh);
			}
		},
		destroy:function(){
			this.get("outer").destroy();
			this.get("inner").destroy();
			this.get("subnav").destroy();
			window.clearInterval(this.get("timerefersh"));
			ActivityRoomControl.superclass.destroy.call(this,arguments);
		}
	});
	module.exports = ActivityRoomControl;
});