define(function(require,exports,module){
	var aw=require("ajaxwrapper");
	//1.引入backbone
	var Backbone=require("backbone");
	Backbone.emulateJSON=true;
	Backbone.emulateHTTP=true;
	//多语
	var i18ns = require("i18n");
	//2.引入backbone扩展类
	var RelativeCollection=require("./relative_collection");
	
	//3.引入需要的UI组件
	var Grid=require("grid-1.0.0");
	var Form=require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
	
	//4.引入需要的业务组件
	var Properties=require("../../properties");
	var BaseDoc=require("basedoc");
	
	var RelativeView=Backbone.View.extend({
		initialize:function(options){
			//1.设置页面参数
			this.options=options;
			//2.初始化模型及绑定事件
			this.collection=new RelativeCollection();
			this.collection.on("add",this.change,this);
			this.collection.on("remove",this.change,this);
			this.collection.on("reset",this.change,this);
			//3.渲染
			this.render();
		},
		render:function(){
			this.component=this.initComponent();
			this.$el=$(".J-relative-container");
			this.$parentEL=this.$el.parents(".el-member");
		},
		events:{
			"change .J-form-relativeinfo-select-selectPkPersonalInfo" : "queryPersonalInfo"
		},
		queryPersonalInfo:function(e){
			var that=this;
			var form=that.component.form;
			var  memberSign = form.getValue("memberSigning");
			var  pkRelative = form.getValue("pkRelative");
			var version = form.getValue("version");
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
							//setData会把表单没有熟悉情况，这里是冲变量中取值
							form.setValue("memberSigning",memberSign);
							form.setValue("pkRelative",pkRelative);
							form.setValue("version",version);
							form.setValue("associatedInput",true);
							form.setDisabled(true);
							form.removeAttribute("relationToMem1","disabled");
							form.removeAttribute("relationToMem2","disabled");
							form.removeAttribute("closeDegree","disabled");
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
		initComponent:function(){
			return {
				grid:this._initGrid(this),
				form:this._initForm(this)
			};
		},
		_initGrid:function(view){
			return new Grid({
				parentNode:".J-relative-container",
				autoRender:false,
				model:{
					head:{
//						title:"亲属信息",
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
						key:"relationToMem1",
						name:"与"+i18ns.get("sale_ship_owner","会员")+"1的关系"
					},{
						key:"relationToMem2",
						name:"与"+i18ns.get("sale_ship_owner","会员")+"2的关系"
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
						key:"closeDegree.value",
						name:"亲近程度"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								var model=view.collection.get(data.pkRelative);
								var form=view.component.form;
								var seldata = [];
								seldata[0] =data.personalInfo;
								form.setData("selectPkPersonalInfo",seldata);
								view.edit(model);
								//校验是否是关联录入信息，如果是则不可编辑，否则可以编辑
								if(data.associatedInput){
									form.setDisabled(true);
									form.removeAttribute("relationToMem1","disabled");
									form.removeAttribute("relationToMem2","disabled");
									form.removeAttribute("closeDegree","disabled");
									$(".J-button-area").removeClass("hidden");
								}
								form.setAttribute("selectPkPersonalInfo","readonly",true);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								var model=view.collection.get(data.pkRelative);
								Dialog.confirm({
									title:"提示",
									content:"确认删除？删除后将无法恢复",
									confirm:function(){
										model.destroy({
											url:"api/relative/"+data.pkRelative+"/delete"
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
				parentNode:".J-relative-container",
				saveaction:function(){
					Dialog.alert({
                		title:"提示",
                		showBtn:false,
                		content:"正在保存，请稍后……"
                	});
					var form=view.component.form;
					var data=form.getData();
					data.fetchProperties=Properties.relative;
					if(data.pkRelative){
						var model=view.collection.get(data.pkRelative);
						//修改
						model.save({},{
							url:"api/relative/saveRelative",
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
							url:"api/relative/saveRelative",
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
					id:"relativeinfo",
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
						name:"personalInfo.pkPersonalInfo",
						type:"hidden"
					},{
						name:"personalInfo.died",
						type:"hidden",
						defaultValue:"false"
 					},{
						name:"associatedInput",
						type:"hidden",
						defaultValue:"false"
					},{
						name:"pkRelative",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"personalInfo.version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"personalInfo.name",
						label:"姓名",
						validate:["required"]
					},{
						name:"relationToMem1",
						label:"与"+i18ns.get("sale_ship_owner","会员")+"1的关系",
						validate:["required"]
					},{
						name:"relationToMem2",
						label:"与"+i18ns.get("sale_ship_owner","会员")+"2的关系"
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
						name:"personalInfo.citizenship",
						label:"国籍",
						defaultValue:"48",
						type:"select",
						url:"api/country/query",
						key:"pkCountry",
						value:"name",
						validate:["required"]
					
					},{
						name:"personalInfo.idNumber",
						label:"身份证号/护照号",
						validate:["required"]
					},{
						name:"personalInfo.qualifications",
						label:"学历",
						type:"select",
						options:BaseDoc.qualifications
					},{
						name:"personalInfo.workUnit",
						label:"工作单位"
					},{
						name:"personalInfo.address",
						label:"通讯地址"
					},{
						name:"personalInfo.phone",
						label:"电话"
					},{
						name:"personalInfo.mobilePhone",
						label:"移动电话",
					    validate:["required"]
					},{
						name:"closeDegree",
						label:"亲近程度",
						type:"radiolist",
						list:[{
							key:"VeryClose",
							value:"很亲近"
						},{
							key:"Common",
							value:"一般"
						},{
							key:"OutOfTouch",
							value:"不联系"
						}]
					}]
				}
			});
		},
		add:function(pkCard){
			var form=this.component.form;
			form.reset();
			this.card();
			form.setValue("memberSigning",this.memberSigning.get("pkMemberSigning"));
			form.removeAttribute("selectPkPersonalInfo","readonly");
			Properties.queryByCardBesidesExistRelative(pkCard,this.component.form);
		},
		edit:function(model){
			var data=model.toJSON();
			data.memberSigning=this.memberSigning.get("pkMemberSigning");
			data.selectPkPersonalInfo=data.personalInfo.pkPersonalInfo;
			this.component.form.setData(data);
			this.component.form.setDisabled(false);
			this.card();
		},
		list:function(){
			this.component.form.element.hide();
			this.component.grid.element.show();
		},
		card:function(){
			this.component.grid.element.hide();
			this.component.form.element.show();
		},
		show:function(param){
			this.memberSigning=param.memberSigning;
			this.pkCard =param.pkCard;
			this.component.grid.loading();
			this.collection.fetch({
				reset:true,
				data:{
					memberSigning:param.memberSigning.get("pkMemberSigning"),
					fetchProperties:Properties.relative
				}
			});
			this.$parentEL.removeClass("list").addClass("relative").removeClass("edit").addClass("detail");
		},
		change:function(){
			var datas=this.collection.toJSON();
			this.memberSigning.set("relatives",datas);
			this.component.grid.setData(datas);
			this.list();
		},
		destroy:function(){
			this.component.form.destroy();
			this.component.grid.destroy();
		}
	});
	
	module.exports=RelativeView;
});