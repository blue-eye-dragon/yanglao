define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var Dish=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"菜品档案"
                }
			};
		},
		initList:function(widget){
			return {
				url : "api/dish/query",
				fetchProperties:"*,dishFoodMaterial.name,dishFoodMaterial.pkDishFoodMaterial,dishClassify.name",
				model:{
					columns:[{
                        key:"name",
                        name:"名称",
                    	format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
							} 
						}]
                    },{
						key:"price",
						name:"价格"
					},{
						key:"dishFoodMaterial",
						name:"食材",
						format:function(value,row){
							var set = '';
							for(var i=0;i<value.length;i++){
								 set += value[i].name + "、";
							}
							set = set.substring(0, set.length-1);
							return set;
						}
					},{
						key:"dishClassify.name",
						name:"分类"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/dish/" + data.pkDish + "/delete");
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				saveaction:function(){
					widget.save("api/dish/save",$("#dish").serialize(),function(data){
						if(data.pkDish){
							widget.get("card").upload("api/attachment/dishphoto/"+data.pkDish);
						}
						widget.get("list").refresh();
                	});
                },
                model:{
					id:"dish",
					items:[{
						title:"菜品信息",
						icon:"user",
						img:{
							idAttribute:"pkDish",
            				url:"api/attachment/dishphoto/",
						},
						children:[{
							name:"pkDish",
							type:"hidden"
						},{
							name:"version",
							type:"hidden",
							defaultValue:"0"
						},{
							name:"name",
							label:"名称",
							validate:["required"]
						},{
							name:"price",
							label:"价格",
							validate:["required,number"]
						},{
							name:"dishFoodMaterial",
							key:"pkDishFoodMaterial",
							value:"name",
							label:"食材",
							multi:true,
							url:"api/dishfoodmerial/query",
							params:{
								fetchProperties:"name,pkDishFoodMaterial"
							},
							type:"select",
							validate:["required"]
						},{
							name:"dishClassify",
							key:"pkDishClassify",
							value:"name",
							label:"分类",
							url:"api/dishclassify/query",
							params:{
								fetchProperties:"name,pkDishClassify"
							},
							type:"select"
						}]
					}]
				}
			};
		}
	});
	
	module.exports = Dish;
});