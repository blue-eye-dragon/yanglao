<div class="el-mobile-healthdata container">
	<div class="h1 J-showsidebar text-center pull-left sidebaricon">
		<i class="icon-align-justify"></i>
	</div>
	<h2 class="text-center text-primary">{{this.title}}</h2>
	
	<hr/>
	
	<!-- 时间切换 -->
	<div class="row header">
		<div class="col-xs-3 text-center">
			<button class="btn btn-primary J-prev"><i class="icon-chevron-left"></i></button>
		</div>
		<div class="col-xs-6 text-center">
			<button class="btn btn-primary btn-block">{{this.date}}</button>
		</div>
		<div class="col-xs-3 text-center">
			{{#if this.hasNext}}
			<button class="btn btn-primary J-next"><i class="icon-chevron-right"></i></button>
			{{/if}}
		</div>
	</div>
	
	<!-- 当前血压值 -->
	<div class="row">
		<h1 class="col-xs-6 text-center text-primary J-last-h">{{this.high}}</h1>
		<h1 class="col-xs-6 text-center text-danger J-last-l">{{this.low}}</h1>
		<h3 class="col-xs-6 text-center text-primary">收缩压</h3>
		<h3 class="col-xs-6 text-center text-danger">舒张压</h3>
	</div>
	
	<hr/>
	
	<!-- 过去一周 -->
	<div class="row header">
		<div class="col-xs-3 text-center">
			<button class="btn btn-primary J-prev-week"><i class="icon-chevron-left"></i></button>
		</div>
		<div class="col-xs-6 text-center">
			<button class="btn btn-primary btn-block">{{this.range}}</button>
		</div>
		<div class="col-xs-3 text-center">
			{{#if this.hasNext}}
			<button class="btn btn-primary J-next-week"><i class="icon-chevron-right"></i></button>
			{{/if}}
		</div>
	</div>
	<div class="row J-healthdata-last7-chart chart-container"></div>
	
</div>
