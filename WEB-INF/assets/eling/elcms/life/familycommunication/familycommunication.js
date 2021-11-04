define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Dialog=require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	var store = require("store");
	var loginUser = store.get("user");
	var i18ns = require("i18n");
	var familycommunication = BaseView.extend({
		forward:{
			memberstatus:function(params,widget){
				if(params.name){
					var subnav=widget.get("subnav");
					subnav.setValue("building",params.pkBuilding);
					subnav.hide(["building","search"]);
					widget.get("subnav").setTitle("家属沟通："+params.name);
					widget.get("list").refresh();
					if(!params.flg){
						widget._add();
						widget.get("list").refresh();
						widget.get("card").load("member",{
							callback:function(){
								if(params && params.member){
									widget.get("card").setValue("member",params.member);
								}
							}
						});
					}
				}else{
					widget._add();
					var subnav=widget.get("subnav");
					if(params && params.pkBuilding){
						subnav.setValue("building",params.pkBuilding);
					}
					widget.get("list").refresh();
					widget.get("card").load("member",{
						callback:function(){
							if(params && params.member){
								widget.get("card").setValue("member",params.member);
							}
						}
					});
				}
				
			}
		},
		_add:function(){
			this.get("card").reset();
			var cd=this.get("card");
			cd.setAttribute("recorder","readonly",true);
			cd.setAttribute("recordDate","disabled",true);
			this.show(".J-card").hide(".J-list,.J-search");
			this.get("subnav").show(["return"]).hide(["adds"]);
			var userSelect  = this.get("card").getData("communicater","");
			var flag = false ;
			for(var i=0;i<userSelect.length;i++){
				if(userSelect[i].pkUser==loginUser.pkUser){
					flag=true;
					break;
				}
			}
			if(flag){
				this.get("card").setValue("communicater",loginUser);
			}
		},
		initSubnav:function(widget){
			var params = this.get("params");
			return {
				model:{
					title:"家属沟通",
					buttons:[{
						id:"adds",
						text:"新增",
						//TODO cjf 会员过世后，暂时不限制
						/*show:params&&params.flg=="deceasedmembers"?false:true,*/
						handler:function(){
							widget._add();
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-list,.J-search").hide(".J-card");
							widget.get("subnav").show(["adds"]).hide(["return"]);
						    widget.get("subnav").show(["search","time","building","orderString" ]);

							return false;
						}
					}],
					buttonGroup:[{
						id:"building",
						tip:"楼宇",
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
							widget.get("card").load("communicater");
						}
					},{
						id:"orderString",
						tip:"排序",
						items:[{
							key:"communicationTime:desc",
							value:"沟通时间"
						},{
							key:"member.memberSigning.room.number",
							value:"房间号"
						}],
						handler:function(key,element){
							widget.get("list").refresh()
						}
					}],
					time:{
						tip:"沟通日期",
						click:function(time){
							widget.get("list").refresh();
						}
					},
					search:function(str) {
		            	   widget.get("list").loading();
							aw.ajax({
								url:"api/familycommunication/search",
								data:{
									s:str,
									properties:"member.memberSigning.room.number,member.personalInfo.name,dependentName,manner,nexus,content,communicater.name",
								    "member.statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
								    "member.memberSigning.status":"Normal",
 									"member.memberSigning.houseingNotIn":false,
								    fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name,manner,communicater.name"   
								},
								dataType:"json",
								success:function(data){
									widget.get("list").setData(data);
								}
						});
				 	}
				}
			};
		},
		initList:function(widget){
			var inParams = widget.get("params");
			return {
				url : "api/familycommunication/query",
				fetchProperties:"*,recorder.pkRecorder,recorder.name,member.personalInfo.name,member.memberSigning.status,member.status,member.personalInfo.pkPersonalInfo,member.memberSigning.room.number,manner.value,communicater.name",
				autoRender:false,
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					
					if(inParams&&inParams.name){
						return{
							"member.pkMember":inParams.member,
							"communicationTime": time.start,
							"communicationTimeEnd":time.end,
					    	"orderString":subnav.getValue("orderString")
						};
					}else{
						return {
							"member.memberSigning.room.building":subnav.getValue("building"),
						    "member.memberSigning.statusIn":"Normal",
							"member.memberSigning.houseingNotIn":false,
							"member.statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
							"communicationTime": time.start,
							"communicationTimeEnd":time.end,
					    	"orderString":subnav.getValue("orderString")
						};
					}
				},
				model:{
					columns:[{
						col:1,
 						key:"member.memberSigning.room.number",
 						name:"房间号",
 						format:"detail",
 						formatparams:[{
 							key:"detail",
							handler:function(index,data,rowEle){
							    widget.get("subnav").show([ "return" ]).hide(["search","adds","time","building","orderString" ]);
								widget.edit("detail",data);
							}
 						}]
 					},{
 						col:1,
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						col:1,
						key:"dependentName",
						name:"家属"
					},{
						col:1,
						key:"nexus",
						name:"关系",
					},{
						col:1,
						key:"manner.value",
						name:"沟通方式",
					},{
						col:2,
						key:"communicationTime",
						name:"沟通时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						col:2,
						key:"content",
						name:"沟通内容"
					},{
						col:1,
						key:"communicater.name",
						name:"沟通秘书"
					},{
						col:1,
						key:"recorder.name",
						name:"记录人",
					},{
						col:1,
						key:"recordDate",
						name:"记录日期",
						format:"date",
					},{
						col:0,
						key:"operate",
						name:"操作",
						format:function(row,value){
							//TODO cjf 会员过世后，暂时不限制
							/*if(inParams&&inParams.flg=="deceasedmembers"){
								return " ";
							}else{*/
								return "button";
//							}
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								data.membernumber=data.member.memberSigning.room.number;
								 widget.edit("edit",data);
								 widget.show(".J-card").hide(".J-list,.J-search");
								 widget.get("subnav").show(["return"]).hide(["adds"]);
								var  form =	widget.get("card");
								form.setAttribute("recorder","readonly",true);
								form.setAttribute("recordDate","disabled",true);
								 
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/familycommunication/" + data.pkFamilyCommunication + "/delete");
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					if (widget.get("card").getValue("member") == ""){
						Dialog.alert({
    						content : "请选择"+i18ns.get("sale_ship_owner","会员")+"!"
    					 });
    					return false;
					}
					var a=widget.get("card").getValue("recordDate");
					var params = $("#familycommunication").serialize()+"&"+"recordDate="+a;
					widget.save("api/familycommunication/save",params,function(data){
						
						widget.get("subnav").show("adds");
						widget.show(".J-search");
						widget.get("list").refresh();
					});
					
				},
				//取消按钮
  				cancelaction:function(){
  					widget.list2Card(false);
  					widget.get("subnav").show("adds");
  					widget.show(".J-search");
  				},
				model:{
					id:"familycommunication",
					items:[{
						name:"pkFamilyCommunication",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						type:"select",
						url:"api/member/query",
						params:function(){
							var params=widget.get("params");
							if(params&&params.name){
								return {
									"pkMember":params.member,
									"memberSigning.room.building":widget.get("subnav").getValue("building"),
									fetchProperties:"*,personalInfo.name,personalInfo.pkPersonalInfo,memberSigning.room.number"
								};
							}else{
								return {
									"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
									"memberSigning.status":"Normal",
 									"memberSigning.houseingNotIn":false,
									"memberSigning.room.building":widget.get("subnav").getValue("building"),
									fetchProperties:"*,personalInfo.name,personalInfo.pkPersonalInfo,memberSigning.room.number"
								};
							}
							
						},
						lazy:true,
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name"
					},{
						name:"dependentName",
						label:"家属",
						validate:["required"]
					},{
						name:"nexus",
						label:"关系",
						validate:["required"]
					},{
						name:"communicationTime",
						label:"沟通时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"communicater",
						label:"沟通秘书",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/user/building",//TODO 用户角色：wulina 秘书
						params:{
							pkRole:6,
							pkBuilding:widget.get("subnav").getValue("building"),
							fetchProperties:"pkUser,name"
						},
						validate:["required"]
					},{
						name:"manner",
						label:"沟通方式",
						type:"select",
						url:"api/enum/com.eling.elcms.life.model.FamilyCommunication.Manner",
						validate:["required"]
					},{
						name:"content",
						label:"沟通内容",
						type:"textarea",
						validate:["required"]
					},{
						name:"recorder",
						label:"记录人",
						key:"pkUser",
						value:"name",
						url:"api/users",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
							  }
								},
						type:"select",
						defaultValue : loginUser.pkUser,
						validate:["required"]
					},{
						name:"recordDate",
						label:"记录日期",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"],
					}]
				}
			};
		},
//		afterInitComponent:function(params,widget){
//			var subnav=widget.get("subnav");
//			if(params && params.pkBuilding){
//				subnav.setValue("building",params.pkBuilding);
//				var time=subnav.getValue("time");
//				params.start=time.start;
//				params.end=time.end;
//			}
//			widget.get("list").refresh(params);
//		}
		afterInitComponent:function(params,widget){
			var forward=this.get("forward");
			var forwardHandler=this.forward[forward];
			if(typeof forwardHandler === "function"){
				forwardHandler(params,widget);
			}else{
					widget.get("list").refresh(params);
					widget.get("card").load("member");
			}
		}
	});
	module.exports = familycommunication;
});