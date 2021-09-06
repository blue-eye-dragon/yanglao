define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var columns=[{
		key:"title",
		name:"主题"
	},{
		key:"description",
		name:"备注"
	},{
		key:"finishDate",
		name:"完成时间",
		format:"date",
		formatparams:{
			mode:"YYYY-MM-DD HH:mm"
		}
	},{
		key:"isFinish",
		name:"是否完成",
		format:function(row,value){
			if(value.finishDate){
				return "是";
			}else{
				return "否";
			}
		}
	}];
	
	
	var SC_activity={
		init:function(widget,params){
			return new Grid({
				parentNode:".J-routing",
				url:"api/action/queryByCond",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						type:params.type=="daytime" ?"DailyRoutine":"NightRoutIns",
						"building.pkBuilding":params.type=="daytime" ? widget.get("subnav").getValue("building") :"",
						date:params.type=="daytime" ?params.startdate:params.startdate+16.5*60*60*1000,
						dateEnd:params.type=="daytime" ?params.enddate:params.enddate+8.5*60*60*1000,
						fetchProperties:"title,description,finishDate,building.name"
					};
				},
				model:{
					head:{
						title:params.type=="daytime" ?"例行工作":"夜间巡检",
					},
					columns:params.type=="daytime" ?[columns[0],columns[1],columns[3]]:columns,
				}
			});
		},
		initPrint:function(widget,params){
			return new Grid({
				autoRender:false,
				isInitPageBar:false,
				parentNode:".J-routing-print",
				model:{
					head:{
						title:params.type=="daytime" ?"例行工作":"夜间巡检"
					},
					columns:columns
				}
			});
		}
	};
	
	module.exports=SC_activity;
});