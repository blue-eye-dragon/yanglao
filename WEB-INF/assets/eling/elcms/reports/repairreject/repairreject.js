define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var Grid=require("grid-1.0.0");
	var ReportGrid=require("reportgrid");
	var repairreject = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+
					 "<div class='J-Grid'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"维修驳回统计",
					buttons:[{
						id:"refersh",
						text:"刷新",
						handler:function(){
							 widget.get("grid").refresh();
						}
					}],
					time:{
						tip : "报修日期",
					 	ranges:{
					 		"今年": [moment().startOf("year"), moment()] ,
							},
						defaultTime:"今年",
						click:function(time){ 
							widget.get("grid").refresh(); 
						}
					},
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				parentNode:".J-Grid",
				url:"api/report/repairreject",
				params:function(){
					var time = widget.get("subnav").getValue("time");
					return {
						"start":time.start,
						"end":time.end,
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
							var time = widget.get("subnav").getValue("time");
							var starts;
							var ends;
							var build = data.building;
							var repairclassify = data.repairName;
							var pkBuilding ;
							var pkRepairClassify ;
							if(build == "一号楼"){
								pkBuilding = 0;
							}else if(build == "二号楼"){
								pkBuilding = 1;
							}else if(build == "三号楼"){
								pkBuilding = 2;
							}else if(build == "四号楼"){
								pkBuilding = 3;
							}else if(build == "五号楼"){
								pkBuilding = 4;
							}else if(build == "六号楼"){
								pkBuilding = 5;
							}else if(build == "七号楼"){
								pkBuilding = 6;
							}else if(build == "八号楼"){
								pkBuilding = 7;
							}else if(build == "九号楼"){
								pkBuilding = 8;
							}else if(build == "十二号楼"){
								pkBuilding = 9;
							}else if(build == "十三号楼"){
								pkBuilding = 10;
							}else if(build == "十五号楼"){
								pkBuilding = 11;
							}else if(build == "十号楼"){
								pkBuilding = 15;
							}else if(build == "办公楼"){
								pkBuilding = 16;
							}else if(build == "员工宿舍"){
								pkBuilding = 17;
							}else if(build == "亲和源宿舍"){
								pkBuilding = 18;
							}else if(build == "合计"){
								
							}
							
							if(repairclassify == "给排水"){
								pkRepairClassify = 1;
							}else if(repairclassify == "装修土建"){
								pkRepairClassify = 2;
							}else if(repairclassify == "家用电器"){
								pkRepairClassify = 3;
							}else if(repairclassify == "照明供电"){
								pkRepairClassify = 4;
							}else if(repairclassify == "弱电"){
								pkRepairClassify = 5;
							}else if(repairclassify == "家具"){
								pkRepairClassify = 6;
							}else if(repairclassify == "设施改动"){
								pkRepairClassify = 8;
							}else if(repairclassify == "其他"){
								pkRepairClassify = 7;
							}else if(repairclassify == "合计"){
							}
							widget.openView({
								url:"eling/elcms/property/repairrejecttime/repairrejecttime",
								params:{
									"createDate":time.start,
									"createDateEnd":time.end,
									"operateType":"Reject",
									"repairClassify":pkRepairClassify, 
									"buildingName":pkBuilding,
									father:"repairreject"
								},
								isAllowBack:true
								});
						}
					}
				},
			});
			this.set("grid",grid);
		}
	});
	module.exports = repairreject;
});