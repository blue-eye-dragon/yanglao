<div class="row">
	<div class="col-xs-12">
		<h4 class="text-center J-sleeplog-today-title">{{this.title}}</h4>
	</div>
</div>
<div class="row J-sleeplog-today-chart" style="height: 200px;">
	<div class="col-xs-12">
		<div class="row" >
			<div class="col-xs-12">
				{{#each this.data}}
					<div class="sleep_item {{this.className}}" style="width: {{this.width}};"></div>
				{{/each}}
			</div>
		</div>
		<div class="row coordinate">
			{{#each this.coordinate.items}}
				<div style="text-align:center;float:left;width:{{../this.coordinate.width}};">{{this.text}}</div>
			{{/each}}
		</div>
	</div>
</div>
<div class="row J-sleeplog-today-desc">
	<div class="col-xs-12">
		<h1 class="text-center text-primary">{{this.goals}}</h1>
	</div>
	{{#each this.totals}}
		<div class="col-xs-6"><h6>{{this.label}}：<small>{{this.value}}</small></h6></div>
	{{/each}}
</div>
<div class="row text-center margin_top_5 J-sleeplog-today-btn">
	<div class="col-xs-6">
		<button type="button" class="btn btn-danger btn-lg btn-block J-prev">前一天</button>
	</div>
	<div class="col-xs-6">
		{{#if this.hasNext}}
		<button type="button" class="btn btn-danger btn-lg btn-block J-next">后一天</button>
		{{else}}
		<button type="button" class="btn btn-default btn-lg btn-block J-next">后一天</button>
		{{/if}}
	</div>
</div>
<div class="J-buyit row">
	<div class="col-xs-12 text-center" style="font-size: 20px;margin-top: 10px;color: gray;">演示数据，仅供参考。</div>
	<div class="col-xs-12"><button class="btn btn-danger btn-block btn-lg margin_top_20">购买</button></div>
</div>
		