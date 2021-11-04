define(function(require,exports,module){
	var Backbone=require("backbone");
	Backbone.emulateJSON=true;
	Backbone.emulateHTTP=true;
	
	var RelativeView=require("../relative/relative_view");
	var GuarantorView=require("../guarantor/guarantor_view");
	var ContractView=require("../contract/contract_view");
	var AccompanyView=require("../accompany/accompany_view");
	var OtherRelationView=require("../otherrelation/otherrelation_view");
	
	
	//backbone models
	var MemberModel=require("../member/member_model");
	
	//backbone views
	var MemberView=require("../member/member_view");
	
	//工具
	var Grid=require("grid-1.0.0");
	var Properties=require("../../properties");
	
	//多语
	var i18ns = require("i18n");
	
	var MemberSigningView=Backbone.View.extend({
		initialize: function(collection,options){
			this.options=options;
			//初始化会籍签约列表view
			this.collection=collection;
			this.collection.on("reset",this.change,this);
			this.collection.on("change",this.change,this);
			//初始化会员wizard
			this.member_model=new MemberModel();
			this.member_view=new MemberView(this.member_model,options);
			//初始化子女信息view
			this.relativeView = new RelativeView();
			//初始化担保人view
			this.guarantorView = new GuarantorView();
			//初始化紧急联系人view
			this.contractView = new ContractView();
			//初始化陪住人view
			this.accompanyView = new AccompanyView();
			//初始化其他社会联系人view
			this.otherrelationView = new OtherRelationView();
			//渲染
			this.render();
	    },
	    render:function(){
	    	this.component=this.initComponent();
			this.$el=this.component.element;
			this.component.loading();
	    },
	    initComponent:function(){
	    	return new Grid({
				parentNode:".J-list",
				url:"api/membersign/querymember",
				autoRender:false,
				model:{
					columns:[{
						key:"card.name",
						name:  i18ns.get("sale_card_name","会籍卡"),
						col:1
					},{
						key:"room.number",
						name:"房间",
						col:1
					},{
						key:"room.telnumber",
						name:"房间电话",
						col:2
					},{
						key : "members",
						name : i18ns.get("sale_ship_owner","会员")+"1",
						col:1,
						format:function(value,row){
							var color="rgb(141, 128, 128)",
								data,
								memberID="",
								text="待录入";
							if(row.memberNames){
								var names =	row.memberNames.split(",");
								if(names.length>0){
									text=names[0];
								}
							}
							if(value && value.length!=0){
								for(var i=0;i<value.length;i++){
									if(value[i].iorder==1){
										color="red";
										data=value[i];
										memberID=data.pkMember;
										text=data.personalInfo.name;
										break;
									}
								}
							}
							return "<a href='javascript:void(0);' data-index='1' data-card='"+row.card.pkMemberShipCard+"' data-sign='"+row.pkMemberSigning+
								"' class='J-member' data-key='"+memberID+"'  data-name='"+(text=="待录入"?"":text)+"' style='color:"+color+";'>"+text+"</a>";
						}
					},{
						key : "members",
						name : i18ns.get("sale_ship_owner","会员")+"2",
						col : 1,
						format : function(value,row){
							var color="rgb(141, 128, 128)",
								data,
								memberID="",
								text="待录入";
							if(row.memberNames){
								var names =	row.memberNames.split(",");
								if(names.length>1){
									text=names[1];
								}
							}
							if(value && value.length!=0){
								for(var i=0;i<value.length;i++){
									if(value[i].iorder==2){
										color="red";
										data=value[i];
										memberID=data.pkMember;
										text=data.personalInfo.name;
										break;
									}
								}
							}
							return "<a href='javascript:void(0);' data-index='2' data-card='"+row.card.pkMemberShipCard+"' data-sign='"+row.pkMemberSigning+
								"' class='J-member' data-key='"+memberID+"' style='color:"+color+";'>"+text+"</a>";
							}
					},{
						key:"relatives",
						name:"亲属信息",
						col:2,
						format:function(value,row){
							if(value && value.length!=0){
								var text="";
								for(var i=0;i<value.length;i++){
									text+=value[i].personalInfo.name+"，";
								}
								return "<a href='javascript:void(0);' style='color:red;' class='J-relative' data-card='"+row.card.pkMemberShipCard+"' data-sign='"+row.pkMemberSigning+"'>"+text.substring(0,text.length-1)+"</a>";
							}else{
								return "<a href='javascript:void(0);' style='color:rgb(141, 128, 128);' class='J-relative' data-card='"+row.card.pkMemberShipCard+"' data-sign='"+row.pkMemberSigning+"'>待录入</a>";
							}
						}
					},{
						key:"otherRelations",
						name:"社会联系人",
						col:1,						
						format:function(value,row){
							if(value && value.length!=0){
								var text="";
								for(var i=0;i<value.length;i++){
									text+=value[i].personalInfo.name+"，";
								}
								return "<a href='javascript:void(0);' style='color:red;' class='J-otherrelation' data-card='"+row.card.pkMemberShipCard+"' data-sign='"+row.pkMemberSigning+"'>"+text.substring(0,text.length-1)+"</a>";
							}else{
								return "<a href='javascript:void(0);' style='color:rgb(141, 128, 128);' class='J-otherrelation' data-card='"+row.card.pkMemberShipCard+"' data-sign='"+row.pkMemberSigning+"'>待录入</a>";
							}
						}
					},{
						key:"accompanyPeople",
						name:"陪住人",
						col:1,									
						format:function(value,row){
							var text="待录入";
							var color="rgb(141, 128, 128)";
							if(value&&value.length>0){
								for(var  i =0 ;i<value.length ;i++){
									if((value[i].status && value[i].status.key=="Normal")){
										text = value[i].personalInfo.name;
										color="red";
									}
								}
							} 
							return "<a href='javascript:void(0);' style='color:"+color+";' class='J-accompanyPerson' data-card='"+row.card.pkMemberShipCard+"' data-sign='"+row.pkMemberSigning+"'>"+text+"</a>";
						}
					},{
						key:"guarantors",
						name:"担保人",
						col:1,									
						format:function(value,row){
							if(value && value.length!=0){
								var text="";
								for(var i=0;i<value.length;i++){
									text+=value[i].personalInfo.name+"，";
								}
								return "<a href='javascript:void(0);' style='color:red;' class='J-guarantorinfo' data-card='"+row.card.pkMemberShipCard+"' data-sign='"+row.pkMemberSigning+"'>"+text.substring(0,text.length-1)+"</a>";
							}else{
								return "<a href='javascript:void(0);' style='color:rgb(141, 128, 128);' class='J-guarantorinfo' data-card='"+row.card.pkMemberShipCard+"' data-sign='"+row.pkMemberSigning+"'>待录入</a>";
							}
						}
					},{
						key:"ecPersons",
						name:"紧急联系人",
						col:1,									
						format:function(value,row){
							if(value && value.length!=0){
								var text="";
								for(var i=0;i<value.length;i++){
									text+=value[i].personalInfo.name+"，";
								}
								return "<a href='javascript:void(0);' style='color:red;' class='J-emergencycontact' data-card='"+row.card.pkMemberShipCard+"' data-sign='"+row.pkMemberSigning+"'>"+text.substring(0,text.length-1)+"</a>";
							}else{
								return "<a href='javascript:void(0);' style='color:rgb(141, 128, 128);' class='J-emergencycontact' data-card='"+row.card.pkMemberShipCard+"' data-sign='"+row.pkMemberSigning+"'>待录入</a>";
							}
						}
					}]
				}
			});
	    },
	    events:{
	    	"click .J-member":"showMember",
			"click .J-relative":"showRelative",
			"click .J-accompanyPerson":"showAccompany",
			"click .J-guarantorinfo":"showGuarantor",
			"click .J-emergencycontact":"showContact",
			"click .J-otherrelation":"showOtherRelation"
	    },
	    showMember:function(e){
	    	var pkMemberSigning=$(e.target).attr("data-sign");
	    	this.member_view.show({
	    		"pkMemberSigning":pkMemberSigning,
	    		"pkMember":$(e.target).attr("data-key"),
	    		"iorder":$(e.target).attr("data-index"),
	    		"pkCard":$(e.target).attr("data-card"),
	    		"name":$(e.target).attr("data-name"),
	    		memberSigning:this.collection.get(pkMemberSigning)
	    	});
	    	$(".J-modify").removeClass("hidden");
	    	$(".J-building,.J-search").addClass("hidden");
	    },
	    showOtherRelation:function(e){
	    	//1.获取pkMemberSigning
	    	var pkMemberSigning=$(e.target).attr("data-sign");
	    	//2.显示此会籍签约的子女信息
	    	this.otherrelationView.show({
	    		"pkMemberSigning":pkMemberSigning,
	    		"pkCard":$(e.target).attr("data-card"),
	    		memberSigning:this.collection.get(pkMemberSigning)
	    	});
	    },
	    showRelative:function(e){
	    	//1.获取pkMemberSigning
	    	var pkMemberSigning=$(e.target).attr("data-sign");
	    	//2.显示此会籍签约的子女信息
	    	this.relativeView.show({
	    		"pkMemberSigning":pkMemberSigning,
	    		"pkCard":$(e.target).attr("data-card"),
	    		memberSigning:this.collection.get(pkMemberSigning)
	    	});
	    },
	    showGuarantor:function(e){
	    	//1.获取pkMemberSigning
	    	var pkMemberSigning=$(e.target).attr("data-sign");
	    	//2.显示此会籍签约的子女信息
	    	this.guarantorView.show({
	    		"pkMemberSigning":pkMemberSigning,
	    		"pkCard":$(e.target).attr("data-card"),
	    		memberSigning:this.collection.get(pkMemberSigning)
	    	});
	    },
	    showContact:function(e){
	    	//1.获取pkMemberSigning
	    	var pkMemberSigning=$(e.target).attr("data-sign");
	    	//2.显示此会籍签约的紧急联系人
	    	this.contractView.show({
	    		"pkMemberSigning":pkMemberSigning,
	    		"pkCard":$(e.target).attr("data-card"),
	    		memberSigning:this.collection.get(pkMemberSigning)
	    	});
	    },
	    showAccompany:function(e){
	    	//1.获取pkMemberSigning
	    	var pkMemberSigning=$(e.target).attr("data-sign");
	    	//2.显示此会籍签约的陪住人
	    	this.accompanyView.show({
	    		"pkMemberSigning":pkMemberSigning,
	    		"pkCard":$(e.target).attr("data-card"),
	    		memberSigning:this.collection.get(pkMemberSigning)
	    	});
	    },
	    change:function(model){
    		var data = model ? model.toJSON() : this.collection.toJSON();
    		if(data.constructor !== Array){
    			data=[data];
    		}
	    	this.component.setData(data);
	    },
	    hide:function(){
	    	this.$parentEL.addClass("edit");
	    },
	    show:function(){
	    	this.$parentEL.removeClass("edit");
	    },
	    refresh:function(params){
	    	this.collection.fetch({
				reset:true,
				data:params
			});
	    },
	    destroy:function(){
	    	this.component.destroy();
	    	this.member_view.destroy();
	    	this.relativeView.destroy();
	    	this.guarantorView.destroy();
	    	this.contractView.destroy();
    		this.accompanyView.destroy();
    		this.otherrelationView.destroy();
	    }
	});
    module.exports=MemberSigningView;
});