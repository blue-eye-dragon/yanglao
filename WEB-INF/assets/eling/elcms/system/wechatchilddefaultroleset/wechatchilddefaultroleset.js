define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Dialog=require("dialog");
	 var template="<div class='J-subnav'></div>"+
		"<div class='J-grid' ></div>";
	var wechatchilddefaultroleset = ELView.extend({
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
				 title:"微信子女端默认权限控制",
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
					 id:"showAllMenu",
					 text:"显示全部",
					 type:"button",
					 handler : function() {
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
	    								url:"api/wechatchildmenuitem/updateisdefault",
	    								type:"POST",
	    								data:{
	    									pkWeChatChildMenuItems:pkWeChatChildMenuItems
	    								},
	    								success:function(data){
	    									$(".actions").find(".btn").attr("disabled","disabled");
	    									if(data.msg){
	    	        							Dialog.alert({
	    	        								content:data.msg
	    	        							});
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
	    	        							return;
	    	        						}
	    								}
	    							});
	    						}else{
	    							Dialog.alert({
        								content:"请选择菜单再保存"
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
   		$(".actions").find(".btn").attr("disabled","disabled");
   		this.get("grid").refresh(null,function(datas){
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
	});
	module.exports = wechatchilddefaultroleset
});