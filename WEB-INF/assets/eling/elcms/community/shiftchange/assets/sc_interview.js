define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var columns=[{
		key:"member.memberSigning.room.number",
		name:"房号"
	},{
		key:"member.personalInfo.name",
		name:"姓名"
	},{
		key:"type.value",
		name:"事件类型"
	},{
		key:"isFinish",
		name:"是否完成",
		format:function(row,value){
			if(value.finishDate){
				return "已完成";
			}else{
				return "未完成";
			}
			
		}
		
	}];
	
	var SC_interview={
		init:function(widget,params){
			return new Grid({
				parentNode:".J-member-interview",
				url:"api/action/queryByCond",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						typeIn:["AdvancedAge","LivingAlone"],
						building:subnav.getValue("building"),
						date:params.startdate,
						dateEnd:params.enddate-1000,
						fetchProperties:"finishDate,member.memberSigning.room.number,member.personalInfo.name,type"
					};
				},
				model:{
					head:{
						title:"会员走访记录"
					},
					columns:columns
				}
			});
		},
		initPrint:function(widget,params){
			return new Grid({
				autoRender:false,
				isInitPageBar:false,
				parentNode:".J-member-interview-print",
				model:{
					head:{
						title:"会员走访记录"
					},
					columns:columns
				}
			});
			
		}
	};
	
	module.exports=SC_interview;
});