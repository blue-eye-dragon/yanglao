<div class="el-modole-container el-dutySchedulingManagerList">
	<div class='J-subnav'></div>
	<div class='J-form hidden'></div>
	<div class='J-component container' style="margin: 10px 0;">
	<h3 class="J-component-time" style="margin-left: 40%; display: inline-block;"></h3>
	<h3 class='J-component-span' style="margin: 10px 0; display: inline-block;">老年公寓行政排班表</h3>
	</div>
	<div class='container J-grid'>
		<div class='row'>
			<div class='col-xs-12'>
				<div class='row'>
					<div class='col-sm-12'>
						<div class='box' style='margin-bottom:0;'>
							<div class='box-content box-no-padding'>
								<div>
									<table style='border:0 none;margin-bottom:0;' class='data-table-column-filter table table-bordered table-striped'>
										<tbody class="J-grid-table" style="text-align:center">
										    <tr>
										    <td width="5%"></td>
										    <td width="4%"></td>
										    {{#each this.months}}
												<td>{{this.value}}</td>
											{{/each}}
											{{#each this.count}}
											<td width="2%" rowspan="2" style="vertical-align:middle;">{{this.name}}汇总</td>
											{{/each}}
											{{#if this.data}}
											<td width="4%" rowspan="2" style="vertical-align:middle;">备注</td>
											{{/if}}
										    </tr>
										    <tr>
										    <td></td>
										    <td></td>
										    {{#each this.monthsWeek}}
												<td>{{this.wvalue}}</td>
											{{/each}}
										    </tr>
			    							{{#each this.data}}
												<tr data-index = "{{@index}}">
													{{#if this.type}}
													<td rowspan="{{../../this.data.length}}" style="vertical-align:middle;">{{this.type}}</td>
													{{/if}}
													<td> {{this.user.user.name}}<br><i class="{{this.user.icon}}"></i></td>
													{{#each this.dutylist}}
													<td class="J-grid-table-dutydate" data-index="{{@index}}" style="background-color: {{this.dutyType.color}}">{{this.dutyType.name}}</td>
													{{/each}}
													{{#each this.summary}}
													<td>{{this.count}}</td>
													{{/each}}
													<td class="J-grid-table-remark">{{this.remark.remark}}</td>
												</tr>
											{{/each}}
			                			</tbody>
			                		</table>
			                	</div>
			                	<div style="height:2em;"></div>
			                </div>
			            </div>
			        </div>
			    </div>
			</div>
		</div>
	</div>
</div>