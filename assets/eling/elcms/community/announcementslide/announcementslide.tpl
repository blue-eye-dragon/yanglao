<div class="container el-notifyshow">
	<div class="J-out"></div>
	<div class="J-inner" style="margin-top: 15px;"></div>
	
	<div class="container J-notify-container">
		<div class="row" style="height: 1000px;position: relative;font-size: 50px;">
			<div class="col-md-12">
				{{#each this.notifies}}
				{{#if this.show}}
					<div class="notifydetail active" style="position:relative;left: {{this.left}}px;">
				{{else}}
					<div class="notifydetail hidden" style="position:relative;left: {{this.left}}px;">
				{{/if}}
						<img src="api/attachment/announcementphoto/{{this.pkAnnouncement}}" style="width: 100%;height: 1030px;"/>
						<div style="position: absolute;top: 260px;color: #924e31;margin-left: 2%;height: 600px;">
							<pre class="active" style="font-size: 50px;font-weight: bold;color: #924e31;background: none;border:0 none;margin-left: 40px;">{{this.content}}</pre>
						</div>
					</div>
				{{/each}}
			</div>
		</div>
	</div>
</div>


