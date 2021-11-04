define(function(require, exports, module){
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Form=require("form");
	var Subnav = require("subnav"); 
	var store =require("store");
	var Dialog=require("dialog");
	var Grid = require("grid");
	var activeUser = store.get("user");
	var enmu = require("enums");
	var contractcategorysetcss=require("./contractcategoryset.css");
	var template="<div class='el-contractcategoryset'>"+
	 "<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"+
	 "</div>";
	var agreementcategoryset = ELView.extend({
		events:{
		},
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
        		parentNode:".J-subnav",
				model : {
					title:"合同类别设置",
					items : [{
						id:"add",
						text:"新增",
						type:"button",
						handler:function(){
							var form = widget.get("form");
							widget.get("form").reset();
							widget.show([".J-form"]).hide([".J-grid"]);
							widget.get("subnav").hide(["add"]).show(["return"]);
						}
					},{
						id:"return",
						type:"button",
						text:"返回",
						show : false,
						handler:function(){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").hide(["return"]).show(["add"]); 
						}
					}],
				}
        	});
        	this.set("subnav",subnav);      	
        	var grid=new Grid({
        		parentNode:".J-grid",
        		url : "api/contractcategoryset/query",
        		params : function() {
    				var subnav=widget.get("subnav");
    				var obj={fetchProperties:"pkContractCategorySet,version," +
        					"category," +
        					"description"
	        				};
    				return obj;
    			},
        		model : {
        			columns : [{
						key:"pkContractCategorySet",
						className:"pkContractCategorySet",
						name:"序号"
					},{
        				key:"category",
        				className:"category",
        				name:"合同类别"
					},{
						key:"operate",
						className:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"icon-edit",
							show:function(value,row){
								if(row.category=="其他"){
									return false;
								}else{
									return true;
								}
							},
							handler:function(index,data,rowEle){
								var grid=widget.get("grid");
								var form = widget.get("form");
								form.reset();
								form.setData(data);
								widget.hide([".J-grid"]).show([".J-form"]);
								widget.get("subnav").hide(["add","search"]).show(["return"]);
							}
						},{
							key:"delete",
							icon:"icon-remove",
							show:function(value,row){
								if(row.category=="其他"){
									return false;
								}else{
									return true;
								}
							},
							handler:function(index,data,rowEle){
								aw.del("api/contractcategoryset/"+data.pkContractCategorySet+"/delete",function() {
									grid.refresh();
								});	
							}
						
						}]
					}]
    			}
    		 });
    		 this.set("grid",grid);
    		 
        	 var form=new Form({
         		 parentNode:".J-form",
         		 saveaction : function() {
          			var data=$("#contractcategoryset").serialize();
          			aw.saveOrUpdate("api/contractcategoryset/save",data,function(data){
          				widget.hide([".J-form"]).show([".J-grid"]);
     					widget.get("subnav").show(["add"]).hide(["return"]);
     					widget.get("grid").refresh();
     				});
     			 },
     			 cancelaction:function(){
     				 	widget.show([".J-grid"]).hide([".J-form"]);
     				 	widget.get("subnav").show(["add"]).hide(["return"]);
     					return false;
     			 },
	  			 model:{
	 				id:"contractcategoryset",
					items:[{
							name:"pkContractCategorySet",
							type:"hidden",
						},{
							name : "version",
							defaultValue : "0",
							type : "hidden"
						},{
							name:"category",
							label:"合同类别",
							validate:["required"],
							exValidate: function(value){
								if(value.length>30){
									return "合同类别不能超过30个字";
								}else{
									return true;
								}
							}
						},{
							name:"description",
							label:"描述",
							type:"textarea",
							validate:["required"],
							height:200,
							exValidate: function(value){
								if(value.length>1023){
									return "描述不能超过1023个字";
								}else{
									return true;
								}
							}
						}]
			    }
        	 });
        	 this.set("form",form);
		}
	});
	module.exports = agreementcategoryset;	
});
