<div class="el-apartment-status">
	<div class="J-subnav"></div>
	<div class="J-mixitup-container container">
		<div class="row">
			<div class="col-xs-12">
				<div class="box">
					<div class="box-header">
						<div class="row">
							<div class="col-sm-6 text-left">
								<span style="font-size: 12px">会员状态:</span>
								<button class="filter btn btn-xs" data-filter="all">全部</button>
								{{#each this.memberstatus}}
									<button class="filter btn btn-xs" data-filter=".{{this.key}}memberstatus">
										<i class="{{this.icon}} text-green"style="font-size:16px;padding-right:2px;"></i>
										{{this.text}}
									</button>
								{{/each}}
							</div>
							<div class="col-sm-6 text-left">
								<span style="font-size: 12px">公寓状态:</span>
								<button class="filter btn btn-xs" data-filter="all">全部</button>
								{{#each this.roomstatus}}
									<button class="filter btn btn-xs" data-filter=".{{this.key}}status">
										<i class="{{this.icon}} text-green"style="font-size:16px;padding-right:2px;"></i>
										{{this.text}}
									</button>
								{{/each}}
							</div>
						</div>
					</div>
					<div class="box-content">
						<div class="row">
							<div class="col-sm-12">
								<div class="row">
									<div id="mycontainer" class="container J-mixitup-content">
										{{#each this.items}}
										<div class="mix {{this.room.status.key}}status" data-key="{{this.room.pkRoom}}" style="width:{{../this.width}};">
											{{#if this.show}}
											<div class="box box-nomargin box-no-padding">
											{{else}}
											<div class="box box-nomargin box-no-padding hidden">
											{{/if}}
												<div class="box-header box-header-small box-no-padding">
													<div class="title">
														<div class="row">
															<div class="col-md-12">
																{{#if this.isEmpty}}
																	<i class="icon-lock text-green" style="font-size: 15px !important;margin-top: 2px;"></i>
																{{else}}
																	{{#if this.isWaitting}}	
																	<i class="icon-signin text-green" style="font-size: 15px !important;margin-top: 2px;"></i>
																	{{else}}
																		{{#if this.isInUse}}
																			<i class="icon-user text-green" style="font-size: 15px !important;margin-top: 2px;"></i>
																		{{else}}
																			{{#if this.isNotLive}}
																			<i class="icon-building text-green" style="font-size: 15px !important;margin-top: 2px;"></i>
																			{{else}}
																				{{#if this.isOutRoomMaintenance}}
																				<i class="icon-gears text-green" style="font-size: 15px !important;margin-top: 2px;"></i>
																				{{else}}
																					{{#if this.Appoint}}
																					<i class="icon-pushpin text-green" style="font-size: 15px !important;margin-top: 2px;"></i>
																					{{else}}
																					<i class="icon-ban-circle text-green" style="font-size: 15px !important;margin-top: 2px;"></i>
																					{{/if}}
																				{{/if}}
																			{{/if}}
																		{{/if}}
																	{{/if}}
																{{/if}}	
																{{#if this.isAlone}}
																	<i class="icon-asterisk text-green" style="font-size: 15px !important;margin-top: 2px;"></i>
																{{/if}}
																<span style="height: 20px;text-align: left;">{{this.room.number}}</span>	
															</div>
														</div>
														{{#each this.members}}
														<div class="row J-pkMember" data-key="{{this.pkMember}}">
															<div class="col-md-12">
																<div style="height: 20px;text-align: left;color:{{this.sexColor}};">
																	{{#if this.died}}
																	<a href="javascript:void(0);" style="border:2px solid black;color:{{this.sexColor}};" class="J-member">{{this.name}}</a>
																	{{else}}
																		{{#if this.checkout}}
																		<a href="javascript:void(0);" style="border:2px solid black;color:{{this.sexColor}};display:none;" class="J-member">{{this.name}}</a>
																		{{else}}
																		<a href="javascript:void(0);" style="color:{{this.sexColor}};" class="J-member">{{this.name}}</a>
																		{{#if this.advancedAge}}
																			<i class="icon-heart" style="font-size: 0.5em !important;padding-top: 4px;"></i>
																		{{/if}}
																		{{#if this.isBirthDay}}
																			<i class="icon-gift" style="font-size: 0.5em !important;padding-top: 4px;"></i>
																		{{/if}}
																		{{#if this.concern}}
																			<i class="icon-star" style="font-size: 0.5em !important;padding-top: 4px;"></i>
																		{{/if}}
																		{{#if this.nursingHome}}
																			<i class="icon-medkit" style="font-size: 0.5em !important;padding-top: 4px;"></i>
																		{{/if}}
																		{{#if this.hospital}}
																			<i class="icon-hospital" style="font-size: 0.5em !important;padding-top: 4px;"></i>
																		{{/if}}
																		{{#if this.nursingHome_hospital}}
																			<i class="icon-stethoscope" style="font-size: 0.5em !important;padding-top: 4px;"></i>
																		{{/if}}
																		{{#if this.goOut}}
																			<i class="icon-plane" style="font-size: 0.5em !important;padding-top: 4px;"></i>
																		{{/if}}
																		{{/if}}
																	
																		
																	{{/if}}
																</div>
															</div>
														</div>
														{{/each}}
													</div>
												</div>
												<div class="box-content box-nomargin orange-background">
													<div class="box-toolbox box-toolbox-top">
														<div class="pull-right">
															<a href="javascript:void(0);" class="icon J-wrench">修</a>
															<a href="javascript:void(0);" class="icon J-group">暂</a>
															<a href="javascript:void(0);" class="icon J-rocket">陪</a> 
														</div>
													</div>
												</div>
											</div>
										</div>
										{{/each}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
   </div>
</div>