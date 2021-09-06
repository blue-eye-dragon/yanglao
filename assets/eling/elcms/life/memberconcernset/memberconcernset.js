define(function(require, exports, module) {
	var BaseView=require("baseview");
	require("./memberconcernset.css");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var DiseaseList=BaseView.extend({
		events:{	
			"click .J-edit":function(e){
				//1.拿到这一行的数据
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				//2.verform.setData方法
				this.get("card").setData(data);
				var mdata = this.get("card").getData("member");
				mdata.push(data.member);
				this.get("card").setData("member",mdata);
				this.get("card").setValue("member",data.member);
				this.get("card").setAttribute("member","readonly",true);
				//3.隐藏列表显示卡片
				this.get("subnav").hide(["search"]);
				$(".J-card,.J-return").removeClass("hidden");
				$(".J-list,.J-add,.J-building,.J-concerns").addClass("hidden");
			},
			"click .J-delete":function(e){
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				this.del("api/memberconcernset/" + data.pkMemberConcernSet + "/delete");
			},
			"click .J-sealtrue":function(e){
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				this.save("api/memberconcernset/" + data.pkMemberConcernSet + "/concern");
			},
			"click .J-sealfalse":function(e){
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				this.save("api/memberconcernset/" + data.pkMemberConcernSet + "/concern");
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"关注设置",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/memberconcernset/search",
							data:{
								s:str,
								concern:widget.get("subnav").getValue("concerns"),
								searchProperties:"member.personalInfo.name," +
										"member.memberSigning.room.number,"+
										"memberConcernReason.name,recordUser.name,actionRate,date,description",
								fetchProperties:"pkMemberConcernSet," +
										"date,actionRate," +
										"description,member.pkMember," +
										"member.personalInfo.name," +
										"recordUser.name," +
										"member.memberSigning.room.number," +
										"concern," +
										"memberConcernReason.pkMemberConcernReason," +
										"memberConcernReason.name," +
										"version"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								widget.list2Card(false);
							}
						});
					},
					buttons:[{
						id:"add",
						text:"新增",
						type:"button",
						handler:function(){
							widget.get("card").reset();
							widget.get("subnav").hide(["add","concerns","search"]).show(["return"]);
							widget.hide([".J-list",".J-concerns",".J-add",".J-building"]).show([".J-card"])
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						type:"button",
						handler:function(){
							widget.get("subnav").hide(["return"]).show(["search"]);
							widget.show([".J-list",".J-concerns",".J-add",".J-building"]).hide([".J-card"])
						}
					}],
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					},{
						id:"concerns",
						items:[{
							key:true,
							value:"已关注"
						},{
							key:'false',
							value:"未关注"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url:"api/memberconcernset/query",
				fetchProperties:"pkMemberConcernSet," +
						"date,actionRate," +
						"description,member.pkMember," +
						"member.personalInfo.name," +
						"recordUser.name," +
						"member.memberSigning.room.number," +
						"concern," +
						"memberConcernReason.pkMemberConcernReason," +
						"memberConcernReason.name," +
						"version",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						concern:subnav.getValue("concerns"),
						"member.memberSigning.room.building" :subnav.getValue("building"),
						"member.statusIn":"Normal,Nursing,Out,Behospitalized,NursingAndBehospitalized"
					};
				},
				model:{
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号",
						className:"number"
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
						className:"name"
					},{
						key:"date",
						name:"记录时间",
						format:"date",
						className:"date"
					},{
						key:"recordUser.name",
						name:"记录人",
						className:"user"
					},{
						key:"actionRate.value",
						name:"消息频率",
						className:"value"
					},{
						key:"memberConcernReason.name",
						name:"关注原因",
						className:"cause"
					},{
						key:"description",
						name:"备注",
						className:"description"
					},{
						key:"concern",
						name:"操作",
						className:"concern",
						format:function(value,row){
							if(!value){
								var ret = "<div>" + 
								    "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-edit btn btn-xs'><i class='icon-edit' ></i></a>" +  
	 	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-delete btn btn-xs' ><i class='icon-remove' ></i></a>" +  
	 	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-sealtrue btn btn-xs' >关注</a>" +  
							 	
	                            "</div>"; 
							 return ret;  
							}else{
								 var ret1 = "<div>" +  
								 "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-sealfalse btn btn-xs' >取消关注</a>" + 
 	                            "</div>"; 
					          return ret1;  
							}
    					}, 
					}]
				}
			};
		},
		
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					widget.save("api/memberconcernset/save",$("#memberconcernsetForm").serialize(),function(data){
						widget.show([".J-list",".J-concerns",".J-add",".J-building"]).hide([".J-card"]);
						widget.get("subnav").hide(["return"]).show(["search"]);
						widget.get("subnav").setValue("concerns",'false');
						widget.get("subnav").setValue("search","");
						widget.get("list").refresh({
							concern:widget.get("subnav").getValue("concerns"),
							"member.memberSigning.room.building" :widget.get("subnav").getValue("building"),
							"member.statusIn":"Normal,Nursing,Out,Behospitalized,NursingAndBehospitalized",
							fetchProperties:"pkMemberConcernSet," +
							"date,actionRate," +
							"description,member.pkMember," +
							"member.personalInfo.name," +
							"recordUser.name," +
							"member.memberSigning.room.number," +
							"concern," +
							"memberConcernReason.pkMemberConcernReason," +
							"memberConcernReason.name"
						});
					});
				},
				cancelaction:function(){
					widget.show([".J-list",".J-concerns",".J-add",".J-building"]).hide([".J-card"]);
					widget.get("subnav").show(["add","concerns"]).hide(["return"]);
				},
				model:{
					id:"memberconcernsetForm",
					items:[{
						name:"pkMemberConcernSet",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"concern",
						type:"hidden",
						defaultValue:false
					},{
						name:"date",
						type:"hidden",
						defaultValue:moment().valueOf()
					},{
						name:"member",	
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",	
						label:"姓名",
						url:"api/memberconcernset/queryNotConcernMember",
						params:function(){
							return {
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
						validate:["required"]		
					},{
						name:"memberConcernReason",	
						key:"pkMemberConcernReason",
						value:"name",	
						label:"关注原因",
						url:"api/memberconcernreason/query",
						params:function(){
							return {
								fetchProperties:"pkMemberConcernReason,name"
							};
						},
						type:"select",
						validate:["required"]		
					},{
						name:"actionRate",	
						label:"消息频率",
						url:"api/enum/com.eling.elcms.life.model.MemberConcernSet.ActionRate",
						type:"select",
						validate:["required"]		
					},{
						name:"description",
						label:"备注",
						type:"textarea",
					}]
				}
			};
		}
	});
	module.exports=DiseaseList;
});
