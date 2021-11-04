define(function(require, exports, module) {
	var _ = require("underscore");
	var ELView = require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid = require("grid-1.0.0");
	var MultiRowGrid = require("multirowgrid");
	var Dialog=require("dialog-1.0.0");
	var Form =require("form-2.0.0")
	require("./adjustpeople.css");
	//多语
	var i18ns = require("i18n");
	var peopleUtils=require("../people/peopleutils");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-Grid'></div>"+
	"<div class='J-card hidden'></div>";
	var adjustpeople = ELView.extend({
    	attrs:{
    		template:template,
        },
        events:{
        	"click .J-detail":function(ele){
        		var grid = this.get("grid");
				var index = grid.getIndex(ele.target);
				var data = grid.getSelectedData(index);
				var name=$(ele.target).attr("data-key");
				var pkPersonalCardowner;
				for(var i=0;i<data.personalCardowners.length;i++){
					if(name==data.personalCardowners[i].personalInfo.name){
						pkPersonalCardowner=data.personalCardowners[i].pkPersonalCardowner;
					}
				}
				peopleUtils.reset();
				$(".J-Grid").addClass("hidden");
				$(".J-card").removeClass("hidden");
				$(".J-return,.J-edit").removeClass("hidden");
				$(".J-subnav-search-search").addClass("hidden");
				if(pkPersonalCardowner){
					aw.ajax({
						url:"api/personalCardowner/query",
						data:{
							pkPersonalCardowner:pkPersonalCardowner,
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
			"click .J-delete":function(ele){
				var grid=this.get("grid");
				var index=grid.getIndex(ele.target);
				var data=grid.getSelectedData(index);
				var pkPersonalCardowner=$(ele.target).attr("data-key");
				var cardname=$(ele.target).attr("data-key1");
				Dialog.confirm({
					title:"提示",
					content:"确认删除？删除后数据将无法修复",
					confirm:function(){
						aw.ajax({
							url:"api/membershipcontract/removeCardowner",
							data:{
								s:cardname,
								pkPersonalCardowner:pkPersonalCardowner,
								properties : "membershipCard.name",
								fetchProperties:"pkMembershipContract," +
												"membershipCard," +
												"signDate,"+
												"membershipCard.pkMemberShipCard," +
												"membershipCard.name,"+
												"membershipCard.cardStatus.value," +
												"personalCardowners," +
												"personalCardowners.pkPersonalCardowner," +
												"personalCardowners.personalInfo," +
												"personalCardowners.personalInfo.pkPersonalInfo," +
												"personalCardowners.personalInfo.name," +
												"personalCardowners.personalInfo.sex.value," +
												"personalCardowners.personalInfo.birthday," +
												"personalCardowners.personalInfo.idType.value," +
												"personalCardowners.personalInfo.idNumber",
							},
							dataType:"json",
							success:function(result){
								grid.setData(result);
								}
							});
					}
				});
			}
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"权益人调整",
        			search : {
						placeholder : i18ns.get("sale_card_name","卡号"),
						handler : function(str){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/membershipcontract/cardownersearch",
								data:{
									s:str,
									"membershipCard.cardStatusIn":"Free,Contracted,Using",
									properties : "membershipCard.name",
									fetchProperties:"pkMembershipContract," +
													"membershipCard," +
													"signDate,"+
													"membershipCard.pkMemberShipCard," +
													"membershipCard.name,"+
													"membershipCard.cardStatus.value," +
													"personalCardowners," +
													"personalCardowners.pkPersonalCardowner," +
													"personalCardowners.personalInfo," +
													"personalCardowners.personalInfo.pkPersonalInfo," +
													"personalCardowners.personalInfo.name," +
													"personalCardowners.personalInfo.sex.value," +
													"personalCardowners.personalInfo.birthday," +
													"personalCardowners.personalInfo.idType.value," +
													"personalCardowners.personalInfo.idNumber",
								},
								dataType:"json",
								success:function(result){
										g.setData(result);
									}
								});
						}
					},
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							//(1)隐藏卡片,显示列表
							$(".J-Grid").removeClass("hidden");
							$(".J-card").addClass("hidden");
							//(3)处理subnav上的按钮的隐藏和显示
							$(".J-return").addClass("hidden");
							$(".J-subnav-search-search").removeClass("hidden");
							return false;
						}
					}],
                }
			});
			this.set("subnav",subnav);
			
			var grid = new MultiRowGrid({
            	parentNode:".J-Grid",
            	autoRender:false,
				model:{
					multiField:"personalCardowners",//权益人
					columns:[{
						key:"membershipCard.name",
						name: i18ns.get("sale_card_name","会籍卡号"),
						className:"cardname",
						className:"text-center",
					},{
						key:"signDate",
						name:"签约日期",
						format:"date",
						className:"signDate",
						className:"text-center",
					},{
						key:"membershipCard.cardStatus.value",
						name:"状态",
						className:"cardStatus",
						className:"text-center",
					},{
						key:"personalCardowners",
						name:"姓名",
						className:"personalname",
						className:"text-center",
						multiKey : "personalInfo.name",
						isMulti:true,
						format:function(value,row){
							return "<a href='javascript:void(0);' style='color:red;' class='J-detail' data-key='"+value+"' data-contract='"+row.pkMembershipContract+"'>"+value+"</a>";
						}
					},{
						key:"personalCardowners",
						name:"性别",
						className:"sex",
						className:"text-center",
						multiKey : "personalInfo.sex.value",
						isMulti:true,
					},{
						key:"personalCardowners",
						name:"出生日期",
						className:"birthday",
						className:"text-center",
						multiKey : "personalInfo.birthday",
						isMulti:true,
						format:"date",
					},{
						key:"personalCardowners",
						name:"证件类型",
						className:"idType",
						className:"text-center",
						multiKey : "personalInfo.idType.value",
						isMulti:true,
					},{
						key:"personalCardowners",
						name:"证件号",
						className:"idNumber",
						className:"text-center",
						multiKey : "personalInfo.idNumber",
						isMulti:true,
					},{
						key:"personalCardowners",
						name : "操作",
						className:"operator",
						className:"text-center",
						multiKey : "pkPersonalCardowner",
						isMulti:true,
						format:function(value,row){
							if(value==null||value==""){
								return "";
							}else{
								var ret1 = "<div>" +  
	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-delete btn btn-xs' data-key='"+value+"' data-key1='"+row.membershipCard.name+"' >删除</a>" +  
	                            "</div>"; 
				                return ret1; 
							}
							 
						},
					}]
				}
            });
			peopleUtils.init();
			this.set("peopleUtils",peopleUtils);
            this.set("grid",grid);
        },
	});
	module.exports = adjustpeople;	
});
