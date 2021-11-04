<div class="el-businesscontactsdetail container" style="margin:15px;">
	<div class="row">
		<div class="col-xs-4 text-center" style="margin-top:15px;"><img src="api/attachment/businesscontactsphoto/{{pkBusinessContacts}}" style="width:98%" /></div>
		<div class="col-xs-8">
			<div class="text-left">
				<p style="font-size:22px;"><strong>{{this.name}}</strong></p>
				<p style="font-size:18px;">{{this.job}}{{#if this.job}}{{#if this.title}} | {{/if}}{{/if}}{{this.title}}</p>
				<p style="font-size:18px;">{{this.company}}</p>
				<p style="font-size:18px;">{{this.mobile}}</p>				
				<p style="font-size:18px;">{{this.email}}</p>
			</div>
		</div>
	</div>
	<div style="clear:both;"></div>
	<hr/>
	<div class="row" style="font-size:18px;">
		{{#if this.department}}
			<div class="col-xs-3 text-right detail-label nopadding"><strong>移动电话:</strong></div>
			<div class="col-xs-9 text-left">{{this.department}}</div>
			<div style="clear:both;"></div>
		{{/if}}
		{{#if this.address}}
			<div class="col-xs-3 text-right detail-label nopadding"><strong>邮政地址:</strong></div>
			<div class="col-xs-9 text-left">{{this.address}}</div>
		{{/if}}
		{{#if this.zipCode}}
			<div class="col-xs-3 text-right detail-label nopadding"><strong>邮政编码:</strong></div>
			<div class="col-xs-9 text-left">{{this.zipCode}}</div>
			<div style="clear:both;"></div>
		{{/if}}
		{{#if this.telephone}}
			<div class="col-xs-3 text-right detail-label nopadding"><strong>电话:</strong></div>
			<div class="col-xs-9 text-left">{{this.telephone}}</div>
			<div style="clear:both;"></div>
		{{/if}}
		{{#if this.electrograph}}
			<div class="col-xs-3 text-right detail-label nopadding"><strong>传真:</strong></div>
			<div class="col-xs-9 text-left">{{this.electrograph}}</div>
			<div style="clear:both;"></div>
		{{/if}}
		{{#if this.code}}
			<div class="col-xs-3 text-right detail-label nopadding"><strong>统一编码:</strong></div>
			<div class="col-xs-9 text-left">{{this.code}}</div>
			<div style="clear:both;"></div>
		{{/if}}
		{{#if this.otherphone}}
			<div class="col-xs-3 text-right detail-label nopadding"><strong>其他电话:</strong></div>
			<div class="col-xs-9 text-left">{{this.otherphone}}</div>
			<div style="clear:both;"></div>
		{{/if}}
		{{#if this.otherphone}}
			<div class="col-xs-3 text-right detail-label nopadding"><strong>呼机:</strong></div>
			<div class="col-xs-9 text-left">{{this.teleCall}}</div>
			<div style="clear:both;"></div>
		{{/if}}
		{{#if this.other}}
			<div class="col-xs-3 text-right detail-label nopadding"><strong>单位其他:</strong></div>
			<div class="col-xs-9 text-left">{{this.other}}</div>
			<div style="clear:both;"></div>
		{{/if}}
		{{#if this.mainpage}}
			<div class="col-xs-3 text-right detail-label nopadding"><strong>主页:</strong></div>
			<div class="col-xs-9 text-left">{{this.mainpage}}</div>
			<div style="clear:both;"></div>
		{{/if}}
	</div>
	<div style="clear:both;"></div>
	<hr/>
	<div class="row">
		<div class="col-xs-3 text-right detail-label nopadding"><strong>备注:</strong></div>
		<div class="col-xs-9 text-left">{{this.description}}</div>
	</div>
</div>