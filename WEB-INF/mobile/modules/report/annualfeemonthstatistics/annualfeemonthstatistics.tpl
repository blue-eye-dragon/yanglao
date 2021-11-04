<div class="el-mobile-report-annualfeemonthstatistics container">
	<div class="row margin_top_20">
		<div class="col-xs-2 text-center">
			<button class="btn btn-primary J-prev"><i class="icon-chevron-left"></i></button>
		</div>
		<div class="col-xs-8 text-center">
			<button class="btn btn-primary btn-block">{{this.date}}</button>
		</div>
		{{#if this.hasNext}}
		<div class="col-xs-2 text-center">
			<button class="btn btn-primary J-next"><i class="icon-chevron-right"></i></button>
		</div>
		{{/if}}
	</div>
	<div class="row dashboard margin_top_10">
		<div class="col-xs-6 text-center text-primary">户数</div>
		<div class="col-xs-6 text-center text-primary">金额</div>
		{{#each this.datas}}
		<div class="col-xs-6 margin_top_20">
			<div class="radius {{this.color}}-background text-center">
				<div class="header icon">{{this.value}}</div>
				<div class="content">{{this.text}}</div>
			</div>
		</div>
		{{/each}}
	</div>
</div>