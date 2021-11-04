define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var shackstatusmanage = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
 					title:"暂住状态查询",
 					buttons:[{
 						id:"return",
 						text:"返回",
 						show:false,
 						handler:function(){
 							widget.list2Card(false);
 						}
 					 }],
 					 buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					 }],
					 time:{
						 	ranges:{
						 		"本月": [moment().startOf("month"), moment().endOf("month")],
								"三月内": [moment().subtract("month", 3).startOf("days"),moment().endOf("days")],
								"半年内": [moment().subtract("month", 6).startOf("days"),moment().endOf("days")],
								},
							defaultTime:"本月",
	        				click:function(time){
	        					widget.get("list").refresh();
							}
						}
                 }
			};
		},
		initList:function(widget){
			return {
				autoRender : false,
				url:"api/shackapply/query",
    			params:function(){
    				var subnav=widget.get("subnav");
    				var time = subnav.getValue("time");
    				return {
    					"member.memberSigning.room.building":subnav.getValue("building"),
    					StatusIn:["Approval","Postpone"],
    					flowStatus:'Approval',
    					nowDate:time.start,
    					nowDateEnd:time.end,
    					fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name"
    				};
				},
 				model : {
					columns:[{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"date",
						name:"开始日期",
						format:"date"
					},{
						key:"endDate",
						name:"结束日期",
						format:"date"
					},{
						key:"number",
						name:"人数",
					},{
						key:"nexus",
						name:"与"+i18ns.get("sale_ship_owner","会员")+"关系"
					},{
						key:"description",
						name:"备注"
					},{
						key:"status",
						name:"暂住状态",
						format:function(value,row){
							if(!value || value.key == 'Approval'){
								return '暂住';
							}else{
								return value.value;
							}
						}
					},{
						key:"operate",
						name:"操作",
						format:function(value,row){
							if(!row.status || row.status.key == 'Postpone' || row.status.key == 'Approval'){
								return "button";
							}else{
								return "";
							} 
 						},
 						formatparams:[{
 							key:"postpone",
 							text:"延期",
 							handler:function(index,data,rowEL){
 								widget.edit("edit",data);
 								var card=widget.get("card");
 								card.setAttribute("member","readonly","readonly");
 								card.setAttribute("date","disabled","disabled");
 							}
 						},{
 							key:"finish",
 							text:"结束",
 							handler:function(index,data,rowEL){
 								widget.save("api/shackapply/" + data.pkShackApply + "/finish",data);
 							}
 						}]
					}]
 				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					widget.save("api/shackapply/postpone",$("#shackapply").serialize());
            	},
				model:{
					id:"shackapply",
					items:[{
						name:"pkShackApply",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						type:"select",
						url:"api/member/query",
						key:"pkMember",
						value:"personalInfo.name",
						params:function(){
							return {
								"memberSigning.room.building":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name"
							};
						},
						readonly:true,
						validate:["required"]
					},{
						name:"date",
						label:"开始日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"endDate",
						label:"结束日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"number",
						label:"人数",
						readonly:true,
						validate:["required"]
					},{
						name:"nexus",
						label:"与"+i18ns.get("sale_ship_owner","会员")+"关系",
						readonly:true
					},{
						name:"description",
						label:"备注",
						readonly:true
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
				aw.ajax({
					url : "api/shackapply/query",
					type : "POST",
					data : {
						pkShackApply : params.pkFather,
						fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name"
					},
					success : function(result) {
						widget.get("list").setData(result);
					}
				});
			} else {
				//设置setValue打开节点初始值
//				this.get("subnav").setValue("time","0");
				this.get("list").refresh();
			}
    	 }
	});
	module.exports = shackstatusmanage;
});
