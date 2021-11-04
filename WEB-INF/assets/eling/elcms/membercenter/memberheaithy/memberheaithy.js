define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var template=require("./memberheaithy.tpl");
	
	var Healthy = ELView.extend({
		attrs : {
			template : template
		},
		events:{
			"change .J-form-healthInspectionSchemeForm-select-seltime":function(e){
				var utils =this.get("memberhealthy_utils");
				var form=utils.getComponent().healthInspectionSchemeForm;
				var	pk=form.getValue("seltime");
				if(pk){
					aw.ajax({
						url:"api/healthinspectionscheme/queryByPKMember/"+$(".J-member").attr("data-key"),
						data:{
							pkHealthInspectionScheme:pk,
							fetchProperties:"pkHealthInspectionScheme," +
									"version," +
									"member.pkMember," +
									"targetRecord," +
									"sportSuggestion," +
									"lifeRemind," +
									"setDate," +
									"regularService" 
						},
						dataType:"json",
						success:function(data){
							if(data[0]){
								data[0].seltime=data[0].pkHealthInspectionScheme;
								form.setData(data[0]);
							}
						}
					});
				}else{
					form.setValue("pkHealthInspectionScheme","");
					form.setValue("version","");
					form.setValue("targetRecord","");
					form.setValue("sportSuggestion","");
					form.setValue("lifeRemind","");
					form.setValue("regularService","");
				}
			}
		},
		initComponent : function(params,widget) {
			var memberHealthyUtils=require("./memberhealthy_utils");
			memberHealthyUtils.init(widget);
			this.set("memberhealthy_utils",memberHealthyUtils);
			
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"健康数据管理",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/member/search",
							data:{
								s:str,
								"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
								properties:"pkMember,personalInfo.name,memberSigning.room.number",
							    fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.hide([".J-card",".J-return"]).show([".J-list"]);
							}
						});
					},
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							if(params && params.flgs=="healthdata"){
								if(params && params.flgss=="memberhistorty"){
									widget.openView({
										url:"eling/elcms/reports/membercheckinhistoryreport/membercheckinhistoryreport",
									});
							}else{
								widget.openView({
									url:"eling/elcms/membercenter/member/member",
									params:{
//										pkBuilding:subnav.getValue("building"),
//										pkMember:inParams.pkMember,
										pkCard:params.pkCard,
										pkMemberSigning:params.pkMemberSigning,
										pkBuilding:params.pkBuilding,
										pkMember:params.pkMember,
										flg:params.flgss,
									},
								});
								}
						}else{
							widget.get("subnav").setTitle("健康数据管理");
							var pkbuilding=widget.get("subnav").getValue("building");
							widget.get("grid").refresh();
							widget.hide([".J-card",".J-return"]).show([".J-list,.J-building,.J-search"]);
							return false;
						}
						}
					}],
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			//渲染grid
			var grid=new Grid({
				url:"api/member/query",
				params:function(){
					return {
						"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
						"memberSigning.room.building":widget.get("subnav").getValue("building"),
						fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
					};
				},
				model:{
					columns:[{
						key:"personalInfo.name",
						name:"姓名",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("subnav").setTitle("健康数据管理："+data.personalInfo.name);
								$(".J-member").attr("data-key",data.pkMember);
								widget.get("memberhealthy_utils").showEdit();
								widget.get("memberhealthy_utils").showDetail();
								widget.show([".J-card",".J-return"]).hide([".J-list,.J-building,.J-search"]);
							}
						}]
					},{
						key:"memberSigning.room.number",
						name:"房间号"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("subnav").setTitle("健康数据管理："+data.personalInfo.name);
								$(".J-member").attr("data-key",data.pkMember);
								widget.get("memberhealthy_utils").showEdit(widget);
								widget.show([".J-card",".J-return"]).hide([".J-list,.J-building,.J-search"]);
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
		},
		afterInitComponent:function(params,widget){
			if(params && params.pkMember){
				if(params.flg=="deceasedmembers"||params.flg=="memberstatus"
					||params.flg=="member"||params.flgs=="healthdata"){
					widget.get("subnav").setValue("building",params.pkBuilding);
						widget.get("subnav").hide(["building","search","return"]);
				}
				//显示卡片
				widget.show([".J-card"]);
				$(".J-member").attr("data-key",params.pkMember);
				this.get("memberhealthy_utils").showEdit();
				this.get("memberhealthy_utils").showDetail();
				if(params&&params.name&&params.name!=""){
					this.get("subnav").setTitle("健康数据管理："+params.name);
				}
				
			}else{
				//显示列表
				widget.show([".J-list"]);
			}
		}
	});
	module.exports = Healthy;
});
