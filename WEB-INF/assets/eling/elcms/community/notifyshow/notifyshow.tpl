<div class="J-head box" style="height: 85px;">
	<div class="J-head-title box-header" style="text-align: center;">
  		<div class="title J-title" style="font-weight: bold;color: #924e31;text-align: center;width: 100%;font-size: 30px;padding: 20px;" data-key="1">大  堂
  			<input class="J-fullscreen btn hidden" value="全屏" type="button" style="float: right;">
   			<input class="J-return btn" value="退出" type="button" style="float: right;">
    	</div>
 	</div>
</div>
<div class="container el-notifyshow">
	<div class="J-out"></div>
	<div class="J-inner" style="margin-top: 15px;"></div>
	
	<div class="container J-notify-container">
		<div class="row" style="height: 1000px;position: relative;font-size: 50px;">
			<div class="col-md-12">
				<img src="api/attachment/background/notifyhalf" style="width: 100%;height: 1030px;"/>
				{{#each this.notifies}}
				{{#if this.show}}
				<div class="notifydetail active">
				{{else}}
				<div class="notifydetail hidden">
				{{/if}}
					<div style="position: absolute;top: 260px;color: #924e31;margin-left: 2%;height: 600px;">
						<pre class="active" style="font-size: 50px;font-weight: bold;color: #924e31;background: none;border:0 none;margin-left: 40px;">{{this.content}}</pre>
					</div>
				</div>
				{{/each}}
			</div>
		</div>
	</div>
</div>


