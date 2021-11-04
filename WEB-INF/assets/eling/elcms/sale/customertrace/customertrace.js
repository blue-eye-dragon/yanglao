/**
 * 意向客户追踪
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var Form =require("form-2.0.0")
	var store = require("store");
	var activeUser = store.get("user");
	var customercss=require("./customertrace.css");
	var customerGrid=require("./customergrid");
	var customerForm=require("./customerform");
	var recordGrid=require("./recordgrid");
	var recordForm=require("./recordform");
	var template="<div class='el-customer'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-CustomerGrid'></div>"+
		"<div class='J-CustomerForm hidden'></div>"+
		"<div class='J-RecordGrid hidden'></div>"+
		"<div class='J-RecordForm hidden'></div>"+
		"<div class='J-pkCustomer hidden'></div>"+
		"</div>";
	var customertrace = ELView.extend({
		_setDefaultData:function(record,type,widget){
			record.type = type;
			record.visitDate = moment();
			var userSelect  = widget.get("recordForm").getData("creator","");
			var flag = false ;
			for(var i=0;i<userSelect.length;i++){
				if(userSelect[i].pkUser==activeUser.pkUser){
					flag=true;
					break;
				}
			}
			if(flag){
				record.creator = activeUser;
			}
			widget.get("recordForm").reset();
			widget.get("recordForm").setData(record);
		},
		_showHide:function(returnflag,widget){
			widget.show([".J-RecordForm"]).hide([".J-CustomerGrid",".J-CustomerForm",".J-RecordGrid"]);
			widget.get("subnav").hide(["search","newVisitRecord","intentionQuery","statusQuery","cardType","time"]);
			if (returnflag == "returnRecord"){
				widget.get("subnav").show(["returnRecord"]).hide(["returnCustomer"]);								
			}else{
				widget.get("subnav").show(["returnCustomer"]).hide(["returnRecord"]);	
			}
		},
		_newRecord:function(type,widget,returnflag){
			if($(".J-pkCustomer").attr("data-key")){
				aw.ajax({
					url:"api/customer/query",
					data : {
						pkCustomer:$(".J-pkCustomer").attr("data-key"),
						fetchProperties:"*,cardType.pkMemberShipCardType,cardType.name"
					},
					dataType:"json",
					success:function(data){ 
						var record = {};
						if (data && data.length>0){							
							record.customer = data[0];
							record.intention = data[0].intention;
						}
						widget._setDefaultData(record,type,widget);
						widget._showHide(returnflag,widget);
					}
				});
			}else{
				var record = {};
				widget._setDefaultData(record,type,widget);
				widget._showHide(returnflag,widget);
			}
		},
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"意向客户追踪",
        			search : function(str) {
						var g=widget.get("customerGrid");
						g.loading();
						aw.ajax({
							url:"api/customer/search",
							data:{
								s:str,
								properties:"name,phoneNumber,mobilePhone",
								fetchProperties:"*,cardType.pkMemberShipCardType,cardType.name",
								"orderString":"lastVisitDate:desc"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);								
							}
						});
					},
        			
        			buttons:[{
        				id:"returnCustomer",
        				text:"返回",
						show:false,
						handler:function(){
							widget.get("customerGrid").refresh();
							widget.show([".J-CustomerGrid"]).hide([".J-CustomerForm",".J-RecordGrid",".J-RecordForm"]);
							widget.get("subnav").show(["search","newVisitRecord","intentionQuery","statusQuery","cardType","time"]).hide(["returnCustomer","returnRecord"]);
							return false;
						}
        				
        			},{
        				id:"returnRecord",
        				text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-CustomerForm",".J-RecordGrid"]).hide([".J-CustomerGrid",".J-RecordForm"]);
							widget.get("subnav").show(["returnCustomer"]).hide(["search","returnRecord","newVisitRecord","intentionQuery","statusQuery","cardType","time"]);
							return false;
						}
        				
        			},{
        				id:"newVisitRecord",
        				text:"最新来访",
        				tip:"新增意向客户",
						show:true,
						handler:function(){
							$(".J-pkCustomer").attr("data-key","");
							var type = {}
							widget._newRecord({key:"Visit",value:"来访"},widget,"returnCustomer");
							return false;
						}
        			}],
					time:{
        				tip:"最新来访时间筛选",
					 	ranges:{
//					 		"本月": [moment().startOf("month"), moment().endOf("month")],
//					 		"三月内": [moment().subtract("month", 3).startOf("days"),moment().endOf("days")],
							"本年": [moment().startOf("year"),moment().endOf("year")],
							},
						defaultTime:"本年",
        				click:function(time){
        					widget.get("customerGrid").refresh();
						}
					},
					buttonGroup:[{
						id:"intentionQuery",
        				tip:"最终意向筛选",
						showAll:true,
						showAllFirst:true,
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
						handler:function(key,element){
							widget.get("customerGrid").refresh(); 
						}
				    },{
				    	id:"statusQuery",
        				tip:"状态筛选",
						showAll:true,
						items:[{
							key:"Purpose",
							value:"意向中"
						},{
							key:"Deposit",
							value:"已交预约金" 	
						},{
							key:"MemberShipContract",
							value:"已会籍签约" 
						},{
							key:"CheckIn",
							value:"已入住"
						},{
							key:"CheckOutRoom",
							value:"已退房"
						},{
							key:"CheckOutCard",
							value:"已退会籍卡"
						}],
						handler:function(key,element){
							widget.get("customerGrid").refresh(); 
						}
				    },{
						id:"cardType",
        				tip:"意向卡类型筛选",
						showAll:true,
						showAllFirst:true,
						key:"pkMemberShipCardType",
						value:"name",
						lazy:true,
						handler:function(key,element){
							widget.get("customerGrid").refresh(); 
						}
					}],
                }
			});
        	
			this.set("subnav",subnav);
            this.set("customerGrid",customerGrid.init(this,params));
        	this.set("customerForm",customerForm.init(this));
            this.set("recordGrid",recordGrid.init(this));
            this.set("recordForm",recordForm.init(this)); 
        },
		afterInitComponent:function(params){
			var subnav = this.get("subnav");
			var that = this;
			subnav.load({
				id:"cardType",
				url:"api/cardtype/query",
				params:{
					fetchProperties:"pkMemberShipCardType,name",
				},
				callback:function(data){
					if (params && !params.pkCustomer){
						if (params.status){
							subnav.setValue("statusQuery", params.status.key);
						}else{
							subnav.setValue("statusQuery", "");
						}
						if (params.intention){
							subnav.setValue("intentionQuery", params.intention.key);
						}else{
							subnav.setValue("intentionQuery", "");
						}
						if (params.cardType){
							subnav.setValue("cardType", params.cardType.pkMemberShipCardType);
						}else{
							subnav.setValue("cardType", "");
						}
						if (params.start && params.end){
							var time = {};
							time.start = params.start;
							time.end = params.end;
							subnav.setValue("time",time);
							//				params.visitDate = params.start;
							//				params.visitDateEnd = params.end;			
						}
						//销毁传入参数，列表自己获取subnav的参数
						params = null;
					}
					that.get("customerGrid").refresh(params);
				}				
			});
		}
	});
	module.exports = customertrace;	
});

