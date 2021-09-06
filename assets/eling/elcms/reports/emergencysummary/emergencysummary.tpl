<div class="el-modole-container el-emergencysummary">
	<div class='J-subnav'></div>
	<div class='container el-grid'>
		<div class='row'>
			<div class='col-xs-12'>
				<div class='row'>
					<div class='col-sm-12'>
						<div class='box' style='margin-bottom:0;'>
							<div class='box-content box-no-padding'>
								<div>
									<table style='border:0 none;margin-bottom:0;' class='data-table-column-filter table table-bordered table-striped'>
										<tbody class="J-grid-table" style="text-align:center">
			    							{{#each this.data}}
												<tr>
													<td rowspan="6" class="col-md-1" style="vertical-align:middle;"> {{this.month}}</td>
													<td class="col-md-1">误报</td>
													{{#each this.counts}}
														<td>{{this.buildingName}}</td>
													{{/each}}
												</tr>
													
												<tr>
													<td class="col-md-1">健康求助</td>
													{{#each this.counts}}
														<td>{{this.lifeCount}}</td>
													{{/each}}
												</tr>
													
												<tr>
													<td class="col-md-1">生活求助</td>
													{{#each this.counts}}
														<td>{{this.communityCount}}</td>
													{{/each}}
												</tr>
													
												<tr>
													<td class="col-md-1">报警器</td>
													{{#each this.counts}}
														<td>{{this.healthCount}}</td>
													{{/each}}
												</tr>
												<tr>
													<td class="col-md-1">会员卡</td>
													{{#each this.counts}}
														<td>{{this.healthCount}}</td>
													{{/each}}
												</tr>
												<tr>
													<td class="col-md-1">电话</td>
													{{#each this.counts}}
														<td>{{this.healthCount}}</td>
													{{/each}}
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