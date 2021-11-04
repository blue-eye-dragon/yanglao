<div class="el-score container">
	<div class="row">
		<div class="col-xs-12 text-center">
			<h2 style="font-size: 30px;">服务评价</h2>
		</div>
	</div>
	<hr>
	<div class="row">
		<div class="col-xs-4 text-right detail-label nopadding">总体服务</div>
		<div class="col-xs-8">
			<div class="text-right">
				{{#each this.overall.stars}}
					<i class="icon icon-star overall"></i>
				{{/each}}
				{{#each this.overall.emptyStars}}
					<i class="icon icon-star-empty overall"></i>
				{{/each}}
			</div>
		</div>
	</div>
	<hr>
	<div class="row">
		<div class="col-xs-4 text-right detail-label nopadding">家属沟通</div>
		<div class="col-xs-8">
			<div class="text-right">
				{{#each this.family.stars}}
					<i class="icon icon-star family-commu"></i>
				{{/each}}
				{{#each this.family.emptyStars}}
					<i class="icon icon-star-empty family-commu"></i>
				{{/each}}
			</div>
		</div>
	</div>
	<hr>
	<div class="row">
		<div class="col-xs-4 text-right detail-label nopadding">专属秘书</div>
	</div>
	<div class="row">
		{{#each this.secretaries}}
		<div class="col-xs-4 text-right margin_top_5">
			<img src="api/attachment/userphoto/{{this.secretary.pkUser}}">
		</div>
		<div class="col-xs-8 text-right">
			<h4 class="text-left secretary" data-key={{this.secretary.pkUser}}>{{this.secretary.name}}</h4>
			<div>
				{{#each this.score.stars}}
				<i class="icon icon-star secretary"></i>
				{{/each}}
				{{#each this.score.emptyStars}}
				<i class="icon icon-star-empty secretary"></i>
				{{/each}}
			</div>
		</div>
		<div class="clear"></div>
		{{/each}}
	</div>
	<hr>
</div>