/**
 * 会员日志统计表
 */
define(function(require,exports,module){
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");

	var template=require("./memberJournal.tpl");
	
	var MemberJournal=ELView.extend({
		attrs : {
			template : template,
			model : {}
		},
		events : {
			"click .J-detail" : function(e){
				var pkBuilding = $(e.currentTarget).attr("pkBuilding");
				var month = $(e.currentTarget).attr("month");
				var flag = $(e.currentTarget).attr("flag");
				var year = this.get("subnav").getValue("year");
				var url;
				if(flag=="life"){
					url = "eling/elcms/reports/memberJournal/assest/liferecorddetail";
				}
				if(flag=="community"){
					url = "eling/elcms/reports/memberJournal/assest/familycommdetail";
				}
				if(flag=="health"){
					url = "eling/elcms/reports/memberJournal/assest/healthrecorddetail";
				}
				this.openView({
					url:url,
					params:{
						year:year,
						month:month,
						pkBuilding:pkBuilding
					},
					isAllowBack:true
				});
			}
		},
		initComponent : function(params,widget) {
			var model=this.get("model");
			var items=[];
			for(var i=0;i<=moment().format("YYYY")-2007;i++){
				var obj={};
				obj.key=parseInt(moment().format("YYYY"))-parseInt(i);
				obj.value=parseInt(moment().format("YYYY"))-parseInt(i);
				items.push(obj);
			}
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会员日志统计表",
					buttonGroup:[{
						id:"year",
						items:items,	
						handler:function(key,element){
							aw.ajax({
								url : "api/report/memberjournal",
								type : "POST",
								data : {
									year:key
								},
								dataType:"json",
								success:function(data){
									model.data=data;
									widget.renderPartial(".J-grid-table");
								}
							});
						}
					}],
					buttons:[{
 						id:"toexcel",
 						text:"导出",
 						handler:function(){ 
						window.open("api/report/memberjournal/toexcel?year="+widget.get("subnav").getValue("year"));
 							return false;
 	 					}				
 					}]
				}
			});
			
			this.set("subnav",subnav);
		},
		setEpitaph:function(){
			var subnav=this.get("subnav");
			return {
				year:subnav.getValue("year"),
			};
		},
		afterInitComponent:function(params,widget){
			if(params && params.year){
				widget.get("subnav").setValue("year",params.year);
			}
			var model=widget.get("model");
			aw.ajax({
				url : "api/report/memberjournal",
				type : "POST",
				data : {
					year:params&&params.year?params.year:widget.get("subnav").getValue("year")
				},
				dataType:"json",
				success:function(data){
					model.data=data;
					widget.renderPartial(".J-grid-table");
				}
			});
		}
	});
	
	module.exports=MemberJournal;
});