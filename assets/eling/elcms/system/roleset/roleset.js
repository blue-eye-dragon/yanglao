define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	
	var RoleSet=BaseView.extend({
		initSubnav:function(widget){
			return {
				 model:{
					 title:"权限设置",
					 search:function(str) {
						 var g=widget.get("list");
						 g.loading();
						 aw.ajax({
							 url:"api/menuitem/search",
							 data:{
								 s:str,
								 properties:"display,code",
								 fetchProperties:"pkMenuItem,display,code",
							 },
							 dataType:"json",
							 success:function(data){
								 g.setData(data);
								 widget.list2Card(false);
							 }
						 });
					 },
					 buttons:[],
					 buttonGroup:[{
						 id:"role",
						 key:"pkRole",
						 value:"name",
						 url:"api/role/unadmin/query",
						 handler:function(key,element){
							 if(key){
								 aw.ajax({
									 url:"api/role/unadmin/query",
     								 type:"POST",
     								 data:{
     									 fetchProperties:"*,menuItems.pkMenuItem,menuItems.code,menuItems.display",
     									 pkRole:key
     								 },
     								 success:function(data){
     									 $(".J-grid-table").each(function(){
     										 $(".J-checkbox").prop("checked", false);
     									 });
     									 data=data[0].menuItems;
     									 $(".J-grid-table tr").each(function (index,item) {
     										 for(var i=0;i<data.length;i++){    											 
     											 if($(this).children('td').eq(1).find("pre").html()==data[i].code){
     											 	 $(this).find(":checkbox.J-checkbox").prop("checked", true);
     											 }
     										  }
     							         });
     								  }
     							 });
 							}else{
 								$(".J-grid-table").each(function () {
				                    $(".J-checkbox").prop("checked", false);
				                });
 							}
 					    }
 					}]
                }
			};
		},
		
		initList:function(widget){
			return {
				autoRender:false,
				url:"api/menuitem/querybyrole",
				isInitPageBar:false,
  				fetchProperties:"pkMenuItem,display,code",
  				model:{
  					isCheckbox:true,
  					head:{
  						buttons:[{
  							id:"add",
  							icon:"icon-save",
  							handler:function(){
  	  							var pkMenuItem=widget.get("list").getSelectedData();
  	  							if(pkMenuItem.length!=0){
  	  								var pkMenuItems="";
  		                         	for(var i=0; i<pkMenuItem.length;i++){
  		                         		pkMenuItems+=pkMenuItem[i].pkMenuItem+",";
  		                         	}
  	    							aw.ajax({
  	    								url:"api/role/privilege",
  	    								type:"POST",
  	    								data:{
  	    									pkRole:widget.get("subnav").getValue("role"),
  	    									pkMenuItems:pkMenuItems
  	    								},
  	    								success:function(data){
  	    									 Dialog.tip("保存成功");
  	    								}
  	    							});
  	    						}else{
  	    							Dialog.tip("请选择菜单再添加");
  	      						}
  	      					}
  						}]
      				},
                    columns:[{
  						key:"code",
  						name:"菜单编码"
  					},{
  						key:"display",
  						name:"菜单名称"
  					}]
      			}
			};
		},
		afterInitComponent:function(params,widget){
			this.get("list").refresh({},function(){
		      	aw.ajax({
					url:"api/role/unadmin/query",
					type:"POST",
					data:{
					    fetchProperties:"*,menuItems.pkMenuItem,menuItems.code,menuItems.display",
						pkRole:widget.get("subnav").getValue("role")
					},
					success:function(data){
					    $(".J-grid-table").each(function () {
		                    $(".J-checkbox").prop("checked", false);
		                });
						data=data[0].menuItems;
						$(".J-grid-table tr").each(function (index,item) {
							for(var i=0;i<data.length;i++){
								if($(this).children('td').eq(1).find("pre").html()==data[i].code){
									$(this).find(":checkbox.J-checkbox").prop("checked", true);
								}
							}
				        });
					}
			  });
	      });
		}
	});
	module.exports=RoleSet;
});