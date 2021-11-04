<div class="row">
	<div class="col-xs-12">
		<h4 class="text-center J-dol-today-title">{{this.date}}</h4>
	</div>
</div>
<div class="row">
	<div class="col-xs-12">
		<div class="row line_height_40">
			<div class="col-xs-12 text-center">
				<h1 class="text-primary">
					{{this.minutes.today}}
					<small>分钟</small>
				</h1>
			</div>
		</div>
		<div class="row line_height_40">
			<div class="col-xs-6 text-right">昨天</div>
			<div class="col-xs-6 text-left">{{this.minutes.yesterday}}分钟</div>
		</div>
		<div class="row line_height_40">
			<div class="col-xs-6 text-right">平均</div>
			<div class="col-xs-6 text-left">{{this.minutes.average}}分钟</div>
		</div>
		<div class="row line_height_40">
			<div class="col-xs-6 text-right">{{this.minutes.text}}</div>
			<div class="col-xs-6 text-left">{{this.minutes.percent}}%</div>
		</div>
		<div class="row line_height_40">
			<div class="col-xs-12 text-center">
				<h1 class="text-primary">
					{{this.times.today}}
					<small>次</small>
				</h1>
			</div>
		</div>
		<div class="row line_height_40">
			<div class="col-xs-6 text-right">昨天</div>
			<div class="col-xs-6 text-left">{{this.times.yesterday}}次</div>
		</div>
		<div class="row line_height_40">
			<div class="col-xs-6 text-right">平均</div>
			<div class="col-xs-6 text-left">{{this.times.average}}次</div>
		</div>
	</div>
</div>
<div class="row text-center margin_top_5">
	<div class="col-xs-6">
		<a href="#" class="btn btn-danger btn-lg btn-block J-prev">前一天</a>
	</div>
	<div class="col-xs-6">
		<a href="#" class="btn btn-default btn-lg btn-block J-next">后一天</a>
	</div>
</div>