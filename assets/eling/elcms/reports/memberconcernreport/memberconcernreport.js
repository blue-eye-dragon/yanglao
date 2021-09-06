/**
 *	重点关注会员报表
 * 
 */
define(function(require, exports, module) {
	//多语
	var i18ns = require("i18n");
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var Grid=require("grid-1.0.0");
	require("./memberconcernreport.css");
	var MemberConcernReport = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"
				+"<div class='J-list'></div>"
				+"<div class='J-detail hidden'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"重点关注"+i18ns.get("sale_ship_owner","会员")+"报表",
//					buttons:[{
// 						id:"toexcel",
// 						text:"导出",
// 						handler:function(){ 
//						var year = widget.get("subnav").getValue("year");
//						var month = widget.get("subnav").getValue("month");
//						window.open("api/report/energysourcereport/toexcel?year="+year+"&month="+month);
// 							return false;
// 	 					}				
// 					}]
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-list").hide(".J-detail");
							widget.get("subnav").hide(["return"]);
							return false;
						} 
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				parentNode:".J-list",
				autoRender : false,
				url:"api/report/memberconcernreport",
				model:{
					colHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.name;
							}
						}
					},
					rowHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.name;
							}
						}
					},
					datas : {
						id:"number",
						cols : [{
							className : "text-right",
							format : "defaultZero"
						}],
						click : function(data){
							//点击单元格事件，data就是你查回来的本单元格对应的数据
							console.dir(data);
							widget.show(".J-detail").hide(".J-list");
							widget.get("subnav").show(["return"]);
							widget.get("detail").refresh({concern:'true',
								"member.memberSigning.room.building" :(data.building.pkBuilding==-1 ? "":data.building.pkBuilding),
								"memberConcernReason.pkMemberConcernReason" :(data.reasonType.pkReason==-1 ? "":data.reasonType.pkReason),
								"member.statusIn":"Normal,Nursing,Out,Behospitalized,NursingAndBehospitalized"});
						}
					}
				}
			});
			this.set("grid",grid);	
			
			var detail=new Grid({
				parentNode:".J-detail",
				autoRender : false,
				url:"api/memberconcernset/query",
				fetchProperties:"pkMemberConcernSet," +
						"date,actionRate," +
						"description,member.pkMember," +
						"member.personalInfo.name," +
						"recordUser.name," +
						"member.memberSigning.room.number," +
						"concern," +
						"memberConcernReason.pkMemberConcernReason," +
						"memberConcernReason.name",
				model:{
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号",
						className:"number"
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
						className:"name"
					},{
						key:"date",
						name:"记录时间",
						format:"date",
						className:"date"
					},{
						key:"recordUser.name",
						name:"记录人",
						className:"user"
					},{
						key:"actionRate.value",
						name:"消息频率",
						className:"value"
					},{
						key:"memberConcernReason.name",
						name:"关注原因",
						className:"cause"
					},{
						key:"description",
						name:"备注",
						className:"description"
					}]
				}
			});
			this.set("detail",detail);	
		},
		afterInitComponent:function(params,widget){
			widget.get("grid").refresh();
		},

	});
	module.exports = MemberConcernReport;
});