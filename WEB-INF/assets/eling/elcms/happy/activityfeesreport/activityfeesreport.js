/**
 * 活动费用统计
 * @author zp
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var template="<div class='el-activityfeesreport'>"+
			 "<div class='J-subnav'></div>"+
			 "<div class='J-grid'></div>" +
			 "</div>";
	require("../../grid_css.css");

    var activityfeesreport = ELView.extend({
        attrs:{
        	template:template
        },
        events:{},
        initComponent:function(params,widget){
        	var subnav=new Subnav({
			   parentNode:".J-subnav",
               model:{
            	    title:"活动费用统计",
            	    items : [{
						id:"time",
	                    type:"daterange",
	                    tip :"活动开始时间",
	                    ranges : {
					        "本月": [moment().startOf("month"), moment().endOf("month")]
						},
						defaultRange : "本月",
						handler:function(time){
							widget.get("grid").refresh();
						}
					}]
               	 }
			});
			this.set("subnav",subnav);
    			
            var grid=new Grid({
        		parentNode:".J-grid",
                model:{
                	url : "api/activityfees/query",
	            	params : function(){
	                    return {
	                    	"activity.activityStartTime":widget.get("subnav").getValue("time").start,
	                    	"activity.activityStartTimeEnd":widget.get("subnav").getValue("time").end,
	                    	fetchProperties:"pkActivityFees," +
	                    			        "totalPopulation,totalFees," +
	                    			        "avgFees,memberPopulation,memberTotalFees," +
	                    			        "nonmemberPopulation,nonmemberTotalFees,version," +
	                    			        "activity.pkActivity," +
	                    			        "activity.theme," +
	                    			        "activity.activityStartTime," +
	                    			        "activity.activityEndTime",
	                    };
	                },
                    columns:[{
                        name:"activity.theme",
                        label:"主题",
                        className:"oneHalfColumn"
                    },{
						name:"activity.activityStartTime",
						label:"开始时间",
						className:"oneColumn",
						format:"date"
					},{
						name:"activity.activityEndTime",
						label:"结束时间",
						className:"oneColumn",
						format:"date"
					},{
						name:"totalPopulation",
						label:"人数",
						className:"oneColumn",
					},{
						name:"totalFees",
						label:"总费用",
						className:"oneColumn",
						format:"thousands"
					},{
						name:"memberPopulation",
						label:"人数",
						className:"oneColumn",
					},{
						name:"memberTotalFees",
						label:"总费用",
						className:"oneColumn",
						format:"thousands"
					},{
						name:"nonmemberPopulation",
						label:"人数",
						className:"oneColumn",
					},{
						name:"nonmemberTotalFees",
						label:"总费用",
						className:"oneColumn",
						format:"thousands"
					}]
				}
            });
            this.set("grid",grid);
        },
        afterInitComponent:function(params,widget){
        	 var _len = $('.table thead tr th').length;        
             $(".table thead tr").before("<tr id="+_len+" align='center'>"
                               +"<th colspan='5' class='text-center'>活动</th>"
                               +"<th colspan='2' class='text-center'>会员</th>"
                               +"<th colspan='2' class='text-center'>非会员</th>"
                               +"</tr>");    
        }
    });
    module.exports = activityfeesreport;
});