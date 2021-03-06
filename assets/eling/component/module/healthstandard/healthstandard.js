define(function(require,exports,module){
	var utils={
		_getFontColor:function(value,param){
			if(value==0){
				return {
					fontClass:"",
					color:"#2FABE9"
				};
			}
			
			var low=param.low || param.normal1;
			var normal1=param.normal1;
			var normal2=param.normal2;
			var high=param.high || param.normal2;
			
			if(value<low || value>high){
				return {
					fontClass:"danger-font",
					color:"#FA5833"
				};
			}else if((value>=low && value<normal1) || (value>normal2 && value<=high)){
				return {
					fontClass:"warning-font",
					color:"#F4A506"
				};
			}else{
				return {
					fontClass:"success-font",
					color:"#5AAD34"
				};
			}
		}	
	};
	
	var HealthStandard={
		getSystolic:function(value){
			var param={
				normal1:90,
				normal2:130,
				high:140
			};
			return utils._getFontColor(value,param);
		},
		getDiastolic:function(value){
			var param={
				normal1:60,
				normal2:85,
				high:90
			};
			return utils._getFontColor(value,param);
		},
		getBloodSugar:function(value){
			var param={
				normal1:3.6,
				normal2:6.1,
				high:7
			};
			return utils._getFontColor(value,param);
		},
		getOxygen:function(value){
			var param={
				low:90,
				normal1:94,
				normal2:99
			};
			return utils._getFontColor(value,param);
		},
		getPulse:function(value){
			var param={
				low:40,
				normal1:60,
				normal2:100,
				high:160
			};
			return utils._getFontColor(value,param);	
		},
		getTemperature:function(value){
			var param={
				normal1:36,
				normal2:37.3,
				high:38
			};
			return utils._getFontColor(value,param);
		},
		getFat:function(value){
			var param={
				normal1:17,
				normal2:23,
				high:25
			};
			return utils._getFontColor(value,param);
		},
		getPressure:function(lValue,hValue){
			var lParam={
				normal1:90,
				normal2:130,
				high:140
			};
			var hParam={
				normal1:60,
				normal2:85,
				high:90
			};
			var lObject=utils._getFontColor(lValue,lParam);
			var hObject=utils._getFontColor(hValue,hParam);
			if(lObject.fontClass=="danger-font" || hObject.fontClass=="danger-font"){
				return {
					fontClass:"danger-font",
					color:"#FA5833"
				};
			}else if(lObject.fontClass=="success-font" && hObject.fontClass=="success-font"){
				return {
					fontClass:"success-font",
					color:"#5AAD34"
				};
			}else{
				return {
					fontClass:"warning-font",
					color:"#F4A506"
				};
			}
		},
		getEcgPicture:function(data){
			var result={
				description:{
					text:"???"
				},
				isarrhythmia:{
					text:"???????????????"
				},
				heartrate:{
					text:"???????????????"
				}
			};
			
			if(data && data.length!=0){
				var last=data[data.length-1];
				if(last.isarrhythmia=="????????????????????????"){
					result.isarrhythmia={
						status:"success",
						text:"????????????",
						fontClass:"success-font",
						color:"#5AAD34"
					};
				}else{
					result.isarrhythmia={
						status:"danger",
						text:"????????????",
						fontClass:"danger-font",
						color:"#FA5833"
					};
				}
				if(last.heartrate=="????????????"){
					result.heartrate={
						status:"success",
						fontClass:"success-font",
						color:"#5AAD34"
					};
				}else if(last.heartrate=="????????????" || last.heartrate=="????????????"){
					result.heartrate={
						status:"warning",
						fontClass:"warning-font",
						color:"#F4A506"
					};
				}else{
					result.heartrate={
						status:"danger",
						fontClass:"danger-font",
						color:"#FA5833"
					};
				}
				result.heartrate.text=last.heartrate;
				if(result.isarrhythmia.fontClass=="danger-font" || result.heartrate.fontClass=="danger-font" || 
						result.isarrhythmia.fontClass=="warning-font" || result.heartrate.fontClass=="warning-font"){
					//??????????????????????????????????????????????????????????????????
					result.description.text="?????????";
					result.description.fontClass="danger-font";
				}else if(result.isarrhythmia.fontClass || result.heartrate.fontClass){
					//????????????????????????????????????????????????????????????????????????????????????
					result.description.text="??????";
					result.description.fontClass="success-font";
				}
			}
			return result;
		}
	};
	
	module.exports=HealthStandard;
});