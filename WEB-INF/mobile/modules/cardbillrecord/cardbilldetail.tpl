<div class="el-cardbillrecord container">
    <div class="row">
        <div class="col-xs-12 text-center">
            <h2 style="font-size: 30px;">一卡通消费记录明细</h2>
        </div>
    </div>
    <hr>
    <div class="row">
		<div class="col-xs-12 text-center detail-label">消费时间 {{this.time}}</div>
	</div>
    <hr>
    <div class="row">
   		<div class="col-xs-4 text-center detail-label">消费类型</div>
		<div class="col-xs-4 text-center detail-label">消费项目</div>
		<div class="col-xs-4 text-center detail-label">金额</div>
	</div>
	<ul class="list-group">
	    {{#each this.datas}}
	    <li class="list-group-item ex-list-group-item" style="height: 80px;">
		    <div class="row" style="margin-top: 15px;">
		    	<div class="col-xs-4 text-center detail-value">{{this.purchaseType}}</div>
				<div class="col-xs-4 text-center detail-value">{{this.purchaseItem}}</div>
				<div class="col-xs-4 text-center detail-value">￥{{this.itemMoney}}</div>
			</div>
		</li>
		{{/each}}
	</ul>
</div>