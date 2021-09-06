<div class="el-notifyshow">
	<div class="J-notifyshow-toggle active">
		<div class="my_carousel" style="overflow: hidden;height: 1920px;">
           	<ul id="carousel_container">
           		{{#each this.data}}
           		<li>
           			<img src="api/attachment/announcementphoto/{{this.pkAnnouncement}}.jpg" style="height: 1920px;width: 100%;"/>
           		</li>
           		<!--
           			 <li>
           			<img src="assets/resources/notify/slide/slider2.jpg" style="height: 1920px;width: 100%;"/>
           		</li>
           		<li>
           			<img src="assets/resources/notify/slide/slider3.jpg" style="height: 1920px;width: 100%;"/>
           		</li>
           		<li>
           			<img src="assets/resources/notify/slide/slider4.jpg" style="height: 1920px;width: 100%;"/>
           		</li>
           		 -->
           		{{/each}}
           	</ul>
        </div>
	</div>
</div>
