/**
 * 会员卡绑定
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Form =require("form-2.0.0")
	var Dialog = require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"; 
	var cardbinding = ELView
			.extend({ 
				events : {
					"change .J-form-cardbinding-select-memberShipCard ":function(e){
						var form=this.get("form");
						form.removeAttribute("idCardNo","readonly");
						form.setValue("idCardNo","");
						form.setValue("personalCardowners","")
						form.setValue("version","")
						form.setValue("toBeStatus","");
						form.setValue("member","");
						form.setValue("status","");
	        			var  pkType =form.getValue("memberShipCard");
	        			var dataType = form.getData("memberShipCard",{
							pk:pkType
						});
	        			if(dataType.toBeStatus!=null){
	        				form.setValue("toBeStatus",dataType.toBeStatus.value);
	        			}
	        			form.load("member",{
	        				params:{
	        					fetchProperties:"pkMember,memCardNo,personalInfo.name,memberSigning.room.number",
	        					"memberSigning.card":dataType.pkMemberShipCard
	        				},
	        			});
	        			aw.ajax({
        					url:"api/annualfeepayer/queryOfCard",
		                	data : {
		                		pkMemberShipCard:pkType,
		                		fetchProperties:"pkPersonalInfo,name"
		                	},
        					dataType:"json",
        					success:function(data){ 
        						var dataname="";
        						if(data.length>0){
        							for(var i=0;i<data.length;i++){
        								if(i<data.length-1){
        									dataname+=data[i].name+",";
        								}else{
        									dataname+=data[i].name;
        								}
        							}
        							form.setValue("personalCardowners",dataname);
        						}
        					}
	        			});
					},
					"change .J-form-cardbinding-select-member ":function(e){
						var form=this.get("form");
						form.setValue("idCardNo","");
	        			var  pkType =form.getValue("member");
	        			var dataType = form.getData("member",{
							pk:pkType
						});
	        			if(dataType.memCardNo!=null&&dataType.memCardNo!=""){
		        			form.setAttribute("idCardNo","readonly","readonly");
		        			form.setValue("idCardNo",dataType.memCardNo);
	        			}else{
	        				form.removeAttribute("idCardNo","readonly");
	        			}
					},
				},
				attrs:{
		        	template:template
		        },
		        initComponent:function(params,widget){
		        	var subnav=new Subnav({
						parentNode:".J-subnav",
						model : {
							title : "会员卡绑定",
							search : function(str) {
								var g = widget.get("grid");
								aw.ajax({
											url : "api/cardbinding/search",
											data : {
												s : str,
												properties : "membershipContract.membershipCard.name",
												fetchProperties : "membershipContract.pkMembershipContract,pkMemberCardBind,version,idCardNo,membershipContract.personalCardowners.personalInfo.name,member.idCardNo,member.pkMember,member.memberSigning.room.number,status.value,membershipContract.membershipCard.pkMemberShipCard,membershipContract.membershipCard.name,member.personalInfo.name,membershipContract.membershipCard.toBeStatus.value"
											},
											dataType : "json",
											success : function(data) {
													g.setData(data);
											}
										});
							},
							buttonGroup : [{
								id:"status",
								items: [{
									key:"Normal",
									value:"正常"
								},{
									key:"Termination",
									value:"已冻结"
								}],	
								handler:function(key,element){
									widget.get("grid").refresh();
								}
							} ,{
								id : "cardType",
								showAll:true,
								showAllFirst:true,
								url : "api/cardtype/query",
								key : "pkMemberShipCardType",
								value : "name",
								items : [],
								lazy:true,
								handler : function(key, element) {
									widget.get("grid").refresh();
								}
							}],
							buttons:[{
            					id:"add",
        						text:"新增",
        						show:true,
        						handler:function(){
        							widget.get("form").reset();
        							widget.show([".J-form"]);
        						}
            				}],
						}
					});
		        	this.set("subnav",subnav);
		        	
		        	var grid=new Grid({
		        		parentNode:".J-grid",
		        		url : "api/cardbinding/query",
						autoRender:false,
						fetchProperties : "membershipContract.pkMembershipContract,pkMemberCardBind,version,idCardNo,membershipContract.personalCardowners.personalInfo.name,member.idCardNo,member.pkMember,member.memberSigning.room.number,status.value,membershipContract.membershipCard.pkMemberShipCard,membershipContract.membershipCard.name,member.personalInfo.name,membershipContract.membershipCard.toBeStatus.value",
						params : function() {
							var subnav = widget.get("subnav");
							return {
								"status" : subnav.getValue("status"),
								"membershipContract.membershipCard.cardType": subnav.getValue("cardType")
							};
						},
						model : {
							columns : [{
										key : "membershipContract.membershipCard",
										name : i18ns.get("sale_card_name","会籍卡号"),
										format:function(value,row){
											return value.name;
										}
									},{
										key : "membershipContract.personalCardowners",
										name : "权益人 ",
										format:function(value,row){
											var name="";
											for(var i=0;i<value.length;i++){
												if(i<value.length-1){
													name+= value[i].personalInfo.name+",";
												}else{
													name+= value[i].personalInfo.name;
												}
											}
											return name;
				 						},
									},{
										key : "member.personalInfo.name",
										name : "会员 "
									},{
										key : "membershipContract.membershipCard",
										name : "会籍卡状态",
										format:function(value,row){
											return value.toBeStatus.value;
										}
									},{
										key : "idCardNo",
										name : "会员卡号"
									},{
										key : "status.value",
										name : "消费状态"
									},{
										key : "operate",
										name : "操作",
										format : "button",
										formatparams : [{
													key:"edit",
							        				icon:"edit",
													handler : function(index,data, rowEle) {
														widget.show([".J-form"]);
														var datas=data;
														var form=widget.get("form");
														form.setData(data);
														form.setValue("memberShipCard",data.membershipContract.membershipCard);
														form.setValue("idCardNo","");
														var  pkType =form.getValue("memberShipCard");
														if(pkType==null){
															var carddata=widget.get("form").getData("memberShipCard","");
															carddata.push(data);
															widget.get("form").setData("memberShipCard",carddata);
															widget.get("form").setValue("memberShipCard",data.membershipContract.membershipCard);
															
															form.setValue("idCardNo",data.idCardNo);
															form.setValue("personalCardowners",data.member.idCardNo);
															form.setValue("toBeStatus",data.membershipContract.membershipCard.toBeStatus.value);
															form.load("member",{
										        				params:{
										        					fetchProperties:"pkMember,memCardNo,personalInfo.name,memberSigning.room.number",
										        					"memberSigning.card":form.getValue("memberShipCard")
										        				},callback:function(data){
										        					form.setValue("member",datas.member);
										        				}
										        			});
														}else{
										        			var dataType = form.getData("memberShipCard",{
																pk:pkType
															});
										        			if(dataType.toBeStatus!=null){
										        				form.setValue("toBeStatus",dataType.toBeStatus.value);
										        			}
								        					form.setValue("idCardNo",datas.idCardNo);
								        					var personal=data.membershipContract.personalCardowners;
															var name="";
															for(var i=0;i<personal.length;i++){
																if(i<personal.length-1){
																	name+= personal[i].personalInfo.name+",";
																}else{
																	name+= personal[i].personalInfo.name;
																}
															}
															form.setValue("personalCardowners",name);
										        			form.load("member",{
										        				params:{
										        					fetchProperties:"pkMember,memCardNo,personalInfo.name,memberSigning.room.number",
										        					"memberSigning.card":dataType.pkMemberShipCard
										        				},callback:function(data){
										        					form.setValue("member",datas.member);
										        				}
										        			});
														}
													}
												},{
													key:"delete",
													icon:"remove",
													handler:function(index,data,rowEle){
														aw.del("api/cardbinding/" + data.pkMemberCardBind + "/delete",function() {
															  widget.get("grid").refresh();
														});
													}
												}]

									} ]
						}
		        	});
		        	 this.set("grid",grid);
		        	 
		        	 var form=new Form({
		        		show:false,
		         		parentNode:".J-form",
		         		saveaction : function() {
		         			aw.saveOrUpdate("api/cardbinding/save",$("#cardbinding").serialize(),function(data){
								widget.get("grid").refresh();
								widget.get("form").reset();
							});
						},
						//取消按钮
		  				cancelaction:function(){
							widget.hide(".J-form").show(".J-grid");
							return false;
		  				},
						model : {
							id : "cardbinding",
							items : [ {
								name : "pkMemberCardBind",
								type : "hidden"
							}, {
								name : "version",
								defaultValue : "0",
								type : "hidden"
							}, {
								name : "memberShipCard",
								label : i18ns.get("sale_card_name","会籍卡号"),
								type:"select",
        						url:"api/cardbalance/queryall",
        						key:"pkMemberShipCard",
        						value:"name",
        						params:function(){
        							return {
        								status:"Normal",
        								fetchProperties:"toBeStatus.value,pkMemberShipCard,name"
        					        };
        						},
        						className:{
        							container:"col-md-6"
        						},
								validate : [ "required" ]
							},{
        						name:"member",
        						label:"会员",
        						url:"api/member/query",
        						key:"pkMember",
        						value:"memberSigning.room.number,personalInfo.name",
        						params:function(){
        							return {
        								fetchProperties:"pkMember,memCardNo,personalInfo.name,memberSigning.room.number"
        					        };
        						},
        						type:"select",
        						className:{
        							container:"col-md-6"
        						},
        						validate : [ "required" ]
        					}, {
								name : "personalCardowners",
								label : "权益人",
								type : "text",
								className:{
									container:"col-md-6"
								},
								readonly:true
							}, {
								name : "idCardNo",
								label : "会员卡号",
								className:{
									container:"col-md-6"
								},
								type : "text",
							}, {
								name : "toBeStatus",
								label : "会籍卡状态",
								type : "text",
								className:{
									container:"col-md-6"
								},
    							readonly:true
							},{
								name : "status",
								label : "会员卡状态",
								type : "select",
								className:{
									container:"col-md-6"
								},
								options:[{
    								key:"Normal",
    								value:"正常"
    							},{
    								key:"Termination",
    								value:"已冻结"
    							}]
							}]
						}
		        	 });
		        	 this.set("form",form);
				},
				afterInitComponent:function(params,widget){
					var subnav=widget.get("subnav");
		        	subnav.load({
						id:"cardType",
						callback:function(data){
							widget.get("grid").refresh();
						}
					});
				}
			});
	module.exports = cardbinding;
});