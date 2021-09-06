define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Interest = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"订牛奶统计表",
					time:{
						click:function(time){
						    widget.get("list").refresh({
						    	start:time.start,
								end:time.end
							});
						}
					},
					buttons:[]
				}
			};
		},
		initList:function(){
			return {
				url : "api/report/ordermilk",
				model:{
					columns:[{
						key:"name",
						name:"楼号"
					},{
						key:"houses",
						name:"户数"
					}]
				}
			};
		}
	});
	module.exports = Interest;
});