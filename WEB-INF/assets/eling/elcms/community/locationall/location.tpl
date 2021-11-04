<div class="el-locationall">
	<img class="J-picture background">
	<div class="J-panel">
		<table>
			<tr>
				<td align="left"><div class="icon-male" style="color: #FF8800;"></div> 正常:</td>
				<td class="J-panel-right-td" align="right">{{data.Normal}}</td>
			</tr>
			<tr>
				<td align="left"><div class="icon-male" style="color: #A500CC;"></div> 疑似外出:</td>
				<td class="J-panel-right-td" align="right">{{data.Out}}</td>
			</tr>
			<tr>
				<td align="left"><div class="icon-male" style="color:red; "></div> 24h未移动:</td>
				<td class="J-panel-right-td" align="right">{{data.Danger}}</td>
			</tr>
		</table>
	</div>
	<div class="J-monitor">
		<h4 style="color: white;">摄像头列表</h4>
		<div class="J-monitor-li">
			{{#each this.monitor}}
			<li class="J-monitor-li-monitor"><img class="J-monitor-li-monitor-img-{{this.monitor.pkMonitor}}" src="assets/eling/elcms/community/locationall/assets/leibiao-shexiang-weixuanzgong.png" /><a href='javascript:void(0);' data-pkMonitor='{{this.monitor.pkMonitor}}' style="color: white">{{this.monitor.name}}</a> </li>
			{{/each}}
		</div>
		<h5 style="color: white;">共：{{this.monitor.size}}条记录</h5>
	</div>
	
	<div class="emergencyHelp-panel">
		<div class="emergencyHelp-info"> 
			<img class="emergencyHelp-info-phote" src="api/attachment/personalphoto/{{this.member.pkPersonalInfo}}">
			<div class="emergencyHelp-info-detail">
				{{this.member.name}} &nbsp;{{this.member.room}}
				<img src="assets/eling/elcms/community/locationall/assets/dianhua.png"> {{this.member.phone}}
				<br>
				<img src="assets/eling/elcms/community/locationall/assets/jjbj-shexiang.png">
				{{this.monitor.name}}
			</div>
			<img class="emergencyHelp-info-guanbi" src="assets/eling/elcms/community/locationall/assets/guanbi.png">
		</div>
		<hr class="hr-normal">
		<div class="emergencyHelp-monitor">
		</div>
	</div>
</div>