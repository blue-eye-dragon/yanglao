<div class="el-nextexamdetail container">
	<div class="row">
		<h1 class="col-xs-12 text-center">{{this.member.personalInfo.name}}</h1>
	</div>
	<hr>
	<div class="row">
		<div class="col-xs-12">就诊时间</div>
		<div class="col-xs-12">{{this.dateStr}}</div>
		<div class="col-xs-12">{{this.hospital.name}}</div>
		<div class="col-xs-12">{{this.offices}}</div>
	</div>
	<hr>
	<div class="row">
		<div class="col-xs-12">就诊原因</div>
		<div class="col-xs-12">
			{{#each this.diseaseDetails}}
				{{this.name}}，
			{{/each}}
		</div>
		<div class="col-xs-12">{{this.reason}}</div>
	</div>
	<hr>
	<div class="row">
		<div class="col-xs-12">处理</div>
		<div class="col-xs-12">{{this.summary}}</div>
	</div>
</div>