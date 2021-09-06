/*
 * jQuery的Ajax调用的wrapper，系统的Ajax调用都统一使用此模块
 */
define(function(require, exports, module) {
	var Dialog=require("dialog");
	var store=require("store");
	
	var aw = {};
	var getSuccessCallBack=function(success, error){
		success = success || function(){};
		error = error || function(){};
		var result=function(data, textStatus, jqXHR){
			seajs.emit("server-response-event");
    		if(data && data.exMessage){
    			Dialog.tip(data.exMessage);
    			if(console) {
    				console.log(data.stackTrace);
    			}
    			error(jqXHR, textStatus, data.exMessage);
    		}else{
    			success(data, textStatus, jqXHR);
    		}
		};
		return result;
	};
	
	var getErrorCallback=function(error){
		error = error || function(){};
		var result=function(jqXHR, textStatus, errorThrown){
			seajs.emit("server-response-event");
			if (jqXHR.getResponseHeader("redirect") || jqXHR.status == "403") {
				Dialog.alert({
					content:"未登录或登录超时(两个小时)，请重新登录",
					confirm:function(){
						window.location = jqXHR.getResponseHeader("redirect");
					}
				});
			}
			if(jqXHR.status == "600" || jqXHR.status == "500"){
				var responseJSON = jqXHR.responseJSON;
				if(responseJSON && responseJSON.exMessage){
					Dialog.tip(responseJSON.exMessage);
					if(console) {
						console.log(responseJSON.stackTrace);
					}
				}
				error(jqXHR, textStatus, errorThrown);
			}
			error(jqXHR, textStatus, errorThrown);
		};
		return result;
	};

	aw.ajax = function(cfg) {
		var success= getSuccessCallBack(cfg.success, cfg.error);
		var error= getErrorCallback(cfg.error);
		cfg.dataType="json";
		cfg.success=success;
		cfg.error=error;
		cfg.cache=false;
		cfg.contentType = cfg.contentType?cfg.contentType:"application/x-www-form-urlencoded; charset=UTF-8";
		$.ajax(cfg);
	};

	
	/**
	 * server-request-save-event和server-response-event在sea_config中定义，用于处理表单的重复提交
	 */
	aw.saveOrUpdate=function(url,data,successCallback,errorCallback){
		seajs.emit("server-request-save-event");
		aw.ajax({
			url : url,
			type : "POST",
			data : data,
			success : function(data){
				seajs.emit("server-response-event");
				(typeof successCallback === "function" ? successCallback : function(){})(data);
			},
			error : function(jqXHR, textStatus, errorThrown){
				seajs.emit("server-response-event");
				(typeof errorCallback === "function" ? errorCallback : function(){})(jqXHR, textStatus, errorThrown);
			}
		});
	};
	aw.del=function(url,successCallback,errorCallback){
		Dialog.confirm({
			title:"提示",
			content:"确认删除？删除后将无法恢复",
			confirm:function(){
				aw.ajax({
					url : url,
					type : "POST",
					success : function(data){
						(typeof successCallback === "function" ? successCallback : function(){})(data);
					},
					error : function(jqXHR, textStatus, errorThrown){
						(typeof errorCallback === "function" ? successCallback : function(){})(jqXHR, textStatus, errorThrown);
					}
				});
			}
		});
	};
	aw.customParam=function(jsonObject,parentKey){
		var ret="";
		if(typeof jsonObject === "object" && jsonObject.constructor === Array){
			for(var a=0;a<jsonObject.length;a++){
				ret+=jsonObject[a].name+"="+jsonObject[a].value+"&";
			}
			return ret;
		}
		if(typeof jsonObject === "object"){
			for(var i in jsonObject){
				var value=jsonObject[i];
				if(value===0){
					value="0";
				}
				if(value === false){
					value="false";
				}
				if(value && typeof value=='object' && value.constructor==Array){
					//数组
					var temp=parentKey ? parentKey+"."+i : i;
					for(var j=0;j<value.length;j++){
						if(typeof value[j] === "object"){
							ret+=this.customParam(value[j],i+"["+j+"]");
						}else{
							ret+=this.customParam(value[j],temp);
						}
					}
				}else if(value && typeof value=='object'){
					//对象
					var temp=parentKey ? parentKey+"."+i : i;
					ret+=this.customParam(value,temp);
				}else if(value){
					//普通类型
					var temp=parentKey ? parentKey+"."+i : i;
					ret+=temp+"="+value+"&";
				}else{
					var temp=parentKey ? parentKey+"."+i : i;
					ret+=temp+"="+""+"&";
				}
			}
			return ret;
		}else if(!jsonObject && !parentKey){
			return "";
		}else{
			return parentKey+"="+jsonObject+"&";
		}
	};

	module.exports = aw;
});
