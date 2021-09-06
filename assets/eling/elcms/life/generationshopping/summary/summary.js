define(function(require, exports, module) {
	var ELView=require("elview");
	var template=require("./summary.tpl");
	require("./summary.css");
	
	//业务
	var Summary_subnav=require("./assets/summary_subnav");
	var Summary_grid=require("./assets/summary_grid");
	var Summary_form=require("./assets/summary_form");
	var Summary_print=require("./assets/summary_print");
	
	var GenerationShoppingApplicationSummary = ELView.extend({
		attrs:{
			template:template
		},
		events:{
			"change .J-form-generationshoppingapplicationsummary-select-purchaser":function(e){
				var form=this.get("form");
				var pks=form.getValue("purchaser");
				form.load("principal",{
					options:form.getData("purchaser",{pk:pks})
				});
			}
		},
		_setCurrentPrincipal:function(pkParams){
			//1.获取第一个下拉框的值
			var pks=pkParams || this.get("form").getValue(1);
			//2.循环拼接字符串，不管是否有值，都要有请选择
			var current=[];
			for(var i=0;i<pks.length;i++){
				current.push(this.get("form").getData(1,{
					pk:pks[i].pkUser || pks[i]
				}));
			}
			//3.渲染
			this.get("form").load(2,{
				options:current
			});
		},
		initComponent:function(params,widget){
			//初始化subnav
			this.set("subnav",Summary_subnav.init(params,widget));
			this.set("grid",Summary_grid.init(params,widget));
			this.set("form",Summary_form.init(params,widget));
			this.set("printGrid",Summary_print.init(params,widget));
		},
		afterInitComponent:function(params,widget){
			var subnav=widget.get("subnav");
			subnav.load({
				id:"billcode",
				params:{
					"orderString":"billcode:desc",
//					"shoppingDate":moment().valueOf(),
//					"shoppingDateEnd":moment().subtract(1,"months").valueOf(),
					flowStatusIn:"Summed,Bought",
					fetchProperties:"pkGenerationShoppingApplicationSummary,billcode,shoppingDate,apps.money"
				},
				callback:function(data){
					data=[{pkGenerationShoppingApplicationSummary:"",billcode:"新汇总"}].concat(data);
					subnav.setData("billcode",data);
					
					widget.get("grid").refresh(null,function(data){
						//要缓存第一次查询回来的数据，第一次是所有已提交的数据，以后每次切换billcode下拉框，都要先查询，再加上缓存的数据
						widget.set("commit_application",data);
					});
				}
			});
		}
	});
	module.exports = GenerationShoppingApplicationSummary;
});