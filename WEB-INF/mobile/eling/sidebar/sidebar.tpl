<div class="el-mobile-sidebar container hidden" style="left: {{this.left}};">
	<div class="row">
		<div class="col-xs-6 text-left sidebar-tab J-sidebar-reply"><i class="icon-reply"></i></div>
	</div>
	<hr>
	<div class="row">
	{{#each this.members}}
		<div class="col-xs-12 sidebar-panel-item {{this.active}} J-sidebar-panel-item" 
			data-index="{{@index}}" data-name="{{this.personalInfo.name}}" data-key="{{this.pkMember}}">
			<h3>
				<span class="padding-left-10">{{this.personalInfo.name}}</span>
				{{this.memberSigning.room.number}}<i class="padding-left-10 icon-ok"></i>
			</h3>
		</div>
		<hr>
	{{/each}}
	</div>
</div>