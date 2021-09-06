define(function(require, exports, module) {
	var Dialog=require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
    var Form =require("form-2.0.0")
    var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var store = require("store");
	var activeUser = store.get("user");
	require("./repairdispatch.css");
    var template="<div class = 'el-repairdispatch'><div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 " <div class='J-form hidden' ></div> " +
	 "<div class='J-formDetail hidden' ></div>" +
	 "<div class='J-gridDetail hidden' ></div></div>" ;
    var buildings=store.get("user").buildings || [];
	var repair = ELView.extend({
		attrs:{
        	template:template
        },
        events : {
        	"change .J-form-repair-date-expectedDate ":function(e){
				var form=this.get("form");
				var expectedDate = form.getValue("expectedDate");
				if(moment().isAfter(expectedDate, 'day')){
					Dialog.alert({
						content:"预计维修日期必须为今天或以后！"
					});
					form.setValue("expectedDate","");
				}
			}
        },
		initComponent:function(params,widget){
			
		var subnav=new Subnav({
			parentNode:".J-subnav",
			model:{
				title:"维修派工",
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
					showAll:true,
					showAllFirst:true,
					key:"pkBuilding",
					value:"name",
					handler:function(key,element){
						widget.get("grid").refresh();
					}
				},{
					id:"flowStatus",
					tip:"状态",
					items: [{
						key:"Unarrange",
						value:"待派工"
					},{
						key:"Unrepaired",
						value:"待维修"
					}],
					handler:function(key,element){
						widget.get("grid").refresh();
					}
				}],
				time:{
					tip :"申请时间",
    				click:function(time){
    					widget.get("grid").refresh();
					}
				},
				buttons:[{
					id:"return",
					text:"返回",
					show:false,
					type:"button",
					handler:function(){
						widget.show([".J-grid",".J-time",".J-flowStatus",".J-buildings",".J-search"]).hide([".J-form",".J-gridDetail",".J-return",".J-formDetail"]);
						return false;
					}
				}
				]
			}
		})
		 this.set("subnav",subnav);
		var grid=new Grid({
			parentNode:".J-grid",
			url:"api/repair/query",
			params:function(){
				var subnav=widget.get("subnav");
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
					"repairDetails.expectedDate," +
					"repairDetails.createDate," +
					"repairDetails.user," +
					"repairDetails.user.name," +
					"repairDetails.maintainer.name," +
					"repairDetails.expectedDate",
				};
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
					name:"重大维修",
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
					key:"repairDetails",
					className:"expectedDate",
					name:"预计维修日期",
					format:function(value,row){
						var time="";
						for(var i=0;i<value.length;i++){
							if(value[i].operateType.key == "Dispatch"){
								time = moment(value[i].expectedDate).format("YYYY-MM-DD");
								break;
							}
						}
						return time;
 					},
				},{
					key:"repairFrom.value",
					name:"报修来源",
					className:"repairsource"
				},{
					key:"flowStatus",
					className:"operate",
					name:"操作",
					format:function(value,row){
                        if(value.key=="Unarrange"){
                     	   return "button";
                        }else{
                     	   return "";
                        }
                     },
					formatparams:[{
						key:"reset",
                    	text:"派工",
						handler:function(index,data,rowEle){
							widget.get("form").reset();
							widget.get("form").setData(data);
							widget.get("form").setValue("ifSignificantT",data.ifSignificant == true ? "是":"否");
							widget.get("form").setValue("placeName",data.place.name);
							widget.get("form").setValue("description","");
							widget.get("form").setValue("repairClassifyName",data.repairClassify.name);
							widget.get("form").setAttribute("placeName","readonly","readonly");
							widget.get("form").setAttribute("repairClassifyName","readonly","readonly");
							widget.get("form").setAttribute("assetCard","readonly","readonly");
							widget.get("form").setAttribute("ifSignificantT","readonly","readonly");
							widget.get("form").setAttribute("content","readonly","readonly");
							
							widget.get("gridDetail").refresh({
								"repair.pkRepair":data.pkRepair,
								fetchProperties:"*,user.name,maintainer.name"
							});
							widget.show([".J-form",".J-gridDetail"]).hide([".J-grid",".J-buildings",".J-search",".J-flowStatus",".J-time"]);
							return false;
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
					aw.saveOrUpdate("api/repair/adddispatch",$("#repair").serialize(),function(data){
						widget.get("grid").refresh();
					});
					widget.show([".J-grid",".J-time",".J-flowStatus",".J-buildings",".J-search"]).hide([".J-form",".J-gridDetail",".J-return",".J-formDetail"]);
			},
			cancelaction:function(){
				widget.show([".J-grid",".J-time",".J-flowStatus",".J-buildings",".J-search"]).hide([".J-form",".J-gridDetail",".J-return",".J-formDetail"]);
	  				},
			model:{
				id:"repair",
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
					name:"ifSignificantT",
					label:"重大维修",
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
				},{
					name:"maintainer",
					key:"pkMaintainer",
					value:"name",
					url:"api/maintainer/query",
					label:"维修工",
					
					params:{
						fetchProperties:"pkMaintainer,name",
					},
					type:"select",
					className:{
						container:"col-md-6",
						label:"col-md-4"
					},
					validate:["required"]
				},{
					name:"expectedDate",
					label:"预计维修日期",
					type:"date",
					mode:"Y-m-d",
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
					className:{
						container:"col-md-6",
						label:"col-md-4"
					}
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
						"repairDetails.maintainer.supplier.name",
					
				 });
				} else {
					widget.get("grid").refresh();
				}
		     }
	});
	module.exports = repair;
});
