<div class='container el-panel'>
	<div class="row">
		{{#if this.img.show}}
		<div class='col-lg-2'>
			<div class='box'>
				<div class='box-content'>
					<img class="J-panel-img img-responsive"/>
				</div>
			</div>
		</div>
		{{/if}}
		{{#if this.img.show}}
			<div class='col-lg-10'>
		{{else}}
			<div class='col-lg-12'>
		{{/if}}
		<div class="box">
			<div class="box-content">
				<div class="J-panel-content">
					<div class="el-panel-row">
					{{#each this.items}}
						{{#if this.n}}
							</div>
							<div class="el-panel-row">
								<div style="width: {{this.colWidth}};" class="item">
									<label style="width:{{this.labelWidth}};">{{this.label}}：</label>
									<span style="width:{{this.valueWidth}};" class="J-panel-{{this.id}}">{{this.value}}</span>
								</div>
						{{else}}
								<div style="width: {{this.colWidth}};" class="item">
									<label style="width:{{this.labelWidth}};">{{this.label}}：</label>
									<span style="width:{{this.valueWidth}};" class="J-panel-{{this.id}}">{{this.value}}</span>
								</div>
						{{/if}}
					{{/each}}
					</div>
                </div>
              </div>
            </div>
          </div>
        </div>
</div>
                      	