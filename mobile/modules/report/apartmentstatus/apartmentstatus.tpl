<div class="container el-report-apartmentstatus">
	<div class="row margin_top_20">
		<div class="col-xs-12 text-center">
			<canvas id="chart-area"></canvas>
		</div>
	</div>
	{{#each this.data}}
	<div class="row">
		<div class="col-xs-4 text-right status-item nopadding">{{this.label}}</div>
		<div class="col-xs-1 text-center status-item nopadding">
			<button class="btn btn-item" style="background-color:{{this.color}};"></button>
		</div>
		<div class="col-xs-3 text-center status-item nopadding">{{this.value}}户</div>
		<div class="col-xs-3 text-center status-item nopadding">{{this.percent}}%</div>
	</div>
	{{/each}}
</div>
