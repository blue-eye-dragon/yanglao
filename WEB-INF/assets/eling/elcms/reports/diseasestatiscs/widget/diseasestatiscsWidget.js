define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav=require("subnav-1.0.0");
    var Grid = require("grid-1.0.0");
	var Dialog = require("dialog-1.0.0");
	
	var diseasestatiscsWidget=ELView.extend({
		attrs:{
			template: "<div class='J-subnav'></div><div class='J-grid'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"重大疾病统计",
					search:{
							placeholder : "疾病名称/房间号", 
							handler : function(str){
								widget.get("diseasestatiscsWidget").loading();
								aw.ajax({
									url:"api/diseasehistory/search",
									data:{
										s:str,
										"diseaseDetail.disease.critical":true,
							    		"member.statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
 										properties:"diseaseDetail.disease.name,member.memberSigning.room.number,member.personalInfo.name",  
							    		fetchProperties:"diseaseDetail.disease.name," +
							    			"diseaseDetail.disease.critical," +
											"member.personalInfo.name," +
											"member.memberSigning.room.number," +
											"member.personalInfo.name," +
											"diseaseStatus",
									},
									dataType:"json",
									success:function(data){
										widget.get("diseasestatiscsWidget").setData(data); 
										widget.get("subnav").show("all");
									}
								});
							}
						},
						buttons:[{
					id:"all",
					text:"全部",
					show:false,
					handler:function(){
						widget.get("diseasestatiscsWidget").refresh();
						widget.get("subnav").hide("all");
					}
				}],
				}
			});
			this.set("subnav",subnav);
			
			//列表
            var diseasestatiscsWidget=new Grid({	                        
            	parentNode:".J-grid",
			     url:"api/diseasehistory/query",
			     params:function(){
			    	 return{
			    		 "diseaseDetail.disease.critical":true,
			    		 "member.statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
			    		 fetchProperties:"diseaseDetail.disease.name," +
			    			"diseaseDetail.disease.critical," +
							"member.personalInfo.name," +
							"member.memberSigning.room.number," +
							"member.personalInfo.name," +
							"diseaseStatus",
			    	 }
			     },
			   
			     model:{
                    columns:[{
                    	key:"diseaseDetail.disease.name",
                    	name:"疾病名称"
                    },{
                        key : "member.memberSigning.room.number",
                        name : "房间"
                    },{
                        key : "member.personalInfo.name",
                        name : "姓名"
                    },{
                    	key : "diseaseStatus.value",
                        name : "状态"

                    }]
                }
            });
            this.set("diseasestatiscsWidget",diseasestatiscsWidget);
		}
	});
	
	module.exports = diseasestatiscsWidget;
});