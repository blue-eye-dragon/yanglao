define(["handlebars","loading","zepto"],function(handlebars,Loading){
	
	var tpl = ""+
		'<div class="container J-list">'+
			'<div class="row">'+
				'<div class="col-xs-12 text-center">'+
					'<h2 class="btn btn-primary">{{this.title}}</h2>'+
				'</div>'+
			'</div>'+
			'<div class="row margin_top_20">'+
				'<div class="col-xs-12">'+
					'<div class="todo-list">'+
						'<ul class="list-unstyled text-primary">'+
							'{{#each this.datas}}'+
								'<li class="item row">'+
									'<div class="col-xs-{{../this.cols.label}}">{{this.label}}</div>'+
									'<div class="col-xs-{{../this.cols.text}} nopadding">{{this.text}}</div>'+
									'<div class="col-xs-{{../this.cols.percent}} nopadding">{{this.percent}}%</div>'+
								'</li>'+
							'{{/each}}'+
						'</ul>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>';
	
	return {
		render : function(options){
			Loading.start();
			$.ajax({
				url : options.url,
				data : options.params,
				dataType : "json",
				success : function(data){
					var total = data["TotalMember"] || 0, results = [];
					if(!total){
						for(var i in data){
							total += data[i];
						}
					}
					for(var i in data){
						if(i != "TotalMember"){
							results.push({
								label : i,
								text : data[i]+"人",
								percent : (data[i]/total*100).toFixed(2)
							});
						}
					}
					var softData = null;
					if(options.isSort){
						softData = _.sortBy(results,function(item){
							return -parseFloat(item.percent);
						});
					}
					
					$(options.parentNode || "body").html(handlebars.compile(tpl)({
						title : options.title,
						datas : options.isSort ? softData : results,
						cols : $.extend(true,{
							label : "6",
							text : "3",
							percent : "3"
						},options.cols)
					}));
				}
			});
		}
	};
});