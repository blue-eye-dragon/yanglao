<div class="el-modole-container el-bowoutmembershipcontracttrack" style="">
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
										   		<td class="col-xs-2">权益人</td>
										   		<td class="col-xs-1">申请日期</td>
										   		<td class="col-xs-1">退卡申请</td>
										   		<td class="col-xs-4">退卡审批</td>
										   		<td class="col-xs-1">退卡确认</td>
										    </tr>
			    							{{#each this.data.griddata}}
												<tr>
													<td class="col-xs-1">{{this.membershipCardNo}}</td>
										   			<td class="col-xs-2">{{personalCardowners}}</td>
										   			<td class="col-xs-1">{{this.applyDate}}</td>
										   			<td class="col-xs-1" style="background-color:{{this.bowOutMembershipContractProcessStatus.props.backColor}}; color:{{this.bowOutMembershipContractProcessStatus.props.color}}">{{this.bowOutMembershipContractPerson}}</td>
										   			<td class="col-xs-4" style="background-color:{{this.bowOutMembershipContractApproveStatus.props.backColor}};">
										   			{{#each this.bowOutMembershipContractApprove}}
										   				<span style="color:{{this.approveStatus.props.color}}">{{this.sequence}}.{{this.approver}} / </span>
										   			{{/each}}
										   			</td>
										   			<td class="col-xs-1" style="background-color:{{this.bowOutMembershipContractConfirmProcessStatus.props.backColor}}; color:{{this.bowOutMembershipContractConfirmProcessStatus.props.color}}">{{this.bowOutMembershipContractConfirmPerson}}</td>
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