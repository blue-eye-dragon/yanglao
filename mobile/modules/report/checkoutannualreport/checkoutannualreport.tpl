<div class="el-mobile-report-checkoutannualreport fixed">
	<div class="fixed-title">
		<h1 class="text-center">退房年报</h1>
	</div>
	<div class="container fixed-content">
		<div class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-heading text-center">
						<div class="row">
							<div class="col-xs-4 nopadding J-prev"><i class="icon-chevron-left"></i></div>
						  	<div class="col-xs-4 nopadding">{{this.date}}</div>
						  	{{#if this.hasNext}}
						  	<div class="col-xs-4 nopadding J-next"><i class="icon-chevron-right"></i></div>
						  	{{/if}}
						</div>
					</div>
					<ul class="list-group"></ul>
				</div>
			</div>
		</div>
	</div>
</div>