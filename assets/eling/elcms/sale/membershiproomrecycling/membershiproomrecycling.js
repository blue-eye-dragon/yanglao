/**
 * 会籍房间回租
 * cjf
 */
define(function(require,exports,module){
	var ELView =require("elview");
	var aw=require("ajaxwrapper");
	var Grid=require("grid");
	var Subnav=require("subnav");
	var Dialog = require("dialog");
	var peopleUtils=require("../people/peopleutils");
	var template="<div class = 'J-subnav'></div>"+
				 "<div class = 'J-grid hidden'></div>"+
				 "<div class='J-card hidden'></div>"+
				 "<div class = 'J-recyclinggrid'></div>"+
			 	 //用于存放当前点击的人的pk
				"<div class='J-people'></div>"+
				//用于存放当前点击的签约pk
				"<div class='J-contract'></div>";
	var membershiproomrecycling=ELView.extend({
		attrs:{
			template:template,
		},
		events : {
			"click .J-personalCardowner":function(ele){
				peopleUtils.reset();
				this.get("subnav").show(["cardreturn"]).hide(["search","return"]),
				//(1)隐藏推荐人填报页面
				$(".J-card").children().eq(0).removeClass("hidden");
				$(".J-card").children().eq(1).addClass("hidden");
				//(2)隐藏列表,显示卡片
				$(".J-grid").addClass("hidden");
				$(".J-recyclinggrid").addClass("hidden");
				$(".J-card").removeClass("hidden");
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
			"click .J-personalCardownerrecycling":function(ele){
				peopleUtils.reset();
				this.get("subnav").show(["return"]).hide(["recyclingDate","add"]),
				//(1)隐藏推荐人填报页面
				$(".J-card").children().eq(0).removeClass("hidden");
				$(".J-card").children().eq(1).addClass("hidden");
				//(2)隐藏列表,显示卡片
				$(".J-grid").addClass("hidden");
				$(".J-recyclinggrid").addClass("hidden");
				$(".J-card").removeClass("hidden");
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
			}
		},
		initComponent:function(params,widget){
			var subnav = new Subnav({
				parentNode:".J-subnav",
				model : {
					title : "会籍房间回租",
					items : [{
						id:"search",
						type:"search",
						show:false,
						placeholder : "请输入卡号/房间号",
						handler : function(str) {
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/membershipcontract/search",
								data:{
									s:str,
									properties:"membershipCard.name,room.number",
									"membershipCard.cardType.pkMemberShipCardType":3,
									"checkInType" : "HouseingNotIn",
									fetchProperties:"pkMembershipContract,membershipCard.name,personalCardowners.personalInfo.name,room.number,signDate,personalCardowners.pkPersonalCardowner",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						},
					},{
						id : "recyclingDate",
						type : "daterange",
						tip:"回租日期",  
						handler : function(key,element) {
							widget.get("recyclinggrid").refresh();
						}
					},{
						id : "add",
						type : "button",
						text : "新增",
						handler : function() {
							widget.get("subnav").setValue("search","");
							widget.get("grid").setData([]);
							widget.get("subnav").hide(["add","recyclingDate"]).show(["return","search"]);
							widget.hide([".J-recyclinggrid"]).show([".J-grid"])
						}
					},{
						id : "return",
						type : "button",
						text : "返回",
						show : false,
						handler : function() {
							widget.get("subnav").show(["add","recyclingDate"]).hide(["return","search"]);
							widget.show([".J-recyclinggrid"]).hide([".J-grid",".J-card"])
						}
					},{
						id : "cardreturn",
						type : "button",
						text : "返回",
						show : false,
						handler : function() {
							widget.get("subnav").show(["return","search"]).hide(["cardreturn","recyclingDate","add"]);
							widget.show([".J-grid"]).hide([".J-recyclinggrid",".J-card"])
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					columns : [{
	                	name : "membershipCard.name",
	                    label : "会籍卡号"
	                },{
	                	name : "personalCardowners",
	                    label : "权益人",
	                    format : function(value,row){
	                    	var result="";
							if(row.personalCardowners.length>0){
								for(var i =0 ;i<row.personalCardowners.length;i++){
									if(i==row.personalCardowners.length-1){
										result += "<a id='"+row.personalCardowners[i].pkPersonalCardowner+"' href='javascript:void(0);' data-contract='"+row.pkMembershipContract+"' style='color:red;' data-index='0' class='J-personalCardowner'>"+row.personalCardowners[i].personalInfo.name+"</a>"
									}else{
										result += "<a id='"+row.personalCardowners[i].pkPersonalCardowner+"' href='javascript:void(0);' data-contract='"+row.pkMembershipContract+"' style='color:red;' data-index='0' class='J-personalCardowner'>"+row.personalCardowners[i].personalInfo.name+"</a>"+"、"
									}
								}
								return result;
							}else{
								return "";
							}
	                    }
	                },{
	                	name : "room.number",
	                    label : "房间号"
	                },{
	                	name : "signDate",
	                    label : "会籍签约日期",
	                    format : "date"
	                },{
	                	name : "",
	                    label : "操作",
	                    format:"button",
	                    formatparams:[{
	                    	key:"recycling", 
							text:"回收",
							handler:function(index,data,rowEle){ 
								//退房审批通过后，允许进行房间回收操作；
								//房间回收实际上是将会籍卡对应会籍签约的入住类型改为“买卡不选房”
								var membershipcontract = {
									pkMembershipContract : data.pkMembershipContract,
								}
								Dialog.confirm({
									title:"提示",
									content:"是否回收？",
									confirm:function(){
										aw.saveOrUpdate("api/membershiproomrecycling/save",membershipcontract,function(data){
											widget.get("subnav").show(["add","recyclingDate"]).hide(["return","search"]);
											widget.show([".J-recyclinggrid"]).hide([".J-grid"])
											widget.get("recyclinggrid").refresh();
        	        					});
									}
								});
							}
	                    }]
	                }]
				}
			});
			this.set("grid",grid);
			
			var recyclinggrid = new Grid({
				parentNode:".J-recyclinggrid",
				url:"api/membershiproomrecycling/query",
				model : {
					params:function(){
						return {
							"recyclingDate" : widget.get("subnav").getValue("recyclingDate").start,
							"recyclingDateEnd" : widget.get("subnav").getValue("recyclingDate").end,
							"orderString" : "recyclingDate:desc",
							fetchProperties:"membershipContract.pkMembershipContract,membershipContract.membershipCard.name,"+
							"membershipContract.signDate,membershipContract.personalCardowners.personalInfo.name,room.number,recyclingDate," +
							"membershipContract.personalCardowners.pkPersonalCardowner",
						}
					},
					columns : [{
	                	name : "membershipContract.membershipCard.name",
	                    label : "会籍卡号"
	                },{
	                	name : "membershipContract.personalCardowners",
	                    label : "权益人",
	                    format : function(value,row){
	                    	var result="";
							if(row.membershipContract.personalCardowners.length>0){
								for(var i =0 ;i<row.membershipContract.personalCardowners.length;i++){
									if(i==row.membershipContract.personalCardowners.length-1){
										result += "<a id='"+row.membershipContract.personalCardowners[i].pkPersonalCardowner+"' href='javascript:void(0);' data-contract='"+row.membershipContract.pkMembershipContract+"' style='color:red;' data-index='0' class='J-personalCardownerrecycling'>"+row.membershipContract.personalCardowners[i].personalInfo.name+"</a>"
									}else{
										result += "<a id='"+row.membershipContract.personalCardowners[i].pkPersonalCardowner+"' href='javascript:void(0);' data-contract='"+row.membershipContract.pkMembershipContract+"' style='color:red;' data-index='0' class='J-personalCardownerrecycling'>"+row.membershipContract.personalCardowners[i].personalInfo.name+"</a>"+"、"
									}
								}
								return result;
							}else{
								return "";
							}
	                    }
	                },{
	                	name : "room.number",
	                    label : "房间号"
	                },{
	                	name : "membershipContract.signDate",
	                    label : "会籍签约日期",
	                    format : "date"
	                },{
	                	name : "recyclingDate",
	                	label: "回租日期",
	                	format : "date"
	                }]
				}
			});
			this.set("recyclinggrid",recyclinggrid);
			
			peopleUtils.init();
			this.set("peopleUtils",peopleUtils);
		}
	});
	module.exports = membershiproomrecycling;
})

