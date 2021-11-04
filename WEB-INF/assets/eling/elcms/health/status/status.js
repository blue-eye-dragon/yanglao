define(function(require, exports, module) {
	require("./status.css");
	var MixitupView = require('mixitupview');
	
	var HealthStatus = MixitupView.extend({
		attrs : {
			template : require("./status.tpl"),
			url:"api/healthdata/query",
			fetchProperties:"nurseLevel,member.pkMember,member.memberSigning.room.number,member.personalInfo.name,member.status",
			model:{}
		},
		events : {
			"click .J-healthdata-item" : function(e){
				var el = $(e.target);
				if(!el.hasClass("J-healthdata-item")){
					el = el.parents(".J-healthdata-item");
				}
				this.openView({
					url : "eling/elcms/health/healthdatacollection/healthdatacollection",
					params :{
						pkMember : $(el).attr("data-key")
					},isAllowBack:true
				});
			}
		},
		initSubnav:function(widget){
			return {
				parentNode:".J-subnav",
				model:{
					title:"健康状态",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							//重新查询数据
							widget.refresh({
								pkBuilding:key,
								useType:"Apartment"
							});
						}
					}]
				}
			};
		},
		setData:function(data){
			var map = {};
			
			for(var k=0;k<data.length;k++){
				var id = data[k].member.memberSigning.room.number.substring(3,4);
				data[k].nurseLevel = data[k].nurseLevel || "3";
				if(data[k].member.status.key == "Died" || data[k].member.status.key == "Checkout"){
					continue;
				}
				if(!map[id]){
					map[id] = {id:id,items:[]};
				}
				map[id].items.push(data[k]);
			}
			
			var model=this.get("model") || {};
			model.datas=map;
			this.renderPartial(".J-mixitup-container");
		},
		afterInitComponent:function(params,widget){
			if(widget.get("subnav").getValue("building")){
				this.refresh({
					pkBuilding:widget.get("subnav").getValue("building"),
					useType:"Apartment"
				});
			}
		}
	});
	module.exports = HealthStatus;
});