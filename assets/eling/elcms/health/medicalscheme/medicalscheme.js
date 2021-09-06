/**
 * 体检方案
 * */
define(function(require, exports, module) {
    var ELView=require("elview");
    var aw = require("ajaxwrapper");
    var template="<div class='el-ward-emergencyrescue'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-grid'></div>"+
	"<div class='J-verform hidden'></div>"+
	"<div class='J-detailGrid hidden'></div>"+
	"<div class='J-detailForm hidden'></div> "+
	"</div>";
    var Form=require("form-2.0.0")
    var Subnav = require("subnav-1.0.0");
    var Grid = require("grid-1.0.0");
    var Json=require("json");
    var Dialog = require("dialog-1.0.0");
    var store = require("store");
	var activeUser = store.get("user");
    
    var medicalscheme = ELView.extend({
        attrs:{
        	template:template
        },
    	loadSelect:function(form,name){
    		var selectName="isInit"+name;
    		if(!this.get(selectName)){
				this.get(form).load(name);
				this.set(selectName,true);
			}
		},
    	events:{
			"change .J-form-sos-select-member":function(e){
				
			},
		},
        initComponent:function(params,widget){
        	//初始化subnav
            var subnav=new Subnav({
            	parentNode:".J-subnav",
                model:{
                   title:"体检方案",
                   search:function(str) {
	            	   widget.get("grid").loading();
						aw.ajax({
							url:"api/physicalexaminationscheme/search",
							data:{
								s:str,
								properties:"description,creator.name,name,status",
		    					fetchProperties:"name,pkPhysicalExaminationScheme,version,description,createDate,creator.name,status,creator.pkUser",
							},
							dataType:"json",
							success:function(data){
								widget.get("grid").setData(data);
								widget.show(".J-grid,.J-adds").hide(".J-verform,.J-return");
							}
						});
					},
                   buttons:[{
   					id:"adds",
						text:"新增",
						show:true,
						handler:function(){
							widget.get("verform").reset();
							widget.get("verform").setAttribute("createDate","disabled","disabled");
							widget.get("verform").setAttribute("creator","readonly","readonly");
							widget.get("detailGrid").setData([]);	
							widget.get("verform").load("creator",{
								callback:function(){
									var userSelect  = widget.get("verform").getData("creator","");
									var flag = false ;
									for(var i=0;i<userSelect.length;i++){
										if(userSelect[i].pkUser==activeUser.pkUser){
											flag=true;
											break;
										}
									}
									if(flag){
										widget.get("verform").setValue("creator",activeUser);
									}else{
										var userSelect=widget.get("verform").getData("creator","");
										userSelect.push(activeUser);
										widget.get("verform").setData("creator",userSelect);
										widget.get("verform").setValue("creator",activeUser);
									}
								}
							});
							widget.get("subnav").show(["return","add"]).hide(["adds","status","search"]);
							widget.show([".J-verform",".J-detailGrid"]).hide([".J-grid"]);
						}
   					},{
   						id:"add",
   						text:"保存",
   						show:false,
						handler:function(){
							var carddata=widget.get("detailGrid").getData();
							var griddata ={};
							griddata=carddata;
							if(carddata.length<1){
								Dialog.alert({
        							content : "方案定义明细不能为空!"
        						 });
								return false;
							}
							var verformData=widget.get("verform").getData();
							for(var i=0;i<griddata.length;i++){
								if(isNaN(griddata[i].physicalExaminationItemType)){
									griddata[i].physicalExaminationItemType=griddata[i].physicalExaminationItemType.pkPhysicalExaminationItemType;
								}
								if(isNaN(griddata[i].healthExamDataType)){
									griddata[i].healthExamDataType=griddata[i].healthExamDataType.pkHealthExamDataType;
								}
								if(griddata[i].physicalExaminationScheme&&griddata[i].physicalExaminationScheme.status.key){
									griddata[i].physicalExaminationScheme.status=griddata[i].physicalExaminationScheme.status.key;
								}
							}
							verformData.listsParams=griddata;
							aw.saveOrUpdate("api/physicalexaminationscheme/add",aw.customParam(verformData),function(data){
								widget.get("grid").refresh();
								widget.get("subnav").hide(["return","add"]).show(["adds","status","search"]);
								widget.hide([".J-verform",".J-detailGrid",".J-detailForm"]).show([".J-grid"]);
							},widget.get("grid").refresh());
						}
   					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.get("subnav").hide(["return","add"]).show(["adds","status","search"]);
							widget.hide([".J-verform",".J-detailGrid",".J-detailForm"]).show([".J-grid"]);
							return false;
						}
					}],
				   buttonGroup:[{
    					id:"status",
    					tip:"状态",
    					showAll:true,
    					showAllFirst:true,
                        items:[{
    						key:"Using",
    						value:"正常"
    					},{
    						key:"Closed",
    						value:"关闭"
    					},{
    						key:"Default",
    						value:"默认"
    					}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}],
                }
            });
            this.set("subnav",subnav);
            
            var grid=new Grid({
            	parentNode:".J-grid",
				url:"api/physicalexaminationscheme/query",
				autoRender:false,
				params:function(){
					return {
						status:widget.get("subnav").getValue("status"),
    					fetchProperties:
    						"physicalExaminationSchemeDetail.pkPhysicalExaminationSchemeDetail," +
    						"physicalExaminationSchemeDetail.orderNo,"+
    						"physicalExaminationSchemeDetail.version,"+
    						"physicalExaminationSchemeDetail.healthExamDataType.*,"+
    						"physicalExaminationSchemeDetail.physicalExaminationItemType.*,"+
//    							"physicalExaminationSchemeDetail.physicalExaminationItemType.*," +
//    							"physicalExaminationSchemeDetail.healthExamDataType.*," +
//    							"physicalExaminationSchemeDetail.version," +
//    							"physicalExaminationSchemeDetail.orderNo," +
//    							"physicalExaminationSchemeDetail.pkPhysicalExaminationSchemeDetail," +
    							"pkPhysicalExaminationScheme," +
    							"name,version,description,createDate,creator.name,status,creator.pkUser",
					};
				},
				model:{					
					columns:[{
 						key:"name",
 						name:"方案名称"
 					},{
 						key:"creator.name",
 						name:"创建人",
 					},{
 						key:"createDate",
						name:"创建日期",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
 					},{
 						key:"status.value",
 						name:"状态"
 					},{
 						key:"description",
 						name:"描述"
 					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								aw.ajax({
									url : "api/physicalexaminationscheme/isExist",
									type : "POST",
									data : {
										"pkPhysicalExaminationScheme":data.pkPhysicalExaminationScheme,
									},
									success : function(data){
										if(data>0){//隐藏增加删除按钮
											$(".J-delete,.J-grid-head-add").addClass("hidden");
										}else{
											$(".J-delete,.J-grid-head-add").removeClass("hidden");
										}
									}	
								});
								var form=widget.get("verform");
								widget.get("subnav").show(["return","add"]).hide(["adds","status","search"]);
								widget.show([".J-verform",".J-detailGrid"]).hide([".J-grid"]);
//								aw.ajax({
//									url : "api/physicalexaminationschemedetail/query",
//									type : "POST",
//									data : {
//										"physicalExaminationScheme.pkPhysicalExaminationScheme":data.pkPhysicalExaminationScheme,
//										fetchProperties:"*,physicalExaminationScheme.pkPhysicalExaminationScheme,physicalExaminationScheme.version,physicalExaminationScheme.status,physicalExaminationItemType.*,healthExamDataType.*"
//									},
//									success : function(data){
										widget.get("detailGrid").setData(data.physicalExaminationSchemeDetail);
										
//									}	
//								});
								form.reset();		
								form.setAttribute("createDate","disabled","disabled");
								form.setAttribute("creator","readonly","readonly");
								form.setData(data);
								widget.get("verform").load("creator",{
									callback:function(){
										var userSelect  = widget.get("verform").getData("creator","");
										var flag = false ;
										for(var i=0;i<userSelect.length;i++){
											if(userSelect[i].pkUser==activeUser.pkUser){
												flag=true;
												break;
											}
										}
										if(flag){
											widget.get("verform").setValue("creator",data.creator);
										}else{
											var userSelect=widget.get("verform").getData("creator","");
											userSelect.push(data.creator);
											widget.get("verform").setData("creator",userSelect);
											widget.get("verform").setValue("creator",data.creator);
										}
									}
								});
								widget.get("detailForm").load("physicalExaminationItemType");
								widget.get("detailForm").load("healthExamDataType");
								widget.show(".J-verform,.J-return,.J-detailGrid").hide(".J-grid,.J-adds");
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var verform = new Form({//主表form
				
            	parentNode:".J-verform",
				model:{
					id:"PhysicalExaminationScheme",
					defaultButton:false,
					items:[{
						name:"pkPhysicalExaminationScheme",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"方案名称",
						type:"text",
						className:{
							container:"col-md-6",
						},
						validate:["required"]
					},{
						name:"createDate",
						label:"创建日期",
						type:"date",
						mode:"Y-m-d",
						defaultValue:moment(),
						validate:["required"],
						className:{
							container:"col-md-6"
						}
					},{
						name:"creator",
						label:"创建人",
						type:"select",
						key:"pkUser",
						value:"name",
						lazy:true,
						defaultValue:activeUser,
						url:"api/users",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name"
						},
						validate:["required"],
						className:{
							container:"col-md-6"
						}
					},{
						name:"status",
						label:"状态",
						type:"select",
						url:"api/enum/com.eling.elcms.health.model.PhysicalExaminationScheme.Status",
						validate:["required"],
						defaultValue:"Default",
						className:{
							container:"col-md-6"
						}
					},{
						name:"description",
						label:"描述",
						type:"textarea",
						className:{
							container:"col-md-6",
						},
						validate:["required"]
					}]
				}
             });
    		 this.set("verform",verform);
			
            var detailGrid=new Grid({//子表grid
            	parentNode:".J-detailGrid",
				autoRender:false,
				model:{	
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								widget.get("detailForm").reset();
								widget.get("detailForm").load("physicalExaminationItemType");
								widget.get("detailForm").load("healthExamDataType");
								widget.show(".J-detailForm").hide(".J-detailGrid");
							}
						}]
					},
					columns:[{
 						key:"physicalExaminationItemType.name",
 						name:"体检项目类别",
 					},{
 						key:"orderNo",
 						name:"序号",
 						type:"hidden"
 					},{
 						key:"healthExamDataType.name",
 						name:"健康数据类型" 						
 					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								var carddata=widget.get("detailGrid").getData();
								carddata.splice(index,1);
								widget.get("detailGrid").setData(carddata);
//								widget.delRow(index);
							}
						}]
					}]
				}
			});
			this.set("detailGrid",detailGrid);
			
			var detailForm = new Form({//子表form
            	parentNode:".J-detailForm",
            	saveaction:function(){
            		var data=widget.get("detailForm").getData();
            		if(isNaN(data.orderNo)){
         				Dialog.alert({
   							content : "请输入有效序号!"
   						 });
         				return false;
         			}
            		var physicalExaminationItemType=widget.get("detailForm").getData("physicalExaminationItemType",{
            			pk:widget.get("detailForm").getValue("physicalExaminationItemType")
            		});
            		if(widget.get("detailForm").getValue("physicalExaminationItemType")==""){
            			data.physicalExaminationItemType=""
            		}else{
            			data.physicalExaminationItemType=physicalExaminationItemType;
            		}
            		var healthExamDataType=widget.get("detailForm").getData("healthExamDataType",{
            			pk:widget.get("detailForm").getValue("healthExamDataType")
            		});
            		if(widget.get("detailForm").getValue("healthExamDataType")==""){
            			data.healthExamDataType=""
            		}else{
            			data.healthExamDataType=healthExamDataType;
            		}
            		var carddata=widget.get("detailGrid").getData();
					carddata.push(data);
					widget.get("detailGrid").setData(carddata);
					widget.show(".J-detailGrid").hide(".J-detailForm");
            	},
 				//取消按钮
  				cancelaction:function(){
  					widget.show(".J-detailGrid").hide(".J-detailForm");
  				},
				model:{
					id:"physicalExaminationSchemeDetail",
					saveText:"确定",
					items:[{
						name:"pkPhysicalExaminationSchemeDetail",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"physicalExaminationItemType",
						label:"体检项目类别",
						type : "select",
						lazy:true,
						key	: "pkPhysicalExaminationItemType",
						url:"api/physicalexaminationitemtype/query",
						params:{
							"status":"Using",
							fetchProperties:"pkPhysicalExaminationItemType,name",
						},
						value:"name",
						validate : [ "required" ]
					},{
						name:"orderNo",
						label:"序号",
						validate : [ "required" ]
					},{
						name:"healthExamDataType",
						label:"体检项目",
						type : "select",
						lazy:true,
						key	: "pkHealthExamDataType",
						url:"api/healthexamdatatype/query",
						params:{
//							type:"medical",
							fetchProperties:"pkHealthExamDataType,name,name1,name2,name3,name4,name5,name6",
						},
						value:"name",
						validate : [ "required" ]
					}]
				}
             });
    		 this.set("detailForm",detailForm);
        },
        afterInitComponent:function(params,widget){        
        	if (params && params.pkFather) {
				
			}else {
				widget.get("grid").refresh();
			}
        }
    });
    module.exports = medicalscheme;
});