/**
 * 销售佣金查询
 * @author zp
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var template="<div class='el-salescommission'>"+
			 "<div class='J-subnav'></div>"+
			 "<div class='J-grid'></div>" +
			 "<div class='J-printgrid hidden'></div>" +
			 "</div>";
	var years=[];
	for(var i=-5;i<=0;i++){
		years.push({
			key:moment().add(i,'year').year(),
			value:moment().add(i,'year').year()
		});
	}
	for(var i=1;i<=5;i++){
		years.push({
			key:moment().add(i,'year').year(),
			value:moment().add(i,'year').year()
		});
	}
	var months=[{
		key:01,value:"一月"
	},{
		key:02,value:"二月"
	},{
		key:03,value:"三月"
	},{
		key:04,value:"四月"
	},{
		key:05,value:"五月"
	},{
		key:06,value:"六月"
	},{
		key:07,value:"七月"
	},{
		key:08,value:"八月"
	},{
		key:09,value:"九月"
	},{
		key:10,value:"十月"
	},{
		key:11,value:"十一月"
	},{
		key:12,value:"十二月"
	}];

    var salescommission = ELView.extend({
        attrs:{
        	template:template
        },
        events:{},
        arrayUnique:function(commBaseArray,commBase){
        	var n = []; //一个新的临时数组
        	for(var i = 0; i < commBaseArray.length; i++) //遍历当前数组
        	{
        		if (n.indexOf(commBaseArray[i]) == -1) n.push(commBaseArray[i]);
        	}
        	if(n.length>0){
        		for(var i=0;i<n.length;i++){
        			commBase+=n[i];
        		}
        		Dialog.tip(commBase);
        	}
        },
        dialogTip:function(data){
        	var commBase="请设置对应的佣金基数:";
        	var commBaseArray=[];
        	var cba=0;
    		var deductComm="请设置对应的扣佣基数:";
    		var deductCommArray=[];
        	var dca=0;
        	for(var i=0;i<data.length;i++){
				for(var j=0;j<data[i].salesCommissionDetils.length;j++){
					var detil=data[i].salesCommissionDetils[j];
					var msctName=detil.mscCardType!=null?detil.mscCardType:"无";
					var roomTypeName=detil.roomType!=null?detil.roomType:"无";
					var checkintype=detil.checkInType!=null?detil.checkInType:"无";
					
					if(detil.commBase==null){
						commBaseArray[cba]="会籍卡类型:"+msctName+"+房型:"+roomTypeName+"+入住类型:"+checkintype+"--";
						cba++;
					}
					if(detil.isDeducat==true && detil.deductComm==null){
						deductCommArray[dca]="会籍卡类型:"+msctName+"+入住类型:"+checkintype+"--";
						dca++;
					}
				}
			}
        	this.arrayUnique(commBaseArray,commBase);
        	this.arrayUnique(deductCommArray,deductComm);
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
			parentNode:".J-subnav",
               model:{
            	    title:"销售佣金查询",
            	    items : [{
						id:"year",
						type : "buttongroup",
						tip:"年份",
						items : years,
						handler:function(time){
							$(".J-tip").remove();
							widget.get("grid").refresh(null,function(data){
								widget.dialogTip(data);
				    		});
						}
					},{
						id:"month",
						type : "buttongroup",
						tip:"月份",
						items : months,
						handler:function(time){
							$(".J-tip").remove();
							widget.get("grid").refresh(null,function(data){
								widget.dialogTip(data);
				    		});
						}
					},{
						id : "print",
						type : "button",
						text : "打印",
						handler : function(){
							$(".J-tip").remove();
							subnav.hide(["year","month","print"]);
							$(".J-grid").addClass("hidden");
							$(".J-printgrid").removeClass("hidden");
							var data=widget.get("grid").getData();
							widget.get("printgrid").setData(data);
							window.print();
							subnav.show(["year","month","print"]);
							$(".J-printgrid").addClass("hidden");
							$(".J-grid").removeClass("hidden");
						}
					}]
               	 }
			});
			this.set("subnav",subnav);
    			
            var grid=new Grid({
        		parentNode:".J-grid",
        		autoRender:false,
                model:{
                	url : "api/salescommission/query",
	            	params : function(){
	            		var year=widget.get("subnav").getValue("year");
	            		var month=widget.get("subnav").getValue("month");
	            		var start=moment([year,00,01]);
	                    return {
	                    	"effectiveDate":start.valueOf(),//销售指标
	                    	"month":month,
	                    	"monthStart":moment([year, month-1]).valueOf() ,
	                    	"monthEnd":moment([year, month-1]).endOf('month').valueOf(),
	                    	fetchProperties:"salesUser.pkUser,salesUser.name," +
	                    			"targetSales," +
	                    			"salesTarget.pkSalesTarget," +
	                    			"salesTarget.januaryTarget," +
	                    			"salesTarget.februaryTarget," +
	                    			"salesTarget.marchTarget," +
	                    			"salesTarget.apirlTarget," +
	                    			"salesTarget.mayTarget," +
	                    			"salesTarget.juneTarget," +
	                    			"salesTarget.julyTarget," +
	                    			"salesTarget.augustTarget," +
	                    			"salesTarget.septemberTarget," +
	                    			"salesTarget.octoberTarget," +
	                    			"salesTarget.novemberTarget," +
	                    			"salesTarget.decemberTarget," +
	                    			"salesTarget.yearTarget," +
	                    			"realSales," +
	                    			"availableCommission," +
	                    			"deductingCommission," +
	                    			"raisedMoney",
	                    };
	                },
                    columns:[{
                        name:"salesUser.name",
                        label:"销售人员",
                        issort: true,
                        className:"name"
                    },{
						name:"targetSales",
						label:"当月指标销售额",
						className:"targetSales",
						format:function(value,row){
							return value!=""?value:"0";
						},
					},{
						name:"realSales",
						label:"实际完成销售额",
						className:"realSales",
						format:function(value,row){
							return value!=""?value:"0";
						},
					},{
						name:"",
						label:"指标完成率",
						className:"ratio",
						format:function(value,row){
							if(row.targetSales){
								return Number(row.realSales/row.targetSales*100).toFixed(2)+"%";
							}else{
								return Number(0).toFixed(2)+"%";  
							}
						},
					},{
						name:"availableCommission",
						label:"当月可计提佣金总额",
						className:"availableCommission",
					},{
						name:"deductingCommission",
						label:"扣除已提佣金",
						className:"deductingCommission",
						format:function(value,row){
							return value!=""?value:"0";
						},
					},{
						name:"actualMoney",
						label:"当月实际计提金额",
						className:"actualMoney",
						format:function(value,row){
							return row.availableCommission-row.deductingCommission;
						},
					},{
						name:"raisedMoney",
						label:"次年待计提金额",
						className:"raisedMoney",
						format:function(value,row){
							return value!=""?value:"0";
						},
					}]
				}
            });
            this.set("grid",grid);
            
            var printgrid=new Grid({
        		parentNode:".J-printgrid",
        		autoRender:false,
                model:{
	                isInitPageBar : false,
                    columns:[{
                        name:"salesUser.name",
                        label:"销售人员",
                        issort: true,
                        className:"name"
                    },{
						name:"targetSales",
						label:"当月指标销售额",
						className:"targetSales",
						format:function(value,row){
							return value!=""?value:"0";
						},
					},{
						name:"realSales",
						label:"实际完成销售额",
						className:"realSales",
						format:function(value,row){
							return value!=""?value:"0";
						},
					},{
						name:"",
						label:"指标完成率",
						className:"ratio",
						format:function(value,row){
							if(row.targetSales){
								return Number(row.realSales/row.targetSales*100).toFixed(2)+"%";
							}else{
								return Number(0).toFixed(2)+"%";  
							}
						},
					},{
						name:"availableCommission",
						label:"当月可计提佣金总额",
						className:"availableCommission",
					},{
						name:"deductingCommission",
						label:"扣除已提佣金",
						className:"deductingCommission",
						format:function(value,row){
							return value!=""?value:"0";
						},
					},{
						name:"actualMoney",
						label:"当月实际计提金额",
						className:"actualMoney",
						format:function(value,row){
							return row.availableCommission-row.deductingCommission;
						},
					},{
						name:"raisedMoney",
						label:"次年待计提金额",
						className:"raisedMoney",
						format:function(value,row){
							return value!=""?value:"0";
						},
					}]
				}
            });
            this.set("printgrid",printgrid);
        },
        afterInitComponent:function(params,widget){
    		var subnav=widget.get("subnav");
    		subnav.setValue("year",moment().year());
    		subnav.setValue("month",moment().month()+1);
    		widget.get("grid").refresh(null,function(data){
    			widget.dialogTip(data);
    		});
		}
    });
    module.exports = salescommission;
});