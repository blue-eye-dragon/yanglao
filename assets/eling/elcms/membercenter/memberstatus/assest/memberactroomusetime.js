define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Form=require("form");
	var emnu = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	require("../../../grid_css.css");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class = 'actRUse_echart'></div>";
	
	var UseTimeView = require("./memberusetime_echart");
	
	var years=[];
	for(var i=-5;i<=0;i++){
		years.push({
			key:moment().add(i,'year').year(),
			value:moment().add(i,'year').year()
		});
	}
	for(var i=1;i<=5;i++){
		years.push({
			key:moment().add(i,'year').year(),
			value:moment().add(i,'year').year()
		});
	}
	var months=[{
		key:01,value:"一月"
	},{
		key:02,value:"二月"
	},{
		key:03,value:"三月"
	},{
		key:04,value:"四月"
	},{
		key:05,value:"五月"
	},{
		key:06,value:"六月"
	},{
		key:07,value:"七月"
	},{
		key:08,value:"八月"
	},{
		key:09,value:"九月"
	},{
		key:10,value:"十月"
	},{
		key:11,value:"十一月"
	},{
		key:12,value:"十二月"
	}];

	var Service = ELView.extend({
		attrs:{
            template:template
		},
		events:{
			 "click .J-detail" : function(e){
				var grid = this.get("grid");
				var index = grid.getIndex(e.target);
				var data = grid.getData(index);
				this.openView({
					url:"eling/elcms/happiness/activityreport/activityreport",
					params:{
						pkActivityReport:data.actReports.pkActivityReport,
						activityreportType:data.actReports.activityreportType,
					},
					isAllowBack:true
				});
			}
		},
		refrshScreen : function(widget){
			var inparams = widget.get("params") || {};
			var subnav = widget.get("subnav");
			var month = subnav.getValue("timem");
			var year = subnav.getValue("timey");
			var start = moment(year+"-"+month).startOf('month');
			var end = moment(year+"-"+month).endOf('month');
			widget.get("grid").refresh({
				"member.pkMember":inparams?inparams.pkMember:"",
				"activity.activityStartTime":start.valueOf(),
				"activity.activityStartTimeEnd":end.valueOf(),
				"activity.activityEndTime":start.valueOf(),
				"activity.activityEndTimeEnd":moment().valueOf(),
				"partStatus":"Part",
//				"activity.status":"End",
				fetchProperties:"actSignup.activity.theme," +
				"actSignup.activity.activityStartTime," +
				"actSignup.activity.activityEndTime,reports," +
				"actReports.pkActivityReport," +
				"actReports.type",
			});
			widget.get("usetime").refreshData(widget,inparams?inparams.pkMember:"");
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会员活动统计",
					items :[{
						id:"timey",
						type:"buttongroup",
						tip:"年份",
						items : years,
						handler:function(key,element){
							widget.refrshScreen(widget);
						}
					},{
						id:"timem",
						type:"buttongroup",
						tip:"月份",
						items : months,
						handler:function(key,element){
							widget.refrshScreen(widget);
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var usetime = new UseTimeView({
				parentNode : ".actRUse_echart",
			});
			usetime.render();
			this.set("usetime",usetime);
			
			var grid = new Grid({
				parentNode:".J-grid",
				autoRender : false,
				isInitPageBar : false,
				model : {
					url : "api/activitysignup/querysignupreport",
					columns : [{
						name : "actSignup.activity.theme",
						label : "活动",
						className:"threeColumn",
					},{
						name : "actSignup.activity.activityStartTime",
						label : "开始时间",
						format : "date",
						className:"threeColumn",
					},{
						name : "actSignup.activity.activityEndTime",
						label : "结束时间",
						format : "date",
						className:"threeColumn",	
					},{
						name : "reports",
						label : "会员活动报告",
						className:"threeColumn",
						format : function(value,row){
							if(value){
								return "<a href='javascript:void(0);' style='color:red;' class='J-detail'>"+value.substring(3,value.length-4)+"</a>";
							}else{
								return "";
							}
						}
					}]
				}
			});
			this.set("grid",grid);

		},
		afterInitComponent:function(params,widget){
			widget.get("subnav").setValue("timey",moment().year());
			widget.get("subnav").setValue("timem",moment().month()+1);
			
			if(params && params.pkMember){
				if(params&&params.name&&params.name!=""){
					this.get("subnav").setTitle("会员活动统计："+params.name);
				}
			}
			widget.refrshScreen(widget);
			
        },
        setEpitaph:function(){
			var subnav=this.get("subnav");
			var inParams = this.get("params");
			if(inParams){
				return {
					pkBuilding:inParams.pkBuilding,
					pkMember:inParams.pkMember,
					flg:"memberhappy",
					flgs:inParams.flg,
				};
			}
		},
	});
	module.exports = Service;
});
