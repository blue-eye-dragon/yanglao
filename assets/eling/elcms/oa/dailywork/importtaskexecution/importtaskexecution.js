/*
 * 重点工作执行情况统计
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid = require("grid-1.0.0");
	var MultiRowGrid = require("multirowgrid");
	var Dialog=require("dialog-1.0.0");
	var enums  = require("enums");
	require("../../../grid_css.css");
	require("./importtaskexecution.css");
	var Properties=require("./properties");
	var template = require("./importtaskexecution.tpl");
	
	var weekStart;
	var thisMonday;
	var thisSunday;
	
	var lastMonday;
	var lastSunday;
	var maxDate;
	
	var importtaskexecute = ELView.extend({
		events:{
			"click .J-nextweek ":function(e){/*下周按钮*/
				var start_1=moment($(".J-weektimestart1")[0].innerText);
				var end_1=moment($(".J-weektimeend1")[0].innerText);
				
				var start_2=moment($(".J-weektimestart2")[0].innerText);
				var end_2=moment($(".J-weektimeend2")[0].innerText);
				
				var start1=moment(start_1).add(7,'day');
				var end1=moment(end_1).add(7,'day');
				var week1=moment(start1).weeks();
				this.get("subnav").setValue("time",{
					start:start1,
					end:end1
				});
						
				var start2=moment(start_2).add(7,'day');
				var end2=moment(end_2).add(7,'day');
				Properties.sethiddentime(start1,end1,week1,start2,end2);
				title1=end1.format('YYYY')+"年第"+week1+"周工作"+start1.format('MM月DD日')+"~"+end1.format('MM月DD日');
				title2=end2.format('YYYY')+"年第"+(moment(start2).weeks())+"周工作"+start2.format('MM月DD日')+"~"+end2.format('MM月DD日');
				Properties.setdetilgridtitle1(this,start1,end1,title1,thisMonday,thisSunday);
				Properties.setdetilgridtitle2(this,start1,end1,title2,thisMonday,thisSunday,lastMonday,lastSunday);
				//上一周本人不能修该
				Properties.loaddetilgrid1(this,start1,end1);
				//上一周本人不能修该
				Properties.loaddetilgrid2(this,start2,end2);
			},
			"click .J-lastweek ":function(e){
				
				var start_1=moment($(".J-weektimestart1")[0].innerText);
				var end_1=moment($(".J-weektimeend1")[0].innerText);
				
				var start_2=moment($(".J-weektimestart2")[0].innerText);
				var end_2=moment($(".J-weektimeend2")[0].innerText);
				
				var start1=moment(start_1).subtract(7,'day');
				var end1=moment(end_1).subtract(7,'day');
				var week1=moment(start1).weeks();
				this.get("subnav").setValue("time",{
					start:start1,
					end:end1
				});
				var start2=moment(start_2).subtract(7,'day');
				var end2=moment(end_2).subtract(7,'day');
				
				Properties.sethiddentime(start1,end1,week1,start2,end2);
				var title1=end1.format('YYYY')+"年第"+(week1)+"周工作"+start1.format('MM月DD日')+"~"+end1.format('MM月DD日');
				var title2=end2.format('YYYY')+"年第"+(moment(start2).weeks())+"周工作"+start2.format('MM月DD日')+"~"+end2.format('MM月DD日');
				Properties.setdetilgridtitle1(this,start1,end1,title1,thisMonday,thisSunday);
				Properties.setdetilgridtitle2(this,start1,end1,title2,thisMonday,thisSunday,lastMonday,lastSunday);
				Properties.loaddetilgrid1(this,start1,end1);
				Properties.loaddetilgrid2(this,start2,end2);
			},
		},
		attrs:{
			template:template
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				 parentNode:".J-subnav",
    			 model:{
    				 title:"工作执行情况统计",
    				 items : [{
    					 id : "department",
    					 type : "buttongroup",
    					 tip:"部门",
    					 keyField : "pkDepartment",
    					 valueField : "name",
    					 url : "api/department/queryall",
    					 all : {
 							show : true,
 							text : "全部",
 							position : "bottom"
 						 },
    					 params : function(){
    						 return{
    							 fetchProperties:"pkDepartment,name",
    						 }
    					 },
    					 handler : function(key,value){
    						 Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
    					 }
    					 
    				 },{
    					 id : "priority",
    					 type : "buttongroup",
    					 tip : "优先级",
    					 items:enums["com.eling.elcms.oa.dailywork.model.WorkTaskPlan.Priority"],
    					 all : {
  							show : true,
  							text : "全部",
  							position : "bottom"
  						 },
    					 handler : function(key,value){
    						 Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
    					 }
    				 },{
    					id : "time",
    					type : "daterange",
   						tip :"任务维度",
   						singleDatePicker:true,
   						startDate:moment(),
  						handler :function(time){
   	    					//获取选中日期
   	    					var clickTime=widget.get("subnav").getValue("time").start;
   	    					//计算选中日期所在周的周一和周日
   	    					var clickMonday;
	    					var clickSunday;
	    					if((moment(clickTime).weekday() == 0 && weekStart!=0)||(moment(clickTime).weekday() < (weekStart)) ){//今天是周日
	    						clickMonday = moment(clickTime).weekday(weekStart-7);
	    						clickSunday = moment(clickTime).weekday(weekStart-1);
	    					}else{
	    						clickMonday=moment(clickTime).weekday(weekStart);
	    						clickSunday=moment(clickTime).weekday(weekStart+6);
	    					}
   	    					//赋值
   	    					widget.get("subnav").setValue("time",{
  		 	    						start:clickMonday,
  		 	    						end:clickSunday
   	    						});
   	    					//刷新grid
 	 	   	    			Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
   						}
    				 }],
    			 }
			});
			this.set("subnav",subnav);
			
			 var grid1=new Grid({
				 autoRender:false,
				 parentNode:".J-grid1",
				 url:"api/report/taskexecutionimport",
				 fetchProperties :"depart.pkDepartment," +
			 		"depart.name," +
			 		"work.pkWorkTaskPlan," +
			 		"work.content," +
			 		"work.user.pkUser," +
			 		"work.user.name," +
			 		"work.startDate," +
			 		"work.endDate," +
			 		"work.finishDate," +
			 		"work.reason," +
			 		"reportList.pkReportRelation," +
			 		"reportList.userTo.pkUser," +
			 		"reportList.userTo.name",
				 model:{
					 head:{
						title:"", 
					 },
					 columns:[{
						 key:"depart",
						 name:"部门",
						 className:"oneColumn",
						 format : function(value,row){
							 if(value==null){
								 return "无";
							 }else{
								 return value.name;
							 }
						 }
					 },{
						 key : "work.content",
						 name:"工作内容",
						 className:"threeColumn",
					 },{
						 key:"work.user.name",
						 name:"负责人",
						 className:"oneColumn",
					 },{
						 key:"reportList",
						 name:"汇报对象",
						 className:"oneColumn",
						 format : function(value,row){
							 var result="";
							 for(var i=0;i<value.length;i++){
								 if(i==(value.length-1)){
									 result+=value[i].userTo.name;
								 }else{
									 result+=value[i].userTo.name+"、";
								 }
							 }
							 return result;
						 }
					 },{
						 key:"work.startDate",
						 className:"oneColumn",
						 name:"开始日期",
						 format:"date"
					 },{
						 key:"work.endDate",
						 className:"oneColumn",
						 name:"结束日期",
						 format:"date"
					 },{
						 key:"work.finishDate",
						 className:"oneColumn",
						 name:"实际完成时间",
						 format:"date"
					 },{
						 key:"work",
						 className:"oneColumn",
						 name:"是否超期",
						 format : function(value,row){
							 var sunbav = widget.get("subnav");
							 var start = moment(value.startDate);
							 var end = moment(value.endDate);
							 var finishDate ="";
							 if(value.finishDate){
								 finishDate=moment(value.finishDate);
							 }
							 var start_1 =moment(subnav.getValue("time").start);
							 var end_1 = moment(subnav.getValue("time").end);
							 if(finishDate){
								 if(finishDate.isBefore(end,"day")||finishDate.isSame(end,"day")){
									 return "否";
								 }else if (finishDate.isAfter(end,"day")){//晚于预计结束日期，在本周之内
									 if(finishDate.isAfter(end_1,"day")){
										 return "是";
									 }else if(finishDate.isBefore(end_1,"day")){
										 end_1.add(-7,'day');
										 if(end_1.isBefore(end,'day')&&end_1.isBefore(finishDate,'day')){
											 return "否";
										 }else if((end_1.isAfter(end,'day')||end_1.isSame(end,'day'))&&end_1.isBefore(finishDate,'day')){
											 return "是";
										 }
									 }
								 }else if(end.isAfter(end_1,"day")){
									 var i=1;
									 do{
										 end_1.add(7,'day');
										 i++;
									 }while(end.isAfter(end_1,"day"));
									 if(end_1.isBefore(finishDate,"day")){
										 return "是";
									 }else if(end_1.isAfter(finishDate,"day")||end_1.isSame(finishDate,"day")){
										 return "否";
									 }
									 
								 }
							 }else{
								 if((end.isBefore(end_1,"day")||end.isSame(end_1,"day"))){
									 //距本周大于一周
									 if(end.add(7,'day').isBefore(end_1,'day')||end.add(7,'day').isSame(end_1,'day')){
										 return "是";
									 }else{
										 if(end_1.isBefore(moment(),"day")){
											 return "是";
										 }else if(end_1.isAfter(moment(),"day")||end_1.isSame(moment(),"day")){
											 return "否";
										 }
									 }
								 }else if(end.isAfter(end_1,"day")){
									 var i=1;
									 do{
										 end_1.add(7,'day');
										 i++;
									 }while(end.isAfter(end_1,"day"));
									 if(end_1.isBefore(moment(),"day")){
										 return "是";
									 }else if(end_1.isAfter(moment(),"day")||end_1.isSame(moment(),"day")){
										 return "否";
									 }
								 }
								 
							 }
						 }
					 },{
						 key:"work.reason",
						 className:"twoColumn",
						 name:"备注"
					 }]
				 }
			 });
			 this.set("grid1",grid1);
			 
			 var grid2=new Grid({
				 autoRender:false,
				 parentNode:".J-grid2",
				 url:"api/report/taskexecutionimport",
				 fetchProperties :"depart.pkDepartment," +
			 		"depart.name," +
			 		"work.pkWorkTaskPlan," +
			 		"work.content," +
			 		"work.user.pkUser," +
			 		"work.user.name," +
			 		"work.startDate," +
			 		"work.endDate," +
			 		"work.finishDate," +
			 		"work.reason," +
			 		"reportList.pkReportRelation," +
			 		"reportList.userTo.pkUser," +
			 		"reportList.userTo.name",
				 model:{
					 head:{
							title:"", 
						 },
					 columns:[{
						 key:"depart",
						 name:"部门",
						 className:"oneColumn",
						 format : function(value,row){
							 if(value==null){
								 return "无";
							 }else{
								 return value.name;
							 }
						 }
					 },{
						 key : "work.content",
						 name:"工作内容",
						 className:"threeColumn",
					 },{
						 key:"work.user.name",
						 name:"负责人",
						 className:"oneColumn",
					 },{
						 key:"reportList",
						 name:"汇报对象",
						 className:"oneColumn",
						 format : function(value,row){
							 var result="";
							 for(var i=0;i<value.length;i++){
								 if(i==(value.length-1)){
									 result+=value[i].userTo.name;
								 }else{
									 result+=value[i].userTo.name+"、";
								 }
							 }
							 return result;
						 }
					 },{
						 key:"work.startDate",
						 className:"oneColumn",
						 name:"开始日期",
						 format:"date"
					 },{
						 key:"work.endDate",
						 className:"oneColumn",
						 name:"结束日期",
						 format:"date"
					 },{
						 key:"work.finishDate",
						 className:"oneColumn",
						 name:"实际完成时间",
						 format:"date"
					 },{
						 key:"work",
						 className:"oneColumn",
						 name:"是否超期",
						 format : function(value,row){
							 var sunbav = widget.get("subnav");
							 var start = moment(value.startDate);
							 var end = moment(value.endDate);
							 var finishDate ="";
							 if(value.finishDate){
								 finishDate=moment(value.finishDate);
							 }
							 var start_1=moment($(".J-weektimestart2")[0].innerText);
							 var end_1=moment($(".J-weektimeend2")[0].innerText);
							 if(finishDate){
								 if(finishDate.isBefore(end,"day")||finishDate.isSame(end,"day")){
									 return "否";
								 }else if (finishDate.isAfter(end,"day")){//晚于预计结束日期，在本周之内
									 if(finishDate.isAfter(end_1,"day")){
										 return "是";
									 }else if(finishDate.isBefore(end_1,"day")){
										 end_1.add(-7,'day');
										 if(end_1.isBefore(end,'day')&&end_1.isBefore(finishDate,'day')){
											 return "否";
										 }else if((end_1.isAfter(end,'day')||end_1.isSame(end,'day'))&&end_1.isBefore(finishDate,'day')){
											 return "是";
										 }
									 }
								 }else if(end.isAfter(end_1,"day")){
									 var i=1;
									 do{
										 end_1.add(7,'day');
										 i++;
									 }while(end.isAfter(end_1,"day"));
									 if(end_1.isBefore(finishDate,"day")){
										 return "是";
									 }else if(end_1.isAfter(finishDate,"day")||end_1.isSame(finishDate,"day")){
										 return "否";
									 }
									 
								 }
							 }else{
								 if((end.isBefore(end_1,"day")||end.isSame(end_1,"day"))){
									 //距本周大于一周
									 if(end.add(7,'day').isBefore(end_1,'day')||end.add(7,'day').isSame(end_1,'day')){
										 return "是";
									 }else{
										 if(end_1.isBefore(moment(),"day")){
											 return "是";
										 }else if(end_1.isAfter(moment(),"day")||end_1.isSame(moment(),"day")){
											 return "否";
										 }
									 }
								 }else if(end.isAfter(end_1,"day")){
									 var i=1;
									 do{
										 end_1.add(7,'day');
										 i++;
									 }while(end.isAfter(end_1,"day"));
									 if(end_1.isBefore(moment(),"day")){
										 return "是";
									 }else if(end_1.isAfter(moment(),"day")||end_1.isSame(moment(),"day")){
										 return "否";
									 }
								 }
								 
							 }
						 }
					 },{
						 key:"work.reason",
						 className:"twoColumn",
						 name:"备注"
					 }]
				 }
			 });
			 this.set("grid2",grid2);
		},
		
		afterInitComponent:function(params,widget){
			var subnav=widget.get("subnav");
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
    					if((moment().weekday() == 0 && weekStart!=0 )||(moment().weekday() < (weekStart))){//今天是周日
    						thisMonday = moment().weekday(weekStart-7);
        					thisSunday = moment().weekday(weekStart-1);
        					lastMonday = moment().weekday(weekStart-7).add(7,'day');
        					lastSunday = moment().weekday(weekStart-1).add(7,'day');
        					maxDate = moment().weekday(weekStart-1).add(7,'day');
    					}else{
    						thisMonday=moment().weekday(weekStart);
        					thisSunday=moment().weekday(weekStart+6);
        					lastMonday = moment().weekday(weekStart).add(7,'day');
        					lastSunday = moment().weekday(weekStart+6).add(7,'day');
        					maxDate = moment().weekday(weekStart+6).add(7,'day');
    					}
    					//设置最大可选时间范围
//    					var checkinDatePlugin = widget.get("subnav").getPlugin("time");
//						var instance = checkinDatePlugin.getInstance("time");
//						
//						instance.daterangepicker.maxDate = maxDate;
//						instance.daterangepicker.updateCalendars();
    					//本周
    	    			widget.get("subnav").setValue("time",{
    							start:thisMonday,
    							end:thisSunday,
    							
    					});
    	    			var subnav = widget.get("subnav");
    	    			var start1=moment(thisMonday);
    					var end1=moment(thisSunday);
    					var week1=moment(start1).weeks();
    					
    					var start2=moment(lastMonday);
    					var end2=moment(lastSunday);
    					
    					Properties.sethiddentime(start1,end1,week1,start2,end2);
    					
    					var title1=end1.format('YYYY')+"年第"+week1+"周工作"+start1.format('MM月DD日')+"~"+end1.format('MM月DD日');
    					var title2=end2.format('YYYY')+"年第"+(moment(start2).weeks())+"周工作"+start2.format('MM月DD日')+"~"+end2.format('MM月DD日');
    					Properties.setdetilgridtitle1(widget,start1,end1,title1,thisMonday,thisSunday);
    					Properties.setdetilgridtitle2(widget,start1,end1,title2,thisMonday,thisSunday,lastMonday,lastSunday);
    					Properties.loaddetilgrid1(widget,start1,end1);
    					Properties.loaddetilgrid2(widget,start2,end2);
    				}
    			});
				
			
		},
	});
	module.exports=importtaskexecute;
});
