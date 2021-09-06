define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var columns=[{
			key:"building.name",
				name:"楼号"
			},{
			key:"nightShiftAttention",
			name:"夜班注意事项"
		}];
	var NSC_nsatt={
		init:function(widget,params){
			return new Grid({
				parentNode:".J-member-nsatt",
				url:"api/shiftchange/query",
				params:function(){
					var timeStart,timeEnd;
					if(moment().isSame(params.startdate,"days")){
							timeStart=params.startdate+12*60*60*1000;
							timeEnd=params.enddate;
					}else{
						timeStart=params.startdate-12*60*60*1000;
						timeEnd=params.startdate;
					}	
					return {
						FinishWorkDate:timeStart,
						FinishWorkDateEnd:timeEnd,
					};
				},
				fetchProperties:"nightShiftAttention,building.name",
				model:{
					head:{
						title:"夜班注意事项汇总"
					},
					columns:columns
				}
			});
		},
		initPrint:function(widget,params){
			return new Grid({
				autoRender:false,
				isInitPageBar:false,
				parentNode:".J-member-nsatt-print",
				model:{
					head:{
						title:"夜班注意事项汇总"
					},
					columns:columns
				}
			});
		}
	};
	
	
	module.exports=NSC_nsatt;
});