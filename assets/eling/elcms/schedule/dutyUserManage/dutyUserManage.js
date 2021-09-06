define(function(require, exports, module) {
	var ElView=require("elview");
    var aw = require("ajaxwrapper");
    var Subnav = require("subnav-1.0.0");	
    var Dialog=require("dialog-1.0.0");
	var Tab=require("tab");
//	var Form2 =require("form-2.0.0");
	var Form3 =require("form");
	var Select = require("select");
	var Button = require("button");
	var _ = require("underscore");
	var pkBuildings = [];
	require("./dutyUserManage.css");
	
	var dutyUserManage=ElView.extend({
		attrs:{
			template: "<div class='J-subnav'></div>"+
			"<div class='J-tab'></div>"
		},
		events:function(){
			var events = {};
			events["change .J-form-dutyusermanager-select-user"] =function(e){
				$(".J-form-dutyusermanager-save").attr("disabled",false);
			};
			events["change .J-form-dutyusermanager-select-icon"] =function(e){
				$(".J-form-dutyusermanager-save").attr("disabled",false);
			};
//			events["change .J-form-secretaryForm-select-users_0"] =function(e){
//				var users=[];
//				$(".J-form-secretaryForm-select-users_0 .select2-search-choice div").each(function(){
//	    			users.push($(this).text())});
//				var formdata=secretaryForm.getData();
//				var i;
//			}
			return events;
		},
		//刷新页面
		_refeshManagerForm : function(widget){
			//加载排班经理
			widget.get("managerForm").load("user",{
				params:{
					fetchProperties:"pkUser,name,icon"
				},
				callback:function(datas){
					aw.ajax({
						url : "api/dutyuser/query",
						type : "POST",
						data : {
							"schedulType":"DutyManager", 
							"ifEffect":"true",
							fetchProperties:"user.pkUser,user.name,icon,iorder"
						},
						success : function(data){
							var user = [];
							var users = [];
							var icon = "";
							var ordermap={};
							for (var i=0; i<data.length; i++){
								user[i]=data[i].user.pkUser;
								icon=data[i].icon;
								var iorder=data[i].iorder;
								if(!ordermap[iorder]){
									ordermap[iorder]=[];
								}
								ordermap[iorder].push(data[i]);
							}
							for(var w in ordermap){
								for(var m=0;m<ordermap[w].length;m++){
									users.push(ordermap[w][m].user);
								}
							}
							for(var a=0;a<datas.length;a++){
								for(var b=0;b<users.length;b++){
									if(datas[a].pkUser==users[b].pkUser){
										datas.splice(a,1);
										break;
									}
								}
							}
							var userData =users.concat(datas);
							widget.get("managerForm").setData("user",userData);
							widget.get("managerForm").setValue("user",[]);
							widget.get("managerForm").setValue("user",user);
							widget.get("managerForm").setValue("icon",icon);
						}
					});
				
					//widget._setManageUser(widget,data);
				}
			});
		},
		//刷新页面
		_refeshSecretaryForm : function(widget){
			//加载参与排班的楼
			aw.ajax({
				url : "api/building/query",
				type : "POST",
				data : {
					fetchProperties:"pkBuilding,name"
				},
				success : function(datas) {
					if (datas.length>0){//查询楼对应的秘书
						widget._getSecretaryForm(datas,	widget);
						aw.ajax({
							url : "api/dutyScheduling/querybuildingroleuser",
							type : "POST",
							data : {
								fetchProperties:"pkBuilding,buildname,pkUser,name"
							},
							success : function(datas) {
								if (datas.length>0){
									//1
									//将秘书按楼分组
									var pkBs = widget.get("pkBuildings");
									for(var i=0;i<pkBs.length;i++){
										widget.get("secretaryForm").setValue("users_"+pkBs[i],[]);
									}
									aw.ajax({//查询每个楼中已经设置的值班人员
										url : "api/dutyuser/query",
										type : "POST",
										data : {
											"schedulType":"Secretary",
											"ifEffect":"true",
											fetchProperties:"user.pkUser,user.name,iorder,dutyBuilding.pkBuilding,icon"
										},
										success : function(selectDatas) {
										
												for(var j=0;j<pkBs.length;j++){//按楼号分人员
													var detail=[];
													var detailPk=[];
													var ordermap={};
													var pkbuilding="";
													var icon="";
													for(var m=0;m<datas.length;m++){
														if(pkBs[j]==datas[m].pkBuilding){
															pkbuilding=datas[m].pkBuilding;
															detail.push(datas[m]);
														}
													}
													for(var t=0;t<selectDatas.length;t++){
														if(pkBs[j]==selectDatas[t].dutyBuilding.pkBuilding){
															pkbuilding=selectDatas[t].dutyBuilding.pkBuilding;
															icon=selectDatas[t].icon;
															var iorder=selectDatas[t].iorder;
															if(!ordermap[iorder]){
																ordermap[iorder]=[];
															}
															ordermap[iorder].push(selectDatas[t]);
															//ordermap[];
//															detailPk.push(selectDatas[t]);									
														}
													}
//													ordermap.sort(iorder);
													for(var w in ordermap){
														for(var m=0;m<ordermap[w].length;m++){
															detailPk.push(ordermap[w][m].user);
														}
													}
													
													
													for(var a=0;a<detail.length;a++){
														for(var b=0;b<detailPk.length;b++){
															if(detail[a].pkUser==detailPk[b].pkUser){
																detail.splice(a,1);
																break;
															}
														}
													}
													if(detailPk.length>0){
														var userData =detailPk.concat(detail);
														widget.get("secretaryForm").setData("users_"+pkBs[j],userData);
//														widget.get("secretaryForm").setValue("build_"+pkBs[j],pkbuilding);
														widget.get("secretaryForm").setValue("users_"+pkBs[j],detailPk);
														widget.get("secretaryForm").setValue("icons_"+pkBs[j],icon);
													}else{
														widget.get("secretaryForm").setData("users_"+pkBs[j],detail);
													}
													
												}
										}
									});
								}
								$(".J-form-secretaryForm-save").attr("disabled",true);
								$(".J-form-secretaryForm-cancel").hide();
							}
						});
					}
				}
			});
		},
		//按楼宇生成表单
		_getSecretaryForm : function (result,widget){
			var orgForm=widget.get("secretaryForm");
			if(orgForm){
				widget.get("secretaryForm").destroy();
			}
			var ret = [];
			for(var i=0;i<result.length;i++){
				ret.push({
					key:result[i].pkBuilding,
					value:result[i].name,
					});
				}
			var ret=_.uniq(ret,true,function(ret){return ret.key});//获取楼号
			var items = [];
			
			var length = ret.length;
			//记录楼宇主键
			var pkBs = [];
			for(var k=0;k<length;k++){
				pkBs[k]=ret[k].key;
			}
			pkBuildings=pkBs;
			widget.set("pkBuildings",pkBs);
			for(var j=0;j<length;j++){
				(function(index,orgForm){
					var detail=[];
					var item = {
						name:"users_"+ret[index].key,
						label:ret[index].value + "排班秘书",
						keyField:"pkUser",
					    valueField:"name",
					    options:detail,
					    type:"select", 
					    multi : true,
					    events : {
					    	change : function(e){
					    		$(".J-form-secretaryForm-save").attr("disabled",false);
					    	}
					    },
					    className:{
					    	container:"col-md-8",
							label:"col-md-3"
					    }
					};
					var build ={
						name:"build_"+ret[index].key,
						defaultValue:ret[index].key,
					    type:"hidden"
					};
					var icon = {
							name:"icons_"+ret[index].key,
							label:ret[index].value + "图标",
							events : {
						    	change : function(e){
						    		$(".J-form-secretaryForm-save").attr("disabled",false);
						    	}
						    },
							options:[{
								key:"icon-check-empty",
								value:"□"
							},{
								key:"icon-star-empty",
								value:"☆"
							},{
								key:"icon-circle-blank",
								value:"○"
							},{
								key:"icon-sort-down",
								value:"▼"
							},{
								key:"icon-sort-up",
								value:"▲"
							},{
								key:"icon-frown",
								value:"☹"
							},{
								key:"icon-smile",
								value:"☺"
							}],
						    type:"select", 
						    className:{
						    	container:"col-md-4",
								label:"col-md-3"
						    }
					};
					items.push(item);
					items.push(build);
					items.push(icon);
				})(j,orgForm);
			}
			var secretaryForm=new Form3({
				parentNode:"#secretary",
				model:{
					id:"secretaryForm",
					style:"margin-top:20px;",
					saveaction:function(){
						var formdata=secretaryForm.getData();
						var datas = {};
						var buildings = [];
						var users = [];
						var data2=[];
						var pkBs = widget.get("pkBuildings");
						for(var i=0;i<pkBs.length;i++){
							var users=[];
				    		$(".J-form-secretaryForm-select-users_"+pkBs[i]+" .select2-search-choice div").each(function(){
				    			users.push($(this).text())});
				    		var formdata=secretaryForm.getData("users_"+ret[i].key);
				    		var pkusers=[];
				    		for(var a=0; a<users.length;a++){
				    			for(var b=0; b<formdata.length;b++){
				    				if(users[a]==formdata[b].name){
					    				var user = formdata[b].pkUser;
					    				pkusers.push(user);
					    				break;
						    		}
				    			}
				    		}
							for(var j=0;j<pkusers.length;j++){
								var obj={};
								obj.iorder=j;
								obj.dutyBuilding=secretaryForm.getValue("build_"+pkBs[i]);
								obj.user=pkusers[j];
								obj.icon=secretaryForm.getValue("icons_"+pkBs[i]);
								data2.push(obj);
							}
						}
						datas.listCond = data2;
						aw.saveOrUpdate("api/dutyuser/saveSecretary",aw.customParam({users:datas}),function(data){
							Dialog.alert({
								content:"保存成功"
							});
							widget._refeshSecretaryForm(widget);
							$(".J-form-secretaryForm-save").attr("disabled",true);
							return;
						});
						
					},
					cancelaction:function(){
						widget._setSecretaryValue(widget);
	  				},
					items:items
				}
			});
			widget.set("secretaryForm",secretaryForm);
		
		},
		_setSecretaryValue : function (widget){
			var pkBs = widget.get("pkBuildings");
			for(var i=0;i<pkBs.length;i++){
				widget.get("secretaryForm").setValue("users_"+pkBs[i],[]);
			}
			aw.ajax({
				url : "api/dutyuser/query",
				type : "POST",
				data : {
					"schedulType":"Secretary",
					"ifEffect":"true",
					fetchProperties:"user.pkUser,user.name,dutyBuilding.pkBuilding,icon"
				},
				success : function(datas) {
					
					if (datas.length>0){
						return datas;
						for(var j=0;j<pkBs.length;j++){//按楼号分人员
							var detailPk=[];
							var pkbuilding="";
							var icon="";
							for(var t=0;t<datas.length;t++){
								if(pkBs[j]==datas[t].dutyBuilding.pkBuilding){
									pkbuilding=datas[t].dutyBuilding.pkBuilding;
									icon=datas[t].icon;
									detailPk.push(datas[t].user.pkUser);									
								}
							}
//							widget.get("secretaryForm").setValue("build_"+pkBs[j],pkbuilding);
							widget.get("secretaryForm").setValue("users_"+pkBs[j],detailPk);
							widget.get("secretaryForm").setValue("icons_"+pkBs[j],icon);
						}
					}else{
						return null;
					}
				}
			});
		},
		_setSecretarySelect : function (result, widget){
			var pkBs = widget.get("pkBuildings");			
			for(var j=0;j<pkBs.length;j++){//按楼号分人员
				var detail=[];
				var pkbuilding;
				for(var t=0;t<result.length;t++){
					if(pkBs[j]==result[t].pkBuilding){
						pkbuilding=result[t].pkBuilding;
						detail.push(result[t]);
					}
				}
				widget.get("secretaryForm").setData("users_"+pkBs[j],detail);
			}
		},
		_setManageUser:function(widget){
			aw.ajax({
				url : "api/dutyuser/query",
				type : "POST",
				data : {
					"schedulType":"DutyManager", 
					"ifEffect":"true",
					fetchProperties:"user.pkUser,user.name,icon"
				},
				success : function(data){
					var user = [];
					var icon = "";
					for (var i=0; i<data.length; i++){
						user[i]=data[i].user.pkUser;
						icon=data[i].icon;
					}
					widget.get("managerForm").setValue("user",[]);
					widget.get("managerForm").setValue("user",user);
					widget.get("managerForm").setValue("icon",icon);
				}
			});
		},

		getSecretaryForm:function(data){
			
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"值班人员设置"
				}
			});
			this.set("subnav",subnav);
			
			var tab = new Tab({
				parentNode:".J-tab",
				model:{
					items:[{
						id:"manager",
						title:"值班经理"
					},{
						id:"secretary",
						title:"值班秘书"
					}]
				}
			});
			
			var managerForm=new Form3({
				parentNode:"#manager",
				saveaction:function(){
					//var formdata=managerForm.getData();
//					var user = managerForm.getValue("user");
					var users=[];
		    		$(".J-form-dutyusermanager-select-user .select2-search-choice div").each(function(){
		    			users.push($(this).text())});
		    		var formdata=managerForm.getData("user");
		    		var pkusers=[];
		    		 for(var a=0; a<users.length;a++){
		    		   for(var b=0; b<formdata.length;b++){
		    				if(users[a]==formdata[b].name){
			    				var user = formdata[b].pkUser;
			    				pkusers.push(user);
			    				break;
				    		}
		    			}
		    		}
					var iorder=[];
					for(var i=0;i<pkusers.length;i++){
						iorder[i]=i;
					}
					aw.saveOrUpdate("api/dutyuser/saveManage",aw.customParam({
							users:pkusers,
							iorder:iorder,
							icon:managerForm.getValue("icon")
						}),function(data){
						Dialog.alert({
							content:"保存成功"
						});
						widget._refeshManagerForm(widget);
						$(".J-form-dutyusermanager-save").attr("disabled",true);
						return;
					});
					
				},
				cancelaction:function(){					
					widget._setManageUser(widget);
				},
				model:{
					id:"dutyusermanager",
					
					items:[{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},
//					{
//						name:"role",
//						label:"角色",
//						url:"api/role/unadmin/query",
//						key:"pkRole",
//						value:"name",
//						params:function(){
//							return {
//								fetchProperties:"pkRole,name"
//							};
//						},
//						type:"select",
//						validate:["required"]
//					},
					{
						name:"user",
						label:"值班经理",
						url:"api/users/nofreeze",
						lazy:true,
						key:"pkUser",
						value:"name",
						params:function(){
							return {
//								"roleIn":widget.get("managerForm").getValue("role"),
								fetchProperties:"pkUser,name"
							};
						},
						type:"select",
						multi : true,
					},{
						name:"icon",
						label:"图标",
						type:"select",
						options:[{
							key:"icon-check-empty",
							value:"□"
						},{
							key:"icon-star-empty",
							value:"☆"
						},{
							key:"icon-circle-blank",
							value:"○"
						},{
							key:"icon-sort-down",
							value:"▼"
						},{
							key:"icon-sort-up",
							value:"▲"
						},{
							key:"icon-frown",
							value:"☹"
						},{
							key:"icon-smile",
							value:"☺"
						}],
					}]
				}
             });
			this.set("managerForm",managerForm);
			
//			var select = new Select({
//				parentNode : "#secretary",
//				model : {
//					id:"role",
//					type:"select",
//					placeholder : "请选择角色",
//					keyField : "pkRole",
//					valueField : "name",
//					style:"position: relative;padding:0 15px;margin-bottom:20px;",
//					url : "api/dutyScheduling/queryrole",
//					params : function(){
//						return {
//							"schedulType":"Secretary",
//							fetchProperties:"pkRole,name"
//						};
//					},
//					multi : true
//				}
//			});
//			this.set("select",select);
//         
//			var confirmrole = new Button({
//				parentNode:"#secretary",
//				model:{
//					id:"confirmrole",
//					text:"确定",
//					style:"position: absolute;right: 40px;top: 72px;",
//					handler : function(e){
//						var roles =widget.get("select").getValue();
//						var role ="";
//						for(var i=0;i<roles.length;i++){
//							if(i==(roles.length-1)){
//								role+=roles[i];
//							}else{
//								role+=roles[i]+",";
//							}
//						}
//						aw.ajax({
//							url : "api/dutyScheduling/querybuildingroleuser",
//		   					type : "POST",
//		   					data : {
//		   						"rolein":role,
//		   						fetchProperties:"pkBuilding,buildname,pkUser,username"
//		   					},
//							success : function(datas) {
//								if (datas.length>0){
//									widget._setSecretarySelect(datas,widget);
//									widget._setSecretaryValue(widget,false);
//								}
//							}
//						});
//					},
//				}
//			})
//			this.set("confirmrole",confirmrole);
			
					
			this.set("tab",tab);
		},
		afterInitComponent:function(params,widget){
			//设置两个表单的保存按钮置灰
			$(".J-form-dutyusermanager-save").attr("disabled",true);
			
			//隐藏两个表单的取消按钮
			
			$(".J-form-dutyusermanager-cancel").css('display','none');
			
			//加载排班经理
			widget._refeshManagerForm(widget);
			//加载参与排班的楼
			widget._refeshSecretaryForm(widget);
		}
	});
	module.exports = dutyUserManage;
});
