 define(function(require,exports,module){
	 var ELView = require("elview");
	 var Subnav = require("subnav");
	 var Grid = require("grid");
	 require("../../grid_css.css");
	 var template="<div class='el-foreignvisaextension'>"+
		"<div class='J-subnav'></div>"+
	 	"<div class='J-grid'></div> " +
	 	"</div>";
	 var foreignvisaextension=ELView.extend({
		 attrs:{
			 template:template
		 },
		 initComponent : function(params,widget) {
			 var subnav=new Subnav({
				 parentNode:".J-subnav",
				 model:{
					 title:"外籍会员签证延期名单",
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
 						 id:"memberstatus", 
 						 tip :"会员状态",
 						 type:"buttongroup",
 						 items:[{
 							 key:"",
							 value:"全部"
 						 },{
 							 key:"Normal",
 							 value:"在住" 	
 						 },{
 							 key:"Out",
 							 value:"外出"
 						 },{
 							 key:"Nursing",
 							 value:"颐养" 
 						 },{
 							 key:"Died",
 							 value:"过世" 	
 						 },{
 							 key:"Checkout",
 							 value:"退住"
 						 },{
 							 key:"Behospitalized",
 							 value:"住院" 
 						 },{
 							 key:"Waitting",
 							 value:"预入住" 
 						 },{
 							 key:"NotLive",
 							 value:"选房不住" 
 						 },{
 							 key:"NursingAndBehospitalized",
 							 value:"颐养且住院" 
 						 }],
 						 handler:function(key,element){
 							 widget.get("grid").refresh(); 
 						 }
					 },{
						 id:"status", 
 						 tip :"签证状态",
 						 type:"buttongroup",
 						 items:[{
 							 key:"",
							 value:"全部"
 						 },{
 							 key:"Normal",
 							 value:"正常" 	
 						 },{
 							 key:"Termination",
 							 value:"终止"
 						 }],
 						 handler:function(key,element){
 							 widget.get("grid").refresh(); 
 						 }
					 },{
						 id : "visatime",
						 type : "daterange",
						 ranges : {
							 "今天": [moment().startOf("days"),moment().endOf("days")],
							 "本月": [moment().startOf("month"), moment().endOf("month")]
						 },
						 defaultRange : "本月",
						 minDate: "1990-01-01",
						 maxDate: "2050-12-31",
						 handler : function(time){
							 widget.get("grid").refresh();
						 },
						 tip : "签证到期日期"
					 },{
							id:"toexcel",
	 						text:"导出",
	 						type:"button",
	 						handler:function(){
	 							var subnav=widget.get("subnav");
	 							window.open("api/foreignvisaeextension/toexcel?pkBuilding="+subnav.getValue("building")+
	 									"&memberstatus="+subnav.getValue("memberstatus")+
	 									"&status="+subnav.getValue("status")+
	 									"&visatime="+subnav.getValue("visatime").start+
	 									"&visatimeEnd="+subnav.getValue("visatime").end
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
					 url:"api/report/foreignvisaeextension",
					 params:function(){
						 var subnav=widget.get("subnav");
						 return {
							 pkBuilding:subnav.getValue("building"),
							 memberstatus:subnav.getValue("memberstatus"),
							 status:subnav.getValue("status"),
							 visatime:subnav.getValue("visatime").start,
							 visatimeEnd:subnav.getValue("visatime").end,
							 fetchProperties:"roomNumber,name,nameen," +
							 		"sex,nationality,idnumber,passnumber," +
							 		"birthday,duedate,year,month,day,describe,status",
						 };
					 },
					 columns : [{
						name:"member",
  						label:"会员",
  						format:function(row,value){
								return value.roomNumber+value.name;
							},
						className:"oneColumn",
					 },{
						 name:"nameen",
						 label:"英文姓名",
						 className:"oneColumn",
					 },{
						 name:"sex",
						 label:"性别",
						 className:"halfColumn",
					 },{
						 name:"nationality",
						 label:"国籍",
						 className:"halfColumn",
					 },{
						 name:"idnumber",
						 label:"护照、身份证号码",
						 className:"oneColumn",
					 },{
						 name:"passnumber",
						 label:"港澳台通行证号码",
						 className:"oneColumn",
					 },{
						 name:"birthday",
						 label:"生日",
						 className:"oneColumn",
					 },{
						 name:"duedate",
						 label:"签证到期日期",
						 className:"oneColumn",
					 },{
						 name:"status",
						 label:"签证状态",
						 className:"halfColumn",
					 },{
						 name:"memberstatus",
						 label:"会员状态",
						 className:"halfColumn",
					 },{
						 name:"describe",
						 label:"备注",
						 className:"twoColumn",
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
	 module.exports=foreignvisaextension;
 })


