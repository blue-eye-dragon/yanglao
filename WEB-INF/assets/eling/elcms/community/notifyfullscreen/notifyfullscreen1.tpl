<div class="el-notifyshow-fullscreen">
	<div style="position: relative;font-size: 50px;">
	    <div class="J-notify-container">
			<div style="height: 1920px;position: relative;font-size: 50px;">
				<img src="api/attachment/background/notifyfull" style="width: 100%;height: 1920px;"/>
				{{#each this.notifies}}
				{{#if this.show}}
				<div class="notifydetail active">
				{{else}}
				<div class="notifydetail hidden">
				{{/if}}
					<div style="height:1000px;position: absolute;top: 530px;color: #924e31;width: 78%;margin: 100px 11% 0 11%;text-indent: 100px;">
						<span>{{this.content}}</span>
					</div>
					<div class="notify-foot" style="text-indent: 100px;position: absolute;bottom: 100px;color: #924e31;width: 78%;margin-left: 5%;">{{this.inscribe}}</div>
				</div>
				{{/each}}
			</div>
		</div>
	</div>
</div>