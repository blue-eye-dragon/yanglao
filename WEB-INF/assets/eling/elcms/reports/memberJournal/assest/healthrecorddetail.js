/**
 * 会员日志统计表：健康记录跳转页面
 * @author zp
 */
define(function(require, exports, module) {
	var Dialog=require("dialog");
	var aw = require("ajaxwrapper");
    var ELView=require("elview");
	var Subnav = require("subnav"); 
	var Grid = require("grid");
	var Tab = require("tab");
	require("../../../grid_css.css");
	var template="<div class='el-healthrecorddetail'>"+
	 "<div class='J-subnav' ></div>"+
	 "<div class='J-tab'></div></div>";
	
	var healthrecorddetail = ELView.extend({
		events : {},
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title : "健康记录详情",
				}
			})
			this.set("subnav",subnav);
			
			var tab = new Tab({
				parentNode : ".J-tab",
				autoRender : true,
				model : {
					items:[{
						id : "healthrecord",
						title : "健康日志详情"
					},{
						id : "healthexamdata",
						title : "健康数据详情"
					}]
				}
			});
			
			var grid=new Grid({
				parentNode:"#healthrecord",
				url : "api/report/memberjournalhealthrecord",
				autoRender : false,
				params : function(){
					return{
						fetchProperties:"",
					}
				},
				model:{
					columns:[{
						name:"number",
						label:"会员",
						className:"oneColumn",
						format:function(value,row){
							return row.number+"  "+row.name;
						}
					},{
						name:"date",
						label:"业务时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						className:"oneColumn",
					},{
						name:"type",
						label:"类型",
						className:"oneColumn",
					},{
						name:"description",
						label:"描述",
						className:"threeColumn",
					},{
						name:"recorder",
						label:"记录人",
						className:"oneColumn",
					},{
						name:"recordDate",
						label:"记录时间",
						format:"date",
						className:"oneColumn",
					}]
				}
			})
			this.set("grid",grid);
			
			var healthGrid = new Grid({
				parentNode : "#healthexamdata",
				url : "api/healthexamdata/query",
				params:function(){
					return {
						fetchProperties:"pkHealthExamData,version,type.pkHealthExamDataType,type.name,type.name1,type.name2,type.name3,type.name4,type.name5,type.name6,value1,value2,value3,value4,value5,value6,recordDate,createDate,creator.pkUser,creator.name,source,description" +
						",hospital.pkHospital,hospital.name,member.personalInfo.name,member.memberSigning.room.number"
					};
				},
				autoRender : false,
				model:{
					columns : [{
						key : "member.personalInfo.name",
						name : "会员",
						format:function(value,row){
							return row.member.memberSigning.room.number+"  "+row.member.personalInfo.name;
						},
						className:"oneColumn",
					},{
						key : "type.name",
						name : "名称",
						className:"oneColumn",
					},{
						key : "createDate",
						name : "采集时间",
						format : "date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						className:"oneColumn",
					},{
						key : "hospital.name",
						name : "医院",
						className:"oneColumn",
					},{
						key : "description",
						name : "测试值",
						className:"threeColumn",
					},{
						key : "creator.name",
						name : "记录人",
						className:"oneColumn",
					},{
						key : "recordDate",
						name : "记录时间",
						format : "date",
						className:"oneColumn",
					}]
				}
			});
			this.set("healthGrid", healthGrid);
			
			
		},
        afterInitComponent:function(params,widget){
        	if(params){
        		if(params.month && params.month != "13"){
        			dat=params.year+"-"+params.month;
					start=moment(dat).startOf('month').valueOf();
					end=moment(dat).endOf('month').valueOf();
        		}else{
        			dat=params.year;
        			start=moment(dat).startOf('year').valueOf();
        			end=moment(dat).endOf('year').valueOf();
        		}
        		widget.get("grid").refresh({
        			start: start,
			    	end:   end,
					pkBuilding:params.pkBuilding,
        		});
        		widget.get("healthGrid").refresh({
        			"orderString" : "member.memberSigning.room.number,createDate:desc",
        			"createDate": start,
        			"createDateEnd":   end,
        			"member.memberSigning.room.building.pkBuilding":params.pkBuilding,
        			fetchProperties:"pkHealthExamData,version,type.pkHealthExamDataType,type.name,type.name1,type.name2,type.name3,type.name4,type.name5,type.name6,value1,value2,value3,value4,value5,value6,recordDate,createDate,creator.pkUser,creator.name,source,description" +
					",hospital.pkHospital,hospital.name,member.personalInfo.name,member.memberSigning.room.number"
        		});
        	}
        }
	});
	module.exports = healthrecorddetail;
});
