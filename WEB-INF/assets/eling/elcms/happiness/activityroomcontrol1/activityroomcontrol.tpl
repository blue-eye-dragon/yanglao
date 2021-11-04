<div class="J-subnav"></div>
<div class="container el-activitycontrol">
	<div class="J-out"></div>
	<div class="J-inner"></div>
	<div class="container J-notify-container">
		<div class="row activitycontainer">
			<img src="api/attachment/background/activityhalf"/>
			<div class="activityroom"></div>
			<div class="activitypanel">
				{{#each this.activities}}
					<div class="activitydetail J-activitydetail {{this.show}}">
						{{#if this.isCircle}}
						<div class="row">
							<div class="col-md-6">{{this.theme}}</div>
							<div class="col-md-2">{{this.weekday}}</div>
							<div class="col-md-4 text-left">{{this.timerange}}</div>
						</div>
						{{else}}
						<div class="row">
							<div class="col-md-6">{{this.theme}}</div>
							<div class="col-md-6 text-left">{{this.timerange}}</div>
						</div>
						{{/if}}
					</div>
				{{/each}}
			</div>
		</div>
	</div>
</div>
