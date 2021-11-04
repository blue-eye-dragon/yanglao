/**
 * 会籍转让历史
 * 
 * @author cjf
 */
define(function(require, exports, module) {
	var ELView = require("elview");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var peopleUtils=require("../people/peopleutils");
	var template="<div class='J-subnav'></div>"+
					"<div class='J-grid'></div>"+
					"<div class='J-card hidden'></div>"+
					//用于存放当前点击的人的pk
					"<div class='J-people'></div>"+
					//用于存放当前点击的签约pk
					"<div class='J-contract'></div>";
	var membershiptransferhistory = ELView.extend({   
		attrs:{
	        template:template
		},
		events : {
			"click .J-personalCardowner":function(ele){
//				peopleUtils.reset();
				this.get("subnav").show(["return"]).hide(["transferDate"]),
				//(1)隐藏推荐人填报页面
				$(".J-card").children().eq(0).removeClass("hidden");
				$(".J-card").children().eq(1).addClass("hidden");
				//(2)隐藏列表,显示卡片
				$(".J-grid").addClass("hidden");
				$(".J-card").removeClass("hidden");
				//(3)处理subnav上的按钮的隐藏和显示
/*				$(".J-return,.J-edit").removeClass("hidden");
				$(".J-status,.J-cardStatus,.J-toBeStatus,.J-cardType").addClass("hidden");
				$(".J-subnav-search-search,.J-time,.J-gotoSign").addClass("hidden");
*/				//(4)设置J-people和J-contract
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
			}
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会籍转让历史",
					items:[{
						id : "transferDate",
						type : "daterange",
						tip:"转让日期",  
						handler : function(key,element) {
							widget.get("grid").refresh(null,function(){
								widget.getTotalTransferFee("grid");
							});
						}
					},{
						id:"return",
						type:"button",
						text:"返回",
						show:false,
						handler : function(key,element) {
							widget.hide([".J-card"]).show([".J-grid"]);
							widget.get("subnav").show(["transferDate"]).hide(["return"]);
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url:"api/membershiptransfer/query",
					params : function(){
						return {
							"transferType":"Transfer",
							"transferDate":widget.get("subnav").getValue("transferDate").start,
							"transferDateEnd":widget.get("subnav").getValue("transferDate").end,
							fetchProperties:"transferFee,transferDate," +
									"transferReason,transferType," +
									"version,previousContract.pkMembershipContract," +
									"previousContract.membershipCard.name," +
									"previousContract.checkInType," +
									"previousContract.memberShipFees," +
									"previousContract.membershipCard.cardType.name,"+
									"previousContract.operator.name,"+
									"previousContract.personalCardowners.pkPersonalCardowner,"+
									"previousContract.personalCardowners.personalInfo.pkPersonalInfo,"+
									"previousContract.personalCardowners.personalInfo.name,"+
									"previousContract,"+
									"newContract.personalCardowners.pkPersonalCardowner,"+
									"newContract.personalCardowners.personalInfo.pkPersonalInfo,"+
									"newContract.personalCardowners.personalInfo.name,"+
									"newContract.pkMembershipContract,"+
									"newContract.checkInType,"+
									"newContract.memberShipFees,"+
									"newContract.operator.name",
									
	                    };
					},
					head:{
						title:""
					},
					columns:[{
						name:"previousContract.membershipCard.name",
						label: i18ns.get("sale_card_name","卡号")
					},{
						name:"previousContract.membershipCard.cardType.name",
						label: i18ns.get("sale_card_type","卡类型")
					},{
						name:"previousContract.memberShipFees",
						label:"原"+i18ns.get("charge_shipfees_confees","会籍卡费")
					},{
						name:"transferFee",
						label:"转让手续费"
					},{
						label:"原权益人",   
						format:function(value,row){
							var result="";
							if(row.previousContract.personalCardowners!=null){
								for(var i=0;i<row.previousContract.personalCardowners.length;i++){
									if(i==row.previousContract.personalCardowners.length-1){
										result += "<a id='"+row.previousContract.personalCardowners[i].pkPersonalCardowner+"' href='javascript:void(0);' data-contract='"+row.previousContract.pkMembershipContract+"' style='color:red;' data-index='0' class='J-personalCardowner'>"+row.previousContract.personalCardowners[i].personalInfo.name+"</a>"
									}else{
										result += "<a id='"+row.previousContract.personalCardowners[i].pkPersonalCardowner+"' href='javascript:void(0);' data-contract='"+row.previousContract.pkMembershipContract+"' style='color:red;' data-index='0' class='J-personalCardowner'>"+row.previousContract.personalCardowners[i].personalInfo.name+"</a>"+"、"
									}
								}
								return result;
							}else{
								return "";
							}
						}
					},{
						label:"新权益人",
						format:function(value,row){
							var result="";
							if(row.newContract.personalCardowners!=null){
								for(var i=0;i<row.newContract.personalCardowners.length;i++){
									if(i==row.newContract.personalCardowners.length-1){
										result += "<a id='"+row.newContract.personalCardowners[i].pkPersonalCardowner+"' href='javascript:void(0);' data-contract='"+row.newContract.pkMembershipContract+"' style='color:red;' data-index='0' class='J-personalCardowner'>"+row.newContract.personalCardowners[i].personalInfo.name+"</a>"
									}else{
										result += "<a id='"+row.newContract.personalCardowners[i].pkPersonalCardowner+"' href='javascript:void(0);' data-contract='"+row.newContract.pkMembershipContract+"' style='color:red;' data-index='0' class='J-personalCardowner'>"+row.newContract.personalCardowners[i].personalInfo.name+"</a>"+"、"
									}
								}
								return result;
							}else{
								return "";
							}
						}
					},{
						name:"newContract.checkInType.value",
						label:"入住类型"
					},{
						name:"transferDate",
						label:"转让日期",
						format:"date"  
					},{
						name:"newContract.operator.name", 
						label:"经手人"
					}]
				},
			});
			this.set("grid",grid);
			
			peopleUtils.init();
			this.set("peopleUtils",peopleUtils);
			
		},
		getTotalTransferFee:function(widget){
			var grid = this.get("grid");
			var data = grid.getData();
			var TotalTransferFee = 0;
			for(var i=0;i<data.length;i++){
				TotalTransferFee+=data[i].transferFee;
			}
			grid.setTitle("转让手续费共:"+TotalTransferFee+"元");
		},
		 afterInitComponent:function(params,widget){
			 widget.get("grid").refresh(null,function(data){
		    		widget.getTotalTransferFee("grid");
			 });
		 }
	});
	module.exports = membershiptransferhistory;
});