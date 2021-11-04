define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Dialog=require("dialog");
	 var template="<div class='J-subnav'></div>"+
		"<div class='J-grid' ></div>";
	var wechatchildroleset = ELView.extend({
	 attrs:{
        template:template
	 },
	 events : {
		 "click .J-grid-checkbox":function(e){
			 $(".actions").find(".btn").removeAttr("disabled");
		 },
		 "click thead>tr>th>input" : function(e){
			 $(".actions").find(".btn").removeAttr("disabled");
			 $(".J-grid-table tr").each(function () {
				 if($(this).find(".J-grid-checkbox").prop("disabled") == true){
					 $(this).find(".J-grid-checkbox").prop("checked", true)
				 }
		     });
		 }
	 },
   	 initComponent : function(params,widget) {
   		var subnav=new Subnav({
   			parentNode:".J-subnav",
			model:{
				 title:"微信子女端权限控制",
				 items:[{
					id:"searchCode",
					type:"search",
					placeholder : "搜索",
					handler : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/wechatchildmenuitem/search",
							data:{
								s:str,
								properties:"code,display",
								fetchProperties:"pkWeChatChildMenuItem,display,code,isDefault",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								$(".J-grid-table tr").each(function (i,el) {
									if(data[i].isDefault == true){
										if(data[i].code.length == 2){
											$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
										}else{
											$(this).find(".J-grid-checkbox").prop("checked", true)
										}
									}
								});
							}
						});
					},
				 },{
                     id : "building",
                     type : "buttongroup",
					 handler:function(key,element){
						 widget.get("subnav").load({
							 id:"defaultMembers",
							 url:"api/member/query",
							 params : {
									"memberSigning.room.building" : key,
									"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
									"memberSigning.status":"Normal",
									"memberSigning.houseingNotIn":false,
									fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number,status",
							 },
							 callback : function(data) {
								 aw.ajax({
		             					url:"api/wcchildmenumember/query",
		             					type:"POST",
		             					data:{
		             					    fetchProperties:"member.pkMember,weChatChildMenuItem.pkWeChatChildMenuItem,weChatChildMenuItem.display,weChatChildMenuItem.code,weChatChildMenuItem.isDefault",
		             						"member.pkMember":widget.get("subnav").getValue("defaultMembers")
		             					},
		             					success:function(data){
		             						if(data.length>0){
		               							$(".J-grid-table tr").each(function (index,item) {
		               	   							for(var i=0;i<data.length;i++){
		               	   								if($(this).children('td').eq(1).find("pre").html()==data[i].weChatChildMenuItem.code){
		               	   									$(this).find(".J-grid-checkbox").prop("checked", true);
		               	   								}
		               	   							if($(this).children('td').eq(1).find("pre").html().length==2){
		               	   							$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
		               	   							    }
		               	   							}
		               	   				        });
		               						}
		               						else{
		               							widget.get("grid").refresh(null,function(datas){
		               					   			$(".J-grid-table tr").each(function (i,el) {
		               					   				if(datas[i].isDefault == true){
		               					   					if(datas[i].code.length == 2){
		               					   						$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
		               					   					}else{
		               					   						$(this).find(".J-grid-checkbox").prop("checked", true)
		               					   					}
		               					   				}
		               					   	        });
		               					   	   	});
		               						}
		             					}
			             	   	  });	
							 }
						 });
	             		      	
					 }
                 },{
                	 id:"defaultMembers",
                	 type:"buttongroup",
                	 handler:function(key,element){
                		 widget.get("grid").refresh(null,function(){
                		      	aw.ajax({
                					url:"api/wcchildmenumember/query",
                					type:"POST",
                					data:{
                					    fetchProperties:"member.pkMember,weChatChildMenuItem.pkWeChatChildMenuItem,weChatChildMenuItem.display,weChatChildMenuItem.code,weChatChildMenuItem.isDefault",
                						"member.pkMember":key
                					},
                					success:function(data){
                						if(data.length>0){
                   							$(".J-grid-table tr").each(function (index,item) {
                   	   							for(var i=0;i<data.length;i++){
                   	   								if($(this).children('td').eq(1).find("pre").html()==data[i].weChatChildMenuItem.code){
                   	   									$(this).find(".J-grid-checkbox").prop("checked", true);
                   	   								}
                   	   							if($(this).children('td').eq(1).find("pre").html().length==2){
                   	   							$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
                   	   							    }
                   	   							}
                   	   				        });
                   						}
                   						else{
//                   							widget.get("grid").refresh(null,function(datas){
//				   					   			$(".J-grid-table tr").each(function (i,el) {
//				   					   				if(datas[i].isDefault == true){
//				   					   					if(datas[i].code.length == 2){
//				   					   						$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
//				   					   					}else{
//				   					   						$(this).find(".J-grid-checkbox").prop("checked", true)
//				   					   					}
//				   					   				}
//				   					   	        });
//				   					   	   	});
				   							aw.ajax({
				   								url:"api/wechatchildmenuitem/query",
	        				   					type:"POST",
	        				   					data:{
	        				   						"enabled":"true",
	        				                    	fetchProperties:"pkWeChatChildMenuItem,display,code,isDefault",
	        				   					},
	        				   					success:function(datas){
	        				   						$(".J-grid-table tr").each(function (i,el) {
    				   					   				if(datas[i].isDefault == true){
    				   					   					if(datas[i].code.length == 2){ 
    				   					   						$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
    				   					   					}else{
    				   					   						$(this).find(".J-grid-checkbox").prop("checked", true)
    				   					   					}
    				   					   				}
    				   					   	        });
	        				   					}
				   							})
                   						}
                					}
                			  });
                	   	  });
                	 }
                 },{
					 id:"showAllMenu",
					 text:"显示全部",
					 type:"button",
					 handler : function() {
						 widget.get("grid").refresh(null,function(){
				   		      	aw.ajax({
				   					url:"api/wcchildmenumember/query",
				   					type:"POST",
				   					data:{
				   					    fetchProperties:"member.pkMember,weChatChildMenuItem.pkWeChatChildMenuItem,weChatChildMenuItem.display,weChatChildMenuItem.code,weChatChildMenuItem.isDefault",
				   						"member.pkMember":widget.get("subnav").getValue("defaultMembers")
				   					},
				   					success:function(data){
				   						if(data.length>0){
				   							$(".J-grid-table tr").each(function (index,item) {
				   	   							for(var i=0;i<data.length;i++){
				   	   								if($(this).children('td').eq(1).find("pre").html()==data[i].weChatChildMenuItem.code){
				   	   									$(this).find(".J-grid-checkbox").prop("checked", true);
				   	   								}
				   	   							if($(this).children('td').eq(1).find("pre").html().length==2){
				   	   							$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
				   	   							    }
				   	   							}
				   	   				        });
				   						}
				   						else{
//				   							widget.get("grid").refresh(null,function(datas){
//				   					   			$(".J-grid-table tr").each(function (i,el) {
//				   					   				if(datas[i].isDefault == true){
//				   					   					if(datas[i].code.length == 2){
//				   					   						$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
//				   					   					}else{
//				   					   						$(this).find(".J-grid-checkbox").prop("checked", true)
//				   					   					}
//				   					   				}
//				   					   	        });
//				   					   	   	});
				   							aw.ajax({
				   								url:"api/wechatchildmenuitem/query",
	        				   					type:"POST",
	        				   					data:{
	        				   						"enabled":"true",
	        				                    	fetchProperties:"pkWeChatChildMenuItem,display,code,isDefault",
	        				   					},
	        				   					success:function(datas){
	        				   						$(".J-grid-table tr").each(function (i,el) {
    				   					   				if(datas[i].isDefault == true){
    				   					   					if(datas[i].code.length == 2){ 
    				   					   						$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
    				   					   					}else{
    				   					   						$(this).find(".J-grid-checkbox").prop("checked", true)
    				   					   					}
    				   					   				}
    				   					   	        });
	        				   					}
				   							})
				   						}
				   					}
				   			  });
				   	   	  });
					 }
				 }]
			}
   		});
   		this.set("subnav",subnav);
   		
   		var grid = new Grid({
   			parentNode:".J-grid",
   			autoRender:false,
   			model : {
   				url:"api/wechatchildmenuitem/query",
   				isInitPageBar:false,
   				params : function(){
                    return {
                    	"enabled":"true",
                    	fetchProperties:"pkWeChatChildMenuItem,display,code,isDefault",
                    };
                },
                isCheckbox:true,
                head : {
                    buttons : [{
                        id : "save",
                        icon:"icon-save",
                        handler : function(){
                        	var pkWeChatChildMenuItem=widget.get("grid").getSelectedData();
	  							if(pkWeChatChildMenuItem.length!=0){ 
	  								var pkWeChatChildMenuItems="";
		                         	for(var i=0; i<pkWeChatChildMenuItem.length;i++){
		                         		pkWeChatChildMenuItems+=pkWeChatChildMenuItem[i].pkWeChatChildMenuItem+",";
		                         	}
	    							aw.ajax({
	    								url:"api/wcchildmenumember/updatemembermenu",
	    								type:"POST",
	    								data:{
	    									pkWeChatChildMenuItems:pkWeChatChildMenuItems,
	    									pkMember:widget.get("subnav").getValue("defaultMembers")
	    								},
	    								success:function(data){
	    									$(".actions").find(".btn").attr("disabled","disabled");
	    									if(data.msg){
	    	        							Dialog.alert({
	    	        								content:data.msg
	    	        							});
	    	        							window.setTimeout(function(){
	    	        								widget.get("grid").refresh(null,function(){
		    	        				   		      	aw.ajax({
		    	        				   					url:"api/wcchildmenumember/query",
		    	        				   					type:"POST",
		    	        				   					data:{
		    	        				   					    fetchProperties:"member.pkMember,weChatChildMenuItem.pkWeChatChildMenuItem,weChatChildMenuItem.display,weChatChildMenuItem.code,weChatChildMenuItem.isDefault",
		    	        				   						"member.pkMember":widget.get("subnav").getValue("defaultMembers")
		    	        				   					},
		    	        				   					success:function(data){
		    	        				   						if(data.length>0){
		    	        				   							$(".J-grid-table tr").each(function (index,item) {
		    	        				   	   							for(var i=0;i<data.length;i++){
		    	        				   	   								if($(this).children('td').eq(1).find("pre").html()==data[i].weChatChildMenuItem.code){
		    	        				   	   									$(this).find(".J-grid-checkbox").prop("checked", true);
		    	        				   	   								}
		    	        				   	   							if($(this).children('td').eq(1).find("pre").html().length==2){
		    	        				   	   							$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
		    	        				   	   							    }
		    	        				   	   							}
		    	        				   	   				        });
		    	        				   						}
		    	        				   						else{
//		    	        				   							widget.get("grid").refresh(null,function(datas){
//		    	        				   					   			$(".J-grid-table tr").each(function (i,el) {
//		    	        				   					   				if(datas[i].isDefault == true){
//		    	        				   					   					if(datas[i].code.length == 2){
//		    	        				   					   						$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
//		    	        				   					   					}else{
//		    	        				   					   						$(this).find(".J-grid-checkbox").prop("checked", true)
//		    	        				   					   					}
//		    	        				   					   				}
//		    	        				   					   	        });
//		    	        				   					   	   	});
		    	        				   							aw.ajax({
		    	        				   								url:"api/wechatchildmenuitem/query",
		    	        	        				   					type:"POST",
		    	        	        				   					data:{
		    	        	        				   						"enabled":"true",
		    	        	        				                    	fetchProperties:"pkWeChatChildMenuItem,display,code,isDefault",
		    	        	        				   					},
		    	        	        				   					success:function(datas){
		    	        	        				   						$(".J-grid-table tr").each(function (i,el) {
		    	            				   					   				if(datas[i].isDefault == true){
		    	            				   					   					if(datas[i].code.length == 2){ 
		    	            				   					   						$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
		    	            				   					   					}else{
		    	            				   					   						$(this).find(".J-grid-checkbox").prop("checked", true)
		    	            				   					   					}
		    	            				   					   				}
		    	            				   					   	        });
		    	        	        				   					}
		    	        				   							})
		    	        				   						}
		    	        				   					}
		    	        				   			  });
		    	        				   	   	  });
	    	        				            },1500);
	    	        				   			
	    	        				        
	    	        							return;
	    	        						}
	    								}
	    							});
	    						}else{
	    							Dialog.alert({
        								content:"请选择菜单再保存！"
        							});
        							return;
	      						}
                        }
                    }]
                },
                columns : [{
                	name : "code",
                    label : "菜单编码"
                },{
                	name : "display",
                    label : "菜单名称"
                }]
   			}
   		}); 
   		this.set("grid",grid);
   	 },
   	 afterInitComponent:function(params,widget){
   		var subnav = widget.get("subnav");
   		var pkBuilding = subnav.getValue("building");
   		subnav.load({
   			id:"defaultMembers",
   			url:"api/member/query",
			params : {
				"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
				"memberSigning.status":"Normal",
				"memberSigning.houseingNotIn":false,
				"memberSigning.room.building" : pkBuilding,
				fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number,status",
			},
			callback : function(data) {
				
			}
		});
   		$(".actions").find(".btn").attr("disabled","disabled");
   		window.setTimeout(function(){
   			widget.get("grid").refresh(null,function(){
   		      	aw.ajax({
   					url:"api/wcchildmenumember/query",
   					type:"POST",
   					data:{
   					    fetchProperties:"member.pkMember,weChatChildMenuItem.pkWeChatChildMenuItem,weChatChildMenuItem.display,weChatChildMenuItem.code,weChatChildMenuItem.isDefault",
   						"member.pkMember":widget.get("subnav").getValue("defaultMembers")
   					},
   					success:function(data){
   						if(data.length>0){
   							$(".J-grid-table tr").each(function (index,item) {
   	   							for(var i=0;i<data.length;i++){
   	   								if($(this).children('td').eq(1).find("pre").html()==data[i].weChatChildMenuItem.code){
   	   									$(this).find(".J-grid-checkbox").prop("checked", true);
   	   								}
   	   							if($(this).children('td').eq(1).find("pre").html().length==2){
   	   							$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
   	   							    }
   	   							}
   	   				        });
   						}
   						else{
   							widget.get("grid").refresh(null,function(datas){
   					   			$(".J-grid-table tr").each(function (i,el) {
   					   				if(datas[i].isDefault == true){
   					   					if(datas[i].code.length == 2){
   					   						$(this).find(".J-grid-checkbox").prop("checked", true).prop("disabled",true);
   					   					}else{
   					   						$(this).find(".J-grid-checkbox").prop("checked", true)
   					   					}
   					   				}
   					   	        });
   					   	   	});
   						}
   					}
   			  });
   	   	  });
        },500);
   	 }
	});
	module.exports = wechatchildroleset
});