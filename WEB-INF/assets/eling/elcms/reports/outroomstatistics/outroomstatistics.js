define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Interest = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"退房统计",
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
				url : "api/report/outroomstatistics",
				model:{
					columns:[{
						key:"buildingName",
						name:"楼号"
					},{
						key:"houses",
						name:"会员户数"
					},{
						key:"man",
						name:"男会员"
					},{
						key:"women",
						name:"女会员"
					},{
						key:"total",
						name:"会员总数"
					}]
				}
			};
		}
	});
	module.exports = Interest;
});