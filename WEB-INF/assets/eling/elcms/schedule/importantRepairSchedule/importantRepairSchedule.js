define(function(require, exports, module) {
	var BaseView=require("baseview");
    
    var importantRepairSchedule = BaseView.extend({
    	initSubnav:function(widget){
    		return{
    			model:{
    				title:"重大维修查询",
//    				time:{
//        				click:function(time){
//        					widget.get("list").refresh();
//						}
//					},
					buttons:[{
						id:"add",
						text:"新增",
						show:false
					}]
    			}
    		}
    	},
    	initList:function(widget){
    		return{
    			url:"api/repair/query",
				params:function(){
//					var time=widget.get("subnav").getValue("time");
					return{
//						createDate:time.start,
//						createDateEnd:time.end,
						ifSignificant:"true",
						"orderString":"createDate",
						flowStatusIn:"Unarrange,Unrepaired,Unconfirmed",
						fetchProperties:"*,place.name,repairClassify.name,creator.name,maintainer.name,maintainer.phone"
					}
				},
				model:{
					columns:[{
						key:"repairNo",
						name:"报修单号"
					},{
						key:"place.name",
						name:"位置"
					},{
						key:"repairClassify.name",
						name:"分类"
					},{
						key:"content",
						name:"内容"
					},{
						key:"flowStatus.value",
						name:"状态"
					},{
						key:"creator.name",
						name:"报修人"
					},{
						key:"createDate",
						name:"报修时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"expectedDate",
						name:"预计维修时间",
						format:"date"
					},{
						key:"maintainer.name",
						name:"维修人"
					},{
						key:"maintainer.phone",
						name:"维修人电话"
					}]
				}
    		};
    	}
    });
    module.exports = importantRepairSchedule;
});






