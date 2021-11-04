/*
 * 周报执行情况
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Form=require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
	var Grid=require("grid-1.0.0");
	
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid ' ></div>"+
	"<div class='J-form hidden' ></div>";
	
	var weekStart;
	var maxDate;
	
	var taskexecute = ELView.extend({
		attrs:{
			template:template
		},
		
		openDetail:function(data,flag,widget,index){
			var start=this.get("subnav").getValue("time").start;
			var end=this.get("subnav").getValue("time").end;
			var week=moment(start).weeks();
			
			var para={
					"pkUser":data.pkUser,
					"Monday":start,
					"Sunday":end,
					"department":data.department,
					"name":data.user,
					"check":"elcmsUser",
					"flg":flag,
					"week": week,
					fetchProperties:"content," +
						"user.name," +
						"startDate," +
						"endDate," +
						"ratio," +
						"finishDate," +
						"overTime," +
						"reason," +
						"userCreate.name," +
						"userTo.name," +
						"version," +
						"pkWorkTaskPlan",
				}
			widget.openView({
				url:"eling/elcms/oa/dailywork/worktaskplan/worktaskplan",
				params:para,
				isAllowBack:true
			});
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				 parentNode:".J-subnav",
    			 model:{
    				 title:"工作执行情况汇总",
    				 items : [{
    					id : "time",
    					type : "daterange",
   						tip :"任务开始时间",
   						singleDatePicker:true,
   						showDropdowns : false,
   						startDate:moment(),
  						handler :function(time){
   	    					//获取选中日期
   	    					var clickTime=widget.get("subnav").getValue("time").start;
   	    					//计算选中日期所在周的周一和周日
   	    					var thisMonday;
	    					var thisSunday;
	    					var thisWeek;
	    					if((moment(clickTime).weekday() == 0 && weekStart!=0)||(moment(clickTime).weekday() < (weekStart)) ){//今天是周日
	    						thisMonday = moment(clickTime).weekday(weekStart-7);
	        					thisSunday = moment(clickTime).weekday(weekStart-1);
	    					}else{
	    						thisMonday=moment(clickTime).weekday(weekStart);
	        					thisSunday=moment(clickTime).weekday(weekStart+6);
	    					}
   	    					//赋值
   	    					widget.get("subnav").setValue("time",{
  		 	    						start:thisMonday,
  		 	    						end:thisSunday
   	    						});
   	    					//刷新grid
   	    					var startWeekTime=widget.get("subnav").getValue("time").start;
 	 	   	    			var endWeekTime=widget.get("subnav").getValue("time").end;
 	 	   	    		    thisWeek = moment(startWeekTime).weeks();
 							subnav.setTitle("工作执行情况汇总: 第"+thisWeek+"周 "+moment(startWeekTime).format("YYYY-MM-DD")+"~"+moment(endWeekTime).format("YYYY-MM-DD"));
 						    widget.get("grid").refresh();
   						}
    				 }],
    			 }
			});
			this.set("subnav",subnav);
			
			 var grid=new Grid({
				 parentNode:".J-grid",
				 autoRender : false,
				 url:"api/report/taskexecution",
				 params:function(){
					 return {
						 "start":widget.get("subnav").getValue("time").start,
						 "end":widget.get("subnav").getValue("time").end,
					 }
				 },
				 model:{
					 columns:[{
						 key:"week",
						 name:"周",
						 format:function(row,value){
							 return "第"+moment(widget.get("subnav").getValue("time").start).weeks()+"周";
						 }
					 },{
						 key:"department",
						 name:"所属部门",
					 },{
						 key:"user",
						 name:"负责人",
					 },{
						 key:"finishTask",
						 name:"完成任务",
						 className : "text-right",
						 format:"detail",
						 formatparams:[{
							key:"finishTasks",
							handler:function(index,data,rowEle){
								if(data.finishTask == 0){
									return;
								}else{
									widget.openDetail(data,"finishTask",widget,index);
								}
							}
						}]
					 },{
						 key:"overTimeFinish",
						 name:"超期完成",
						 className : "text-right",
						 format:"detail",
						 formatparams:[{
							key:"overTimeFinishs",
							handler:function(index,data,rowEle){
								if(data.overTimeFinish == 0){
									return;
								}else{
									widget.openDetail(data,"overTimeFinish",widget,index);
								}
							}
						}]
					 }]
				 }
			 });
			 this.set("grid",grid);
		},
		
		afterInitComponent:function(params,widget){
			var subnav=widget.get("subnav");
			if(params){
				var checkinDatePlugin = widget.get("subnav").getPlugin("time");
				var instance = checkinDatePlugin.getInstance("time");
				
				instance.daterangepicker.maxDate = params.maxDate;
				instance.daterangepicker.updateCalendars();
				
				subnav.setValue("time",{
						start:params.start,
						end:params.end
				});
				subnav.setTitle("工作执行情况汇总: 第"+moment(params.start).weeks()+"周 "+moment(params.start).format("YYYY-MM-DD")+"~"+moment(params.end).format("YYYY-MM-DD"));
				widget.get("grid").refresh();
			}else{
				 aw.ajax({
	    				url : "api/sysparameter/worktaskplan_weekstart",
	    				type : "POST",
	    				data : {
	    					fetchProperties:"value"
	    				},
	    				success : function(datas) {
	    					if(datas!=null){
	    						weekStart=datas;
	    					}
	    					var thisMonday;
	    					var thisSunday;
	    					var thisWeek;
	    					if((moment().weekday() == 0 && weekStart!=0 )||(moment().weekday() < (weekStart))){//今天是周日
	    						thisMonday = moment().weekday(weekStart-7);
	        					thisSunday = moment().weekday(weekStart-1);
	        					maxDate = moment().weekday(weekStart-1).add(-7,'day');
	    					}else{
	    						thisMonday=moment().weekday(weekStart);
	        					thisSunday=moment().weekday(weekStart+6);
	        					maxDate = moment().weekday(weekStart+6).add(-7,'day');
	    					}
	    					var checkinDatePlugin = widget.get("subnav").getPlugin("time");
							var instance = checkinDatePlugin.getInstance("time");
							
							instance.daterangepicker.maxDate = maxDate;
							instance.daterangepicker.updateCalendars();
	    					//本周
	    	    			widget.get("subnav").setValue("time",{
	    							start:thisMonday.add('day',-7),
	    							end:thisSunday.add('day',-7),
	    					});
	    	    			thisWeek=moment(widget.get("subnav").getValue("time").start).weeks();
	    					subnav.setTitle("工作执行情况汇总: 第"+(thisWeek)+"周 "+moment(thisMonday).format("YYYY-MM-DD")+"~"+moment(thisSunday).format("YYYY-MM-DD"));
	    					widget.get("grid").refresh();
	    				}
	    			});
				
			}
			
		},
		setEpitaph : function(){
			var start=this.get("subnav").getValue("time").start;
			var end=this.get("subnav").getValue("time").end;
			var weeks=moment(start).weeks();
			return {
				weeks:weeks,
				start:start,
				end:end,
				maxDate:maxDate
			};
		}
	});
	module.exports=taskexecute;
});
