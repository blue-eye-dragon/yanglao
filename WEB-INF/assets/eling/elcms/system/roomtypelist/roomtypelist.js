define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav=require("subnav-1.0.0");
	var Tab=require("tab");
	var Grid = require("grid-1.0.0");
	var Form = require("form-2.0.0")
	
	var RoomTypeList=ELView.extend({
		attrs:{
			template: "<div class='J-subnav'></div><div class='J-tab'></div>"
		},
		loadDataByRoomType:function(pkRoomType){
			var assetGrid=this.get("assetGrid");
			aw.ajax({
				url : "api/roomtypeassetlist/query",
				type : "POST",
				data : {
					roomType:pkRoomType,
					fetchProperties:"assetListItems.*,assetListItems.asset.name"
				},
				success : function(data){
					data = data ? (data.length > 0 ? data[0].assetListItems : []) : [];
					assetGrid.setData(data);
				}	
			});
		},
		initComponent:function(params,widget){
			//获取入参
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"房型配置信息",
					buttonGroup:[{
						id:"roomtype",
						key:"pkRoomType",
						value:"name",
						url:"api/roomType/query",
						lazy:true,
						handler:function(key,element){
							widget.loadDataByRoomType(key);
							
							widget.get("lowconsumeGrid").refresh();
						}
					}]				
				}
			});
			this.set("subnav",subnav);
						
			var tab = new Tab({
				parentNode:".J-tab",
				autoRender:true,
				model:{
					items:[{
						id:"memAsset",
						title:"资产"
					},{
						id:"memLowConsume",
						title:"低质易耗"
					}]
				}
			});
			
			//渲染页签一：资产
			var assetForm=new Form({
				parentNode:"#memAsset",
            	saveaction:function(){
            		var params="pkRoomType="+widget.get("subnav").getValue("roomtype")+"&"+$("#roomtypeasset").serialize();
    				aw.saveOrUpdate("api/assetlistitem/save",params,function(data){
						widget.hide("#memAsset .el-form").show("#memAsset .el-grid");
						widget.loadDataByRoomType(widget.get("subnav").getValue("roomtype"));
						
					});
 				},
 				//取消按钮
				cancelaction:function(){
					widget.hide("#memAsset .el-form").show("#memAsset .el-grid");
				},
				model:{
					id:"roomtypeasset",
					items:[{
						name:"pkAssetListItem",
						type:"hidden",
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"asset",
   						key:"pkAsset",
   						value:"name",
   						url:"api/asset/query",
   						params:{
   							fetchProperties:"pkAsset,name"
   						},
   						label:"资产名称",
   						type:"select",
   						validate:["required"]
					},{
						name:"quantity",
						label:"数量",
						validate:["required"]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
             });
			 this.set("assetForm",assetForm);
			
			var assetGrid=new Grid({
				parentNode:"#memAsset",
				autoRender:false,
 				model : {
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								widget.get("assetForm").reset();
								widget.show("#memAsset .el-form").hide("#memAsset .el-grid");
							}
						}]
					},
					columns:[{
                        key:"asset.name",
                        name:"资产名称"
                    },{
						key:"quantity",
						name:"资产数量"
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
								widget.get("assetForm").reset();
								widget.show("#memAsset .el-form").hide("#memAsset .el-grid");
								widget.get("assetForm").setData(data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/assetlistitem/" + data.pkAssetListItem + "/delete",function(){
									widget.loadDataByRoomType(widget.get("subnav").getValue("roomtype"));							
								});
							}
						}]
					}]
 				}
    		 });
			 this.set("assetGrid",assetGrid);
			
			//渲染页签二：低质易耗
			var lowconsumeForm=new Form({
				parentNode:"#memLowConsume",
            	saveaction:function(){
            		var params="pkRoomType="+widget.get("subnav").getValue("roomtype")+"&"+$("#roomtypelowconsume").serialize();
    				aw.saveOrUpdate("api/roomtypelowconsumelist/save",params,function(){
						widget.hide("#memLowConsume .el-form").show("#memLowConsume .el-grid");
						widget.get("lowconsumeGrid").refresh();
					});
 				},
 				//取消按钮
				cancelaction:function(){
					widget.hide("#memLowConsume .el-form").show("#memLowConsume .el-grid");
				},
				model:{
					id:"roomtypelowconsume",
					items:[{
						name:"pkRoomTypeLowConsumeList",
						type:"hidden",
					},{
						name:"pkLowConsumeListItem",
						type:"hidden",
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"expendables",
   						key:"pkExpendables",
   						value:"name",
   						url:"api/expendables/query",
   						params:{
   							fetchProperties:"pkExpendables,name",
   						},
   						label:"低质易耗品",
   						type:"select",
   						validate:["required"]
					},{
						name:"quantity",
						label:"数量",
						validate:["required"]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
             });
			this.set("lowconsumeForm",lowconsumeForm);
			
			var lowconsumeGrid=new Grid({
				parentNode:"#memLowConsume",
				autoRender:false,
    			url:"api/roomtypelowconsumelist/query",
    			params:function(){
    				return {
    					fetchProperties:"*,lowConsumeListItems.expendables.*,lowConsumeListItems.*,roomType.name,roomType.pkRoomType",
    					pkRoomType:widget.get("subnav").getValue("roomtype")
    				};
    			},
 				model : {
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								widget.get("lowconsumeForm").reset();
								widget.show("#memLowConsume .el-form").hide("#memLowConsume .el-grid");
							}
						}]
					},
					columns:[{
						key:"lowConsumeListItems",
						name:"易耗品名称",
						format:function(value,row){
	                        for(var i=0;i<value.length;i++){
	                        	return value[i].expendables.name;
	                        }
						}
					},{
						key:"lowConsumeListItems",
						name:"数量",
						format:function(value,row){
    						for(var i=0;i<value.length;i++){
                        		return value[i].quantity;
                        	}
						}
					},{
						key:"lowConsumeListItems",
						name:"备注",
						format:function(value,row){
	    					for(var i=0;i<value.length;i++){
	                        	return value[i].description ? value[i].description : "";
	                        }
						}
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("lowconsumeForm").reset();
								widget.show("#memLowConsume .el-form").hide("#memLowConsume .el-grid");
								data.pkLowConsumeListItem = data.lowConsumeListItems[0].pkLowConsumeListItem;
								data.expendables=data.lowConsumeListItems[0].expendables;
								data.quantity=data.lowConsumeListItems[0].quantity;
								data.description=data.lowConsumeListItems[0].description;
								widget.get("lowconsumeForm").setData(data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/roomtypelowconsumelist/" + data.pkRoomTypeLowConsumeList + "/delete",function(){
									widget.get("lowconsumeGrid").refresh();							
								});
							}
						}]
					}]
 				}
    		 });
			 this.set("lowconsumeGrid",lowconsumeGrid);
			
			 $("#memAsset").children().eq(1).addClass("hidden");
			 $("#memLowConsume").children().eq(1).addClass("hidden");
			
			 this.set("tab",tab);
		},
		afterInitComponent:function(params,widget){
			widget.get("subnav").load({
				id:"roomtype",
				callback:function(data){
					if(data.length!==0){
						widget.loadDataByRoomType(widget.get("subnav").getValue("roomtype"));
						widget.get("lowconsumeGrid").refresh();
					}else{
						widget.get("assetGrid").setData([]);
						widget.get("lowconsumeGrid").setData([]);
					}
				}
			});
		}
	});
	
	module.exports = RoomTypeList;
});