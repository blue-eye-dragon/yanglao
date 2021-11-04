define(function(require, exports, module){
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Form=require("form");
	var Subnav = require("subnav"); 
	var store =require("store");
	var Dialog=require("dialog-1.0.0");
	var Grid = require("grid");
	var activeUser = store.get("user");
	var enmu = require("enums");
	var contractmachineaccountcss=require("./contractmachineaccount.css");
	var template="<div class='el-contractmachineaccount'>"+
	 "<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>"+
	 "</div>";
	
	
	//是否为由数字组成的字符串 
	function is_digitals(str) 
	{ 
	var reg=/^[0-9]*$/;//匹配整数 
		if(reg.test(str)){
			 return true;
		}else{
			return false; 
		}
	} 
	//是大于0的整数 
	function Is_positive_num(str) 
	{ 
	var reg=/^\d+$/; 
	return reg.test(str); 
	} 

	
	var agreementmachineaccount = ELView.extend({
		events:{
		},
		attrs:{
        	template:template
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
        		parentNode:".J-subnav",
				model : {
					title:"合同记录",
					items : [{
						placeholder:"合同名称/合同相对方",
						id : "search",
						type : "search",
						handler : function(str) {
							var g = widget.get("grid");
							var subnav=widget.get("subnav");
							var obj={
									"contractcategoryset":subnav.getValue("contractcategoryset"),
									"department":subnav.getValue("department"),
									"agreementStartTime":subnav.getValue("agreementStartTime"),
									s:str,
									properties:"name,relative",
	            					fetchProperties:"pkContractMachineAccount,version," +
	            					"contractcategoryset.pkContractCategorySet," +
	            					"contractcategoryset.version," +
	            					"contractcategoryset.category," +
	            					"department.pkDepartment," +
	            					"department.version," +
	            					"department.name," +
	            					"reminduser.pkUser,reminduser.version,reminduser.name," +
	            					"user.pkUser,user.version,user.name," +
	            					"name," +
	    	        				"relative," +
	    	        				"agreementStartTime," +
	    	        				"agreementendTime," +
	    	        				"recordTime," +
	    	        				"advanceTime," +
	    	        				"description"
	    	        				};
							aw.ajax({
								url:"api/contractmachineaccount/search",
								data:obj,
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
					},{
						id:"department",
						tip:"部门名称",
						type:"buttongroup",
						url:"api/department/query",
						all:{
							show:true,
							first:true
						},
						keyField:"pkDepartment",
						params: function(){
							return{
								fetchProperties:"pkDepartment,name",	
							}
						},
						valueField:"name",
						handler:function(key,element){
							   widget.get("grid").refresh();
     				   }
					},{
						id:"contractcategoryset",
						tip:"合同类别",
						type:"buttongroup",
						url:"api/contractcategoryset/query",
						all:{
							show:true,
							first:true
						},
						keyField:"pkContractCategorySet",
						params: function(){
							return{
								fetchProperties:"pkContractCategorySet,category",	
							}
						},
						valueField:"category",
						handler:function(key,element){
							   widget.get("grid").refresh();
     				   }
					},{
						tip : "合同约定生效日",
						id:"agreementStartTime",
						type:"daterange",
						ranges : {
							"本年": [moment().startOf("year"),moment().startOf("year").add("year",1)],
						},
						defaultValue:"本年",
						handler:function(){
							widget.get("grid").refresh();
						},
					},{
						id:"add",
						text:"新增",
						type:"button",
						handler:function(){
							var form = widget.get("form");
							widget.get("form").reset();
							widget.get("form").setDisabled("recordTime",true);
							widget.show([".J-form"]).hide([".J-grid"]);
							widget.get("subnav").hide(["add","search","contractcategoryset","agreementStartTime","department"]).show(["return"]);
						}
					},{
						id:"return",
						type:"button",
						text:"返回",
						show : false,
						handler:function(){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").hide(["return"]).show(["add","search","contractcategoryset","agreementStartTime","department"]); 
						}
					}],
				}
        	});
        	this.set("subnav",subnav);      	
        	var grid=new Grid({
        		autoRender:false,
        		parentNode:".J-grid",
        		url : "api/contractmachineaccount/query",
        		params : function() {
    				var subnav=widget.get("subnav");
    				var obj={
    						"contractcategoryset":subnav.getValue("contractcategoryset"),
							"department":subnav.getValue("department"),
							"agreementStartTime":subnav.getValue("agreementStartTime").start,
							"agreementStartTimeEnd":subnav.getValue("agreementStartTime").end,
    						fetchProperties:"pkContractMachineAccount,version," +
        					"contractcategoryset.pkContractCategorySet," +
        					"contractcategoryset.version," +
        					"contractcategoryset.category," +
        					"department.pkDepartment," +
        					"department.version," +
        					"department.name," +
        					"reminduser.pkUser,reminduser.version,reminduser.name," +
        					"user.pkUser,user.version,user.name," +
        					"name,"+
	        				"relative,"+
	        				"agreementStartTime," +
	        				"agreementendTime," +
	        				"recordTime," +
	        				"advanceTime," +
	        				"description"
	        				};
    				return obj;
    			},
        		model : {
        			columns : [{
						key:"department.name",
						className:"departmentname",
						name:"部门名称"
					},{
						key:"name",
						className:"name",
						name:"合同名称",
						format:"detail",
						formatparams:{
							key:"name",
                            handler:function(index,data,rowEle){
                            	var grid=widget.get("grid");
								var form = widget.get("form");
								form.reset();
								form.setData(data);
								widget.get("form").setDisabled(true);
								widget.get("form").download("contractfile","api/attachment/contractmachineaccount/contractfile"+"_"+data.pkContractMachineAccount);
								widget.hide([".J-grid"]).show([".J-form"]);
								widget.get("subnav").hide(["add","search","contractcategoryset","agreementStartTime","department"]).show(["return"]);
                            }
						}
					},{
						key:"contractcategoryset.category",
						className:"contractcategorysetcategory",
						name:"合同类别"
					},{
        				key:"relative",
        				className:"relative",
        				name:"合同相对方"
					},{
        				key:"agreementStartTime",
        				className:"agreementStartTime",
        				name:"合同约定生效日",
        				format:"date",
        				formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
        				key:"agreementendTime",
        				className:"agreementendTime",
        				name:"合同约定终止日",
        				format:"date",
        				formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
        				key:"advanceTime",
        				className:"advanceTime",
        				name:"提前提醒天数",
					},{
        				key:"user.name",
        				className:"username",
        				name:"办理人",
					},{
						key:"operate",
						className:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"icon-edit",
							handler:function(index,data,rowEle){
								var grid=widget.get("grid");
								var form = widget.get("form");
								form.reset();
								form.setData(data);
								widget.get("form").download("contractfile","api/attachment/contractmachineaccount/contractfile"+"_"+data.pkContractMachineAccount);
								form.setDisabled("recordTime",true);
								form.setDisabled("department",true);
								form.setDisabled("user",true);
								form.download("contractfile","api/attachment/contractmachineaccount/contractfile"+"_"+data.pkContractMachineAccount);
								widget.hide([".J-grid"]).show([".J-form"]);
								widget.get("subnav").hide(["add","search","contractcategoryset","agreementStartTime","department"]).show(["return"]);
							}
						},{
							key:"delete",
							icon:"icon-remove",
							handler:function(index,data,rowEle){
								aw.del("api/contractmachineaccount/"+data.pkContractMachineAccount+"/delete",function() {
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
         			var form = widget.get("form");
         			var advanceTime=form.getValue("advanceTime");
         			widget.get("form").setValue("recordTime",moment().valueOf());
          			var data=$("#contractmachineaccount").serialize();
          			aw.saveOrUpdate("api/contractmachineaccount/save",data,function(data){
          				form.upload("contractfile","api/attachment/contractmachineaccount/contractfile"+"_"+data.pkContractMachineAccount);
          				widget.get("form").reset();
          				widget.hide([".J-form"]).show([".J-grid"]);
     					widget.get("subnav").show(["add","search","contractcategoryset","agreementStartTime","department"]).hide(["return"]);
     					widget.get("grid").refresh();
     				});
     			 },
     			 cancelaction:function(){
     				widget.get("form").reset();
     				widget.show([".J-grid"]).hide([".J-form"]);
     				widget.get("subnav").show(["add","search","contractcategoryset","agreementStartTime","department"]).hide(["return"]);
     				return false;
     			 },
	  			 model:{
	 				id:"contractmachineaccount",
					items:[{
							name:"pkContractMachineAccount",
							type:"hidden",
						},{
							name : "version",
							defaultValue : "0",
							type : "hidden"
						},{
							placeholder:"请选择",
							name:"department",
	                        type: "select",
	                        label: "部门名称",
	                        url:"api/department/query",
	                        key:"pkDepartment",
	                        params:function(){
								fetchProperties:"pkDepartment,name"
							},
							value:"name",
	                        validate:["required"]   
						},{
							placeholder:"请选择",
							name:"contractcategoryset",
	                        type: "select",
	                        label: "合同类别",
	                        url:"api/contractcategoryset/query",
	                        key:"pkContractCategorySet",
	                        params:function(){
								fetchProperties:"pkContractCategorySet,category"
							},
							value:"category",
	                        validate:["required"]   
						},{
							name:"name",
							label:"名称",
							validate:["required"],
							exValidate: function(value){
								if(value.length>30){
									return "名称不能超过30个字";
								}else{
									return true;
								}
							}
						},{
							name:"relative",
							label:"合同相对方",
							validate:["required"],
							exValidate: function(value){
								if(value.length>30){
									return "合同相对方不能超过30个字";
								}else{
									return true;
								}
							}
						},{
							name:"agreementStartTime",
							label:"合同约定生效日",
							type:"date",
							mode:"YYYY-MM-DD",
							defaultValue:moment().format("YYYY-MM-DD"),
							validate:["required"]
						},{
							name:"agreementendTime",
							label:"合同约定终止日",
							type:"date",
							mode:"YYYY-MM-DD",
							defaultValue:moment().format("YYYY-MM-DD"),
							validate:["required"]
						},{
							name:"advanceTime",
							label:"提前提醒天数",
							exValidate:function(value){
								if (is_digitals(value) ==false){
									 return "提前提醒天数只能输入正整数";
								}else{
									 return true;
								}
							},
						},{
							placeholder:"请选择提醒给谁",
							name:"reminduser",
	                        type: "select",
	                        label: "提醒给",
	                        url:"api/elcmsuser/query",
	                        key:"pkUser",
	                        params:function(){
								fetchProperties:"pkUser,name"
							},
							value:"name",
							multi : true,
	                        validate:["required"]   
						},{
							name:"contractfile", 
							label:"文件",
							type:"file",
							placeholder : "不能大于4M（4096KB）",
							maxSize : 4,
							validate:["required"]
						},{
							name:"user",
	                        type: "select",
	                        label: "办理人",
	                        url:"api/elcmsuser/query",
	                        key:"pkUser",
	                        params:function(){
								fetchProperties:"pkUser,name"
							},
							value:"name",
	                        validate:["required"]   
						},{
							name:"recordTime",
							label:"记录时间",
							type:"date",
							mode:"YYYY-MM-DD HH:mm:ss",
							defaultValue:moment().format("YYYY-MM-DD HH:mm:ss"),
						},{
							name:"description",
							label:"描述",
							type:"textarea",
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
		},
		afterInitComponent:function(params,widget){
			if(params&&params.modelId){
				 widget.get("grid").refresh({
					 "pkContractMachineAccount":params?params.modelId:"",
					 fetchProperties:"pkContractMachineAccount,version," +
	 					"contractcategoryset.pkContractCategorySet," +
	 					"contractcategoryset.version," +
	 					"contractcategoryset.category," +
	 					"department.pkDepartment," +
	 					"department.version," +
	 					"department.name," +
	 					"reminduser.pkUser,reminduser.version,reminduser.name," +
	 					"user.pkUser,user.version,user.name," +
	 					"name,"+
	     				"relative,"+
	     				"agreementStartTime," +
	     				"agreementendTime," +
	     				"recordTime," +
	     				"advanceTime," +
	     				"description"
				 })
			}else{
				widget.get("grid").refresh();
			}
		}
	});
	module.exports = agreementmachineaccount;	
});
