<div class="el-mobile-report">
	<div class="el-roommonitor">
		<img src="../../resources/report.jpg" width="100%">
	</div>
	<div class="el-mobile-report-dashboard dashboard">
		<div class="container">
			<div class="row">
				{{#each this}}
				<div class="col-xs-4 margin_top_20">
					<div class="radius {{this.color}}-background text-center">
						<a href="{{this.url}}" class="J-dashboard-item">
							<div class="header"><i class="icon {{this.icon}}"></i></div>
							<div class="content text-overflow">{{this.text}}</div>
						</a>
					</div>
				</div>
				{{/each}}
			</div>
		</div>
	</div>
	<div class="el-mobile-report-detail hidden"></div>
</div>