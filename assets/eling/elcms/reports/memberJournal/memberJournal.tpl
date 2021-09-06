<div class="el-modole-container el-memberjournal">
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
													<td rowspan="4" class="col-md-1" style="vertical-align:middle;"> {{this.month}}</td>
													<td class="col-md-1">内容</td>
													{{#each this.counts}}
														<td>{{this.buildingName}}</td>
													{{/each}}
												</tr>
													
												<tr>
													<td class="col-md-1">生活记录</td>
													{{#each this.counts}}
														<td><a href='javascript:void(0);' style='color:red;' pkBuilding = '{{this.pkBuilding}}' month = '{{iMonth}}' flag='life' class='J-detail'>{{this.lifeCount}}</a></td>
													{{/each}}
												</tr>
													
												<tr>
													<td class="col-md-1">家属沟通</td>
													{{#each this.counts}}
														<td><a href='javascript:void(0);' style='color:red;' pkBuilding = '{{this.pkBuilding}}' month = '{{iMonth}}' flag='community' class='J-detail'>{{this.communityCount}}</a></td>
													{{/each}}
												</tr>
													
												<tr>
													<td class="col-md-1">健康记录</td>
													{{#each this.counts}}
														<td><a href='javascript:void(0);' style='color:red;' pkBuilding = '{{this.pkBuilding}}' month = '{{iMonth}}' flag='health' class='J-detail'>{{this.healthCount}}</a></td>
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