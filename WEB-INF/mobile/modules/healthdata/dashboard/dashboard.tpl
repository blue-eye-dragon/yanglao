<div class="J-dashboard dashboard">
	<div class="el-roommonitor">
		<img src="../../resources/health.jpg" width="100%">
	</div>
	<div class="container">
		<div class="row">
			{{#each this}}
			<div class="col-xs-4 margin_top_20">
				<div class="radius {{this.color}}-background text-center">
					<a class="J-dashboard-item" href="{{this.url}}" data-key="{{this.pkHealthExamDataType}}"
						data-name="{{this.name}}">
						<div class="header">
							<div class="icon icon-{{this.icon}}"></div>
						</div>
						<div class="content text-overflow">{{this.name}}</div>
					</a>
				</div>
			</div>
			{{/each}}
		</div>
	</div>
</div>