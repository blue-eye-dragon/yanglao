/**
 * 意向客户追踪
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var Form =require("form-2.0.0")
	
	var returnrecordform = {
			init:function(widget){
				return new Form({
				parentNode:".J-ReturnRecordForm",
			   	saveaction:function(){
    				var remindDate = moment(widget.get("returnrecordForm").getValue("remindDate")).valueOf();				
					var visitDate = moment(widget.get("returnrecordForm").getValue("visitDate")).valueOf();
                    if(remindDate < visitDate){
						Dialog.alert({  
							content:"提醒时间不能在来访日期之前！"
						});
           		 	}else {
						aw.saveOrUpdate("api/contactrecord/save?fetchProperties=*,customer.*,customer.cardType.name,visitWay.name",$("#contactrecord").serialize(),function(data){
							widget.get("returnrecordGrid").refresh(); 
							//修改后的值反应到列表中
							var array = [];
							array[0]=data.customer;
							widget.get("returnGrid").setData(array);
							$(".J-pkCustomer").attr("data-key",data.customer.pkCustomer);
							widget.show([".J-ReturnRecordGrid"]).hide([".J-ReturnGrid",".J-ReturnRecordForm"]);
							widget.get("subnav").show(["returnCustomer"]).hide(["search","intentionQuery","returnCount","time","returnRecord"]);															
						});
          		 	}
 				},
  				cancelaction:function(){
					widget.show([".J-ReturnGrid"]).hide([".J-ReturnRecordGrid",".J-ReturnRecordForm"]);
					widget.get("subnav").show(["search","intentionQuery","returnCount","time"]).hide(["returnCustomer","returnRecord"]);															
  				},
				model:{
					id:"contactrecord",
					items:[{
						name:"customer.pkCustomer", 
						type:"hidden"
					},{
						name:"customer.version", 
						defaultValue:"0",
						type:"hidden"
					},{
						name:"pkContactRecord",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"customer.name",
						label:"姓名",
						validate:["required"]
					},{
						name:"customer.origin",
						label:"来源"
					},{
						name:"customer.phoneNumber",
						label:"联系电话",
						validate:["required"]
					},{
						name:"customer.mobilePhone",
						label:"移动电话"
					},{
						name:"customer.qq",
						label:"QQ"
					},{
						name:"customer.wechat",
						label:"微信",
					},{
						name:"customer.email",
						label:"邮箱"
					},{
						name:"customer.status",
						defaultValue:"Purpose",
						type:"hidden"
					},{
						name:"customer.status.value",
						label:"状态",
						defaultValue:"意向中",
						readonly:true,
					},{
						type:"select",
						label:"意向卡类型",
						name:"customer.cardType",
						key:"pkMemberShipCardType",
						value:"name",
						url:"api/cardtype/query",
						validate:["required"]
					},{
						name:"intention",
						label:"意向",
						type:"select",
						url:"api/enum/com.eling.elcms.sale.model.Customer.Intention",
						validate:["required"]
					},{
						name:"visitDate",
						type:"date"	,
						label:"访问时间",
						defaultValue:moment(),
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"visitWay",
						key:"pkVisitWay",
						value:"name",
						label:"访问方式",
						validate:["required"],
						url:"api/visitway/query",
						params:{
							fetchProperties:"name,pkVisitWay"
						},
						type:"select"						
					},{
						name:"type.value",
						label:"访问类型"	,
						readonly:true
					},{
						name:"type",
						type:"hidden"					
					},{
						name:"content",
						label:"沟通内容",
						validate:["required"],
						type:"textarea",
						height:120
					},{
						name:"creator",
						label:"沟通人",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/users",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name"
						},
						multi:false,
						validate:["required"]
					},{
						name:"remindDate",
						label:"回访提醒时间",
						type:"date"				
					},{
						name:"description",
						label:"备注",
						type:"textarea" 
					}]
				}
			});
        }
	}
	module.exports = returnrecordform;	
});

