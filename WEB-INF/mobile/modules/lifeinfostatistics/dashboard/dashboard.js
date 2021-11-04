define(["hbars!./dashboard"],function(tpl){
	
	return {
		render : function(){
			$("body").html(tpl([{
				name : "起床时间",icon : "user",color : "blue",url : "report/getup"
			},{
				name : "午休时间",icon : "calendar",color : "green",url : "report/lunchbreak"
			},{
				name : "就寝时间",icon : "home",color : "orange",url : "report/sleepclock"
			},{
				name : "吸烟状况",icon : "building",color : "red",url : "report/smoke"
			}]));
		}
	};
});
