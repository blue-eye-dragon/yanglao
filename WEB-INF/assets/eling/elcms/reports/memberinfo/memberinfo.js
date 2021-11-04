define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Editgrid=require("editgrid");
	var Form=require("form");
	var enums = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	require("../../grid_css.css");
	var formTpl = require("./memberinfoform.tpl");
	var CustType = require("./memberinfoage.js");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
				"<div class='J-form' ></div>"+
				"<div class='J-grid' ></div>";
	
	var formdetail = {};
	var diseas = null;
	var surg = null;
	var diseasH = null;
	var surgH = null;
	
	var MemberInfo = ELView.extend({
		attrs:{
            template:template
		},
		events:{
			"click .J-detail-select":function(e){
				var cla = $(".J-detail-select").attr("class");
				var icon = cla.substring(0,cla.indexOf(" "));
				if(icon=="icon-angle-down"){
					$(".J-detail-select").attr("class","icon-angle-right J-detail-select");
					$(".J-detail-item").removeClass("hidden");
				}else if(icon=="icon-angle-right"){
					$(".J-detail-select").attr("class","icon-angle-down J-detail-select")
					$(".J-detail-item").addClass("hidden");
				}
			}
		},
		refreshGrid:function(widget){
			var form =widget.get("form");
    		var subnav = widget.get("subnav");
    		var formdata = form.getData();
    		
    		if(diseas){
    			diseasH=diseas;
    		}
    		if(surg){
    			surgH=surg;
    		}
    		if($(".J-form-memberinfo-autocomplete-diseaseHistory input").val()==""){
    			formdata.diseaseHistory="";
    			diseasH = null;
    			
    		}
    		if($(".J-form-memberinfo-autocomplete-surgeryHistory input").val()==""){
    			formdata.surgeryHistory="";
    			surgH = null;
    		}
    		
    		formdetail = formdata;
    		//年龄
    		var age = form.getValue("age");
    		if(age.start!="请选择" || age.end!="请选择"){
    			if(age.start!="请选择" && age.end!="请选择" && parseInt(age.start)>parseInt(age.end)){
    				Dialog.alert({
						content : "请选择可查询的年龄范围！！",
					});
    				return false;
    			}else{
    				start =moment().add('year',-parseInt(age.start)).startOf('year').valueOf();
        			end = moment().add('year',-parseInt(age.end)).endOf('year').valueOf();
    			}
    			
    		}
    		var status=[];
    		var died="";
    		if(formdata.status!=null){
    			for(var i in formdata.status){
    				if(formdata.status[i]=="Died"){
    					died=true;
    				}else{
    					status.push(formdata.status[i]);
    				}
    			}
    		}
    		widget.get("grid").loading();
    		aw.ajax({
    			url : "api/report/querymemberinfo",
     			dataType : "json",
    			data :{
    				"retireType":formdata.retireType!=""?formdata.retireType:null,
    				"specialTreatment":formdata.specialTreatment!=""?formdata.specialTreatment:null,
    				"retirementPay":formdata.retirementPay!=""?formdata.retirementPay:null,
    				"memberSigning.room.building":subnav.getValue("building"),
    				
    				"personalInfo.annualIncome":  formdata.annualIncome!=""?formdata.annualIncome:null,
    				"personalInfo.graduateSchool" : formdata.graduateSchool!=""?formdata.graduateSchool:null,
            		
            		"personalInfo.qualifications" : formdata.qualifications!=""?formdata.qualifications:null,
            		"personalInfo.sex" : formdata.sex!=""?formdata.sex:null,
            		
    				"personalInfo.birthday" : age.end!="请选择"?end:null,
    				"personalInfo.birthdayEnd" : age.start!="请选择"?start:null,
            		"personalInfo.birthplace" : formdata.birthplace!=""?formdata.birthplace:null,
            		"personalInfo.nativePlace" : formdata.nativePlace!=""?formdata.nativePlace:null,
            		"personalInfo.citizenship" : formdata.citizenship!=""?formdata.citizenship:null,
            		
            		"personalInfo.singleResidence" : formdata.singleResidence!=""?formdata.singleResidence:null,
            		"personalInfo.residenceAddress" : formdata.residenceAddress!=""?formdata.residenceAddress:null,
            		
            		"personalInfo.otherParty" : formdata.otherParty!=""?formdata.otherParty:null,
            		"personalInfo.nationality" : formdata.nationality!=""?formdata.nationality:null,
            		"personalInfo.maritalStatus" : formdata.maritalStatus!=""?formdata.maritalStatus:null,
            		"personalInfo.specialty" : formdata.specialty!=""?formdata.specialty:null,
            		
            		"personalInfo.workUnit" : formdata.workUnit!=""?formdata.workUnit:null,
            		"personalInfo.jobTitle" : formdata.jobTitle!=""?formdata.jobTitle:null,
            		"personalInfo.professionalTitle" : formdata.professionalTitle!=""?formdata.professionalTitle:null,
            		"personalInfo.computerDof" : formdata.computerDof!=""?formdata.computerDof:null,
            		"personalInfo.died" : died!="" ? died : null,
            		"statusIn" : status.length!=0 ? status.toString() : null ,
            		//出行方式
    				"memTravelTool":formdata.memTravelTool!=""?formdata.memTravelTool:null,
    				//生活数据
    				"smoke":formdata.smoke!=""?formdata.smoke:null,
    				//健康数据
    				"memMedicalInsurance" : formdata.memMedicalInsurance!=""?formdata.memMedicalInsurance:null,
            		"memSelfCareStatus" : formdata.memSelfCareStatus!=""?formdata.memSelfCareStatus:null,
            		"bloodType" : formdata.bloodType!=""?formdata.bloodType:null,
    				
    				"diseaseHistory":formdata.diseaseHistory!=""?formdata.diseaseHistory:null,
    				"surgeryHistory":formdata.surgeryHistory!=""?formdata.surgeryHistory:null,
            		//过敏史
    				"allergicType":formdata.allergicHistory!=""?formdata.allergicHistory:null,
    				//兴趣
    				"interest":formdata.interest!=""?formdata.interest:null,
					fetchProperties:"age,member.personalInfo.name," +
							"member.memberSigning.room.number," +
							"member.personalInfo.birthday," +
							"member.personalInfo.died," +
							"member.status.value"
    			},
    			success : function(data){
    				subnav.setText("toggle","条件▼");
    				subnav.show("toexcel");
					widget.get("grid").setData(data);
					widget.setGridTitle(widget);
    			}
    		});
		},
		setGridTitle:function(widget){
			var form =widget.get("form");
    		var subnav = widget.get("subnav");
    		var formdata = formdetail;
//    		diseasH = {};
//    		var surgH 
//    		if($(".J-form-memberinfo-autocomplete-diseaseHistory input").val()==""){
//    			formdata.diseaseHistory="";
//    		}
//    		if($(".J-form-memberinfo-autocomplete-surgeryHistory input").val()==""){
//    			formdata.surgeryHistory="";
//    		}
    		//年龄
    		var age = form.getValue("age");
			var title="查询结果为   ";
			if(subnav.getValue("building")){
				title+="楼栋："+subnav.getText("building")+"  ,";
			}else{
				title+="楼栋：全部"+"  ,";
			}
			
    		if(formdata.status.length!=0){
    			title+=i18ns.get("sale_ship_owner","会员")+"状态："+$(".J-form-memberinfo-select-status .select2-choices").text()+" ,";
    		}
			if(age.start!= "请选择"|| age.end!= "请选择"){
				title+="年龄：" ;
				if(age.start!= "请选择"){
					title+="大于"+age.start;
				}
				if(age.end!= "请选择"){
					title+="小于"+age.end;
				}
				title+="  ,";
			}
			
			if(formdata.annualIncome){
				title+="年收入："+$(".J-form-memberinfo-select-annualIncome .select2-choice .select2-chosen").text()+"  ,";
			}
			if(formdata.graduateSchool){
				title+="毕业学校："+formdata.graduateSchool+"  ,";
			}
			if(formdata.qualifications){
				title+="学历："+$(".J-form-memberinfo-select-qualifications  .select2-chosen").text()+"  ,";
			}
			if(diseasH){
				
				title+="疾病史："+diseasH.name+"  ,";
			}
			if(surgH){
				title+="手术史："+surgH.name+"  ,";
			}
			if(formdata.interest){
				title+="兴趣爱好："+$(".J-form-memberinfo-select-interest  .select2-chosen").text()+"  ,";
			}
			if(formdata.sex){
				title+="性别："+$(".J-form-memberinfo-select-sex  .select2-chosen").text()+"  ,";
			}
			if(formdata.birthplace){
				title+="出生地："+formdata.birthplace+"  ,";
			}
			if(formdata.nativePlace){
				title+="籍贯："+formdata.nativePlace+"  ,";
			}
			if(formdata.citizenship){
				title+="国籍："+$(".J-form-memberinfo-select-citizenship  .select2-chosen").text()+"  ,";
			}
			if(formdata.singleResidence){
				title+="户口类型："+$(".J-form-memberinfo-select-singleResidence .select2-chosen").text()+"  ,";
			}
			if(formdata.residenceAddress){
				title+="户籍地址："+formdata.residenceAddress+"  ,";
			}
			if(formdata.otherParty){
				title+="政治面貌："+$(".J-form-memberinfo-select-otherParty  .select2-chosen").text()+"  ,";
			}
			if(formdata.nationality){
				title+="民族："+$(".J-form-memberinfo-select-nationality  .select2-chosen").text()+"  ,";
			}
			if(formdata.maritalStatus){
				title+="婚姻情况："+$(".J-form-memberinfo-select-maritalStatus  .select2-chosen").text()+"  ,";
			}
			if(formdata.specialty){
				title+="专业："+formdata.specialty+"  ,";
			}
			if(formdata.workUnit){
				title+="单位："+formdata.workUnit+"  ,";
			}
			if(formdata.jobTitle){
				title+="职位："+formdata.jobTitle+"  ,";
			}
			if(formdata.professionalTitle){
				title+="职称："+$(".J-form-memberinfo-select-professionalTitle  .select2-chosen").text()+"  ,";
			}
			if(formdata.retireType){
				title+="离退休类型："+$(".J-form-memberinfo-select-retireType .select2-chosen").text()+"  ,";
			}
			if(formdata.specialTreatment){
				title+="特殊待遇："+$(".J-form-memberinfo-select-specialTreatment .select2-chosen").text()+"  ,";
			}
			if(formdata.retirementPay){
				title+="离退休月收入："+$(".J-form-memberinfo-select-retirementPay .select2-chosen").text()+"  ,";
			}
			if(formdata.computerDof){
				title+="计算机能力："+$(".J-form-memberinfo-select-computerDof .select2-chosen").text()+"  ,";
			}
			if(formdata.memTravelTool){
				title+="出行方式："+$(".J-form-memberinfo-select-memTravelTool .select2-chosen").text()+"  ,";
			}
			if(formdata.smoke){
				title+="是否吸烟："+$(".J-form-memberinfo-select-smoke .select2-chosen").text()+"  ,";
			}
			if(formdata.memMedicalInsurance){
				title+="医保类型："+$(".J-form-memberinfo-select-memMedicalInsurance .select2-chosen").text()+"  ,";
			}
			if(formdata.memSelfCareStatus){
				title+="自理状态："+$(".J-form-memberinfo-select-memSelfCareStatus .select2-chosen").text()+"  ,";
			}
			if(formdata.bloodType){
				title+="血型："+$(".J-form-memberinfo-select-bloodType .select2-chosen").text()+"  ,";
			}
			if(formdata.allergicHistory){
				title+="过敏史："+$(".J-form-memberinfo-select-allergicHistory .select2-chosen").text();
			}
			var result="";
			if(title.charAt(title.length-1)==','){
				result = title.substring(0,title.length-2);
			}else{
				result = title;
			}
			widget.get("grid").setTitle(result);
			return result;
		},
		setBeforeDataToForm:function(widget){
			var form = widget.get("form");
			form.reset();
			
			form.setData(formdetail);
			form.getPlugin("age").reset();
        	form.setValue("age",{
        		start:formdetail.age.start!="请选择"?formdetail.age.start:"",
        		end:formdetail.age.end!="请选择"?formdetail.age.end:""
        	});
        	
			form.setValue("diseaseHistory",diseasH);
			form.setValue("surgeryHistory",surgH);
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"信息查询",
					items :[{
						id:"building",
   						tip:"楼宇",
   						type:"buttongroup",
   						keyField : "pkBuilding",
						valueField : "name",
						url : "api/building/query",
						params : function(){
							return {
								"useType":"Apartment",
								fecthProperties:"pkBuilding,name"
							};
						},
   						showAll:true,
   						showAllFirst:true,
   						handler : function(key,element){
   							widget.refreshGrid(widget);
						}
					},{
						id:"toggle",
						text:"条件▲",
						type :"button",
						handler:function(key,element){
							 $(".J-form").toggle();
							 var toggle = subnav.getText("toggle");
							 if(toggle=="条件▲"){
								 widget.setBeforeDataToForm(widget);
								 subnav.show("toexcel");
								 subnav.setText("toggle","条件▼");
								 $(".J-detail-item").addClass("hidden");
							 }else if(toggle=="条件▼"){
								 subnav.hide("toexcel");
								 subnav.setText("toggle","条件▲");
							 }
							 
						}
					},{
						id :"toexcel",
						type : "button",
						text : "导出",
						show : false,
						handler : function(){
							var form = widget.get("form");
							var formdata = form.getData();
							var subnav=widget.get("subnav");
//							if($(".J-form-memberinfo-autocomplete-diseaseHistory input").val()==""){
//				    			formdata.diseaseHistory="";
//				    		}
//				    		if($(".J-form-memberinfo-autocomplete-surgeryHistory input").val()==""){
//				    			formdata.surgeryHistory="";
//				    		}
				    		
							var age = form.getValue("age");
				    		if(age.start!="请选择" || age.end!="请选择"){
				    			if(age.start!="请选择" && age.end!="请选择" && parseInt(age.start)>parseInt(age.end)){
				    				Dialog.alert({
										content : "请选择可查询的年龄范围！！",
									});
				    				return false;
				    			}else{
				    				start =moment().add('year',-parseInt(age.start)).startOf('year').valueOf();
				        			end = moment().add('year',-parseInt(age.end)).endOf('year').valueOf();
				    			}
				    			
				    		}
				    		var status=[];
				    		var died="";
				    		if(formdata.status!=null){
				    			for(var i in formdata.status){
				    				if(formdata.status[i]=="Died"){
				    					died=true;
				    				}else{
				    					status.push(formdata.status[i]);
				    				}
				    			}
				    		}
				    		var title = widget.setGridTitle(widget);
        					window.open("api/memberinforeport/toexcel?" +
        							"retireType="+(formdata.retireType)+
		            				"&specialTreatment="+(formdata.specialTreatment)+
		            				"&retirementPay="+(formdata.retirementPay)+
		            				"&memberSigning.room.building="+subnav.getValue("building")+
		            				"&personalInfo.annualIncome="+(formdata.annualIncome)+
		            				"&personalInfo.graduateSchool="+(formdata.graduateSchool)+
				            		
				            		"&personalInfo.qualifications=" + (formdata.qualifications)+
				            		"&personalInfo.sex=" + (formdata.sex)+
				            		
				            		"&personalInfo.birthday="+(age.end!="请选择"?end:(""))+
		            				"&personalInfo.birthdayEnd=" + (age.start!="请选择"?start:(""))+
				            		"&personalInfo.birthplace=" + (formdata.birthplace)+
				            		"&personalInfo.nativePlace=" + (formdata.nativePlace)+
				            		"&personalInfo.citizenship=" + (formdata.citizenship)+
				            		
				            		"&personalInfo.singleResidence=" + (formdata.singleResidence)+
				            		"&personalInfo.residenceAddress=" + (formdata.residenceAddress)+
				            		
				            		"&personalInfo.otherParty=" + (formdata.otherParty)+
				            		"&personalInfo.nationality=" + (formdata.nationality)+
				            		"&personalInfo.maritalStatus=" + (formdata.maritalStatus)+
				            		"&personalInfo.specialty=" + (formdata.specialty)+
				            		
				            		"&personalInfo.workUnit=" + (formdata.workUnit)+
				            		"&personalInfo.jobTitle=" + (formdata.jobTitle)+
				            		"&personalInfo.professionalTitle=" + (formdata.professionalTitle)+
				            		"&personalInfo.computerDof=" + (formdata.computerDof)+
				            		"&personalInfo.died=" + died+
				            		"&statusIn="+status.toString()+
				            		//出行方式
		            				"&memTravelTool="+(formdata.memTravelTool)+
		            				//生活数据
		            				"&smoke="+(formdata.smoke)+
		            				//健康数据
		            				"&memMedicalInsurance=" + (formdata.memMedicalInsurance)+
				            		"&memSelfCareStatus=" + (formdata.memSelfCareStatus)+
				            		"&bloodType=" + (formdata.bloodType)+
		            				
		            				"&diseaseHistory="+(!diseasH?"":diseasH.pkDiseaseDetail)+
		            				"&surgeryHistory="+(!surgH?"":surgH.pkDiseaseDetail)+
				            		//过敏史
		            				"&allergicType="+(formdata.allergicHistory)+
		            				//兴趣
		            				"&interest="+(formdata.interest)+
		            				"&title="+title+
            						"&fetchProperties=age,member.personalInfo.name," +
            								"member.memberSigning.room.number," +
            								"member.personalInfo.birthday," +
            								"member.personalInfo.died," +
            								"status"
    								);
    					   return false;
        				}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					columns : [{
						name : "member.personalInfo",
						label : i18ns.get("sale_ship_owner","会员"),
						className:"twoColumn",
						format:function(value,row){
							return row.member.memberSigning.room.number+"  "+value.name;
						},
					},{
						name : "age",
						label : "年龄",
						className:"twoColumn",
						format:function(value,row){
							if(value==0){
								return "";
							}else{
								return value;
							}
						}
					},{
						name : "member.personalInfo.birthday",
						label : "出生年月",
						className:"twoColumn",
						format:"date"
					},{
						name : "member.status.value",
						label : i18ns.get("sale_ship_owner","会员")+"状态",
						className:"threeColumn",
					},{
						name : "member.personalInfo.died",
						label : "是否过世",
						className:"threeColumn",
						format:function(value,row){
							if(value){
								return "过世";
							}else{
								return "正常";
							}
						}
					}]
				}
			});
			this.set("grid",grid);
			
			var form = new Form({
				parentNode:".J-form",
                    model : {
                    	id:"memberinfo",
    					layout : formTpl,
    					saveText : "确认",
    					saveaction : function(){
    						$(".J-form").toggle();
    			    		$(".J-btn-toggle").trigger('click');
    						$(".J-detail-select").attr("class","icon-angle-down J-detail-select");
    						$(".J-detail-item").addClass("hidden");
    						widget.refreshGrid(widget);
	                    },
	                    cancelText : "取消",
	                    cancelaction : function(){
	                    	widget.setBeforeDataToForm(widget);
	                    	$(".J-form").toggle();
		            		$(".J-btn-toggle").trigger('click');
		            		$(".J-detail-select").attr("class","icon-angle-down J-detail-select");
		            		$(".J-detail-item").addClass("hidden");
		            		subnav.show("toexcel");
	                    	subnav.setText("toggle","条件▼");
	                    },
	                    items : [{
								name : "status",
	                            type : "select",
	                            multi : true,
	                            options : enums["com.eling.elcms.member.model.Member.Status"],
							},{
								 name : "age",
                                 type : CustType,
							},{
								 name : "annualIncome",
                                 type : "select",
                                 options:enums["com.eling.elcms.basedoc.model.AnnualIncome"],
							},{
								 name : "graduateSchool",
                                 type : "text",
							},{
								 name : "qualifications",
                                 type : "select",
                                 options:enums["com.eling.elcms.basedoc.model.Qualifications"],
							},{
								 name : "diseaseHistory",
                                 type : "autocomplete",
                                 url:"api/diseasedetail/query",
	     						 keyField:"pkDiseaseDetail",
	     						 valueField:"name",
	     						 queryParamName : "s",
	     						 useCache:false,
	     						 maxItemsToShow:10,
	     						 params:function(){
	     							return{
	     								searchProperties : "name",
	     								fetchProperties:"pkDiseaseDetail,name",
	     							}
	     						},
	    						format : function(data){//格式化返回的结果
	    							if(data!=null){
	    								return data.name;
	    							}
	    						},
	    						onItemSelect : function(data){
	    							diseas=data;
	    							
    		                    },
							},{
								 name : "surgeryHistory",
								 type : "autocomplete",
                                 url:"api/diseasedetail/query",
	     						 keyField:"pkDiseaseDetail",
	     						 valueField:"name",
	     						 queryParamName : "s",
	     						 useCache:false,
	     						 maxItemsToShow:10,
	     						 params:function(){
	     							return{
	     								searchProperties : "name",
	     								fetchProperties:"pkDiseaseDetail,name",
	     							}
	     						},
	    						format : function(data){//格式化返回的结果
	    							if(data!=null){
	    								return data.name;
	    							}
	    						},
	    						onItemSelect : function(data){
    								surg=data;
    		                    },
							},{
								 name : "interest",
                                 type : "select",
                                 url : "api/interest/query",
                                 keyField : "pkInterest",
                                 valueField : "name",
                                 params:function(){
 	     							return{
 	     								fetchProperties:"pkInterest,name",
 	     							}
 	     						},
							},{
								 name : "sex",
                                 type : "select",
                                 options:enums["com.eling.elcms.basedoc.model.Sex"],
							},{
								 name : "birthplace",
                                 type : "text",
							},{
								 name : "nativePlace",
								 type : "text",
							},{
								 name : "citizenship",
								 type : "select",
								 keyField : "pkCountry",
		                         valueField : "name",
								 url : "api/country/query",
								 params:function(){
	 	     							return{
	 	     								fetchProperties:"pkCountry,name",
	 	     							}
	 	     						},
							},{
								 name : "singleResidence",
								 type : "select",
								 options:[{
									 key:"true",
									 value:"独立户口"
								 },{
									 key:"false",
									 value:"集体户口"
								 }]
							},{
								 name : "residenceAddress",
								 type : "text",
							},{
								 name : "otherParty",
								 type : "select",
								 options:enums["com.eling.elcms.basedoc.model.OtherParty"],
							},{
								 name : "nationality",
								 type : "select",
								 options:enums["com.eling.elcms.basedoc.model.Nationality"],
							},{
								 name : "maritalStatus",
								 type : "select",
								 options:enums["com.eling.elcms.basedoc.model.MaritalStatus"],
							},{
								 name : "specialty",
								 type : "text",
							},{
								 name : "workUnit",
								 type : "text",
							},{
								 name : "jobTitle",
								 type : "text",
							},{
								 name : "professionalTitle",
								 type : "select",
								 options:enums["com.eling.elcms.basedoc.model.ProfessionalTitle"],
							},{
								 name : "retireType",
								 type : "select",
								 options:enums["com.eling.elcms.member.model.RetireType"],
							},{
								 name : "specialTreatment",
								 type : "select",
								 options:enums["com.eling.elcms.member.model.SpecialTreatment"],
							},{
								 name : "retirementPay",
								 type : "select",
								 options:enums["com.eling.elcms.member.model.RetirementPay"],
							},{
								 name : "computerDof",
								 type : "select",
								 options:enums["com.eling.elcms.basedoc.model.PersonalInfo.KnowDegree"],
							},{
								 name : "memTravelTool",
								 type : "select",
								 options:enums["com.eling.elcms.basedoc.model.Vehicle"],
							},{
								 name : "smoke",
								 type : "select",
								 options:[{
									 key:"true",
									 value:"是"
								 },{
									 key:"false",
									 value:"否"
								 }],
							},{
								 name : "memMedicalInsurance",
								 type : "select",
								 url:"api/medicalinsurance/query",
								 keyField:"pkMedicalInsurance",
								 valueField:"name",
								 params:function(){
	 	     							return{
	 	     								fetchProperties:"pkMedicalInsurance,name",
	 	     							}
	 	     						},
							},{
								 name : "memSelfCareStatus",
								 type : "select",
								 url:"api/selfcare/query",
								 keyField:"pkSelfCare",
								 valueField:"name",
								 params:function(){
	 	     							return{
	 	     								fetchProperties:"pkSelfCare,name",
	 	     							}
	 	     						},
							},{
								 name : "bloodType",
								 type : "select",
								 options:enums["com.eling.elcms.basedoc.model.BloodType"],
							},{
								 name : "allergicHistory",
								 type : "select",
								 options:enums["com.eling.elcms.basedoc.model.AllergicType"],
							}]
                    	}
				});
			this.set("form",form);
		},
		afterInitComponent:function(params,widget){
			$(".J-detail-item").addClass("hidden");
		}
	});
	module.exports = MemberInfo;
});
