/**
 * 回访次数追踪
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
	var returnrecordGrid=require("./returnrecordgrid");
	var returnrecordForm=require("./returnrecordform");
	var template="<div class='el-customer'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-ReturnGrid'></div>"+
		"<div class='J-ReturnRecordGrid hidden'></div>"+
		"<div class='J-ReturnRecordForm hidden'></div>"+
		"<div class='J-pkCustomer hidden'></div>"+
		"</div>";
	var returncounttrace = ELView.extend({
		_setDefaultData:function(record,type,widget){
			record.type = type;
			record.visitDate = moment();
			var userSelect  = widget.get("returnrecordForm").getData("creator","");
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
			widget.get("returnrecordForm").reset();
			widget.get("returnrecordForm").setData(record);				
		},
		_showHide:function(returnflag,widget){
			widget.show([".J-ReturnRecordForm"]).hide([".J-ReturnGrid",".J-ReturnRecordGrid"]);
			widget.get("subnav").hide(["search","intentionQuery","returnCount","time"]);
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
			}
		},
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"回访次数追踪",
        			search : function(str) {
						var g=widget.get("returnGrid");
						g.loading();
						aw.ajax({
							url:"api/customer/search",
							data:{
								s:str,
								properties:"name,phoneNumber,mobilePhone",
								fetchProperties:"*,cardType.pkMemberShipCardType,cardType.name",
								"orderString":"lastReturnDate:desc"
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
							widget.get("returnGrid").refresh();
							widget.show([".J-ReturnGrid"]).hide([".J-ReturnRecordGrid",".J-ReturnRecordForm"]);
							widget.get("subnav").show(["search","intentionQuery","returnCount","time"]).hide(["returnCustomer","returnRecord"]);
							return false;
						}
        				
        			},{
        				id:"returnRecord",
        				text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-ReturnRecordGrid"]).hide([".J-ReturnGrid",".J-ReturnRecordForm"]);
							widget.get("subnav").show(["returnCustomer"]).hide(["search","returnRecord","intentionQuery","returnCount","time"]);
							return false;
						}
        				
        			}],
					time:{
        				tip:"最新回访时间筛选",
					 	ranges:{
					 		"本月": [moment().startOf("month"), moment().endOf("month")],
					 		"三月内": [moment().subtract("month", 3).startOf("days"),moment().endOf("days")],
							"半年内": [moment().subtract("month", 6).startOf("days"),moment().endOf("days")],
							},
						defaultTime:"本月",
        				click:function(time){
        					widget.get("returnGrid").refresh();
						}
					},
					buttonGroup:[{
						id:"intentionQuery",
        				tip:"最终意向筛选",
						showAll:true,
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
							widget.get("returnGrid").refresh(); 
						}
				    },{
						id:"returnCount",
        				tip:"回访次数筛选",
						showAll:true,
						items:[{
							key:"0",
							value:"0次"
						},{
							key:"1",
							value:"小于等于3"
						},{
							key:"2",
							value:"大于3"
						}],
						handler:function(key,element){								
							widget.get("returnGrid").refresh();
						}
					}],
                }
			});        	
			this.set("subnav",subnav);
			
			returnGrid = new Grid({
            	parentNode:".J-ReturnGrid",
            	autoRender:false,
				url:"api/customer/queryreturn",
				fetchProperties:"*,cardType.pkMemberShipCardType,cardType.name",
 				params:function(){
 					var time=widget.get("subnav").getValue("time");
 					return { 
 						intention:widget.get("subnav").getValue("intentionQuery"), 
 						returnCountFlag:widget.get("subnav").getValue("returnCount"),
 						lastReturnDate:time.start,
 						lastReturnDateEnd:time.end,
 						"orderString":"lastReturnDate:desc"
 					}; 
				},
				model:{
					columns:[{
						key:"name",
						name:"姓名",
						format:"detail",
 						formatparams:[{
 							key:"nameDetail",
							handler:function(index,data,rowEle){ 
		        				$(".J-pkCustomer").attr("data-key",data.pkCustomer);
								widget.get("returnrecordGrid").refresh({
									customer:data.pkCustomer,
									type:"Return",
									"orderString":"visitDate:desc"});
								widget.show([".J-ReturnRecordGrid"]).hide([".J-ReturnGrid",".J-ReturnRecordForm"]);
								widget.get("subnav").show(["returnCustomer"]).hide(["search","returnRecord","intentionQuery","returnCount","time"]);
							}
 						}]
					},{
						key:"phoneNumber",
						name:"联系电话"
					},{
						key:"mobilePhone",
						name:"移动电话"
					},{
						key:"intention.value",
						name:"最终意向"
					},{
						key:"cardType.name",
						name:"意向卡类型"
					},{
						key:"status.value",
						name:"状态"
					},{
						key:"returnCount",
						name:"回访次数",
						format:"detail",
						formatparams:[{
							key:"returnCountDetail",
							handler:function(index,data,rowEle){  
		        				$(".J-pkCustomer").attr("data-key",data.pkCustomer);
								widget.get("returnrecordGrid").refresh({
									customer:data.pkCustomer,
									type:"Return",
									"orderString":"visitDate:desc"});
								widget.show([".J-ReturnRecordGrid"]).hide([".J-ReturnGrid",".J-ReturnRecordForm"]);
								widget.get("subnav").show(["returnCustomer"]).hide(["search","returnRecord","intentionQuery","returnCount","time"]);
							}
						}]
					},{
						key:"lastReturnDate",
						name:"最新回访时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"operate",
						name : "操作",
						format:"button",
						formatparams:[{
							key:"return",
							text:"回访",
							handler:function(index,data,rowEle){
								$(".J-pkCustomer").attr("data-key",data.pkCustomer);
								widget._newRecord({key:"Return",value:"回访"},widget,"returnCustomer");
							}
						}]
					}]
				}
            });
            this.set("returnGrid",returnGrid);
            this.set("returnrecordGrid",returnrecordGrid.init(this));
            this.set("returnrecordForm",returnrecordForm.init(this)); 
        },
		afterInitComponent:function(params){
			this.get("returnGrid").refresh(params);
		}
	});
	module.exports = returncounttrace;	
});

