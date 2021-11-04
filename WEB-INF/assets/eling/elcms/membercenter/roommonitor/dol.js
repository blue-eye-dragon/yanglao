//duration of location
define(function(require,exports,module){
	var cache={};
	
	var Dof={
		setData:function(key,array,isOut,current){
			cache[key]=array;
			var nodes={
				today:".J-today-"+key,
				yesterday:".J-yesterday-"+key,
				text:".J-"+key+"-increase",
				percent:".J-yesterday-"+key+"-percent"
			};
			//设置卫生间
			var today=0,yesterday=0,increase,percent,todayOutTimes=0,yesterdayOutTimes=0;
			for(var i =0;i<array.length;i++){
				if(moment(array[i].date).startOf("days").valueOf() == current.start){
					today+=array[i] ? array[i].duration : 0 ;
					if(isOut){
						todayOutTimes+=array[i].times;
					}
				}else{
					yesterday+=array[i] ? array[i].duration : 0 ;
					if(isOut){
						yesterdayOutTimes+=array[i].times;
					}
				}
			}
			var todayTotal=(today/60).toFixed(0);
			var yesterdayTotal=(yesterday/60).toFixed(0);
			$(nodes.today).text(todayTotal);
			$(nodes.yesterday).text(yesterdayTotal);
			increase=today>=yesterday ? "增长" : "减少";
			
			if(today==0 && yesterday==0){
				percent=0;
			}else if(today==0 || yesterday==0){
				percent=100;
			}else{
				var temp=Math.abs(todayTotal-yesterdayTotal);
				if(yesterdayTotal==0 || yesterdayTotal=="0"){
					percent=100;
				}else{
					percent=Math.round(temp/yesterdayTotal*100,1);
				}
			}
			$(nodes.text).text(increase);
			$(nodes.percent).text(percent);
			if(isOut){
				//设置外出
				$(".J-today-Outdoor-time").text(todayOutTimes);
				$(".J-yesterday-Outdoor-time").text(yesterdayOutTimes);
				var timeText=todayOutTimes>=yesterdayOutTimes ? "增长" : "减少";
				$(".J-Outdoor-increase-text").text(timeText);
				$(".J-Outdoor-increase-time").text(Math.abs(todayOutTimes-yesterdayOutTimes));
			}
		},
		addData:function(key,newData){
			var data=cache[key];
			data.push(newData);
			cache[key]=data;
			this.setData(key,data);
		}
	};
	module.exports=Dof;
});
