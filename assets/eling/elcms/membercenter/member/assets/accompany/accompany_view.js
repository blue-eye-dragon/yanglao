define(function(require,exports,module){
	var aw=require("ajaxwrapper");
	//backbone基础
	var Backbone=require("backbone");
	//多语
	var i18ns = require("i18n");
	//backbone model
	var AccompanyCollection=require("./accompany_collection");

	//eling ui组件
	var Form=require("form-2.0.0")
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0"); 
	var enmu = require("enums");
	//utils
	var BaseDoc=require("basedoc");
	var Properties=require("../../properties");
	
	var AccompanyView=Backbone.View.extend({
		initialize:function(){
			this.collection=new AccompanyCollection();
		//	this.collection.on("change",this.change,this);
			this.collection.on("add",this.change,this);
			this.collection.on("remove",this.change,this);
			this.collection.on("reset",this.change,this);
			this.render();
		},
		render:function(){
			this.component=this.initComponent(this);
			this.$el=$(".J-accompany-container");
			this.$parentEL=this.$el.parents(".el-member");
		},
		events:{
			"change .J-form-accompanyPerson-select-selectPkPersonalInfo" : "queryPersonalInfo"
		},
		queryPersonalInfo:function(e){
			var that=this;
			var form = that.component.form;
			var memberSign = form.getValue("memberSigning");
			var pkAccompanyPerson = form.getValue("pkAccompanyPerson");
			var version = form.getValue("version");
			var isAccompany = form.getValue("isAccompany");
			var pk=$(e.target).find("option:selected").attr("value");
			if(pk){
				aw.ajax({
					url : "api/personalinfo/query",
					type : "POST",
					data : {
						pkPersonalInfo:pk,
						fetchProperties:"*,"+
							"nativePlace.name,"+
							"nativePlace.code,"+
							"citizenship.pkCountry,"+
							"citizenship.name,"+
							"overseasExperience.name,"+
							"overseasExperience.code,"+
							"overseasExperience.pkCountry"
					},
					success : function(data){
						//设置值
						if(data&&data[0]){
							var p ={};
							p.personalInfo={};
							p.personalInfo= data[0];
							p.selectPkPersonalInfo=pk;
							form.setData(p);
							form.setValue("memberSigning",memberSign);
							form.setValue("pkAccompanyPerson",pkAccompanyPerson);
							form.setValue("version",version);
							form.setValue("associatedInput",false);
							form.setValue("isAccompany",isAccompany);
							form.setDisabled(true);
							form.removeAttribute("selectPkPersonalInfo","disabled");
							$(".J-button-area").removeClass("hidden");
						}
					}	
				});
			}else{
				form.reset();
				form.setValue("associatedInput",false);
				form.setDisabled(false);
			}
		},
		initComponent:function(view){
			return {
				grid:this._initGrid(this),
				form:this._initForm(this)
			};
		},
		_initGrid:function(view){
			return new Grid({
				parentNode:".J-accompany-container",
				autoRender:false,
				model:{
					head:{
//						title:"陪住人信息",
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								view.add(view.pkCard);
							}
						}]
					},
					columns:[{
						key:"personalInfo.name",
						name:"姓名"
					},{
						key:"personalInfo.sex.value",
						name:"性别",
					},{
						key:"personalInfo.birthday",
						name:"年龄",
						format:function(row,value){
							if(row){
								return moment().diff(row, 'years');
							}
						}
					},{
						key:"personalInfo.relationship",
						name:"与"+i18ns.get("sale_ship_owner","会员")+"关系"
					},{
						key:"personalInfo.qualifications",
						name:"文化程度",
						format:function(value,row){
							var map={
								"SmallSchool":"小学",
								"HighSchool":"中学",
								"PolytechnicSchool":"中专",
								"HigherVocationalEducation":"高职",
								"JuniorCollege":"大专",
								"RegularCollegeCourse":"本科",
								"Master":"硕士",
								"Doctor":"博士",
								"no":"无"
							};
							return map[value] || "";
						}
					},{
						key:"personalInfo.citizenship.name",
						name:"国籍"
					},{
						key:"personalInfo.workUnit",
						name:"职业"
					},{
						key:"personalInfo.address",
						name:"通讯地址"
					},{
						key:"personalInfo.phone",
						name:"电话"
					},{
						key:"personalInfo.mobilePhone",
						name:"移动电话"
					},{
						key:"status.value",
						name:"状态"
					},{
						key:"operate",
						name:"编辑",
						format:function(value,row){
							if(row.status.key=="Normal"){
								return "陪住中";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								var model=view.collection.get(data.pkAccompanyPerson);
								var form=view.component.form;
								var seldata = [];
								seldata[0] =data.personalInfo;
								form.setData("selectPkPersonalInfo",seldata);
								view.edit(model);
								//校验是否是关联录入信息，如果是则不可编辑，否则可以编辑
								if(data.associatedInput){
									form.setDisabled(true);
								}
								form.setAttribute("selectPkPersonalInfo","readonly",true);
							}
						}]
					},{
						key:"operate",
						name:"陪住",
						format:function(value,row){
							if(row.status.key=="Normal"){
								return "陪住中";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"acc",
							text:"陪住",
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否设置为当前陪住人",
									confirm:function(){
										aw.ajax({
											url:"api/accompanyperson/setAccompanyPerson",
											data:{
												pkAccompanyPerson:data.pkAccompanyPerson,
												fetchProperties:Properties.accompany
											},
											dataType:"json",
											success:function(data){
												view.component.grid.setData(data);
												//view.change();
											}
										});
									}
								});
							}
						}]
					
						
					}]
				}
			});
		},
		_initForm:function(view){
			return new Form({
				parentNode:".J-accompany-container",
				saveaction:function(){
					Dialog.alert({
                		title:"提示",
                		showBtn:false,
                		content:"正在保存，请稍后……"
                	});
					
					var form=view.component.form;
					var pkAccompanyPerson=form.getValue("pkAccompanyPerson");
					var data=form.getData();
					data.status="Termination";
					data.fetchProperties=Properties.accompany;
					
					if(pkAccompanyPerson){
						var model=view.collection.get(pkAccompanyPerson);
						//修改
						model.save({},{
							url:"api/accompanyperson/saveAccompanyPerson",
			    			data:data,
							error:function(){
								Dialog.close();	
							},
							success:function(model, response){
								Dialog.close();	
			    				view.change(); 
			    			}
						});
						
					}else{
						//新建
						view.collection.create({},{
							url:"api/accompanyperson/saveAccompanyPerson",
							data:data,
							wait:true,
							error:function(){
								Dialog.close();	
							},
							success:function(model, response){
								Dialog.close();	
			    			}
						});
					}
					form.setDisabled(false);
				},
				cancelaction:function(){
					var form=view.component.form;
					form.setDisabled(false);
					view.list();
				},
				model:{
					id:"accompanyPerson",
					items:[{
						name:"selectPkPersonalInfo",	
						key:"pkPersonalInfo",
						value:"name",	
						label:"选择相关人",
						type:"select"
					},{
						name:"memberSigning",
						type:"hidden"
					},{
						name:"status",
						defaultValue:"Termination",
						type:"hidden"
					},{
						name:"pkAccompanyPerson",
						type:"hidden"
					},{
						name:"personalInfo.pkPersonalInfo",
						type:"hidden"
					},{
						name:"associatedInput",
						type:"hidden",
//						type:"text",
//						readonly:"readonly",
						defaultValue:"false"
					},{
						name:"personalInfo.version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"isAccompany",
						type:"hidden",
//						type:"text",
//						readonly:"readonly",
						defaultValue:"false"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"personalInfo.name",
						label:"姓名(中)",
						validate:["required"]
					},{
						name:"personalInfo.sex",
						label:"性别",
						type:"radiolist",
						list:[{
							key:"MALE",
							value:"男"
						},{
							key:"FEMALE",
							value:"女"
						}],
						validate:["required"]
					},{
						name:"personalInfo.birthday",
						label:"出生年月",
						type:"date",
						mode:"Y-m-d",
						validate:["required"] 
					},{
						name:"personalInfo.nameEn",
						label:"姓名(英语)"
					},{
						name:"personalInfo.formerName",
						label:"曾用名"
					},{
						name:"personalInfo.birthplace",
						label:"出生地",
					},{
						name:"personalInfo.relationship",
						label:"与"+i18ns.get("sale_ship_owner","会员")+"关系",
					},{
						name:"personalInfo.nativePlace",
						label:"籍贯",
						type:"place"
					},{
						name:"personalInfo.citizenship",
						label:"国籍",
						defaultValue:"48",
						url:"api/country/query",
						key:"pkCountry",
						value:"name",
						type:"select",
						validate:["required"]
					},{
						name:"personalInfo.residenceCity",
						label:"户籍地址 ",
					},{
						name:"personalInfo.otherParty",
						label:"政治面貌",
						type:"select",
						options:enmu["com.eling.elcms.basedoc.model.OtherParty"],
						defaultValue:"QZ",
					},{
						name:"personalInfo.nationality",
						label:"民族",
						type:"select",
						options:BaseDoc.nationality,
						defaultValue:"Han"
					},{
						name:"personalInfo.maritalStatus",
						label:"婚姻状况",
						type:"radiolist",
						list:BaseDoc.maritalStatus,
					},{
						name:"personalInfo.weddingDate",
						label:"婚姻登记日期",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"personalInfo.idNumber",
						label:"身份证号/护照号",
						validate:["required"]
					},{
						name:"personalInfo.graduateSchool",
						label:"毕业院校"
					},{
						name:"personalInfo.specialty",
						label:"专业"
					},{
						name:"personalInfo.qualifications",
						label:"学历",
						type:"select",
						options:BaseDoc.qualifications
					},{
						name:"personalInfo.degree",
						label:"学位"
					},{
						name:"personalInfo.workUnit",
						label:"工作单位"
					},{
						name:"personalInfo.jobTitle",
						label:"职务"
					},{
						name:"personalInfo.phone",
						label:"联系电话"
					},{
						name:"personalInfo.mobilePhone",
						label:"移动电话",
						validate:["required"]
					},{
						name:"personalInfo.email",
						label:"电子邮件",
						validate:["email"]
					},{
						name:"personalInfo.address",
						label:"通信地址",
						
					},{
						name:"personalInfo.annualIncome",
						label:"年收入情况",
						type:"radiolist",
						list:BaseDoc.annualIncome,
						
					}]
				}
			});
		},
		show:function(param){
			this.memberSigning=param.memberSigning;
			this.pkCard =param.pkCard;
			this.component.grid.loading();
			this.collection.fetch({
				reset:true,
				data:{
					memberSigning:param.memberSigning.get("pkMemberSigning"),
					fetchProperties:Properties.accompany
				}
			});
			this.$parentEL.removeClass("list").addClass("accompany").removeClass("edit").addClass("detail");
		},
		add:function(pkCard){
			Properties.queryByCardBesidesAccompanyPeople(pkCard,this.component.form);
			var form=this.component.form;
			form.reset();
			this.card();
			form.setValue("memberSigning",this.memberSigning.get("pkMemberSigning"));
			form.removeAttribute("selectPkPersonalInfo","readonly");
		},
		edit:function(model){
			var data=model.toJSON();
			data.memberSigning=this.memberSigning.get("pkMemberSigning");
			data.selectPkPersonalInfo=data.personalInfo.pkPersonalInfo;
			this.component.form.setData(data);
			this.component.form.setDisabled(false);
			this.component.form.removeAttribute("selectPkPersonalInfo","disabled","disabled");
			this.card();
		},
		change:function(){
			var datas=this.collection.toJSON();
			this.memberSigning.set("accompanyPeople",datas);
			this.component.grid.setData(datas);
			this.list();
		},
		list:function(){
			this.component.form.element.hide();
			this.component.grid.element.show();
		},
		card:function(){
			this.component.grid.element.hide();
			this.component.form.element.show();
		},
		destroy:function(){
			this.component.form.destroy();
			this.component.grid.destroy();
		}
	});
	
	module.exports=AccompanyView;
});