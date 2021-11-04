<div class="el-care-record">
    <div class="J-subnav">
    </div>
	<div class="J-record-grid"></div>
	<div class="J-record-add">
            <div class="care-record-step">
             <h2>1,请选择需要护理的人员</h2>
                <div class="J-select-user">
                           {{#each this.cardownerList}}
                           <div class="J-user-item">{{this.name}}</div>
                           {{/each}}
                 </div>
             </div>
             <div class="care-record-step">
                <h2>2,请选择护理时间</h2>
                <div id="choose-care-record-date">&nbsp;</div>
              </div>
              <div class="care-record-step">
                   <h2>3,请选择护理项目</h2>
                   <div class="J-select-care-content">
                    {{#each this.careItems}}
                       <div class="J-care-item">{{this.name}}</div>
                    {{/each}}
                    </div>
              </div>
              <button type="button" class="btn btn-block btn-danger btn-save-care-record">保存</button>
        </div>
</div>
