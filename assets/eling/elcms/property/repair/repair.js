define(function(require, exports, module) {
	var Dialog=require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
    var Form =require("form-2.0.0")
    var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var store = require("store");
	require("./repair.css");
	var activeUser = store.get("user");
    var template="<div class= 'el-property-repair'><div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 " <div class='J-form hidden' ></div>" +
	 " <div class='J-formDetail hidden' ></div>" +
	 "<div class='J-gridDetail hidden' ></div></div>" ;
    var buildings=store.get("user").buildings || [];
	if(buildings.length!=0){
		buildings.push({
			pkBuilding:"",
			name:"全部"
		});
	}
	var repair = ELView.extend({
		forward:{
			status:function(params,widget){
				widget.get("grid").refresh(params);
				widget.get("form").load("place");
			},
			workbench:function(params,widget){
				widget.get("grid").refresh(params);
				widget.get("form").load("place");
			},
			memberstatus:function(params,widget){
				//1.设置楼
				widget.get("subnav").setValue("buildings",params.pkBuilding);
				var subnav=widget.get("subnav");
				subnav.hide(["buildings","search","adds"]);
				widget.get("subnav").setTitle("报修："+params.name);
				//2.根据楼重新查询位置
//					var form=widget.get("form");
//					form.load("place",{
//						callback:function(data){
//							for(var i=0;i<data.length;i++){
//								if(data[i].room && data[i].room.pkRoom == params.pkRoom){
//									form.setValue("place",data[i].pkPlace);
//									form.trigger("place","change");
//									break;
//								}
//							}
//							widget.show(["form"]);
//						}
//					});
				
				widget.get("grid").refresh();
			}
		},
		events : {
			"change .J-form-repair-select-place":function(e){
				var form=this.get("form");
				form.load("assetCard",{
					params:{
						"place.pkPlace":form.getValue("place"),
						pkBuilding:this.get("subnav").getValue("buildings")
					}
				});
			},
		
			"change .J-form-repair-select-repairClassify":function(e){
				var form=this.get("form");
				var data=form.getData("repairClassify",{
					pk:form.getValue("repairClassify")
				});
				form.setValue("repairClassifyRemark",data ? data.description : "");
			}
		},
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
			
		var subnav=new Subnav({
			parentNode:".J-subnav",
			model:{
				title:"报修",
				search : function(str) {
						var g=widget.get("grid");
						g.loading();
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
				buttonGroup:[{
					id:"buildings",
					tip:"楼宇",
					items:buildings,
					key:"pkBuilding",
					value:"name",
					handler:function(key,element){
						widget.get("subnav").setValue("search","");
						widget.get("grid").refresh();
						widget.get("form").load("place",{
							params:{
								building:key,
								fetchProperties:"*,room.number"
							}
						});
					}
				},{
	   			 id:"flowStatus",
	   			 tip:"状态",
					items:[{
	                    key:"",
	                    value:"全部"
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
				}],
				time:{
					tip :"报修时间",
    				click:function(time){
    					widget.get("subnav").setValue("search","");
    					widget.get("grid").refresh();
					}
				},
				buttons:[{
					id:"adds",
					text:"新增",
					type:"button",
					handler:function(){
						widget.get("form").reset();
						widget.get("form").setValue("ifSignificant","false");
						widget.show([".J-form"]).hide([".J-toexcel",".J-adds",".J-grid",".J-flowStatus",".J-time",".J-search"]);
						
						return false;
					}
				},{
					id:"return",
					text:"返回", 
					show:false,
					type:"button",
					handler:function(){
						widget.get("subnav").setValue("search","");
						if(widget.get("params")&&widget.get("params").flg=="deceasedmembers"){
							widget.show([".J-toexcel",".J-grid",".J-flowStatus",".J-time",".J-search"]).hide([".J-buildings",".J-adds",".J-form",".J-return",".J-gridDetail",".J-formDetail"]);	
						}else{
							widget.show([".J-toexcel",".J-adds",".J-grid",".J-flowStatus",".J-time",".J-search",".J-buildings"]).hide([".J-form",".J-return",".J-gridDetail",".J-formDetail"]);	
						}
						return false;
					}
				},{
 						id:"toexcel",
 						text:"导出", 
 						handler:function(){ 
 							var inParams = widget.get("params");
 							if(inParams){
 	 							window.open("api/repair/toexcel?flowStatus="+widget.get("subnav").getValue("flowStatus")
 	 									+"&place.room.pkRoom="+inParams.pkRoom
 	 									+"&createDate="+widget.get("subnav").getValue("time").start
 	 									+"&createDateEnd="+widget.get("subnav").getValue("time").end);
 							}else{
 								window.open("api/repair/toexcel?flowStatus="+widget.get("subnav").getValue("flowStatus")
 										+"&pkBuilding="+widget.get("subnav").getValue("buildings")+
 										"&s="+widget.get("subnav").getValue("search")+
 										"&properties=repairNo,place.name,content"+
 										"&createDate="+widget.get("subnav").getValue("time").start+
 										"&createDateEnd="+widget.get("subnav").getValue("time").end);
 							}
 							return false;
 	 					}				
 					}
				]
			}
		})
		 this.set("subnav",subnav);
		var grid=new Grid({
			parentNode:".J-grid",
			autoRender:false,
			url:"api/repair/query",
			params:function(){
				var subnav=widget.get("subnav");
				var inParams = widget.get("params");
				if(inParams){
					return{
						"createDate":subnav.getValue("time").start,
						"createDateEnd":subnav.getValue("time").end,
						"operateType":"RepairClaiming",
						flowStatus:subnav.getValue("flowStatus"),
						"place.room.pkRoom":inParams.pkRoom,
						fetchProperties:"*,place.name," +
						"repairClassify.name," +
						"repairClassify.description," +
						"assetCard.code," +
						"repairDetails.operateType," +
						"repairDetails.createDate," +
						"repairDetails.user," +
						"repairDetails.user.name," +
						"repairDetails.maintainer.name",
					};
				}else{
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
						"repairDetails.user," +
						"repairDetails.user.name," +
						"repairDetails.maintainer.name",
					};
				}
				
			},
			model:{
				columns:[{
					key:"repairNo",
					name:"报修单号",
					format:"detail",
					className:"repairNo",
					formatparams:[{
						key:"detail",
						handler:function(index,data,rowEle){
							widget.get("gridDetail").refresh({
								"repair.pkRepair":data.pkRepair,
								fetchProperties:"*,user.name,maintainer.name"
							});
							data.repairClassifyRemark=data.repairClassify.description;
							widget.get("formDetail").reset();
							widget.get("formDetail").setData(data);
							widget.get("formDetail").setValue("ifSignificant",data.ifSignificant == "true" ? "是":"否");
							widget.get("formDetail").setDisabled(true);
							widget.show([".J-gridDetail",".J-return",".J-formDetail"]).hide([".J-toexcel",".J-adds",".J-grid",".J-flowStatus",".J-time",".J-search",".J-buildings"]);
						}
					}]
				},{
					key:"place.name",
					name:"位置",
					className:"place"
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
					key:"repairFrom.value",
					name:"报修来源",
					className:"from"
				},{
					key:"flowStatus.value",
					className:"flowStatus",
					name:"状态"
				},{
					key:"flowStatus",
					className:"opear",
					name:"操作",
					format:function(value,row){
						var button = "";
						if(value.key=="Unarrange"){
							button= "button";  
						}
						if(row.repairFrom.key == "CheckOurRepair"){
							button = "";
						}
						return button;
					},
					formatparams:[{
						key:"edit",
						icon:"edit",
						handler:function(index,data,rowEle){
							data.repairClassifyRemark=data.repairClassify.description;
							widget.get("form").setData(data);
							var time="";
							for(var i=0;i<data.repairDetails.length;i++){
								if(data.repairDetails[i].operateType.key == "RepairClaiming"){
									time = data.repairDetails[i].createDate;
									break;
								}
							}
							widget.get("form").setValue("createDate",time);
							widget.get("form").setAttribute("place","readonly","readonly");
							widget.get("form").setAttribute("repairClassify","readonly","readonly");
							widget.get("form").setAttribute("ifSignificant","disabled","disabled");
							widget.get("form").setAttribute("createDate","disabled","disabled");
							widget.show([".J-form"]).hide([".J-toexcel",".J-buildings",".J-adds",".J-grid",".J-flowStatus",".J-time",".J-search"]);
							return false;
						}
					},{
						key:"delete",
						icon:"remove",
						handler:function(index,data,rowEle){
							aw.ajax({
           						url:"api/repairdetail/query",
           						data:{
           							"repair.pkRepair":data.pkRepair,
           						    fetchProperties:"*,user.name,maintainer.name",   
           						},
           						dataType:"json",
           						success:function(datas){
           							if(datas.length>1){
           								Dialog.alert({
           									content:"该维修正在处理中，不可删除！"
           								});
           								return false;
           							}else{
           								aw.del("api/repair/" + data.pkRepair + "/delete",function(data) {
            								  widget.get("grid").refresh();
            							});
           							}
           							
           						}
           					});
						}
					}]
				}]
			}
		})
		this.set("grid",grid);
		
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
					className:"col-md-2",
					format:"date"
				},{
					key:"description",
					className:"col-md-5",
					name:"说明"
				}]
			},
		})
		this.set("gridDetail",gridDetail);
		
		var form = new Form({
			parentNode:".J-form",
			saveaction:function(){
				var card=widget.get("form");
				var pkRepairClassify=card.getValue("repairClassify");
				var data=card.getData("repairClassify",{
					pk:pkRepairClassify
				});
				if(data.card && !card.getValue("assetCard")){
					//说明该分类要求必须要有资产卡片
					Dialog.tip({
						title:"必修选择资产卡片"
					});
					return;
				}else{
					
					var datas = $("#repair").serialize();
					if(datas.indexOf("createDate")<0){
						datas = datas+"&createDate="+card.getValue("createDate");
					}
					if(datas.indexOf("ifSignificant")<0){
						datas = datas+"&ifSignificant="+card.getValue("ifSignificant");
					}
					aw.saveOrUpdate("api/repair/save",datas,function(data){
						widget.get("grid").refresh();
					});
				}
				widget.show([".J-toexcel",".J-adds",".J-grid",".J-flowStatus",".J-time",".J-search"]).hide([".J-form",".J-return"]);
			},
			cancelaction:function(){
					widget.show([".J-toexcel",".J-adds",".J-grid",".J-flowStatus",".J-time",".J-search"]).hide([".J-form",".J-return"]);	
	  				},
			model:{
				id:"repair",
				items:[{
					name:"pkRepair",
					type:"hidden",
				},{
					name:"repairFrom",
					type:"hidden",
				},{
					name:"repairNo",
					type:"hidden",
				},{
					name:"flowStatus",
					type:"hidden",
				},{
					name:"version",
					defaultValue:"0",
					type:"hidden"
				},{
					name:"place",
					label:"位置",
					url:"api/place/query",
					lazy:true,
					params:function(){
						return {
							building:widget.get("subnav").getValue("buildings")
						};
					},
					key:"pkPlace",
					value:"name",
					type:"select",
					validate:["required"]
				},{
					name:"repairClassify",
					label:"分类",
					url:"api/repairclassify/query",
					key:"pkRepairClassify",
					value:"name",
					type:"select",
					validate:["required"]
				},{
					name:"repairClassifyRemark",
					label:"分类详情",
					readonly:true,
					placeholder:" "
				},{
					name:"assetCard",
					label:"资产卡片",
					url:"api/assetcard/queryForRepair",
					key:"pkAssetCard",
					value:"code",
					type:"select",
					lazy:true
				},{
					name:"createDate",
					label:"报修时间",
					type:"date",
					mode:"Y-m-d H:i",
					validate:["required"],
					defaultValue:moment()
				},{
					name:"ifSignificant",
					label:"重大维修",
					type:"radiolist",
					list:[{
						key:true,
						value:"是"
					},{
						key:false,
						value:"否"
					}],
					defaultValue:"false",
					validate:["required"],
				},{
					name:"content",
					label:"内容",
					type:"textarea",
					validate:["required"]
				}]
			}
		})
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
		this.set("formDetail",formDetail);
		},
		afterInitComponent:function(params,widget){
			var forward=this.get("forward");
			var forwardHandler=this.forward[forward];
			if(typeof forwardHandler === "function"){
				forwardHandler(params,widget);
			}else{
				widget.get("grid").refresh(params);
				widget.get("form").load("place");
			}
		}
	});
	module.exports = repair;
});
