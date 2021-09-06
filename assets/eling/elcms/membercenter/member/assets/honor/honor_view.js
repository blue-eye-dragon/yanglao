define(function(require,exports,module){
	//1.引入backbone
	var Backbone=require("backbone");
	Backbone.emulateJSON=true;
	Backbone.emulateHTTP=true;
	//多语
	var i18ns = require("i18n");
	//2.引入backbone扩展类
	var MemberHonorCollection=require("./honor_collection");
	
	//3.引入需要的UI组件
	var Grid=require("grid-1.0.0");
	var Form=require("form-2.0.0")
	
	
	var HonorView=Backbone.View.extend({
		initialize:function(){
			//1.初始化模型及绑定事件
			this.collection=new MemberHonorCollection();
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
				parentNode:"#step4",
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
						key:"date",
						name:"颁发时间",
					},{
						key:"title",
						name:"荣誉内容"
					},{
						key:"authority",
						name:"颁发机构"
					},{
						key:"description",
						name:"备注"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								var model=view.collection.get(data.pkHonoraryTitle);
								view.edit(model);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								var model=view.collection.get(data.pkHonoraryTitle);
								model.destroy({
									url:"api/honorarytitle/"+data.pkHonoraryTitle+"/delete"
								});
							}
						}]
					}]
				}
			});
		},
		_initForm:function(view){
			var form = new Form({
				parentNode:"#step4",
				saveaction:function(){
					var form=view.component.form;
					var data=form.getData();
					if(data.pkMember){
						if(data.pkHonoraryTitle){
							var model=view.collection.get(data.pkHonoraryTitle);
							//修改
							model.save({},{
								url:"api/honorarytitle/save",
				    			data:data,
				    			success:function(model,response){
				    				view.change();
				    			}
							});
						}else{
							//新建
							view.collection.create({},{
								url:"api/honorarytitle/save",
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
					id:"honorform",
					items:[{
						name:"pkMember",
						type:"hidden"
					},{
						name:"pkHonoraryTitle",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"date",
						label:"颁发时间",
						
					},{
						name:"title",
						label:"荣誉内容"
					},{
						name:"authority",
						label:"颁发机构"
					},{
						name:"description",
						label:"备注",
						type:"textarea"
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
						$("#step4 .J-operate pre").addClass("hidden");
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
	
	module.exports=HonorView;
});