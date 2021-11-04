<div class="el-mobile-report-apartmentsalescontrol container">
	<div class="row header">
		<div class="col-xs-2 text-center J-condition">
			<button class="btn btn-primary"><i class="icon-list"></i></button>
		</div>
		<div class="col-xs-9 text-center">
			<div class="text-center search-container">
				<input placeholder="请输入房间号" class="J-room-search"/>
				<i class="icon-search J-search"></i>
			</div>
		</div>
	</div>
	<div class="row content">
		<div class="col-xs-12 nopadding">
			<ul class="list-group J-apartmentsalescontrol"></ul>
		</div>
	</div>
	<div class="J-sidebar hidden">
		<div class="row margin_top_20">
			<div class="col-xs-3 text-center">
				<button class="btn btn-primary J-return-btn"><i class="icon-reply"></i></button>
			</div>
			<div class="col-xs-6 text-center">
				<button class="btn btn-primary btn-block">查询条件</button>
			</div>
		</div>
		<hr>
		<div class="row">
			<div class="col-xs-12" style="color: #00acec;">楼宇</div>
		</div>
		<div class="row">
			<div class="col-xs-12 J-buildings"></div>
		</div>
		<hr>
		
		<div class="row">
			<div class="col-xs-12" style="color: #00acec;">状态</div>
		</div>
		<div class="row">
			<div class="col-xs-12 J-status">
				{{#each this.status}}
				<div class="col-xs-4" style="padding: 5px 5px 0 5px;">
					<button class="btn btn-primary btn-block nopadding J-condition-item active" data-key="{{this.key}}" style="padding: 10px;">{{this.value}}</button>
				</div>
				{{/each}}
			</div>
		</div>
		<hr>
		
		<div class="row">
			<div class="col-xs-12" style="color: #00acec;">房型</div>
		</div>
		<div class="row">
			<div class="col-xs-12 J-roomtype"></div>
		</div>
	</div>
</div>