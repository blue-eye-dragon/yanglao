/**
 * 会员日志统计表：生活记录跳转页面
 * @author zp
 */
define(function(require, exports, module) {
	var Dialog=require("dialog");
	var aw = require("ajaxwrapper");
    var ELView=require("elview");
	var Subnav = require("subnav"); 
	var Grid = require("grid");
	require("../../../grid_css.css");
	
	var template="<div class='el-liferecorddetail'>"+
	 "<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div></div>";
	
	var liferecorddetail = ELView.extend({
		events : {},
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title : "生活记录详情",
				}
			})
			 this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
				url : "api/clickdetail/liferecord",
				autoRender : false,
				params : function(){
					return{
						fetchProperties:"date,number," +
						"name,type,description,recorder,recordDate",
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
						className:"oneColumn",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
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
		},
        afterInitComponent:function(params,widget){
        	if(params){
        		if(params.month && params.month!="13"){
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
        	}
        }
	});
	module.exports = liferecorddetail;
});
