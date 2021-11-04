define(function(require,exports,module){
	//1.引入backbone
	var Backbone=require("backbone");
	Backbone.emulateJSON=true;
	Backbone.emulateHTTP=true;
	//多语
	var i18ns = require("i18n");
	//2.引入backbone扩展类
	var MemberEduCollection=require("./education_collection");
	
	//3.引入需要的UI组件
	var Grid=require("grid-1.0.0");
	var Form=require("form-2.0.0")
	
	
	var EducationView=Backbone.View.extend({
		initialize:function(){
			//1.初始化模型及绑定事件
			this.collection=new MemberEduCollection();
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
				parentNode:"#step2",
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
						name:"入学时间",
						format:"date",
						formatparams:{
								mode:"YYYY-MM"
						}
					},{
						key:"dateTo",
						name:"离校时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM"
						}
					},{
						key:"school",
						name:"学校（教育机构）"
					},{
						key:"specialty",
						name:"学历"
					},{
						key:"qualifications",
						name:"专业"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								var model=view.collection.get(data.pkEducation);
								view.edit(model);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								var model=view.collection.get(data.pkEducation);
								model.destroy({
									url:"api/education/"+data.pkEducation+"/delete"
								});
							}
						}]
					}]
				}
			});
		},
		_initForm:function(view){
			var form= new Form({
				parentNode:"#step2",
				saveaction:function(){
					var form=view.component.form;
					var data=form.getData();
					if(data.pkMember){
						if(data.pkEducation){
							var model=view.collection.get(data.pkEducation);
							//修改
							model.save({},{
								url:"api/education/save",
				    			data:data,
				    			success:function(model,response){
				    				view.change();
				    			}
							});
						}else{
							//新建
							view.collection.create({},{
								url:"api/education/save",
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
					id:"eduform",
					items:[{
						name:"pkMember",
						type:"hidden"
					},{
						name:"pkEducation",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"dateFrom",
						label:"入学时间",
						type:"date",
						mode:"Y-m"
					},{
						name:"dateTo",
						label:"离校时间",
						type:"date",
						mode:"Y-m"
					},{
						name:"school",
						label:"学校（教育机构）"
					},{
						name:"specialty",
						label:"学历"
					},{
						name:"qualifications",
						label:"专业"
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
						$("#step2 .J-operate pre").addClass("hidden");
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
	
	module.exports=EducationView;
});