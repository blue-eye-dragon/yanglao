define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var Department = BaseView.extend({
		events:{	
			"click .J-edit":function(e){
				//1.拿到这一行的数据
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				//2.verform.setData方法
				this.get("card").setData(data);
				//3.隐藏列表显示卡片
				$(".J-card,.J-return").removeClass("hidden");
				$(".J-list,.J-add").addClass("hidden");
			},
			"click .J-delete":function(e){
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				aw.del("api/department/" + data.pkDepartment + "/delete",function(data){
					grid.refresh();
				});
			},
			"click .J-seal1":function(e){
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				aw.saveOrUpdate("api/department/" + data.pkDepartment + "/seal",data,function(data){
					grid.refresh();
				});
			}
		},
		
		initSubnav:function(){
			return {
				model:{
					title:"部门信息维护"
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/department/querynew",
				fetchProperties:"*,organization.name,manager.name",
				model:{
					columns:[{
						key:"organization.name",
						name:"所属机构"
					},{
						key:"code",
						name:"编码"
							
					},{
						key:"name",
						name:"名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},{
						key:"manager.name",
						name:"负责人" 
					},{
						key:"seal",
						name:"封存",
						format:function(value,row){
							return value ? "是" : "否";
						}
					},{
						key:"seal",
						name:"操作",
						format:function(value,row){
							if(value){
								var ret = "<div>" + 
							 	"<a style='margin-left:5px;color:white;background:green' href='javascript:void(0);' class='J-seal1 btn btn-xs' ><i class='icon-briefcase' ></i></a>" +  
	                            "</div>"; 
							 return ret;  
							}else{
								 var ret1 = "<div>" +  
 	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-edit btn btn-xs' ><i class='icon-edit' ></i></a>" +  
 	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-delete btn btn-xs' ><i class='icon-remove' ></i></a>" +  
 	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-seal1 btn btn-xs' ><i class='icon-briefcase' ></i></a>" +  
 	                            "</div>"; 
					          return ret1;  
							}
    					}
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					widget.save("api/department/add",$("#department").serialize());
				},
				model:{
					id:"department",
					items:[{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"pkDepartment",
						type:"hidden"
					},{
						name:"seal",
						type:"hidden"
					},{
						name:"code",
						label:"编码",
						validate:["required"]
					},{
						name:"name",
						label:"名称",
						validate:["required"]
					},{
						label:"所属机构",
						name:"organization",
						type:"select",
						url:"api/organization/query",
						key:"pkOrganization",
						value:"name",
						validate:["required"]
					},{
						label:"负责人",
						name:"manager",
						key:"pkUser",
        				type:"select",
        				url:"api/users",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name"
						},
        				value:"name",
//        				validate:["required"]	
					},{
						name:"description",
						label:"描述",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = Department;
});