<div class="el-health-status">
	<div class="J-subnav"></div>
	<div class="J-mixitup-container container">
		<div class="row">
			<div class="col-xs-12">
				<div class="box">
					<div class="box-header">
						<div class="row">
							<div class="col-sm-12 text-left">
								<span style="font-size: 12px">健康:</span>
								<button class="filter btn btn-xs" data-filter="all">全部</button>
								<button class="filter btn btn-xs btn-danger" data-filter=".health-1-level">一级</button>
								<button class="filter btn btn-xs btn-warning" data-filter=".health-2-level">二级</button>
								<button class="filter btn btn-xs btn-success" data-filter=".health-3-level">三级</button>
							</div>
						</div>
					</div>
					<div class="box-content">
						<div class="row">
							<div id="mycontainer" class="container J-mixitup-content">
								{{#each this.datas}}
									<div class="col-lg-12">
										{{#each this.items}}
											<div class="mix health-{{this.nurseLevel}}-level J-healthdata-item" 
												data-key="{{this.member.pkMember}}" style="width: 12%;">
												<div class="box background-{{this.nurseLevel}}">
													<div class="box-header">
														<a class="title" href="javascript:void(0);">
															<strong>
																{{this.member.memberSigning.room.number}} {{this.member.personalInfo.name}}
															</strong>
														</a>
													</div>
												</div>
											</div>
										{{/each}}
									</div>
									<div style="clear: both;height: 15px;"></div>
								{{/each}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>	
</div>
