/**
 * 换房年报
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var ReportGrid=require("reportgrid");
	var changeroomannualsummary = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			
			var years=[];
			for(var i=0;i<=10;i++){
				var obj={};
				obj.key=(parseInt(moment().format("YYYY"))-5)+i;
				obj.value=(parseInt(moment().format("YYYY"))-5)+i;
				years.push(obj);
			}
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"换房年报",
					buttonGroup:[{
						id:"building",
						tip:"楼宇",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
						id:"cardType",
						tip:"卡类型",
						key:"pkMemberShipCardType",
						showAll:true,
						showAllFirst:true,
						value:"name",
						url:"api/cardtype/query",
						handler:function(key,element){
							widget.get("grid").refresh();
							}
					},{
						id:"roomType",
						tip:"房间类型",
						key:"pkRoomType",
						showAll:true,
						showAllFirst:true,
						value:"name",
						url:"api/roomType/apartment",
						handler:function(key,element){
							widget.get("grid").refresh();
							}
					},{
						   id:"year",
						   tip:"年份",
						   items:years,	
						   handler:function(key,element){
							   widget.get("grid").refresh();
						   }
					   }]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				autoRender : false,
				model:{
					datas : {
						id : "data",
						cols : [{},{},{
							format : "thousands",
							className : "text-right"
						},{
							format : "thousands",
							className : "text-right"
						}],
						click : function(data){
								if(data.data == "0"){
									return false;
								}
								var year = widget.get("subnav").getValue("year");
								var month = data.colName;
								var start;
								var end;
								var flowStatus;
								if(data.rowNameSon == "审批中"){
									flowStatus = "Approvaling";
								}else{
									flowStatus = "Approved";
								}
								month = month.substr(0,month.length-1);
								var monthFirstDay= year + "-" +month;
								var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
								var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
								if(!isNaN(month)){
									start = moment(monthFirstDay).valueOf();
									end = moment(monthLastDay).valueOf();
									}else{
										start = moment(year).startOf("year").valueOf()
										end = moment(year).endOf("year").valueOf();
									}
								widget.openView({
									url:"eling/elcms/checkout/changeroom/changeroomapproval/changeroomapproval",
									params:{
										start : start,
										end : end,
										cardType:widget.get("subnav").getValue("cardType"),
										roomType:widget.get("subnav").getValue("roomType"),
										flowStatus:flowStatus,
										father:"changeroomannualsummary"
									},
									isAllowBack:true
									});
						}
					}
				},
				parentNode:".J-list",
				url:"api/changeroomapply/changeroomannualsummary",
				params:function(){
					return {
						year:widget.get("subnav").getValue("year"),
						pkBuilding:widget.get("subnav").getValue("building"),
						pkCardType:widget.get("subnav").getValue("cardType"),
						pkRoomType:widget.get("subnav").getValue("roomType"),
					};
				},
			});
			this.set("grid",grid);
		},
		afterInitComponent:function(params,widget){
			widget.get("subnav").setValue("year",moment().year());
			widget.get("grid").refresh();
		},
	});
	module.exports = changeroomannualsummary;
});