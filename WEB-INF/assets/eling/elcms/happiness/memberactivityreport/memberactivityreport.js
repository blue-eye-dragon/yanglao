define(function(require, exports, module) {
	//多语
	var i18ns = require("i18n");
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var Subnav = require("subnav");
	var Grid = require("grid-1.0.0");
	var Profile = require("profile");
	var store = require("store");
	var Form=require("form");
	var activeUser = store.get("user");
	require("./memberactivityreport.css");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>" +
	 "<div class='J-profile hidden'></div>";

    var MemberActivityReport = ELView.extend({
        attrs:{
        	template:template
        },
        _getDate:function(timestrap){
        	return moment(timestrap).format("YYYY年MM月DD日HH时mm分")
		},
        events:{
			"change .J-form-memberactivityreport-select-activity":function(e){
				var pk=$(e.target).find("option:selected").attr("value");
				var params=this.get("params");
				var form=this.get("form");
				if(pk){
					aw.ajax({
						url : "api/activitysignup/query",
						type : "POST",
						data : {
							type:params ? params.activityreportType : "",
							activity:pk,
							fetchProperties:"*,activity.theme,member.personalInfo.name,"
						},
						success:function(data){
							if(!data || data.length==0){
								Dialog.tip({
									title:"该活动没有报名参加的"+i18ns.get("sale_ship_owner","会员")
								});
								//profile.setModel("member",[]);
								return false;
							}
							$(".J-theme").val(data[0].activity.theme);
							form.load("member",{
								params:{
									type:params ? params.activityreportType : "",
									activity:pk,
									fetchProperties:"member.pkMember," +
											"member.personalInfo.name," +
											"member.personalInfo.sex," +
											"member.personalInfo.birthday," +
											"member.personalInfo.residenceAddress"
								},
								callback:function(data){
									form.setValue("sex",[]);
									form.setValue("age",[]);
									//form.setValue("residenceAddress",[]);
								}
							});
						}
					});
				}
			},
			"change .J-form-memberactivityreport-select-member":function(e){
				var form = this.get("form");
				var member = form.getValue("member");
				aw.ajax({
					url : "api/member/"+member,
					data:{
						fetchProperties:"pkMember," +
						"personalInfo.name," +
						"personalInfo.sex," +
						"personalInfo.birthday," +
						"personalInfo.residenceAddress"
					},
					dataType:"json",
					success:function(data){
						//form.setData(data);
						form.setValue("sex",data.personalInfo.sex.value);
						form.setValue("age",moment().diff(data.personalInfo.birthday, 'years'));
						//form.setValue("residenceAddress",data.personalInfo.residenceAddress);
					}
				});
			}
		},
        initComponent:function(params,widget){
		var subnav=new Subnav({
			parentNode:".J-subnav",
               model:{
            	    title:i18ns.get("sale_ship_owner","会员")+"活动报告",  
            	    items:[{
						id : "building",
						type : "buttongroup",
						tip : "楼宇",
						keyField : "pkBuilding",
						valueField : "name",
						showAll : true,
						showAllFirst : true,
						url : "api/building/query",
						params : function() {
							return {
								"useType" : "Apartment",
								fecthProperties : "pkBuilding,name"
							};
						},
						handler : function(key, element) {
							widget.get("grid").refresh();
							
						}
						
					},{
						tip : "活动时间",
						id : "time",
						type : "daterange",
						ranges:{
							"本月": [moment().subtract("month").startOf("month"),moment().subtract("month").endOf("month")],
							"上月": [moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")],
						},
						defaultTime:"本月",
						handler:function(key,element){
							widget.get("subnav").load("act",{
								url:"api/activity/query",
								params:function(){
								  return {
										fetchProperties:"pkActivity,theme,activityStartTime,",
										"activityStartTime" : key.start,
										"activityStartTimeEnd" : key.end,
									    type:widget.get("params") ? widget.get("params").activityreportType : "",
								    	}
								},
								callback:function(data){
									widget.get("grid").refresh();
								}
								
							});
						},						
					},{
    					id:"act",
						tip:"活动主题",
						type:"buttongroup",
						keyField :"pkActivity",
						valueField :"name",
					    format:function(data){
							if(data){
								return moment(data.activityStartTime).format("YYYY-MM-DD")+" "+data.theme								
							}else{
								return "";
							}
						},
						handler:function(key,element){
							widget.get("grid").refresh();
						}
						
					},{
						id : "adds",
						text : "新增",
						type : "button",
						show : true,
						handler : function() {
							var subnav = widget.get("subnav");
							var form = widget.get("form");						
							widget.show([ ".J-form" ]).hide([ ".J-grid" ]);
							subnav.hide([ "adds", "time","building","act" ]).show([ "return" ]);
							form.reset();
							form.load("create",{
								params:{
									fetchProperties:"pkUser,name"
								},
								callback:function(data){
									//当前用户是管理员时，让recordPerson可用
									var userSelect=form.getData("create","");
									var flag = false;
									for(var  i =  0 ; i<userSelect.length;i++ ){
										if(userSelect[i].pkUser == activeUser.pkUser){
											flag= true;
											break;
										}
									}
									if(flag){
										form.setValue("create",activeUser.pkUser);
									}
									var createData=form.getData("create","");
									createData.push(activeUser);
									form.setData({"create":createData,
										"recordDate":moment()});
									form.setValue("create",activeUser);
								}
							});
							return false;
						}
					},{
						id : "return",
						text : "返回",
						type : "button",
						show : false,
						handler : function() {
							var subnav = widget.get("subnav");
							widget.hide([ ".J-form" ]).show([ ".J-grid" ]);
							subnav.hide([ "return" ]).show(["adds","time","act","building" ]);
						}
					}           	           
            	           ],
               	 }
			});
			this.set("subnav",subnav);
    			
            var grid=new Grid({
        		parentNode:".J-grid",
        		autoRender:false,
        		url : "api/activityreport/query",
        		params:function(){
        			return{
		        		"member.memberSigning.room.building.pkBuilding" : widget.get("subnav").getValue("building"), 
		        		"activity.pkActivity":subnav.getValue("act"),
		        		type:widget.get("params") ? widget.get("params").activityreportType+"member" : "",
		        		fetchProperties:"*,create.pkUser,create.name," +
		        				"activity.pkActivity," +
		        				"activity.theme," +
		        				"member.personalInfo.pkPersonalInfo," +
		        				"member.personalInfo.name," +
		        				"member.personalInfo.sex," +
		        				"member.personalInfo.birthday," +
		        				"member.personalInfo.residenceAddress," +
		        				"member.memberSigning.room.number," +
		        				"member.memberSigning.room.building," +
		        				"member.memberSigning.room.building.name,",
        				};
        			},
        		model:{
                    columns:[{
                        key:"member.personalInfo.name",
                        name:i18ns.get("sale_ship_owner","会员"),
                        className:"oneColumn",
                        format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("form").reset();
								//widget.get("profile").loadPicture("api/attachment/activityreportphoto/"+data.pkActivityReport);
								//$(".J-img").attr("src",data.pkActivityReport);
//								data.member={
//    									member:data.member
//								};
								widget.get("form").setData(data);
								widget.get("form").setValue("member",data.member.pkMember);
								widget.get("form").setValue("sex",data.member.personalInfo.sex.value);
								widget.get("form").setValue("age",moment().diff(data.member.personalInfo.birthday, 'years'));
								//widget.get("form").setValue("residenceAddress",data.member.personalInfo.residenceAddress);
//								widget.get("grid").refresh({
//									activity:subnav.getValue("act"),
//            						type:widget.get("params") ? widget.get("params").activityreportType+"member" : "",
//								});
								widget.get("form").setDisabled(true);
								var subnav = widget.get("subnav");	
								widget.show([ ".J-form" ]).hide([ ".J-grid" ]);
								subnav.hide([ "adds", "time","building","act" ]).show([ "return" ]);
							} 
						}]
                    },{
                    	key:"member.memberSigning.room.number",
                        name:"房间号",
                        className:"oneColumn"
                    },{
                    	key:"date",
                        name:"记录时间",
                        format:"date",
                        className:"oneHalfColumn"
                    },{
						key:"description",
						name:"描述",
						className:"threeColumn"
					},{
						key:"create.name",
						name:"记录人",
						className:"threeColumn"
					},{
						key:"operate",
						name:"操作",
						className:"oneColumn",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("form").reset();
//								widget.get("profile").loadPicture("api/attachment/activityreportphoto/"+data.pkActivityReport);
//								$(".J-img").attr("src",data.pkActivityReport);
//								data.member={
//									member:data.member
//								};
								widget.get("form").setData(data);
								widget.get("form").load("member",{
									params:{
										type:params ? params.activityreportType : "",
										activity:data.activity.pkActivity,
										fetchProperties:"member.pkMember," +
												"member.personalInfo.name," +
												"member.personalInfo.sex," +
												"member.personalInfo.birthday," +
												"member.personalInfo.residenceAddress"
									},
									callback:function(){
										var member=widget.get("form").getData("member","");
				    					widget.get("form").setData("member",member);
				    					widget.get("form").setValue("member",data.member.pkMember);
										//widget.get("form").setData("member",data);
									}
								});
								
								widget.get("form").setValue("sex",data.member.personalInfo.sex.value);
								widget.get("form").setValue("age",moment().diff(data.member.personalInfo.birthday, 'years'));
								//widget.get("form").setValue("residenceAddress",data.member.personalInfo.residenceAddress);
//								widget.get("grid").refresh({
//									activity:subnav.getValue("act"),
//            						type:widget.get("params") ? widget.get("params").activityreportType+"member" : "",
//								});
								var subnav = widget.get("subnav");								
								widget.show([ ".J-form" ]).hide([ ".J-grid" ]);
								subnav.hide([ "adds", "time","building","act" ]).show([ "return" ]);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/activityreport/" + data.pkActivityReport + "/delete",function(){
									widget.get("grid").refresh();
								});
							}
						}]
					}]
				}
            });
            this.set("grid",grid);
            
            var form = new Form({
            	parentNode:".J-form",
                saveaction : function() {
         			var form = widget.get("form");
         			var data = form.getData();
         			var datas = {pkActivityReport:data.pkActivityReport,
         					member:data.member,date:data.date,activity:data.activity,
         					description:data.description,type:data.type,
         					create:data.create,version:data.version};
         			aw.saveOrUpdate("api/activityreport/save",datas,function(data){
         				widget.get("grid").refresh();
         				var subnav = widget.get("subnav");
						widget.hide([ ".J-form" ]).show([ ".J-grid" ]);
						subnav.hide([ "return" ]).show(["adds","time","act","building" ]);
						return false;
     				});
     			  },
 			  cancelaction:function(){
 				    var subnav = widget.get("subnav");
					widget.hide([ ".J-form" ]).show([ ".J-grid" ]);
					subnav.hide([ "return" ]).show(["adds","time","act","building" ]);
 					return false;
 			  },
            	model:{
            		id:"memberactivityreport",
            		items:[{
            			name:"pkActivityReport",
						type:"hidden"
            		},{
            			name:"version",
						defaultValue:"0",
						type:"hidden"
            		},{
            			name:"type",
						defaultValue:widget.get("params").activityreportType+"member",
						type:"hidden"
            		},{
            			name:"activity",
						label:"活动名称",
						url:"api/activity/query",
						key:"pkActivity",
						value:"theme",
						params:{
							type:widget.get("params") ? widget.get("params").activityreportType : "",
							fetchProperties:"pkActivity,theme"
						},
						type:"select",
						validate:["required"]
            		},{
            			name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/activitysignup/query",
						key:"member.pkMember",
						value:"member.personalInfo.name",
						params:{
							type:widget.get("params") ? widget.get("params").activityreportType : "",
							activity:subnav.getValue("act"),
							fetchProperties:"member.pkMember," +
									"member.personalInfo.name," +
									"member.personalInfo.sex," +
									"member.personalInfo.birthday," +
									"member.personalInfo.residenceAddress"
						},
						type:"select",
						validate:["required"]
            		},{
            			name:"sex",
						label:"性别",
						readonly:true	
            		},{
            			name:"age",
						label:"年龄",
						readonly:true
            		},{
            			name:"date",
						label:"记录时间",
						type:"date",
						defaultValue:moment().valueOf(),
						validate:["required"]
            		},{
            			name:"create",
						label:"记录人",
					    url:"api/users",
						key:"pkUser",
						value:"name",
						params:function(){
							return{
								fetchProperties:"pkUser,name"
								  }
								},
						type:"select",
						validate:["required"]
            		},{
            			name:"description",
                        label:"描述",
                        type:"richtexteditor",
                        options:{
            				initialFrameHeight:"500",//设置富文本高度
            				toolbars: [[
    				            'fullscreen', 'source', '|', 'undo', 'redo', '|',
    				            'bold', 'italic', 'underline', 'strikethrough', 'removeformat', 'blockquote', 'pasteplain', '|', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'cleardoc', '|',
    				            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
    				            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
    				            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
    				            'simpleupload','insertimage', 'emotion', 'inserttable', 'horizontal', 'spechars','|','preview', 'print'
    				        ]]
            			},
                        validate:["required"]
            		}]
            	}
            });
       	 	this.set("form",form);
        },
		afterInitComponent:function(params,widget){
			var subnav=widget.get("subnav");
			var grid=widget.get("grid");
			if(params!=null){
				subnav.load("act",{
					//id:"act",
					url:"api/activity/query",
					params:function(){  				
				             return{"activityStartTime" : subnav.getValue("time").start,
									"activityStartTimeEnd" : subnav.getValue("time").end,
									fetchProperties:"pkActivity,theme,activityStartTime,",
									type:widget.get("params") ? widget.get("params").activityreportType : "",
									 }
					},
					callback:function(data){
						// 参加活动确认跳转到会员活动报告时需要对活动下拉框进行处理
						var params = widget.get("params");
						if (params.activity){						
							subnav.setValue("act", params.activity);
						}
						// 刷新表格
						grid.refresh();
//						widget.get("form").load("member",{
//							params:{
//								type:widget.get("params") ? widget.get("params").activityreportType : "",
//								activity:subnav.getValue("act"),
//								fetchProperties:"member.pkMember,member.personalInfo.name"
//							}
//						});
					}
				});
			}
		}
    });
    module.exports = MemberActivityReport;
});

