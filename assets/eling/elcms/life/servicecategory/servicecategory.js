define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var ServiceCategory = BaseView.extend({	
		initSubnav:function(widget){
			return {
				model:{
					title:"服务分类",					
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/servicecategory/query",
				fetchProperties:"*,paperType.name,",
				model:{
					columns:[{
						key:"name",
						name:"服务名称"					
					},{
						key:"paperType",
						name:"所需材料",
						format:function(value,row){ 
							var val="";							
							for (var int = 0; int < value.length; int++) {
							val=val+"、"+value[int].name; 
						 }	
							return val.substr(1) ;
						}
					},{
						key:"description",
						name:"描述 "					
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
								widget.del("api/servicecategory/" + data.pkServiceCategory + "/delete");
							}
						}]
 					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					var data=$("#servicecategory").serializeArray();											
					widget.save("api/servicecategory/save",$("#servicecategory").serialize());
				},
				model:{
					id:"servicecategory",
					items:[{
						name:"pkServiceCategory",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"服务名称",
						validate:["required"]
					},{
						name:"paperType",
						key:"pkPaperType",
						value:"name",
						label:"所需材料",
						url:"api/papertype/query",
						params:{
							fetchProperties:"name,pkPaperType"
						},
						type:"select",
						multi:true,
						validate:["required"]						
					},{
						name:"description",
						label:"描述",
						type:"textarea",
						height:100
					}]
				}
			};
		}
	});
	module.exports = ServiceCategory;
});