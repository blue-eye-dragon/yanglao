define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var VisitWay = BaseView.extend({	
		initSubnav:function(widget){
			return {
				model:{
					title:"访问方式",					
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/visitway/query",	
				model:{
					columns:[{
						key:"code",
						name:"编码"					
					},{
						key:"name",
						name:"来访方式名称 "		
					},{
						key:"description",
						name:"备注 "					
					},{
 						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/visitway/" + data.pkVisitWay + "/delete");
							}
						}]
 					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					widget.save("api/visitway/save",$("#visitway").serialize());
				},
				model:{
					id:"visitway",
					items:[{
						name:"pkVisitWay",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"code",
						label:"编码",
						validate:["required"]
					},{
						name:"name",
						label:"来访方式名称",
						validate:["required"]
					},{
						name:"description",
						label:"备注"
					}]
				}
			};
		}
	});
	module.exports = VisitWay;
});