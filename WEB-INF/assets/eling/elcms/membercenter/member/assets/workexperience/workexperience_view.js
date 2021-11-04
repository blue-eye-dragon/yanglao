define(function(require,exports,module){
	//1.引入backbone
	var Backbone=require("backbone");
	Backbone.emulateJSON=true;
	Backbone.emulateHTTP=true;
	//多语
	var i18ns = require("i18n");
	//2.引入backbone扩展类
	var MemberWorkCollection=require("./workexperience_collection");
	
	//3.引入需要的UI组件
	var Grid=require("grid-1.0.0");
	var Form=require("form-2.0.0")
	
	
	//5.引入需要的业务组件
	var BaseDoc=require("basedoc");
	
	var WorkExperienceView=Backbone.View.extend({
		initialize:function(){
			//1.初始化模型及绑定事件
			this.collection=new MemberWorkCollection();
			this.collection.on("add",this.change,this);
			this.collection.on("remove",this.change,this);
			this.collection.on("reset",this.change,this);
			//3.渲染
			this.render();
		},
		render:function(){
			this.component=this.initComponent();
		},
		initComponent:function(){
			return {
				grid:this._initGrid(this),
				form:this._initForm(this)
			};
		},
		_initGrid:function(view){
			return new Grid({
				parentNode:"#step3",
				autoRender:false,
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								view.add();
							}
						}]
					},
					columns:[{
						key:"dateFrom",
						name:"开始时间",
						format:"date"
					},{
						key:"dateTo",
						name:"结束时间",
						format:"date"
					},{
						key:"companyName",
						name:"单位名称"
					},{
						key:"jobTitle.value",
						name:"担任职位"
					},{
						key:"titleDesc",
						name:"职位描述"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								var model=view.collection.get(data.pkWorkExperience);
								view.edit(model);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								var model=view.collection.get(data.pkWorkExperience);
								model.destroy({
									url:"api/workexperience/"+data.pkWorkExperience+"/delete"
								});
							}
						}]
					}]
				}
			});
		},
		_initForm:function(view){
			var form= new Form({
				parentNode:"#step3",
				saveaction:function(){
					var form=view.component.form;
					var data=form.getData();
					if(data.pkMember){
						if(data.pkWorkExperience){
							var model=view.collection.get(data.pkWorkExperience);
							//修改
							model.save({},{
								url:"api/workexperience/save",
				    			data:data,
				    			success:function(model,response){
				    				view.change();
				    			}
							});
						}else{
							//新建
							view.collection.create({},{
								url:"api/workexperience/save",
								data:data,
								wait:true
							});
						}
					}else{
						alert("请先填写"+i18ns.get("sale_ship_owner","会员")+"基本信息");
					}
				},
				cancelaction:function(){
					view.list();
				},
				model:{
					id:"workform",
					items:[{
						name:"pkMember",
						type:"hidden"
					},{
						name:"pkWorkExperience",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"dateFrom",
						label:"开始时间",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"dateTo",
						label:"结束时间",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"companyName",
						label:"单位名称"
					},{
						name:"companyType",
						label:"公司性质"
					},{
						name:"jobTitle",
						label:"担任职位",
						type:"radiolist",
						list:BaseDoc.jobTitle
					},{
						name:"titleDesc",
						label:"职位描述"
					},{
						name:"description",
						label:"备注"
					}]
				}
			});
			form.element.hide();
			return form;
		},
		show:function(pkMember){
			this.pkMember=pkMember;
			if(pkMember){
				this.collection.fetch({
					reset:true,
					data:{
						member:pkMember
					},
					success:function(){
						$("#step3 .J-operate pre").addClass("hidden");
					}
				});
			}else{
				this.collection.reset();
			}
			
		},
		add:function(){
			var form=this.component.form;
			form.reset();
//			form.setValue("pkMember",this.pkMember);
			form.setValue("pkMember",$(".J-pkMember").attr("data-key"));
			this.card();
		},
		edit:function(model){
			var data=model.toJSON();
			data.pkMember=$(".J-pkMember").attr("data-key");
			this.component.form.setData(data);
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
		change:function(){
			this.component.grid.setData(this.collection.toJSON());
			this.list();
		},
		destroy:function(){
			this.component.form.destroy();
			this.component.grid.destroy();
		}
	});
	
	module.exports=WorkExperienceView;
});