/*
 * 新建订单
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid");
	var Form =require("form");
	var aw = require("ajaxwrapper");
	var enmu = require("enums");
	var Dialog = require("dialog-1.0.0");
	var  building ;
	var  selectmember = [];
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"; 
	
	var memberrelational = ELView.extend({ 
		attrs:{
        	template:template
        },
        initComponent:function(params,widget){
        	
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
				model : {
					title:  i18ns.get("sale_ship_owner","会员")+"关系",
//					search : function(str) {
//						var g = widget.get("grid");
//						aw.ajax({
//							url:"api/memberrelational/search",
//							data:{
//								s:str,
//								"member":widget.get("subnav").getValue("defaultMembers"),
//								searchProperties:"relationalType.name,relationalMember.personalInfo.name,relationalMember.memberSigning.room.number,description",
//								fetchProperties:"pkMemberRelational," +
//									"relationalType.pkRelationalType," +
//									"relationalType.name," +
//									"relationalMember.pkMember," +
//									"relationalMember.personalInfo.name," +
//									"relationalMember.memberSigning.room.number," +
//									"description," +
//									"version"  
//							},
//							dataType:"json",
//							success:function(data){
//								g.setData(data);
//							}
//						});
//					},
					buttonGroup:[{
						id : "building",
						handler : function(key, element) {
							if($(".J-form").hasClass("hidden")){
								building = key
								widget.get("subnav").load({
									id : "defaultMembers",
									params : {
										"memberSigning.room.building" : key,
										"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
										"memberSigning.status":"Normal",
										"memberSigning.houseingNotIn" : false,
										fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number,status",
									},
									callback:function(data){
										widget.get("grid").refresh();
									}
									});
							}
							var form =widget.get("form");
							var pks = form.getValue("pks");
							for ( var i in pks) {
								selectmember.push(form.getPlugin("pks").getData(pks[i]));
							}
							widget.get("form").load("pks",{
								callback : function(data){
									if(selectmember.length>0){
										form.setValue("pks",selectmember);
									}
								}
							});
							
							
						}
					},{
						id : "defaultMembers",
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
							selectmember = [];
							widget.get("form").load("pks");
							var  subnav =widget.get("subnav"); 
							var  data =subnav.getData("defaultMembers",subnav.getValue("defaultMembers"));
							if(null==data){
								Dialog.alert({
									content : "该楼无"+i18ns.get("sale_ship_owner","会员"),
								});
							}else{
								subnav.setTitle(i18ns.get("sale_ship_owner","会员")+"关系("+data.memberSigning.room.number+"-"+data.personalInfo.name+")");
								widget.hide([".J-grid"]).show([".J-form"]);
								subnav.show(["return"]).hide(["add","defaultMembers"]);
							}
						}
					},{
    					id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.get("subnav").setTitle("会员关系");
							widget.hide([".J-form"]).show([".J-grid"]);
							widget.get("subnav").show(["add","defaultMembers"]).hide(["return"]);
							widget.get("subnav").setValue("building",building);
						}
    				}],
				}
        	});
        	this.set("subnav",subnav);
        	
        	var grid=new Grid({
        		parentNode:".J-grid",
        		model : {
        			url : "api/memberrelational/query",
        			autoRender:false,
            		params : function() {
            			var subnav = widget.get("subnav");
    					return {
    						"member":widget.get("subnav").getValue("defaultMembers"),
    						fetchProperties:"pkMemberRelational," +
    						"relationalType.pkRelationalType," +
    						"relationalType.name," +
    						"relationalMember.pkMember," +
    						"relationalMember.status," +
    						"relationalMember.personalInfo.name," +
    						"relationalMember.memberSigning.room.number," +
    						"description," +
    						"version"  
    					} 
            		},
        			columns : [{
						name:"relationalMember.memberSigning.room.number",
						label:"房间号",
					},{
						name:"relationalMember.personalInfo.name",
						label: i18ns.get("sale_ship_owner","会员")
					},{
						name:"relationalType.name",
						label:"关系"
					},{
						name:"relationalMember.status.value",
						label: i18ns.get("sale_ship_owner","会员")+"状态"
					},{
						name:"operate",
						label:"操作",
						format:"button",
						formatparams:[{
							id:"edit",
							icon:"icon-edit",
							handler:function(index,data,rowEle){
								Dialog.showComponent({
									title:"编辑",
									confirm:function(){
										if(widget.get("relationalForm").getValue("relationalType")){
											aw.saveOrUpdate("api/memberrelational/save",$("#relationalForm").serialize(),function(data){
												widget.get("grid").refresh();
											});
										}else{
											$(".J-form-relationalForm-select-relationalType").next().text("必输");
											return "NotClosed";
										}
									},
									setStyle:function(){
										$(".el-dialog .modal.fade.in").css({
											"top":"10%"
										});
									}
								},widget.getForm(data));
								
								
							}
						},{
							id:"delete",
							text:"删除",
							handler:function(index,data,rowEle){
								aw.del("api/memberrelational/" + data.pkMemberRelational + "/delete",function(){
		 	 						widget.get("grid").refresh(); 
		 	 					});
							}						
						}]
					}]
        		}
    		 });
    		 this.set("grid",grid);
        	
        	 var form=new Form({
         		 parentNode:".J-form",
	  			 model:{
					id:"memberrelationalform",
					saveaction : function() {
	         			var form = widget.get("form");
	         			var data = form.getData();
	         			data.member = widget.get("subnav").getValue("defaultMembers");
	         			aw.saveOrUpdate("api/memberrelational/add",aw.customParam(data),function(data){
	         				widget.get("subnav").setTitle("会员关系");
							widget.hide([".J-form"]).show([".J-grid"]);
							widget.get("subnav").show(["add","defaultMembers"]).hide(["return"]);
							widget.get("subnav").setValue("building",building);
							widget.get("grid").refresh();
							return false;
						});
					 },
					 cancelaction:function(){
						 widget.get("subnav").setTitle("会员关系");
						widget.hide([".J-form"]).show([".J-grid"]);
						widget.get("subnav").show(["add","defaultMembers"]).hide(["return"]);
						widget.get("subnav").setValue("building",building);
						return false;
		  			 },
					items:[{
					  name : "relationalType",
                      type : "select",
                      label : "关系",
                      keyField : "pkRelationalType",
                      valueField : "name",
                      url : "api/relationaltype/query",
                      params : function(){
                          return {
                        	  fetchProperties:"pkRelationalType,name"
                            };
                        },
                      validate:["required"]
					},{
					  name : "pks",
                      type : "select",
                      label : i18ns.get("sale_ship_owner","会员"),
                      multi : true,
                      keyField : "pkMember",
                      valueField : "personalInfo.name",
                      format:function(data){
                    	  return data.memberSigning.room.number+"-"+data.personalInfo.name;
                      },
                      url : "api/member/query",
                      params : function(){
                          return {
                        	  "memberSigning.room.building":widget.get("subnav").getValue("building"),
                        	  fetchProperties:"pkMember,memberSigning.room.number,personalInfo.name"
                            };
                        },
                      validate:["required"]
					},{
	                  name : "description",
	                  type : "textarea",
	                  label : "描述"
		            }]
				 }
        	 });
        	 this.set("form",form);
        },
        afterInitComponent:function(params,widget){
        	building=widget.get("subnav").getValue("building");
			var subnav=this.get("subnav");
				subnav.load({
					id:"defaultMembers",
					params:{
						"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"memberSigning.room.building":building,
						fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number,status"
					},
					callback:function(data){
						widget.get("grid").refresh(); 
						}
					}
				);
		},
        getForm:function(data){
			var relationalForm	=new Form({
				model:{
					id:"relationalForm",
					defaultButton:false,
					items:[{
						name:"pkMemberRelational",
						type:"hidden",
						defaultValue:data.pkMemberRelational,
					},{
						name:"version",
						type:"hidden",
						defaultValue:data.version,
					},{
						  name : "relationalType",
	                      type : "select",
	                      label : "关系",
	                      keyField : "pkRelationalType",
	                      valueField : "name",
	                      url : "api/relationaltype/query",
	                      params : function(){
	                          return {
	                        	  fetchProperties:"pkRelationalType,name"
	                            };
	                        },
						validate:["required"]
						}]
				}
			});
			this.set("relationalForm",relationalForm);
			return relationalForm;
		},
	})
	module.exports = memberrelational;
});