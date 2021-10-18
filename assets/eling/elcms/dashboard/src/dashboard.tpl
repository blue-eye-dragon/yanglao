<div class="container el-dashboard">
	<div class="row">
		<div class="col-xs-12">
			<div class='row' style="margin-right: 0px;">
				{{#each this.top.items}}
					<div class='{{../top.columnClass}} J-dashboard-top-item' style="padding-right: 0px;">
						<div class='box-quick-link {{this.color}}-background'>
							<a data-url="{{this.url}}" data-params="{{this.params}}" class="J-dashboard-top-item-{{this.id}}" href="javascript:void(0);">
								<div class='header {{this.color}}-background'>
									<div class='{{this.icon}}'></div>
								</div>
								<div class='content'>{{this.text}}</div>
							</a>
						</div>
					</div>
				{{/each}}
			</div>
        </div>
    </div>
    
    <hr class='hr-drouble' />
    
   	<div class='row'>
   		{{#each this.bottom.groups}}
    	<div class='J-dashboard-bottom-groups'>
    		<div class='box'>
    			<div class='box-header'>
    				<div class='title'>
    					<div class='{{this.icon}}'></div>
    					{{this.title}}
    				</div>
    			</div>
    			<div class='row'>
    				{{#each this.columns}}
    					<div class='J-dashboard-bottom-columns bottomBox'>
    						{{#each this.items}}
    							<div class='J-dashboard-bottom-item J-dashboard-bottom-item-{{this.id}} bottomItem' data-key = {{this.id}} >
    							{{#dashboard_bottom_item this}}
    							{{/dashboard_bottom_item}}
    							</div>
	                        {{/each}}
	                    </div>
    				{{/each}}
                </div>
            </div>
        </div>
        {{/each}}
    </div>
</div>