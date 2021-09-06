define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var liferecord = BaseView.extend({
		initSubnav:function(widget){
			var inParams = this.get("params");
			var buttonGroups=[]; 
			if (null == inParams || null == inParams.name) {
				buttonGroups.push({
					id:"building",
					showAll:true,
					handler:function(key,element){
						widget.get("list").refresh();
					}
				},{
					id:"type",
					tip:"会员类型",
					showAll:true,
					showAllFirst:true,
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
                    value:"生活记录"
				},{
                    key:"1",
                    value:"外出记录"
				},{
                    key:"2",
                    value:"来访记录"
				},{
                    key:"3",
                    value:"暂住记录"
				},{
					key:"4",
					value:"家属沟通"
				}],
				handler:function(key,element){
					widget.get("list").refresh();
				}
			});
			return {
				model:{
					title:"生活日志查询"+((inParams && inParams.name)?(":"+widget.get("params").name):""),
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
					search : function(str) {
						var inParams=widget.get("params");
						var member = inParams.name?inParams.name.split(" "):"";
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/liferecord/search",
							data:{
								number:((member)?member[0]:""),
								name:((member)?member[1]:""),
								s:str,
								"flg":inParams.flg?inParams.flg:null
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								
							}
						});
					},
					buttonGroup:buttonGroups,
					buttons:[{
 						id:"toexcel",
 						text:"导出",
 						handler:function(){ 
 							var subnav=widget.get("subnav");
 							var time=subnav.getValue("time");
 							var inParams = widget.get("params");
 							var pkMember=(inParams && inParams.name)?(widget.get("params").pkMember):"";
 							if (null == inParams || null == inParams.name) {
 								var flg="";
 								window.open("api/liferecord/toexcel?pkBuilding="
 										+subnav.getValue("building")+
 										"&start="+subnav.getValue("time").start+
 										"&end="+subnav.getValue("time").end+
 										"&pkMember="+pkMember+
 										"&recordtype="+subnav.getValue("recordtype")+
 										"&type="+subnav.getValue("type")+
 										"&flg="+flg);
 								return false;
 							}else{
 								var build="";
 								var type="";
 								 window.open("api/liferecord/toexcel?pkBuilding="
 										+build+"&type="+type+
 										"&start="+subnav.getValue("time").start+
 										"&end="+subnav.getValue("time").end+
 										"&pkMember="+pkMember+
 										"&recordtype="+subnav.getValue("recordtype")+
 										"&flg="+inParams.flg);
 							}
 	 					}				
 					}],
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/report/liferecord",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					var inParams = widget.get("params");
					var pkMember=(inParams && inParams.name)?(widget.get("params").pkMember):"";
					if (null == inParams || null == inParams.name) {
						return {
							start:time.start,
							end:time.end,
							pkBuilding:subnav.getValue("building"),
							pkMember:pkMember,
							recordtype:subnav.getValue("recordtype"),
							type:subnav.getValue("type")
						};
					}else{
						return {
							start:time.start, 
							end:time.end,
							pkMember:pkMember,
							flg:inParams.flg,
							recordtype:subnav.getValue("recordtype")
						};
					}
				},
				autoRender:true,
				model:{
					columns:[{
						col:1,
						key:"date",
						name:"业务时间",
						format:"date"
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
						name:"类别"
					},{
						col:6,
						key:"description",
						name:"记录内容"
					},{
						col:1,
						key:"recorder",
						name:"记录人"
					},{
						col:1,
						key:"recordDate",
						name:"记录时间",
						format:"date"
					}]
				}
			};
		},
		
	});
	module.exports = liferecord;
});