define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Editgrid=require("editgrid");
	var Form=require("form");
	var enums = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	var FullScreen = require("fullscreen");
	require("../../grid_css.css");
	var importformTpl = require("./assests/memberdetailform.tpl");
	var otherformTpl = require("./assests/othermemberdetailform.tpl");
	//多语
	var i18ns = require("i18n");
	var template=require("./doormandisplayscreen.tpl");
	
	var pkPlace = "";
	
	var doormandisplayscreen = ELView.extend({
		attrs:{
            template:template
		},
		events:{
			"click .J-othergrid .box .box-content .J-grid-table tr":function(ele){
				var otherform = this.get("otherform");
				var grid =this.get("othergrid");
				var index = grid.getIndex(ele.target);
				var data = grid.getData(index);
				otherform.reset();
				otherform.setData(data.member);
				otherform.setValue("age",moment().diff(data.member.personalInfo.birthday, 'years'));
				otherform.download("J-form-emulation-profile-img","api/attachment/personalphoto/"+data.member.personalInfo.pkPersonalInfo);
			},
			"click .J-importgrid .box .box-content .J-grid-table tr":function(ele){
				var importform = this.get("importform");
				var otherform = this.get("importform");
				var grid =this.get("importgrid");
				var index = grid.getIndex(ele.target);
				var data = grid.getData(index);
				importform.reset();
				importform.setData(data.locationMemberAreaInOut.member);
				importform.setValue("age",moment().diff(data.locationMemberAreaInOut.member.personalInfo.birthday, 'years'));
				importform.setValue("memberConcernReason",data.memberConcernSet.memberConcernReason.name);
				importform.download("J-form-emulation-profile-img","api/attachment/personalphoto/"+data.locationMemberAreaInOut.member.personalInfo.pkPersonalInfo);
			}
		},
		queryPlace : function(widget){
			var subnav = widget.get("subnav");
			aw.ajax({
				url:"api/place/query",
				data:{
					name:subnav.getValue("door"),
					fetchProperties:"pkPlace,name",
				},
				dataType:"json",
				success:function(datas){
					if(datas[0].pkPlace){
						pkPlace=datas[0].pkPlace;
						widget.refreshScreen(widget);
					}
				}
			});
		},
		refreshScreen : function(widget){
			var importform = widget.get("importform");
			var importgrid = widget.get("importgrid");
			var otherform = widget.get("otherform");
			var othergrid = widget.get("othergrid");
			aw.ajax({
				url:"api/doormandisplayscreen/query",
				data:{
					"place":pkPlace,
					"inTime":moment().startOf('day').valueOf(),
					"inTimeEnd":moment().valueOf(),
					fetchProperties:"importMember.member.personalInfo.pkPersonalInfo," +
							"importMember.member.personalInfo.name," +
							"importMember.member.personalInfo.sex.value," +
							"importMember.member.personalInfo.birthday," +
							"importMember.member.memberSigning.room.number," +
							"importMember.member.memberSigning.room.telnumber," +
							"importMember.member.memberSigning.checkInDate," +
							"importMemberAge,memberConcernReason," +
							"memberConcernLocation.locationMemberAreaInOut.inTime," +
							"memberConcernLocation.locationMemberAreaInOut.member.personalInfo.name," +
							"memberConcernLocation.locationMemberAreaInOut.member.personalInfo.sex.value," +
							"memberConcernLocation.locationMemberAreaInOut.member.personalInfo.birthday," +
							"memberConcernLocation.locationMemberAreaInOut.member.memberSigning.room.number," +
							"memberConcernLocation.locationMemberAreaInOut.member.memberSigning.room.telnumber," +
							"memberConcernLocation.locationMemberAreaInOut.member.memberSigning.checkInDate," +
							"memberConcernLocation.memberConcernSet.memberConcernReason.name," +
							"otherMember.member.personalInfo.pkPersonalInfo," +
							"otherMember.member.personalInfo.name," +
							"otherMember.member.personalInfo.sex.value," +
							"otherMember.member.personalInfo.birthday," +
							"otherMember.member.memberSigning.room.number," +
							"otherMember.member.memberSigning.room.telnumber," +
							"otherMember.member.memberSigning.checkInDate," +
							"otherMemberAge," +
							"otherMemberInOuts.inTime," +
							"otherMemberInOuts.member.personalInfo.name," +
							"otherMemberInOuts.member.personalInfo.sex.value," +
							"otherMemberInOuts.member.personalInfo.birthday," +
							"otherMemberInOuts.member.memberSigning.room.number," +
							"otherMemberInOuts.member.memberSigning.room.telnumber," +
							"otherMemberInOuts.member.memberSigning.checkInDate",
				},
				dataType:"json",
				success:function(datas){
					importform.reset();
					otherform.reset();
					importgrid.setData("");
					othergrid.setData("");
					importform.download("J-form-emulation-profile-img","assets/eling/resources/nophoto.svg");
					otherform.download("J-form-emulation-profile-img","assets/eling/resources/nophoto.svg");
					widget.get("importform").setDisabled(true);
					widget.get("otherform").setDisabled(true);
					if(datas.importMember){
						importform.setData(datas.importMember.member);
						importform.setValue("age",datas.importMemberAge);
						importform.setValue("memberConcernReason",datas.memberConcernReason);
						importform.download("J-form-emulation-profile-img","api/attachment/personalphoto/"+datas.importMember.member.personalInfo.pkPersonalInfo);
					}
					
					if(datas.otherMember){
						otherform.setData(datas.otherMember.member);
						otherform.setValue("age",datas.otherMemberAge);
						otherform.download("J-form-emulation-profile-img","api/attachment/personalphoto/"+datas.otherMember.member.personalInfo.pkPersonalInfo);
					}
					if(datas.memberConcernLocation){
						importgrid.setData(datas.memberConcernLocation);
					}
					
					if(datas.otherMemberInOuts){
						othergrid.setData(datas.otherMemberInOuts);
					}
					
				}
			});
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"门卫显示屏",
					items :[{
						id : "door",
						type :"buttongroup",
						tip : "区域位置",
			   			items:[{
			   				key:"南门",
			   				value:"南门"
			   			},{
			   				key:"北门",
			   				value:"北门"
			   			}],
						handler : function(key,element){
							widget.queryPlace(widget);
						}
					},{
						id : "fullscreen",
						type :"button",
						text : "全屏",
						handler : function(key,element){
							$("header").addClass("hidden");
		                    $("nav").addClass("hidden");
		                    $(".J-el-content").removeAttr("id");
							subnav.show("returnfullscreen").hide("fullscreen");
							FullScreen.requestFullscreen();
						}
					},{
						id : "returnfullscreen",
						type :"button",
						text : "退出全屏",
						show : false,
						handler : function(key,element){
							 $("header").removeClass("hidden");
							 $("nav").removeClass("hidden");
							 $(".J-el-content").attr("id", "content");
							subnav.hide("returnfullscreen").show("fullscreen");
							FullScreen.exitFullscreen();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var importgrid = new Grid({
				parentNode:".J-importgrid",
				model : {
//					head : {
//						title:"附近会员"
//					},
					isInitPageBar : false,
					columns : [{
						name : "locationMemberAreaInOut.inTime",
						label : "时间",
						className:"twoColumn",
						format:"date",
						formatparams :{
							mode : "YYYY-MM-DD HH:mm:ss",
						}
					},{
						name : "locationMemberAreaInOut.member.personalInfo.name",
						label : "姓名",
						className:"twoColumn",
					},{
						name : "locationMemberAreaInOut.member.personalInfo.sex.value",
						label : "性别",
						className:"twoColumn",
						format:function(row,value){
							if(row=="女"){
								return "<span style='color:red;'>"+row+"</a>";
							}else{
								return "<span style='color:blue;'>"+row+"</a>";
							}
						}
					},{
						name : "locationMemberAreaInOut.member.personalInfo.birthday",
						label : "年龄",
						className:"twoColumn",
						format:"age"
					},{
						name : "locationMemberAreaInOut.member.memberSigning.room.number",
						label : "房间号",
						className:"twoColumn",
					},{
						name : "locationMemberAreaInOut.member.memberSigning.room.telnumber",
						label : "房间电话",
						className:"twoColumn",
					}]
				}
			});
			this.set("importgrid",importgrid);
			
			 $(".J-importgrid .box .box-content").css({
					"overflow-y":"auto",
					"max-height":"500px"
				});
			 
			var importform = new Form({
				parentNode:".J-importform",
                    model : {
                    	id:"importMember",
    					layout : importformTpl,
    					defaultButton:false,
	                    items : [{
	                    	 id : "personalInfo",
							 name : "personalInfo.name",
							 placeholder:"未添加",
						},{
							 id : "personalInfo",
							 name : "personalInfo.sex.value",
							 placeholder:"未添加",
						},{
							 name : "age",
							 placeholder:"未添加",
						},{
							 id : "memberSigning",
							 name : "memberSigning.room.number",
							 placeholder:"未添加",
						},{
							 id : "memberSigning",
							 name : "memberSigning.room.telnumber",
							 placeholder:"未添加",
						},{
							 id : "memberSigning",
							 name : "memberSigning.checkInDate",
							 type : "date",
							 placeholder:"未添加",
						},{
							 name:"memberConcernReason",
							 placeholder:"未添加",
						}]
                    	}
				});
			this.set("importform",importform);
			$(".J-importform .box .box-content .form-control").css({
				 "border":"none",
				 "box-shadow":"none",
			 });
			$(".J-importform .box .box-content").css({
				 "border":"none",
			 });
			
			var othergrid = new Grid({
				parentNode:".J-othergrid",
				model : {
//					head : {
//						title:"附近会员"
//					},
					isInitPageBar : false,
					columns : [{
						name : "inTime",
						label : "时间",
						className:"twoColumn",
						format:"date",
						formatparams :{
							mode : "YYYY-MM-DD HH:mm:ss",
						}
					},{
						name : "member.personalInfo.name",
						label : "姓名",
						className:"twoColumn",
						
					},{
						name : "member.personalInfo.sex.value",
						label : "性别",
						className:"twoColumn",
						format:function(row,value){
							if(row=="女"){
								return "<span style='color:red;'>"+row+"</a>";
							}else{
								return "<span style='color:blue;'>"+row+"</a>";
							}
						}
					},{
						name : "member.personalInfo.birthday",
						label : "年龄",
						format : "age",
						className:"twoColumn",
					},{
						name : "member.memberSigning.room.number",
						label : "房间号",
						className:"twoColumn",
					},{
						name : "member.memberSigning.room.telnumber",
						label : "房间电话",
						className:"twoColumn",
					}]
				}
			});
			this.set("othergrid",othergrid);
			
			 $(".J-othergrid .box .box-content").css({
					"overflow-y":"auto",
					"max-height":"500px"
				});
			
			var otherform = new Form({
				parentNode:".J-otherform",
                    model : {
                    	id:"otherMember",
    					layout : otherformTpl,
    					defaultButton:false,
	                    items : [{
	                    		 id : "personalInfo",
								 name : "personalInfo.name",
								 placeholder:"未添加",
							},{
								 id : "personalInfo",
								 name : "personalInfo.sex.value",
								 placeholder:"未添加",
							},{
								 name : "age",
								 placeholder:"未添加",
							},{
								 id : "memberSigning",
								 name : "memberSigning.room.number",
								 placeholder:"未添加",
							},{
								 id : "memberSigning",
								 name : "memberSigning.room.telnumber",
								 placeholder:"未添加",
							},{
								 id : "memberSigning",
								 name : "memberSigning.checkInDate",
								 type : "date",
								 placeholder:"未添加",
							}]
                    	}
				});
			this.set("otherform",otherform);
			$(".J-otherform .box .box-content .form-control").css({
				 "border":"none",
				 "box-shadow":"none",
			 });
			$(".J-otherform .box .box-content").css({
				 "border":"none",
			 });
			var time=setInterval(function(){
				pkPlace ? widget.refreshScreen(widget):widget.queryPlace(widget)
			}, 5000);
			this.set("timer",time);
		},
		destroy:function(){
			window.clearInterval(this.get("timer"));
			$("body").removeClass("main-nav-closed").addClass("main-nav-opened");
			doormandisplayscreen.superclass.destroy.call(this,arguments);
		},
		afterInitComponent:function(params,widget){
			//隐藏侧边栏
			$("body").addClass("main-nav-closed").removeClass("main-nav-opened");
			widget.queryPlace(widget);
		}
	});
	module.exports = doormandisplayscreen;
});
