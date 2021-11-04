define(function(require, exports, module) {
	 var Dialog=require("dialog-1.0.0");
	    var aw = require("ajaxwrapper");
	    var Form =require("form-2.0.0")
	    var ELView=require("elview");
		var Subnav = require("subnav-1.0.0"); 
		var Grid = require("grid-1.0.0");
		var store = require("store");
		var activeUser = store.get("user");
	    var template="" +
	     "<div class='J-subnav'></div>"+
		 "<div class='J-grid'></div>"+
		 "<div class='J-form hidden'></div>"+
		 "<div class='J-gridDetail hidden'></div>"+
	     "<div class='J-formRDetail hidden'></div>" +
		 "<div class='J-gridRDetail hidden'></div>";
	var checkoutrepair = ELView.extend({
		attrs:{
        	template:template
        },
        
        initComponent:function(params,widget){
        	
        	var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"退房维修确认",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/checkoutrepair/search",
							data : {
								s : str,
								orderString:"memberSigning.stopDate:desc",
								properties : "memberSigning.room.number",
								fetchProperties:"*,pkCheckOutRepair," +
								"memberSigning.room.number,memberSigning.pkMemberSigning," +
								"memberSigning.room.pkRoom," +
								"memberSigning.stopDate," +
								"repairs," +
								"version," +
								"repairs.place.name," +
								"repairs.repairClassify.name," +
								"repairs.repairClassify.pkRepairClassify," +
								"repairs.repairClassify.description," +
								"repairs.assetCard.code," +
								"repairs.repairNo," +
								"repairs.pkRepair," +
								"repairs.place.pkPlace," +
								"repairs.repairFrom," +
								"repairs.content," +
								"repairs.ifSignificant," +
								"repairs.flowStatus.value," +
								"repairs.flowStatus," +
								"repairs.repairDetails.createDate," +
								"repairs.repairDetails.operateType," +
								"repairs.repairDetails.user.name" ,
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								
							}
						});
					
					},
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
						id:"flowStatus",
						tip : "维修状态",
						items:[{
							value:"全部"
						},{
							key:"Init",
							value:"初始"
						},{
							key:"Repairing",
							value:"维修中"
						},{
							key:"End",
							value:"完成"
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}],
					buttons:[{
						id:"return",
        				text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-grid"]).hide([".J-form",".J-gridDetail"]);
							widget.get("subnav").hide(["return"]).show(["building","flowStatus","time","search"]);
							return false;
						}
					},{
						id:"return2",
        				text:"返回",
						show:false,
						handler:function(){
							widget.hide([".J-grid",".J-gridRDetail",".J-formRDetail"]).show([".J-form",".J-gridDetail"]);
							widget.get("subnav").show(["return"]).hide(["building","flowStatus","time","search","return2"]);
							return false;
						}
					
					}],
					time:{
						tip : "退房时间",
					 	ranges:{
					 		"今年": [moment().startOf("year"), moment().endOf("year")] ,
							},
						defaultTime:"今年",
        				click:function(time){
        					widget.get("grid").refresh();
						}
					},
				}
        	});
        	this.set("subnav",subnav);
        	var grid=new Grid({
    			parentNode:".J-grid",
				url:"api/checkoutrepair/query",
				fetchProperties:"*,pkCheckOutRepair," +
				"memberSigning.room.number,memberSigning.pkMemberSigning," +
				"memberSigning.room.pkRoom," +
				"memberSigning.stopDate," +
				"repairs," +
				"version," +
				"repairs.place.name," +
				"repairs.repairClassify.name," +
				"repairs.repairClassify.pkRepairClassify," +
				"repairs.repairClassify.description," +
				"repairs.assetCard.code," +
				"repairs.repairNo," +
				"repairs.pkRepair," +
				"repairs.place.pkPlace," +
				"repairs.repairFrom," +
				"repairs.content," +
				"repairs.ifSignificant," +
				"repairs.flowStatus.value," +
				"repairs.flowStatus," +
				"repairs.repairDetails.createDate," +
				"repairs.repairDetails.operateType," +
				"repairs.repairDetails.user.name" ,
				params:function(){
					return {
						pkCheckOutRepair:params?params.modelId:"",
						"memberSigning.stopDate":widget.get("subnav").getValue("time").start,
						"memberSigning.stopDateEnd":widget.get("subnav").getValue("time").end,
						orderString:"memberSigning.stopDate:desc",
						"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
						status:widget.get("subnav").getValue("flowStatus")
					};
				},
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.hide([".J-grid"]).show([".J-form",".J-gridDetail"]);
								widget.get("subnav").show(["return"]).hide(["building","flowStatus","time","search"]);
								widget.get("form").reset();
								data.memberSigningstopDate=moment(data.memberSigning.stopDate).format("YYYY-MM-DD");
								widget.get("form").setData(data);
								widget.get("form").setValue("stat",data.status.value);
								widget.get("form").setValue("memberSigning",data.memberSigning.pkMemberSigning);
								widget.get("gridDetail").setData(data.repairs);
								widget.get("form").setDisabled(true);
							
							}
						}]
					},{
							key:"memberSigning.stopDate",
							name:"退房日期 ",
							format:"date"
						},{
						key:"expectedDate",
						name:"计划完成日期 ",
						format:"date"
					},{
							key:"status.value",
							name:"维修状态"
						},{
							key:"description",
							name:"描述",
							col:6
						},{

							key:"operate",
							name:"操作",
							format:function(value,row){
								var datas = row.repairs;
								var button = "button";
								for(var i = 0; i<datas.length; i++){
									if(datas[i].flowStatus.key != "Finish")
										button = "";
								}
								if(datas.length == 0 ||row.status.key == "End"){
									button = "";
								}
								return button;
								},
							formatparams:[{
								key:"edit",
								text:"确认", 
								handler:function(index,data,rowEle){
									Dialog.confirm({
										setStyle:function(){},
										content:"是否确认？",
										confirm:function(){
											aw.ajax({
												url:"api/checkoutrepair/confim",
												data:{
													pkCheckOutRepair:data.pkCheckOutRepair,
												},
												dataType:"json",
												success:function(datas){
													widget.get("grid").refresh({
														pkCheckOutRepair:datas.pkCheckOutRepair,
														fetchProperties:"*,pkCheckOutRepair," +
														"memberSigning.room.number,memberSigning.pkMemberSigning," +
														"memberSigning.room.pkRoom," +
														"memberSigning.stopDate," +
														"repairs," +
														"version,repairs.place.name," +
														"repairs.repairClassify.name," +
														"repairs.repairClassify.pkRepairClassify," +
														"repairs.repairClassify.description," +
														"repairs.creator.name," +
														"repairs.assetCard.code," +
														"repairs.repairNo," +
														"repairs.pkRepair," +
														"repairs.place.pkPlace," +
														"repairs.repairFrom," +
														"repairs.content," +
														"repairs.createDate," +
														"repairs.ifSignificant," +
														"repairs.flowStatus.value," +
														"repairs.flowStatus," ,
													});
												}
											});
										}
									});
								}
							}]
						}]
				}
        	});
        	this.set("grid",grid);
        	
        	var form = new Form({
        		parentNode:".J-form",
        		model:{
        			id:"checkoutrepair",
        			items:[{
         				name:"pkCheckOutRepair",
         				type:"hidden"
         			},{
         				name:"memberSigning.room.pkRoom",
         				type:"hidden"
         			},{
         				name:"version",
         				type:"hidden"
         			},{
         				name:"memberSigning",
         				type:"hidden"
         			},{
         				name:"memberSigning.room.number",
         				label:"房间号",
         				type:"text",
         				readonly:true,
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"expectedDate",
						label:"计划完成日期 ",
         				type:"date",
         				mode:"Y-m-d",
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"memberSigningstopDate",
						label:"退房日期 ",
						readonly:true,
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
         			},{
         				name:"description",
						label:"问题描述",
						type:"textarea",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"stat",
						label:"维修状态",
						readonly:true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			}]
        		}
        	})
        	this.set("form",form);
        	
        	var gridDetail=new Grid({
        		parentNode:".J-gridDetail",
        		model:{
        			head:{
						title:"报修明细", 
					},
				columns:[{
					key:"repairNo",
					name:"报修单号",
					format:"detail",
					formatparams:[{
						key:"detail",
						handler:function(index,data,rowEle){
							widget.get("gridRDetail").refresh({
								"repair.pkRepair":data.pkRepair,
								fetchProperties:"*,user.name,maintainer.name"
							});
							data.repairClassifyRemark=data.repairClassify.description;
							widget.get("formRDetail").reset();
							widget.get("formRDetail").setData(data);
							widget.get("formRDetail").setValue("ifSignificant",data.ifSignificant == "true" ? "是":"否");
							widget.get("formRDetail").setDisabled(true);
							widget.show([".J-gridRDetail",".J-formRDetail",".J-return2"]).hide([".J-gridDetail",".J-form",".J-return"]);
						}
					}]
				},{
					key:"place.name",
					name:"位置"
				},{
					key:"repairClassify.name",
					name:"分类"
				},{
					key:"assetCard.code",
					name:"资产卡片"
				},{
					key:"content",
					name:"内容"
				},{
					key:"repairDetails",
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
					format:function(value,row){
						return value ? "是" : "否";
					}
				},{
					key:"flowStatus.value",
					name:"报修状态"
				},{
					key:"repairDetails",
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
				}]
        	}
			
        	})
        	this.set("gridDetail",gridDetail);
        	var formRDetail = new Form({
    			parentNode:".J-formRDetail",
    			model:{
    				id:"formRDetail",
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
    		})
    		this.set("formRDetail",formRDetail);
        	
        	var gridRDetail=new Grid({
    			parentNode:".J-gridRDetail",
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
    					className:"col-md-2",
    					format:"date"
    				},{
    					key:"startDate",
    					name:"实际开始日期",
    					className:"col-md-2",
    					format:"date"
    				},{
    					key:"finishDate",
    					name:"实际结束日期",
    					className:"col-md-2",
    					format:"date"
    				},{
    					key:"description",
    					className:"col-md-5",
    					name:"说明"
    				}]
    			},
    		})
    		this.set("gridRDetail",gridRDetail);
        },
	});
	module.exports = checkoutrepair;
});
