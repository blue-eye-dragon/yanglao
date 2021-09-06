define(function(require,exports,module){
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	require("flot");
	var aw=require("ajaxwrapper");
	var store=require("store");
	var dol=require("./dol");
	var locationlog=require("./locationlog");
	
	var utils=require("./roommonitor_util");
	
	require("./roommonitor.css");
	
	function setData(subnav){
		var time = subnav.getValue("date");
		var todayParam = moment(time.start).valueOf();
		var yesterdayParam=todayParam-21600000;
		var tomorrowParam=todayParam+10*60*60*1000;
		var member=subnav.getValue("memberHasDevice");
		var memberText=subnav.getText("memberHasDevice");
		//这段代码不是我要写的，实在是逼不得已啊!!!
		var yesTempParam="";
		var tomTempParam="";
		if(memberText.indexOf("张某某")!=-1 || memberText.indexOf("李某某")!=-1 || 
				memberText.indexOf("王某某")!=-1 || memberText.indexOf("赵某某")!=-1 || memberText.indexOf("王爱玲")!=-1){
			yesTempParam="2014-08-22 22:00:00";
			tomTempParam="2014-08-23 06:00:00";
		}
		aw.ajax({
			url:"api/sleepinglog/query",
			data:{
				fetchProperties:"*",
				member:member,
				date:yesTempParam || yesterdayParam,
				dateEnd:tomTempParam || tomorrowParam
			},
			dataType:"json",
			success:function(data){
				//绘制柱状图
				var noData=[],lightData=[],deepData=[],lightTotal=0,deepDataTotal=0;
				if(data && data.length!=0){
					for(var i=0;i<data.length;i++){
						if(data[i].status.key=="No"){
							noData.push([data[i].date,1]);
							lightData.push([data[i].date,0]);
							deepData.push([data[i].date,0]);
						}else if(data[i].status.key=="Light"){
							lightData.push([data[i].date,2]);
							noData.push([data[i].date,0]);
							deepData.push([data[i].date,0]);
							if(data[i+1]){
								lightTotal+=(data[i+1].date-data[i].date);
							}
						}else{
							deepData.push([data[i].date,3]);
							noData.push([data[i].date,0]);
							lightData.push([data[i].date,0]);
							if(data[i+1]){
								deepDataTotal+=(data[i+1].date-data[i].date);
							}
						}
					}
					if(noData.length!=0){
						noData.splice(0,0,[noData[0][0]-3600000,1]);
						noData.push([noData[noData.length-1][0]+3600000,1]);
					}
					var fallSleep=new Date(data[0].date).getHours()+":"+new Date(data[0].date).getMinutes();
					var getUp=new Date(data[data.length-1].date).getHours()+":"+new Date(data[0].date).getMinutes();
					
					var lHour=(lightTotal-lightTotal%3600000)/3600000;
					var lMin=(lightTotal%3600000/60000).toFixed(0);
					
					var dHour=(deepDataTotal-deepDataTotal%3600000)/3600000;
					var dMin=(deepDataTotal%3600000/60000).toFixed(0);
					
					utils.drawSleep({
						data:[{
							label:"入睡时间 "+fallSleep,
							color:"#f7990d",
							data:[]
						},{
							label:"醒来时间 "+getUp,
							data:noData,
							color:"#f7990d"
						},{
							label:"浅度睡眠约"+lHour+"小时"+lMin+"分钟",
							data:lightData,
							color:"#2caadc"
						},{
							label:"深度睡眠约"+dHour+"小时"+dMin+"分钟",
							data:deepData,
							color:"#0099d3"
						}],
						parentNode:"#sleep"
					});
				}
			}
		});
			
		aw.ajax({
			url:"api/durationoflocation/query",
			dataType:"json",
			data:{
				locationIn:"Bedroom,Kitchen,LivingRoom,Restroom,Outdoor",
				date : moment(time.start).subtract(1,"days").valueOf(),
				dateEnd : time.end,
				member : member
			},
			success:function(data){
				if(data){
					var map={
						Bedroom:[],
						Kitchen:[],
						LivingRoom:[],
						Restroom:[],
						Outdoor:[]
					};
					for(var i=0;i<data.length;i++){
						var location=data[i].location;
						map[location].push(data[i]);
					}
					for(var j in map){
						if(j == "Outdoor"){
							dol.setData(j,map[j],true,time);
						}else{
							dol.setData(j,map[j],false,time);
						}
					}
				}
			}
		});
			
		aw.ajax({
			url:"api/locationlog/query",
			dataType:"json",
			data:{
				date : time.start,
				dateEnd : time.end,
				member:member
			},
			success:function(data){
				var map={
					Bedroom:{
						key:"Bedroom",data:[],parentNode:"#monitor4",color:"#72c380"
					},
					Kitchen:{
						key:"Kitchen",data:[],parentNode:"#monitor3",color:"#8c8c8c"
					},
					LivingRoom:{
						key:"LivingRoom",data:[],parentNode:"#monitor2",color:"#f7990d"
					},
					Restroom:{
						key:"Restroom",data:[],parentNode:"#monitor1",color:"#864fde"
					},
					Outdoor:{
						key:"Outdoor",data:[],parentNode:"#monitor5",color:"#f12e29"
					}
				};
				for(var i=0;i<data.length;i++){
					var location=data[i].location;
					map[location].data.push(data[i]);
				}
				for(var j in map){
					locationlog.drawMonitor({
						key:j,
						color:map[j].color,
						data:locationlog.geneLocationlogData(j,map[j].data,map[j].color,time),
						parentNode:map[j].parentNode,
						min:time.start,
						max:time.end,
						showX:map[j].key=="Outdoor" ? true : false
					});
				}
			}
		});
		
		//查询平均
		aw.ajax({
			url:"api/durationoflocation/queryavg",
			data:{
				locationIn:"Outdoor",
				dateEnd:todayParam,
				member:member
			},
			success:function(data){
				var result=data[0] || {};
				$(".J-Outdoor-average").text(Math.round(result.duration/60) || 0);
				$(".J-Outdoor-average-time").text(result.times || 0);
				
			}
		});
	};
	
	var RoomMonitor=ELView.extend({
		attrs:{
			template:require("./roommonitor.tpl")
		},
		initComponent:function(params,widget){
			var buildings=store.get("user").buildings || [];
			var result=[];
			for(var i=0;i<buildings.length;i++){
				if(buildings[i].useType.key=="Apartment" || buildings[i].useType.key=="Demo"){
					result.push(buildings[i]);
				}
			}
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"独居监护",
					buttonGroup:[{
						id:"buildings",
						key:"pkBuilding",
						value:"name",
						items:result,
						handler:function(key,element){
							var subnav=widget.get("subnav");
							subnav.load({
								id:"memberHasDevice",
								params:{
									"pkBuilding":key,
									fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
								},
								callback:function(data){
									setData(subnav);
								}
							});
						}
					},{
						id:"memberHasDevice",
						url : "api/member/queryMemberHasDevice",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						tip:"会员",
						lazy : true,
						handler:function(key,element){
							var subnav=widget.get("subnav");
							setData(subnav);
						}
					}],
					buttons:[{
						id:"fullscreen"
					},{
						id:"returnfullscreen"
					}],
					date : {
						click : function(){
							var subnav=widget.get("subnav");
							setData(subnav);
						}
					}
				}
			});
			this.set("subnav",subnav);
			subnav.load({
				id:"memberHasDevice",
				params:{
					pkBuilding:subnav.getValue("buildings"),
					fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
				},
				callback:function(data){
					setData(subnav);
				}
			});
			
			var eventSource=new EventSource("api/durationoflocation/sse");
			eventSource.addEventListener("heartbeat",function(e){
				console.log(e.data);
			});
			eventSource.addEventListener("dolIncrease",function(e){
				var data=store.deserialize(e.data);
				if(data.pkMember==widget.get("subnav").getValue("memberHasDevice")){
					dol.addData(data.location,data);
				}
			});
			eventSource.addEventListener("locationLog",function(e){
				var data=store.deserialize(e.data);
				console.log(data);
				if(data.pkMember==widget.get("subnav").getValue("memberHasDevice")){
					var params=locationlog.getParams(data.location);
					params.data=locationlog.addData(data.location,data,widget.get("subnav").getValue("date"));
					locationlog.drawMonitor(params);
				}
			});
			this.set("sse",eventSource);

		},
		destroy:function(){
			this.get("subnav").destroy();
			this.get("sse").close();
			RoomMonitor.superclass.destroy.call(this,arguments);
		}
	});
	module.exports=RoomMonitor;
});