/**
 * 服务费付款人
 */
define(function(require, exports, module) {
	var BaseDoc=require("basedoc");
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav-1.0.0");
	var store=require("store");
	var Grid = require("grid-1.0.0");
	var Form =require("form-2.0.0")
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
 				"<div class='J-grid'></div>"+ 
 				"<div class='J-form hidden'></div>";

        var annualfeepayer  = ELView.extend({
        	events:{
        		"change .J-form-annualfeepayer-select-room":function(e){
        			var form3=this.get("form");//form
        			var  pkType = form3.getValue("room");//房间信息
        			if(pkType==""){//请选择
        				form3.setAttribute("personalCardowners","readonly","readonly");
						form3.setAttribute("sex","disabled","disabled");
						form3.setAttribute("status","readonly","readonly");
						form3.setAttribute("mobilePhone","readonly","readonly");
						form3.setAttribute("address","readonly","readonly");
						form3.setAttribute("email","readonly","readonly");
						form3.setAttribute("phone","readonly","readonly");
						form3.setAttribute("nationality","readonly","readonly");
						form3.setAttribute("citizenship","readonly","readonly");
						form3.setAttribute("name","readonly","readonly");
						form3.setAttribute("nameEn","readonly","readonly");
						form3.setAttribute("idNumber","readonly","readonly");
						form3.setAttribute("credentialstype","readonly","readonly");
						form3.setAttribute("card","readonly","readonly");
						form3.setAttribute("member","readonly","readonly");
        				form3.setValue("card","");
        				form3.setValue("sex","");
						form3.setValue("name","");
						form3.setValue("nameEn","");
						form3.setValue("idNumber","");
						form3.setValue("address","");
						form3.setValue("mobilePhone","");
						form3.setValue("phone","");
						form3.setValue("email","");
        			}else{//去除只读
        				form3.removeAttribute("mobilePhone","readonly");
						form3.removeAttribute("sex","disabled");
						form3.removeAttribute("member","readonly");
						form3.removeAttribute("personalCardowners","readonly");
						form3.removeAttribute("address","readonly");
						form3.removeAttribute("email","readonly");
						form3.removeAttribute("phone","readonly");
						form3.removeAttribute("nationality","readonly");
						form3.removeAttribute("citizenship","readonly");
						form3.removeAttribute("name","readonly");
						form3.removeAttribute("nameEn","readonly");
						form3.removeAttribute("idNumber","readonly");
						var dataType = this.get("form").getData("room",{
							pk:pkType
						});
								var data=dataType;
        						if(data!=null){
	        						var roomdata=form3.getData("card","");
									roomdata.push(data.membershipContract.membershipCard);
									form3.setData("card",roomdata);
									form3.setValue("card",data.membershipContract.membershipCard);
									form3.load("personalCardowners",{//根据会籍卡查询权益人
										params:{
											pkMemberShipCard:data.membershipContract.membershipCard.pkMemberShipCard,
											fetchProperties:"*"
										},callback:function(data){}
				        			});
									form3.load("member",{
	        							params:{
	        								"memberSigning.room.pkRoom":pkType,
	        								fetchProperties:"pkMember,personalInfo.pkPersonalInfo,memberSigning.membershipContract.membershipCard.name,memberSigning.membershipContract.membershipCard.pkMemberShipCard,personalInfo.idNumber,memberSigning.room.pkRoom,personalInfo.nationality,personalInfo.citizenship.name,personalInfo.citizenship.pkCountry,pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone,personalInfo.email,personalInfo.sex,personalInfo.phone,personalInfo.address,personalInfo.nameEn"
	        		                	},callback:function(data){}
	        						});
									if(form3.getValue("member")==""&&form3.getValue("personalCardowners")==""){
										form3.setValue("sex","");
		        						form3.setValue("nameEn","");
		        						form3.setValue("idNumber","");
		        						form3.setValue("address","");
		        						form3.setValue("mobilePhone","");
		        						form3.setValue("phone","");
		        						form3.setValue("email","");
									}
        						}
		        	
        			}
        		},
				"change .J-form-annualfeepayer-select-member" : function(e){
					var  data= this.get("form").getData();
					var form2=this.get("form");
					form2.setValue("version",data.version);
					form2.setValue("pkPayer",data.pkPayer);
					form2.setValue("personalInfo",data.personalInfo);
					var  pkCard= this.get("form").getValue("card");
					var  pkType = this.get("form").getValue("member");
					var  pkRoom= this.get("form").getValue("room");
					if(pkType==""){
						form2.removeAttribute("personalCardowners","readonly");
						form2.removeAttribute("sex","disabled");
						form2.removeAttribute("mobilePhone","readonly");
						form2.removeAttribute("address","readonly");
						form2.removeAttribute("email","readonly");
						form2.removeAttribute("phone","readonly");
						form2.removeAttribute("nationality","readonly");
						form2.removeAttribute("citizenship","readonly");
						form2.removeAttribute("name","readonly");
						form2.removeAttribute("nameEn","readonly");
						form2.removeAttribute("idNumber","readonly");
						form2.setAttribute("credentialstype","readonly","readonly");
						form2.setValue("sex","");
						form2.setValue("pkPersonalInfo","");
						form2.setValue("name","");
						form2.setValue("nameEn","");
						form2.setValue("idNumber","");
						form2.setValue("address","");
						form2.setValue("mobilePhone","");
						form2.setValue("phone","");
						form2.setValue("email","");
						form2.setValue("credentialstype","Identification");
						form2.setValue("status","Normal");
						form2.setValue("citizenship","48");
						form2.setValue("nationality","Han");
					}else{
						var dataType = this.get("form").getData("member",{
							pk:pkType
						});
						form2.setAttribute("personalCardowners","readonly","readonly");
						form2.setAttribute("sex","disabled","disabled");
						form2.setAttribute("status","readonly","readonly");
						form2.setAttribute("mobilePhone","readonly","readonly");
						form2.setAttribute("address","readonly","readonly");
						form2.setAttribute("email","readonly","readonly");
						form2.setAttribute("phone","readonly","readonly");
						form2.setAttribute("nationality","readonly","readonly");
						form2.setAttribute("citizenship","readonly","readonly");
						form2.setAttribute("name","readonly","readonly");
						form2.setAttribute("nameEn","readonly","readonly");
						form2.setAttribute("idNumber","readonly","readonly");
						form2.setAttribute("credentialstype","readonly","readonly");
						form2.setAttribute("card","readonly","readonly");
						form2.setData(dataType.personalInfo);
						form2.setValue("room",pkRoom);
						form2.setValue("member",pkType);
						form2.setValue("card",pkCard);
						form2.setValue("version",data.version);
						form2.setValue("pkPayer",data.pkPayer);
						form2.setValue("personalInfo",data.personalInfo);
						form2.setValue("status","Normal");
						form2.setValue("credentialstype","Identification");
					}
				},
				"change .J-form-annualfeepayer-select-personalCardowners" : function(e){
					var form1=this.get("form");
					var  data= this.get("form").getData();
					form1.setValue("version",data.version);
					form1.setValue("pkPayer",data.pkPayer);
					form1.setValue("personalInfo",data.personalInfo);
					var  pkRoom= this.get("form").getValue("room");
					var  pkCard= this.get("form").getValue("card");
					var  pkType = this.get("form").getValue("personalCardowners");
						if(pkType==""){
							form1.removeAttribute("member","readonly");
							form1.removeAttribute("sex","disabled");
							form1.removeAttribute("mobilePhone","readonly");
							form1.removeAttribute("address","readonly");
							form1.removeAttribute("email","readonly");
							form1.removeAttribute("phone","readonly");
							form1.removeAttribute("nationality","readonly");
							form1.removeAttribute("citizenship","readonly");
							form1.removeAttribute("name","readonly");
							form1.removeAttribute("nameEn","readonly");
							form1.removeAttribute("idNumber","readonly");
							form1.setAttribute("credentialstype","readonly","readonly");
							form1.setValue("sex","");
							form1.setValue("pkPersonalInfo","");
							form1.setValue("name","");
							form1.setValue("nameEn","");
							form1.setValue("idNumber","");
							form1.setValue("address","");
							form1.setValue("mobilePhone","");
							form1.setValue("phone","");
							form1.setValue("email","");
							form1.setValue("credentialstype","Identification");
							form1.setValue("status","Normal");
							form1.setValue("citizenship","48");
							form1.setValue("nationality","Han");
						}else{
							var dataType = this.get("form").getData("personalCardowners",{
								pk:pkType
							});
							form1.setAttribute("card","readonly","readonly");
							form1.setAttribute("member","readonly","readonly");
							form1.setAttribute("sex","disabled","disabled");
							form1.setAttribute("status","readonly","readonly");
							form1.setAttribute("mobilePhone","readonly","readonly");
							form1.setAttribute("address","readonly","readonly");
							form1.setAttribute("email","readonly","readonly");
							form1.setAttribute("phone","readonly","readonly");
							form1.setAttribute("nationality","readonly","readonly");
							form1.setAttribute("citizenship","readonly","readonly");
							form1.setAttribute("name","readonly","readonly");
							form1.setAttribute("nameEn","readonly","readonly");
							form1.setAttribute("idNumber","readonly","readonly");
							form1.setAttribute("credentialstype","readonly","readonly");
							form1.setData(dataType);
							form1.setValue("room",pkRoom);
							form1.setValue("card",pkCard);
							form1.setValue("version",data.version);
							form1.setValue("pkPayer",data.pkPayer);
							form1.setValue("personalInfo",data.personalInfo);
							form1.setValue("personalCardowners",pkType);
							form1.setValue("status","Normal");
							form1.setValue("credentialstype","Identification");
						}
					},
					"click .J-open":function(e){
						var grid=this.get("grid");
						var index=grid.getIndex(e.target);
						var data=grid.getSelectedData(index);
						aw.saveOrUpdate("api/annualfeepayer/" + data.pkPayer + "/open",data,function(data){
							grid.refresh();
						});
					},
					"click .J-close":function(e){
						var grid=this.get("grid");
						var index=grid.getIndex(e.target);
						var data=grid.getSelectedData(index);
						aw.saveOrUpdate("api/annualfeepayer/" + data.pkPayer + "/close",data,function(data){
							grid.refresh();
						});
					},
					"click .J-edit":function(e){
						var grid=this.get("grid");
						var index=grid.getIndex(e.target);
						var data=grid.getSelectedData(index);
						var form4=this.get("form");
						form4.reset();
						form4.setData(data.personalInfo);
						form4.setValue("version",data.version);
						form4.setValue("pkPayer",data.pkPayer);
						form4.setValue("personalInfo",data.personalInfo.pkPersonalInfo);
						form4.setValue("room",data.memberSigning);
						form4.setValue("credentialstype","Identification");
						form4.setValue("status","Normal");
						
						var room=form4.getData("room","");
						room.push(data.memberSigning);
						form4.setData("room",room);
						form4.setValue("room",data.memberSigning);
			
						var roomdata=form4.getData("card","");
						roomdata.push(data.memberSigning.membershipContract.membershipCard);
						form4.setData("card",roomdata);
						form4.setValue("card",data.memberSigning.membershipContract.membershipCard);
						if(data.type.key=='Member'){
							form4.removeAttribute("member","readonly");
							form4.setAttribute("personalCardowners","readonly","readonly");
							form4.setAttribute("card","readonly","readonly");
							form4.setAttribute("sex","disabled","disabled");
							form4.setAttribute("status","readonly","readonly");
							form4.setAttribute("mobilePhone","readonly","readonly");
							form4.setAttribute("address","readonly","readonly");
							form4.setAttribute("email","readonly","readonly");
							form4.setAttribute("phone","readonly","readonly");
							form4.setAttribute("nationality","readonly","readonly");
							form4.setAttribute("citizenship","readonly","readonly");
							form4.setAttribute("name","readonly","readonly");
							form4.setAttribute("nameEn","readonly","readonly");
							form4.setAttribute("idNumber","readonly","readonly");
							form4.setAttribute("credentialstype","readonly","readonly");
							form4.load("member",{
								params:{
									"memberSigning.room.pkRoom":data.memberSigning.room.pkRoom,
									"memberSigning.status":"",
									fetchProperties:"pkMember,personalInfo.pkPersonalInfo,memberSigning.membershipContract.membershipCard.name,memberSigning.membershipContract.membershipCard.pkMemberShipCard,personalInfo.idNumber,memberSigning.room.pkRoom,personalInfo.nationality,personalInfo.citizenship.name,personalInfo.citizenship.pkCountry,pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone,personalInfo.email,personalInfo.sex,personalInfo.phone,personalInfo.address,personalInfo.nameEn"
			                	},
			                	callback:function(dat){
			                		for(var i=0;i<dat.length;i++){
				                		if(data.personalInfo.pkPersonalInfo==dat[i].personalInfo.pkPersonalInfo){
				                			form4.setValue("member",dat[i]);
				                		}
			                		}
			                	}
							});
							form4.load("personalCardowners",{
								params:{
									pkMemberShipCard:data.memberSigning.membershipContract.membershipCard.pkMemberShipCard,
									fetchProperties:"*"
			                	}
							});
						}else if(data.type.key=="Owner"){
							form4.removeAttribute("personalCardowners","readonly");
							form4.setAttribute("card","readonly","readonly");
							form4.setAttribute("member","readonly","readonly");
							form4.setAttribute("sex","disabled","disabled");
							form4.setAttribute("status","readonly","readonly");
							form4.setAttribute("mobilePhone","readonly","readonly");
							form4.setAttribute("address","readonly","readonly");
							form4.setAttribute("email","readonly","readonly");
							form4.setAttribute("phone","readonly","readonly");
							form4.setAttribute("nationality","readonly","readonly");
							form4.setAttribute("citizenship","readonly","readonly");
							form4.setAttribute("name","readonly","readonly");
							form4.setAttribute("nameEn","readonly","readonly");
							form4.setAttribute("idNumber","readonly","readonly");
							form4.setAttribute("credentialstype","readonly","readonly");
							form4.load("personalCardowners",{
								params:{
									pkMemberShipCard:data.memberSigning.membershipContract.membershipCard.pkMemberShipCard,
									fetchProperties:"*"
			                	},
			                	callback:function(){
			                		form4.setValue("personalCardowners",data.personalInfo);
			                	}
							});
							form4.load("member",{
								params:{
									"memberSigning.room.pkRoom":data.memberSigning.room.pkRoom,
									fetchProperties:"pkMember,personalInfo.pkPersonalInfo,memberSigning.membershipContract.membershipCard.name,memberSigning.membershipContract.membershipCard.pkMemberShipCard,personalInfo.idNumber,memberSigning.room.pkRoom,personalInfo.nationality,personalInfo.citizenship.name,personalInfo.citizenship.pkCountry,pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone,personalInfo.email,personalInfo.sex,personalInfo.phone,personalInfo.address,personalInfo.nameEn"
			                	}
							});
						}else if(data.type.key=="Payer"){
							form4.load("personalCardowners",{
								params:{
									pkMemberShipCard:data.memberSigning.membershipContract.membershipCard.pkMemberShipCard,
									fetchProperties:"*"
			                	},
			                	callback:function(data){
			                	}
							});
							form4.load("member",{
								params:{
									"memberSigning.room.pkRoom":data.memberSigning.room.pkRoom,
									fetchProperties:"pkMember,personalInfo.pkPersonalInfo,memberSigning.membershipContract.membershipCard.name,memberSigning.membershipContract.membershipCard.pkMemberShipCard,personalInfo.idNumber,memberSigning.room.pkRoom,personalInfo.nationality,personalInfo.citizenship.name,personalInfo.citizenship.pkCountry,pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone,personalInfo.email,personalInfo.sex,personalInfo.phone,personalInfo.address,personalInfo.nameEn"
			                	}
							});
						}else{
							form4.removeAttribute("member","readonly");
							form4.setAttribute("personalCardowners","readonly","readonly");
							form4.setAttribute("card","readonly","readonly");
							form4.setAttribute("sex","disabled","disabled");
							form4.setAttribute("status","readonly","readonly");
							form4.setAttribute("mobilePhone","readonly","readonly");
							form4.setAttribute("address","readonly","readonly");
							form4.setAttribute("email","readonly","readonly");
							form4.setAttribute("phone","readonly","readonly");
							form4.setAttribute("nationality","readonly","readonly");
							form4.setAttribute("citizenship","readonly","readonly");
							form4.setAttribute("name","readonly","readonly");
							form4.setAttribute("nameEn","readonly","readonly");
							form4.setAttribute("idNumber","readonly","readonly");
							form4.setAttribute("credentialstype","readonly","readonly");
							form4.load("personalCardowners",{
								params:{
									pkMemberShipCard:data.memberSigning.membershipContract.membershipCard.pkMemberShipCard,
									fetchProperties:"*"
			                	},
			                	callback:function(data){
			                	}
							});
							form4.load("member",{
								params:{
									"memberSigning.room.pkRoom":data.memberSigning.room.pkRoom,
									fetchProperties:"pkMember,personalInfo.pkPersonalInfo,memberSigning.membershipContract.membershipCard.name,memberSigning.membershipContract.membershipCard.pkMemberShipCard,personalInfo.idNumber,memberSigning.room.pkRoom,personalInfo.nationality,personalInfo.citizenship.name,personalInfo.citizenship.pkCountry,pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone,personalInfo.email,personalInfo.sex,personalInfo.phone,personalInfo.address,personalInfo.nameEn"
			                	},
			                	callback:function(dat){
			                		for(var i=0;i<dat.length;i++){
				                		if(data.personalInfo.pkPersonalInfo==dat[i].personalInfo.pkPersonalInfo){
				                			form4.setValue("member",dat[i]);
				                		}
			                		}
			                	}
							});
						}
						this.hide([".J-grid"]).show([".J-form"]);
						this.get("subnav").hide(["add","search","status"]).show(["return"]);
					}
    		},
            attrs:{
            	template:template
            },
            initComponent:function(params,widget){
        			var subnav=new Subnav({
        				parentNode:".J-subnav",
        				model:{
        					title:"服务费付款人",
        					
        					search : function(str) {
        						var g=widget.get("grid");
        						g.loading();
        						aw.ajax({
        							url:"api/annualfeepayer/search",
        							data:{
        								s:str,
        								properties:
        										"memberSigning.room.number," +
        										"personalInfo.name," +
        										"memberSigning.membershipContract.membershipCard.name," +
        										"personalInfo.mobilePhone," +
        										"status.value," +
        										"type.value" ,
        										fetchProperties:"*,memberSigning.room.number,personalInfo.name,personalInfo.phone,personalInfo.mobilePhone," +
        												"personalInfo.pkPersonalInfo,personalInfo.idNumber,personalInfo.nationality," +
        												"personalInfo.nationality,personalInfo.citizenship.name," +
        												"personalInfo.citizenship.pkCountry,personalInfo.email," +
        												"personalInfo.sex,personalInfo.address,personalInfo.nameEn," +
        												"memberSigning.membershipContract.membershipCard.pkMemberShipCard," +
        												"memberSigning.membershipContract.membershipCard.name,memberSigning.room.pkRoom"
        							},
        							dataType:"json",
        							success:function(data){
        								g.setData(data);
        								
        							}
        						});
        					},
        					
        					buttons:[{
            					id:"add",
        						text:"新增",
        						show:true,
        						handler:function(){
        							widget.get("form").reset();
        							widget.get("form").setAttribute("personalCardowners","readonly","readonly");
        							widget.get("form").setAttribute("sex","disabled","disabled");
        							widget.get("form").setAttribute("member","readonly","readonly");
        							widget.get("form").setAttribute("mobilePhone","readonly","readonly");
        							widget.get("form").setAttribute("address","readonly","readonly");
        							widget.get("form").setAttribute("email","readonly","readonly");
        							widget.get("form").setAttribute("phone","readonly","readonly");
        							widget.get("form").setAttribute("name","readonly","readonly");
        							widget.get("form").setAttribute("nameEn","readonly","readonly");
        							widget.get("form").setAttribute("idNumber","readonly","readonly");
        							widget.get("form").setAttribute("card","readonly","readonly");
        							widget.get("form").setValue("credentialstype","Identification");
        							widget.get("form").setValue("status","Normal");
        							widget.get("form").setAttribute("status","readonly","readonly");
        							widget.get("form").setAttribute("credentialstype","readonly","readonly");
        							widget.get("form").setValue("citizenship","48");
        							widget.get("form").setValue("nationality","Han");
        							widget.get("form").setAttribute("nationality","readonly","readonly");
        							widget.get("form").setAttribute("citizenship","readonly","readonly");
        							widget.hide([".J-grid"]).show([".J-form"]);
        							widget.get("subnav").hide(["add","status","search"]).show(["return"]);
        						}
            				},{
        						id:"return",
        						text:"返回",
        						show:false,
        						handler:function(){
        							subnav.hide(["return"]).show(["add","status","search"]);
        							widget.hide([".J-form"]).show([".J-grid"]);
        						}
        					}],
        					buttonGroup:[{
        						id:"building",
								showAll:true,
								showAllFirst:true,
        						handler:function(key,element){
        							widget.get("grid").refresh();
        							widget.get("form").reset();
        							widget.get("form").load("member");
        							widget.get("form").setValue("credentialstype","Identification");
        							widget.get("form").setAttribute("credentialstype","readonly","readonly");
        							widget.get("form").setValue("status","Normal");
        							widget.get("form").setAttribute("status","readonly","readonly");
        							widget.get("form").setValue("citizenship","48");
        							widget.get("form").setValue("nationality","Han");
        							widget.get("form").load("room");
        						}
            				},{
            					id:"status",
            					items:[{
            						key:"Normal",
            						value:"正常"
            					},{
            						key:"Close",
            						value:"关闭"
            					}],
            					handler:function(key,element){
            						widget.get("grid").refresh();
            					}
            				}]
        				}
    				});
        			this.set("subnav",subnav);
            		
                    var grid=new Grid({
                    	parentNode:".J-grid",
						autoRender : false,
                    	url : "api/annualfeepayer/query",
                    	params:function(){
                    		var subnav=widget.get("subnav");
                    		return {
                    			"memberSigning.room.building":subnav.getValue("building"),
                    			status:subnav.getValue("status"),
                    			fetchProperties:"*,memberSigning.room.number,personalInfo.name,personalInfo.phone,personalInfo.mobilePhone,personalInfo.pkPersonalInfo,personalInfo.idNumber,personalInfo.nationality,personalInfo.nationality,personalInfo.citizenship.name,personalInfo.citizenship.pkCountry,personalInfo.email,personalInfo.sex,personalInfo.address,personalInfo.nameEn,memberSigning.membershipContract.membershipCard.pkMemberShipCard,memberSigning.membershipContract.membershipCard.name,memberSigning.room.pkRoom"
                    		};
                    	},
                        model:{
                            columns:[
                            {
                            	key:"memberSigning.room.number",
        						name:"房间号"
        					},{
                            	key:"personalInfo.name",
        						name:"姓名"
        					},{
            					key:"memberSigning.membershipContract.membershipCard.name",
        						name:i18ns.get("sale_card_name","会籍卡")
        					},{
        						key:"personalInfo.phone",
        						name:"电话"
        					},{
        						key:"personalInfo.mobilePhone",
        						name:"移动电话"
        					},{
        						key:"type.value",
        						name:"付款人类型"
        					},{
        						key:"status.value",
        						name:"状态"
        					},{
        						key:"status.key",
        						name:"操作",
        						format:function(value,row){
        							if(value=="Normal"){
        								var ret1 = "<div>" +  
              	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-edit btn btn-xs' ><i class='icon-edit' ></i></a>" +  
              	                            "<a style='margin-left:5px;color:white;background:#f34541' class='J-close btn btn-xs ' href='javascript:void(0);''>关闭</a>" +  
              	                            "</div>"; 
          					          	return ret1;  
          							}else{
          								var ret1 = "<div>" +  
          	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-edit btn btn-xs' ><i class='icon-edit' ></i></a>" +  
          	                            "<a style='margin-left:5px;color:white;background:#f34541' class='J-open btn btn-xs ' href='javascript:void(0);''>打开</a>"+
          	                            "</div>"; 
      					          	return ret1;  
          							}
        						}
        					}]
        				}
                    });
                    this.set("grid",grid);
                        
                    var form=new Form({
        				parentNode:".J-form",
        				saveaction:function(){
        					var phone=form.getValue("phone");
        					var mobilePhone=form.getValue("mobilePhone");
        		    		 if(phone=="" && mobilePhone==""){
        		    			 Dialog.alert({
        							content : "电话和移动电话中必填一个"
        						 });
        		    			 return false;
        		    		 }
        					var data=$("#annualfeepayer").serializeArray();
        					if(data[0]!=""&&data[6]==""&&data[5]==""){
        						
        					}
        					aw.saveOrUpdate("api/annualfeepayer/save",$("#annualfeepayer").serialize(),function(data){
        						if(data.msg){
        							Dialog.alert({
        								content:data.msg
        							});
        							return;
        						}else{
        							subnav.hide(["return"]).show(["add","status","search"]);
        							widget.hide([".J-form"]).show([".J-grid"]);
        							widget.get("grid").refresh();
        						}
        					});
        				},
        				cancelaction:function(){
        					subnav.hide(["return"]).show(["add","status","search"]);
							widget.hide([".J-form"]).show([".J-grid"]);
        				},
        				model:{
        					id:"annualfeepayer",
        					items:[{
        						name:"pkPayer",
        						type:"hidden",
        					},{
        						name:"pkPersonalInfo",
        						type:"hidden",
        					},{
        						name:"personalInfo",
        						type:"hidden",
        					},{
        						name:"version",
        						defaultValue:"0",
        						type:"hidden"
        					},{
        						name:"room",
        						label:"房间",
        						url:"api/membersign/query",
        						params:function(){
        							return {
        								pkBuilding:widget.get("subnav").getValue("building"),
        								status:"Normal",
        								fetchProperties:"room.pkRoom,room.number,membershipContract.membershipCard.pkMemberShipCard,membershipContract.membershipCard.name,memberNames"
        							};
        						},
        						key:"room.pkRoom",
        						value:"room.number",
        						type:"select",
        						validate:["required"]
        					},{
        						name:"member",
        						label:i18ns.get("sale_ship_owner","会员"),
        						lazy:true,
        						url:"api/member/query",
        						key:"pkMember",
        						value:"memberSigning.room.number,personalInfo.name",
        						params:function(){
        							return {
        								"memberSigning.room.building":widget.get("subnav").getValue("building"),
        								fetchProperties:"pkMember,personalInfo.pkPersonalInfo,memberSigning.membershipContract.membershipCard.name,memberSigning.membershipContract.membershipCard.pkMemberShipCard,personalInfo.idNumber,memberSigning.room.pkRoom,personalInfo.nationality,personalInfo.citizenship.name,personalInfo.citizenship.pkCountry,pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone,personalInfo.email,personalInfo.sex,personalInfo.phone,personalInfo.address,personalInfo.nameEn"
        					        };
        						},
        						type:"select"
        					},{
    							label:"权益人",
    							name:"personalCardowners",
    							lazy:true,
    							type:"select",
        						url:"api/annualfeepayer/queryOfCard",
        						key:"pkPersonalInfo",
        						value:"name",
        						params:{
    								fetchProperties:"pkPersonalInfo,idNumber,nationality,citizenship.name,citizenship.pkCountry,name,mobilePhone,email,sex,phone,address,nameEn",
    							},
    						}
        					,{
        						name:"name",
        						label:"姓名(中)",
        						validate:["required"]
        					},{
        						name:"nameEn",
        						label:"姓名(英)"
        					},{
        						name:"card",
        						label:i18ns.get("sale_card_name","会籍卡"),
        						type:"select",
        						key:"pkMemberShipCard",
        						value:"name",
        						validate:["required"],
        						readonly:true
    						}
        					,{
        						name:"credentialstype",
        						label:"证件类型",
        						type:"select",
        						validate:["required"],
        						options:[{
        							key:"Identification",
        							value:"身份证"
        						}],
        						validate:["required"]
        					},{
        						name:"idNumber",
        						label:"证件号码",
        						validate:["required"]
        					}
        					,{
        						name:"sex",
        						label:"性别",
        						type:"radiolist",
        						list:[{
        							key:"MALE",
        							value:"男"
        						},{
        							key:"FEMALE",
        							value:"女"
        						}],
        						validate:["required"]
        					},{
        						name:"citizenship",
        						label:"国籍",
        						type:"select",
        						url:"api/country/query",
        						key:"pkCountry",
        						value:"name"
        					},{
        						name:"nationality",
        						label:"民族",
        						type:"select",
        						options:BaseDoc.nationality
        					},{
        						name:"phone",
        						label:"电话"
        					},{
        						name:"mobilePhone",
        						label:"移动电话"
        					},{
        						name:"email",
        						label:"Email"
        					},{
								name : "address",
								label : "通讯地址",
								type : "textarea",
//								validate:["required"]
							},{
        						name:"status",
        						label:"状态",
        						type:"select",
        						validate:["required"],
        						readonly:true,
        						options:[{
        							key:"Normal",
        							value:"正常"
        						},{
        							key:"Close",
        							value:"关闭" 
        						}]
        					}]
        				}
        			});
        			this.set("form",form);
                },
        		afterInitComponent : function(params,widget) {
        			widget.get("grid").refresh();
            	 }
        });
        module.exports = annualfeepayer ;
});
