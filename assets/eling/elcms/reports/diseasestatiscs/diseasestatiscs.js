/**
 * 疾病统计
 */
define(function(require,exports,module){
	var ELView = require("elview");
	var aw=require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0"); 
	var Tab = require("tab");
	var Grid = require("grid-1.0.0");
	var Form = require("form-2.0.0");
	var Disgrid = require("./disgrid");
	var ImpDisgrid = require("./impdisgrid");
	var Detailgrid = require("./detailgrid");
	var diseasestatiscs=ELView.extend({
		attrs : {
			template : "<div class='J-subnav'></div>"
				+ "<div class='J-pkDiseaseDetail'></div>"
				+ "<div class='J-diseaseStatus'></div>"
				+ "<div class='J-tab'></div>"
		},
		events : {
			"click .nav>li":function(e){
				if($(e.currentTarget).find("a").attr("href")=="#memDisease"){
					this.get("subnav").show(["disease"]).hide(["building","impdisease","search"]);
					$("#disgrid").removeClass("hidden");
					$("#disdetgrid").addClass("hidden");
					return false;
				}else{
					this.get("subnav").show(["impdisease","search"]).hide(["building","disease"]);
					$("#impdisgrid").removeClass("hidden");
					$("#impdisdetgrid").addClass("hidden");
					return false;
				}
			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode : ".J-subnav",
				model:{
					title:"疾病统计",
					//新增按疾病类型查询.
					search:{
						placeholder : "疾病名称", 
						handler : function(str){
							widget.get("impdisdetgrid").loading();
							aw.ajax({
								url:"api/disease/searchcriticaldisease",
								data:{
									s:str,
									properties:"name",  
								},
								dataType:"json",
								success:function(data){
									widget.get("impdisgrid").setData(data); 
								}
							});
						}
					},
					buttonGroup:[{
     				   id:"building",
     				   show:false,
    				   showAll:true,
    				   showAllFirst:true,
    				   handler:function(key,element){
    					   widget.get("disdetgrid").refresh({
								"diseaseDetail":$(".J-pkDiseaseDetail").attr("data-key"),
								"diseaseStatus":$(".J-diseaseStatus").attr("data-key"),
								"member.memberSigning.room.building":key,
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
    					   widget.get("impdisdetgrid").refresh({
    						   	"diseaseDetail":$(".J-pkDiseaseDetail").attr("data-key"),
								"diseaseStatus":$(".J-diseaseStatus").attr("data-key"),
								"member.memberSigning.room.building":key,
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
					},{
						id:"disease",
						tip:"疾病名称",
						showAll:true,
						showAllFirst:true,
						key:"pkDiseaseDetail",
						value:"name",
						url:"api/diseasedetail/query",
						handler:function(key,element){
							widget.get("disgrid").refresh();
						}
					},{
						id:"impdisease",
						tip:"重大疾病名称",
						showAll:true,
						showAllFirst:true,
						show:false,
						key:"pkDiseaseDetail",
						value:"name",
						url:"api/diseasedetail/querycritical", 
						handler:function(key,element){
							widget.get("impdisgrid").refresh();
						}
					}],
					buttons : [{
                        id : "toexceldisease",
                        text : "导出",
                        handler : function(){
                        	//导出疾病统计
                           if(($("li.active").text().trim()=="疾病统计") && 
                        		   ($("div.active").find("div.hidden").attr("id") == "disdetgrid")){
                        	   window.open("api/disease/toexcel?pkDiseaseDetail="+
                        			   widget.get("subnav").getValue("disease")+
                        			   "&toExcelType="+"memDisease");
   							   return false;
                           }else if(($("li.active").text().trim()=="重大疾病统计") && 
                        		   ($("div.active").find("div.hidden").attr("id") == "impdisdetgrid")){
                        	   window.open("api/disease/toexcel?pkDiseaseDetail="+
                        			   widget.get("subnav").getValue("impdisease")+
                        			   "&toExcelType="+"memImpDisease");
  								return false;
                           }else{
                        	   window.open("api/diseasehistory/toexcel?member.memberSigning.room.building="+
                        			   widget.get("subnav").getValue("building")+
                        			   "&diseaseDetail="+$(".J-pkDiseaseDetail").attr("data-key")+
                        			   "&diseaseStatus="+$(".J-diseaseStatus").attr("data-key")+
                        			   "&member.statusIn="+"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized"); 
   							   return false;
                           }
                        }
                    }]
				}
				
			});
			this.set("subnav",subnav);
			var tab = new Tab({
				parentNode : ".J-tab",
				autoRender : true,
				model : {
					items:[{
						id : "memDisease",
						title : "疾病统计"
					},{
						id : "memImpDisease",
						title : "重大疾病统计"
					}]
				}
			});
			
			this.set("disgrid",Disgrid.init(this,{
				parentNode : "#memDisease",
			}));
			this.set("disdetgrid",Detailgrid.init(this,{
				parentNode : "#memDisease",
				id : "disdetgrid"
			}));
			this.set("impdisgrid",ImpDisgrid.init(this,{
				parentNode : "#memImpDisease",
			}));
			this.set("impdisdetgrid",Detailgrid.init(this,{
				parentNode : "#memImpDisease",
				id : "impdisdetgrid"
			}));
			$("#disdetgrid").addClass("hidden");
			$("#impdisdetgrid").addClass("hidden");
			
		},
		
		afterInitComponent:function(params,widget){
			widget.get("subnav").hide(["search"]);
		},
	});
	
	module.exports=diseasestatiscs;
});