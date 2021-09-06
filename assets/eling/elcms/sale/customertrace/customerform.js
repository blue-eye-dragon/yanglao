/**
 * 意向客户追踪
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var Form =require("form-2.0.0")
	var customerform = {
			init:function(widget){
				return new Form({
					parentNode:".J-CustomerForm",
					model:{
						id:"customerForm",
						defaultButton:false,
						items:[{
							name:"pkCustomer",
							type:"hidden"
						},{
							name:"version",
							type:"hidden"
						},{
							className:{
								container:"col-md-6",
								label:"col-md-4"
							},
							name:"name",
							label:"姓名",
							readonly:true
						},{
							className:{
								container:"col-md-6",
								label:"col-md-4"
							},
							name:"cardType.name",
							label:"意向卡类型",
							readonly:true
						},{
							className:{
								container:"col-md-6",
								label:"col-md-4"
							},
							name:"phoneNumber",
							label:"联系电话",
							readonly:true
						},{
							className:{
								container:"col-md-6",
								label:"col-md-4"
							},
							name:"mobilePhone",
							label:"移动电话",
							readonly:true
						},{
							className:{
								container:"col-md-6",
								label:"col-md-4"
							},
							name:"qq",
							label:"QQ",
							readonly:true
						},{
							className:{
								container:"col-md-6",
								label:"col-md-4"
							},
							name:"wechat",
							label:"微信",
							readonly:true
						},{
							className:{
								container:"col-md-6",
								label:"col-md-4"
							},
							name:"email",
							label:"邮箱",
							readonly:true
						},{	
							className:{
								container:"col-md-6",
								label:"col-md-4"
							},
							name:"intention.value",
							label:"最终意向",
							readonly:true
						},{	
							className:{
								container:"col-md-6",
								label:"col-md-4"
							},
							name:"origin",
							label:"来源",
							readonly:true
						}]
					}
				});
			}
	}
	module.exports = customerform;	
});

