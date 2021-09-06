define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var columns=[{
		key:"member.memberSigning.room.number",
		name:"房间号"
	},{
		key:"member.personalInfo.name",
		name:"姓名"
	},{
		key:"serviceCategory.name",
		name:"服务分类"
	}];
	
	var SC_service={
		init:function(widget,params){
			return new Grid({
				parentNode:".J-member-service",
				url:"api/agentapply/query",
				params:function(){
					return {
						"memberSigning.room.building":widget.get("subnav").getValue("building"),
						createDate:params.startdate,
						createDateEnd:params.enddate,
						fetchProperties:"member.memberSigning.room.number,member.personalInfo.name,serviceCategory.name"
					};
				},
				model:{
					head:{
						title:"代办服务记录"
					},
					columns:columns
				}
			});
		},
		initPrint:function(widget,params){
			return new Grid({
				autoRender:false,
				isInitPageBar:false,
				parentNode:".J-member-service-print",
				model:{
					head:{
						title:"代办服务记录"
					},
					columns:columns
				}
			});
		}
	};
	
	module.exports=SC_service;
});