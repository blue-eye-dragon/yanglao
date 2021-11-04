define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var store = require("store");
	var Dialog=require("dialog-1.0.0");
	require("./repairend.css");
	var Form = require("form-2.0.0")
	var template="<div class='el-repairend'><div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+
		"<div class='J-form hidden'></div>"+
		 "<div class='J-gridDetail hidden' ></div></div>";
	var buildings=store.get("user").buildings || [];
    var repairend = ELView.extend({
        attrs:{
        	template:template
        },
		initComponent:function(params,widget){
            var subnav=new Subnav({
            	parentNode:".J-subnav",
                   model:{
                	  title:"维修完成",
                	  search:function(str) {
                    	   widget.get("grid").loading();
           					aw.ajax({
           						url:"api/repair/search",
           						data:{
									s:str,
									properties:"repairNo,place.name,content",  
									fetchProperties:"*,place.name," +
									"repairClassify.name," +
									"repairClassify.description," +
									"assetCard.code," +
									"repairDetails.operateType," +
									"repairDetails.createDate," +
									"repairDetails.expectedDate," +
									"repairDetails.startDate," +
									"repairDetails.finishDate," +
									"repairDetails.user," +
									"repairDetails.user.name," +
									"repairDetails.maintainer.name," +
									"repairDetails.maintainer.pkMaintainer," +
									"repairDetails.maintainer.phone," +
									"repairDetails.maintainer.supplier.name," +
									"repairDetails.description",
								},
           						dataType:"json",
           						success:function(data){
           							widget.get("grid").setData(data);
           						}
           					});
           				  },
                	  buttons:[{
                		  id:"return",
                		  text:"返回",
                		  show:false,
                		  handler:function(){
                			  widget.show([".J-grid",".J-time",".J-flowStatus",".J-buildings",".J-search"]).hide([".J-form",".J-gridDetail",".J-return"]);
                		  }
                	  }],
                	  buttonGroup:[{
      					id:"buildings",
      					key:"pkBuilding",
      					value:"name",
      					items:buildings,
      					showAll:true,
      					showAllFirst:true,
    					handler:function(key,element){
    						widget.get("grid").refresh();
    					}
    				},{
   						id:"flowStatus",
   						tip:"状态",
   						items:[{
   		                    key:"Unrepaired",
   		                    value:"未完成"
   						},{
   							key:"Unconfirmed",
   							value:"已完成"
   						}],
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
   					}],
        			time:{
        				tip:"报修时间",
        				click:function(time){
        					widget.get("grid").refresh();
						}
			     },
			
               }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
				url:"api/repair/query",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						"createDate":subnav.getValue("time").start,
						"createDateEnd":subnav.getValue("time").end,
						"operateType":"RepairClaiming",
						flowStatus:subnav.getValue("flowStatus"),
						"place.building":subnav.getValue("buildings"),
						fetchProperties:"*,place.name," +
						"repairClassify.name," +
						"repairClassify.description," +
						"assetCard.code," +
						"repairDetails.operateType," +
						"repairDetails.createDate," +
						"repairDetails.expectedDate," +
						"repairDetails.startDate," +
						"repairDetails.finishDate," +
						"repairDetails.user," +
						"repairDetails.user.name,repairDetails.expectedDate," +
						"repairDetails.maintainer.name," +
						"repairDetails.maintainer.pkMaintainer," +
						"repairDetails.maintainer.phone," +
						"repairDetails.maintainer.supplier.name," +
						"repairDetails.description",
					};
				},
				autoRender:false,
				model:{
					columns:[{
						key:"repairNo",
						name:"报修单号",
						className:"repairNo",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("gridDetail").refresh({
									"repair.pkRepair":data.pkRepair,
									fetchProperties:"*,user.name,maintainer.name"
								});
								data.repairClassifyRemark=data.repairClassify.description;
								widget.get("form").reset();
								widget.get("form").setData(data);
								form.setValue("placeName",data.place.name);
        						form.setValue("repairClassifyName",data.repairClassify.name);
        						var name="";
        						var startDate="";
        						var finishDate="";
        						var description = "";
    							for(var i=0;i<data.repairDetails.length;i++){
    								if(data.repairDetails[i].operateType.key == "Dispatch"){
    									name = data.repairDetails[i].maintainer.name;
    									break;
    								}
    								if(data.repairDetails[i].operateType.key == "Finished"){
    									startDate=data.repairDetails[i].startDate;
    									finishDate=data.repairDetails[i].finishDate;
    									description = data.repairDetails[i].description;
    								}
    								
    							}
    							var time="";
    							for(var i=0;i<data.repairDetails.length;i++){
    								if(data.repairDetails[i].operateType.key == "Dispatch"){
    									time = data.repairDetails[i].expectedDate;
    									break;
    								}
    								
    							}
        						form.setValue("maintainerName",name);
        						form.setValue("startDate",startDate);
            					form.setValue("finishDate",finishDate);
            					if(description != null && description !=""){
            						form.setValue("description",data.description);
            					}else{
            						form.setValue("description","维修已完成");
            					}
        						form.setValue("ifSignificantT",data.ifSignificant==true?"是":"否");
        						form.setValue("expectedDateName",moment(time).format("YYYY-MM-DD"));
        						
								widget.get("form").setDisabled(true);
								widget.show([".J-gridDetail",".J-return",".J-form"]).hide([".J-toexcel",".J-adds",".J-grid",".J-flowStatus",".J-time",".J-search",".J-buildings"]);
							}
						}]
					},{
						key:"place.name",
						className:"place",
						name:"位置"
					},{
						key:"repairClassify.name",
						className:"repairClassify",
						name:"分类"
					},{
						key:"content",
						className:"content",
						name:"内容"
					},{
						key:"repairDetails",
						className:"repairperson",
						name:"报修人",
						format:function(value,row){
							var name="";
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "RepairClaiming"){
									name = value[i].user.name;
									break;
								}
							}
							return name;
	 					},
					},{
						key:"repairDetails",
						className:"repairtime",
						name:"报修时间",
						format:function(value,row){
							var time="";
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "RepairClaiming"){
									time = moment(value[i].createDate).format("YYYY-MM-DD");
									break;
								}
							}
							return time;
	 					},
					},{
						key:"ifSignificant",
						className:"ifSignificant",
						name:"维修",
						format:function(value,row){
							return value ? "是" : "否";
						}
					},{
						key:"repairDetails",
						className:"maintainer",
						name:"维修工",
						format:function(value,row){
							var name="";
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "Dispatch"){
									name = value[i].maintainer.name;
									break;
								}
							}
							return name;
	 					},
					},{
						key:"repairFrom.value",
						name:"报修来源",
						className:"repairsource"
					},{
                        key:"flowStatus",
                        className:"operate",
                        name : "操作",
                        format:function(value,row){
                           if(value.key=="Unrepaired"){
                        	   return "button";
                           }else{
                        	   return "";
                           }
                        },
                        formatparams:[{
                        	key:"reset",
                        	text:"完成",
                        	handler:function(index,data,rowEL){
        						widget.get("gridDetail").refresh({
    								"repair.pkRepair":data.pkRepair,
    								fetchProperties:"*,user.name,maintainer.name"
    							});
        						var form = widget.get("form");
        						form.setDisabled(false);
        						form.reset();
        						form.setData(data);
        						form.setValue("placeName",data.place.name);
        						form.setValue("repairClassifyName",data.repairClassify.name);
        						var name="";
    							for(var i=0;i<data.repairDetails.length;i++){
    								if(data.repairDetails[i].operateType.key == "Dispatch"){
    									name = data.repairDetails[i].maintainer.name;
    									break;
    								}
    							}
    							var time="";
    							for(var i=0;i<data.repairDetails.length;i++){
    								if(data.repairDetails[i].operateType.key == "Dispatch"){
    									time = data.repairDetails[i].expectedDate;
    									break;
    								}
    							}
        						form.setValue("maintainerName",name);
        						form.setValue("description","维修已完成");
        						form.setValue("ifSignificantT",data.ifSignificant==true?"是":"否");
        						
        						form.setValue("expectedDateName",moment(time).format("YYYY-MM-DD"));
        						widget.hide([".J-grid"]).show([".J-form",".J-gridDetail"]);
								widget.get("subnav").hide(["search","buildings","flowStatus","time"]);
                        	}
                        }]	
                    }]
				}
            });
            this.set("grid",grid);
            
            var form = new Form({
            	parentNode:".J-form",
            	saveaction:function(){
            		var startDate = widget.get("form").getValue("startDate");
            		var finishDate = widget.get("form").getValue("finishDate");
					if(startDate>finishDate){
						Dialog.tip({ 
							title:"实际开始日期不能小于实际结束日期"
						});
					}else{
						aw.saveOrUpdate("api/repair/confirmend",$("#repair1").serialize(),function(data){
							widget.get("grid").refresh();
							widget.hide([".J-form",".J-gridDetail"]).show([".J-grid"]);
							widget.get("subnav").hide(["return"]).show(["search","time","buildings","flowStatus"]);
						});
					}
				},
				cancelaction:function(){
					widget.hide([".J-form",".J-gridDetail"]).show([".J-grid"]);
					widget.get("subnav").hide(["return"]).show(["search","time","buildings","flowStatus"]);
				},
				model:{
					id:"repair1",
					items:[{
						name:"pkRepair",
						type:"hidden"
					},{
						name:"placeName",
						label:"位置",
						readonly: true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
					},{
						name:"repairClassifyName", 
						label:"分类",
						readonly: true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"assetCard.code", 
						label:"资产卡片",
						readonly: true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"ifSignificantT",
						label:"维修",
						readonly: true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"maintainerName",
						label:"维修工",
						readonly: true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
					},{
						name:"expectedDateName",
						label:"预计维修日期",
						readonly: true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
					},{
						name:"startDate",
						label:"实际开始日期",
						type:"date",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
						
					},{
						name:"finishDate",
						label:"实际结束日期",
						type:"date",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
						validate:["required"]
					},{
						name:"content",
						label:"内容",
						type:"textarea",
						readonly: true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
					},{
						name:"description",
						label:"说明",
						type:"textarea",
						defaultValue:"维修已完成",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					}]
				}
			});
            this.set("form",form);
            
            var gridDetail=new Grid({
    			parentNode:".J-gridDetail",
    			autoRender : false,
    			url:"api/repairdetail/query",
    			model:{
    				columns:[{
    					key:"createDate",
    					name:"操作时间",
    					className:"col-md-2",
    					format:"date",
    					formatparams:{
    						mode:"YYYY-MM-DD HH:mm:ss"
    					}
    				},{
    					key:"user.name",
    					className:"col-md-1",
    					name:"经手人"
    				},{
    					key:"operateType.value",
    					className:"col-md-1",
    					name:"操作类型"
    				},{
    					key:"maintainer.name",
    					className:"col-md-1",
    					name:"维修工"
    				},{
    					key:"expectedDate",
    					name:"预计维修日期",
    					className:"col-md-1",
    					format:"date"
    				},{
    					key:"startDate",
    					name:"实际开始日期",
    					className:"col-md-1",
    					format:"date"
    				},{
    					key:"finishDate",
    					name:"实际结束日期",
    					className:"col-md-1",
    					format:"date"
    				},{
    					key:"description",
    					className:"col-md-4",
    					name:"说明"
    				}]
    			},
    		})
    		this.set("gridDetail",gridDetail);
        },
    	afterInitComponent:function(params,widget){        
	        if (params && params.pkFather) {
	       	 widget.get("grid").refresh({
					pkRepair:params.pkFather,
					fetchProperties:"*,place.name," +
					"repairClassify.name," +
					"repairClassify.description," +
					"assetCard.code," +
					"repairDetails.operateType," +
					"repairDetails.createDate," +
					"repairDetails.expectedDate," +
					"repairDetails.user," +
					"repairDetails.user.name," +
					"repairDetails.maintainer.name," +
					"repairDetails.maintainer.pkMaintainer," +
					"repairDetails.maintainer.phone," +
					"repairDetails.maintainer.supplier.name," +
					"repairDetails.description",
			 });
			} else {
				widget.get("grid").refresh();
			}
	     }
    });
    module.exports = repairend;	
});
