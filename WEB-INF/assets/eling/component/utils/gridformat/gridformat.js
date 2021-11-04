define(function(require,exports,module){
	var GridFormat={
		getValue:function(key,data){
			var value="";
			//key可以是一个点语法
			if(key && data){
				var keyArray=key.split(".");
				for(var i=0;i<keyArray.length;i++){
					if(data[keyArray[i]]){
						data=data[keyArray[i]];
					}else if(data[keyArray[i]]===0){
						return "0";
					}else{
						return "";
					}
				}
			}else{
				return "";
			}
			return data;
		},
		button:function(params,value,row,model){
			var ret="";
			for(var i=0;i<params.length;i++){
				var show=params[i].show || true;
				if(typeof show === "function"){
					show=show(value,row);
				}
				if(show){
					ret+="<a style='margin-left:5px;' class='J-"+(params[i].id || params[i].key)+" btn btn-xs btn-theme "+(params[i].show===false ? "hidden" : "")+"' href='javascript:void(0);'>";
					if(params[i].text){
						ret+=params[i].text;
					}else{
						ret+="<i class='icon-"+params[i].icon+"'></i>";
					}
					ret+="</a>";
				}
			}
			return ret;
		},
		detail:function(param,value,row,model){
			return "<a class='text-theme J-"+((param && (param[0].key || param[0].id)) ?  (param[0].key || param[0].id) : "detail")+"' href='javascript:void(0);'>"+value+"</a>";
		},
		date:function(params,value,row,model){
			var mode=params && params.mode ? params.mode : "YYYY-MM-DD";
			if(mode && mode.indexOf("yyyy-MM-dd")!=-1){
				//兼容datetimepicker和moment对format的不同
				mode=mode.replace("yyyy-MM-dd","YYYY-MM-DD");
			}
			if(mode && mode.indexOf("hh")!=-1){
				//兼容datetimepicker和moment对format的不同
				mode=mode.replace("hh","HH");
			}
			//如果日期小于1927年12月31日23:54:03,则要补齐5分57秒。因为时区调整
			if(value < -1325491557000){
				value=value+357000;
			}
			return value ? moment(value).format(mode) : "";
		},
		age : function(params,value,row,model){
			//格式化年龄
			if(value){
				return moment().diff(value, 'years');
			}else{
				return "";
			}
		},
		defaultZero : function(params,value,row,model){
			//格式化年龄
			if(value){
				return value;
			}else{
				return 0;
			}
		},
		thousands : function(params,value,row,model){
			var precision = params && params.precision !== undefined ? params.precision : 2;
			value =  parseFloat(value);
			if(value !== undefined && value !== null && !isNaN(value)){
				value = value.toFixed(precision);
				value = value+"";
				return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
			}else{
				return "0.00";
			}
		}
	};
	module.exports=GridFormat;
});