<div class="J-subnav"></div>
<div class="el-notifyshow-fullscreen">
	<div style="position: relative;font-size: 50px;">
	    <div class="J-notify-container">
			<div class="" style="height: 1920px;position: relative;">
				<img src="api/attachment/background/notifyfull" style="width: 100%;height: 1920px;"/>
				<div style="font-size: 50px;">
					{{#each this.notifies}}
						{{#if this.show}}
						<div class="notifydetail active">
						{{else}}
						<div class="notifydetail hidden">
						{{/if}}
							<div style="height:1000px;position: absolute;top: 530px;color: #924e31;margin-left: 2%;">
								<pre style="background: none;border: 0 none;padding: 0;font-size: 50px;color: #924e31;margin-left: 40px;">{{this.content}}</pre>
							</div>
						</div>
					{{/each}}
				</div>
			</div>
		</div>
	    
	    <div class="fullscreen-btn">
	    	<div class="clearfix" style="display:inline-block;vertical-align: middle;">
	    		<input class="J-fullscreen btn hidden" value="全屏" type="button">
	    		<input class="J-return btn" value="退出" type="button">
			</div>
	    </div>
	</div>
</div>