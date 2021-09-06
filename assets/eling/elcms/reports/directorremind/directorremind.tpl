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
												<tr>
													<td class="col-md-1">提醒类型</td>
													<td class="col-md-1">房间号</td>
													<td class="col-md-1">会员</td>
													<td class="col-md-1">性别</td>
													<td class="col-md-1">年龄</td>
													<td class="col-md-2">提醒内容</td>
												</tr>
											{{#each this.data}}
												<tr>
												{{#if this.remindType}}
													<td rowspan="{{this.row}}" style="vertical-align:middle;">{{this.remindType}}</td>
												{{/if}}
													<td style="text-align:left">{{this.roomNumber}}</td>
													<td style="text-align:left">{{this.memberName}}</td>
													<td style="text-align:left">{{this.sex}}</td>
													<td style="text-align:left">{{this.age}}</td>
													<td style="text-align:left">{{this.content}}</td>
												
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