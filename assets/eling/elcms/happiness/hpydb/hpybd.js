/***
 * 快乐基数数据
 */
define(function(require, exports, module) {
	var template=require("./hpybd.tpl");
	var aw=require("ajaxwrapper");
	var Subnav=require("subnav-1.0.0");
	var Grid=require("grid-1.0.0");
	var hpyUtils=require("./hpybd_utils");

	var Hpybd = require("elview").extend({
		attrs : {
			template : template
		},
		initComponent : function(params,widget) {
			var subnav = new Subnav({
				parentNode : ".J-subnav",
				model : {
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							if(params && params.flgs=="happydata"){

								if(params && params.flgss=="memberhistorty"){
									widget.openView({
										url:"eling/elcms/reports/membercheckinhistoryreport/membercheckinhistoryreport",
									});
							}else{
								widget.openView({
									url:"eling/elcms/membercenter/member/member",
								});
								}
						
						}else{
							widget.get("subnav").setTitle("快乐数据管理");
							$(".J-list,.J-building,.J-search").removeClass("hidden");
							$(".J-card,.J-return").addClass("hidden");
							return false;
						}
						}
					}],
					title : "快乐数据管理",
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
								fetchProperties:"*," +
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
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			hpyUtils.init();
			this.set("hpyUtils",hpyUtils);
			
			var params=this.get("params") || {};
			if(params && params.pkMember){
				if(params.flg=="deceasedmembers"||params.flg=="memberstatus"
					||params.flg=="member"||params.flgs=="happydata"){
					widget.get("subnav").setValue("building",params.pkBuilding);
					widget.get("subnav").hide(["building","search","return"]);
				}
				//显示卡片
				if(params.name && params.nam!=""){
					this.get("subnav").setTitle("快乐数据管理："+params.name);
				}
				$(".J-member").attr("data-key",params.pkMember);
				aw.ajax({
					url:"api/member/" + params.pkMember + "/happiness/datas",
					success:function(data){
						widget.get("hpyUtils").setData(data);
						widget.get("hpyUtils").showDetail();
						$(".J-card").removeClass("hidden");
					}
				});
			}else{
				//显示列表
				$(".J-list").removeClass("hidden");
			}
			
			var grid = new Grid({
				parentNode : ".J-list",
				url:"api/member/query",
				params:function(){
					return {
						"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
						fetchProperties:"*,personalInfo.name,memberSigning.room.number",
						"memberSigning.room.building":widget.get("subnav").getValue("building")
					};
				},
				model : {
					columns:[{
						key : "personalInfo.name",
						name : "姓名",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("subnav").setTitle("快乐数据管理："+data.personalInfo.name);
								//1将会员主键设置到J-pkMember，方便后续获取
								$(".J-member").attr("data-key",data.pkMember);
								//2.根据主键查询会员的快乐数据，然后通过hpyUtils设置到对应的组件中去
								aw.ajax({
									url:"api/member/" + data.pkMember + "/happiness/datas",
									success:function(data){
										$(".J-list,.J-building,.J-search").addClass("hidden");
										$(".J-card,.J-return").removeClass("hidden");
										widget.get("hpyUtils").setData(data);
										widget.get("hpyUtils").showDetail();
									}
								});
								return false;
							}
						}]
					},{
						key:"memberSigning.room.number",
						name : "房号"
					},{
						key : "operate",
						name : "操作",
						format : "button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("subnav").setTitle("快乐数据管理："+data.personalInfo.name);
//								//1将会员主键设置到J-pkMember，方便后续获取
								$(".J-member").attr("data-key",data.pkMember);
								//2.根据主键查询会员的快乐数据，然后通过hpyUtils设置到对应的组件中去
								aw.ajax({
									url:"api/member/" + data.pkMember + "/happiness/datas",
									success:function(data){
										$(".J-list,.J-building,.J-search").addClass("hidden");
										$(".J-card,.J-return").removeClass("hidden");
										widget.get("hpyUtils").setData(data);
										widget.get("hpyUtils").showEdit();
									}
								});
								return false;
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
		},
		setEpitaph:function(){
			var subnav=this.get("subnav");
			var inParams = this.get("params");
			if(inParams){
				return {
					pkBuilding:subnav.getValue("building"),
					pkMember:inParams.pkMember,
					pkCard:inParams.pkCard,
					pkMemberSigning:inParams.pkMemberSigning,
					flg:"memberhappy",
					flgs:inParams.flg,
				};
			}
		},
		destry:function(){
			this.get("subnav").destroy();
			this.get("grid").destroy();
			this.get("hpyUtils").destroy();
		}
	});

	module.exports = Hpybd;
});
