define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Dialog=require("dialog-1.0.0");
	var store = require("store");
	var Grid=require("grid-1.0.0");
	var Form = require("form-2.0.0")
	require("./repairconfirm.css");
	var template="<div class = 'el-repairconfirm' ><div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+
		"<div class='J-form hidden'></div>"+
		"<div class='J-formDetail hidden' ></div>" +
		 "<div class='J-gridDetail hidden' ></div></div>";
	var buildings=store.get("user").buildings || [];
	if(buildings.length!=0){
		buildings.push({
			pkBuilding:"",
			name:"全部"
		});
	}
    var repairconfirm = ELView.extend({
    	attrs:{
    		template:template
    	},
    	events : {
    		"click .J-mDetail":function(e){
    			var grid = this.get("grid");
    			var index = grid.getIndex(e.target);
    			var data = grid.getSelectedData(index);
				var workerName ;
				var workerPhone;
				var workerSupplier;
				for(var i=0;i<data.repairDetails.length;i++){
					if(data.repairDetails[i].operateType.key == "Dispatch"){
						workerName = data.repairDetails[i].maintainer.name;
						workerPhone = data.repairDetails[i].maintainer.phone;
						workerSupplier = data.repairDetails[i].maintainer.supplier.name;
						break;
					}
				}
				Dialog.showComponent({
					title:"维修工信息",
					setStyle:function(){
						$(".el-dialog .modal.fade.in").css({
							"top":"20%",
							"width": "50%",
							"left": "20%"
						});
					},
				},new Form({
					model:{
						id:"maintainerDetail",
						items:[{
							name:"maintainerNname",
							label:"姓名",
							readonly: true
						},{
							name:"maintainerPhone",
							label:"电话",
							readonly: true
						},{
							name:"maintainerSupplierName",
							label:"公司",
							readonly: true
						}],
						defaultButton:false
					}
				}));
				$("#maintainerDetail .J-form-maintainerDetail-text-maintainerNname").val(workerName);
				$("#maintainerDetail .J-form-maintainerDetail-text-maintainerPhone").val(workerPhone);
				$("#maintainerDetail .J-form-maintainerDetail-text-maintainerSupplierName").val(workerSupplier);
				$(".J-dialog-confirm").hide();
				$(".J-dialog-cancel").text("返回").addClass("col-sm-12");
				
			
    		}
    	},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"维修确认",
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
									"repairDetails.maintainer.supplier.name",
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
						items:buildings,
						show:false,
						handler:function(){
							widget.show([".J-grid",".J-time",".J-flowStatus",".J-buildings",".J-search"]).hide([".J-form",".J-gridDetail",".J-return",".J-formDetail"]);
						}
					}],
					buttonGroup:[{
      					id:"buildings",
      					tip:"楼宇",
      					items:buildings,
      					key:"pkBuilding",
      					value:"name",
    					handler:function(key,element){
    						widget.get("grid").refresh();
    					}
    				},{
   						id:"flowStatus",
   						tip:"状态",
   						items:[{
   		                    key:"Unconfirmed",
   		                    value:"待确认"
   						},{
   							key:"Finish",
   							value:"确认完毕"
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
					}
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
						"repairDetails.user.name," +
						"repairDetails.maintainer.name," +
						"repairDetails.maintainer.pkMaintainer," +
						"repairDetails.maintainer.phone," +
						"repairDetails.maintainer.supplier.name",
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
									fetchProperties:"*,user.name,maintainer.name,maintainer.phone,maintainer.supplier.name"
								});
								data.repairClassifyRemark=data.repairClassify.description;
								widget.get("formDetail").reset();
								widget.get("formDetail").setData(data);
								widget.get("formDetail").setValue("ifSignificant",data.ifSignificant == "true" ? "是":"否");
								widget.get("formDetail").setDisabled(true);
								var name ;
        						for(var i=0;i<data.repairDetails.length;i++){
    								if(data.repairDetails[i].operateType.key == "Dispatch"){
    									name = data.repairDetails[i].maintainer.name;
    									var expectedDate = data.repairDetails[i].expectedDate;
    									break;
    								}
    							}
        						widget.get("formDetail").setValue("maintainerName",name);
        						widget.get("formDetail").setValue("expectedDateName",moment(expectedDate).format("YYYY-MM-DD"));
								widget.show([".J-gridDetail",".J-return",".J-formDetail"]).hide([".J-toexcel",".J-adds",".J-grid",".J-flowStatus",".J-time",".J-search",".J-buildings"]);
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
						className:"user",
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
						className:"createDate",
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
						name:"重大维修",
						className:"ifSignificant",
						format:function(value,row){
							return value ? "是" : "否";
						}
					},{
						key:"repairDetails",
						name:"维修工",
						className:"maintainer",
						format:function(value,row){
							var name="";
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "Dispatch"){
									name = value[i].maintainer.name;
									return "<a  href='javascript:void(0);' ' style='color:red;' data-index='0' class='J-mDetail'>"+name+"</a>";
								}
							}
							
	 					},
					},{
						key:"repairDetails",
						className:"endDate",
						name:"确认完成时间",
						format:function(value,row){
							var time="";
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "Confirmed"){
									time = moment(value[i].createDate).format("YYYY-MM-DD");
									break;
								}
							}
							return time;
	 					},
					},{
						key:"repairFrom.value",
						name:"报修来源",
						className:"from"
					},{
                        key:"flowStatus",
                        className:"flowStatus",
                        name : "操作",
                        format:function(value,row){
                           if(value.key=="Unconfirmed"){
                        	   return "button";
                           }else{
                        	   return "";
                           }
                        },
                        formatparams:[{
                        	key:"reset",
                        	text:"确认",
                        	handler:function(index,data,rowEL){
        						widget.get("gridDetail").refresh({
    								"repair.pkRepair":data.pkRepair,
    								fetchProperties:"*,user.name,maintainer.name,maintainer.phone,maintainer.supplier.name"
    							});
        						var form = widget.get("form");
        						form.reset();
        						form.setData(data);
        						form.setValue("url","api/repair/confirm");
        						form.setValue("placeName",data.place.name);
        						form.setValue("repairClassifyName",data.repairClassify.name);
        						var name ;
        						for(var i=0;i<data.repairDetails.length;i++){
    								if(data.repairDetails[i].operateType.key == "Dispatch"){
    									name = data.repairDetails[i].maintainer.name;
    									var expectedDate = data.repairDetails[i].expectedDate;
    									break;
    								}
    							}
        						form.setValue("maintainerName",name);
        						form.setValue("ifSignificantT",data.ifSignificant==true?"是":"否");
        						form.setValue("expectedDateName",moment(expectedDate).format("YYYY-MM-DD"));
        						form.setValue("description","维修已确认");
        						widget.hide([".J-grid",".J-formDetail"]).show([".J-form",".J-gridDetail"]);
								widget.get("subnav").hide(["search","buildings","flowStatus","time"]);
                        	}
                        },{
                        	key:"notpass",
                        	text:"驳回",
                        	handler:function(index,data,rowEL){
        						widget.get("gridDetail").refresh({
    								"repair.pkRepair":data.pkRepair,
    								fetchProperties:"*,user.name,maintainer.name,maintainer.phone,maintainer.supplier.name"
    							});
        						var form = widget.get("form");
        						form.reset();
        						form.setData(data);
        						form.setValue("url","api/repair/notpass");
        						form.setValue("placeName",data.place.name);
        						form.setValue("repairClassifyName",data.repairClassify.name);
        						var name ;
        						for(var i=0;i<data.repairDetails.length;i++){
    								if(data.repairDetails[i].operateType.key == "Dispatch"){
    									name = data.repairDetails[i].maintainer.name;
    									var expectedDate = data.repairDetails[i].expectedDate;
    									break;
    								}
    							}
        						form.setValue("maintainerName",name);
        						form.setValue("ifSignificantT",data.ifSignificant==true?"是":"否");
        						form.setValue("expectedDateName",moment(expectedDate).format("YYYY-MM-DD"));
        						form.setValue("description","维修已驳回");
        						widget.hide([".J-grid",".J-formDetail"]).show([".J-form",".J-gridDetail"]);
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
            		
            		aw.saveOrUpdate(widget.get("form").getValue("url"),$("#repair1").serialize(),function(data){
						widget.get("grid").refresh();
						widget.hide([".J-formDetail",".J-form",".J-gridDetail"]).show([".J-grid"]);
						widget.get("subnav").hide(["return"]).show(["search","time","buildings","flowStatus"]);
					});
				},
				cancelaction:function(){
					widget.hide([".J-formDetail",".J-form",".J-gridDetail"]).show([".J-grid"]);
					widget.get("subnav").hide(["return"]).show(["search","time","buildings","flowStatus"]);
				},
				model:{
					id:"repair1",
					items:[{
						name:"pkRepair",
						type:"hidden"
					},{
						name:"url",
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
						label:"重大维修",
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
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					}]
				}
			});
            form.setDisabled(true);
            this.set("form",form);
            
            var formDetail = new Form({
            	parentNode:".J-formDetail",
				model:{
					id:"formDetail",
					items:[{
						name:"place.name",
						label:"位置",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
					},{
						name:"repairClassify",
						label:"分类",
						url:"api/repairclassify/query",
						key:"pkRepairClassify",
						value:"name",
						type:"select",
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
						name:"ifSignificant",
						label:"重大维修",
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
						name:"content",
						label:"内容",
						type:"textarea",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
					},{
						name:"flowStatus.value",
						label:"状态",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
					}]
				}
            });
            this.set("formDetail",formDetail);
            var gridDetail=new Grid({
    			parentNode:".J-gridDetail",
    			autoRender : false,
    			url:"api/repairdetail/query",
    			model:{
    				columns:[{
    					key:"createDate",
    					name:"操作时间",
    					format:"date",
    					className:"col-md-2",
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
    					name:"维修工",
    					format:"detail",
						formatparams:[{
							key:"maintainerDetail",
							handler:function(index,data,rowEle){

								Dialog.showComponent({
									title:"维修工信息",
									setStyle:function(){
										$(".el-dialog .modal.fade.in").css({
											"top":"20%",
											"width": "50%",
											"left": "20%"
										});
									},
								},new Form({
									model:{
										id:"maintainer",
										items:[{
											name:"maintainerNname",
											label:"姓名",
											readonly: true
										},{
											name:"maintainerPhone",
											label:"电话",
											readonly: true
										},{
											name:"maintainerSupplierName",
											label:"公司",
											readonly: true
										}],
										defaultButton:false
									}
								}));
								$("#maintainer .J-form-maintainer-text-maintainerNname").val(data.maintainer.name);
								$("#maintainer .J-form-maintainer-text-maintainerPhone").val(data.maintainer.phone);
								$("#maintainer .J-form-maintainer-text-maintainerSupplierName").val(data.maintainer.supplier.name);
								$(".J-dialog-confirm").hide();
								$(".J-dialog-cancel").text("返回").addClass("col-sm-12");
								
							}
						}]
    						
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
				aw.ajax({
					url : "api/repair/query",
					type : "POST",
					data : {
						pkRepair : params.pkFather,
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
						"repairDetails.maintainer.supplier.name",
					},
					success : function(result) {
						widget.get("grid").setData(result);
					}
				});
			} else {
				this.get("grid").refresh();
			}
		}
    });
    module.exports = repairconfirm;	
});
