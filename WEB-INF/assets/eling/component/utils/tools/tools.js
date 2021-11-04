define(function(require,exports,module){
	
	function clone(obj){  
	    function Clone(){}  
	    Clone.prototype = obj;  
	    var o = new Clone();  
	    for(var i in o){  
	        if(typeof o[i] == "object" && o[i] !== null) {  
	            o[i] = clone(o[i]);  
	        }else{
	        	o[i] = obj[i];
	        } 
	    }  
	    return o;  
	}  
	
	return {
		_getValueFromObject:function(key,data){
			if(key === undefined || data === undefined || data === null){
				return data;
			}
			var cloneObj = clone(data);
			//key可以是一个点语法
			if(key && typeof cloneObj === "object"){
				var keys = key.split(".");
				for(var i in keys){
					if(cloneObj[keys[i]] === null || cloneObj[keys[i]] === undefined){
						return "";
					}else{
						cloneObj = cloneObj[keys[i]];
					}
				}
			}
			return cloneObj;
		},
		
		
		geneValidate:function(validates){
			var validateStr="";
			var validate=validates || [];
			for(var j=0;j<validate.length;j++){
				validateStr+="data-rule-"+validate[j]+"=true ";
			}
			return validateStr;
		},
		
		isType : function(type) {
			return function(obj) {
				return {}.toString.call(obj) == "[object " + type + "]";
			}
		},
		isObject : function(val){
			return this.isType("Object")(val);
		},
		isString : function(val){
			return this.isType("String")(val);
		},
		isArray : function(val){
			return Array.isArray || this.isType("Array")(val);
		},
		isFunction : function(val){
			return this.isType("Function")(val);
		},
		isDate : function(val){
			return this.isType("Date")(val);
		},
		gridformat_button : function(params,value,row,model){
			var ret="";
			for(var i in params){
				var show = params[i].show || true;
				if(typeof show === "function"){
					show = show(value,row);
				}
				if(typeof show === "boolean" && show === true){
					ret+="<button style='margin-left:5px;' class='J-grid-"+model.id+"-"+(params[i].id || params[i].key) + " btn btn-xs btn-theme'>";
					
					if(params[i].text){
						ret += params[i].text;
					}else{
						ret += "<i class='"+params[i].icon+"'></i>";
					}
					ret+="</button>";
				}else if(typeof show === "string"){
					ret = show;
				}
			}
			return ret;
		},
		gridformat_age : function(params,value,row,model){
			//格式化年龄
			if(value){
				return moment().diff(value, 'years');
			}else{
				return "";
			}
		},
		gridformat_link : function(params,value,row,model){
			return "<a class='text-theme J-grid-"+model.id+"-"+(params.id || params.key)+"' href='javascript:void(0);'>"+value+"</a>";
		},
		gridformat_detail : function(params,value,row,model){
			return "<a class='text-theme J-grid-"+model.id+"-"+(params.id || params.key)+"' href='javascript:void(0);'>"+value+"</a>";
		},
		gridformat_date : function(params,value,row,model){
			var mode = (params && params.mode) ? params.mode : "YYYY-MM-DD";

			//如果日期小于1927年12月31日23:54:03,则要补齐5分57秒。因为时区调整
			if(value < -1325491557000){
				value = value+357000;
			}
			return value ? moment(value).format(mode) : "";
		},
		loadModule : function(url,callback){
			if(window.seajs){
				require.async(url,function(Module){
					if(typeof callback === "function"){
						callback(Module);
					}
				});
			}
		},
		//早期的点语法
		_getValueWithPoint : function(key,data){
			var result="";
			var tempData=data;
			//key可以是一个点语法
			if(key){
				var spiltComma=key.split(",");
				if(spiltComma.length>1){
					result=[];
					for(var comma=0;comma<spiltComma.length;comma++){
						result.push(this._getValueWithPoint(spiltComma[comma],tempData));
					}
				}else{
					var keyArray=key.split(".");
					for(var i=0;i<keyArray.length;i++){
						if(tempData[keyArray[i]] || tempData[keyArray[i]]==0){
							tempData=tempData[keyArray[i]];
						}else{
							tempData="";
						}
					}
					return tempData;
				}
				
			}
			return result;
		}
	};
});