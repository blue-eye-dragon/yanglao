<div class="dashboard">
	<div class="el-roommonitor">
		<img src="../../resources/report.jpg" width="100%">
	</div>
	<div class="container">
		<div class="row">
			{{#each this}}
			<a href="#{{this.url}}">				
				<div class="col-xs-4 margin_top_20">
					<div class="radius {{this.color}}-background text-center">
						<a href="#{{this.url}}">
							<div class="header">
								<div class="icon icon-{{this.icon}}"></div>
							</div>
							<div class="content text-overflow">{{this.name}}</div>
						</a>
					</div>
				</div>
			</a>
			{{/each}}
		</div>
	</div>
</div>