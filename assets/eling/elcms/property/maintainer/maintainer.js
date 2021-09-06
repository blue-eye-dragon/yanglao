define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	
	var Maintainer=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"维修工档案",
					buttons:[{
						id:"adds",
						text:"新增",
						handler:function(){
							widget.get("card").reset();
							widget.get("subnav").show("return").hide("adds");
							widget.show(".J-card").hide(".J-list,.J-search");
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-list,.J-search").hide(".J-card");
							widget.get("subnav").show(["adds"]).hide(["return"]);
							return false;
						}
					}],
					search:function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/maintainer/search",
							data:{
								s:str,
								properties:"name,supplier.name,birthday,phone",
								fetchProperties:"*,birthday,supplier.name"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					}
                }
			};
		},
		initList:function(widget){
			return {
				url : "api/maintainer/query",
				fetchProperties:"*,supplier.name",
				model:{
					columns:[{
                        key:"name",
                        name:"姓名",
                    	format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("subnav").show("return").hide("adds");
								widget.show(".J-card").hide(".J-list,.J-search");
								widget.edit("detail",data);
							} 
						}]
                    },{
						key:"birthday",
						name:"年龄",
						format:function(row,value){
							if(value.birthday){
								return moment().diff(value.birthday, 'years');
							}else{
								return "";
							}
						}
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
								widget.get("subnav").hide("adds");
								widget.show(".J-card").hide(".J-list,.J-search");
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/maintainer/" + data.pkMaintainer + "/delete");
							}
						}]
					}]
				}
            };
		},
		initCard:function(widget){
			return {
                saveaction:function(){
                	widget.save("api/maintainer/save",$("#maintainer").serialize(),function(data){
                		widget.get("list").refresh();
                		if(data.pkMaintainer){
                			widget.get("card").upload("api/attachment/maintainerphoto/"+data.pkMaintainer);
                		}
                	});
                	widget.get("subnav").show("adds").hide("return");
					widget.show(".J-search");
                },
                model:{
					id:"maintainer",
					items:[{
						title:"个人信息",
						icon:"user",
						img:{
							idAttribute:"pkMaintainer",
            				url:"api/attachment/maintainerphoto/",
						},
						children:[{
							name:"pkMaintainer",
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
								fetchProperties:"pkSupplier," +
								"name"
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
    module.exports = Maintainer;
});
