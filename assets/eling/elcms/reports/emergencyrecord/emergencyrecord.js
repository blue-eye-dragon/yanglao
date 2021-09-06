 define(function(require,exports,module){
	 var ELView = require("elview");
	 var Subnav = require("subnav");
	 var Grid = require("grid");
	 require("../../grid_css.css");
	 var template="<div class='el-emergencyrecord'>"+
		"<div class='J-subnav'></div>"+
	 	"<div class='J-grid'></div> " +
	 	"</div>";
	 var emergencyrecord=ELView.extend({
		 attrs:{
			 template:template
		 },
		 initComponent : function(params,widget) {
			 var subnav=new Subnav({
				 parentNode:".J-subnav",
				 model:{
					 title:"突发事件记录",
					 items:[{
 						 id:"alarmType", 
 						 tip :"报警类型",
 						 type:"buttongroup",
 						 items:[{
 							 key:"HealthTurn",
							 value:"健康求助"
 						 },{
 							 key:"FalseAlarm",
 							 value:"误报" 	
 						 },{
 							 key:"LifeTurn",
 							 value:"生活求助"
 						 },{
 							 key:"OtherType",
 							 value:"其他类型" 
 						 },{
 							 key:"",
							 value:"全部" 
 						 }],
 						 handler:function(key,element){
 							 widget.get("grid").refresh(); 
 						 }
					 },{
						 id:"hospitalize", 
 						 tip :"紧急就医",
 						 type:"buttongroup",
 						 items:[{
 							 key:"true",
							 value:"是"
 						 },{
 							 key:"false",
 							 value:"否" 	
 						 },{
 							 key:"",
 							 value:"全部"
 						 }],
 						 handler:function(key,element){
 							 widget.get("grid").refresh(); 
 						 }
					 },{
						 id : "sosTime",
						 type : "daterange",
						 ranges : {
							 "本年": [moment().startOf("year"), moment().endOf("year")],
	   					 	 "去年": [moment().subtract(1,"year").startOf("year"),moment().subtract(1,"year").endOf("year")],
						 },
						 defaultRange : "本年",
						 minDate: "1990-01-01",
						 maxDate: "2050-12-31",
						 handler : function(time){
							 widget.get("grid").refresh();
						 },
						 tip : "求助时间"
					 },{
							id:"toexcel",
	 						text:"导出",
	 						type:"button",
	 						handler:function(){
	 							var subnav=widget.get("subnav");
	 							window.open("api/sos/toexcel?alarmType="+subnav.getValue("alarmType")+
	 									"&hospitalize="+subnav.getValue("hospitalize")+
	 									"&sosTime="+subnav.getValue("sosTime").start+
	 									"&sosTimeEnd="+subnav.getValue("sosTime").end
	 							);
	 							return false;
	 						}
					 }]
				 }  
			 });
			 this.set("subnav",subnav);
			 var grid = new Grid({
				 parentNode:".J-grid",
				 model : {
					 url:"api/sos/query",
					 params:function(){
						 var subnav=widget.get("subnav");
						 return {
							 alarmType:subnav.getValue("alarmType"),
							 hospitalize:subnav.getValue("hospitalize"),
		    				 sosTime:subnav.getValue("sosTime").start,
		    				 sosTimeEnd:subnav.getValue("sosTime").end,
							 fetchProperties:"pkSos,sosNo,sosTime,content," +
							 "member.pkMember," +
             				 "member.memberSigning.room.number,"+
             				 "member.personalInfo.pkPersonalInfo,"+
             				 "member.personalInfo.name," +
             				 "member.personalInfo.sex," +
             				 "member.personalInfo.birthday," +
             				 "hospital.pkHospital," +
             				 "hospital.name," +
             				 "diseaseHistory.pkDiseaseHistory," +
             				 "diseaseHistory.diseaseDetail.pkDiseaseDetail," +
             				 "diseaseHistory.diseaseDetail.name," +
             				 "content" 
						 };
					 },
					 columns : [{
						 name:"sosTime",
	  					 label:"求助时间",
	  					 format : "date",
	  					 className:"oneColumn",
						 formatparams:{
							 mode:"YYYY-MM-DD HH:mm"
						 }
					 },{
						name:"member",
  						label:"会员",
  						className:"oneColumn",
  						format:function(row,value){
	  							if(value.member != null){
	  								return value.member.memberSigning.room.number+" "+value.member.personalInfo.name;
	  							}else{
	  								return "";
	  							}
							},
					 },{
						 name:"member.personalInfo.sex.value",
						 label:"性别",
						 className:"oneColumn",
					 },{
						 name:"member.personalInfo.birthday",
						 label:"年龄",
						 className:"oneColumn",
						 format:"age"
							 
					 },{
						 name:"diseaseHistory.diseaseDetail.name",
						 label:"症状",
						 className:"twoColumn",
					 },{
						 name:"hospital.name",
						 label:"就医医院",
						 className:"twoColumn",
					 },{
						 name:"content",
						 label:"描述",
						 className:"twoColumn",
					 }]
				 }
			 });
			 this.set("grid",grid);
			 
		 },
		 afterInitComponent:function(params,widget){
			 
		 }
	 });
	 module.exports=emergencyrecord;
 })


