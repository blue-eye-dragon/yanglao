{{#each this.datas}}
<li class="list-group-item ex-list-group-item">
	<a href="businesscontactsdetail.html?pkBusinessContacts={{this.pkBusinessContacts}}">
		<div class="row">				
			<div class="col-xs-3 text-left" style="font-size: 13px;margin-top:10px;">{{this.name}}</div>
			<div class="col-xs-5 text-left" style="font-size: 13px;margin-top:5px;">{{this.company}}</div>
			<div class="col-xs-4 text-left" style="font-size: 13px;margin-top:10px;word-break:break-all;">{{this.mobile}}</div>
		</div>
		<div style="clear:both;"></div>
	</a>
</li>
{{/each}}
