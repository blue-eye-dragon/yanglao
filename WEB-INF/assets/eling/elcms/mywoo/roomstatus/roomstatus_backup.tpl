<div class="el-salestatus">
	<div class="J-subnav"></div>
	<div class="J-salestatus-total-content">
		{{#each this.datas}}
		<div class="container">
			<div class="building text-right">
				<div class="box">
					<a href="javascript:void(0);" class="J-salestatus-building" data-key="{{this.pkBuilding}}">{{this.name}}</a>
				</div>
			</div>
			<div class="room-container">
				{{#each this.items}}
				<div class="room-item"  style="width:10.6%;">
					<div class="box">
						<div class="box-content" style="padding: 0;">
							<div class="box-toolbox">
								<i class="icon {{this.icon}} text-green"></i>
								{{#if this.backToRentTag }}
								<a href="javascript:void(0);" class="J-salestatus-room" data-key="{{this.pkRoom}}">{{this.number}}(回租)</a>
								{{else}}
								<a href="javascript:void(0);" class="J-salestatus-room" data-key="{{this.pkRoom}}">{{this.number}}</a>
								{{/if}}
							</div>
						</div>
					</div>
				</div>
				{{/each}}
			</div>
		</div>
		{{/each}}
	</div>
	<div class="J-salestatus-content container hidden">
		<div class="row">
			<div class="col-xs-12">
				<div class="box">
					<div class="box-header">
						<div class="row">
							<div class="col-sm-12 text-left">
								<span style="font-size: 12px">房间状态:</span>
								<input type="checkbox" data-key="all" class="J-status-check">
								<button class="btn btn-xs J-status-btn">
									全部
								</button>
								{{#each this.status}}
									{{#if this.checked}}
										<input type="checkbox" data-key="{{this.key}}" class="J-status-check J-status-item-check" checked='checked'/>
									{{else}}
										<input type="checkbox" data-key="{{this.key}}" class="J-status-check J-status-item-check"/>
									{{/if}}
								<button class="btn btn-xs J-status-btn">
									<i class="icon {{this.icon}} text-green"></i>
									{{this.value}}
								</button>
								{{/each}}
							</div>
						</div>
					</div>
				</div>
			</div>
   		</div>
		<div class="room-container">
			{{#each this.buildingDatas}}
				<div class="mix room-item {{this.status.key}}" style="width:10.6%;">
					<div class="box" ">
						<div class="box-content" style="padding: 0;">
							<div class="box-toolbox">
								<i class="icon {{this.icon}} text-green"></i>
								{{#if this.backToRentTag }}
								<a href="javascript:void(0);" class="J-salestatus-room" data-key="{{this.pkRoom}}">{{this.number}}(回租)</a>
								{{else}}
								<a href="javascript:void(0);" class="J-salestatus-room" data-key="{{this.pkRoom}}">{{this.number}}</a>
								{{/if}}
							</div>
						</div>
					</div>
				</div>
			{{/each}}
		</div>
	</div>
	<div class="J-salestatus-grid hidden"></div>
</div>
