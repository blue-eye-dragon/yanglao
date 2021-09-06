define(function(require, exports, module) {
	var ELView=require("elview");
	var Grid=require("grid-1.0.0");
	var printgriddetail1={
		init:function(widget,params){
			var grid1 =new Grid({
	         	parentNode:params.parentNode,
				autoRender:false,
				isInitPageBar:false,
				model:{
 					head:{
						title:"", 
					},
 					columns:[{
 						key:"ggg",
 						name:"序号",
 						className:"ggg"
 					},{
 						key:"content",
 						name:"工作内容",
 						className:"content"
 					},{
 						key:"startDate",  
 						name:"开始日期",
 						format:"date",
 						className:"startDate"
 					},{
 						key:"endDate",  
 						name:"结束日期",
 						format:"date",
 						className:"endDate"
 					},{
 						key:"priority.value",  
 						name:"优先级",
 						className:"priority"
 					},{
 						key:"ratio",  
 						name:"完成程度",
 						className:"ratio",
 						format:function(value,row){
 							return value+"%";
 						},
 					},{
 						key:"finishDate",  
 						name:"实际完成时间",
 						format:"date",
 						className:"finishDate"
 					},{
 						name:"是否超期",
 						className:"outTime",
 						format:function(value,row){
 							var start_1;
 							var end_1;
 							if(params.endDate){
 								end_1=moment(params.endDate);
 								start_1=moment(params.startDate);
 							}else if(moment($(".J-weektimeend1")[0].innerText)){
 								end_1=moment($(".J-weektimeend1")[0].innerText);
 								start_1=moment($(".J-weektimestart1")[0].innerText);
 							}
 							if(end_1.isBefore(moment(row.endDate),"day")){//预计结束时间在本周之后
 								return "否";
 							}
 							if(end_1.isAfter(moment(row.endDate),"day")||end_1.isSame(moment(row.endDate),"day")){//预计结束时间在本周之内
 								 if((start_1.isBefore(moment(row.endDate),"day")||start_1.isSame(moment(row.endDate),"day"))&&(moment().isBefore(end_1,"day")||moment().isSame(end_1,"day"))){//本周之内
  									return "否";
  								}else if(start_1.isAfter(moment(row.endDate),"day")){
  									return "是";
  								}else{
 									if(row.finishDate==null||moment(row.finishDate).isAfter(end_1,"day")){
 										return "是";
 									}else{
 										return "否";
 									}
 								}
 							}
						
 						}
 					},{
 						key:"reason", 
 						className:"reason",
 						name:"备注",
 					}]
				}
			});
			return grid1;
		}
	}
module.exports=printgriddetail1  ;
});


