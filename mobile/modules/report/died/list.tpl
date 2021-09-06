<div class="el-mobile-report-died container">
	<div class="row margin_top_20">
		<div class="col-xs-3 text-center">
			<button class="btn btn-primary J-prev"><i class="icon-chevron-left"></i></button>
		</div>
		<div class="col-xs-6 text-center">
			<button class="btn btn-primary btn-block">{{this.date}}过世</button>
		</div>
		{{#if this.hasNext}}
		<div class="col-xs-3 text-center">
			<button class="btn btn-primary J-next"><i class="icon-chevron-right"></i></button>
		</div>
		{{/if}}
	</div>
	<div class="row margin_top_20" style="font-size: 18px;">
		<div class="col-xs-12 nopadding">
			<div class="box todo-list">
				<div class="box-content nopadding">
					<ul class="list-unstyled text-primary"></ul>
				</div>
			</div>
		</div>
	</div>
</div>