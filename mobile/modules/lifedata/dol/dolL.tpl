<div class="row J-dol-last7-title">
	<div class="col-xs-12">
		<h4 class="text-center">{{this.date}}</h4>
	</div>
</div>
<div class="row J-dol-last7-chart" style="height: 200px;"></div>
<div class="row J-dol-last7-desc">
	{{#each this.details}}
	<div class="line_height_40">
		<div class="col-xs-3 text-right h5">{{this.date}}</div>
		<div class="col-xs-3 text-left text-primary" style="font-size: 30px;">{{this.value}}</div>
	</div>
	{{/each}}
	<div class="col-xs-12 text-center text-primary h1">基本稳定</div>
</div>	