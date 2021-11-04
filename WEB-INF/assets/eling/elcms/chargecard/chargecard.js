define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav=require("subnav");
	var Grid = require("grid");
	var MultiRowGrid=require("multirowgrid");
	var template="<div class='el-chargecard'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-grid'></div>"+
	"<div class='J-detailsgrid hidden'></div>"+
	"</div>";
	var chargecard = ELView.extend({
		events:{
    		"click .J-detail":function(e){
    			var start;
    			var end;
    			var year;
				var month;
    			if(this.get("params")){
    				start = this.get("params").start;
    				end = this.get("params").end;
    				year = moment(start).format("YYYY");
    				month = moment(start).format("MM");
    			} else {
    				year = this.get("subnav").getValue("year");
    				month = this.get("subnav").getValue("month");
    				var monthFirstDay= year + "-" +month;
    				var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
    				var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
    				start = moment(monthFirstDay,"YYYY-MM-DD").valueOf();
    				end = moment(monthLastDay,"YYYY-MM-DD").add(86399, 'seconds').valueOf();
    				
    			}
    			var g=this.get("detailsgrid");
    			g.setData([]);
    			var roomNo = $(e.target).attr("data-key");
    			var memberName = $(e.target).attr("data-key2"); 
    			aw.ajax({
					url:"api/cardSolution/purchasehistoryitem/query",
					data:{
						cardNo:$(e.target).attr("data-key1"),
						start:start,
	                	end:end,
		            	fetchProperties:"dateTime,"+
        				"purchaseType," +
        				"billNo,"+
        				"purchaseHistoryItem.purchaseItem,"+
        				"purchaseHistoryItem.itemPrice,"+
        				"purchaseMoney,"+
        				"purchaseHistoryItem.itemQty,"
					},
					dataType:"json",
					success:function(data){
						g.setData(data);
					}
				});
    			g.setTitle(roomNo+" "+memberName+" "+year+"年"+month+"月");
    			this.get("subnav").setTitle("会员消费详情");
    			this.get("subnav").show("return").hide(["building","year","month"]);
    			this.hide([".J-grid"]).show([".J-detailsgrid"]);
	    	},
    	},
		attrs:{
    		template:template
        },
		initComponent:function(params,widget){
			var years=[];
			for(var i=0;i<=moment().year()+5-2010;i++){
				var obj={};
				obj.key=2010+i;
				obj.value=2010+i;
				years.push(obj);
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
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"消费卡统计",
					items:[{
						id:"building",
						type:"buttongroup",
						tip:"楼宇",
						keyField : "pkBuilding",
						valueField : "name",
						url:"api/building/query",
						params:function(){
							return{ 
								"useType":"Apartment",
								fetchProperties:"pkBuilding,name" 
								  }	
						}, 
						all : {
							show : true,
							text : "全部",
							position : "bottom"
						},
					    handler:function(key,element){
						   widget.get("grid").refresh();
					    }
					  },{
						   id:"year",
						   type:"buttongroup",
						   tip:"年份",
						   items:years,	
						   handler:function(key,element){
							   widget.get("grid").refresh();
						   }
					   },{
						   id:"month",
						   type:"buttongroup",
						   tip:"月份",
						   items:months,
						   all : {
								show : true,
								text : "全部",
								position : "bottom"
							},
						   handler:function(key,element){
							   widget.get("grid").refresh();
						   }
					   },{
                            id : "return",
                            type:"button",
                            text : "返回",
                            show:false,
                            handler : function(){
                            	subnav.setTitle("消费卡统计");
                            	if(!widget.get("params")){
                            		subnav.hide(["return"]).show(["building","year","month"]);
                            	} else {
                                	subnav.hide(["return"]);
                            	}
                            	widget.hide([".J-detailsgrid"]).show([".J-grid"]);
                            	
                            }
					   }]
				}
			});
			this.set("subnav",subnav);
			var grid = new Grid({
				parentNode : ".J-grid",
				autoRender:false,
				model:{
	                url : "api/cardSolution/MemberPurchaseHistory/query",
		            params : function(){
		            	var year = widget.get("subnav").getValue("year");
						var month = widget.get("subnav").getValue("month");
						var monthFirstDay= year + "-" +month;
						var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
						var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
		                return {
		                	"member.memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
		                	start:moment(monthFirstDay,"YYYY-MM-DD").valueOf(),
		                	end:moment(monthLastDay,"YYYY-MM-DD").add(86399, 'seconds').valueOf(),
							fetchProperties:"roomNo,"+
							"pkmember,"+
            				"memberName," +
            				"mobilePhone,"+
            				"memberPurchaseHistory.cardNo,"+
            				"memberPurchaseHistory.sumMoney,"+
            				"memberPurchaseHistory.remainingSum,"
		                };
		            },
                	columns:[{
                		name : "Member",
                        label : "会员",
                    	format:function(row,value){
							return value.roomNo+value.memberName;
						},
                    },{
                    	name : "memberPurchaseHistory.cardNo",
                        label : "卡号"
                    },{
                    	name : "memberPurchaseHistory.sumMoney",
                        label : "消费金额",
                    	format:function(row,value){
							return "<a href='javascript:void(0);' style='color:red;' class='J-detail' data-key='"+value.roomNo+"' data-key2='"+value.memberName+"' data-key1='"+value.memberPurchaseHistory.cardNo+"'>"+value.memberPurchaseHistory.sumMoney+"</a>";
						},	
                    },{
                    	name : "memberPurchaseHistory.remainingSum",
                        label : "余额"
                    },{
                    	name : "mobilePhone",
                        label : "联系方式"
                    }]
				}
			});
			this.set("grid",grid);
			var detailsgrid = new MultiRowGrid({
				parentNode : ".J-detailsgrid",
				isInitPageBar : true,
				
				model:{
					multiField:"purchaseHistoryItem",
		            head : {
		            	title : "",
                    },
                    columns:[{
                    	key : "dateTime",
                		name : "日期",
                        format:"date"
                    },{
                    	key : "billNo",
                    	name : "消费单号"
                    },{
                    	key : "purchaseType",
                    	name : "消费类型"
                    },{
                    	key : "purchaseHistoryItem",
                    	name : "消费项目",
						multiKey:"purchaseItem",
						isMulti:true,
                    },{
                    	key : "purchaseHistoryItem",
                    	name : "消费项目单价",	
						multiKey:"itemPrice",
						isMulti:true,
                    },{
                    	name : "purchaseHistoryItem",
                    	name : "消费数量",
						multiKey:"itemQty",
						isMulti:true,
                    },{
                    	key : "purchaseMoney",
                    	name : "消费单金额",	
                    }]
				}
			});
			this.set("detailsgrid",detailsgrid);
		},
		afterInitComponent:function(params,widget){
			if(params){
				var flag;
				if("1到5天" == params.name){
					flag = "oneToFiveDays";
				} else if("6到10天" == params.name){
					flag = "sixToTenDays";
				} else if("11到15天" == params.name){
					flag = "elevenToFifteenDays";
				} else if("16到20天" == params.name){
					flag = "sixteenToTwentyDays";
				} else if("21到25天" == params.name){
					flag = "twentyOneToTwentyFiveDays";
				} else if("26天以上" == params.name){
					flag = "greaterThanTwentySixDays";
				} else {
					
				}
				var subnav = widget.get("subnav");
				subnav.hide(["building","year","month","return"]);
				var grid = widget.get("grid");
				grid.refresh({
					flag:flag,
	            	start:params.start,
	            	end:params.end,
				});
			} else {
				widget.get("subnav").setValue("year",moment().year());
				widget.get("subnav").setValue("month",moment().month()+1);
				var year = widget.get("subnav").getValue("year");
				var month = widget.get("subnav").getValue("month");
				var monthFirstDay= year + "-" +month;
				var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
				var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
				widget.get("grid").refresh({
					"member.memberSigning.room.building.pkBuilding":0,
	            	start:moment(monthFirstDay,"YYYY-MM-DD").valueOf(),
	            	end:moment(monthLastDay,"YYYY-MM-DD").add(86399, 'seconds').valueOf(),
				});
			}
		}
	});
	module.exports=chargecard;
});
