define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var store = require("store");
	var Dialog=require("dialog-1.0.0");
	var Grid=require("grid-1.0.0");
	var Form = require("form-2.0.0")
	var Flag 
	require("./repairprogressquery.css");
	
	var fetchProperties="*,place.name," +
		"repairClassify.name," +
			"repairClassify.description," +
			"assetCard.code," +
			"repairDetails.operateType," +
			"repairDetails.createDate," +
			"repairDetails.startDate," +
			"repairDetails.finishDate," +
			"repairDetails.user," +
			"repairDetails.user.name," +
			"repairDetails.maintainer.name," +
			"repairDetails.maintainer.pkMaintainer," +
			"repairDetails.maintainer.phone," +
			"repairDetails.maintainer.supplier.name";
	var template="<div class = 'el-repairprogressquery'><div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+
		"<div class='J-formDetail hidden' ></div>" +
		 "<div class='J-gridDetail hidden' ></div></div>";
	var buildings=store.get("user").buildings || [];
	if(buildings.length!=0){
		buildings.push({
			pkBuilding:"",
		}); 
	}
	 var repairprogressquery = ELView.extend({
	    	attrs:{
	    		template:template
	    	},
	    	 initComponent:function(params,widget){
	    		 var subnav=new Subnav({
	 				parentNode:".J-subnav",
	 					model:{
	 						title:"维修进度查询",
	 						search:{
	 							placeholder : "报修单号/内容", 
	 							handler : function(str){
	 								widget.get("grid").loading();
	 								aw.ajax({
	 									url:"api/repair/search",
	 									data:{
	 										s:str,
	 										properties:"repairNo,place.name,content",  
	 										fetchProperties:fetchProperties,
	 									},
	 									dataType:"json",
	 									success:function(data){
	 										widget.get("grid").setData(data); 
	 									}
	 								});
	 							}
	 						},
	 						buttonGroup:[{
		 	  					id:"buildings",
		 	  					tip:"楼宇",
		 						key:"pkBuilding",
		 						value:"name",
		 						items:buildings,
		 						showAll:true,
		 						showAllFirst:true,
		 						handler:function(key,element){
		 							widget.get("subnav").setValue("search","");
		 							widget.get("grid").refresh();
		 						}
	 					},{
	 		 				id:"flowStatus",
	 		 				tip:"报修状态",
	 		 				items:[{
	 		                     key:"Unconfirmed,Unarrange,Unrepaired,Finish,Init",
	 		                     value:"全部"
	 		 				},{
	 		                     key:"Unconfirmed,Unarrange,Unrepaired,Init",
	 		                     value:"未结束"
	 		 				},{
	 		 					key:"Init",
	 		 					value:"初始"
	 		 				},{
	 		                     key:"Unarrange",
	 		                     value:"待安排"
	 		 				},{
	 		 					key:"Unrepaired",
	 		                     value:"待维修"
	 		 				},{
	 		                     key:"Unconfirmed",
	 		                     value:"待确认"
	 		 				},{
	 		 					key:"Finish",
	 		 					value:"结束"
	 		 				}],
	 		 				handler:function(key,element){
	 		 					widget.get("subnav").setValue("search","");
	 		 					widget.get("grid").refresh();
	 		 				}
	 		 			},{

	 		 				id:"ifSignificant",
	 		 				tip:"重大维修",
	 		 				showAll:true,
	 		 				showAllFirst:true,
	 		 				items:[{
	 		                     key:"true",
	 		                     value:"是"
	 		 				},{
	 		 					key:"false",
	 		 					value:"否"
	 		 				}],
	 		 				handler:function(key,element){
	 		 					widget.get("subnav").setValue("search","");
	 		 					widget.get("grid").refresh();
	 		 				}
	 		 			
	 		 			}],
	 		 			time:{
 	        				tip:"报修时间",
 	        				click:function(time){
 	        					widget.get("subnav").setValue("search","");
 	        					widget.get("grid").refresh();
 							}
 						},
	 						buttons:[{
	 	 						id:"toexcel",
	 	 						text:"导出",
	 	 						handler:function(){ 
	 	 							var start=widget.get("subnav").getValue("time").start;
	 	 							moment().startOf("year"), moment().endOf("year")
	 	 							if(isNaN(start)){
	 	 								window.open("api/repair/toexcel?flowStatusIn="+widget.get("subnav").getValue("flowStatus")+"&s="+widget.get("subnav").getValue("search")+"&properties=repairNo,place.name,content"+"&ifSignificant="+widget.get("subnav").getValue("ifSignificant")+"&place.building="+widget.get("subnav").getValue("buildings")+"&createDate="+moment().startOf("year")+"&createDateEnd="+moment().endOf("year")+"&operateType=RepairClaiming"+"&isRepairProgressQuery="+"true");
	 	 							}else{
	 	 								window.open("api/repair/toexcel?flowStatusIn="+widget.get("subnav").getValue("flowStatus")+"&s="+widget.get("subnav").getValue("search")+"&properties=repairNo,place.name,content"+"&ifSignificant="+widget.get("subnav").getValue("ifSignificant")+"&place.building="+widget.get("subnav").getValue("buildings")+"&createDate="+widget.get("subnav").getValue("time").start+"&createDateEnd="+widget.get("subnav").getValue("time").end+"&operateType=RepairClaiming"+"&isRepairProgressQuery="+"true");
	 	 							}
	 	 							return false;
	 	 	 					}				
	 	 					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-grid"]).hide([".J-form",".J-gridDetail",".J-formDetail"]);
							if(Flag){
								widget.get("subnav").hide(["return"]).show(["toexcel","ifSignificant","search","flowStatus","buildings"]);	
							}else{
								widget.get("subnav").hide(["return"]).show(["toexcel","time","ifSignificant","search","flowStatus","buildings"]);
							}
						}
					}],
	 	        			
	 				}
	    		 });
	    		 
	    		 this.set("subnav",subnav);
	    		 
	    		 var grid=new Grid({
	 				parentNode:".J-grid",
	 				autoRender:false,
					url:"api/repair/query",
					params:function(){
						var subnav=widget.get("subnav");
						return {
							"createDate":subnav.getValue("time").start,
							"createDateEnd":subnav.getValue("time").end,
							"operateType":"RepairClaiming",
							"ifSignificant":subnav.getValue("ifSignificant"),
							flowStatusIn:subnav.getValue("flowStatus"),
							"place.building":subnav.getValue("buildings"),
							fetchProperties:fetchProperties,
						};
					},
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
									widget.get("subnav").hide("ifSignificant");
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
							key:"ifSignificant",
							name:"重大维修",
							className:"ifSignificant",
							format:function(value,row){
								return value ? "是" : "否";
							}
						},{
							key:"repairDetails",
							className:"time",
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
							key:"repairDetails",
							className:"time",
							name:"实际开始日期",
							format:function(value,row){
								var time="";
								for(var i=0;i<value.length;i++){
									if(value[i].operateType.key == "Finished"){
										if(value[i].startDate){
											time = moment(value[i].startDate).format("YYYY-MM-DD");
										}
										break;
									}
								}
								return time;
		 					},
						},{
							key:"repairDetails",
							className:"time",
							name:"实际完成日期",
							format:function(value,row){
								var time="";
								if(row.flowStatus.key=="Unconfirmed" ||row.flowStatus.key=="Finish" ){
									for(var i=0;i<value.length;i++){
										if(value[i].operateType.key == "Finished"){
											if(value[i].finishDate){
												time = moment(value[i].finishDate).format("YYYY-MM-DD");
											}else{
												return time
											}
											break;
										}
									}
								}
								return time;
		 					},
						},{
							key:"repairDetails",
							className:"time",
							name:"确认时间",
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
							className:"from",
						},{
							key:"flowStatus.value",
							className:"flowStatus",
							name:"状态"
						}]
					},
					
	    		 });
	    		 this.set("grid",grid);
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
	 						name:"assetCard",
	 						label:"资产卡片",
	 						url:"api/assetcard/queryForRepair",
	 						key:"pkAssetCard",
	 						value:"code",
	 						type:"select",
	 						lazy:true,
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
	    	 afterInitComponent : function(params,widget) {
					var subnav=widget.get("subnav");
					if(params!=null){
						if(params.flag){
							Flag=true;
						}else{
							Flag=false;
						}
						if (params && params.pkFather) {
							aw.ajax({
								url : "api/repair/query",
								type : "POST",
								data : {
									pkRepair : params.pkFather,
									fetchProperties:fetchProperties
								},
								success : function(result) {
									if(widget.get("grid")!=null){
										widget.get("grid").setData(result);
									}
								}
							});
						} else if (params && params.ifSignificant) {
							widget.get("subnav").setValue("ifSignificant",true);
							widget.get("subnav").setValue("time",{start:null,end:null});
							 subnav.setData("flowStatus",[{
	 		                     key:"Unarrange,Unrepaired,Unconfirmed,Init",
	 		                     value:"全部"
	 		 				},{
	 		 					key:"Init",
	 		 					value:"初始"
	 		 				},{
	 		 					key:"Unrepaired",
	 		                     value:"待维修"
	 		 				},{
	 		                     key:"Unconfirmed",
	 		                     value:"待确认"
	 		 				}]);
							widget.hide(".J-time");
								aw.ajax({
									url : "api/repair/query",
									type : "POST",
									data : {
										ifSignificant:params.ifSignificant,
										"orderString":params.orderString,
										"repairDetails.operateType":"RepairClaiming",
										flowStatusIn:params.flowStatusIn,
										fetchProperties:fetchProperties,
									},
									success : function(result) {
										if(widget.get("grid")!=null){
											widget.get("grid").setData(result);
										}
									}
								});
							
						}else {
							widget.get("grid").refresh();
						}
					}else{
						widget.get("grid").refresh();
					}
				},
	 });
	module.exports = repairprogressquery;
});
