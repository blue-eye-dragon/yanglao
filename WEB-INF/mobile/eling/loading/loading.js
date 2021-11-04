define(["handlebars","hbars!./loading"],function(Handlebars,tpl){
	var _render = function(){
		$("body").append(tpl());
	};

	var _destroy = function(){
		$(".J-loading").remove();
	};
	return{
		start : function(){
			_render();
		},
		end : function(){
			_destroy();
		}
	};
});
