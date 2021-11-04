define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	
	var Housekeepinger=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"保洁工档案",
					search:function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/housekeepinger/search",
							data:{
								s:str,
								properties:"pkHousekeepinger,name,supplier.name,birthday,phone",
							    fetchProperties:"*,supplier.name"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
                }
			};
		},
		initList:function(widget){
			return {
            	url : "api/housekeepinger/query",
				fetchProperties:"*,supplier.name",
				model:{
                    columns:[{
                        key:"name",
                        name:"姓名",
                    	format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
							} 
						}]
                    },{
						key:"birthday",
						name:"年龄",
						format:"age"
					},{
						key:"phone",
						name:"电话" 
					},{
						key:"supplier.name",
						name:"公司"
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
								widget.del("api/housekeepinger/" + data.pkHousekeepinger + "/delete");
							}
						}]
					}]
				}
            };
		},
		initCard:function(widget){
			return {
                saveaction:function(){
                	widget.save("api/housekeepinger/save",$("#housekeepinger").serialize(),function(data){
                		if(data.pkHousekeepinger){
                			widget.get("card").upload("api/attachment/housekeepingerphoto/"+data.pkHousekeepinger);
                		}
                		widget.get("list").refresh();
                	});
                },
                model:{
					id:"housekeepinger",
					items:[{
						title:"个人信息",
						icon:"user",
						img:{
							idAttribute:"pkHousekeepinger",
            				url:"api/attachment/housekeepingerphoto/",
						},
						children:[{
							name:"pkHousekeepinger",
							type:"hidden"
						},{
							name:"version",
							type:"hidden",
							defaultValue:"0"
						},{
							name:"name",
							label:"姓名",
							validate:["required"]
						},{
							name:"birthday",
							label:"出生日期",
							type:"date",
							mode:"Y-m-d"
						},{
							name:"phone",
							label:"电话"
						},{
							name:"supplier",	
							key:"pkSupplier",
							value:"name",	
							label:"所在公司",
							url:"api/supplier/query",
							params:{
								fetchProperties:"pkSupplier,name"
							},
							type:"select",
							validate:["required"]
						},{
							name:"description",
							label:"备注",
							type:"textarea"
						}]
					}]
				}
            };
		}
	});
	
    module.exports = Housekeepinger;
});