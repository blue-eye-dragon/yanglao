define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Form =require("form");
	var aw=require("ajaxwrapper");
	var store=require("store");
	var buildings=store.get("user").buildings || [];
	buildings.push({
		pkBuilding:"ss",
		name:"未分配"
	});

	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"; 
	
	
	var AssetCard = ELView.extend({
		attrs:{
			template:template
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"资产卡片维护",
					search:function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/assetcard/search",
							data:{
								s:str,
								properties:"code,asset.name,place.name,company,department.name,price,date",
								fetchProperties:"*,asset.name,department.name,place.pkPlace,place.name,place.building.name,place.room.pkRoom",
							},
							dataType:"json",
							success:function(data){
								widget.get("grid").setData(data); 
								widget.show([".J-grid"]).hide([".J-form"]);
								widget.get("subnav").show(["add","buildings","search"]).hide(["return"]);
							}
						});
					},
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").show(["add","search","buildings"]).hide(["return"]);
							return false;
						}
					},{
						id:"add",
						text:"新增",
						handler:function(){
							widget.show([".J-form"]).hide([".J-grid"]);
							widget.get("subnav").show(["return"]).hide(["add","search","buildings"]);
							widget.get("form").reset();
							return false;
						}
					}],
					buttonGroup:[{
						id:"buildings",
						items:buildings,
						key:"pkBuilding",
						value:"name",
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}]
				}
			});
			this.set("subnav",subnav);

			var grid=new Grid({
				parentNode:".J-grid",
				autoRender : false,
				url : "api/assetcard/query",
				params:function(){
					var building=widget.get("subnav").getValue("buildings");
					if(building=="ss"){
						building="";
					}
					return {
						pkBuilding:building,
						fetchProperties:"*,asset.name,department.name,place.pkPlace,place.name,place.building.name,place.room.pkRoom",
					};
				},
				model:{
					columns:[{
						key:"code",
						name:"编码",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.show([".J-form"]).hide([".J-grid"]);
								widget.get("subnav").show(["return"]).hide(["add","search","buildings"]);
								widget.get("form").setData(data);
								widget.get("form").setDisabled(true);
								return false;
							}
						}]
					},{
						key:"asset.name",
						name:"所属资产目录"
					},{
						key:"company",
						name:"使用公司"
					},{
						key:"department.name",
						name:"使用部门"
					},{
						key:"place.name",
						name:"位置"
					},{
						key:"price",
						name:"资产原值(元)"
					},{
						key:"date",
						name:"购入日期",
						format:"date"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.show([".J-form"]).hide([".J-grid"]);
								widget.get("subnav").show(["return"]).hide(["add","search","buildings"]);
								var form = widget.get("form");
								form.reset();
								form.setData(data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/assetcard/" + data.pkAssetCard + "/delete",function() {
									widget.get("grid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var form=new Form({
				show:false,
				parentNode:".J-form",
				saveaction:function(){
					aw.saveOrUpdate("api/assetcard/save",widget.get("form").getData(),function(data){
						widget.hide([".J-form"]).show([".J-grid"]);
						widget.get("subnav").show(["add","search","buildings"]).hide(["return"]);
						widget.get("grid").refresh();
					});
				},
				//取消按钮
				cancelaction:function(){
					widget.hide(".J-form").show(".J-grid");
					widget.get("subnav").show(["add","search","buildings"]).hide(["return"]);
				},
				model:{
					id:"assetcard",
					items:[{
						name:"pkAssetCard",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"code",
						label:"编码",
						validate:["required"]
					},{
						name:"asset",
						label:"所属资产目录",
						type:"select",
						url:"api/asset/query",
						key:"pkAsset",
						value:"name",
						validate:["required"]
					},{
						name:"company",
						label:"使用公司",
						validate:["required"]
					},{
						name:"department",
						label:"使用部门",
						type:"select",
						url:"api/department/query",
						key:"pkDepartment",
						value:"name",
						validate:["required"]
					},{
						name:"price",
						label:"资产原值(元)",
						validate:["required"]
					},{
						name:"date",
						label:"购入日期",
						type:"date",		
						validate:["required"]
					},{
						name:"place",
						keyField:"pkPlace",
						type:"autocomplete",
						queryParamName:"s",
						maxItemsToShow:15,
						useCache:false,
						label:"位置（房间号等）",
						url:"api/place/search",
						params:function(){
							return {
								searchProperties:"name",
								fetchProperties:"pkPlace,name,room.building.name,building.name"
							};
						},
						format:function(data, value){
							if(data!=null&&data.name!=null){
								if (data.room!=null){
									return data.name;
								}else if(data.building!=null){
									return data.building.name + " " + data.name;
								}
							}
						}
					},{
						name:"remark",
						label:"备注",
						type:"textarea"
					}]
				}
			});
			this.set("form",form);
		},
		afterInitComponent:function(params,widget){
			this.get("subnav").setValue("buildings","ss");
			widget.get("grid").refresh();
		}
	});
	module.exports = AssetCard;
});