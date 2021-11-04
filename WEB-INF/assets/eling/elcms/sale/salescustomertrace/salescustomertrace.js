/**
 * 客户回访追踪
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var Grid = require("grid");
	//多语
	var i18ns = require("i18n");
    require("./salescustomertrace.css");
	var template="<div class='el-salescustomertrace'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-grid'></div>"+
	"<div class='J-recordGrid hidden'></div>"+
	"</div>";
	var salescustomertrace = ELView.extend({
		events:{
    		"click .J-countVisit":function(ele){
    			var grid =this.get("grid");
    			var index = grid.getIndex(ele.target);
    			var data = grid.getData(index);
    			var recordGrid= this.get("recordGrid");
    			recordGrid.setData(data.contactRecords);
    			this.show(".J-recordGrid").hide(".J-grid");
    			this.get("subnav").show("return").hide(["intention","status","cardType","creator","createDateRange"]);
    		}
        },
        attrs:{
    		template:template
        },        
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"销售客户追踪",
        			items : [{
        				tip:"最终意向筛选",
        				id : "intention",
        				type : "buttongroup",
        				items:[{
        					key:"Hopebuy",
        					value:"希望购买" 
        				},{
        					key:"Dislike",
        					value:"不感兴趣"
        				},{
        					key:"General",
        					value:"一般" 	
        				},{
        					key:"Like",
        					value:"感兴趣"
        				}],
        				all : {
        					show : true,
        					position : "top"
        				},
        				handler:function(key,element){
        					widget.get("grid").refresh(); 
        				}		
        			},{
        				tip:"状态筛选",
        				id:"status",
        				type : "buttongroup",
        				items:[{
        					key:"Purpose",
        					value:"意向中"
        				},{
        					key:"Deposit",
        					value:"已交预约金" 	
        				},{
        					key:"MemberShipContract",
        					value:"已"+i18ns.get("sale_ship_contract","会籍签约") 
        				},{
        					key:"CheckIn",
        					value:"已入住"
        				},{
        					key:"CheckOutRoom",
        					value:"已退房"
        				},{
        					key:"CheckOutCard",
        					value: i18ns.get("sale_card_backcontract","已退会籍卡")
        				}],
        				all : {
        					show : true,
        					position : "bottom"
        				},
        				handler:function(key,element){
        					widget.get("grid").refresh();
        				}		
        			},{
        				tip: i18ns.get("sale_card_type","意向卡类型")+"筛选",
        				id:"cardType",
        				type : "buttongroup",
        				keyField :"pkMemberShipCardType",
        				valueField:"name",
        				url:"api/cardtype/query",
        				params:{
        					fetchProperties:"pkMemberShipCardType,name",
        				},
        				all : {
        					show : true,
        					position : "top"
        				},
        				handler:function(key,element){
        					widget.get("grid").refresh(); 
        				}
        			},{
        				tip:"销售人员",
        				id:"creator",
        				type : "buttongroup",
        				keyField : "pkUser",
        				valueField : "name",
        				all : {
        					show : true,
        					position : "top"
        				},
        				url:"api/user/roletype",
        				params:{
        					"roletype":"Sale",
        					fetchProperties:"pkUser,name"
        				},
        				handler:function(key,element){
        					widget.get("grid").refresh(); 
        				}
        			},{
        				tip:"最新来访时间筛选",
        				id : "createDateRange",
        				type : "daterange",
        				ranges:{
        					"本月": [moment().startOf("month"), moment().endOf("month")],
        					"半年内": [moment().subtract(6,"month").startOf("days"),moment().endOf("days")],
        					"本年": [moment().startOf("year"),moment().endOf("year")],
        				},
        				defaultRange : "本月",
        				minDate: "1930-05-31",
        				maxDate: "2020-12-31",
        				handler : function(time){
        					widget.get("grid").refresh();
        				}
        			},{
    					id:"return",
    					text:"返回",
    					type:"button",
    					show:false,
    					handler:function(){
    						widget.show(".J-grid").hide([".J-recordGrid"]);
    						widget.get("subnav").hide(["return"]).show(["intention","status","cardType","creator","createDateRange"]);
    						return false;
    					}
    				}]
        		}
        	});
        	this.set("subnav",subnav);
        	
        	var grid = new Grid({
        		parentNode : ".J-grid",
        		model:{
        			url : "api/contactrecord/querybysale",
        			params : function(){
      				  return {
      					    "customer.intention":widget.get("subnav").getValue("intention"),
      					    "customer.status":widget.get("subnav").getValue("status"),
      					    "customer.cardType":widget.get("subnav").getValue("cardType"),
					        "creator":widget.get("subnav").getValue("creator"),
      					    "visitDate":widget.get("subnav").getValue("createDateRange").start,
      					    "visitDateEnd":widget.get("subnav").getValue("createDateRange").end,
	      					fetchProperties:"creator.name," +
	      							"customer.name," +
	      							"customer.phoneNumber," +
	      							"customer.intention.value," +
	      							"customer.cardType.name," +
	      							"customer.status.value," +
	      							"lastVisitDate," +
	      							"lastReturnDate,"+
	      							"contactRecords.pkContactRecord," +
	      							"contactRecords.customer.name," +
	      							"contactRecords.customer.phoneNumber,"+
	      							"contactRecords.visitDate," +
	      							"contactRecords.visitWay.name," +
	      							"contactRecords.type.value," +
	      							"contactRecords.customer.cardType.name," +
	      							"contactRecords.intention.value," +
	      							"contactRecords.content," +
	      							"contactRecords.creator.name," +
	      							"contactRecords.remindDate"
                        };
      			    },
      			    columns:[{
      			    	name : "creator.name",
                        label : "销售人员",
      			    },{
      			    	name : "customer.name",
                        label : "客户姓名",
      			    },{
      			    	name:"customer.phoneNumber",
						label:"联系电话",
      			    },{
      			    	name:"customer.intention.value",
						label:"意向",
      			    },{
      			    	name:"customer.cardType.name",
						label: i18ns.get("sale_card_type","意向卡类型"),
      			    },{
      			    	name:"customer.status.value",
						label:"状态",
      			    },{
      			    	name:"lastVisitDate",
						label:"最新来访时间",
						format: "date",
      			    },{
      			    	name:"lastReturnDate",
						label:"最新回访时间",
						format: "date",
      			    },{
      			    	name:"contactRecords",
						label:"访问次数",
						format:function(value,row){
							if(value){
    							return "<a href='javascript:void(0);' style='color:red;' class='J-countVisit' >"+value.length+"</a>";
    						}else{									
    							return "";
    						}
						} 
      			    }],
        		}
        	});
        	this.set("grid",grid);
        	
        	var recordGrid = new Grid({
        		parentNode:".J-recordGrid",
        		autoRender:false,
        		model:{
        			head:{
        				title:"访问记录"
        			},
        			columns:[{
      			    	name : "customer.name",
                        label : "客户姓名",
                        className:"oneColumn",
      			    },{
      			    	name:"customer.phoneNumber",
						label:"联系电话",
						className:"oneColumn",
      			    },{
      			    	key:"visitDate",
        				name:"访问时间",
        				format : "date",
        				formatparams:{
        					mode:"YYYY-MM-DD HH:mm"
        				},
        				className:"oneHalfColumn",
        			},{
        				key:"visitWay.name",
        				name:"访问方式",
        				className:"oneColumn",
        			},{
        				key:"type.value",
        				name:"访问类型",
        				className:"oneColumn",
        			},{
        				key:"customer.cardType.name",
        				name:  i18ns.get("sale_card_type","卡类型"),
        				className:"oneColumn",
        			},{
        				key:"intention.value",
        				name:"本次意向",
        				className:"oneColumn",
        			},{
        				key:"content",
        				name:"沟通内容",
        				className:"twoColumn",
        			},{
        				key:"creator.name",
        				name:"销售",
        				className:"oneColumn",
        			},{
        				key:"remindDate",
        				name:"回访提醒时间",
        				format : "date",
        				className:"oneHalfColumn",
        			}]
        		}
        	});
        	this.set("recordGrid",recordGrid);
        },
	});
	module.exports=salescustomertrace;

});