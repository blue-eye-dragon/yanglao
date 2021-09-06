<div class="J-head box" style="height: 85px;">
	<div class="J-head-title box-header" style="text-align: center;">
  		<div class="title J-title" style="font-weight: bold;color: #924e31;text-align: center;width: 100%;font-size: 30px;padding: 20px;"></div>
  		<div>	
  			<input class="J-fullscreen btn hidden" value="全屏" type="button" style="float: right;">
   			<input class="J-return btn" value="退出" type="button" style="float: right;">
    	</div>
 	</div>
</div>
<div class="container el-notifyshow">
	<div class="J-out"></div>
	<div class="J-inner" style="margin-top: 15px;"></div>
	
	<div class="container J-notifyshow-toggle active">
		<div class="row">
			<div class="col-md-12">
				<div class="my_carousel">
	            	<ul id="carousel_container">
	            		{{#each this.data}}
	            		<li>
	            			<img src="api/attachment/announcementphoto/{{this.pkAnnouncement}}.jpg" style="height: 1000px;width: 100%;"/>
	            		</li>
	            		{{/each}}
	            		<!--
	            			 <li>
	            			<img src="assets/resources/notify/slide/slider2.jpg" style="height: 1000px;width: 100%;"/>
	            		</li>
	            		<li>
	            			<img src="assets/resources/notify/slide/slider3.jpg" style="height: 1000px;width: 100%;"/>
	            		</li>
	            		<li>
	            			<img src="assets/resources/notify/slide/slider4.jpg" style="height: 1000px;width: 100%;"/>
	            		</li>
	            		 -->
	            	</ul>
	            </div>
	        </div>
	    </div>
	</div>
</div>
