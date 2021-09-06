define(function(require,exports,module){
	var Profile=require("profile");
	var aw=require("ajaxwrapper");

	var components={};
	
	var HealthUtils_BaseInfo={
			geneBaseInfo:function(examDataItems){
				var profile=new Profile({
					parentNode:"#step1",
					saveaction:function(){
						var thirdClassHospitals = profile.getValue("thirdClassHospitals");
						var secondClassHospitals = profile.getValue("secondClassHospitals");
						var firstClassHospitals = profile.getValue("firstClassHospitals");
						var noClassHospitals = profile.getValue("noClassHospitals");
						var memberHospitals = [];
						Array.prototype.push.apply(memberHospitals, thirdClassHospitals);
						Array.prototype.push.apply(memberHospitals, secondClassHospitals);
						Array.prototype.push.apply(memberHospitals, firstClassHospitals);
						Array.prototype.push.apply(memberHospitals, noClassHospitals);
						var data = $("#baseinfo").serialize();
						aw.saveOrUpdate("api/healthdata/saveHealthDataAndItems","member.pkMember="+
								$(".J-member").attr("data-key")+"&"+$("#baseinfo").serialize()+"&memberHospitalss="+memberHospitals,function(){
							components.wizard.next();
						});
					},
					model:{
						id:"baseinfo",
						items:examDataItems
					}
				});
				components.baseinfo=profile;
			},
			//基础信息
			_getBaseInfo : function(){
				return items=[{
					title:"基本信息",
					icon:"github",
					children:[{
						name:"pkHealthData",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"memMedicalInsurance",
						label:"医保类型",
						type:"select",
						url:"api/medicalinsurance/query",
						key:"pkMedicalInsurance",
						value:"name"
					},{
						name:"memSelfCareStatus",
						label:"自理状态",
						type:"select",
						url:"api/selfcare/query",
						key:"pkSelfCare",
						value:"name"
					},{
						name:"bloodType",
						label:"血型",
						type:"select",
						url:"api/enum/com.eling.elcms.basedoc.model.BloodType"
					},{
						name:"bloodRemark",
						label:"血型备注",
						type:"textarea"
					},{
						name:"thirdClassHospitals",
						label:"三级定点医院",
						type:"select",
						url:"api/hospital/query",
						params:function(){
							return {
								"hospitalGradeIn":"TopThirdClass,UpperThirdClass,MiddleThirdClass,LowerThirdClass",
								fetchProperties:"pkHospital,name"
							};
						},
						key:"pkHospital",
						value:"name",
						multi : true,
					},{
						name:"secondClassHospitals",
						label:"二级定点医院",
						type:"select",
						url:"api/hospital/query",
						params:function(){
							return {
								"hospitalGradeIn":"UpperSecondClass,MiddleSecondClass,LowerSecondClass",
								fetchProperties:"pkHospital,name"
							};
						},
						key:"pkHospital",
						value:"name",
						multi : true,
					},{
						name:"firstClassHospitals",
						label:"一级定点医院",
						type:"select",
						url:"api/hospital/query",
						params:function(){
							return {
								"hospitalGradeIn":"UpperFirstClass,MiddleFirstClass,LowerFirstClass",
								fetchProperties:"pkHospital,name"
							};
						},
						key:"pkHospital",
						value:"name",
						multi : true,
					},{
						name:"noClassHospitals",
						label:"无级定点医院",
						type:"select",
						url:"api/hospital/query",
						params:function(){
							return {
								"hospitalGrade":"NoClass",
								fetchProperties:"pkHospital,name"
							};
						},
						key:"pkHospital",
						value:"name",
						multi : true,
					},{
						name:"livingAlone",
						type:"hidden",
						defaultValue:"false"
					},{
						name:"nurseLevel",
						type:"hidden",
						defaultValue:"3"
					},{
						name:"sportIntensity",
						type:"hidden",
						defaultValue:"Centre"
					},{
						name:"goOut",
						type:"hidden",
						defaultValue:"true"
					},{
						name:"description",
						type:"hidden"
					}]
				},
//			{
//				title:"一般情况",
//				icon:"user"
//			},
				];
				
			},
			//根据基础健康项目设置加载一般情况
			_getBaseHealthItem : function(comp,disabled){
				var baseHealthItem = {};
				components = comp;
				aw.ajax({
					url:"api/basichealthdatatype/queryMemberBasicData",
					async : false,//TODO
					data:{
						pkMember : $(".J-member").attr("data-key"),
						fetchProperties : "*,basicTypes.*,basicTypes.healthDataType.*,memDatas.*,memDatas.type.*"
					},
					dataType:"json",
					success:function(data){
						var items=HealthUtils_BaseInfo._getBaseInfo();
						if (data && data.basicTypes && data.basicTypes.length > 0){
							var types = data.basicTypes;
							var memDatas = data.memDatas;
							
							for(var i=0;i<types.length;i++){
								var pkType = types[i].healthDataType.pkHealthExamDataType;
								var prefix = "examData_"+pkType;
								var children=[];
								if(types[i].healthDataType.name1){
									var value=null;
									if (memDatas){									
										for(var o=0;o<memDatas.length;o++){
											if(memDatas[o].type.pkHealthExamDataType==types[i].healthDataType.pkHealthExamDataType){
												value=memDatas[o].value1;
											}
										}
									}
									var chi={name:prefix+"_value1",label:types[i].healthDataType.name1,defaultValue:value==""?null:value,type:"text"};
									if(types[i].healthDataType.inputNumeric1==true){
										chi.validate=[ "decimal_two" ];
									}
									children.push(chi);
								}
								if(types[i].healthDataType.name2){
									var value=null;
									if (memDatas){
										for(var o=0;o<memDatas.length;o++){
											if(memDatas[o].type.pkHealthExamDataType==types[i].healthDataType.pkHealthExamDataType){
												value=memDatas[o].value2;
											}
										}
									}
									var chi={name:prefix+"_value2",label:types[i].healthDataType.name2,defaultValue:value==""?null:value,type:"text"};
									if(types[i].healthDataType.inputNumeric2==true){
										chi.validate=[ "decimal_two" ];
									}
									children.push(chi);
								}if(types[i].healthDataType.name3){
									var value=null;
									if (memDatas){
										for(var o=0;o<memDatas.length;o++){
											if(memDatas[o].type.pkHealthExamDataType==types[i].healthDataType.pkHealthExamDataType){
												value=memDatas[o].value3;
											}
										}
									}
									var chi={name:prefix+"_value3",label:types[i].healthDataType.name3,defaultValue:value==""?null:value,type:"text"};
									if(types[i].healthDataType.inputNumeric3==true){
										chi.validate=[ "decimal_two" ];
									}
									children.push(chi);
								}if(types[i].healthDataType.name4){
									var value=null;
									if (memDatas){
										for(var o=0;o<memDatas.length;o++){
											if(memDatas[o].type.pkHealthExamDataType==types[i].healthDataType.pkHealthExamDataType){
												value=memDatas[o].value4;
											}
										}
									}
									var chi={name:prefix+"_value4",label:types[i].healthDataType.name4,defaultValue:value==""?null:value,type:"text"};
									if(types[i].healthDataType.inputNumeric4==true){
										chi.validate=[ "decimal_two" ];
									}
									children.push(chi);
								}if(types[i].healthDataType.name5){
									var value=null;
									if (memDatas){
										for(var o=0;o<memDatas.length;o++){
											if(memDatas[o].type.pkHealthExamDataType==types[i].healthDataType.pkHealthExamDataType){
												value=memDatas[o].value5;
											}
										}
									}
									var chi={name:prefix+"_value5",label:types[i].healthDataType.name5,defaultValue:value==""?null:value,type:"text"};
									if(types[i].healthDataType.inputNumeric5==true){
										chi.validate=[ "decimal_two" ];
									}
									children.push(chi);
								}if(types[i].healthDataType.name6){
									var value=null;
									if (memDatas){
										for(var o=0;o<memDatas.length;o++){
											if(memDatas[o].type.pkHealthExamDataType==types[i].healthDataType.pkHealthExamDataType){
												value=memDatas[o].value6;
											}
										}
									}
									var chi={name:prefix+"_value6",label:types[i].healthDataType.name6,defaultValue:value==""?null:value,type:"text"};
									if(types[i].healthDataType.inputNumeric6==true){
										chi.validate=[ "decimal_two" ];
									}
									children.push(chi);
								}
								items.push({
									title:types[i].healthDataType.name,
									children:children
								});			
							}
						}
						
						//生成新的页面前需要销毁之前动态加载的基本信息页面
						if (components["baseinfo"]){						
							components["baseinfo"].destroy();
						}
						HealthUtils_BaseInfo.geneBaseInfo(items);
						HealthUtils_BaseInfo._setBaseInfoData();
						if(disabled){
							components["baseinfo"].setDisabled(true);
						}
					}
				});
				return components;
			},
			_setBaseInfoData : function (){
				aw.ajax({
					url:"api/healthdata/queryHealthdataAndDetail/"+$(".J-member").attr("data-key"),
					data:{
						fetchProperties:"*,"+
						"healthdetail.statusItem.pkStatusItem,"+
						"healthdetail.description,"+
						"healthdata.memMedicalInsurance.name,"+
						"healthdata.memMedicalInsurance.pkMedicalInsurance,"+
						"healthdata.memSelfCareStatus.pkSelfCare,"+
						"healthdata.memSelfCareStatus.name," +
						"healthdata.thirdClassHospitals.pkHospital," +
						"healthdata.thirdClassHospitals.name," +
						"healthdata.secondClassHospitals.pkHospital," +
						"healthdata.secondClassHospitals.name," +
						"healthdata.firstClassHospitals.pkHospital," +
						"healthdata.firstClassHospitals.name," +
						"healthdata.noClassHospitals.pkHospital," +
						"healthdata.noClassHospitals.name," +
						"healthdata.bloodType," +
						"healthdata.bloodRemark"
						
					},
					dataType:"json",
					success:function(data){
						var result=data.healthdata || {};
						var details=data.healthdetail || [];
						for(var i=0;i<details.length;i++){
							var key="healthitem_"+details[i].statusItem.pkStatusItem;
							var value=details[i].description;
							result[key]=value;
						}
						components.baseinfo.setData(result);
						HealthUtils_BaseInfo._loadDesignatedHospital("select.J-thirdClassHospital",
								"thirdClassHospital",
								((data.healthdata&&data.healthdata.thirdClassHospital)?data.healthdata.thirdClassHospital:null));
						HealthUtils_BaseInfo._loadDesignatedHospital("select.J-secondClassHospital",
								"secondClassHospital",
								((data.healthdata&&data.healthdata.secondClassHospital)?data.healthdata.secondClassHospital:null));
						HealthUtils_BaseInfo._loadDesignatedHospital("select.J-firstClassHospital",
								"firstClassHospital",
								((data.healthdata&&data.healthdata.firstClassHospital)?data.healthdata.firstClassHospital:null));
						HealthUtils_BaseInfo._loadDesignatedHospital("select.J-noClassHospital",
								"noClassHospital",
								((data.healthdata&&data.healthdata.noClassHospital)?data.healthdata.noClassHospital:null));
					}
				});
			},
			/*查询用户对应部门*/
			_loadDesignatedHospital :function(select,Class,hospital){
				components.baseinfo.load(Class,{
					callback:function(){
						var mark = false;
						var secondClassData=components.baseinfo.getData(Class);
						if(hospital){
							for(var i=0;i<secondClassData.length;i++){
								if(secondClassData[i].pkHospital==hospital.pkHospital){
									break;
								}else if(secondClassData[i].pkHospital!=hospital.pkHospital&&i==secondClassData.length-1){
									secondClassData.push(hospital);
									mark = true;
								}
							}
						}
						components.baseinfo.setModel(Class,secondClassData);
						components.baseinfo.setValue(Class,hospital);
						if(mark){
							$(select).find("option").last().attr("disabled","disabled");
						}
					}
				});
			}
	};

	module.exports=HealthUtils_BaseInfo;
});
