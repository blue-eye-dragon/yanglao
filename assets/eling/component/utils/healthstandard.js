define(function(require,exports,module){
	var HealthStandard = {
		//收缩压
		systolic : function(value){
			if(!value){
				return {
					fontColor : "#49CDEC",
					description : ""
				};
			};
			var fontClass, description, status;
			if(value >= 90 && value <= 140){
				fontColor = "#49bf67";
				description = "正常";
				status = "normal";
			}else if(value > 140){
				fontColor = "#f34541";
				description = "偏高";
				status = "high";
			}else{
				fontColor = "#f34541";
				description = "偏低";
				status = "low";
			}
			return {
				fontColor : fontColor,
				description : description,
				status : status
			};
		},
		//舒张压
		diastolic : function(value){
			if(!value){
				return {
					fontColor : "#49CDEC",
					description : ""
				};
			};
			var fontClass, description;
			if(value >= 60 && value <= 90){
				fontColor = "#49bf67";
				description = "正常";
				status = "normal";
			}else if(value > 90){
				fontColor = "#f34541";
				description = "偏高";
				status = "high";
			}else{
				fontColor = "#f34541";
				description = "偏低";
				status = "low";
			}
			return {
				fontColor : fontColor,
				description : description,
				status : status
			};
		},
		bloodpres : function(value1,value2){
			var systolic = this.systolic(value1);
			var diastolic = this.diastolic(value2);
			var advice = ["保证睡眠充足。","心情保持舒畅，生活有规律，适当进行体育锻炼，如散步、体操、太极拳、气功。","防止情绪激动。","戒烟。避免过量饮酒。"];
			if(systolic.status == "high" || diastolic.status == "high"){
				advice = advice.concat(["防止饮食过腻过饱，宜清淡，富含维生素和蛋白质，少进食盐和胆固醇过多的食物。"]);
			}else if(systolic.status == "low" || diastolic.status == "low"){
				advice = advice.concat(["提高生活质量","增加营养，多喝水，多吃汤，每日食盐略多于常人。"]);
			}
			return {
				systolic : systolic,
				diastolic : diastolic,
				advice : advice
			};
		},
		bloodsugar : function(value){
			var fontClass, description, advice = ["按时进食，生活规律,按医护人员及营养师的指示进食。","经常参加体育锻炼。",
                     "平日要注意血糖的控制，常检查血糖值。","不要随意用药或停药"];
			if(!value){
				return {
					fontColor : "#49CDEC",
					description : "",
					advice : advice
				};
			};
			if(value >= 3.9 && value <= 6.1){
				fontColor = "#49bf67";
				description = "正常";
				advice = advice;
			}else if(value > 6.1){
				fontColor = "#f34541";
				description = "偏高";
				advice = advice.concat(["如有恶心，呕吐或发烧时，应立即求医诊治。","找出高血糖发生之原因，避免下次再发生。"]);
			}else{
				fontColor = "#f34541";
				description = "偏低";
				advice = advice.concat(["不可随便增加药量。","随身带糖果以备用。"]);
			}
			return {
				fontColor : fontColor,
				description : description,
				advice : advice
			};
		},
		spo2 : function(value){
			if(!value){
				return {
					fontColor : "#49CDEC",
					description : ""
				};
			};
			var fontClass, description;
			if(value >= 95 && value <= 97){
				fontColor = "#49bf67";
				description = "正常";
			}else if(value > 97){
				fontColor = "#f34541";
				description = "偏高";
			}else{
				fontColor = "#f34541";
				description = "偏低";
			}
			return {
				fontColor : fontColor,
				description : description
			};
		},
		bmi : function(value){
			if(!value){
				return {
					fontColor : "#49CDEC",
					description : ""
				};
			};
			var fontClass, description;
			if(value >= 18 && value <= 25){
				fontColor = "#49bf67";
				description = "正常";
			}else if(value > 25){
				fontColor = "#f34541";
				description = "偏胖";
			}else{
				fontColor = "#f34541";
				description = "偏瘦";
			}
			return {
				fontColor : fontColor,
				description : description
			};
		},
		heartrate : function(value){
			if(!value){
				return {
					fontColor : "#49CDEC",
					description : ""
				};
			};
			var fontClass, description, advice = ["不要吃辛辣、油腻的食物，多吃点水果和蔬菜。","坚持锻炼","多喝白开水（不是矿泉水）"];
			if(value >= 60 && value <= 100){
				fontColor = "#49bf67";
				description = "正常";
			}else if(value > 100){
				fontColor = "#f34541";
				description = "过快";
				advice = advice.concat(["晚饭后可以出去散步，但不要做剧烈的运动。","每天的睡眠要达到8个小时以上。"]);
			}else{
				fontColor = "#f34541";
				description = "过慢";
				advice = advice.concat(["窦性心动过缓如心率不低于每分种50次，无症状者，无需治疗。","如心率低于每分钟40次，且出现症状者可用提高心率药物。","显著窦性心动过缓伴窦性停搏且出现晕厥者可考虑安装人工心脏起搏器。"]);
			}
			return {
				fontColor : fontColor,
				description : description,
				advice : advice
			};
		},
		temprature : function(value){
			if(!value){
				return {
					fontColor : "#49CDEC",
					description : ""
				};
			};
			var fontClass, description;
			if(value >= 36.5 && value <= 37.5){
				fontColor = "#49bf67";
				description = "正常";
			}else if(value > 37.3){
				fontColor = "#f34541";
				description = "偏高";
			}else{
				fontColor = "#f34541";
				description = "偏低";
			}
			return {
				fontColor : fontColor,
				description : description
			};
		},
		sports : function(){
			return {
				fontColor : "#49CDEC",
				description : ""
			};
		}
	};
	module.exports = HealthStandard;
});