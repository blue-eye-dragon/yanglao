define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var PaperType = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					 title:"证件类型",
					 search : function(str) {
							var g=widget.get("list");
							g.loading();
							aw.ajax({
								url:"api/papertype/search",
								data:{
									s:str,
									searchProperties:"name,description,status",
									fetchProperties:"*,version",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
									widget.list2Card(false);
								}
							});
						},
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/papertype/query",
				fetchProperties:"*,version",
				model:{
                    columns:[{
                        key:"name",
                        name:"证件名称",
                        format:"detail",
                        formatparams:[{
                            key:"detail",
                            handler:function(index,data,rowEle){
                            	widget.get("card").reset();
                            	widget.edit("detail",data);
                                return false;
                            }
                       }]
                    },{
                        key:"description",
                        name:"证件描述"
                    },{
    					key:"status.value",
						name:"状态"
					},{
						key:"operate",
						className:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							text:"修改",
							handler:function(index,data,rowEle){
								var form= widget.get("card");
    							var subnav= widget.get("subnav");
    							form.reset();
								form.setData(data);
    							widget.show([".J-card"]).hide([".J-list"]);
    							subnav.show(["return"]).hide(["add"]);
							}
						},{
							key:"inuse",
							text:"启用",
							show:function(value,row){								
								if(row.status.key=='Disused'){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否确认启用证件类型？",
									confirm:function(){
										data.status='InUse';
        								aw.saveOrUpdate("api/papertype/save",data,function(data){
        	        						widget.get("list").refresh();
        	        					});
									}
								});
							}
						},{
							key:"disused",
							text:"停用",
							show:function(value,row){
								if(row.status.key=='InUse'){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否确认停用证件类型？",
									confirm:function(){
										data.status='Disused';
        								aw.saveOrUpdate("api/papertype/save",data,function(data){
        	        						widget.get("list").refresh();
        	        					});
									}
								});
							}
						},{
							key:"delete",	
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/papertype/" + data.pkPaperType + "/delete",function(){
									widget.get("list").refresh();
								});
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
					widget.save("api/papertype/save",$("#PaperType").serialize());
				},
				model:{
					id:"PaperType",
					items:[{
						name:"pkPaperType",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"证件名称",
						validate:["names"],
						validate:["required"]
					},{
						name:"description",
						label:"证件描述",
						type:"textarea",
						validate:["description"]
					},{
						name :"status",
						defaultValue:"InUse",
						type:"hidden",
					}]
				}
			};
		}
	});
	module.exports = PaperType;
});