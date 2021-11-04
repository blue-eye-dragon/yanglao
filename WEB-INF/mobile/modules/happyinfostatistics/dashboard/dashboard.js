define(["hbars!./dashboard"],function(tpl){
	
	return {
		render : function(){
			$("body").html(tpl([{
				name : "兴趣爱好",icon : "user",color : "blue",url : "report/interest"
			},{
				name : "休闲娱乐",icon : "calendar",color : "green",url : "report/amusement"
			},{
				name : "节日",icon : "building",color : "red",url : "report/holiday"
			}]));
		}
	};
});
