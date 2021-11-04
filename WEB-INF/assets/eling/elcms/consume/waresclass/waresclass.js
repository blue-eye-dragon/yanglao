/**
 * 商品/服务分类
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Form=require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
	var Grid=require("grid-1.0.0");
	
    var template="<div class='J-subnav'></div>"+
    		"<div class='J-grid ' ></div>"+
    		"<div class='J-waresclassform hidden' ></div>";
	
	var WaresClass = ELView.extend({
		events:{
			"change .J-form-waresclass-radiolist-ifCharge" : function(e){ 
				var  ifCharge = this.get("waresclassform").getValue("ifCharge");
				var  maxFees=this.get("waresclassform").getValue("maxFees");
				var  minFees=this.get("waresclassform").getValue("minFees");
				if(ifCharge){
					this.get("waresclassform").show("maxFees"); 
					this.get("waresclassform").show("minFees"); 
					if(maxFees){
						this.get("waresclassform").setValue("maxFees",maxFees);
					}else{
					   this.get("waresclassform").setValue("maxFees","");
					}
					if(minFees){
					   this.get("waresclassform").setValue("minFees",minFees);
					}else{
					   this.get("waresclassform").setValue("minFees","");	
					}
					this.get("waresclassform").setLabel("maxFees","收费上限");
					this.get("waresclassform").setLabel("minFees","收费下限");
				}else{
					this.get("waresclassform").hide("maxFees"); 
					this.get("waresclassform").hide("minFees"); 
				}
			}
		}, 
		attrs:{
			template:template
		},
		initComponent : function(params,widget) {
    		 var subnav=new Subnav({
    			 parentNode:".J-subnav",
    			 model:{
 					title:"商品/服务分类",
 					items:[{
 						     id:"search",
 						     type:"search",
 						     handler:function(str){ widget.get("grid").loading();
 							    aw.ajax({
 								url:"api/waresclass/search",
 								data:{
 									s:str,
 									properties:"code,name,ifCharge,maxFees,minFees,description,type", 
 								    fetchProperties:"code,name,ifCharge,maxFees,minFees,description,type" 
 								},
 								dataType:"json",
 								success:function(data){
 									widget.get("grid").setData(data);
 									widget.show(".J-grid,.J-adds").hide(".J-waresclassform,.J-return");
 								}
 							});
 						   }
 					},{
 						    id:"return",
	  						text:"返回",
	  						type:"button",
	  						show:false,
	  						handler:function(){
	  							widget.show(".J-grid,.J-adds,.J-search").hide(".J-waresclassform,.J-return");
	  							return false;
	  						}
 					},{
 						id:"adds",
 						text:"新增",
 						type:"button",
 						handler:function(){ 
 							$(".J-grid,.J-adds,.J-search").addClass("hidden");
 							$(".J-waresclassform,.J-return").removeClass("hidden");	    
 							widget.get("waresclassform").reset();	
 							var data ={
 									ifCharge:{key:"true",value:"是"},
 									type:{key:"Wares",value:"商品"}
 			 					};
 							widget.get("waresclassform").setData(data);
 							return false;
 	 						}				
 					}]
                 }
    		 });
    		 this.set("subnav",subnav);
    		 
    		 var grid=new Grid({
    			parentNode:".J-grid",
 				url :"api/waresclass/query",
 				fetchProperties:"*",
 				model:{
 					columns:[{
 						key:"code",
 						name:"编码"					
 					},{
 						key:"name",
 						name:"名称"					
 					},{
 						key:"ifCharge",
						name:"是否收费",
						format:function(value,row){
							return value ? "是" : "否";
						}
 					},{
 						key:"maxFees",
 						name:"收费上限",
 						format:function(value,row){
							if(value==""){
								return "无";
							}else{
								return value;
							}
						}
 					},{
 						key:"minFees",
 						name:"收费下限",
 						format:function(value,row){
							if(value==""){
								return "无";
							}else{
								return value;
							}
						}
 					},{
 						key:"type.value",
 						name:"类别"
 					},{
 						key:"description",  
 						name:"备注"
 					},{
						key:"operate",
						name:"操作", 	
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								$(".J-grid,.J-adds,.J-conditionform,.J-return,.J-search").addClass("hidden");
								$(".J-waresclassform").removeClass("hidden");
								widget.get("waresclassform").reset();
								if(data.ifCharge){
									widget.get("waresclassform").show("maxFees"); 
									widget.get("waresclassform").show("minFees"); 
									widget.get("waresclassform").setValue("maxFees",data.maxFees);
									widget.get("waresclassform").setValue("minFees",data.minFees);
									widget.get("waresclassform").setLabel("maxFees","收费上限");
									widget.get("waresclassform").setLabel("minFees","收费下限");
								}else{
									widget.get("waresclassform").hide("maxFees"); 
									widget.get("waresclassform").hide("minFees"); 
								}
								widget.get("waresclassform").setData(data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/waresclass/" + data.pkWaresClass + "/delete",function(){
		 	 						widget.get("grid").refresh();
		 	 					});
							}						
						}]
					
 					}]
 				}
    		 });
    		 this.set("grid",grid);
       
    		 //form表单
 			 var waresclassform=new Form({
				parentNode:".J-waresclassform",
			   	saveaction:function(){
		   			var data=$("#waresclass").serializeArray();
    				var maxFees = parseInt(data[4].value);				
					var minFees = parseInt(data[5].value);
					if(maxFees < minFees){
						Dialog.alert({
							content:"收费上限不能小于收费下限！"
						});
           		 	}else {
	           		 	aw.saveOrUpdate("api/waresclass/save",$("#waresclass").serialize(),function(){						
							widget.get("grid").refresh(); 
							widget.show(".J-grid,.J-adds,.J-search").hide(".J-waresclassform,.J-return");
						});
						}
					
					
					
					
					
 				},
				//取消按钮
  				cancelaction:function(){
					widget.show(".J-grid,.J-adds,.J-search").hide(".J-waresclassform,.J-return");
  				},
				model:{
					id:"waresclass",
					items:[{
						name:"code",
						label:"编码",
						validate:["required"]
					},{
						name:"name",
						label:"名称",
						validate:["required"]
					},{
						name:"type",
						label:"类别",
						type:"select",
						url:"api/enum/com.eling.elcms.consume.model.WaresClass.Type",
						validate:["required"]
					},{
						name:"ifCharge",
						label:"是否收费",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}],
						validate:["required"]
					},{
						name:"maxFees",
						label:"收费上限",
						validate:["required"]
					},{
						name:"minFees",
						label:"收费下限",
						validate:["required"]
					},{
						name:"description",
						label:"备注",
						type:"textarea" 
					},{
						name:"version", 
						defaultValue:"0",
						type:"hidden"
					},{
						name:"pkWaresClass",
						type:"hidden"
					}]
				}
			});
			this.set("waresclassform",waresclassform); 
    	 },
	});
	module.exports = WaresClass;
});
