<div class="container el-roommonitor">
	<div class="row">
		<div class="col-xs-12">
			<h1 class="text-center">总览 <small class="J-locationlog-title">{{this.date}}</small></h1>
		</div>
	</div>
	<div class="row margin_top_20">
		<div class="col-sm-12">
			<div class="row panel"> 
				<div class="col-xs-12">
					<div class="row">
						<div class="col-xs-2"></div>
						<div class="col-xs-9 coordinate">
							{{#each this.coordinate}}
								<div class="col-xs-2 coordinate_item" style="left: {{this.left}};">
									<span style="">{{this.text}}</span>
								</div>
							{{/each}}
						</div>
					</div>
					<div class="margin_top_20">
						{{#each this.rows}}
						<div class="row">
							<div class="col-xs-2">
								<span class="icon icon-{{this.icon}}" aria-hidden="true" style="color:{{this.color}};"></span>
							</div>
							<div class="col-xs-9 rows">
								<hr/>
								{{#each this.datas}}
									<div class="line" style="width: {{this.width}};background: {{../this.color}};left:{{this.left}};"></div>
								{{/each}}
							</div>
						</div>
						{{/each}}
					</div>
				</div>
			</div>
			<div class="row text-center">
       			<h1 class="col-xs-12" style="margin: 0;">生活规律正常</h1>
       		</div>
			<div class="row text-center margin_top_20">
       			<div class="col-xs-6">
       				<a href="#" class="btn btn-danger btn-lg btn-block J-prev">前一天</a>
       			</div>
       			<div class="col-xs-6">
       				{{#if this.hasNext}}
       				<a href="#" class="btn btn-danger btn-lg btn-block J-next">后一天</a>
       				{{else}}
       				<a href="#" class="btn btn-default btn-lg btn-block J-next">后一天</a>
       				{{/if}}
       			</div>
       		</div>
        </div>
    </div>
</div>