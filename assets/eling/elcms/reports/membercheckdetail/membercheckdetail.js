
define(function(require,exports,module){
	var ELView = require("elview");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var template="<div class='el-membercheckdetail'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-grid'></div> " +
	"</div>";
	var membercheckdetail=ELView.extend({
		attrs:{
			template:template
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会员入住退房换房过世明细",
					items:[{
						id:"building",
						type:"buttongroup",
						tip:"楼宇",
						keyField : "pkBuilding",
						valueField : "name",
						showAll : true,
						showAllFirst : true,
						url : "api/building/query",
						params : function(){
							return {
								"useType":"Apartment",
								fecthProperties:"pkBuilding,name"
							};
						}, 
						handler : function(key,element) {
							widget.get("grid").refresh();
						}
					},{
						id:"status",
						type:"buttongroup",
						tip:"状态",
						items : [{
							key:"",
							value:"全部"
						},{
							key : "CheckIn",
							value : "入住"
						},{
							key : "ChangeRoom",
							value : "换房"
						},{
							key : "CheckOut",
							value : "退房"
						},{
							key : "Died",
							value : "过世"
						}],
						handler : function(key,element) {
							widget.get("grid").refresh();
						}
					},{
						id : "date",
						tip : "日期",
						type : "daterange",
						ranges : {
							"本年": [moment().startOf("year"), moment().endOf("year")],
   					 		"去年": [moment().subtract(1,"year").startOf("year"),moment().subtract(1,"year").endOf("year")],
   							"前年": [moment().subtract(2,"year").startOf("year"),moment().subtract(2,"year").endOf("year")],
						},
						defaultRange : "本年",
						minDate: "1990-01-31",
						maxDate: "2050-12-31",
						handler : function(time){
							widget.get("grid").refresh();
						}
					},{
						id:"toexcel",
						text:"导出",
						type:"button",
						handler:function(){
							var subnav=widget.get("subnav");
							window.open("api/membercheckdetail/toexcel?pkBuilding="+subnav.getValue("building")+
									"&status="+subnav.getValue("status")+
									"&start="+subnav.getValue("date").start+
									"&end="+subnav.getValue("date").end
							);
							return false;
						}
					}]
				}
			});
			this.set("subnav",subnav);
			var grid = new Grid({
				parentNode:".J-grid",
				autoRender:false,
				model : {
					url:"api/report/membercheckdetail",
					params:function(){
						var subnav=widget.get("subnav");
						return {
							pkBuilding:subnav.getValue("building"),
							status:subnav.getValue("status"),
							start:subnav.getValue("date").start,
							end:subnav.getValue("date").end,
							fetchProperties:"*"
						};
					},
					columns : [{
						name:"date",
						label:"日期",
					},{
						name:"roomNumber",
						label:"房号",
					},{
						name:"male",
						label:"男会员",
					},{
						name:"female",
						label:"女会员",
					},{
						name:"status",
						label:"状态",
					},{
						name:"flower",
						label:"是否已订花",
					},{
						name:"flowerDate",
						label:"订花日期",
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
	module.exports=membercheckdetail;
})

