<div class="el-modole-container el-checkourrepairtrack" style="">
	<div class='J-subnav'></div>
	<div class='container J-grid'>
				<div class='row' style="width:1800px;overflow-x:auto;">
					<div class='col-sm-12'>
						<div class='box' style='margin-bottom:0;'>
							<div class='box-content box-no-padding'>
								<div>
									<table style='border:0 none;margin-bottom:0;' class='data-table-column-filter table table-bordered table-striped'>
										<tbody class="J-grid-table" style="text-align:center;">
										    <tr style="font-weight:700;">
										   		<td class="col-xs-1">会籍卡</td>
										   		<td class="col-xs-2">会员</td>
										   		<td class="col-xs-1">退房日期</td>
										   		<td class="col-xs-1">退房维修</td>
										   		<td class="col-xs-1">维修单号</td>
										   		<td class="col-xs-1">报修</td>
										   		<td class="col-xs-1">维修派工</td>
										   		<td class="col-xs-1">维修完成</td>
										   		<td class="col-xs-1">维修确认</td>
										   		<td class="col-xs-1">退房维修确认</td>
										    </tr>
			    							{{#each this.data.griddata}}
												<tr>
													<td class="col-xs-1">{{this.membershipCardNo}}</td>
										   			<td class="col-xs-2">{{this.roomNum}} {{this.memberName}}</td>
										   			<td class="col-xs-1">{{this.checkOutDate}}</td>
										   			<td class="col-xs-1" style="background-color:{{this.checkOutReapirApplyStatus.props.backColor}}; color:{{this.checkOutReapirApplyStatus.props.color}}">{{this.checkOutReapirApplyPerson}}</td>
										   			<td class="col-xs-1">{{this.repairNo}}</td>
										   			<td class="col-xs-1" style="background-color:{{this.repairStatus.props.backColor}}; color:{{this.repairStatus.props.color}}">{{this.repairPerson}}</td>
										   			<td class="col-xs-1" style="background-color:{{this.estateManagementStatus.props.backColor}}; color:{{this.estateManagementStatus.props.color}}">{{this.estateManagement}}</td>
										   			<td class="col-xs-1" style="background-color:{{this.repairFinishStatus.props.backColor}}; color:{{this.repairFinishStatus.props.color}}">{{this.repairFinish}}</td>
										   			<td class="col-xs-1" style="background-color:{{this.repairConfirmStatus.props.backColor}}; color:{{this.repairConfirmStatus.props.color}}">{{this.repairConfirmPerson}}</td>
										   			<td class="col-xs-1" style="background-color:{{this.checkOutReapirConfirmStatus.props.backColor}}; color:{{this.checkOutReapirConfirmStatus.props.color}}">{{this.checkOutReapirConfirmPerson}}</td>
										   			
												</tr>
											{{/each}}
											<tr><td colspan="15" style="text-align:left;">共{{this.data.length}}条数据</td></tr>
											<tr><td colspan="15" style="height:50px; line-height:50px;">底色含义：
											未开始&nbsp;<span style="border:1px solid black;background-color:#F1F0EC;padding:5px 15px 5px 15px;">灰色</span>&nbsp;&nbsp;&nbsp;&nbsp;
											处理中&nbsp;<span style="border:1px solid black;background-color:#FCEEAC;padding:5px 15px 5px 15px;">黄色</span>&nbsp;&nbsp;&nbsp;&nbsp;
											已完成&nbsp;<span style="border:1px solid black;background-color:#D5F6E9;padding:5px 15px 5px 15px;">绿色</span>&nbsp;&nbsp;&nbsp;&nbsp;
											未通过&nbsp;<span style="border:1px solid black;background-color:#FE967E;padding:5px 15px 5px 15px;">红色</span>
											</td></tr>
			                			</tbody>
			                		</table>
			                	</div>
			                </div>
			            </div>
			        </div>
			    </div>
	</div>                                     
</div>