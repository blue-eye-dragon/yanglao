define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var columns=[{
		key:"place.name",
		name:"位置"
	
	},{
		key:"content",
		name:"内容"
	},{
		key:"repairDetails",
		name:"报修时间",
		format:function(value,row){
			var time="";
			for(var i=0;i<value.length;i++){
				if(value[i].operateType.key == "RepairClaiming"){
					time = moment(value[i].createDate).format("YYYY-MM-DD");
					break;
				}
			}
			return time;
			},
	},{
		key:"repairDetails",
		name:"维修完成时间",
		format:function(value,row){
			var time="";
			for(var i=0;i<value.length;i++){
				if(value[i].operateType.key == "Finished"){
					time = moment(value[i].createDate).format("YYYY-MM-DD");
					break;
				}
			}
			return time;
			},
	},{
		key:"flowStatus.value",
		name:"维修状态",
	}];
	
	var SC_repair={
		init:function(widget,params){
			return new Grid({
				parentNode:".J-repair",
				url: "api/repair/queryShiftChange" ,
				params:function(){
					return {
						"place.building":params.type=="daytime" ? widget.get("subnav").getValue("building") :"",
						createDate:params.type=="daytime" ?params.startdate:params.startdate+16.5*60*60*1000,
						createDateEnd:params.type=="daytime" ?params.enddate:params.enddate+8.5*60*60*1000,
						fetchProperties:"*,place.name," +
						"flowStatus," +
						"repairDetails.operateType," +
						"repairDetails.createDate,"
					};
				},
				model:{
					head:{
						title:"报修记录"
					},
					columns:params.type == "daytime" ? columns : [columns[0],columns[1],columns[2]],
				}
			});
		},
		initPrint:function(widget,params){
			return new Grid({
				autoRender:false,
				isInitPageBar:false,
				parentNode:".J-repair-print",
				model:{
					head:{
						title:"报修记录"
					},
					columns:params.type == "daytime" ? columns : [columns[0],columns[1],columns[2]],
				}
			});
			
			
		}
	};
	
	module.exports=SC_repair;
});