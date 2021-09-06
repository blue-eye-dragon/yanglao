<div class="el-capitaldaily">
	<div class="J-subnav"></div>
	<div class="J-grid"></div>
	<div class="container J-detail hidden">
	 	<div class='row'>
			<div class='col-xs-12'>
				<div class='row'>
					<div class='col-sm-12'>
						<div class='box' style='margin-bottom:0;'>
							<div class='box-content box-no-padding'>
									<div class="J-company" style="display: inline-block;margin-left: 20px;font-size: 18px">{{this.data.company}}</div >
									<div class="J-date" style="display: inline-block;margin-left: 400px;font-size: 18px">{{this.data.datestr}}</div>
									<div class="J-money" style="display: inline-block;margin-left: 420px;font-size: 18px">{{this.data.money}}</div>
									<table class="data-table-column-filter table table-bordered table-striped" style='border:0 none;margin-bottom:0;'>
										<tbody class="J-detail-table" style="text-align:center;">
											<tr>
												<td colspan="2" rowspan="2" style="padding-top: 25px">摘要</td>
												<td colspan="2" rowspan="2" style="padding-top: 25px">上日余额</td>
												<td colspan="2">本日收入</td>
												<td colspan="2" >本日支出</td>
												<td colspan="2" rowspan="2" style="padding-top: 25px">本日余额</td>
												<td colspan="2" rowspan="2" style="padding-top: 25px">可用资金余额</td>
											</tr>
											
											<tr>
												<td>金额</td>
												<td>主要内容</td>
												<td>金额</td>
												<td>主要内容</td>
											</tr>
											
											
											<tr>
								                <td colspan="2" >现金</td>
												<td colspan="2" >{{this.data.cash.yesterdayBalance}}</td>
												<td >{{this.data.cash.todayInMoney}}</td>
												<td >{{this.data.cash.todayInContext}}</td>
								                <td >{{this.data.cash.todayOutMoney}}</td>
												<td >{{this.data.cash.todayOutContext}}</td>
												<td colspan="2" >{{this.data.cash.todayBalance }}</td>
												<td colspan="2" >{{this.data.cash.availableFund}}</td>
											</tr>
											
											<tr>
								                <td colspan="2" >银行存款（账面）</td>
												<td colspan="2" >{{this.data.bank.yesterdayBalance}}</td>
												<td >{{this.data.bank.todayInMoney}}</td>
												<td >{{this.data.bank.todayInContext}}</td>
								                <td >{{this.data.bank.todayOutMoney}}</td>
												<td >{{this.data.bank.todayOutContext}}</td>
												<td colspan="2" >{{this.data.bank.todayBalance }}</td>
												<td colspan="2" >{{this.data.bank.availableFund}}</td>
											</tr>
											
											<tr>
								                <td colspan="2" ><strong>合计</strong></td>
												<td colspan="2" >{{this.data.all.yesterdayBalance}}</td>
												<td >{{this.data.all.todayInMoney}}</td>
												<td >{{this.data.all.todayInContext}}</td>
								                <td >{{this.data.all.todayOutMoney}}</td>
												<td >{{this.data.all.todayOutContext}}</td>
												<td colspan="2" >{{this.data.all.todayBalance }}</td>
												<td colspan="2" >{{this.data.all.availableFund}}</td>
											</tr>
										</tbody>
									</table>
							</div>	
						</div>			
					</div>				
				</div>
			</div>
		</div>
	</div>
</div>