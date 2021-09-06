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
	var rejectrepairNo1 ; 
	var rejectrepairNo2 ;
	var repairrejecttime = ELView.extend({
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
				//2.根据楼重新查询位置
				var form=widget.get("form");
				form.load("place",{
					callback:function(data){
						for(var i=0;i<data.length;i++){
							if(data[i].room && data[i].room.pkRoom == params.pkRoom){
								form.setValue("place",data[i].pkPlace);
								form.trigger("place","change");
								break;
							}
						}
						widget.show(["form"]);
					}
				});
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
				title:"维修驳回次数",
				buttons:[{
    				id:"return",
    				text:"返回",
					show:false,
					handler:function(){
						widget.show(".J-grid").hide([".J-formDetail",".J-gridDetail"]);
						widget.get("subnav").hide(["return"]);
						return false;
					}
    				
    			}]
			}
		})
		 this.set("subnav",subnav);
		var grid=new Grid({
			parentNode:".J-grid",
			autoRender:false,
			url:"api/repair/query",
			params:function(){
				return {
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
							widget.show([".J-gridDetail",".J-return",".J-formDetail"]).hide([".J-grid","return"]);
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
					key:"repairDetails",
					name:"驳回次数",
					className:"repairNo",
					format:function(value,row){
						var count=0;
						for(var i=0;i<value.length;i++){
							if(value[i].operateType.key == "Reject"){
								count++
							}
						}
						return count;
 					}
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
				}]
			}
		})
		this.set("formDetail",formDetail);
		},
		afterInitComponent:function(params,widget){
			widget.get("grid").refresh({
				"createDate":params.createDate,
				"createDateEnd":params.createDateEnd,
				"operateType":"Reject",
				"place.building.pkBuilding":params.buildingName,
				"repairClassify.pkRepairClassify":params.repairClassify,
				fetchProperties:"*,place.name," +
				"repairClassify.name," +
				"repairClassify.description," +
				"assetCard.code," +
				"repairDetails.operateType," +
				"repairDetails.createDate," +
				"repairDetails.user," +
				"repairDetails.user.name," +
				"repairDetails.maintainer.name",
			
			});
		}
	});
	module.exports = repairrejecttime;
});
