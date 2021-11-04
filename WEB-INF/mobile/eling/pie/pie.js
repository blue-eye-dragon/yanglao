define(["handlebars","loading","underscore","chart"],function(Handlebars,Loading){
	var tpl = ""+
	'<div class="container pie-container">'+
		'<div class="row">'+
			'<div class="col-xs-12 text-center">'+
				'<canvas id="chart-area"></canvas>'+
			'</div>'+
		'</div>'+
		'<div class="margin_top_10">'+
			'{{#each this.data}}'+
				'{{#if this.show}}'+
					'<div class="row margin_top_5">'+
						'<div class="col-xs-6 text-left status-item" style="padding-right: 0px;">'+
							'<button class="btn btn-item" style="padding:12px 18px;background-color:{{this.color}};"></button>'+
							'{{this.label}}'+
						'</div>'+
						'<div class="col-xs-3 text-center status-item nopadding">{{this.text}}</div>'+
						'<div class="col-xs-3 text-center status-item nopadding">{{this.percent}}%</div>'+
					'</div>'+
				'{{/if}}'+
			'{{/each}}'+
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
					options.pieData = options.pieData ? options.pieData : data;
					var total = 0;
					for(var i in data){
						total += data[i];
					}
					for(var i in data){
						options.pieData[i].value = data[i];
						options.pieData[i].percent = (data[i]/total*100).toFixed(2);
						options.pieData[i].text = data[i]+"人";
						options.pieData[i].show = data[i] == 0 ? false : true;
					}
					if(options.isSort){
						var softData = _.sortBy(options.pieData,function(item){
							return -parseFloat(item.percent);
						});
						$(options.parentNode || "body").html(Handlebars.compile(tpl)({data : softData}));
					}else{
						$(options.parentNode || "body").html(Handlebars.compile(tpl)({data : options.pieData}));
					}
					
					
					new Chart($("#chart-area")[0].getContext("2d")).Pie(options.pieData);
					//设置样式
					for(var i in options.css){
						$(i).css(options.css[i]);
					}
//					Loading.end();
				}
			});
		}
	};
});