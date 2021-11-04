<div class="el-modole-container el-checkintrack" style="">
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
										   		<td style="width:80px;">会籍卡</td>
										   		<td style="width:100px;">签约日期</td>
										   		<td style="width:150px;">权益人</td>
										   		<td style="width:100px;">评估申请提交</td>
										   		<td style="width:80px;">评估打分</td>
										   		<td style="width:160px;">评估审核</td>
										   		<td style="width:80px;">会籍签约</td>
										   		<td style="width:80px;">卡费收取</td>
										   		<td style="width:100px">卡费到账确认</td>
										   		<td style="width:80px;">卡费开票</td>
										   		<td style="width:80px;">会员签约</td>
										   		<td style="width:80px;">服务费收款</td>
										   		<td style="width:80px;">服务费到账</td>
										   		<td style="width:80px;">服务费开票</td>
										   		<td style="width:120px">入住准备落实</td>
										    </tr>
			    							{{#each this.data.griddata}}
												<tr>
													<td>{{this.card}}</td>
										   			<td>{{this.signDate}}</td>
										   			<td>{{this.cardOwner}}</td>
										   			<td style="background-color:{{this.memberAssessApplyStatus.props.backColor}}; color:{{this.memberAssessApplyStatus.props.color}}">{{this.memberAssessCreator}}</td>
										   			<td style="background-color:{{this.memberAssessGradeStatus.props.backColor}}; color:{{this.memberAssessGradeStatus.props.color}}">{{this.memberAssessGrade}}</td>
										   			<td style="background-color:{{this.memberAssessApproveStatus.props.backColor}};">
										   			{{#each this.memberAssessApprove}}
										   				<span style="color:{{this.approveStatus.props.color}}">{{this.sequence}}.{{this.approver}} / </span>
										   			{{/each}}
										   			</td>
										   			<td style="background-color:{{this.shipContractStatus.props.backColor}}; color:{{this.shipContractStatus.props.color}}">{{this.shipContractUser}}</td>
										   			<td style="background-color:{{this.contractFeeStatus.props.backColor}}; color:{{this.contractFeeStatus.props.color}}">{{this.contractFeeUser}}</td>
										   			<td style="background-color:{{this.contractFeeConfirmStatus.props.backColor}}; color:{{this.contractFeeConfirmStatus.props.color}}">{{this.contractFeeConfirmUser}}</td>
										   			<td style="background-color:{{this.contractFeeInvoiceStatus.props.backColor}}; color:{{this.contractFeeInvoiceStatus.props.color}}">{{this.contractFeeInvoicer}}</td>
										   			<td style="background-color:{{this.signingStatus.props.backColor}}; color:{{this.signingStatus.props.color}}">{{this.signingUser}}</td>
										   			<td style="background-color:{{this.annualFeeStatus.props.backColor}}; color:{{this.annualFeeStatus.props.color}}">{{this.annualFeeUser}}</td>
										   			<td style="background-color:{{this.annualFeeConfirmStatus.props.backColor}}; color:{{this.annualFeeConfirmStatus.props.color}}">{{this.annualFeeConfirmUser}}</td>
										   			<td style="background-color:{{this.annualFeeInvoiceStatus.props.backColor}}; color:{{this.annualFeeInvoiceStatus.props.color}}">{{this.annualFeeInvoicer}}</td>
										   			<td style="background-color:{{this.checkInImplenceStatus.props.backColor}};">
										   				<a href="javascript:void(0);" class="J-checkintrack-ciimplement" data-key="{{this.cIImplement}}" style="color:red">{{this.room}}查看详情</a>
										   			</td>
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