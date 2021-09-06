<div class="el-mobile-report-died fixed">
	<div class="container fixed-content without-title">
		<div class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-heading text-center">{{this.month}}</div>
					<ul class="list-group">
						{{#each this.details}}
						<li class='list-group-item ex-list-group-item'>
							<div class="row">
								<div class="col-xs-6">
									{{#if this.isMale}}<i class="icon-male"></i>{{else}}<i class="icon-female"></i>{{/if}}
									<span>{{this.member.personalInfo.name}}</span>
								</div>
								<div class="col-xs-6">
									<i class="icon-building"></i>
									<span>{{this.member.memberSigning.room.number}}</span>
								</div>
								<div class="col-xs-12 text-left">{{this.dateStr}}过世</div>
								<div class="col-xs-12 text-left">享年{{this.age}}岁</div>
							</div>
						</li>
						{{/each}}
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>