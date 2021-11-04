define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var Grid=require("grid");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var MultiRowGrid=require("multirowgrid");
	var template="<div class='el-ownerservicestatistics'>"+
	"<div class='J-subnav'></div>"+
 	"<div class='J-grid'></div> " +
 	"</div>";
	var ownerservicestatistics = ELView.extend({
		attrs:{
            template:template
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"服务统计表",
					items:[{
						id : "search",
						type : "search",
						placeholder : "房间号/"+i18ns.get("sale_ship_owner","会员")+"名",
						handler : function(s){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/report/ownerservicestatistics",
								data:{
									s:s,
									chargeStatus:subnav.getValue("chargeStatus"),
									pkBuilding:subnav.getValue("building"),
									 sc:widget.get("subnav").getValue("search"),
									 start:subnav.getValue("createDateRange").start,
									 end:subnav.getValue("createDateRange").end,
									fetchProperties:"number,name," +
							 		"ownerServiceStatisticsView.generalServiceItem," +
							 		"ownerServiceStatisticsView.count," +
							 		"ownerServiceStatisticsView.price," +
							 		"ownerServiceStatisticsView.total",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
					},{
							id:"building",
	   						tip:"楼号",
	   						type:"buttongroup",
	   						keyField : "pkBuilding",
							valueField : "name",
							url : "api/building/query",
							params : function(){
								return {
									"useType":"Apartment",
									fecthProperties:"pkBuilding,name"
								};
							},
							showAll:true,
							handler:function(key,element){
								widget.get("grid").refresh();
							}
				    },{
					       id:"chargeStatus",
	     				   tip:"收费状态",
	     				   type:"buttongroup",
	     				   items:[{
	     					    key:"Charge",
	     					    value:"已收费" 
	     				   },{
	     					    key:"UnCharge",
		     				    value:"未收费"
	     				   }],
	     				   showAll:true,
	     				   handler:function(key,element){
								   widget.get("grid").refresh();
	     				   }
				    },{
							id : "createDateRange",
							type : "daterange",
							ranges : {
								"本月": [moment().startOf("month"), moment().endOf("month")],
								"上月": [moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")],
							},
							defaultRange : "本月",
							minDate: "1930-05-31",
							maxDate: "2020-12-31",
							handler : function(time){
								widget.get("grid").refresh();
							},
							tip : "时间范围"
					},{
						    id:"toexcel",
	 						text:"导出",
	 						type:"button",
	 						handler:function(){
	 							var subnav=widget.get("subnav");
	 							window.open("api/ownerservicestatistics/toexcel?pkBuilding="+subnav.getValue("building")+
	 									"&start="+subnav.getValue("createDateRange").start+
	 									"&end="+subnav.getValue("createDateRange").end+
	 									"&chargeStatus="+subnav.getValue("chargeStatus")+
	 									"&sc="+subnav.getValue("search")
	 									);
	 							return false;
	 						}
					   }]
				}
			});
			this.set("subnav",subnav);
			var grid=new MultiRowGrid({
				parentNode:".J-grid",
				autoRender:false,
				url:"api/report/ownerservicestatistics",
				params:function(){
					 var subnav=widget.get("subnav");
					 return {
						 chargeStatus:subnav.getValue("chargeStatus"),
						 pkBuilding:subnav.getValue("building"),
						 sc:widget.get("subnav").getValue("search"),
						 start:subnav.getValue("createDateRange").start,
						 end:subnav.getValue("createDateRange").end,
						 fetchProperties:"number,name," +
						 		"ownerServiceStatisticsView.generalServiceItem," +
						 		"ownerServiceStatisticsView.count," +
						 		"ownerServiceStatisticsView.price," +
						 		"ownerServiceStatisticsView.total",
					 };
				 },
				model : {
					multiField:"ownerServiceStatisticsView",
					columns:[{
						key : "member",
						name : i18ns.get("sale_ship_owner","会员"),
                    	format:function(row,value){
							return value.number+" "+value.name;
						},
					},{
						key:"ownerServiceStatisticsView",
						name:"服务项目",
						multiKey:"generalServiceItem",
						isMulti:true,
					},{
						key : "ownerServiceStatisticsView",
						name : "服务次数",
						multiKey:"count",
                        isMulti:true,
					},{
						key : "ownerServiceStatisticsView",
						name : "单价",
						multiKey:"price",
                        isMulti:true,
					},{
						key : "ownerServiceStatisticsView",
						name : "合计",
						multiKey:"total",
                        isMulti:true,
					}]
				}
			});
			this.set("grid",grid);
		},
		afterInitComponent:function(params,widget){
			 widget.get("subnav").load("building",{
        		callback:function(){
        			widget.get("grid").refresh();
        		}
        	});
		 }
	});
	module.exports = ownerservicestatistics;
});