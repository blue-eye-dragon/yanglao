define(function(require,exports,module){
	var Grid = require("grid");
	var aw=require("ajaxwrapper");
	var ReportGrid=require("reportgrid");
	var servicestatistics={
			init:function(widget,inParams){
				return new ReportGrid({
					parentNode:"#serviceStatistics",
					isInitPageBar:false,
					autoRender : false,
					url:"api/generalchargesummary/report",
					params:function(){
						return {
							pkGeneralServiceItem:widget.get("subnav").getValue("generalServiceItem"),
							year:widget.get("subnav").getValue("year"),
						};
					},
				    model:{
				    	datas : {
				    		id:"count",
				    		cols : [{
								className : "text-center", 
							}],
							click : function(data){
								if(data.count == "0"){
									return false;
								}
								var year = widget.get("subnav").getValue("year");
								var build = data.building;
								var month = data.month;
								if(month == "1月份"){
									month = 01;
								}else if(month == "2月份"){
									month = 02;
								}else if(month == "3月份"){
									month = 03;
								}else if(month == "4月份"){
									month = 04;
								}else if(month == "5月份"){
									month = 05;
								}else if(month == "6月份"){
									month = 06;
								}else if(month == "7月份"){
									month = 07;
								}else if(month == "8月份"){
									month = 08;
								}else if(month == "9月份"){
									month = 09;
								}else if(month == "10月份"){
									month = 10;
								}else if(month == "11月份"){
									month = 11;
								}else if(month == "12月份"){
									month = 12;
								}
								var monthFirstDay= year + "-" +month;
								var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
								var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
								aw.ajax({
									url : "api/building/query",
									type : "POST",
									data : {
										name:build,
										fetchProperties:"pkBuilding"
									},
									dataType:"json",
									success:function(datas){
										if(datas.length == 0){
											pkBuilding = "";
										}else{
											pkBuilding=datas[0].pkBuilding;
										}
										widget.openView({
											url:"eling/elcms/reports/generalchargesummary/generalchargedetail",
											params:{
												 year:year,
												 month:month,
												 "generalServiceItem":widget.get("subnav").getValue("generalServiceItem"),
												 "date":moment(monthFirstDay,"YYYY-MM-DD").valueOf(),
												 "dateEnd":moment(monthLastDay,"YYYY-MM-DD").valueOf(),
												 building:pkBuilding,
											},
											isAllowBack:true
										})
									}
								});
							}
				    	}
				    },
				});
			},
		}
	module.exports=servicestatistics;
})