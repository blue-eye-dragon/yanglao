<div class="el-activityroompandect">
	<div class="J-subnav">
	</div>
	<div class="J-grid hidden"></div>
	<div class="container J-activityroom-pandect">
		<div class="row">
			<div style="height:40px;">
				<div style="float:right;margin-top: 6px;margin-right: 60px;">预警</div>
				<div class="circle danger_status" style="float:right;margin-top: 6px;margin-right: 15px;height:20px;width:20px"></div>
				<div style="float:right;margin-top: 6px;margin-right: 15px;">正常</div>
				<div class="circle common_status" style="float:right;margin-top: 6px;margin-right: 15px;height:20px;width:20px"></div>
				<div style="float:right;margin-top: 6px;margin-right: 15px;">良好</div>
				<div class="circle success_status" style="float:right;margin-top: 6px;margin-right: 15px;height:20px;width:20px"></div>
			</div>
			{{#each this.activities}}
			<a href="javascript:void(0)" class="col-md-3 J-activity-item" style="text-decoration: none;padding-right: 0px;">
				<div class="box">
					<div class="box-header">
						<div style="font-size:24px;color:#333333">{{this.activityRoom.name}}
							&nbsp;&nbsp;
							<span style="font-size:24px;color:#333333">{{this.memberNumber}}</span>
						</div>
					</div>
					<div class="circlemax {{this.co2ClassName}}_statusmax" style="float:left;margin-left: 30px;margin-top: 15px;">   
						<div class="circle {{this.co2ClassName}}_status" style="margin-left: -6px;margin-top: -6px;">
							<div class="{{this.co2ClassName}}_font text-center" style="margin-top: 15px;height: 48px;font-size: 36px;">{{this.co2}}</div>
							<div class="{{this.co2ClassName}}_font text-center" style="margin-top: -6px;font-size: 18px;">co<small style="font-size: 18px;">2</small></div>
						</div>
					</div>
					<div style="width:50%;float:right">
						<li style="list-style:none;padding-top: 8px;"><div class="circle {{this.temperatureClassName}}_status" style="height:20px;width:20px"></div>&nbsp;&nbsp;&nbsp;温度&nbsp;&nbsp;&nbsp;<div style="font-size:20px;float:right;">{{this.temperature}}</div></li>
						<li style="list-style:none;padding-top: 8px;"><div class="circle {{this.humidityClassName}}_status" style="height:20px;width:20px"></div>&nbsp;&nbsp;&nbsp;湿度&nbsp;&nbsp;&nbsp;<div style="font-size:20px;float:right;">{{this.humidity}}</div></li>
						<li style="list-style:none;padding-top: 8px;"><div class="circle common_status" style="height:20px;width:20px"></div>&nbsp;&nbsp;&nbsp;噪音&nbsp;&nbsp;&nbsp;<div style="font-size:20px;float:right;">{{this.noise}}</div></li>
						<li style="list-style:none;padding-top: 8px;"><div class="circle common_status" style="height:20px;width:20px"></div>&nbsp;&nbsp;&nbsp;气压&nbsp;&nbsp;&nbsp;<div style="font-size:20px;float:right;">{{this.pressure}}</div></li>
					</div>
				</div>
			</a>
			{{/each}}
			
		</div>
	</div>
</div>