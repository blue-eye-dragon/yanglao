define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid = require("grid-1.0.0");
    var Dialog=require("dialog-1.0.0");
	var template="<div class='J-subnav'></div>"+
	 	"<div class='J-grid'></div>"+
	 	"<div class='J-addGrid hidden'></div>";

    var specialpermit = ELView.extend({
        attrs:{
        	template:template
        },
        initComponent:function(params,widget){
            var subnav=new Subnav({
            	parentNode:".J-subnav",
            	model:{
            	   	title:"特批权限设置",
					buttons:[{
   						id:"specialpermitAdd",
						text:"新增",
						show:true,
						handler:function(){
							$(".J-grid,.J-specialpermitAdd").addClass("hidden");
							$(".J-addGrid,.J-permitSave,.J-return").removeClass("hidden");
							return false;
						}
					},{
						id:"permitSave",
						text:"特批权限",
						show:false,
						handler:function(){
							var arr=widget.get("userGrid").getSelectedData();
							var pkUsers="";
							for(var i=0;i<arr.length;i++){
								pkUsers+="pkUser="+arr[i].pkUser+"&";
							}
							if(pkUsers==""){
								Dialog.tip({
									title:"请选中添加人员!"
								});
                      	    }else{
                                 aw.ajax({
                                     url : "api/specialpermit/specialpermitAdd?"+pkUsers, 	
                                     type : "POST",
                                     success : function(data){
	        							$(".J-return,.J-permitSave,.J-addGrid").addClass("hidden");
	        							$(".J-grid,.J-specialpermitAdd").removeClass("hidden");
	        							widget.get("grid").refresh();
	        							widget.get("userGrid").refresh();
                                     }
                                 });
                      	    }
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
    						$(".J-return,.J-addGrid,.J-permitSave").addClass("hidden");
    						$(".J-grid,.J-specialpermitAdd").removeClass("hidden");
						}
  					}]
                }
			});
			this.set("subnav",subnav);
    			
			var grid=new Grid({	                        
				parentNode:".J-grid",
				url:"api/specialpermit/query",
				fetchProperties:"*,user.*,user.organization.name,user.roles.name,user.department.name,user.community.name,permit",
    				model:{
                    columns:[{
						key : "user.code",
						name : "用户名"
                    },{
						key:"user.name",
						name : "姓名"
                    },{
                    	key :"user.organization.name",
                    	name : "所属机构"
                    },{
						key : "permit",
						name : "是否有特批权限",
						className:"nopadding",
						format : function(value, row) {
							return value ? "是" : "否";
						}
					},{
						key : "operate",
						name : "操作",
						format : "button",
						formatparams : [{
							key : "delete",
							icon : "remove",
							handler : function(index,data,rowEle) {
								aw.del("api/specialpermit/"+ data.pkSpecialPermit+ "/delete",function(){
									widget.get("grid").refresh();
								});
								return false;
							}
						}]
					}]
                }
			});
			this.set("grid",grid);
                
    			//添加特批权限人员
			var userGrid=new Grid({
				parentNode:".J-addGrid",
				url:"api/specialpermit/userquery",
				fetchProperties:"*,organization.name,roles.name,department.name,community.name,pkUser",
				model:{
					isCheckbox:true,
					columns:[{
						key:"code",
						name:"用户名"
					},{
						key:"name",
						name:"姓名"
					},{
						key:"organization.name",
						name:"所属机构"
					},{
						key:"role",
						name:"所属角色",
						className:"nopadding",
						format:function(cell,row){
							if(row.roles[0]){
								return row.roles[0].name;
							}else{
								return "";
							}
						}
					}]
				}
			});
			this.set("userGrid",userGrid);
        }
    });
    module.exports = specialpermit;	
});