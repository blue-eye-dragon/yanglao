<div class="el-hkmonitor">  
	<div class='J-subnav'></div>
	<div  style="width:65%;float: left;">
		<div class='J-video' style="width:80%;height:770px;margin-left:120px"> 
			<div><h3 class="video-title" style="color: #ffffff;"></h3></div>
			<iframe id='eeee' width=100% height=100% allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' width='100%' height='300px' frameborder='no'></iframe>
		</div>
	</div>
	<div style="width:35%;float: right;">
	  <div class='J-cameralist' style="width:70%;">
	    <div style="text-align:center;height:40px;"><span>摄像头列表</span></div>
		<ul id="carousel_container">
			{{#each this.data}}
				<li style="height:30px;">
					<img src="assets/eling/elcms/hkmonitor/assets/leibiao-shexiang-weixuanzgong.png"/>&nbsp; 
					<a href="javascript:void(0);" style="color: #ffffff;" data-key="{{this.monitor.pkMonitor}}">{{this.monitor.name}}</a>
				</li>
			{{/each}}
		</ul>
		<h5 style="color: #ffffff;">共：{{this.data.size}}个</h5>
	 </div>
	</div>
</div>