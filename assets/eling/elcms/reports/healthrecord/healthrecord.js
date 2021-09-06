define(function(require, exports, module) {
	var BaseView=require("baseview");
	//多语
	var i18ns = require("i18n");
	var Interest = BaseView.extend({
		initSubnav:function(widget){
			var inParams = this.get("params");
			var buttonGroups=[]; 
			if (null == inParams || null == inParams.name) {
				buttonGroups.push({
					id:"building",
					showAll:true,
					handler:function(key,element){
						widget.get("subnav").load({
							id : "defaultMembers",
							params : {
								"memberSigning.room.building" : key,
								"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
								"memberSigning.status":"Normal",
        					    "memberSigning.houseingNotIn":false,
								fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number,status",
							},
							callback:function(data){
								widget.get("list").refresh();
							}
							});
					}
				},{
					id:"defaultMembers",
					showAll:true,
					showAllFirst:true,
					handler:function(key,element){
						widget.get("list").refresh();
					}
				},{
					id:"type",
					showAll:true,
					showAllFirst:true,
					tip:i18ns.get("sale_ship_owner","会员")+"类型",
					items:[{
	                    key:"0",
	                    value:"高龄"
					},{
	                    key:"1",
	                    value:"独居"
					}],
					handler:function(key,element){
						widget.get("list").refresh();
					}
				}); 
			}
			buttonGroups.push({
				id:"recordtype",
				tip:"日志类型",
				showAll:true,
				showAllFirst:true,
				items:[{
                    key:"0",
                    value:"日常记录"
				},{
                    key:"1",
                    value:"疾病史"
				},{
					key:"7",
					value:"复诊记录"
				},{
                    key:"2",
                    value:"住院记录"
				},{
                    key:"3",
                    value:"巡检记录"
				},{
					key:"4",
					value:"过敏史"
				},{
					key:"5",
					value:"就诊记录"
				},{
					key:"6",
					value:"用药记录"
				}],
				handler:function(key,element){
					widget.get("list").refresh();
				}
			});
			return {
				model:{
					title:"健康日志查询"+((inParams && inParams.name)?(":"+widget.get("params").name):""),
					time:{
					 	ranges:{
					        "昨天": [moment().subtract("days", 1).startOf("days"),moment().subtract("days", 1).endOf("days")],
					        "今天": [moment().startOf("days"),moment().endOf("days")],
					 		"本月": [moment().startOf("month"), moment().endOf("month")],
							"最近一年": [moment().subtract(11, 'month').startOf('month'),moment().endOf('month')],
							},
						defaultTime:"最近一年",
        				click:function(time){
        					widget.get("list").refresh();
						}
					},
//					search : function(str) {
//						var inParams=widget.get("params");
//						var member = inParams.name?inParams.name.split(" "):"";
//						var g=widget.get("list");
//						g.loading();
//						aw.ajax({
//							url:"api/healthrecord/search",
//							data:{
//								number:((member)?member[0]:""),
//								name:((member)?member[1]:""),
//								s:str,
//								"flg":inParams.flg?inParams.flg:null
//							},
//							dataType:"json",
//							success:function(data){
//								g.setData(data);
//								
//							}
//						});
//					},
					buttonGroup:buttonGroups,
					buttons:[{
 						id:"toexcel",
 						text:"导出",
 						handler:function(){ 
 							var subnav=widget.get("subnav");
 							var time=subnav.getValue("time");
 							var inParams = widget.get("params");
 							var pkMember=(inParams && inParams.name)?(widget.get("params").pkMember):subnav.getValue("defaultMembers");
 							var flg=(inParams && inParams.name)?(inParams.flg):"";
 							if (null == inParams || null == inParams.name) {
 								window.open("api/healthrecord/toexcel?pkBuilding="
 										+subnav.getValue("building")+
 										"&start="+subnav.getValue("time").start+
 										"&end="+subnav.getValue("time").end+
 										"&recordtype="+subnav.getValue("recordtype")+
 										"&pkMember="+pkMember+
 										"&type="+subnav.getValue("type")+
 										"&flg="+flg);
 								return false;
 							}else{
 								var build="";
 								var type="";
 								 window.open("api/healthrecord/toexcel?pkBuilding="
 										+build+
 										"&start="+subnav.getValue("time").start+
 										"&end="+subnav.getValue("time").end+
 										"&recordtype="+subnav.getValue("recordtype")+
 										"&pkMember="+pkMember+
 										"&type="+type+
 										"&flg="+flg);
 							}
 	 					}				
 					}],
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/report/healthrecord",
				autoRender : false,
				params : function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					var inParams=widget.get("params");
					var pkMember=(inParams && inParams.name)?(inParams.pkMember):subnav.getValue("defaultMembers");
					var flg=(inParams && inParams.name)?(inParams.flg):"";
					if (null == inParams || null == inParams.name) {
						return {
							start: time.start,
					    	end:   time.end,
							pkBuilding:subnav.getValue("building"),
							pkMember:pkMember,
							recordtype:subnav.getValue("recordtype"),
							type:subnav.getValue("type"),
							flg:flg
						};
					}else{
						return {
							start: time.start,
					    	end:   time.end,
//					    	pkBuilding:inParams.pkBuilding,
							pkMember:pkMember,
							recordtype:subnav.getValue("recordtype"),
							flg:flg
						};
					}
				},
				model:{
					columns:[{
						col:2,
						key:"date",
						name:"业务时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						col:1,
						key:"number",
						name:"房间号"
					},{
						col:1,
						key:"name",
						name:i18ns.get("sale_ship_owner","会员")+"姓名"
					},{
						col:1,
						key:"type",
						name:"类型"
					},{
						col:5,
						key:"description",
						name:"描述"
					},{
						col:1,
						key:"recorder",
						name:"记录人"
					},{
						col:1,
						key:"recordDate",
						name:"记录时间",
						format:"date",
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			if(!widget.get("params")){
				widget.get("subnav").load({
					id : "defaultMembers",
					params : {
						"memberSigning.room.building" : widget.get("subnav").getValue("building"),
						"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
						"memberSigning.status":"Normal",
					    "memberSigning.houseingNotIn":false,
						fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number,status",
					},
					callback:function(data){
						widget.get("list").refresh();
					}
					});
			}else{
				widget.get("list").refresh();
			}
		}
	});
	module.exports = Interest;
});