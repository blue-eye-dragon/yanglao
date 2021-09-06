define(function(require,exporst,module){
	var aw=require("ajaxwrapper");
	var HealthStandard=require("healthstandard");
	var FlotWrapper=require("flotwrapper");
	var subnavInstance;
	var _utils={
		_initLine:function(param){
			param.params.fetchProperties = "pkHealthExamData,createDate,type.pkHealthExamDataType,value1,value2,value3,value4,value5,value6";
			param.params.createDate = moment().subtract("months",1).valueOf();
			param.params.createDateEnd = moment().valueOf();
			//清空数据
			aw.ajax({
				url:param.url,
				data:param.params,
				dataType:"json",
				success:function(data){
					var xField=param.xField || "createDate";
					var yFields=param.yFields || [];
					var pkDataType=param.params['type.pkHealthExamDataType'];
					var datas=[];
					//计算各种值
					if(data && data.length!=0){
						pkDataType=data[0].type.pkHealthExamDataType;
						for(var i=0;i<yFields.length;i++){
							var yField=yFields[i];
							var item=[];
							var max=0,min=1000000,avg=0,latest=0;
							for(var j=0;j<data.length;j++){
								var xValue=data[j][xField];
								var yValue=parseFloat(data[j][yField]);
								item.push([xValue,yValue]);
								max = max > yValue ? max : yValue;
								min = min < yValue ? min : yValue;
								avg += yValue;
							}
							avg = data.length > 1 ? avg/data.length : avg;
							latest = data[data.length - 1] ? parseFloat(data[data.length - 1][yField]) : "";
							if(item.length==1){
								item=[[item[0][0]-3600000,0]].concat(item);
							}
							datas.push({
								data:item
							});
							if (param.precision == "0") {
								max = Math.round(max);							
								min = Math.round(min);							
								avg = Math.round(avg);								
								latest = Math.round(latest);
							}
							else if (param.precision == "1") {
								max = max.toFixed(1);							
								min = min.toFixed(1);							
								avg = avg.toFixed(1);							
								latest = latest.toFixed(1);
							}
							else if (param.precision == "2"){
								max = max.toFixed(2);							
								min = min.toFixed(2);							
								avg = avg.toFixed(2);							
								latest = latest.toFixed(2);
							}
							else if (param.precision == "%"){
								max = Math.round(max)+"%";
								min = Math.round(min)+"%";
								avg = Math.round(avg)+"%";
								//根据健康体检数据类型进行判断（3：血氧，4：体脂）
								if(pkDataType==3){
									$(".J-latest_oxygen").val(latest);
								}else{
									$(".J-latest_fatcontent").val(latest);
								}
							}
							//模板中各占位符名称根据健康体检数据类型PK进行拼接（1：血压，2：血糖，3：血氧，4：体脂，5：心率，6：心电图，7：体温，8：运动量）
							$(".J-avg_"+pkDataType+"_"+yField).html(avg);
							$(".J-max_"+pkDataType+"_"+yField).html(max);
							$(".J-min_"+pkDataType+"_"+yField).html(min);							
							$(".J-latest_"+pkDataType+"_"+yField).html(latest);							
						}						
					}else{
						//数据清0
						for(var k=0;k<yFields.length;k++){
							$(".J-avg_"+pkDataType+"_"+yFields[k]).html(0);
							$(".J-max_"+pkDataType+"_"+yFields[k]).html(0);
							$(".J-min_"+pkDataType+"_"+yFields[k]).html(0);							
							$(".J-latest_"+pkDataType+"_"+yFields[k]).html(0);
						}
						if(pkDataType==3){
							$(".J-latest_oxygen").val(0);
						}else if(pkDataType==4){
							$(".J-latest_fatcontent").val(0);
						}
					}
					$.plot($(param.parentNode),datas,{
						series: {
							lines: {
								show: true,
								lineWidth: 1,
								fill: true, 
								fillColor: { colors: [ { opacity: 0.08 }, { opacity: 0.01 } ] }
							},
							shadowSize: 0.8
						},
						xaxis: {
							mode: "time",
						    timeformat: "%m.%d" 
				        },
				        yaxis: {
							max:param.yMax,
							min:param.yMin
				        },
						legend: {
							show: false
						},
						grid: {
							clickable: true,
							hoverable: true,
							borderWidth: 0,
							tickColor: "#f4f7f9"
						},
						colors: ["#00acec", "#f8a326"]
					});
					if(param.success){
						param.success(data);
					}
				},
				error:function(data){
					if(param.error){
						param.error(data);
					}
				}
			});
		},
		removeFont:function(parentNode){
			$(parentNode).removeClass("danger-font").removeClass("warning-font").removeClass("success-font");
		}
	};
	
	
	var Utils={
		_drawHealthDataLine:function(pkMember){
			//血压
			_utils._initLine({
				url:"api/healthexamdata/query",
				params:{
					"member.pkMember" : subnavInstance.getValue("defaultMembers"),
					"type.pkHealthExamDataType" : 1,
					orderString : "createDate"
				},
				precision:"0",
				yFields:["value1","value2"],
				yMax:220,
				yMin:50,
				parentNode:"#stats-chart1",
				success:function(){
					_utils.removeFont(".J-latest_systolicpressure");
					var systolicpressure=parseInt($(".J-latest_systolicpressure").text());
					$(".J-latest_systolicpressure").addClass(HealthStandard.getSystolic(systolicpressure).fontClass);
					
					_utils.removeFont(".J-latest_diastolicpressure");
					var diastolicpressure=parseInt($(".J-latest_diastolicpressure").text());
					$(".J-latest_diastolicpressure").addClass(HealthStandard.getDiastolic(diastolicpressure).fontClass);
				}
			});
			
			//血糖
			_utils._initLine({
				url:"api/healthexamdata/query",
				params:{
					"member.pkMember" : subnavInstance.getValue("defaultMembers"),
					"type.pkHealthExamDataType" : 2,
					orderString : "createDate"
				},
				precision:"2",
				//TODO:后续要等蒲强华处理完后台的bloodSugar字段的jsonProperty问题，再切换成bloodSugar
				yFields:["value1"],
				yMax:15,
				yMin:0,
				parentNode:"#stats-chart2",
				success:function(){
					var bloodsugar=parseFloat($(".J-latest_bloodsugar").text());
					_utils.removeFont(".J-latest_bloodsugar");
					$(".J-latest_bloodsugar").addClass(HealthStandard.getDiastolic(bloodsugar).fontClass);
				}
			});
			//血氧
			_utils._initLine({
				url:"api/healthexamdata/query",
				params:{
					"member.pkMember" : subnavInstance.getValue("defaultMembers"),
					"type.pkHealthExamDataType" : 3,
					orderString : "createDate"
				},
				precision:"%",
				yFields:["value1"],
				yMax:100,
				yMin:80,
				parentNode:"#stats-chart3",
				success:function(){
					var oxygen=parseFloat($(".J-latest_oxygen").val());
					var colorObject=HealthStandard.getOxygen(oxygen);
					var font=colorObject.fontClass;
					_utils.removeFont(".J-latest_oxygen");
					$(".J-latest_oxygen").addClass(font);
					FlotWrapper.knob({
						parentNode:".J-latest_oxygen",
						fgColor: colorObject.color,
						callback:function(){
							$(".J-latest_oxygen").removeClass("hidden");
						}
					});
				}
			});
			//体脂
			_utils._initLine({
				url:"api/healthexamdata/query",
				params:{
					"member.pkMember" : subnavInstance.getValue("defaultMembers"),
					"type.pkHealthExamDataType" : 4,
					orderString : "createDate"
				},
				precision:"%",
				yFields:["value1"],
				yMax:200,
				yMin:0,
				parentNode:"#stats-chart4",
				success:function(){
					var fatcontent=parseFloat($(".J-latest_fatcontent").val());
					var colorObject=HealthStandard.getFat(fatcontent);
					var font=colorObject.fontClass;
					_utils.removeFont(".J-latest_fatcontent");
					$(".J-latest_fatcontent").addClass(font);
					FlotWrapper.knob({
						parentNode:".J-latest_fatcontent",
						fgColor: colorObject.color,
						callback:function(){
							$(".J-latest_fatcontent").removeClass("hidden");
						}
					});
				}
			});
			
			_utils._initLine({
				url:"api/healthexamdata/query",
				params:{
					"member.pkMember" : subnavInstance.getValue("defaultMembers"),
					"type.pkHealthExamDataType" : 5,
					orderString : "createDate"
				},
				precision:"0",
				yFields:["value1"],
				yMax:150,
				yMin:50,
				parentNode:"#stats-chart5",
				success:function(){
					var pulse=parseFloat($(".J-latest_pulse").text());
					_utils.removeFont(".J-latest_pulse");
					$(".J-latest_pulse").addClass(HealthStandard.getPulse(pulse).fontClass);
				}
			});
			
			_utils._initLine({
				url:"api/healthexamdata/query",
				params:{
					"member.pkMember" : subnavInstance.getValue("defaultMembers"),
					"type.pkHealthExamDataType" : 7,
					orderString : "createDate"
				},
				precision:"1",
				yFields:["value1"],
				yMax:43,
				yMin:36,
				parentNode:"#stats-chart7",
				success:function(){
					var temperature=parseFloat($(".J-latest_temperature").text());
					_utils.removeFont(".J-latest_temperature");
					$(".J-latest_temperature").addClass(HealthStandard.getTemperature(temperature).fontClass);
				}
			});
			
			_utils._initLine({
				url:"api/healthexamdata/query",
				params:{
					"member.pkMember" : subnavInstance.getValue("defaultMembers"),
					"type.pkHealthExamDataType" : 8,
					orderString : "createDate"
				},
				precision:"0",
				yFields:["value1"],
				yMax:20000,
				yMin:0,
				parentNode:"#stats-chart8"
			});
			
			aw.ajax({
				url:"api/device/ecgStruct/query",
				dataType:"json",
				data:{
					"member.pkMember" : subnavInstance.getValue("defaultMembers"),
					fetchProperties : "pkEtcommData,collectdate,heartrate,isarrhythmia,resultDesc",
					createDate : moment().subtract("months",1).valueOf(),
					createDateEnd : moment().valueOf()
				},
				success:function(data){
					_utils.removeFont(".J-isarrhythmia");
					_utils.removeFont(".J-heartrate");
					var ecgPicture=HealthStandard.getEcgPicture(data);
					$(".J-isarrhythmia").text(ecgPicture.isarrhythmia.text || "无心律信息").addClass(ecgPicture.isarrhythmia.fontClass || "");
					$(".J-heartrate").text(ecgPicture.heartrate.text || "无心率信息").addClass(ecgPicture.heartrate.fontClass || "");
					$(".J-description").text(ecgPicture.description.text || "无").addClass(ecgPicture.description.fontClass || "");
				}
			});
			
			var img=document.getElementById("J-cgpicture");
			if(subnavInstance.getValue("defaultMembers")){
				img.src="api/member/"+subnavInstance.getValue("defaultMembers")+"/lastecgpicture";
			}
		},
		setSubnav:function(subnav){
			subnavInstance=subnav;
		}
	};
	module.exports=Utils;
});