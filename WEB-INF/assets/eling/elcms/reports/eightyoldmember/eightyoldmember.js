 define(function(require,exports,module){
	 var ELView = require("elview");
	 var Subnav = require("subnav");
	 var Grid = require("grid");
	 var template="<div class='el-eightyoldmember'>"+
		"<div class='J-subnav'></div>"+
	 	"<div class='J-grid'></div> " +
	 	"</div>";
	 var eightyoldmember=ELView.extend({
		 attrs:{
			 template:template
		 },
		 initComponent : function(params,widget) {
			 var subnav=new Subnav({
				 parentNode:".J-subnav",
				 model:{
					 title:"80岁及80岁以上会员名单",
					 items:[{
							id:"building",
							type:"buttongroup",
							tip:"楼号",
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
						 	id:"agesegment",
						 	type:"buttongroup",
						 	tip:"年龄段",
						 	items : [{
						 		key:"all",
						 		value:"全部"
						 	},{
								key : "EightFour",
								value : "80-84岁"
							},{
								key : "EightNine",
								value : "85-89岁"
							},{
								key : "Ninety",
								value : "90岁以上"
							}],
							handler : function(key,element) {
								widget.get("grid").refresh();
							}
					 },{
						    id:"sex",
						 	type:"buttongroup",
						 	tip:"性别",
						 	items:[{
						 		key :"-1",
						 		value : "全部"
						 	},{
								key : "0",
								value : "男"
							},{
								key : "1",
								value : "女"
							}],
							handler : function(key,element){
								widget.get("grid").refresh();
							}
					 },{
							id:"toexcel",
	 						text:"导出",
	 						type:"button",
	 						handler:function(){
	 							var subnav=widget.get("subnav");
	 							window.open("api/eightyoldmember/toexcel?pkBuilding="+subnav.getValue("building")+
	 									"&agesegment="+subnav.getValue("agesegment")+
	 									"&sex="+subnav.getValue("sex")
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
					 url:"api/report/eightyoldmember",
					 params:function(){
						 var subnav=widget.get("subnav");
						 return {
							 pkBuilding:subnav.getValue("building"),
							 agesegment:subnav.getValue("agesegment"),
							 sex:subnav.getValue("sex"),
							 fetchProperties:"roomNumber,name,sex,age,year,month,day"
						 };
					 },
					 columns : [{
						 name:"roomNumber",
						 label:"房间号",
					 },{
						 name:"name",
						 label:"会员姓名",
					 },{
						 name:"sex",
						 label:"性别",
					 },{
						 name:"age",
						 label:"年龄",
					 },{
						 name:"year",
						 label:"年",
					 },{
						 name:"month",
						 label:"月",
					 },{
						 name:"day",
						 label:"日",
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
	 module.exports=eightyoldmember;
 })


