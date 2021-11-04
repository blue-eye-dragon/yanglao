/**
 *	客户联系地址统计
 * 
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var Grid=require("grid-1.0.0");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var CustomerAddress = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"联系地址", 
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/customer/search",
							data:{
								s:str,
								properties:"name,sAddress" ,
								fetchProperties:"*",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
					time:{
        				tip:"最新来访时间筛选",
						click:function(time){
							widget.get("grid").refresh();
						},
						ranges : {
	     					"本年": [moment().startOf("year"),moment().endOf("year")]
	     				   },
	     				defaultTime:"本年",
					},
					buttonGroup:[{
						id:"Intention",
						tip:"意向",
						showAll:true,
						showAllFirst:true,
						url:"api/enum/com.eling.elcms.sale.model.Customer.Intention",
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
						id:"Status",
						tip:"状态",
						showAll:true,
						showAllFirst:true,
						items:[{
							key:"Purpose",
							value:"意向中"
						},{
							key:"Deposit",
							value:"已交预约金" 	
						},{
							key:"MemberShipContract",
							value: i18ns.get("sale_card_yetcontract","已会籍签约") 
						},{
							key:"CheckIn",
							value:"已入住"
						},{
							key:"CheckOutRoom",
							value:"已退房"
						},{
							key:"CheckOutCard",
							value:i18ns.get("sale_card_backcontract","已退会籍卡")
						}],
						handler:function(){
							widget.get("grid").refresh();
						}
					}],
					buttons:[{
        				id:"toexcel",
        				text:"导出",
						handler:function(){
						   var subnav=widget.get("subnav");
						   window.open("api/customer/toexcel?Intention="+subnav.getValue("Intention")+"&lastVisitDate="+subnav.getValue("time").start+"&lastVisitDateend="+subnav.getValue("time").end+"&Status="+subnav.getValue("Status"));
						}
        				
        			}],
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-list",
				url:"api/customer/query",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"Intention":subnav.getValue("Intention"),
						"Status":subnav.getValue("Status"),
						"lastVisitDate": subnav.getValue("time").start,
						"lastVisitDateend":  subnav.getValue("time").end,
				    	fetchProperties:"*"
					};
				},
				model:{
//					head:{
//						title:""
//					},
					columns:[{
						key : "name",
                        name : "姓名",
                        col:"1"
					},{
						key : "custSex",
                        name : "性别",
                        format:function(row,value){
							if(value.custSex=="MALE"){
								return "男";
							}else if (value.custSex=="FEMALE"){
								return "女";
							}else{
								return ""; 
							}
						},
						col:"1"
					},{
						key:"custAge",
						name:"年龄",
						col:"1"
					},{
						key:"phoneNumber",
						name : "固定电话",
						col:"2"
                    },{
						key : "mobilePhone",
						name : "移动电话",
						col:"1"
                    },{
						key : "sAddress",
						name : "联系地址"
                    },{
						key : "sPostcode",
						name : "邮政编码",
						col:"1"
                    },{
						key : "intention.value",
						name : "意向",
						col:"1"
                    },{
						key : "status.value",
						name : "状态",
						col:"1"
                    }]
				}
			});
			this.set("grid",grid);
		}
	});
	module.exports = CustomerAddress;
});