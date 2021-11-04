<div class="el-mobile-lifedata">
	<div class="J-dashboard sliderContainer">
		<div class="el-roommonitor">
			<img src="../../resources/alone.jpg" width="100%">
		</div>
		<div class="container">
			<div class="row">
				{{#each this.menus}}
				<div class="col-xs-4 margin_top_20">
					<div class="radius {{this.color}}-background text-center">
						<a href="{{this.url}}">
							<div class="header">
								<i class="icon {{this.icon}}"></i>
							</div>
							<div class="content">{{this.text}}</div>
						</a>
					</div>
				</div>
				{{/each}}
			</div>
		</div>
	</div>
	<div class="J-sleeplog hidden sliderContainer" style="left: {{this.left}}px;">
		<div class="container el-sleeplog">
			<div class="row">
				<div class="col-xs-12">
					<h1 class="text-center">睡眠报告</h1>
				</div>
			</div>
			<div class="btn-group btn-group-justified">
				<div class="btn-group">
					<button type="button" class="btn btn-default btn-danger J-btn-today">今日详情</button>
				</div>
				<div class="btn-group">
					<button type="button" class="btn btn-default J-btn-last7days">最近七天</button>
				</div>
			</div>
			<div class="J-sleeplog-content">
			</div>
		</div>
	</div>
	<div class="J-locationlog hidden sliderContainer" style="left: {{this.left}}px;"></div>
	<div class="J-dol hidden sliderContainer" style="left: {{this.left}}px;">
		<div class="container el-dol">
			<div class="row">
				<div class="col-xs-12">
					<h1 class="text-center J-dol-title"></h1>
				</div>
			</div>
			<div class="btn-group btn-group-justified">
				<div class="btn-group">
					<button type="button" class="btn btn-default btn-danger J-btn-today">今日详情</button>
				</div>
				<div class="btn-group">
					<button type="button" class="btn btn-default J-btn-last7days">最近七天</button>
				</div>
			</div>
			<div class="J-dol-content"></div>
		</div>
	</div>
</div>