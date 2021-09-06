<div class="el-cardbillrecord container">
	<div class="h1 J-showsidebar text-center pull-left sidebaricon">
		<i class="icon-align-justify"></i>
	</div>
	<h2 class="text-center text-primary J-personalInfo-name">{{this.title}}</h2>
	
	<hr/>
    <div class="row">
		<div class="col-xs-4 text-right detail-label nopadding" style="font-size: 25px;">余额</div>
		<div class="col-xs-8 text-right text-center J-billrecord-balance" style="font-size: 25px;">{{this.balance}}</div>
	</div>
	<hr>
</div>
<div class="container margin_top_20">
<!-- 过去一周 -->
	<div class="row header">
		<div class="col-xs-3 text-center">
			<button class="btn btn-primary J-prev-week"><i class="icon-chevron-left"></i></button>
		</div>
		<div class="col-xs-6 text-center">
			<button class="btn btn-primary btn-block">{{this.range}}</button>
		</div>
		<div class="col-xs-3 text-center">
			{{#if this.hasNext}}
			<button class="btn btn-primary J-next-week"><i class="icon-chevron-right"></i></button>
			{{/if}}
		</div>
	</div>
	<ul class="list-group">
		{{#each this.datas}}
		<li class="list-group-item ex-list-group-item" style="height: 80px;">
			<a href="cardbilldetail.html?billNo={{this.billNo}}&&billDate={{billDate}}">
				<div class="radius  text-center" style="width: 50px;height: 50px;float: left;">
					<div style="padding-top: 10px;">
						<div class="icon icon-tags"></div>
					</div>
				</div>
				<div style="display: inline-block;margin-left:10px;text-decoration: none;width: 70%;">
					<div style="font-size: 20px;height: 25px;">
						<span class="text-left">{{this.time}}</span>
					</div>
				</div> 
				<div style="display: inline-block;font-size: 20px;margin-left:10px;margin-top: 10px;">
					<span class="text-left" style="color:#00A2E8">￥{{this.money}}</span>
				</div>
			</a>
	  	</li>
		{{/each}}
	</ul>
</div>
