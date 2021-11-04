<div class="el-shiftchange">
	<div class="J-pkShiftChange"></div>
	<div class="J-pkNightShiftChange"></div>
	<div class="J-version"></div>
	<div class="J-startWorkDate"></div>
	<div class="J-startWorkDate"></div>
	<div class="J-subnav"></div>
	<div class="J-shiftchange-title"></div>
	<div class="J-shiftchange-start">
	<label class="J-shiftchange-startWorkDatelabel" style="margin-bottom:10px;">接班时间：</label><span class="J-shiftchange-startWorkDate"></span>
	<label class="J-shiftchange-startWorkUserlabel">接班人：</label><span class="J-shiftchange-startWorkUser"></span>
	</div>
	<div class="J-shiftchange-finish">
	<label class="J-shiftchange-finishWorkDatelabel">交班时间：</label><span class="J-shiftchange-finishWorkDate"></span>
	<label class="J-shiftchange-finishWorkUserlabel">交班人：</label><span class="J-shiftchange-finishWorkUser"></span>
	</div>
	<!-- 
	<div class="J-startWorkDate">接班时间：<font class="J-shiftchange-startWorkDate"></font></div>
	<div class="J-startWorkUser">接班人：<font class="J-shiftchange-startWorkUser"></font></div>
	<div class="J-finishWorkDate">交班时间：<font class="J-shiftchange-finishWorkDate"></font></div>
	<div class="J-finishWorkUser">交班人:<font class="J-shiftchange-finishWorkUser"></font></div>
	 -->
	<div class="J-panel" style="margin-bottom:10px;"></div>
	<div class="J-member-npanel"></div>
	<div class="J-member-npanel-print"></div>
	<div class="J-member-log"></div>
	<div class="J-member-log-print"></div>
	<div class="J-remark-detail">
		<div class="container">
			<div class="row">
				<div class="col-sm-12">
					<div class="box">
						<div class="box-header">周知事宜</div>
						<div class="">
							<div class="form-group textarea">
        						<textarea class="J-matters large"></textarea>
        						<div class="J-matters-print large"></div>
       						</div>
        				</div>
        			</div>
        		</div>
    		</div>
		</div>
	</div>
{{#if this.isDay}}
	<div class="J-handover">
		<div class="container">
			<div class="row">
				<div class="col-sm-12">
					<div class="box">
						<div class="J-night">
							<div class="box-header">交接班事宜（夜班）</div>
							<div class="">
								<div class="form-group textarea">
        							<textarea class="J-nightShiftAttention small"></textarea>
        							<div class="J-nightShiftAttention-print small"></div>
       							</div>
        					</div>
        				</div>
        			</div>
        	
        			<div class="box">
        				<div class="J-day">
							<div class="box-header">交接班事宜（次日班）</div>
							<div class="">
								<div class="form-group textarea">
        							<textarea class="J-dayShiftAttention small"></textarea>
        							<div class="J-dayShiftAttention-print small"></div>
       							</div>
        					</div>
        				</div>
        			</div>
        		</div>
    		</div>
		</div>
	</div>
{{else}}
	<div class="J-others">
		<div class="container">
			<div class="row">
				<div class="col-sm-12">
					<div class="box">
						<div class="box-header">其他</div>
						<div class="">
							<div class="form-group textarea">
        						<textarea class="J-nightOthers small"></textarea>
        						<div class="J-nightOthers-print small"></div>
       						</div>
        				</div>
        			</div>
        		</div>
    		</div>
		</div>
	</div>
{{/if}}	
	<div class="J-materialtransfer">
		<div class="container">
			<div class="row">
				<div class="col-sm-12">
					<div class="box">
						<div class="box-header">物资交接</div>
						<div class="">
							<div class="form-group textarea">
        						<textarea class="J-exchangeGoods small"></textarea>
        						<div class="J-exchangeGoods-print small"></div>
       						</div>
        				</div>
        			</div>
        		</div>
    		</div>
		</div>
	</div>
	<div class="J-member-nsatt"></div>
	<div class="J-member-nsatt-print"></div>
	<div class="J-member-interview"></div>
	<div class="J-member-interview-print"></div>
	<div class="J-member-service"></div>
	<div class="J-member-service-print"></div>
	<div class="J-member-visit"></div>
	<div class="J-member-visit-print"></div>
	<div class="J-member-activity"></div>
	<div class="J-member-activity-print"></div>
	<div class="J-repair"></div>
	<div class="J-repair-print"></div>
	<div class="J-routing" ></div>
	<div class="J-routing-print" ></div>
	<div class="J-goout" style="margin-bottom:50px;"></div>
	<div class="J-goout-print" style="margin-bottom:50px;"></div>
	
</div>