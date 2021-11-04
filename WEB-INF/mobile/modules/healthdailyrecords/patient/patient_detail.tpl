<div class="el-patientdetail container">
	<div class="row">
		<h1 class="col-xs-12 text-center">{{this.member.personalInfo.name}}</h1>
	</div>
	<hr>
	<div class="row">
		<div class="col-xs-12">{{this.dateStr}}入院</div>
		<div class="col-xs-12">{{this.hospital.name}}</div>
		<div class="col-xs-12">{{this.departmentsSickbed}}</div>
	</div>
	<hr>
	<div class="row">
		<div class="col-xs-12">入院原因</div>
		<div class="col-xs-12">{{this.disease}}</div>
	</div>
	<hr>
	<div class="row">
		<div class="col-xs-12">治疗经过</div>
		<div class="col-xs-12">{{this.afterTreatment}}</div>
	</div>
	<hr>
	<div class="row">
		<div class="col-xs-12">出院诊断及建议</div>
		<div class="col-xs-12">{{this.dischargeDiagnosis}}</div>
		<div class="col-xs-12">{{this.doctorAdvised}}</div>
	</div>
</div>