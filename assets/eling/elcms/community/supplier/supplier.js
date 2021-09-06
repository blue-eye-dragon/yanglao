define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Company = BaseView.extend({
		initSubnav:function(){
			return {
				model:{
					title:"服务商公司档案"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/supplier/query",
				model:{
					columns:[{
						key:"name",
						name:"公司名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							} 
						}]
					},{
						key:"supplierType",
						name:"公司类型"
					},{
						key:"small",
						name:"是否小型服务商",
						format:function(value,row){
							if(row.small){
								return '是';
							}else{
								return '否';
							}
                        },
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
								widget.edit("edit",data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/supplier/" + data.pkSupplier + "/delete");
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					widget.save("api/supplier/save",$("#supplier").serialize());
				},
				model:{
					id:"supplier",
					items:[{
						name:"pkSupplier",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},
					{
						name:"name",
						label:"公司名称",
						validate:["required"]
					   
					},{
						name:"supplierType",
						label:"公司类型"
					},{
						name : "small",
                        type : "radiolist",
                        label : "是否小型服务商",
                        list : [{
                            key : true,
                            value : "是"
                        },{
                            key : false,
                            value : "否"
                        }]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = Company;
});