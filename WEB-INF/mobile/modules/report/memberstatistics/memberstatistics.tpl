<div class="el-mobile-report-memberstatistics container">
	<div class="row dashboard margin_top_20">
		{{#each this.datas}}
		<div class="col-xs-6 margin_top_5">
			<div class="radius {{this.color}}-background text-center">
				<div class="header icon J-{{this.id}}">{{this.value}}</div>
				<div class="content">{{this.text}}</div>
			</div>
		</div>
		{{/each}}
	</div>
</div>