<div class="el-mobile-healthdata-list fixed">
	<div class="fixed-title">
		<div class="h1 J-showsidebar text-center pull-left sidebaricon">
			<i class="icon-align-justify"></i>
		</div>
		<h1 class="text-center">健康数据</h1>
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