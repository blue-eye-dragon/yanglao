define(function(require,exports,module){
	var aw=require("ajaxwrapper");
	//backbone基础
	var Backbone=require("backbone");
	Backbone.emulateJSON=true;
	Backbone.emulateHTTP=true;
	
	//多语
	var i18ns = require("i18n");
	//eling ui组件
	var Profile=require("profile");
    var Dialog=require("dialog-1.0.0");
	
	//utils
	var Properties=require("../../properties");
	
	var MemBaseView=Backbone.View.extend({
		initialize:function(model){
			this.model=model;
			this.render();
		},
		render:function(){
			this.component=this.initComponent(this);
			this.$el=this.component.element;
		},
		events:{
			"change .J-selectPkPersonalInfo" : "queryPersonalInfo"
		},
		queryPersonalInfo:function(e){
			var that=this;
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
						data = data[0];
						data.iorder=$(".J-iorder").attr("data-key");
						data.selectPkPersonalInfo=pk;
						that.setData([{
							personalInfo:data
						}]);
					}	
				});
			}
		},
		initComponent:function(view){
			return new Profile({
				parentNode:"#step1",
				personalization : {
					viewCode: "9030",
					description: i18ns.get("sale_ship_owner","会员")+"基本信息表单"
				},
				saveaction:function(){
					Dialog.alert({
                		title:"提示",
                		showBtn:false,
                		content:"正在保存，请稍后……"
                	});
					var params=$("#baseinfo").serialize()+"&"+$("#otherform").serialize()+"&"+"fetchProperties="+Properties.mem_baseinfo;
					view.model.save({},{
						url:"api/member/save",
						data:params,
						error:function(){
							Dialog.close();	
						},
						success:function(model, response){
							Dialog.close();	
							$(".J-pkMember").attr("data-key",view.model.get("pkMember"));
							//上传图片
							view.component.upload("api/attachment/personalphoto/"+model.get("personalInfo").pkPersonalInfo);
							view.trigger("next");
						}
					});
				},
				model:{
					id:"baseinfo",
					items:Properties.member_baseinfo_items
				}
			});
		},
		setData:function(datas){
//			//移出不需要readonly的字段
			if(!datas){
				this.component.setDisabled(true);
//				$(".J-selectPkPersonalInfo").removeAttr("disabled");
//				$(".J-address").removeAttr("disabled");
//				$(".J-annualIncome").removeAttr("disabled");
//				$(".J-memCardNo").removeAttr("disabled");
//				$("#step1 .J-button-area").removeClass("hidden");
			}
			var data=datas || this.model.toJSON();
			var personalInfo=datas ? datas[0].personalInfo : data[0].personalInfo;
			this.component.loadPicture("api/attachment/personalphoto/"+personalInfo.pkPersonalInfo);
			for(var i in personalInfo){
				data[0][i]=personalInfo[i];
			}
			data[0].pkMemberSigning=this.component.getValue("pkMemberSigning");
			data[0].iorder=this.component.getValue("iorder");
	//		data[0].idType=this.component.getValue("idType");
			this.component.setData(data[0]);
		},
		destroy:function(){
			this.component.destroy();
		}
	});
	
	module.exports=MemBaseView;
});