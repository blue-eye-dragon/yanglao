 define(function(require,exports,module){
	//多语
	var i18ns = require("i18n");
	var Grid = require("grid");
	var impdisgrid={
			init:function(widget,params){
//				widget.get("subnav").hide(["toexcel"]);
				return new Grid({
	        		parentNode:params.parentNode,
					model:{
						id:"impdisgrid",
						url:"api/disease/diseasestatiscs", 
						className : "text-center",
						isInitPageBar:false,
						params : function(){
							var subnav=widget.get("subnav");
							return {
								pkDiseaseDetail:subnav.getValue("impdisease"),
								important:true,
								fetchProperties:"*,healthdiseasedetailname,allDisease,beill,recure,pkDiseaseDetail"
							}
						},
						columns:[{
							name:"healthdiseasedetailname",
							label:"疾病名称",
						},{
							name:"allDisease",
							label:"患病"+i18ns.get("sale_ship_owner","会员")+"数",
							format:"link",
							formatparams:{
								id:"allDiseasedet",
								handler:function(index,data,rowEle){
									if(data.allDisease == 0){
										return false;
									}
									var impdisdetgrid=widget.get("impdisdetgrid");
									$("#impdisgrid").addClass("hidden");
									$("#impdisdetgrid").removeClass("hidden");
									widget.get("subnav").hide(["disease","impdisease","search"]).show(["building"]);
									widget.get("impdisdetgrid").setTitle(data.healthdiseasedetailname+"——全部"+i18ns.get("sale_ship_owner","会员")+"详细信息");
									$(".J-pkDiseaseDetail").attr("data-key",data.pkDiseaseDetail),
									$(".J-diseaseStatus").attr("data-key",""),
									impdisdetgrid.refresh({
										"diseaseDetail":data.pkDiseaseDetail,
										"orderString":"member.memberSigning.room.number",
										"member.statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
										fetchProperties:"member.memberSigning.room.number," +
												"member.personalInfo.name," +
												"member.personalInfo.birthday," +
												"member.personalInfo.sex," +
												"member.memberSigning.checkInDate," +
												"diseaseTime," +
												"cureTime," +
												"diseaseDetail.pkDiseaseDetail," +
												"diseaseStatus" 
									});
								}
							},
						},{
							name:"beill",
							label:"患病中"+i18ns.get("sale_ship_owner","会员")+"数",
							format:"link",
							formatparams:{
								id:"beilldet",
								handler:function(index,data,rowEle){
									if(data.beill == 0){
										return false;
									}
									var impdisdetgrid=widget.get("impdisdetgrid");
									$("#impdisgrid").addClass("hidden");
									$("#impdisdetgrid").removeClass("hidden");
									widget.get("subnav").hide(["disease","impdisease","search"]).show(["building"]);
									widget.get("impdisdetgrid").setTitle(data.healthdiseasedetailname+"——患病中"+i18ns.get("sale_ship_owner","会员")+"详细信息");
									$(".J-pkDiseaseDetail").attr("data-key",data.pkDiseaseDetail),
									$(".J-diseaseStatus").attr("data-key","BEILL"),
									impdisdetgrid.refresh({
										"diseaseDetail":data.pkDiseaseDetail,
										"diseaseStatus":"BEILL",
										"member.statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
										fetchProperties:"member.memberSigning.room.number," +
												"member.personalInfo.name," +
												"member.personalInfo.birthday," +
												"member.personalInfo.sex," +
												"member.memberSigning.checkInDate," +
												"diseaseTime," +
												"cureTime," +
												"diseaseStatus" 
									});
								}
							},
						},{
							name:"recure",
							label:"已治愈"+i18ns.get("sale_ship_owner","会员")+"数",
							format:"link",
							formatparams:{
								key:"recuredet",
								handler:function(index,data,rowEle){
									if(data.recure == 0){
										return false;
									}
									var impdisdetgrid=widget.get("impdisdetgrid");
									$("#impdisgrid").addClass("hidden");
									$("#impdisdetgrid").removeClass("hidden");
									widget.get("subnav").hide(["disease","impdisease","search"]).show(["building"]);
									widget.get("impdisdetgrid").setTitle(data.healthdiseasedetailname+"——已治愈"+i18ns.get("sale_ship_owner","会员")+"详细信息");
									$(".J-pkDiseaseDetail").attr("data-key",data.pkDiseaseDetail),
									$(".J-diseaseStatus").attr("data-key","RECURE"),
									impdisdetgrid.refresh({
										"diseaseDetail":data.pkDiseaseDetail,
										"diseaseStatus":"RECURE",
										"member.statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
										fetchProperties:"member.memberSigning.room.number," +
												"member.personalInfo.name," +
												"member.personalInfo.birthday," +
												"member.personalInfo.sex," +
												"member.memberSigning.checkInDate," +
												"diseaseTime," +
												"cureTime," +
												"diseaseStatus" 
									});
								}
							},
						}]
					},
				});
			}
		}
	module.exports=impdisgrid  ;
})


