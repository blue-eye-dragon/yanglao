/**
 * 服务评价汇总
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var template=require("./serviceevaluation.tpl");
	
	var ServiceEvaluation = ELView.extend({
		attrs : {
			template : template
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode : ".J-subnav",
				model:{
					title:"服务评价汇总",
					search:false,
					buttons:[],
	        buttonGroup:[{
					   id:"building",
					   showAllFirst:true,
					   showAll:true,
					   handler:function(key,element){
							   widget.get("grid").refresh();
						   }
				   }]
				}
			});
			this.set("subnav",subnav);
			//渲染内容grid
			var grid = new Grid({
				parentNode : ".J-grid",
				url : "api/serviceindicators",
				model:{
					columns:[{
						key:"appraisee",
						name:"被评人"
					},{
						key:"score",
						name:"分数"
					}]
				}
			});
			this.set("grid",grid);
		},
		afterInitComponent:function(params,widget){
			aw.ajax({
					url:"api/serviceevaluation/query",
					data:{
						s:str,
						properties:"name,phone,remark",
						fetchProperties:"*,",
					},
					dataType:"json",
					success:function(data){
						g.setData(data);
					}
			});
		}
	});
	module.exports = ServiceEvaluation;
});
