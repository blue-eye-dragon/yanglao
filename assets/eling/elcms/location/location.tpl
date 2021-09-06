<div class="el-location container">
	<img class="J-picture background hidden">
	
	<div class="tip">
		<i class="icon-map-marker hidden"></i>
		<div class="J-member-detail tipContainer hidden" style="z-index: 1;">
			<div class="J-personalInfo"></div>
			<div class="J-member-trail-container" style="overflow-x: hidden;overflow-y: auto;height: 178px;">
				<div class="J-member-trail-date row">
					<h4 class="text-center col-md-3 J-prev prev"><i class="icon icon-chevron-left"></i></h4>
					<h4 class="text-center col-md-6 J-trail-date">{{this.date}}</h4>
					{{#if this.hasNext}}
					<h4 class="text-center col-md-3 J-next next"><i class="icon icon-chevron-right"></i></h4>
					{{/if}}
				</div>
				<div class="J-member-trail row"></div>
			</div>
		</div>
		<div class="tipContainer hidden" style="background: black;opacity: 0.5;"></div>
	</div>
	
	<div class="el-location-queryPanel hidden" style="width:550px;position: fixed;right: -40px;height: 100%;overflow: auto;z-index: 2;">
		<div class="J-subnav"></div>
		<div class="J-list container" style="margin-top: -10px;">
			<div class="row todo-list">
				<div class="col-sm-12">
					<div class="box">
						<div class="box-content box-no-padding" style="border: 0 none;">
							<div class="sortable-container container">
								<ul class="J-members list-unstyled sortable ui-sortable row" 
									data-sortable-axis="y" data-sortable-connect=".sortable">
								</ul>
               				</div>
               			</div>
               		</div>
               	</div>
           	</div>
		</div>
   	</div>
   	
   	<div class="J-right-sidebar-container">
		<div style="width : 40px;height:100%;background :#fbfbfb;position : absolute;right : 0;" class="J-right-sidebar"></div>
		<i class="icon-double-angle-left" style=" position: absolute;right: 0px;top: 10%;font-size: 60px;color: rgb(188, 232, 241);"></i>
   	</div>
</div>