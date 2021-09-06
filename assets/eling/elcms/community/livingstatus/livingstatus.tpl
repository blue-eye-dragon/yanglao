<div class="el-livingstatus">
	<div class="J-subnav"></div>
	<div class="hidden J-memberGrid"></div>
	<div class="hidden J-newmemberGrid"></div>
	<div class="hidden J-accompanyGrid"></div>
	<div class="hidden J-newaccompanyGrid"></div>
	<div class="hidden J-roomGrid"></div>
	<div class="hidden J-msroomGrid"></div>
	
	
	<div class="container J-el-livingstatus el-livingstatus-container">
		{{#each this.data}}
			<div class="row">
				{{#each this}}
					<div class="col-md-2 col-sm-4 col-xs-3 col-lg-2  box">
						<div>
							<div class="row">
								<a href="javascript:void(0);" style="color:#2FABE9;text-decoration: none;cursor:pointer;" class="J-{{this.key}}-foward">
								{{#if this.isPercent}}
								{{#if this.isNoPercent}}
									<div class="col-md-12 latestvalue" style="height: 100px;">
				                        <input type="text" class="J-{{this.key}}-value hidden nopercent_in_circle" value="{{this.percent}}"/>
									{{else}}
									<div class="col-md-12 latestvalue" style="height: 100px;">
				                     	<input type="text" class="J-{{this.key}}-value hidden percent_in_circle" value="{{this.percent}}"/>
				                     {{/if}}
								{{else}}
									
									<div class="col-md-12 latestvalue" style="height: 100px;padding-top: 28px;color:{{this.color}}">
										<span class="J-{{this.key}}-value">{{this.value}}</span>
									
								{{/if}}
								</div>
								</a>
							</div>
							<div class="row">
								<div class="col-md-12 font_10">{{this.label}}</div>
							</div>
						</div>
					</div>
				{{/each}}
			</div>
		{{/each}}
	</div>
</div>
