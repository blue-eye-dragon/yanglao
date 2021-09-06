define(function(require,exports,module){
	var cacheData={};
	var cacheParams={};
	//表示当前所在位置，当推送心跳事件时，需要根据这个位置动态的增加locationlog的长度
	var LocationLog={
		currentLocation:{},
		getCurrentLocation:function(){
			return this.currentLocation;
		},
		geneLocationlogData:function(key,array,color,current){
			var result=[];
			var map={};
			cacheData[key]=array;
			//如果当天的第一条数据是“out”，从0点到第一条数据记录的时间都要补成“In”
			if(array.length!=0 && array[0].type=="Out"){
				var temp={};
				temp.date = current.start;
				temp.type="In";
				temp.locationIndex=array[0].locationIndex;
				array=[temp].concat(array);
			}
			//如果当天最后一条数据是In，从数据记录的时间到当前查询时间都要补成Out
			if(array.length!=0 && array[array.length-1].type=="In"){
				var temp={};
				temp.date = Math.min(current.end,moment().valueOf());
				temp.type = "Out";
				temp.locationIndex = array[array.length-1].locationIndex;
				temp.location = array[array.length-1].location;
				array = array.concat([temp]);
				this.currentLocation=temp;
			}
			if(array){
				for(var i=0;i<array.length;i++){
					var num=array[i].type=="In" ? 1 : 0;
					var index=array[i].locationIndex;
					if(map[index]){
						map[index].push([new Date(array[i].date), num]);
					}else{
						var temp=[];
						temp.push([new Date(array[i].date), num]);
						map[index]=temp;
					}
				}
			}
			for(var k in map){
				result.push({
					data:map[k],
					color:color
				});
			}
			return result;
		},
		addData:function(key,newData,current){
			var data=cacheData[key] || [];
			return this.geneLocationlogData(key,data,cacheParams[key].color,current);
		},
		getParams:function(key){
			return cacheParams[key];
		},
		drawMonitor:function(param){
			cacheParams[param.key]=param;
			$.plot($(param.parentNode), param.data,{
				series: {
					lines: { show: true, fill: 1, steps: true ,lineWidth:0}
				},
				xaxes:[{
					min:new Date(param.min),
					max:new Date(param.max),
					mode:"time",
					timeformat:"%d日%H点",
					timezone:"browser",
					show:param.showX || false,
					color:"white"
				}],
				yaxis: {
					show:false,
					min:0,
					max:1
		        },
		        grid:{
		        	borderWidth:0
		        }
			});
			$(param.parentNode).append($("<hr>").addClass("hr-group").addClass("custHR").css({
				"border-color":param.color
			}));
		}
	};
	
	module.exports=LocationLog;
});