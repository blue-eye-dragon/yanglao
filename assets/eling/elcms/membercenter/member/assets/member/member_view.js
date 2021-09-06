define(function(require,exports,module){
	var aw=require("ajaxwrapper");
	//backbone基础
	var Backbone=require("backbone");
	Backbone.emulateJSON=true;
	Backbone.emulateHTTP=true;
	
	var Properties=require("../../properties");
	
	//eling ui组件
	var Wizard=require("wizard");
	
	//backbone view
	var MemBaseInfo=require("./member_baseinfo_view");
	var EducationView=require("../education/education_view");
	var WorkExperienceView=require("../workexperience/workexperience_view");
	var HonorView=require("../honor/honor_view");
	var MemOtherInfo=require("./member_otherinfo_view");
	
	//backbone models
	var MemberModel=require("./member_model");
	
	
	var MemberView=Backbone.View.extend({
		initialize:function(){
			this.render();
		},
		render:function(){
			this.component=this.initComponent();
			this.$el=this.component.element;
			this.$parentEL=this.$el.parents(".el-member");
			
			this._renderBaseInfo();
			
			this.educationView=new EducationView();
			
			this.workexperienceView=new WorkExperienceView();
			
			this.honorView=new HonorView();
			
			this._renderOtherInfo();
		},
		
		_renderBaseInfo:function(){
			this.member_model=new MemberModel();
			this.memBaseInfo=new MemBaseInfo(this.member_model,this.options);
			this.memBaseInfo.on("next",this.next,this);
			//为模型绑定change事件
			this.member_model.on("change",this.change,this);
			//为模型绑定_change事件，该事件处理 向导式保存最后一个页签后，主列表只显示当前编辑的会员签约
			this.member_model.on("_change",this._change,this);
		},
		
		_renderOtherInfo:function(){
			this.memOtherInfo=new MemOtherInfo(this.member_model,this.options);
		},
		show:function(param){
			this.memberSigning=param.memberSigning;
			Properties.queryPersonalCardownerBycardBesidesExistMember(param.pkCard,this.memBaseInfo.component);
	    	if(param.pkMember){
	    		this.edit(param,this);
	    		$(".J-pkMember").attr("data-key",param.pkMember);
	    	}else{
	    		this.add(param,this);
	    		$(".J-pkMember").attr("data-key","");
	    	}
	    	this.educationView.show(param.pkMember);
	    	this.workexperienceView.show(param.pkMember);
	    	this.honorView.show(param.pkMember);
		},
		
		add:function(param,view){
			var baseform=this.memBaseInfo.component;
			baseform.setDisabled(false);
			baseform.reset();
			baseform.setData({
				pkMemberSigning:param.pkMemberSigning,
				iorder:param.iorder,
				name:param.name?param.name:""
			});
			var otherform=this.memOtherInfo.component;
			otherform.setDisabled(false);
			otherform.reset();
			
			//特殊处理
			$(".el-grid .box-header").removeClass("hidden");
    		this.component.reset();
			this.$parentEL.removeClass("list").addClass("member").addClass("edit").removeClass("detail");
		},
		edit:function(param,view){
			this.member_model.set({pkMember:param.pkMember},{silent:true});
    		this.member_model.fetch({
				reset:true,
				data:{
					fetchProperties:Properties.mem_baseinfo,
				},
			});
			
			var baseform=this.memBaseInfo.component;
			baseform.setDisabled(true);
			
			var otherform=this.memOtherInfo.component;
			otherform.setDisabled(true);
			
			this.showDetail();
		},
		
		change:function(){
			//当模型改变时
			//1.设置表单
			var data=this.member_model.toJSON();
			data.pkMemberSigning=this.memberSigning.get("pkMemberSigning");
			var personalInfo=data.personalInfo;
			for(var i in personalInfo){
				data[i]=personalInfo[i];
			}
			
			var baseform=this.memBaseInfo.component;
			data.birthday=moment(data.birthdayString).valueOf();
			baseform.setData(data);
			
			var otherform=this.memOtherInfo.component;
			otherform.setData(data);
			
			//2.刷新会员签约列表
			var isNew=true;
			var members = this.memberSigning.get("members");
			for(var i=0;i<members.length;i++){
				if(members[i].pkMember == data.pkMember){
					members[i]=this.member_model.toJSON();
					isNew=false;
				}
			}
			if(isNew){
				members.push(this.member_model.toJSON());
			}
			this.memberSigning.trigger("change");
		},
		_change:function(){
			this.memberSigning.trigger("change",this.memberSigning);
		},

		initComponent:function(){
			return new Wizard({
				parentNode:".J-member-container",
				model:{
					items:[{
						id:"step1",
						title:"基本信息"
					},{
						id:"step2",
						title:"教育程度"
					},{
						id:"step3",
						title:"工作经历"
					},{
						id:"step4",
						title:"获奖情况"
					},{
						id:"step5",
						title:"其他介绍"
					}]
				}
			});
		},
		next:function(){
			this.component.next();
		},
		setDisabled:function(mark){
			this.memBaseInfo.component.setDisabled(mark);
			this.memOtherInfo.component.setDisabled(mark);
		},
		showDetail:function(){
			this.$parentEL.removeClass("list").addClass("member").removeClass("edit").addClass("detail");
	    	//特殊处理
	    	$(".wizard").addClass("hidden");
			$(".step-pane").addClass("active");
			$(".ui-wizard .J-button-area").addClass("hidden");
			$(".ui-wizard .el-grid .box-header").addClass("hidden");
	    },
	    destroy:function(){
	    	this.component.destroy();
	    	this.memBaseInfo.destroy();
	    	this.educationView.destroy();
	    	this.workexperienceView.destroy();
	    	this.honorView.destroy();
			this.memOtherInfo.destroy();
	    }
	});
	
	module.exports=MemberView;
});