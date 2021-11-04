<div class="container el-memberstatus">
	<div class="J-subnav"></div>
	<div class="J-dashboard"></div>
	<div class="row">
		<div class="col-md-3 J-memberinfo">
			<img class="img-responsive J-member-picture" style="width: 50%;margin: 0 25%;"/>
			<div class="panel panel-default">
				<div class="panel-heading">
					<a class="accordion-toggle" href="#collapseOne-accordion">
						<strong>{{this.data.personalInfo.name}}</strong>
					</a>
				</div>
				<div class="panel-collapse collapse in" id="collapseOne-accordion">
					<div class="panel-body">
						<ul class="list-unstyled container">
							<li class="row">
								<span class="col-md-7 text_right">会员年龄：</span>
								<span class="col-md-5 text_left">{{this.data.age}}</span>
							</li>
							<li class="row">
								<span class="col-md-7 text_right">会员性别：</span>
								<span class="col-md-5 text_left">{{this.data.sexName}}</span>
							</li>
							<li class="row">
								<span class="col-md-7 text_right">会员房间：</span>
								<span class="col-md-5 text_left">{{this.data.memberSigning.room.number}}</span>
							</li>
							<li class="row">
								<span class="col-md-7 text_right">房间电话：</span>
								<span class="col-md-5 text_left">{{this.data.memberSigning.room.telnumber}}</span>
							</li>
							<li class="row">
								<span class="col-md-7 text_right">会员电话：</span>
								<span class="col-md-5 text_left">{{this.data.phone}}</span>
							</li>
							<li class="row">
								<span class="col-md-7 text_right">会员手机：</span>
								<span class="col-md-5 text_left">{{this.data.mobilePhone}}</span>
							</li>
							<li class="row">
								<span class="col-md-7 text_right">入住日期：</span>
								<span class="col-md-5 text_left">{{this.data.memberSigning.checkInDate}}</span>
							</li>
							{{#each this.data.emPersons}}
							<li class="row">
								<span class="col-md-7 text_right">联系人{{this.index}}：</span>
								<div class="col-md-5 text_left">
									<div>{{this.emPerson.personalInfo.name}}</div>
								</div>
							</li>
							<li class="row">
								<span class="col-md-7 text_right">联系人{{this.index}}电话：</span>
								<div class="col-md-5 text_left">
									<div>{{this.emPerson.personalInfo.phone}}</div>
								</div>
							</li>
							<li class="row">
								<span class="col-md-7 text_right">联系人{{this.index}}手机：</span>
								<div class="col-md-5 text_left">
									<div>{{this.emPerson.personalInfo.mobilePhone}}</div>
								</div>
							</li>
							{{/each}}
						</ul>
		                <div>
		                    <a class="btn btn-primary base_life_heal_hpy_btn J-member-lifemodel" href="javascript:void(0);">生活模型</a>
		                	<a class="btn btn-primary base_life_heal_hpy_btn J-member-baseinfo" href="javascript:void(0);">基本信息</a>
		                	<a class="btn btn-primary base_life_heal_hpy_btn J-member-modeldata" href="javascript:void(0);">模型数据</a>
		                	<a class="btn btn-primary base_life_heal_hpy_btn J-member-lifeinfo" href="javascript:void(0);">生活数据</a>
		                	<a class="btn btn-primary base_life_heal_hpy_btn J-member-healinfo" href="javascript:void(0);">健康数据</a>
		                	<a class="btn btn-primary base_life_heal_hpy_btn J-member-hapyinfo" href="javascript:void(0);">快乐数据</a>
		                	<a class="btn btn-primary base_life_heal_hpy_btn J-member-activityinfo" href="javascript:void(0);">会员活动统计</a>
		                </div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-9">
			<div class="col-md-12">
				<div class="col-md-12 box">
					<div class="box-header">
						<div class="title">生活日志</div>
						<div class="pull-right" style="margin-right: 5%;">
		       				<div class="clearfix">
		        				<input class="btn J-lifelog-detail" style="color:white;background: #f34541;" value="详情" type="button">
							</div>
    					</div>
					</div>
					<div class="box-content">
						<div id="stats-chart1" style="height: 200px;"></div>
					</div>
				</div>
			</div>
			<div class="col-md-12">
				<div class="col-md-12 box">
					<div class="box-header">
						<div class="title">健康日志</div>
						<div class="pull-right" style="margin-right: 5%;">
		       				<div class="clearfix">
		        				<input class="btn J-healthlog-detail" style="color:white;background: #f34541;" value="详情" type="button">
							</div>
    					</div>
					</div>
					<div class="box-content">
						<div id="stats-chart2" style="height: 200px;"></div>
					</div>
				</div>
			</div>
			<div class="col-md-12">
				<div class="col-md-12 box">
					<div class="box-header">
						<div class="title">活动参加</div>
						<div class="pull-right" style="margin-right: 5%;">
		       				<div class="clearfix">
		        				<input class="btn J-activity-detail" style="color:white;background: #f34541;" value="详情" type="button">
							</div>
    					</div>
					</div>
					<div class="box-content">
						<div id="stats-chart3" style="height: 200px;"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="J-member-data"></div>
</div>