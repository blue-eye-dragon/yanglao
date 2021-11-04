define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Form=require("form");
	var emnu = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	require("../../grid_css.css");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-form hidden' ></div>";
	var Service = ELView.extend({
		
		events:{
			
			"click .J-forShort-detail":function(ele){
				var widget=this;
				var grid =this.get("grid");
				var subnav= this.get("subnav");
				var index = grid.getIndex(ele.target);
				var data = grid.getData(index);
				var form =widget.get("form");
				form.reset();
				form.setData(data);
				form.setDisabled(true);
	            form.setValue("edit","no");
				form.setValue("sex",data.member.personalInfo.sex.value);
				form.setValue("age",moment().diff(data.member.personalInfo.birthdayString, 'years'));
				form.setValue("idNumber",data.member.personalInfo.idNumber);
				form.setValue("phone",data.member.personalInfo.phone);			
							
				if(data.deceasedRegister!=null){
				  form.setValue("deceasedDate",data.deceasedRegister.deceasedDate);
				  form.setValue("deceasedRegister",data.deceasedRegister.pkDeceasedMemberRegistration);
							}
																								    
				widget.hide(".J-grid").show(".J-form");
				widget.get("subnav").show(["return"]).hide(["search","add","building","status","consultDate"]);	
				
			}
		},
		
		
		attrs:{
            template:template
		},
		initComponent:function(params,widget){
			var subnav = new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"遗体捐赠",
					items : [{
						id : "search",
						type : "search",
						placeholder : "会员/房间号",
						handler : function(str){
							var g=widget.get("grid");
							var subnav=widget.get("subnav");
							g.loading();
							aw.ajax({
								url:"api/bodydonation/search",
								data:{
									s:str,
									properties: "member.personalInfo.name,member.memberSigning.room.number",
									fetchProperties : 	"pkBodyDonation,"+
									"member.personalInfo.name,"+
									"member.personalInfo.sex,"+
									"member.personalInfo.age,"+
									"member.personalInfo.phone,"+
									"status.value,"+
									"consultDate,"+
									"member.pkMember,"+
									"member.personalInfo.name,"+
									"member.personalInfo.birthday,"+
									"deceasedRegister.deceasedDate,"+		
									"member.memberSigning.room.number,"+
									"version"
								},
								dataType:"json",
								success:function(data){								
									g.setData(data);  
								}
							});
							
						}
					},{
						id:"building",
   						tip:"楼宇",
   						type:"buttongroup",
   						keyField : "pkBuilding",
						valueField : "name",
						url : "api/building/query",
						params : function(){
							return {
								"useType":"Apartment",
								fecthProperties:"pkBuilding,name"
							};
						},
   						showAll:true,
   						showAllFirst:true,
   						handler:function(key,element){
   							
   							widget.get("grid").refresh();
   						}
					},{
						id : "status",
						type:"buttongroup",
						tip : "状态",
						items:[{
							key:"",
							value:"全部"
						},{
							key:"Consult",
							value:"咨询"
						},{
							key:"Submitted",
							value:"已提交"
						},{
							key:"Managed",
							value:"已办理"
						},{
							key:"Finish",
							value:"结束"
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
						id : "consultDate",
						tip : "咨询日期",
						type : "daterange",
						ranges : {
							"上月": [moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")],
					        "本月": [moment().startOf("month"), moment().endOf("month")],
					     },
						defaultRange : "本月",
						handler : function(){
							widget.get("subnav").setValue("search","");
							widget.get("grid").refresh();
						},
					},{
						id : "add",
						type : "button",
						text : "新增",
						handler : function(){
							var form=widget.get("form");
							form.reset();
							form.load("processor",{
								params:{
									fetchProperties:"pkUser,name"
								},
								callback:function(data){									
									var userSelect=form.getData("processor","");								
									var flag = false;
									for(var  i =  0 ; i<userSelect.length;i++ ){
										if(userSelect[i].pkUser == activeUser.pkUser){
											flag= true;
											break;
										}
									}
									if(flag){
										form.setValue("processor",activeUser.pkUser);
									}
									var processor=form.getData("processor","");
									processor.push(activeUser);
									form.setData("processor",processor);
									form.setValue("processor",activeUser);
								}
							});
							widget.get("subnav").hide(["search","add","building","status","consultDate"]).show(["return"]);
							widget.hide([".J-grid"]).show([".J-form"]);
							widget.get("grid").refresh();
						}
					},{
						id : "return",
						type : "button",
						text : "返回",
						show : false,
						handler : function(){
							widget.get("subnav").show(["search","add","building","status","consultDate"]).hide(["return"]);
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("grid").refresh();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url : "api/bodydonation/query",
					params:function(){
						var subnav=widget.get("subnav");
						return{
							"member.memberSigning.room.building.pkBuilding":subnav.getValue("building"),
							"status":subnav.getValue("status"),
							"consultDate": subnav.getValue("consultDate").start,
							"consultDateEnd":subnav.getValue("consultDate").end,
							fetchProperties:
							"pkBodyDonation,"+
							"member.personalInfo.name,"+
							"member.personalInfo.sex,"+
							"member.personalInfo.age,"+
							"member.personalInfo.phone,"+
							"status.value,"+
							"consultDate,"+
							"member.pkMember,"+
							"member.personalInfo.name,"+
							"member.personalInfo.birthday,"+
							"deceasedRegister.deceasedDate,"+								
							"member.memberSigning.room.number,"+
							"firstPerson,"+
							"firstPhone,"+
							"secondPerson,"+
							"secondPhone,"+
							"thirdPerson,"+
							"thirdPhone,"+
							"proxy,"+
							"status,"+
							"consultDate,"+
							"processor.pkUser,"+
							"processor.name,"+
							"processDate,"+
							"description,"+					
							"deceasedRegister.deceasedDate,"+
							"deceasedRegister.pkDeceasedMemberRegistration,"+
							"member.personalInfo.birthdayString,"+
							"member.personalInfo.idNumber,"+
							"version"
							
						}
					},
					columns : [{
						name : "member",
						label : "姓名",
						
					
					format:function(value,row){
						return "<a href='javascript:void(0);' style='color:red;' class='J-forShort-detail'  >"+value.memberSigning.room.number+" "+value.personalInfo.name+"</a>";

					},
                        					    					
					},{
						name : "member.personalInfo.sex.value",
						label : "性别",
						
					},{
						name : "member.personalInfo.birthday",
						label : "年龄",
						format : "age",
							
					},{
						name : "member.personalInfo.phone",
						label : "联系电话",
						
					},{
						name : "status.value",
						label : "状态",			
							
					},{
						name : "consultDate",
						label : "咨询日期",
						format : "date",
						
					},{
						name : "deceasedRegister.deceasedDate",
						label : "过世日期",
						format : "date",
							
					},{
						 name : "operate",
	                        label : "操作",
	                        format : "button",
	                        
	                        formatparams : [{
								id : "edit",
								text : "修改",
								show:function(value,row){
								if(row.status.key=='Consult'){
									return true;
								}else{
									return false;
								}        								
							},
							handler:function(index,data,rowEle){
								var form =widget.get("form");							
								form.reset();																	
										form.setData(data);
										    form.setValue("edit","yes");
											form.setValue("sex",data.member.personalInfo.sex.value);
											form.setValue("age",moment().diff(data.member.personalInfo.birthdayString, 'years'));
											form.setValue("idNumber",data.member.personalInfo.idNumber);
											form.setValue("phone",data.member.personalInfo.phone);			
											
											if(data.deceasedRegister!=null){
											form.setValue("deceasedDate",data.deceasedRegister.deceasedDate);
											form.setValue("deceasedRegister",data.deceasedRegister.pkDeceasedMemberRegistration);
											}
																					    
								widget.hide(".J-grid").show(".J-form");
		        				widget.get("subnav").show(["return"]).hide(["search","add","building","status","consultDate"]);
														
							}
						},
						
					
						{
							id : "delete",
							text : "删除",
							show:function(value,row){
							if(row.status.key=='Consult'){
								return true;
							}else{
								return false;
							}        								
						},
						handler:function(index,data,rowEle){				
							aw.del("api/bodydonation/" + data.pkBodyDonation + "/delete",function(){		
							widget.get("grid").refresh();
							});
						}
						},
						
						{
							id:"commit",
							text:"提交",
							show:function(value,row){
								if(row.status.key=='Consult'){
									return true;
								}else{
									return false;
								}        								
							},
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否提交？",
									confirm:function(){
										aw.ajax({
			    							url:"api/bodydonation/save",
			    							data:{
			    								status:"Submitted",
			    								pkBodyDonation:data.pkBodyDonation,    			    								
			    								version:data.version
			    							},
			    							dataType:"json",
			    							success:function(data){
			    								widget.get("grid").refresh();
			    							}
			    						});
									}
								})
							}
					},{
						id:"withdraw",
						text:"收回",
						show:function(value,row){
							if(row.status.key=='Submitted'||row.status.key=='Managed'){
								return true;
							}else{
								return false;
							}        								
						},
						handler:function(index,data,rowEle){
							Dialog.confirm({
								title:"提示",
								content:"是否收回？",
								confirm:function(){
									aw.ajax({
		    							url:"api/bodydonation/save",
		    							data:{
		    								status:"Consult",
		    								pkBodyDonation:data.pkBodyDonation,		
		    								version:data.version
		    							},
		    							dataType:"json",
		    							success:function(data){
		    								widget.get("grid").refresh();
		    							}
		    						});
								}
							})
						}
				},{
					id:"handle",
					text:"办理",
					show:function(value,row){
						
						if(row.status.key=='Submitted'){
							return true;
						}else{
							return false;
						}        								
					},
					handler:function(index,data,rowEle){
						Dialog.confirm({
							title:"提示",
							content:"是否办理？",
							confirm:function(){
								aw.ajax({
	    							url:"api/bodydonation/save",
	    							data:{
	    								status:"Managed",
	    								pkBodyDonation:data.pkBodyDonation,
	    								version:data.version
	    							},
	    							dataType:"json",
	    							success:function(data){
	    								widget.get("grid").refresh();
	    							}
	    						});
							}
						})
					}
					
			},{
				id:"finish",
				text:"结束",
				show:function(value,row){
					if(row.status.key=='Managed'){
						return true;
					}else{
						return false;
					}        								
				},
				handler:function(index,data,rowEle){
					if(data.deceasedRegister==null){
						Dialog.alert({
							title:"提示",
							content:"未过世的会员不能执行此操作",
							confirm : function(){
							}

						});
					}else{
						
						Dialog.confirm({
							title:"提示",
							content:"是否结束？",
							confirm:function(){
								aw.ajax({
	    							url:"api/bodydonation/save",
	    							data:{
	    								status:"Finish",
	    								pkBodyDonation:data.pkBodyDonation,	    								
	    								version:data.version
	    							},
	    							dataType:"json",
	    							success:function(data){
	    								widget.get("grid").refresh();
	    							}
	    						});
							}
						})
					}
				}
			}]
					}]
				}
			});
			this.set("grid",grid);
			var form = new Form({
				parentNode:".J-form",
				saveaction : function(){
					var member = form.getValue("member");
					if(member){
						aw.saveOrUpdate("api/bodydonation/save",aw.customParam(form.getData()),function(data){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").hide(["return"]).show(["search","add","building","status","consultDate"]);
							widget.get("grid").refresh();
						});
					}else{
						Dialog.alert({
							content : "请选择会员！！",
						});
	    				return false;
					}
                },
				
                    cancelaction : function(){
                    	widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("subnav").hide(["return"]).show(["search","add","building","status","consultDate"]);
						widget.get("grid").refresh();
												
                    },
                    model : {
    					id : "bodydonation",
                    items : [{
                    	name : "pkBodyDonation",
						type : "hidden"
                    },{
                    	name : "version",
                    	defaultValue : "0",
						type : "hidden"
                    },{
						name:"member",
    					label:"姓名",
    					type:"autocomplete",
    					url:"api/member/searchByName",
						keyField:"pkMember",
						queryParamName : "s",
						useCache:false,
						maxItemsToShow:10,
						params:function(){
							return{
								"memberSigning.Status":"Normal",
								searchProperties : "personalInfo.name",
								fetchProperties:
										"personalInfo.pkPersonalInfo," +
										"personalInfo.name," +		
								        "personalInfo.sex," +
										"personalInfo.birthdayString,"+
										"personalInfo.idNumber,"+
										"personalInfo.phone,"+
										"pkMember,"	+								
										"memberSigning.room.number",
							}
						},
						
						format : function(data){//格式化返回的结果
							if(data!=null){
								return data.memberSigning.room.number+" "+data.personalInfo.name;
							}
						},
						onItemSelect : function(data){//选择结果后的触发事件
							if(data){
								form.setValue("sex",data.personalInfo.sex.value);
								form.setValue("age",moment().diff(data.personalInfo.birthdayString, 'years'));
								form.setValue("idNumber",data.personalInfo.idNumber);
								form.setValue("phone",data.personalInfo.phone);
																								
							}
							aw.ajax({
								url:"api/memberDeceases/query",
								data:{
									"member.pkMember":data.pkMember,
									flowStatus:"Confirm",
							        fetchProperties:"member.pkMember," +
							        "deceasedDate,"+"pkDeceasedMemberRegistration"
								},
								dataType:"json",
								success:function(data){
									if(data[0]!=null){
										form.setValue("deceasedDate",data[0].deceasedDate);
										form.setValue("deceasedRegister",data[0].pkDeceasedMemberRegistration);
										
									}
								}
								
							});
						},
    			    		validate:["required"],
					},{
						name:"sex",
    					label:"性别",	
    					readonly : true,   		
					},{
						name:"age",
    					label:"年龄",	
    					readonly : true,
					},{
						name:"idNumber",
    					label:"证件号",	
    					readonly : true,
					},{
						name:"phone",
    					label:"会员联系电话",	
    					readonly : true,
					},{
                    	name : "firstPerson",
                    	label : "第一执行人",
                    },{
                    	name : "firstPhone",
						label : "联系电话",
                    },{
                    	name : "secondPerson",
                    	label : "第二执行人",
                    },{
                    	name : "secondPhone",
						label : "联系电话",
                    },{
                    	name : "thirdPerson",
                    	label : "第三执行人",
                    },{
                    	name : "thirdPhone",
						label : "联系电话",
                    },{
                    	name : "proxy",
                    	label : "委托书",	
                    	type : "radio",
                    	  list : [{
                              key : "true",
                              value : "有"
                          },{
                              key : "false",
                              value : "无"
                          }],
                    	validate : ["required"]
                    },{
                    	name : "status",
                    	label : "状态",
                    	type : "select",
                    	defaultValue:{
							key:"Consult",
							value:"咨询"
						},
						readonly : true,
                    },{
                    	name : "consultDate",
						label : "咨询日期",
	                    type : "date",
	                    defaultValue : moment().valueOf(),
                    },{
	                    name:"deceasedDate",
    					label:"过世日期",
    					type:"date",
						mode:"YYYY-MM-DD",
						readonly:"true"
										
                    },{
                    	name : "deceasedRegister",
						type : "hidden"
                    },{
						name : "processor",
						label : "处理人",
						type : "select",
						keyField : "pkUser",
						valueField : "name",
						options : [ activeUser ],
						defaultValue : activeUser.pkUser
								+ "",
						readonly : "true"

					},{
                    	name : "processDate",
						label : "处理时间",
	                    type : "date",
	                    readonly : true,
	                    defaultValue : moment().valueOf(),
						validate : ["required"],
                    },{
	   					name : "description",
						label : "备注",
						type : "textarea",
                    },{
                    	name : "edit",
						type : "hidden"
                    }]
				}
			});
			this.set("form",form);
		},
	});
	module.exports = Service;
});
