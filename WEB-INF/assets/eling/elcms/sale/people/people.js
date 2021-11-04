define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var Verform=require("form-1.0.0");
	var peopleUtils=require("./peopleutils");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
				"<div class='J-list'></div>"+
				"<div class='J-card hidden'></div>"+
				//用于存放当前点击的人的pk
				"<div class='J-people'></div>"+
				//用于存放当前点击的签约pk
				"<div class='J-contract'></div>";
	var People = ELView.extend({
		attrs:{
			template:template
		},
		events : {
			"click .J-personalCardowner":function(ele){
				peopleUtils.reset();
				//(1)隐藏推荐人填报页面
				$(".J-card").children().eq(0).removeClass("hidden");
				$(".J-card").children().eq(1).addClass("hidden");
				//(2)隐藏列表,显示卡片
				$(".J-list").addClass("hidden");
				$(".J-card").removeClass("hidden");
				//(3)处理subnav上的按钮的隐藏和显示
				$(".J-return,.J-edit").removeClass("hidden");
				$(".J-status,.J-cardStatus,.J-toBeStatus,.J-cardType").addClass("hidden");
				$(".J-subnav-search-search,.J-time,.J-gotoSign").addClass("hidden");
				//(4)设置J-people和J-contract
				var id=$(ele.target).attr("id");
				$(".J-people").attr("data-key",id);
				$(".J-contract").attr("data-key",$(ele.target).attr("data-contract"));
				//(5)获取点击的人的id，然后进行查询和赋值
				if(id){
					aw.ajax({
						url:"api/personalCardowner/query",
						data:{
							pkPersonalCardowner:id,
							fetchProperties:"*," +
							"personalInfo.pkPersonalInfo,"+
							"personalInfo.version,"+
							"personalInfo.name,"+
							"personalInfo.nameEn,"+
							"personalInfo.formerName,"+
							"personalInfo.idNumber,"+
							"personalInfo.relationship,"+
							"personalInfo.sex,"+
							"personalInfo.maritalStatus,"+
							"personalInfo.weddingDate,"+
							"personalInfo.birthday,"+
							"personalInfo.birthplace,"+
							"personalInfo.communistParty,"+
							"personalInfo.otherParty,"+
							"personalInfo.citizenship.pkCountry,"+
							"personalInfo.citizenship.name,"+
							"personalInfo.nationality,"+
							"personalInfo.nativePlace.id,"+
							"personalInfo.nativePlace.name,"+
							"personalInfo.nativePlace.code,"+
							"personalInfo.residenceAddress,"+
							"personalInfo.graduateSchool,"+
							"personalInfo.qualifications,"+
							"personalInfo.degree,"+
							"personalInfo.specialty,"+
							"personalInfo.phone,"+
							"personalInfo.mobilePhone,"+
							"personalInfo.email,"+
							"personalInfo.workUnit,"+
							"personalInfo.jobTitle,"+
							"personalInfo.annualIncome,"+
							"personalInfo.professionalTitle,"+
							"personalInfo.topJobTitle,"+
							"personalInfo.overseasExperience.name,"+
							"personalInfo.overseasExperience.code,"+
							"personalInfo.overseasExperience.pkCountry,"+
							"personalInfo.ffl,"+
							"personalInfo.fflDof,"+
							"personalInfo.sfl,"+
							"personalInfo.sflDof,"+
							"personalInfo.computerDof," +
							"personalInfo.idType,"+
							"personalInfo.otherIntroduction,"
						},
						dataType:"json",
						success:function(data){
							data = data[0];
							//将data拍平
							var personalInfo=data.personalInfo || {};
							for(var i in personalInfo){
								data[i]=personalInfo[i];
							}
							peopleUtils.setData(data);
							peopleUtils.setDetail();
						}
					});
				}else{
					peopleUtils.setEdit();
				}
				return false;
			},
			"click .J-recommendPeople":function(ele){					
				//(1)隐藏推荐人填报页面
				$(".J-card").children().eq(0).addClass("hidden");
				$(".J-card").children().eq(1).removeClass("hidden");
				//(2)隐藏列表,显示卡片
				$(".J-list").addClass("hidden");
				$(".J-card").removeClass("hidden");
				//(3)处理subnav上的按钮的隐藏和显示
				$(".J-return,.J-edit").removeClass("hidden");
				$(".J-status,.J-cardStatus,.J-toBeStatus,.J-cardType").addClass("hidden");
				$(".J-subnav-search-search,.J-time,.J-gotoSign").addClass("hidden");
				//(4)获取点击的人的id，然后进行查询和赋值
				var id=$(ele.target).attr("id");
				$(".J-people").attr("data-key",id);
				$(".J-contract").attr("data-key",$(ele.target).attr("data-contract"));
				var form=this.get("verform");
				form.reset();
				if(id){
					aw.ajax({
						url:"api/recommendpeople/queryByPK/"+id,
						data:{
//								fetchProperties:"*,community.pkCommunity,community.name"
							fetchProperties:"*,community.pkCommunity,community.name,nativePlace.id,nativePlace.name,nativePlace.code,"
						},
						dataType:"json",
						success:function(data){
							form.setDisabled(true);
							form.setData(data);
						}
					});
				}
				return false;
			}
		},
		showDetail:function(id,contract){
			peopleUtils.reset();
			//(1)隐藏推荐人填报页面
			$(".J-card").children().eq(0).removeClass("hidden");
			$(".J-card").children().eq(1).addClass("hidden");
			//(2)隐藏列表,显示卡片
			$(".J-list").addClass("hidden");
			$(".J-card").removeClass("hidden");
			//(3)处理subnav上的按钮的隐藏和显示
			$(".J-return,.J-edit").removeClass("hidden");
			$(".J-status,.J-cardStatus,.J-cardType").addClass("hidden");
			$(".J-subnav-search-search,.J-time,.J-gotoSign").addClass("hidden");
			//(4)设置J-people和J-contract
			$(".J-people").attr("data-key",id);
			$(".J-contract").attr("data-key",contract);
			//(5)获取点击的人的id，然后进行查询和赋值
			if(id){
				aw.ajax({
					url:"api/personalCardowner/query",
					data:{
						pkPersonalCardowner:id,
						fetchProperties:"*," +
						"personalInfo.pkPersonalInfo,"+
						"personalInfo.version,"+
						"personalInfo.name,"+
						"personalInfo.nameEn,"+
						"personalInfo.formerName,"+
						"personalInfo.idNumber,"+
						"personalInfo.relationship,"+
						"personalInfo.sex,"+
						"personalInfo.maritalStatus,"+
						"personalInfo.weddingDate,"+
						"personalInfo.birthday,"+
						"personalInfo.birthplace,"+
						"personalInfo.communistParty,"+
						"personalInfo.otherParty,"+
						"personalInfo.citizenship.pkCountry,"+
						"personalInfo.citizenship.name,"+
						"personalInfo.nationality,"+
						"personalInfo.nativePlace.id,"+
						"personalInfo.nativePlace.name,"+
						"personalInfo.nativePlace.code,"+
						"personalInfo.residenceAddress,"+
						"personalInfo.graduateSchool,"+
						"personalInfo.qualifications,"+
						"personalInfo.degree,"+
						"personalInfo.specialty,"+
						"personalInfo.phone,"+
						"personalInfo.mobilePhone,"+
						"personalInfo.email,"+
						"personalInfo.workUnit,"+
						"personalInfo.jobTitle,"+
						"personalInfo.annualIncome,"+
						"personalInfo.professionalTitle,"+
						"personalInfo.topJobTitle,"+
						"personalInfo.overseasExperience.name,"+
						"personalInfo.overseasExperience.code,"+
						"personalInfo.overseasExperience.pkCountry,"+
						"personalInfo.ffl,"+
						"personalInfo.fflDof,"+
						"personalInfo.sfl,"+
						"personalInfo.sflDof,"+
						"personalInfo.computerDof," +
						"personalInfo.idType,"+
						"personalInfo.otherIntroduction,"
					},
					dataType:"json",
					success:function(data){
						data = data[0];
						//将data拍平
						var personalInfo=data.personalInfo || {};
						for(var i in personalInfo){
							data[i]=personalInfo[i];
						}
						peopleUtils.setData(data);
						peopleUtils.setDetail();
					}
				});
			}else{
				peopleUtils.setEdit();
			}
			return false;
		},
		initComponent : function(params,widget) {
			var buttonGroup=[{
				id:"status",
				showAll:true,
				tip:"会籍状态",
				items:[{
					key:"Normal",
					value:"正常"
				},{
					key:"Termination",
					value:"终止"
				}],
				handler:function(key,element){
					widget.get("grid").refresh();
				}
			},{
				id:"cardStatus",
				showAll:true,
				tip:"卡状态",
				items:[{
					key:"Contracted",
					value:"会籍签约"
				},{
					key:"Free",
					value:"自由"
				},{
					key:"Using",
					value:"使用中"
				},{
					key:"BackCard",
					value:"已退会"
				}],
				handler:function(key,element){
					widget.get("grid").refresh(
//							{
//						membershipCards_cardStatus:key,
//						cardownerType : "PERSONAL"
//					}
							);
				}
			},{
				id:"toBeStatus",
				tip:"会籍卡调整状态",
				items:[{
					key:"Normal",
					value:"正常"
				},{
					key:"Transfer",
					value:"待转让"
				}],
				handler:function(key,element){
					widget.get("grid").refresh(
//							{
//						membershipCards_toBeStatus:key,
//						cardownerType : "PERSONAL"
//					}
							);
				}
			},{
				id:"cardType",
				tip:"会籍卡类型",
				showAll:true,
				showAllFirst:true,
				key:"pkMemberShipCardType",
				value:"name",
				url:"api/cardtype/query",
				fetchProperties:"pkMemberShipCardType,name",
				handler:function(key,element){
					widget.get("grid").refresh(
//							{
//						membershipCards_cardType:key,
//						cardownerType : "PERSONAL"
//					}
							);
				}
			}];
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"个人权益人档案",
					search:true,
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							//(1)隐藏卡片,显示列表
							$(".J-list").removeClass("hidden");
							$(".J-card").addClass("hidden");
							//(3)处理subnav上的按钮的隐藏和显示
							$(".J-return,.J-edit").addClass("hidden");
							$(".J-status,.J-cardStatus,.J-toBeStatus,.J-cardType").removeClass("hidden");
							$(".J-subnav-search-search,.J-time,.J-gotoSign").removeClass("hidden");
							return false;
						}
					},{
						id:"edit",
						text:"编辑",
						show:false,
						handler:function(){
							widget.get("peopleUtils").setEdit();
							return false;
						}
					}
//					,{
//						id:"gotoSign",
//						text:"会籍签约",
//						handler:function(){
//							widget.openView({
//								url:"eling/elcms/sale/membershipcontract/membershipcontract"
//							});
//						}
//					}
					],
					buttonGroup:buttonGroup,
					search:function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/membershipcontract/search",
							
							data:{
								s:str,
								properties:"contractNo," +
										"membershipCards.name," +
										"personalCardowners.personalInfo.name",
								fetchProperties:"*,membershipCard.name,membershipCard.cardStatus,personalCardowners.pkPersonalCardowner,personalCardowners.version," +
										"personalCardowners.personalInfo.pkPersonalInfo,personalCardowners.personalInfo.name,personalCardowners.personalInfo.version",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.hide([".J-card",".J-wizard",".J-detailinfo",".J-recommendPeopleForm"]).show([".J-list"]);
							}
						});
					},
					time:{
						tip:"会籍签约时间",
						ranges:{
							"本月": [moment().startOf("month"), moment().endOf("month")],
							"本周": [moment().startOf("week"), moment().endOf("week")],
							"上月":[moment().subtract(1,"months").startOf("month"), moment().subtract(1,"months").endOf("month")],
							"本年":[moment().startOf("year"), moment().endOf("year")],
							},
     				   click:function(time){
     					   widget.get("grid").refresh(
//     							   {
//     						   	signDate:time.start,
//     						   	signDateEnd:time.end,
//     							cardownerType : "PERSONAL"
//     					   }
     							   );
     				   },
     			   }
				}
			});
			
			var grid=new Grid({
				autoRender:false,
				url:"api/membershipcontract/query",
				params:function(){
					var  subnav = widget.get("subnav");
					return{
						cardownerType : "PERSONAL",
						status:subnav.getValue("status"),
						membershipCards_cardType:subnav.getValue("cardType"),
						membershipCards_toBeStatus:subnav.getValue("toBeStatus"),
						membershipCards_cardStatus:subnav.getValue("cardStatus"),
						signDate:subnav.getValue("time").start,
						signDateEnd:subnav.getValue("time").end,
						
					};
				},
				fetchProperties:"*,personalCardowners.pkPersonalCardowner,membershipCard.name,membershipCard.cardStatus," +
						"personalCardowners.personalInfo.pkPersonalInfo,personalCardowners.personalInfo.name,personalCardowners.personalInfo.version",
				model:{
					columns:[{
						key:"contractNo",
						name:"合同号"
					},{
						key:"signDate",
						name:"签约日期",
						format:"date"
					},{
						key:"membershipCard.name",
						name:"会籍卡号",
					},{
						key:"membershipCard.cardStatus.value",
						name:"会籍卡状态",
					},{
						key:"status.value",
						name:"会籍状态",
					},{
						key:"personalCardowners",
						name:"权益人1",
						format:function(value,row){
							var text=value && value[0] ? value[0].personalInfo.name : "待录入";
							var color=value && value[0] ? "red" : "rgb(141, 128, 128)";
							var id=value && value[0] ? value[0].pkPersonalCardowner : "";
							var contract=row.pkMembershipContract || "";
							return "<a id='"+id+"' href='javascript:void(0);' data-contract='"+contract+"' style='color:"+color+";' data-index='0' class='J-personalCardowner'>"+text+"</a>";
						}
					},{
						key:"personalCardowners",
						name:"权益人2",
						format:function(value,row){
							var text=value && value[1] ? value[1].personalInfo.name : "待录入";
							var color=value && value[1] ? "red" : "rgb(141, 128, 128)";
							var id=value && value[1] ? value[1].pkPersonalCardowner : "";
							var contract=row.pkMembershipContract || "";
							return "<a id='"+id+"' href='javascript:void(0);' data-contract='"+contract+"' style='color:"+color+";' data-index='1' class='J-personalCardowner'>"+text+"</a>";
						}
					},{
						key:"personalCardowners",
						name:"权益人3",
						format:function(value,row){
							var text=value && value[2] ? value[2].personalInfo.name : "待录入";
							var color=value && value[2] ? "red" : "rgb(141, 128, 128)";
							var id=value && value[2] ? value[2].pkPersonalCardowner : "";
							var contract=row.pkMembershipContract || "";
							return "<a id='"+id+"' href='javascript:void(0);' data-contract='"+contract+"' style='color:"+color+";' data-index='2' class='J-personalCardowner'>"+text+"</a>";
						}
					},{
						key:"personalCardowners",
						name:"权益人4",
						format:function(value,row){
							var text=value && value[3] ? value[3].personalInfo.name : "待录入";
							var color=value && value[3] ? "red" : "rgb(141, 128, 128)";
							var id=value && value[3] ? value[3].pkPersonalCardowner : "";
							var contract=row.pkMembershipContract || "";
							return "<a id='"+id+"' href='javascript:void(0);' data-contract='"+contract+"' style='color:"+color+";' data-index='3' class='J-personalCardowner'>"+text+"</a>";
						}
					},{
						key:"personalCardowners",
						name:"权益人5",
						format:function(value,row){
							var text=value && value[4] ? value[4].personalInfo.name : "待录入";
							var color=value && value[4] ? "red" : "rgb(141, 128, 128)";
							var id=value && value[4] ? value[4].pkPersonalCardowner : "";
							var contract=row.pkMembershipContract || "";
							return "<a id='"+id+"' href='javascript:void(0);' data-contract='"+contract+"' style='color:"+color+";' data-index='4' class='J-personalCardowner'>"+text+"</a>";
						}
					},{
						key:"personalCardowners",
						name:"权益人6",
						format:function(value,row){
							var text=value && value[5] ? value[5].personalInfo.name : "待录入";
							var color=value && value[5] ? "red" : "rgb(141, 128, 128)";
							var id=value && value[5] ? value[5].pkPersonalCardowner : "";
							var contract=row.pkMembershipContract || "";
							return "<a id='"+id+"' href='javascript:void(0);' data-contract='"+contract+"' style='color:"+color+";' data-index='5' class='J-personalCardowner'>"+text+"</a>";
						}
					}]
				}
			});

		
			peopleUtils.init();
			
			
			this.set("subnav",subnav);
			this.set("peopleUtils",peopleUtils);
			this.set("grid",grid);
			
			seajs.off("people_grid_refresh").on("people_grid_refresh",function(params){
				grid.refresh(params);
			});
		},
	 afterInitComponent:function(params,widget){
		 if(params){
			 if(params.bussiness == "showDetail"){
				 widget.showDetail(params.pkPersonalCardowner,params.pkMembershipContract)
				 return ;
			 }
		 } 
		 widget.get("grid").refresh(params);
	 }
	});
	module.exports = People;
});