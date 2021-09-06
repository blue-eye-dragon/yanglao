define(function(require,exports,module){
	var Wizard=require("wizard");
	var Profile=require("profile");
	var Grid = require("grid-1.0.0");
	var Verform = require("form-1.0.0");
	var Form = require("form-2.0.0")
	var aw=require("ajaxwrapper");
	var components={};
	var memberHealthyUtils_baseinfo=require("./memberhealthy_utils_baseinfo");
	

	var _utils={
		//创建向导式
		geneWizard:function(){
			var wizard=new Wizard({
				parentNode:".J-card",
				model:{
					items:[{
						id : "step1",
						title : "基础信息"
					},{
						id : "step2",
						title : "疾病史"
					},{
						id : "step3",
						title : "手术史"
					},{
						id : "step4",
						title : "过敏原"
					},{
						id : "step5",
						title : "性格特征"
					}]
				}
			});
			components.wizard=wizard;
		},

		geneDiseaseHistory:function(){
			var form=new Verform({
				parentNode:"#step2",
				saveaction:function(){
					aw.saveOrUpdate("api/diseasehistory/add","member="+$(".J-member").attr("data-key")+
							"&"+$("#diseasehistoryForm").serialize(),function(){
						$("#step2").children().eq(0).addClass("hidden");
						components.diseaseHistoryGrid.refresh({
							fetchProperties:"*,diseaseDetail.name,diseaseDetail.pkDiseaseDetail"
						});
						$("#step2").children().eq(1).removeClass("hidden");
					});
				},
				cancelaction:function(){
					$("#step2").children().eq(0).addClass("hidden");
					$("#step2").children().eq(1).removeClass("hidden");
				},
				model:{
					id:"diseasehistoryForm",
					items:[{
						name:"pkDiseaseHistory",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"diseaseDetail",
						label:"疾病",
						key:"pkDiseaseDetail",
						value:"name",
						url:"api/diseasedetail/query",
						type:"select",
						validate:[ "required" ]
					},{
						name:"diseaseTime",
						label:"患病时间",
						type:"date",
						mode:"Y-m-d",
						defaultValue:moment()
					},{
						name:"attentions",
						label:"备注",
						type:"textarea"
					},{
						name:"diseaseStatus",
						label:"状态",
						type:"radiolist",
						list:[{
							key:"BEILL",
							value:"患病中"
						},{
							key:"RECURE",
							value:"已治愈"
						}],
						validate:[ "required" ]
					},{
						name:"cureTime",
						label:"治愈时间",
						type:"date",
						mode:"Y-m-d",
						defaultValue:moment()
					},{
						name:"critical",
						label:"重大疾病",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}]
					},{
						name:"inherited",
						label:"遗传病",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}]
					}]
				}
			});
			
			var grid=new Grid({
				parentNode:"#step2",
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								$("#step2").children().eq(1).addClass("hidden");
								$("#step2").children().eq(0).removeClass("hidden");
								components.diseaseHistoryForm.reset();
								var data ={
										diseaseDegree:{key:"COMMONLY",value:"一般"},
										diseaseStatus:{key:"BEILL",value:"患病中"},
										critical:{key:true,value:"是"},
										inherited:{key:true,value:"是"}
			 					};
								components.diseaseHistoryForm.setData(data);
							}
						}]
					},
					columns:[{
						key:"diseaseDetail.name",
						name:"疾病"
					},{
						key:"diseaseTime",
						name:"患病时间",
						format:"date",
						
					},{
						key:"cureTime",
						name:"治愈时间",
						format:"date"
					},{
						key:"diseaseStatus",
						name:"状态",
						format:function(value,row){
							return value ? value.value : "";
						}
					},{
						key:"critical",
						name:"重大疾病",
						format:function(value,row){
							if(value){
								return "是";
							}else{
								return "否";
							}
						}
					},{
						key:"inherited",
						name:"遗传病",
						format:function(value,row){
							if(value){
								return "是";
							}else{
								return "否";
							}
						}
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								$("#step2").children().eq(1).addClass("hidden");
								$("#step2").children().eq(0).removeClass("hidden");
								data.diseaseStatus.key;
								components.diseaseHistoryForm.setData(data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/diseasehistory/"+data.pkDiseaseHistory+"/delete",function(){
									components.diseaseHistoryGrid.refresh();
								});
							}
						}]
					}]
				}
			});
			components.diseaseHistoryForm=form;
			components.diseaseHistoryGrid=grid;
			$("#step2").children().eq(0).addClass("hidden");
		},
		geneSurgery:function(){
			var form=new Verform({
				parentNode:"#step3",
				saveaction:function(){
					aw.saveOrUpdate("api/surgeryhistory/add","member.pkMember="+$(".J-member").attr("data-key")+
							"&"+$("#surgeryForm").serialize(),function(){
						$("#step3").children().eq(0).addClass("hidden");
						components.surgeryGrid.refresh();
						$("#step3").children().eq(1).removeClass("hidden");
					});
				},
				cancelaction:function(){
					$("#step3").children().eq(0).addClass("hidden");
					$("#step3").children().eq(1).removeClass("hidden");
				},
				model:{
					id:"surgeryForm",
					items:[{
						name:"pkSurgeryHistory",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"diseaseDetail",
						label:"疾病",
						type:"select",
						key:"pkDiseaseDetail",
						value:"name",
						validate:["required"]
					},{
						name:"surgeryTime",
						label:"手术时间",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"surgeryDegree",
						label:"病情",
						type:"radiolist",
						list:[{
							key:"SLIGHT",
							value:"轻微"
						},{
							key:"COMMONLY",
							value:"一般"
						},{
							key:"SERIOUS",
							value:"严重"
						}]
					},{
						name:"description",
						label:"手术描述",
						type:"textarea"
					},{
						name:"attentions",
						label:"注意事项",
						type:"textarea"
					},{
						name:"hospital",
						label:"手术医院"
					},{
						name:"doctor",
						label:"主治医生"
					},{
						name:"doctorTel",
						label:"医生联系方式"
					},{
						name:"summary",
						label:"出院小结"
					}]
				}
			});
			
			var grid=new Grid({
				parentNode:"#step3",
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus", 
							handler:function(){
								aw.ajax({
									url:"api/diseasedetail/query/",
									dataType:"json",
									success:function(data){
										components.surgeryForm.reset();
										var ret="<option value=''>请选择</option>";
										var result=data || [];
										for(var i=0;i<result.length;i++){
											ret+="<option value='"+data[i].pkDiseaseDetail+"'>"+data[i].name+"</option>";
										}
										$("#step3 .J-diseaseDetail").html(ret);
										$("#step3").children().eq(1).addClass("hidden");
										$("#step3").children().eq(0).removeClass("hidden");
										$("#step3 select.J-diseaseDetail").select2();
									}
								});
							}
						}]
					},
					columns:[{
						key:"name",
						name:"疾病"
					},{
						key:"surgeryTime",
						name:"手术时间",
						format:"date"
					},{
						key:"surgeryDegree",
						name:"病情",
						format:function(value,row){
							if(value=="SLIGHT"){
								return "轻微";
							}else if(value=="COMMONLY"){
								return "一般";
							}else{
								return "严重";
							}
						}
					},{
						key:"hospital",
						name:"手术医院"
					},{
						key:"doctor",
						name:"主治医生"
					},{
						key:"doctorTel",
						name:"医生联系方式"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,rowData,rowEle){
								aw.ajax({
									url:"api/diseasedetail/query/",
									dataType:"json",
									success:function(data){
										var ret="<option value=''>请选择</option>";
										var result=data || [];
										for(var i=0;i<result.length;i++){
											ret+="<option value='"+data[i].pkDiseaseDetail+"'>"+data[i].name+"</option>";
										}
										$("#step3 .J-diseaseDetail").html(ret);
										$("#step3").children().eq(1).addClass("hidden");
										$("#step3").children().eq(0).removeClass("hidden");
										$("#step3 select.J-diseaseDetail").select2();
										components.surgeryForm.setData(rowData);
									}
								});
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/surgeryhistory/"+data.pkSurgeryHistory+"/delete",function(){
									components.surgeryGrid.refresh();
								});
							}
						}]
					}]
				}
			});
			components.surgeryForm=form;
			components.surgeryGrid=grid;
			$("#step3").children().eq(0).addClass("hidden");
		},
		geneAllergicHistory:function(){
			var form=new Verform({
				parentNode:"#step4",
				saveaction:function(){
					aw.saveOrUpdate("api/allergichistory/add","member.pkMember="+$(".J-member").attr("data-key")+
							"&"+$("#allergichistoryForm").serialize(),function(){
						$("#step4").children().eq(0).addClass("hidden");
						components.allergicHistoryGrid.refresh();
						$("#step4").children().eq(1).removeClass("hidden");
					});
				},
				cancelaction:function(){
					$("#step4").children().eq(0).addClass("hidden");
					$("#step4").children().eq(1).removeClass("hidden");
				},
				model:{
					id:"allergichistoryForm",
					items:[{
						name:"pkAllergicHistory",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"name",
						label:"过敏原名称",
						validate:["required"]
					},{
						name:"allergicType",
						label:"分类",
						type:"radiolist",
						list:[{
							key:"FOOD",
							value:"饮食"
						},{
							key:"OTHER",
							value:"其他"
						}]
					},{
						name:"attentions",
						label:"备注",
						type:"textarea"
					}]
				}
			});
			var grid=new Grid({
				parentNode:"#step4",
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								$("#step4").children().eq(1).addClass("hidden");
								$("#step4").children().eq(0).removeClass("hidden");
								components.allergicHistoryForm.reset();
							}
						}]
					},
					columns:[{
						key:"name",
						name:"过敏原名称"
					},{
						key:"allergicType",
						name:"分类",
						format:function(value,row){
							if(value=="FOOD"){
								return "食物";
							}else{
								return "其他";
							}
						}
					},{
						key:"attentions",
						name:"备注"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								$("#step4").children().eq(1).addClass("hidden");
								$("#step4").children().eq(0).removeClass("hidden");
								components.allergicHistoryForm.setData(data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/allergichistory/"+data.pkAllergicHistory+"/delete",function(){
									components.allergicHistoryGrid.refresh()
								});
							}
						}]
					}]
				}
			});
			components.allergicHistoryForm=form;
			components.allergicHistoryGrid=grid;
			$("#step4").children().eq(0).addClass("hidden");
		},
		geneCharacter:function(){
			var form=new Verform({
				parentNode:"#step5",
				saveaction:function(){
					aw.saveOrUpdate("api/character/saveByPKMember","member="+$(".J-member").attr("data-key")+
							"&"+$("#characterForm").serialize(),function(){
						$(".J-list").removeClass("hidden");
						$(".J-card").addClass("hidden");
					});
				},
				model:{
					id:"characterForm",
					items:[{
						name:"memCharacter",
						label:"性格特征",
						type:"select",
						key:"pkCharacterType",
						value:"name",
						url:"api/charactertype/query",
						multi:true
					}]
				}
			});
			components.characterForm=form;
		},
		geneHealthInspectionScheme:function(widget){
			var form=new Form({
				parentNode:"#step6",
				saveaction:function(){
					aw.saveOrUpdate("api/healthinspectionscheme/save","member.pkMember="+$(".J-member").attr("data-key")+
							"&"+$("#healthInspectionSchemeForm").serialize(),function(data){
						widget.get("grid").refresh();
						$(".J-list").removeClass("hidden");
						$(".J-card").addClass("hidden");
					});
				},
				model:{
					id:"healthInspectionSchemeForm",
					items:[
					{
						name:"seltime",
						label:"制定日期",
						type:"select",
						key:"pkHealthInspectionScheme",
						value:"setDate",
						valueFormat:function(value){
							if(value){
								return moment(Number(value)).format("YYYY-MM-DD")
							}
						}
					},{
						name:"pkHealthInspectionScheme",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"targetRecord",
						label:"指标记录",
						type:"textarea",
					},{
						name:"sportSuggestion",
						label:"运动建议",
						type:"textarea"
					},{
						name:"lifeRemind",
						label:"生活提醒",
						type:"textarea"
					},{
						name:"regularService",
						label:"定期健康服务",
						type:"textarea"
					}]
				}
			});
			components.healthInspectionSchemeForm=form;
		}
	};
	
	var MemberHealthy={
		getComponent:function(){
			return components;
		},
		init:function(widget){
			_utils.geneWizard();
			_utils.geneDiseaseHistory();
			_utils.geneSurgery();
			_utils.geneAllergicHistory();
			_utils.geneCharacter();
			_utils.geneHealthInspectionScheme(widget);
		},
		hideEDbutton:function(data){
			$("#step2  .J-edit,.J-delete").addClass("hidden");
			$("#step3  .J-edit,.J-delete").addClass("hidden");
			$("#step4  .J-edit,.J-delete").addClass("hidden");
		},
		showEdit:function(widget){
			$(".wizard").removeClass("hidden");
			components.wizard.first();
			
			//因为第一个页面被动态销毁，所以需要重排components的顺序
//			var temp = {};
//			temp.push(components.wizard);
//			//动态初始化基础信息页面
//			memberHealthyUtils_baseinfo._utils._getBaseHealthItem(temp);
//			for(var i=1; i<components.length; i++){
//				temp.push(components[i]);
//			}
//			components = temp;
			components = memberHealthyUtils_baseinfo._getBaseHealthItem(components,false);
			
			for(var i in components){
				if(components[i] && typeof components[i].setDisabled === "function"){
					components[i].setDisabled(false);
				}
			}
			//特殊处理
			$(".J-button-area").removeClass("hidden");
			$(".el-grid .box-header").removeClass("hidden");
			
			components.diseaseHistoryGrid.set("url","api/diseasehistory/queryByPKMember/"+$(".J-member").attr("data-key"));
			components.diseaseHistoryGrid.refresh({
				fetchProperties:"*,diseaseDetail.name,diseaseDetail.pkDiseaseDetail"
			},this.hideEDbutton);
			
			components.surgeryGrid.set("url","api/surgeryhistory/queryByPKMember/"+$(".J-member").attr("data-key"));
			components.surgeryGrid.refresh(null,this.hideEDbutton);
			
			components.allergicHistoryGrid.set("url","api/allergichistory/queryByPKMember/"+$(".J-member").attr("data-key"));
			components.allergicHistoryGrid.refresh(null,this.hideEDbutton);
			
			$("#step2").children().eq(0).addClass("hidden");
			$("#step3").children().eq(0).addClass("hidden");
			$("#step4").children().eq(0).addClass("hidden");
			
			$("#step2").children().eq(1).removeClass("hidden");
			$("#step3").children().eq(1).removeClass("hidden");
			$("#step4").children().eq(1).removeClass("hidden");
			
			aw.ajax({
				url:"api/character/queryByPKMember/"+$(".J-member").attr("data-key"),
				data:{
					fetchProperties:"member.pkMember," +
					"memCharacter.pkCharacterType,"+
					"memCharacter.name"
				},
				dataType:"json",
				success:function(data){
					var charaType=[];
					for(var k=0;k<data.length;k++){
						charaType.push(data[k].memCharacter);
					}
					components.characterForm.setData({
						memCharacter:charaType
					});
				}
			});
			aw.ajax({
				url:"api/healthinspectionscheme/queryByPKMember/"+$(".J-member").attr("data-key"),
				data:{
					"orderString":"setDate:desc",
					fetchProperties:"pkHealthInspectionScheme," +
							"version," +
							"member.pkMember," +
							"targetRecord," +
							"sportSuggestion," +
							"lifeRemind," +
							"setDate," +
							"regularService" 
				},
				dataType:"json",
				success:function(data){
					if(data.length>0){
						var form =components.healthInspectionSchemeForm;
						form.load("seltime",{
							options:data
							});
						form.setData(data[0]);
						form.setValue("seltime",
								data[0].pkHealthInspectionScheme
							)
					}
				
				}
			});
		},
		showDetail:function(){
			$(".wizard").addClass("hidden");
			$(".step-pane").addClass("active");
			
			//因为第一个页面被动态销毁，所以需要重排components的顺序
			components = memberHealthyUtils_baseinfo._getBaseHealthItem(components,true);
			
			for(var i in components){
				if(components[i] && typeof components[i].setDisabled === "function"){
					components[i].setDisabled(true);
				}
			}
			//特殊处理
			$(".J-button-area").addClass("hidden");
			$(".el-grid .box-header").addClass("hidden");
		},
		destroy:function(){
			for(var i in components){
				if(components[i] && typeof components[i].destroy ==="function"){
					components[i].destroy();
				}
			}
		}
	};
	
	module.exports=MemberHealthy;
});
