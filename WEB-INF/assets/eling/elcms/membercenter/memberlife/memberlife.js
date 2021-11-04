define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var aw=require("ajaxwrapper");

	var template=require("./memberlife.tpl");
	var Life = ELView.extend({
		attrs:{
			template:template
		},
		initComponent : function(params,widget) {
			var memberlift_edit=require("./memberlife_edit");
			memberlift_edit.init();
			this.set("memberlife_edit",memberlift_edit);
			
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"生活数据管理",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/member/search",
							data:{
								s:str,
								"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
								properties:"personalInfo.name," +
										"memberSigning.room.number",
								fetchProperties:"pkMember," +
										"personalInfo.name," +
										"memberSigning.room.number"
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
							if(params && params.flgs=="lifedata"){
								if(params && params.flgss=="memberhistorty"){
										widget.openView({
											url:"eling/elcms/reports/membercheckinhistoryreport/membercheckinhistoryreport",
										});
								
							}else{
								widget.openView({
									url:"eling/elcms/membercenter/member/member",
									params:{
										pkBuilding:params.pkBuilding,
										pkMember:params.pkMember,
										flg:params.flgss,
									},
								});
								}
						}else{
							widget.get("subnav").setTitle("生活数据管理");
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
					}
					]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				url:"api/member/query",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
						"memberSigning.room.building":subnav.getValue("building"),
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
								widget.get("subnav").setTitle("生活数据管理："+data.personalInfo.name);
								$(".J-member").attr("data-key",data.pkMember);
								widget.get("memberlife_edit").showEdit("details");
								widget.get("memberlife_edit").showDetail();
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
								widget.get("subnav").setTitle("生活数据管理："+data.personalInfo.name);
								$(".J-member").attr("data-key",data.pkMember);
								widget.get("memberlife_edit").showEdit("revise");
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
					||params.flg=="member"||params.flgs=="lifedata"){
					widget.get("subnav").hide(["building","search","return"]);
				}
				//显示卡片
				widget.show(".J-card");
				$(".J-member").attr("data-key",params.pkMember);
				this.get("memberlife_edit").showEdit();
				this.get("memberlife_edit").showDetail();
				if(params&&params.name&&params.name!=""){
					this.get("subnav").setTitle("生活数据管理："+params.name);
				}
				
			}else{
				//显示列表
				$(".J-list").removeClass("hidden");
			}
		}
	});
	module.exports = Life;
});
