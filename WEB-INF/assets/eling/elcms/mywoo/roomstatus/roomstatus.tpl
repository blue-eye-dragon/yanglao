<div class="el-salestatus">
	<div class="J-subnav"></div>
	<div class="J-salestatus-total-content">
		{{#each this.datas}}
		<div class="container">
			<div class="building">
					<h2>{{this.name}}</h2>
			</div>
			<div class="level-container">
				{{#each this.levels}}
				    <div class="level-item">
				        <div class="level">
				            <h3>{{this.level}}</h3>
				        </div>
				        <div class="room-container">
				            {{#each this.rooms}}
				                <div class="room-item">
                                    <div class="room">
                                    <i class="icon {{this.icon}} text-green"></i>
                                    <b>{{this.number}}</b>
                                    </div>
                                    <div class="bed-container">
                                        {{#each this.beds}}
                                            {{#if this.tgt }}
                                            <div class="J-bed-item bed-occupy " data-id="{{this.id}}" data-tgt="{{this.tgt}}">{{this.code}}</div>
                                            {{else}}
                                             <div class="J-bed-item  bed" data-id="{{this.id}}" data-tgt="{{this.tgt}}">{{this.code}}</div>
                                            {{/if}}
                                        {{/each}}
                                    </div>
                                </div>
				            {{/each}}
				        </div>
				    </div>
				{{/each}}
			</div>
		</div>
		{{/each}}
	</div>
	<div class="J-salestatus-grid hidden"></div>
	<div class="J-salestatus-bindPeronToBed hidden">
	    <div class="J-salestatus-bindPeronToBed-cardOwnerGrid"></div>
	    <div class="J-salestatus-bindPeronToBed-form"></div>
	</div>
	<div class="J-salestatus-unBindPeronToBed hidden"></div>
</div>
