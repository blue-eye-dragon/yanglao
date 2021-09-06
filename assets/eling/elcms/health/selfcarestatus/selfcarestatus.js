define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Organization = BaseView.extend({
		initSubnav:function(){
			return {
				model:{
					 title:"自理状态"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/selfcare/query",
				model:{
                    columns:[{
                        key:"name",
                        name:"状态名称",
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
                        name:"状态描述"
                    },{
                        name:"操作",
                        format:"button",
                        formatparams:[{
	                        key:"edit",
	                        icon:"edit",
	                        handler:function(index,data,rowEle){
	                        	widget.edit("edit",data);
                                return false;
                            }
                        },{
                            key:"delete",
                            icon:"remove",
                            handler:function(index,data,rowEle){
                            	widget.del("api/selfcare/" + data.pkSelfCare + "/delete");
                            	return false;
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
					widget.save("api/selfcare/save",$("#selfCare").serialize());
				},
				model:{
					id:"selfCare",
					items:[{
						name:"pkSelfCare",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"状态名称",
						validate:["names"],
						validate:["required"]
					},{
						name:"description",
						label:"状态描述",
						type:"textarea",
						validate:["description"]
					}]
				}
			};
		}
	});
	module.exports = Organization;
});