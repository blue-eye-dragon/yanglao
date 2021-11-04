/**
 * 会员基本信息节点
 * forward:{
 * 	search:向外部提供search功能，某节点跳转到会员节点后，如果想要调用会员的search，则要求在该节点openView时，传递search:{{搜索关键字}}作为搜索参数，
 *	accompany:向外部提供accompany功能，某节点跳转到会员节点后，如果想要跳转至陪主人页面，则要求在该节点openView时，传递accompany:{{pkAccompany}}作为搜索参数， 
 * }
 */

define(function(require, exports, module) {
	var ELView=require("elview");
	//多语
	var i18ns = require("i18n");
	//eling ui component
	var Subnav = require("subnav-1.0.0");
	var Dialog=require("dialog");
	
	//eling utils component
	var aw=require("ajaxwrapper");
	
	//eling elcms
	var Properties=require("./properties");
	require("./member.css");
	var template=require("./member.tpl");
	
	//backbone collections
	var MemberSigningCollection=require("./assets/membersigning/membersigning_collection");
	
	//backbone views
	var MemberSigningView=require("./assets/membersigning/membersigning_view");
	
	//入住会员明细点击会员跳转到会员基本信息后，当点击返回时，需要将跳转前入住会员明细的筛选条件还原，所以定义以下变量
	var checkInMemberDetailBuilding ;
	var checkInMemberDetailCardType ;
	var checkInMemberDetailMemberStatus ;
	var checkInMemberDetailOrderBy ;
	var start ;
	var end ;
	//活动室人数查看点击会员跳转到会员基本信息后，当点击返回时，需要将跳转前活动室人数查看的筛选条件还原，所以定义以下变量
	var activityRoomMemberNumPkRoom ;
	
	var Member = ELView.extend({
		attrs:{
			template:template
		},
		
		searchMember:function(str){
			this.get("memberSigningView").component.loading();
			$("input.J-subnav-search-search").val(str);
			var widget=this;
			aw.ajax({
				url:"api/membersign/search",
				data:{
					s:str,
					"members.statusIn":"Normal,Out,Nursing,Died,Behospitalized,Waitting,NotLive,NursingAndBehospitalized",
					"status":"Normal",
				    fetchProperties:Properties.list
				},
				dataType:"json",
				success:function(data){
					widget.memberSigningCollection.reset(data);
					$(".el-member").addClass("list").removeClass("member").removeClass("relative").
						removeClass("contract").removeClass("guarantor").removeClass("accompany");
				}
			});
		
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title: i18ns.get("sale_ship_owner","会员")+"基本信息",
					search:function(str) {
						widget.searchMember(str);
					},
					buttonGroup:[{
						id:"building",
						show:params && params.flg=="deceasedmembers"? false:true,
						handler:function(key,element){
							widget.get("memberSigningView").refresh({
								status:"Normal",
								houseingNotIn:false,
								pkBuilding:key,
								fetchProperties:Properties.list
							});
						}
					},{
						id:"datatype",
						items:[{
							key:"life",
							value:"生活数据"
						},{
							key:"health",
							value:"健康数据"
						},{
							key:"happy",
							value:"快乐数据"
						}],
						handler:function(key,element){
							var pkMember=widget.get("memberSigningView").member_view.member_model.get("pkMember");
							var pkMemberSigning=widget.memberSigningCollection.models[0].attributes.pkMemberSigning;
							var pkCard=widget.memberSigningCollection.models[0].attributes.card.pkMemberShipCard;
							var flg=params&&params.flg?params.flg:"";
							if(!pkMember){
								Dialog.alert({
		    						content : i18ns.get("sale_ship_owner","会员")+"未录入,请先录入"+i18ns.get("sale_ship_owner","会员")+"！！"
		    					 });
		    					return false;
							}
							if(key=="life"){
								widget.openView({
									url:"eling/elcms/membercenter/memberlife/memberlife",
									params:{
										pkMemberSigning:params&&params.pkMemberSigning?params.pkMemberSigning:pkMemberSigning,
										pkBuilding : widget.get("subnav").getValue("building"),
										pkCard : params&&params.pkCard?params.pkCard:pkCard,
										pkMember : pkMember,
										name:$("#baseinfo .J-name").val()||"",
										fatherParams:params.fatherParams?params.fatherParams:params,
										flgs:"lifedata",
										flg:flg,
									},
									isAllowBack:true
								});
							}else if(key=="health"){
								widget.openView({
									url:"eling/elcms/membercenter/memberheaithy/memberheaithy",
									params:{
										pkMemberSigning:params&&params.pkMemberSigning?params.pkMemberSigning:pkMemberSigning,
										pkBuilding : widget.get("subnav").getValue("building"),
									    pkCard : params&&params.pkCard?params.pkCard:pkCard,
										pkMember : pkMember,
										name:$("#baseinfo .J-name").val()||"",
										fatherParams:params.fatherParams?params.fatherParams:params,
										flgs:"healthdata",
										flg:flg,
									},
									isAllowBack:true
								});
							}else{
								widget.openView({
									url:"eling/elcms/happiness/hpydb/hpybd",
									params:{
										pkMemberSigning:params&&params.pkMemberSigning?params.pkMemberSigning:pkMemberSigning,
										pkBuilding : widget.get("subnav").getValue("building"),
										pkCard : params&&params.pkCard?params.pkCard:pkCard,
										pkMember : pkMember,
									    name:$("#baseinfo .J-name").val()||"",
							    		fatherParams:params.fatherParams?params.fatherParams:params,
										flgs:"happydata",
										flg:flg,
									},
									isAllowBack:true
								});
							}
						}
					}],
					buttons:[{
						id:"return",
						text:"返回",
						handler:function(){
							if(params && params.flg=="memberhistorty"){
								widget.openView({
									url:"eling/elcms/reports/membercheckinhistoryreport/membercheckinhistoryreport",
								});
								return false;
							}
							if(params && params.flg=="activityroommembernum"){
								widget.openView({
									url:"eling/elcms/activityroommembernum/activityroommembernum",
									params:{
										pkRoom:activityRoomMemberNumPkRoom,
									}
								});
								return false;
							}
							if(params && params.flg=="checkinmemberdetailnew"){
								widget.openView({
									url:"eling/elcms/membercenter/checkinmemberdetailnew/checkinmemberdetailnew",
								});
								return false;
							}
							if(params && params.flg=="checkinmemberdetail"){
								widget.openView({
									url:"eling/elcms/membercenter/checkinmemberdetail/checkinmemberdetail",
									params:{
										pkBuilding:checkInMemberDetailBuilding,
										cardType:checkInMemberDetailCardType,
										memberStatus:checkInMemberDetailMemberStatus,
										orderBy:checkInMemberDetailOrderBy,
										start:start,
										end:end,
										flg:params.flg
									}
								});
								return false;
							}
							if(params && (params.flg=="deceasedmembers"||params.flg=="memberstatus")){
								$(".el-member").removeAttr("class").addClass("el-member").addClass("list");
								return false;
							}
							widget.get("subnav").show(["building","search"]);
							widget.get("memberSigningView").refresh({
								status:"Normal",
								houseingNotIn:false,
								pkBuilding:widget.get("subnav").getValue("building"),
								fetchProperties:Properties.list
							});
							$(".el-member").removeAttr("class").addClass("el-member").addClass("list");
							return false;
						}
					},{
						id:"modify",
						text:"编辑",
						show:false,
						handler:function(){
							widget.showEdit();
							return false;
						}
					}]
				}
			});
			
			this.memberSigningCollection=new MemberSigningCollection();
			var memberSigningView=new MemberSigningView(this.memberSigningCollection);
			
			this.set("subnav",subnav);
			this.set("memberSigningView",memberSigningView);
		},
		
		search:function(str){
			this.searchMember(str);
			//1.获得搜索框，将参数赋给搜索框。
			//2.主动调用search服务
		},
		toAccompany:function(pkAccompany){
			this.memberSigningCollection.fetch({
				reset:true,
				data:{
					accompanyPeople:pkAccompany,
					fetchProperties:Properties.list
				},
				success:function(data){
					if(data){
						//显示陪住人
					//	params.memberSigning=widget.memberSigningCollection.get(params.pkMemberSigning);
						var datas=data.toJSON();
						$(".J-accompanyPerson[data-sign="+datas[0].pkMemberSigning+"]").trigger("click");
					}
				}
			});
			
		},
		setEpitaph:function(){
			var subnav=this.get("subnav");
			var params = this.get("params");
			var pkMemberSigning ="";
			var pkMemberShipCard = "";
			var memberSigning =this.memberSigningCollection.toJSON();
			if(memberSigning.length>0){
				pkMemberSigning =memberSigning[0].pkMemberSigning;
				pkMemberShipCard =memberSigning[0].card.pkMemberShipCard
			}
			return {
				pkMemberSigning:params&&params.pkMemberSigning?params.pkMemberSigning:pkMemberSigning,
				pkBuilding : this.get("subnav").getValue("building"),
				pkCard : params&&params.pkCard?params.pkCard:pkMemberShipCard,
				pkMember : this.get("memberSigningView").member_view.member_model.get("pkMember"),
				name:params&&params.name?params.name:$("#baseinfo .J-name").val(),
				fatherParams:params.fatherParams?params.fatherParams:params,
				flgs:"member",
				flg:params&&params.flg?params.flg:"",
			};
		},
		afterInitComponent:function(params,widget){
			var subnav=this.get("subnav");
			if(params && params.search){
				widget.search(params.search);
			}else if(params && params.accompany){
				widget.toAccompany(params.accompany);
			}else{
				var memberSigning="";
				if(params && params.pkMemberSigning){
					memberSigning=params.pkMemberSigning;
				}
				widget.get("subnav").setValue("building",params.pkBuilding);
				if(params.flg=="" && params.flgs=="member"){
					widget.get("subnav").hide(["building","search"]).show(["modify"]);
				}
				if(params && params.flg=="activityroommembernum"){
					widget.get("subnav").hide(["modify","building","search"]);
					if(params.fatherParams!=null){
						params=params.fatherParams;
					}
					activityRoomMemberNumPkRoom = params.pkRoom;
				}
				if(params && params.flg=="deceasedmembers"){
					widget.get("subnav").hide(["modify","building","search"]);
				}
				if(params && params.flg=="memberhistorty"){
					widget.get("subnav").hide(["modify","building","search"]);
				}
				if(params && params.flg=="checkinmemberdetailnew"){
					widget.get("subnav").hide(["modify","building","search"]);
				}
				if(params && params.flg=="checkinmemberdetail"){
					widget.get("subnav").hide(["modify","building","search"]);
					if(params.fatherParams!=null){
						params=params.fatherParams;
					}
					memberSigning=params.pkMemberSigning;
					checkInMemberDetailBuilding = params.pkBuilding;
					checkInMemberDetailCardType = params.cardType;
					checkInMemberDetailMemberStatus = params.memberStatus;
					checkInMemberDetailOrderBy = params.orderBy;
					start=params.start;
					end=params.end;
				}
				this.memberSigningCollection.fetch({
					reset:true,
					data:{
						pkBuilding:widget.get("subnav").getValue("building"),
						pkMemberSigning:memberSigning,
						status:"Normal",
						houseingNotIn:false,
						fetchProperties:Properties.list
					},
					success:function(data){
						if(params && params.pkMember){
							//显示卡片
							params.memberSigning=widget.memberSigningCollection.get(params.pkMemberSigning);
							widget.get("memberSigningView").member_view.show(params);
						}else{
							widget.get("subnav").setValue("building",data.toJSON()[0]?data.toJSON()[0].room.building.pkBuilding:0);
							widget.element.addClass("list");
						}
					}
				});
			}
		},
		showEdit:function(){
			$(".el-member").addClass("edit").removeClass("detail");
			this.get("memberSigningView").member_view.component.reset();
			//特殊处理
			$(".J-operate pre").removeClass("hidden");
			$(".J-button-area").removeClass("hidden");
			$(".el-grid .box-header").removeClass("hidden");
			this.get("memberSigningView").member_view.setDisabled(false);
			this.get("memberSigningView").accompanyView.component.setDisabled(false);
		}
	});
	module.exports = Member;
});
