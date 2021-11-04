/**
 * 专属陪同就医统计
 */
define(function(require,exports,module){
	//多语
	var i18ns = require("i18n");
	var ELView = require("elview");
	var aw=require("ajaxwrapper");
	var Subnav = require("subnav"); 
	var Grid = require("grid");
	var store = require("store");
	var activeUser = store.get("user");
	
	var Emergentgrid = require("./emergentgrid");
	var proprietaryaccompanystatiscs=ELView.extend({
		attrs : {
			template : "<div class='J-subnav'></div>"
				+ "<div class='J-grid'></div>"
		},
		_refreshGrid : function (widget){
			var subnav=widget.get("subnav");
			var time=subnav.getValue("time");
			widget.get("grid").refresh({
				accompanyDateStart:time.start,
				accompanyDateStartEnd:time.end,
				transportation:subnav.getValue("transportation"),
				diseaseType:subnav.getValue("diseaseType"),
				service:subnav.getValue("service"),
				"member.memberSigning.room.building":subnav.getValue("building"),
				fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name,member.pkMember,hospital.name,member.memberSigning.room.building.*",
			},function(){
				widget.getTotalMny();
			});
		},
		getTotalMny:function(){
			var grid=this.get("grid");
			var totalMny=0;
			var date=0;
			var days=0;
			var hours=0;
			var minutes=0;
			var totalTime="";
			var data=grid.getData();
			for(var i=0;i<data.length;i++){
				totalMny+=data[i].expenses;
				date+=data[i].accompanyDateEnd-data[i].accompanyDateStart;
				}
			days=Math.floor(date/(24*3600*1000));
			hours=Math.floor(date%(24*3600*1000)/(3600*1000));
			minutes=date%(24*3600*1000)%(3600*1000)/(60*1000);
			if (days!=0){
				totalTime += days+"天 ";
			}
			if (hours!=0){
				totalTime += hours+"小时 ";
			}
			if (minutes!=0){
				totalTime += minutes+"分钟";
			}
			if(date==0){
				totalTime="0分钟";
			}
	        return grid.setTitle("总陪同时间："+totalTime+ " 总费用："+totalMny+"元");
		},
		initComponent:function(params,widget){
			var subnav = new Subnav({
				parentNode : ".J-subnav",
				model:{
					title:"专属陪同就医统计",
					items : [{
						id : "building",
						tip : "楼宇",
						type : "buttongroup",
						keyField : "pkBuilding",
						valueField : "name",
						items : activeUser.buildings,
						all : {
							show : true
						},
						handler : function(key,value){
							widget._refreshGrid(widget);
						}
					},{
						id : "service",
						type : "buttongroup",
						tip : "服务类型",
						items : [{
							key : "",
							value : "全部"
						},{
							key : "Paid",
							value : "有偿"
						},{
							key : "Free",
							value : "无偿"
						}],
						handler : function(key,text){
							widget._refreshGrid(widget);
						}
					},{
						id : "diseaseType",
						type : "buttongroup",
						tip : "就诊类型",
						items : [{
							key : "",
							value : "全部"
						},{
							key : "Emergent",
							value : "急诊"
						},{
							key : "General",
							value : "普通门诊"
						}],
						handler : function(key,text){
							widget._refreshGrid(widget);
						}
					},{
						id : "transportation",
						type : "buttongroup",
						tip : "交通",
						items : [{
							key : "",
							value : "全部"
						},{
							key : "EmergencyCar",
							value : "120"
						},{
							key : "Other",
							value : "其他"
						}],
						handler : function(key,text){
							widget._refreshGrid(widget);
						}
					},{
						id : "time",
						type : "daterange",
						ranges : {
							"今天": [moment().startOf("days"),moment().endOf("days")],
					        "本月": [moment().startOf("month"), moment().endOf("month")]
						},
						defaultRange : "今天",
						minDate: "1930-05-31",
						maxDate: "2020-12-31",
						handler : function(time){
							widget._refreshGrid(widget);
						},
						tip : "陪同开始时间范围"
					},{
                        id : "toexcel",
						type : "button",
                        text : "导出",
                        handler : function(){                           
                        	var subnav=widget.get("subnav");
                        	var time=subnav.getValue("time");
                        	window.open("api/proprietaryaccompanyhospitalize/toexcel?" +
                        			"accompanyDateStart=" + time.start +
                        			"&accompanyDateStartEnd=" + time.end +
                        			"&transportation=" + subnav.getValue("transportation") +
                        			"&diseaseType=" + subnav.getValue("diseaseType") +
                        			"&service=" + subnav.getValue("service") +
                        			"&member.memberSigning.room.building=" + subnav.getValue("building"));
                        	return false;                           
                        }
                    }]	
		},	
			
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				model:{
					id:"grid",
					url : "api/proprietaryaccompanyhospitalize/query",
					className : "text-center",
					isInitPageBar:false,
					autoRender:false,
					params : function(){
						var subnav=widget.get("subnav");
						var time=subnav.getValue("time");
						return {
							accompanyDateStart:time.start,
							accompanyDateStartEnd:time.end,
							transportation:subnav.getValue("transportation"),
							diseaseType:subnav.getValue("diseaseType"),
							service:subnav.getValue("service"),
							"member.memberSigning.room.building":subnav.getValue("building"),
							fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name,member.pkMember,hospital.name,member.memberSigning.room.building.*",
						}
					},
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),							
					},{
						key:"hospital.name",
						name:"医院"
					},{
						key:"service.value",
						name:"服务"						
					},{
						key:"diseaseType.value",
						name:"就诊类型"					
					},{
						key:"transportation.value",
						name:"交通"					
					},{
						key:"createDate",
						name:"就诊日期",	
						format:"date"						
					},{
						key:"accompanyDateStart",
						name:"陪同开始时间",	
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"accompanyDateEnd",
						name:"陪同结束时间",	
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"accompanyTime",
						name:"陪同时间"
					},{
						key:"expenses",
						name:"费用"
					}]
				},
			});
			this.set("grid",grid);
			
			
			
		},
		
		afterInitComponent:function(params,widget){
			widget._refreshGrid(widget);
			widget.getTotalMny();
		},
	});
	
	module.exports=proprietaryaccompanystatiscs;
});