<div class="container">
	<div class="row margin_top_20">
		<div class="col-xs-12"><button class="btn btn-primary btn-block">{{this.personalInfo.name}}</button></div>
	</div>
	<div class="row margin_top_20">
		<div class='col-xs-5 text-right'>
			<img src="api/attachment/personalphoto/{{this.personalInfo.pkPersonalInfo}}" width="99" height="132">
		</div>
		<div class="col-xs-1 text-center nopadding" style="color: #00A2E8;">
			<div><i class="icon-{{this.sexClass}}"></i></div>
			<div><i class="icon-building"></i></div>
			<div><i class="icon-tablet"></i></div>
			<div><i class="icon-phone"></i></div>
			<div><i class="icon-home"></i></div>
		</div>
		<div class="col-xs-6 text-left" style="color: #00A2E8;">
			<div>{{this.age}}岁</div>
			<div>{{this.memberSigning.room.number}}</div>
			<div>{{this.personalInfo.mobilePhone}}</div>
			<div>{{this.personalInfo.phone}}</div>
			<div>{{this.personalInfo.nativePlace.fullName}}</div>
		</div>
	</div>
	<div class="row margin_top_20">
		<div class="col-xs-12">
			<div class="panel panel-default">
				<div class="panel-heading text-center">其他信息</div>
				<ul class="list-group" style="margin-bottom: 0;">
					<li class='list-group-item ex-list-group-item' style="position: relative;">
						<div class="row">
							<div class="col-xs-6 text-center">入住日期</div>
							<div class="col-xs-6 text-left">{{this.checkInDateStr}}</div>
						</div>
					</li>
					<li class='list-group-item ex-list-group-item' style="position: relative;">
						<div class="row">
							<div class="col-xs-6 text-center">会籍卡费</div>
					<div class="col-xs-6 text-left">￥{{this.memberSigning.card.cardType.cardTypeMoney}}</div>
						</div>
					</li>
					<li class='list-group-item ex-list-group-item' style="position: relative;">
						<div class="row">
							<div class="col-xs-6 text-center">会员年费</div>
							<div class="col-xs-6 text-left">￥{{this.memberSigning.annualFee}}</div>
						</div>
					</li>
					<li class='list-group-item ex-list-group-item' style="position: relative;">
						<div class="row">
							<div class="col-xs-6 text-center">会员状态</div>
							<div class="col-xs-6 text-left">{{this.status.value}}</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>