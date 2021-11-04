define(function(require, exports, module){
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Form=require("form-1.0.0");
	var Subnav = require("subnav-1.0.0");
	var store =require("store");
	var Wizard = require("wizard");
	var Profile=require("profile");
	var Dialog=require("dialog");
	var Grid = require("grid-1.0.0");
	var activeUser = store.get("user");
	var HandlerBars=require("handlebars");
	var enmu = require("enums");
	var Properties=require("./properties");
	var formTpl=require("./lifemodeldetails.tpl");
	var modeltrajectoryTpl=require("./modeltrajectory.tpl");
	require("./lifemodeldetails.css");
	var pkmember=null;
	var pklifemodelmember = null;
	var pkPersonalInfo = null;
	var birthday = null;
	var template="<div class='el-lifemodelmember'>"+
	 "<div class='J-subnav'></div>"+
	 "<div class='J-grid hidden'></div>"+
	 "<div class='J-wizard hidden'></div>"+
	 "<div class='J-verform hidden'></div>"+
	 "<div class='J-verform2 hidden'></div>"+
	 "<div class='J-verform3 hidden'></div>"+
	 "<div class='J-verform4 hidden'></div>"+
	 "<div id='detailsForm' class='J-detailsForm hidden'></div>"+
	"<div id='modeltrajectory' class='J-modeltrajectory hidden'></div>"
	 "</div>";
	var lifemodelmember = ELView.extend({
		events : {
		},
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
        		parentNode:".J-subnav",
				model : {
					title:"生活模型",
					items : [{
						placeholder:"输入姓名进行查询",
						id : "search",
						type : "search",
						handler : function(str) {
							var g = widget.get("grid");
							var subnav=widget.get("subnav");
							var obj={
								personalInfoName:str
	    	        				};
							aw.ajax({
								url:"api/lifemodelmember/queryallmember",
								data:obj,
								dataType:"json",
								success:function(data){
									widget.get("subnav").hide(["return","save","update","trajectory"]).show(["search","search2"]);
									g.setData(data);
								}
							});
						}
					},{
                        placeholder:"输入特征进行查询",
                        id : "search2",
                        type : "search",
                        handler : function(str) {
                            var g = widget.get("grid");
                            var subnav=widget.get("subnav");
                            var obj={
                                features:str
                            };
                            aw.ajax({
                                url:"api/lifemodelmember/queryallmember",
                                data:obj,
                                dataType:"json",
                                success:function(data){
                                    widget.get("subnav").hide(["return","save","update","trajectory"]).show(["search","search2"]);
                                    g.setData(data);
                                }
                            });
                        }
                    },{
						id:"save",
						text:"保存",
						type:"button",
						show : false,
						handler:function(){
							aw.ajax({
								url : "api/lifemodelmember/save",
								data : $("#baseinfo").serialize()+"&"+$("#basicfeaturemember").serialize()+"&"+$("#happymember").serialize()+"&"+$("#healthymember").serialize()+"&"+$("#lifemember").serialize()+"&pkMember="+pkmember+"&pkLifeModelMember="+pklifemodelmember,
								dataType:"json",
								success : function(data){
									// var uploadstr="api/attachment/personalphoto/"+pkPersonalInfo;
                                    var uploadstr="api/upimg/headImgUpload/"+pkPersonalInfo;
									if(pkPersonalInfo){
										//上传图片
										profile.upload(uploadstr);
									}
									widget.get("subnav").show(["search","search2"]).hide(["save","return","update","trajectory"]);
									widget.show([".J-grid"]).hide([".J-wizard",".J-detailsForm",".J-modeltrajectory"]);
									widget.get("grid").refresh();
									widget.get("subnav").setTitle("生活模型");
									widget.get("verform").reset();
									widget.get("verform2").reset();
									widget.get("verform3").reset();
									widget.get("verform4").reset();
									widget.get("wizard").first();


								}
							});
						},

					},{
						id:"return",
						type:"button",
						text:"返回",
						show : false,
						handler:function(){
							widget.get("subnav").setTitle("生活模型");
							widget.show([".J-grid"]).hide([".J-wizard",".J-detailsForm",".J-modeltrajectory"]);
							widget.get("subnav").hide(["return","save","update","trajectory"]).show(["search","search2"]);
						}
					},{
						id:"update",
						type:"button",
						text:"完善资料",
						show : false,
						handler:function(){
							widget.hide([".J-grid",".J-detailsForm",".J-modeltrajectory"]).show([".J-wizard"]);
							widget.get("subnav").hide(["search","search2","update","trajectory"]).show(["return","save"]);
							$(".J-wizard .J-button-area").addClass("hidden");
						}
					},{
						id:"trajectory",
						type:"button",
						text:"模型轨迹",
						show : false,
						handler:function(){
							aw.ajax({
								url : "api/lifemodelmember/querymodeltrajectory",
								data : {
									pkmember:pkmember,
									birthday:birthday
								},
								success : function(data){
                                    var arr = ['bg1','bg2','bg3','bg4','bg5'];
                                    for(var i=0;i<data.length;i++){
                                        if((i+1)%5==1){
                                            data[i].bgc=arr[0];
                                        }
                                        if((i+1)%5==2){
                                            data[i].bgc=arr[1];
                                        }
                                        if((i+1)%5==3){
                                            data[i].bgc=arr[2];
                                        }
                                        if((i+1)%5==4){
                                            data[i].bgc=arr[3];
                                        }
                                        if((i+1)%5==0){
                                            data[i].bgc=arr[4];
                                        }
                                    }
									widget.get("subnav").setTitle("模型轨迹");
									var html=HandlerBars.compile(modeltrajectoryTpl)(data);
									$("#modeltrajectory").html(html);
									$("#modeltrajectory").removeClass("hidden");
									widget.hide([".J-grid",".J-detailsForm",".J-wizard"]).show([".J-modeltrajectory"]);
									widget.get("subnav").hide(["search","search2","update","save","trajectory"]).show(["return"]);
									$(".J-wizard .J-button-area").addClass("hidden");


								}
							});

						}
					}]
				}
        	});
        	this.set("subnav",subnav);
        	
        	var grid=new Grid({
        		parentNode:".J-grid",
        		url : "api/lifemodelmember/queryallmember",
        		params : function() {

    				var obj={};
    				return obj;
    			},
        		model : {
        			columns : [{
						key:"name",
						className:"name",
						name:"会员姓名",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){

								if(data.pkLifeModelMember !=null){
									aw.ajax({
										url : "api/lifemodelmember/query",
										data : {
											pkLifeModelMember:data.pkLifeModelMember,
											fetchProperties:Properties.lifemodemember
										},
										success : function(data){
											aw.ajax({
												url: "api/lifemodelmember/queryinterestgroupbypkmember",
												async:false,
												data: {
													pkmember: data[0].member.pkMember
												},
												success : function(data1){
													data[0].interestgroup = data1;
												}
											})
											pklifemodelmember = data[0].pkLifeModelMember;
											pkmember = data[0].member.pkMember;
											pkPersonalInfo = data[0].member.personalInfo.pkPersonalInfo;
											birthday = data[0].member.personalInfo.birthday;
											data[0].age = jsGetAge(data[0].member.personalInfo.birthdayString);
                                            if(data[0].member.educations.length>0){
                                                data[0].specialty = data[0].member.educations[0].specialty;
                                            }else{
                                                data[0].specialty = "";
                                            }
											data[0].name = data[0].member.personalInfo.name;
											data[0].nameEn = data[0].member.personalInfo.nameEn;
											data[0].sex = data[0].member.personalInfo.sex.value;
											data[0].birthdayString = data[0].member.personalInfo.birthdayString;
											data[0].number = data[0].member.memberSigning.room.number;
											if(data[0].member.personalInfo.phone != ""){
												data[0].phone = data[0].member.personalInfo.phone;
											}else{
												data[0].phone = data[0].member.personalInfo.mobilePhone;
											}

											if(data[0].member.personalInfo.maritalStatus == "Unmarried"){
												data[0].maritalStatus = "未婚";
											}else if(data[0].member.personalInfo.maritalStatus == "Married"){
												data[0].maritalStatus = "已婚";
											}else if(data[0].member.personalInfo.maritalStatus == "Remarry"){
												data[0].maritalStatus = "再婚";
											}else if(data[0].member.personalInfo.maritalStatus == "Divorced"){
												data[0].maritalStatus = "离异";
											}else if(data[0].member.personalInfo.maritalStatus == "Widowed"){
												data[0].maritalStatus = "丧偶";
											}else{
												data[0].maritalStatus = "未知";
											}
                                            if(data[0].lifeMember.medicalInsuranceType != null){
                                                data[0].medicalInsuranceType = data[0].lifeMember.medicalInsuranceType.value;
                                            }
											//生活数据
											if(data[0].lifeMember.drink != null){
												if(data[0].lifeMember.drink.key == "Never"){
													data[0].drink = "";
												}else{
													data[0].drink = data[0].lifeMember.drink.value;
												}
											}
											if(data[0].lifeMember.workAndRest != null){
												if(data[0].lifeMember.workAndRest.key == "NormalSleep"){
													data[0].workAndRest = "";
												}else{
													data[0].workAndRest = data[0].lifeMember.workAndRest.value;
												}
											}
											if(data[0].lifeMember.selfCareAbility != null){
												if(data[0].lifeMember.selfCareAbility.key == "SelfCare"){
													data[0].selfCareAbility = "";
												}else{
													data[0].selfCareAbility = data[0].lifeMember.selfCareAbility.value;
												}
											}
											if(data[0].lifeMember.consumptionCiew != null){
												if(data[0].lifeMember.consumptionCiew.key == "NormalConsumption"){
													data[0].consumptionCiew = "";
												}else{
													data[0].consumptionCiew = data[0].lifeMember.consumptionCiew.value;
												}
											}
											if(data[0].lifeMember.smokingStatus != null){
												if(data[0].lifeMember.smokingStatus.key == "NoSmoking"){
													data[0].smokingStatus = "";
												}else{
													data[0].smokingStatus = data[0].lifeMember.smokingStatus.value;
												}
											}


											//健康数据
											if(data[0].healthyMember.coronaryDisease != null){
												if(data[0].healthyMember.coronaryDisease.key == "Nothing"){
													data[0].coronaryDisease = "";
												}else{
													data[0].coronaryDisease = data[0].healthyMember.coronaryDisease.value;
												}
											}
											if(data[0].healthyMember.osteoporosis != null){
												if(data[0].healthyMember.osteoporosis.key == "NoOsteoporosis"){
													data[0].osteoporosis = "";
												}else{
													data[0].osteoporosis = data[0].healthyMember.osteoporosis.value;
												}
											}
											if(data[0].healthyMember.diabetes != null){
												if(data[0].healthyMember.diabetes.key == "NoDiabetes"){
													data[0].diabetes = "";
												}else{
													data[0].diabetes = data[0].healthyMember.diabetes.value;
												}
											}
											if(data[0].healthyMember.tumour != null){
												if(data[0].healthyMember.tumour.key == "NoTumour"){
													data[0].tumour = "";
												}else{
													data[0].tumour = data[0].healthyMember.tumour.value;
												}
											}
											if(data[0].healthyMember.senileDementia != null){
												if(data[0].healthyMember.senileDementia.key == "NoSenileDementia"){
													data[0].senileDementia = "";
												}else{
													data[0].senileDementia = data[0].healthyMember.senileDementia.value;
												}
											}if(data[0].healthyMember.hearing != null){
												if(data[0].healthyMember.hearing.key == "NormalHearing"){
													data[0].hearing = "";
												}else{
													data[0].hearing = data[0].healthyMember.hearing.value;
												}
											}
											if(data[0].healthyMember.vision != null){
												if(data[0].healthyMember.vision.key == "NormalVision"){
													data[0].vision = "";
												}else{
													data[0].vision = data[0].healthyMember.vision.value;
												}
											}
											if(data[0].healthyMember.hypertension != null){
												if(data[0].healthyMember.hypertension.key == "NoHypertension"){
													data[0].hypertension = "";
												}else{
													data[0].hypertension = data[0].healthyMember.hypertension.value;
												}
											}
											if(data[0].healthyMember.heartDisease != null){
												if(data[0].healthyMember.heartDisease.key == "Normal"){
													data[0].heartDisease = "";
												}else{
													data[0].heartDisease = data[0].healthyMember.heartDisease.value;
												}
											}


											//快乐数据
											if(data[0].happyMember.takeExercise != null){
												if(data[0].happyMember.takeExercise.key == "NormalExercise"){
													data[0].takeExercise = "";
												}else{
													data[0].takeExercise = data[0].happyMember.takeExercise.value;
												}
											}
											if(data[0].happyMember.tourism != null){
												if(data[0].happyMember.tourism.key == "NormalTourism"){
													data[0].tourism = "";
												}else{
													data[0].tourism = data[0].happyMember.tourism.value;
												}
											}
											if(data[0].happyMember.interpersonal != null){
												if(data[0].happyMember.interpersonal.key == "NormalCommunication"){
													data[0].interpersonal = "";
												}else{
													data[0].interpersonal = data[0].happyMember.interpersonal.value;
												}
											}
                                            // if(data[0].happyMember.interestgroup != null){
                                            //     if(data[0].happyMember.interestgroup.key == "NormalCommunication"){
                                            //         data[0].interestgroup = "";
                                            //     }else{
                                            //         data[0].interestgroup = data[0].happyMember.interestgroup.value;
                                            //     }
                                            // }

											// data[0].img = "api/attachment/personalphoto/"+data[0].member.personalInfo.pkPersonalInfo;
                                            data[0].img = "https://szeling-master.oss-cn-shenzhen.aliyuncs.com/qinheyuan/"+data[0].member.personalInfo.pkPersonalInfo;
											widget.get("subnav").setTitle("详情");
											var html=HandlerBars.compile(formTpl)(data[0]);
											$("#detailsForm").html(html);
											$("#detailsForm").removeClass("hidden");
											widget.hide([".J-grid",".J-modeltrajectory"]).show([".J-detailsForm"]);
											widget.get("subnav").hide(["search","search2","return","save"]).show(["return","update","trajectory"]);
											var grid=widget.get("grid");
											var profile =widget.get("profile");
											var verform = widget.get("verform");
											var verform2 = widget.get("verform2");
											var verform3 = widget.get("verform3");
											var verform4 = widget.get("verform4");
											profile.reset();
											verform.reset();
											verform2.reset();
											verform3.reset();
											verform4.reset();
											widget.get("wizard").first();
											// profile.loadPicture("api/attachment/personalphoto/"+data[0].member.personalInfo.pkPersonalInfo);
											profile.setData(data[0].member.personalInfo);
											if(data[0].basicFeatureMember.belief != null){
												profile.setValue("belief",data[0].basicFeatureMember.belief.key);
											}
											if(data[0].basicFeatureMember.securityCard != null){
												profile.setValue("securityCard",data[0].basicFeatureMember.securityCard.key);
											}
											verform.setData(data[0].basicFeatureMember);
											verform2.setData(data[0].lifeMember);
											verform3.setData(data[0].healthyMember);
											verform4.setData(data[0].happyMember);

										}

									});
								}else{
									aw.ajax({
										url : "api/member/query",
										data : {
											pkMember:data.pkMember,
											fetchProperties:Properties.mem_baseinfo
										},
										success : function(data){
											aw.ajax({
												url: "api/lifemodelmember/queryinterestgroupbypkmember",
												async:false,
												data: {
													pkmember: data[0].pkMember
												},
												success : function(data1){
													data[0].interestgroup = data1;
												}
											})
											pklifemodelmember = '';
											pkmember = data[0].pkMember;
											pkPersonalInfo = data[0].personalInfo.pkPersonalInfo;
											birthday = data[0].personalInfo.birthday;
											data[0].age = jsGetAge(data[0].personalInfo.birthdayString);
                                            if(data[0].educations.length>0){
                                                data[0].specialty = data[0].educations[0].specialty;
                                            }else{
                                                data[0].specialty = "";
                                            }
											data[0].name = data[0].personalInfo.name;
											data[0].nameEn = data[0].personalInfo.nameEn;
											data[0].sex = data[0].personalInfo.sex.value;
											data[0].birthdayString = data[0].personalInfo.birthdayString;
											data[0].number = data[0].memberSigning.room.number;
											if(data[0].personalInfo.phone != ""){
												data[0].phone = data[0].personalInfo.phone;
											}else{
												data[0].phone = data[0].personalInfo.mobilePhone;
											}
											if(data[0].personalInfo.maritalStatus == "Unmarried"){
												data[0].maritalStatus = "未婚";
											}else if(data[0].personalInfo.maritalStatus == "Married"){
												data[0].maritalStatus = "已婚";
											}else if(data[0].personalInfo.maritalStatus == "Remarry"){
												data[0].maritalStatus = "再婚";
											}else if(data[0].personalInfo.maritalStatus == "Divorced"){
												data[0].maritalStatus = "离异";
											}else if(data[0].personalInfo.maritalStatus == "Widowed"){
												data[0].maritalStatus = "丧偶";
											}else{
												data[0].maritalStatus = "未知";
											}
											var grid=widget.get("grid");
											var profile =widget.get("profile");
											var verform = widget.get("verform");
											var verform2 = widget.get("verform2");
											var verform3 = widget.get("verform3");
											var verform4 = widget.get("verform4");
											profile.reset();
											verform.reset();
											verform2.reset();
											verform3.reset();
											verform4.reset();
											widget.get("wizard").first();
											// profile.loadPicture("api/attachment/personalphoto/"+data[0].personalInfo.pkPersonalInfo);
											profile.setData(data[0].personalInfo);
											// data[0].img = "api/attachment/personalphoto/"+data[0].personalInfo.pkPersonalInfo;
                                            data[0].img = "https://szeling-master.oss-cn-shenzhen.aliyuncs.com/qinheyuan/"+data[0].personalInfo.pkPersonalInfo;
											widget.get("subnav").setTitle("详情");
											var html=HandlerBars.compile(formTpl)(data[0]);
											$("#detailsForm").html(html);
											$("#detailsForm").removeClass("hidden");
											widget.hide([".J-grid",".J-modeltrajectory"]).show([".J-detailsForm"]);
											widget.get("subnav").hide(["search","search2","return","save"]).show(["return","update","trajectory"]);

										}

									});
								}
							}
						}]
					},{
        				key:"sex",
        				className:"sex",
        				name:"性别"
					},{
						key:"number",
						className:"number",
						name:"房间"
					},{
						key:"phone",
						className:"phone",
						name:"联系方式"
					},{
						key:"features",
						className:"features",
						name:"特征"
					},{
						key:"operate",
						className:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								if(data.pkLifeModelMember !=null){
									aw.ajax({
										url : "api/lifemodelmember/query",
										data : {
											pkLifeModelMember:data.pkLifeModelMember,
											fetchProperties:Properties.lifemodemember
										},
										success : function(data){
											pklifemodelmember = data[0].pkLifeModelMember;
											pkmember = data[0].member.pkMember;
											pkPersonalInfo = data[0].member.personalInfo.pkPersonalInfo;
											var grid=widget.get("grid");
											var profile =widget.get("profile");
											var verform = widget.get("verform");
											var verform2 = widget.get("verform2");
											var verform3 = widget.get("verform3");
											var verform4 = widget.get("verform4");
											profile.reset();
											verform.reset();
											verform2.reset();
											verform3.reset();
											verform4.reset();
											widget.get("wizard").first();
											// profile.loadPicture("api/attachment/personalphoto/"+data[0].member.personalInfo.pkPersonalInfo);
											profile.setData(data[0].member.personalInfo);
											if(data[0].basicFeatureMember.belief != null){
												profile.setValue("belief",data[0].basicFeatureMember.belief.key);
											}
											if(data[0].basicFeatureMember.securityCard != null){
												profile.setValue("securityCard",data[0].basicFeatureMember.securityCard.key);
											}
                                            if(data[0].lifeMember.medicalInsuranceType != null){
                                                profile.setValue("medicalInsuranceType",data[0].lifeMember.medicalInsuranceType.key);
                                            }
											verform.setData(data[0].basicFeatureMember);
											verform2.setData(data[0].lifeMember);
											verform3.setData(data[0].healthyMember);
											verform4.setData(data[0].happyMember);
											widget.hide([".J-grid",".J-modeltrajectory",".J-detailsForm"]).show([".J-wizard"]);
											widget.get("subnav").hide(["search","search2","update","trajectory"]).show(["return","save"]);
											$(".J-wizard .J-button-area").addClass("hidden");

										}

									});
								}else{
									aw.ajax({
										url : "api/member/query",
										data : {
											pkMember:data.pkMember,
											fetchProperties:Properties.mem_baseinfo
										},
										success : function(data){
											pklifemodelmember = '';
											pkmember = data[0].pkMember;
											pkPersonalInfo = data[0].personalInfo.pkPersonalInfo;
											var grid=widget.get("grid");
											var profile =widget.get("profile");
											var verform = widget.get("verform");
											var verform2 = widget.get("verform2");
											var verform3 = widget.get("verform3");
											var verform4 = widget.get("verform4");
											profile.reset();
											verform.reset();
											verform2.reset();
											verform3.reset();
											verform4.reset();
											widget.get("wizard").first();
											// profile.loadPicture("api/attachment/personalphoto/"+data[0].personalInfo.pkPersonalInfo);
											profile.setData(data[0].personalInfo);
											widget.hide([".J-grid",".J-modeltrajectory",".J-detailsForm"]).show([".J-wizard"]);
											widget.get("subnav").hide(["search","search2","update","trajectory"]).show(["return","save"]);
											$(".J-wizard .J-button-area").addClass("hidden");

										}

									});
								}

							}
						}]
					}]
    			}
    		 });
    		 this.set("grid",grid);

			var wizard=new Wizard({
				parentNode:".J-wizard",
				model:{
					items:[{
						id:"step1",
						title:"基本信息"
					},{
						id:"step2",
						title:"基本特征"
					},{
						id:"step3",
						title:"生活"
					},{
						id:"step4",
						title:"健康"
					},{
						id:"step5",
						title:"快乐"
					}]
				}
			});
			this.set("wizard",wizard);
    		 
        	 var profile=new Profile({
				 saveaction : function() {
          			var data=$("#baseinfo").serialize();
          			aw.saveOrUpdate("api/lifemodelmember/save",data,function(data){
          				widget.hide([".J-form"]).show([".J-grid"]);
     					widget.get("subnav").show(["search","search2","save","update","trajectory"]).hide(["return"]);
     					widget.get("grid").refresh();
     				});
     			 },
     			 cancelaction:function(){
					 $("#step1").addClass("hidden");
					 $("#step2").removeClass("hidden");
					 $("#step3").addClass("hidden");
					 $("#step4").addClass("hidden");
     					return false;
     			 },
				 parentNode:"#step1",
                 model:{
					 id:"baseinfo",
					 items:Properties.member_baseinfo_items
				 }
        	 });
        	 this.set("profile",profile);

			var verform = new Form({
				parentNode:"#step2",
				model:{
					id:"basicfeaturemember",
					items:[{
						name:"pkBasicFeatureMember",
						type:"hidden"
					}/*,{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					}*/,{
						name:"tastePreference",
						label:"口味偏好",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.BasicFeatureMember.TastePreference"
					},{
						name:"dietTaboo",
						label:"饮食禁忌",
						exValidate: function(value){
							if(value.length>30){
								return "不能超过30个字符";
							}else{
								return true;
							}
						}
					},{
						name:"hobbiesAndInterests",
						label:"兴趣爱好",
						exValidate: function(value){
							if(value.length>30){
								return "不能超过30个字符";
							}else{
								return true;
							}
						}
					},{
						name:"nature",
						label:"性格",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.BasicFeatureMember.Nature"
					},{
						name:"actionPower",
						label:"行动力",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.BasicFeatureMember.ActionPower"
					},{
						name:"memorandum",
						label:"服务备忘录",
						type:"textarea",
						height:200,
						exValidate: function(value){
							if(value.length>1023){
								return "描述不能超过1023个字";
							}else{
								return true;
							}
						}
					}]
				},
			});
			this.set("verform",verform);

			var verform2 = new Form({
				parentNode:"#step3",
				model:{
					id:"lifemember",
					items:[{
						name:"pkLifeMember",
						type:"hidden"
					}/*,{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					}*/,{
						name:"drink",
						label:"饮酒",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.LifeMember.Drink"
					},{
						name:"workAndRest",
						label:"作息",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.LifeMember.WorkAndRest"
					},{
						name:"selfCareAbility",
						label:"自理能力",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.LifeMember.SelfCareAbility"
					},{
						name:"consumptionCiew",
						label:"消费观",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.LifeMember.ConsumptionCiew"
					},{
						name:"smokingStatus",
						label:"是否抽烟",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.LifeMember.SmokingStatus"
					}]
				},
			});
			this.set("verform2",verform2);

			var verform3 = new Form({
				parentNode:"#step4",
				model:{
					id:"healthymember",
					items:[{
						name:"pkHealthyMember",
						type:"hidden"
					}/*,{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					}*/,{
						name:"coronaryDisease",
						label:"冠心病",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HealthyMember.CoronaryDisease"
					},{
						name:"osteoporosis",
						label:"骨质疏松",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HealthyMember.Osteoporosis"
					},{
						name:"diabetes",
						label:"糖尿病",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HealthyMember.Diabetes"
					},{
						name:"tumour",
						label:"肿瘤",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HealthyMember.Tumour"
					},{
						name:"senileDementia",
						label:"老年痴呆",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HealthyMember.SenileDementia"
					},{
						name:"hearing",
						label:"听力",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HealthyMember.Hearing"
					},{
						name:"vision",
						label:"视力",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HealthyMember.Vision"
					},{
						name:"hypertension",
						label:"高血压",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HealthyMember.Hypertension"
					},{
						name:"heartDisease",
						label:"心理疾病",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HealthyMember.HeartDisease"
					}]
				},
			});
			this.set("verform3",verform3);


			var verform4 = new Form({
				parentNode:"#step5",
				model:{
					id:"happymember",
					items:[{
						name:"pkHappyMember",
						type:"hidden"
					}/*,{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					}*/,{
						name:"takeExercise",
						label:"锻炼",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HappyMember.TakeExercise"
					},{
						name:"tourism",
						label:"旅游",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HappyMember.Tourism"
					},{
						name:"interpersonal",
						label:"人际交往",
						type:"select",
						url:"api/enum/com.eling.elcms.lifemodelmember.model.HappyMember.Interpersonal"
					},{
                        name:"interestgroup",
                        label:"兴趣小组",
                        type:"select",
                        url:"api/enum/com.eling.elcms.lifemodelmember.model.HappyMember.Interestgroup"
                    }]
				},
			});
			this.set("verform4",verform4);

			function jsGetAge(strBirthday){
				var returnAge;
				var strBirthdayArr=strBirthday.split("-");
				var birthYear = strBirthdayArr[0];
				var birthMonth = strBirthdayArr[1];
				var birthDay = strBirthdayArr[2];

				d = new Date();
				var nowYear = d.getFullYear();
				var nowMonth = d.getMonth() + 1;
				var nowDay = d.getDate();

				if(nowYear == birthYear){
					returnAge = 0;//同年 则为0岁
				}
				else{
					var ageDiff = nowYear - birthYear ; //年之差
					if(ageDiff > 0){
						if(nowMonth == birthMonth) {
							var dayDiff = nowDay - birthDay;//日之差
							if(dayDiff < 0){
								returnAge = ageDiff;
							}else{
								returnAge = ageDiff+1;
							}
						}else{
							var monthDiff = nowMonth - birthMonth;//月之差
							if(monthDiff < 0){
								returnAge = ageDiff;
							}
							else{
								returnAge = ageDiff+1;
							}
						}
					}
					else{
						returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
					}
				}
				return returnAge;//返回周岁年龄
			}
		},
        afterInitComponent:function(params,widget){
			if(params && params.param == 'modeldata' ){
                var pk = null;
                aw.ajax({
                    url: "api/lifemodelmember/queryBypkmember",
                    async: false,
                    data: {
                        'member.pkMember': params.pkMember
                    },
                    success: function (data1) {
                        if(data1.length>0){
                            pk = data1[0].pkLifeModelMember;
                        }
                    }
                })
				if(pk != null){
                    aw.ajax({
                        url : "api/lifemodelmember/query",
                        data : {
                            pkLifeModelMember:pk,
                            fetchProperties:Properties.lifemodemember
                        },
                        success : function(data){
                            pklifemodelmember = data[0].pkLifeModelMember;
                            pkmember = data[0].member.pkMember;
                            pkPersonalInfo = data[0].member.personalInfo.pkPersonalInfo;
                            var grid=widget.get("grid");
                            var profile =widget.get("profile");
                            var verform = widget.get("verform");
                            var verform2 = widget.get("verform2");
                            var verform3 = widget.get("verform3");
                            var verform4 = widget.get("verform4");
                            profile.reset();
                            verform.reset();
                            verform2.reset();
                            verform3.reset();
                            verform4.reset();
                            widget.get("wizard").first();
                            // profile.loadPicture("api/attachment/personalphoto/"+data[0].member.personalInfo.pkPersonalInfo);
                            profile.setData(data[0].member.personalInfo);
                            if(data[0].basicFeatureMember.belief != null){
                                profile.setValue("belief",data[0].basicFeatureMember.belief.key);
                            }
                            if(data[0].basicFeatureMember.securityCard != null){
                                profile.setValue("securityCard",data[0].basicFeatureMember.securityCard.key);
                            }
                            if(data[0].lifeMember.medicalInsuranceType != null){
                                profile.setValue("medicalInsuranceType",data[0].lifeMember.medicalInsuranceType.key);
                            }
                            verform.setData(data[0].basicFeatureMember);
                            verform2.setData(data[0].lifeMember);
                            verform3.setData(data[0].healthyMember);
                            verform4.setData(data[0].happyMember);
                            widget.hide([".J-grid",".J-modeltrajectory",".J-detailsForm"]).show([".J-wizard"]);
                            widget.get("subnav").hide(["search","search2","update","trajectory"]).show(["return","save"]);
                            $(".J-wizard .J-button-area").addClass("hidden");

                        }

                    });
				}else{
                    aw.ajax({
                        url : "api/member/query",
                        data : {
                            pkMember:params.pkMember,
                            fetchProperties:Properties.mem_baseinfo
                        },
                        success : function(data){
                            pklifemodelmember = '';
                            pkmember = data[0].pkMember;
                            pkPersonalInfo = data[0].personalInfo.pkPersonalInfo;
                            var grid=widget.get("grid");
                            var profile =widget.get("profile");
                            var verform = widget.get("verform");
                            var verform2 = widget.get("verform2");
                            var verform3 = widget.get("verform3");
                            var verform4 = widget.get("verform4");
                            profile.reset();
                            verform.reset();
                            verform2.reset();
                            verform3.reset();
                            verform4.reset();
                            widget.get("wizard").first();
                            // profile.loadPicture("api/attachment/personalphoto/"+data[0].personalInfo.pkPersonalInfo);
                            profile.setData(data[0].personalInfo);
                            widget.hide([".J-grid",".J-modeltrajectory",".J-detailsForm"]).show([".J-wizard"]);
                            widget.get("subnav").hide(["search","search2","update","trajectory"]).show(["return","save"]);
                            $(".J-wizard .J-button-area").addClass("hidden");
                        }

                    });
				}
			}
        }
	});
	module.exports = lifemodelmember;
});
