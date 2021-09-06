<div class="container el-environment">
	<div class="row room-change">
		<div class="col-xs-3 text-right">
			{{#if this.hasPrev}}
			<button class="btn btn-primary J-prev"><i class="icon-chevron-left"></i></button>
			{{/if}}
		</div>
		<div class="col-xs-6 text-center">
			<button class="btn btn-primary btn-block">{{this.room}}</button>
		</div>
		<div class="col-xs-3 text-left">
			{{#if this.hasNext}}
			<button class="btn btn-primary J-next"><i class="icon-chevron-right"></i></button>
			{{/if}}
		</div>
	</div>
	<div class="row time">
		<div class="col-xs-12 text-center">{{this.date}}</div>
	</div>
	<div class="out">
		<div class="weather"></div>
		<div class="detail row">
			<div class="col-xs-12 text-center" style="font-size: 50px;position: relative;">
				{{this.out.temperature}}
				<div style="font-size: 20px;position: absolute;top: 10px;left: 130px;color: rgb(149, 221, 224);">℃</div>
				<div style="font-size: 20px;position: absolute;top: 35px;left: 130px;">.{{this.out.temperature_extend}}</div>
			</div>
			<div class="col-xs-6 text-center">湿度</div>
			<div class="col-xs-6 text-center">气压</div>
			<div class="col-xs-6 text-center" style="font-size: 18px;">{{this.out.humidity}}%</div>
			<div class="col-xs-6 text-center" style="font-size: 18px;">{{this.out.pressure}}个</div>
		</div>
	</div>
	<hr>
	<div class="in">
		<div class="{{status}}_status level"></div>
		<div class="detail row">
			<div class="col-xs-12 text-center" style="font-size: 50px;position: relative;">
				{{this.in.temperature}}
				<div style="font-size: 20px;position: absolute;top: 10px;left: 130px;color: rgb(149, 221, 224);">℃</div>
				<div style="font-size: 20px;position: absolute;top: 35px;left: 130px;">.{{this.in.temperature_extend}}</div>
			</div>
			<div class="col-xs-6 text-center">湿度</div>
			<div class="col-xs-6 text-center">气压</div>
			<div class="col-xs-6 text-center" style="font-size: 18px;">{{this.in.humidity}}%</div>
			<div class="col-xs-6 text-center" style="font-size: 18px;">{{this.in.pressure}}个</div>
		</div>
		<div class="row co2">
			<div class="col-xs-3 text-center" style="font-size: 20px;color: #00acec;padding: 0;">co<sub>2</sub></div>
			<div class="col-xs-6 text-right {{this.in.co2Class}}-font" style="font-size: 50px;margin-top: -10px;">{{this.in.co2}}</div>
			<div class="col-xs-3 text-center" style="font-size: 20px;color: #00acec;padding: 0;">ppm</div>
		</div>
		<div class="row co2">
			<div class="col-xs-3 text-center" style="font-size: 20px;color: #00acec;padding: 0;">噪音</div>
			<div class="col-xs-6 text-right {{this.in.noiseClass}}-font" style="font-size: 50px;margin-top: -10px;">{{this.in.noise}}</div>
			<div class="col-xs-3 text-center" style="font-size: 20px;color: #00acec;padding: 0;">分贝</div>
		</div>
	</div>
	<div class="J-buyit row">
		<div class="col-xs-12 text-center" style="font-size: 20px;margin-top: 10px;color: gray;">演示数据，仅供参考。</div>
		<div class="col-xs-12"><button class="btn btn-danger btn-block btn-lg margin_top_20">购买</button></div>
	</div>
</div>