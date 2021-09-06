define(function(require,exports,module){
	
	var Backbone = require("backbone");
	
	var Action = Backbone.Model.extend({
		//模型的主键
		idAttribute : "pkAction"
	});

	//定义集合（Collection->List<Member>）
	var Actions = Backbone.Collection.extend({
		
		//指定集合中的模型
		model : Action,
		
		//对应后台的查询服务
		url : "api/pendingconfirm/query",
		
		parse: function(data) {
			for(var i=0;i<data.length;i++){
				data[i].date=moment(data[i].date).format("YYYY-MM-DD HH:mm:ss");
			}
		    return data;
		}
	});
	
	return {
		Model : Action,
		Collection : Actions
	};
});