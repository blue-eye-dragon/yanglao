<div class="el-mobile-healthpandect container">

	<div class="row margin_top_10">
		<div class="col-xs-2 text-center">
			<button class="btn btn-primary J-prev"><i class="icon-chevron-left"></i></button>
		</div>
		<div class="col-xs-8 text-center">
			<button class="btn btn-primary btn-block">
				<span>{{this.title}} </span>
				<span class="J-currentDate">{{this.date}}</span>
			</button>
		</div>
		<div class="col-xs-2 text-center">
			<button class="btn btn-primary J-next hidden"><i class="icon-chevron-right"></i></button>
		</div>
	</div>
	<hr/>
	
	<!-- 当前心电图 -->
	<div class="row text-primary electrocardiogram-container">
		<h2 class="col-xs-12">心电图描述</h2>
		<h1 class="col-xs-12 J-description text-center">无</h1>
	</div>
	<hr/>
	
	<div class="row text-primary electrocardiogram-container">
		<h2 class="col-xs-12">心律描述</h2>
		<h1 class="col-xs-12 J-isarrhythmia text-center">无</h1>
	</div>
	<hr/>
	
	<div class="row text-primary electrocardiogram-container">
		<h2 class="col-xs-12">心率描述</h2>
		<h1 class="col-xs-12 J-heartrate text-center">无</h1>
	</div>
	<hr/>
</div>
