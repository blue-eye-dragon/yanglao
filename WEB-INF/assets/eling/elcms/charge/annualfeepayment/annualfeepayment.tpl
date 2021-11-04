<div class='el-annualfeepayment'>
	<div class='J-subnav'></div>
	<div class='J-chargeCycle hidden'></div>
	<div class='J-Grid'></div>
	<div class='J-Form hidden'></div>
	<div class="J-annualfeepayment-print">
		<div class="container">
			<div class="row" style="margin-top: 95px;">
				<h1 class="col-md-12 text-center title">交款通知书</h1>
				<h3 class="col-md-12 text-center title">2015 年 3 月 18 日</h3>
			</div>
			<div class="row">
				<div class="col-md-3"></div>
				<div class="col-md-6">
					<table class="table table-striped" style="border: 0 none;">
						<tr class="row">
							<td class="col-md-6">
								<div class="row">
									<div class="col-md-3 color_white text-right">交款人：</div>
									<div class="col-md-9 text-center">{{this.printData.payer.personalInfo.name}}</div>
								</div>
							</td>
							<td class="col-md-6">
								<div class="row">
									<div class="col-md-3 color_white text-right">房号：</div>
									<div class="col-md-9 text-center">{{this.printData.payer.memberSigning.room.number}}</div>
								</div>
							</td>
						</tr>
						<tr class="row">
							<td class="col-md-6">
								<div class="row">
									<div class="col-md-3 color_white text-right">款项说明：</div>
									<div class="col-md-9 text-center">{{this.printData.beginDateStr}}-{{this.printData.endDateStr}}</div>
								</div>
							</td>
							<td class="col-md-6">
								<div class="row">
									<div class="col-md-3 color_white text-right">会员卡号：</div>
									<div class="col-md-9 text-center">{{this.printData.payer.memberSigning.card.name}}</div>
								</div>
							</td>
						</tr>
						<tr class="row">
							<td class="col-md-12 color_white" colspan="2">
								付款方式：
								<span class="color_white" style="padding-left: 10px;">现金</span>
								<span class="color_white" style="padding-left: 10px;">刷卡</span>
								<span class="color_white" style="padding-left: 10px;">转账</span>
								<span class="color_white" style="padding-left: 10px;">个人本票</span>
								<span class="color_white" style="padding-left: 10px;">支票</span>
							</td>
						</tr>
						<tr class="row">
							<td class="col-md-6">
								<div class="row">
									<div class="col-md-3 color_white text-right">金额（大写）：</div>
									<div class="col-md-9 text-center">{{this.printData.capitalMny}}</div>
								</div>
							</td>
							<td class="col-md-6">
								<div class="row">
									<div class="col-md-3 color_white text-right">金额(阿拉伯)：</div>
									<div class="col-md-9 text-center">￥{{this.printData.realAnnualFees}}</div>
								</div>
							</td>
						</tr>
						<!-- 
							<tr class="row">
								<td class="col-md-12 color_white" colspan="2" height="150px">备注</td>
							</tr>
							<tr class="row">
								<td class="col-md-6 color_white">填表人签字</td>
								<td class="col-md-6 color_white">收款单位签章</td>
							</tr>
							<tr class="row">
								<td class="col-md-12 color_white" colspan="2">交款人签字</td>
							</tr>
						 -->
					</table>
				</div>
				<div class="col-md-3"></div>
			</div>
		</div>
	</div>
</div>