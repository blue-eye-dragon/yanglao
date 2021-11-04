require(["backbone","eling","pie"],function(Backbone,eling,pie){
	
	var Router = Backbone.Router.extend({
		routes : {
			"" : "dashboard",
			"report/getup" : "getup",
			"report/lunchbreak" : "lunchbreak",
			"report/sleepclock" : "sleepclock",
			"report/smoke" : "smoke"
		},
		dashboard : function(){
			require(["modules/lifeinfostatistics/dashboard/dashboard"],function(view){
				view.render();
			});
		},
		getup : function(){
			pie.render({
				url : "api/wechat/getup",
				pieData : {
					"5-6" : {color:"#f34541",label: "5-6点"},
					"6-7" : {color:"#f8a326",label: "6-7点"},
					"7-8" : {color:"#49bf67",label: "7-8点"},
					"8-9" : {color:"#FF538B",label: "8-9点"},
					"9-10" : {color: "#00A2E8",label: "9-10点"},
					"Other" : {color: "#E1FA00",label: "其他"}
				},
				css : {
					".pie-container" : {"margin-top" : "50px"}
				}
			});
		},
		lunchbreak : function(){
			pie.render({
				url : "api/wechat/lunchBreak",
				pieData : {
					"11-12" : {color:"#f34541",label: "11-12点"},
					"12-13" : {color:"#f8a326",label: "12-13点"},
					"13-14" : {color:"#49bf67",label: "13-14点"},
					"14-15" : {color:"#FF538B",label: "14-15点"},
					"Other" : {color: "#00A2E8",label: "其他"}
				},
				css : {
					".pie-container" : {"margin-top" : "50px"}
				}
			});
		},
		sleepclock : function(){
			pie.render({
				url : "api/wechat/sleepClock",
				pieData : {
					"20-21" : {color:"#f34541",label: "20-21点"},
					"21-22" : {color:"#f8a326",label: "21-22点"},
					"22-23" : {color:"#49bf67",label: "22-23点"},
					"23-24" : {color:"#FF538B",label: "23-24点"},
					"Other" : {color: "#00A2E8",label: "其他"}
				},
				css : {
					".pie-container" : {"margin-top" : "50px"}
				}
			});
		},
		smoke : function(){
			pie.render({
				url : "api/wechat/smoke",
				pieData : {
					"Smoke" : {color:"#f34541",label: "吸烟"},
					"NotSmoke" : {color:"#f8a326",label: "不吸烟"},
					"Other" : {color:"#49bf67",label: "其他"}
				},
				isSort : true,
				css : {
					".pie-container" : {"margin-top" : "50px"}
				}
			});
		}
	});
	
	new Router();
	
	Backbone.history.start();
});