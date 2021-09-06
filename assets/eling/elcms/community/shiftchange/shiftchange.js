define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var template=require("./shiftchange.tpl");
	require("./shiftchange.css");
	
	var sc_subnav=require("./assets/sc_subnav");
	var sc_panel=require("./assets/sc_panel");
	var sc_log=require("./assets/sc_log");
	var sc_interview=require("./assets/sc_interview");
	var sc_service=require("./assets/sc_service");
	var sc_visit=require("./assets/sc_visit");
	var sc_activitysignup=require("./assets/sc_activitysignup");
	var sc_repair=require("./assets/sc_repair");
	var sc_route=require("./assets/sc_route");
	var nsc_panel=require("./assets/nsc_panel");
	var sc_goout=require("./assets/sc_goout");
	var nsc_nsatt=require("./assets/nsc_nsatt");
	
	var ShiftChange=ELView.extend({
		attrs:{
			template:template,
			model:{},
			status:"receive"
		},
		events:{
			"propertychange textarea" : function(e){
				var height=e.target.scrollHeight < 60 ? 60 : e.target.scrollHeight;
				e.target.style.height=height + 'px';
			},
			"input textarea" : function(e){
				var height=e.target.scrollHeight < 60 ? 60 : e.target.scrollHeight;
				e.target.style.height=height + 'px';
			}
		},
		_initCustAttr:function(){
			//判断白班与夜班的页面 
			var params=this.get("params") || {type:"daytime"};
			var model=this.get("model");
			if(params && params.type=="daytime"){
				model.isDay=true;
			}else{
				model.isDay=false;
			}
			if(moment().hours()<12 && params.type!="daytime"){
	   			model.maxDate="+1969-12-31";
	   		}else if(params.type!="daytime"){
	   			model.maxDate="2014-12-10";
	   		}
		},
		initComponent:function(params,widget){
			this.set("subnav",sc_subnav.init(this,params));
			var subnav=this.get("subnav");
			var startdate,enddate;
			if(moment().hours()<12&&params.type!="daytime"){
				subnav.setValue("date",moment().startOf("days").subtract("days",1).valueOf());
	   		}
			this.loadData(params);
			
			if(params.type!="daytime"){
				startdate=subnav.getValue("date").start; // 如果为接班时间为今天所有数据
				enddate=subnav.getValue("date").end;
				params.startdate=startdate;
				params.enddate=enddate;
				this.set("npanel",nsc_panel.init(this,params));
				this.set("npanel-print",nsc_panel.initPrint(this,params));
				this.set("log",sc_log.init(this,params));
				this.set("log-print",sc_log.initPrint(this,params));
				this.set("repair",sc_repair.init(this,params));
				this.set("repair-print",sc_repair.initPrint(this,params));
				this.set("route",sc_route.init(this,params));
				this.set("route-print",sc_route.initPrint(this,params));
				this.set("nsatt",nsc_nsatt.init(this,params));
				this.set("nsatt-print",nsc_nsatt.initPrint(this,params));
			}else{
				if(this.get("status")=="send"){
					startdate=subnav.getValue("date").start ; //如果是交班 时间为今天
					enddate=subnav.getValue("date").end ;
				}else{
					startdate=subnav.getValue("date").start -86400000; // 如果为接班时间为昨天
					enddate=subnav.getValue("date").end-86400000 ;
				}
				params.startdate=startdate;
				params.enddate=enddate;
				this.set("panel",sc_panel.init(this,params));
				this.set("log",sc_log.init(this,params));
				this.set("log-print",sc_log.initPrint(this,params));
				this.set("interview",sc_interview.init(this,params));
				this.set("interview-print",sc_interview.initPrint(this,params));
				this.set("service",sc_service.init(this,params));
				this.set("service-print",sc_service.initPrint(this,params));
				this.set("visit",sc_visit.init(this,params));
				this.set("visit-print",sc_visit.initPrint(this,params));
				this.set("activitysignup",sc_activitysignup.init(this,params));
				this.set("activitysignup-print",sc_activitysignup.initPrint(this,params));
				this.set("repair",sc_repair.init(this,params));
				this.set("repair-print",sc_repair.initPrint(this,params));
				this.set("route",sc_route.init(this,params));
				this.set("route-print",sc_route.initPrint(this,params));
				this.set("goout",sc_goout.init(this,params));
				this.set("goout-print",sc_goout.initPrint(this,params));
			}
			
		},
		loadData:function(params){
			var subnav=this.get("subnav");
			var that=this;
			var date=params.type=="daytime" ? subnav.getValue("date").end : subnav.getValue("date").end+12*60*60*1000;
			var yesterday=params.type=="daytime" ?date-86400000*2+1:date-24*60*60*1000;
			aw.ajax({
				url:params.type=="daytime" ? "api/shiftchange/query":"api/nightshiftchange/query",
				async:false,
				data:{
					startWorkDate:yesterday,
					startWorkDateEnd:date,
					building:subnav.getValue("building"),
					fetchProperties:"*,startWork_user.name,finishWork_user.name"
				},
				dataType:"json",
				success:function(data){
					
					if(params.type=="daytime"){
						var tmp=that.findData(data, date);
						if(tmp){
							//说明存在一条今天的
							that.setShiftChange(tmp,params);
							$(".J-matters").attr("readonly",false);
							$(".J-exchangeGoods").attr("readonly",false);
							$(".J-nightShiftAttention").attr("readonly",false);
							$(".J-dayShiftAttention").attr("readonly",false);
							
							$(".J-pkShiftChange").attr("data-key",tmp.pkShiftChange);
						
							$(".J-version").attr("data-key",tmp.version);
							
							if(tmp.finishWorkDate){
								$(".J-shiftchange-finishWorkDate").text(moment(tmp.finishWorkDate).format("YYYY-MM-DD HH:mm:ss"));
							}else{
								$(".J-shiftchange-finishWorkDate").text("");
							}
							
							if(tmp.startWork_user){
								$(".J-shiftchange-start").attr("data-pk",tmp.startWork_user.pkUser);
								$(".J-shiftchange-startWorkUser").text(tmp.startWork_user.name);	
								
							}else{
								$(".J-shiftchange-startWorkUser").text("");
							}
							if(tmp.startWorkDate){
								$(".J-startWorkDate").attr("data-key",tmp.startWorkDate);
								$(".J-shiftchange-startWorkDate").text(moment(tmp.startWorkDate).format("YYYY-MM-DD HH:mm:ss"));
							}else{
								$(".J-shiftchange-startWorkDate").text("");
							}
							
							if(tmp.finishWork_user){
								$(".J-shiftchange-finishWorkUser").text(tmp.finishWork_user.name);
							}else{
								$(".J-shiftchange-finishWorkUser").text("");
							}
							subnav.show(["send"]).hide(["receive"]);
							that.set("status","send");
						}else{
							//证明存在一条昨天的
							tmp=that.findData(data, yesterday);
							if(tmp&&moment(moment().format).isSame(subnav.getValue("date").start,"day")){
								that.setShiftChange(tmp,params);
								$(".J-matters").attr("readonly","readonly");
								$(".J-nightShiftAttention").attr("readonly","readonly");
								$(".J-dayShiftAttention").attr("readonly","readonly");
								$(".J-exchangeGoods").attr("readonly","readonly");
								if(tmp.startWorkDate){
									$(".J-startWorkDate").text(moment(tmp.startWorkDate).format("YYYY-MM-DD HH:mm:ss"));
								}else{
									$(".J-startWorkDate").text("");
								}
								if(tmp.finishWorkDate){
									$(".J-finishWorkDate").text(moment(tmp.finishWorkDate).format("YYYY-MM-DD HH:mm:ss"));
								}else{
									$(".J-finishWorkDate").text("");
								}
								if(tmp.startWork_user){
									$(".J-startWorkUser").text(tmp.startWork_user.name);
								}else{
									$(".J-startWorkUser").text("");
								}
								if(tmp.finishWork_user){
									$(".J-finishWorkUser").text(tmp.finishWork_user.name);	
								}else{
									$(".J-finishWorkUser").text("");
								}
								subnav.show(["receive"]).hide(["send"]);
								that.set("status","receive");
							}else{
								that.setShiftChange(tmp,params);
								$(".J-matters").attr("data-key","readonly");
								$(".J-matters").attr("readonly","readonly");
								$(".J-nightShiftAttention").attr("readonly","readonly");
								$(".J-dayShiftAttention").attr("readonly","readonly");
								$(".J-exchangeGoods").attr("readonly","readonly");
								$(".J-shiftchange-startWorkUser").text("");
								$(".J-shiftchange-startWorkDate").text("");
								$(".J-shiftchange-finishWorkUser").text("");
								$(".J-shiftchange-finishWorkDate").text("");
								subnav.show(["receive"]).hide(["send"]);
								that.set("status","receive");
							}
						}
						
						
					}else{
		
						if(data.length!=0){
							//说明存在一条今天的
							$(".J-matters").attr("readonly",false);
							$(".J-exchangeGoods").attr("readonly",false);
							$(".J-nightOthers").attr("readonly",false);
							$(".J-pkNightShiftChange").attr("data-key",data[data.length-1].pkNightShiftChange);
							$(".J-exchangeGoods").val(data[data.length-1].exchangeGoods||"");
							$(".J-matters").val(data[data.length-1].matters||"");
							$(".J-nightOthers").val(data[data.length-1].nightOthers||"");
							$(".J-version").attr("data-key",data[data.length-1].version);
							if(data[data.length-1].startWork_user){
								$(".J-shiftchange-start").attr("data-pk",data[data.length-1].startWork_user.pkUser);
								$(".J-shiftchange-startWorkUser").text(data[data.length-1].startWork_user.name);
							}else{
								$(".J-shiftchange-startWorkUser").text("");
							}
							if(data[data.length-1].startWorkDate){
								$(".J-startWorkDate").attr("data-key",data[data.length-1].startWorkDate);
								$(".J-shiftchange-startWorkDate").text(moment(data[data.length-1].startWorkDate).format("YYYY-MM-DD HH:mm:ss"));
							}else{
								$(".J-shiftchange-startWorkDate").text("");
							}
							if(data[data.length-1].finishWork_user){
								$(".J-shiftchange-finishWorkUser").text(data[data.length-1].finishWork_user.name);
							}else{
								$(".J-shiftchange-finishWorkUser").text("");
							}
							if(data[data.length-1].finishWorkDate){
								$(".J-shiftchange-finishWorkDate").text(moment(data[data.length-1].finishWorkDate).format("YYYY-MM-DD HH:mm:ss"));
							}else{
								$(".J-shiftchange-finishWorkDate").text("");
							}
							subnav.show(["send"]).hide(["receive"]);
							that.set("status","send");
						}else{
							$(".J-matters").val("");
							$(".J-exchangeGoods").val("");
							$(".J-nightOthers").val("");
							$(".J-shiftchange-finishWorkDate").text("");
							$(".J-shiftchange-startWorkDate").text("");
							$(".J-shiftchange-startWorkUser").text("");
							$(".J-shiftchange-finishWorkUser").text("");
							subnav.show(["receive"]).hide(["send"]);
							that.set("status","receive");
					}
					
					}
					
					
					
				}
			});
		},
		setShiftChange:function(data,params){
			if(data){
				if(params.type=="daytime"){
					$(".J-matters").val(data.matters || "");
					$(".J-nightShiftAttention").val(data.nightShiftAttention || "");
					$(".J-dayShiftAttention").val(data.dayShiftAttention || "");
					$(".J-exchangeGoods").val(data.exchangeGoods || "");
				};
			}else{
				$(".J-matters").val("");
				$(".J-nightOthers").val("");
				$(".J-nightShiftAttention").val("");
				$(".J-dayShiftAttention").val("");
				$(".J-exchangeGoods").val("");
			}
		},
		findData:function(data,date){
			for(var  i =0;i<data.length;i++){
				if	(moment(data[i].startWorkDate).format("YYYY-MM-DD")==moment(date).format("YYYY-MM-DD")){
					return data[i];
				}
			}
		}
	});
	
	module.exports = ShiftChange;
});
