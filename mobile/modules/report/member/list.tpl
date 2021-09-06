<div class="el-mobile-report-member">
	<div style="height: 72px;background: white;z-index: 100;position: fixed;width: 100%;">
		<div class="text-center" 
			style="border-radius: 25px;border: 1px solid rgb(194, 174, 174);width: 90%;margin: 20px 5%;">
				<input placeholder="房间/姓名" style="width: 90%;border: 0 none;" class="J-member-search"/>
				<i class="icon-search" style="position: absolute;right: 10%;top:25px;"></i>
		</div>
	</div>
	<div class="container">
		<div class="row" style="margin-top: 72px;">
			<div class="col-xs-12">
				<div class="todo-list">
					<ul class="list-unstyled text-primary">
						{{#each this.datas}}
						<li class='item {{this.sexClass}}' style="position: relative;">
							<a href="#member/detail/{{this.pkMember}}" style="color: inherit;">
								<div class="row">
									<div class="col-xs-6">
										{{#if this.isMale}}
										<i class="icon-male"></i>
										{{else}}
										<i class="icon-female"></i>
										{{/if}}
										<span>{{this.personalInfo.name}}</span>
									</div>
									<div class="col-xs-6">
										<i class="icon-building"></i>
										<span>{{this.memberSigning.room.number}}</span>
									</div>
								</div>
							</a>
						</li>
						{{/each}}
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>