<div class="el-mobile-report-salemonthreport container">
	<div class="row margin_top_20">
		<div class="col-xs-2 text-center">
			<button class="btn btn-primary J-prev"><i class="icon-chevron-left"></i></button>
		</div>
		<div class="col-xs-8 text-center">
			<button class="btn btn-primary btn-block">{{this.date}}</button>
		</div>
		{{#if this.hasNext}}
		<div class="col-xs-2 text-center">
			<button class="btn btn-primary J-next"><i class="icon-chevron-right"></i></button>
		</div>
		{{/if}}
	</div>
	<div class="row dashboard margin_top_20">
		<!-- 会籍预约 -->
		<div class="col-xs-12 margin_top_10">
			<div class="radius red-background text-center">
				<div class="header icon J-deposit-num">0</div>
				<div class="content">会籍预约</div>
			</div>
		</div>
		
		<!-- 会籍定金 -->
		<div class="col-xs-12 margin_top_10">
			<div class="radius orange-background text-center">
				<div class="header icon J-deposit-mny">0</div>
				<div class="content">预约金额</div>
			</div>
		</div>
		
		<!-- 会籍签约 -->
		<div class="col-xs-12 margin_top_10">
			<div class="radius green-background text-center">
				<div class="header icon J-contract-num">0</div>
				<div class="content">会籍签约</div>
			</div>
		</div>
		
		<!-- 会籍卡费 -->
		<div class="col-xs-12 margin_top_10">
			<div class="radius blue-background text-center">
				<div class="header icon J-contract-mny">0</div>
				<div class="content">会籍卡费</div>
			</div>
		</div>
	</div>
</div>
