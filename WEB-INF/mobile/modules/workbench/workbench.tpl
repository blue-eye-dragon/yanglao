<div class="el-dashboard dashboard container">
	<div class="row">
		<div class="col-xs-12">
			<div class="box">
				<div class="box-header">
					<div class="title">{{this.title}}</div>
				</div>
				<div class="row">
					{{#each this.items}}
						{{#if this.show}}
							<div class="col-xs-{{../../this.colspan}} J-{{this.id}}">
								<div class="box-content box-statistic">
									<h3 class="title" style="color:{{this.color}};">{{this.value}}</h3>
									<small>{{this.text}}</small>
									<div class="{{this.icon}} align-right" style="color: {{this.color}};"></div>
								</div>
							</div>
						{{/if}}
					{{/each}}
				</div>
			</div>
		</div>
	</div>
</div>