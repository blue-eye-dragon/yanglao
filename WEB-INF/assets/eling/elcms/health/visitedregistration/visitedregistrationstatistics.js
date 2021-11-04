define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav");	
	var Grid=require("grid");
    var aw = require("ajaxwrapper");
    require("./visitedregistration.css");
	//多语
	var i18ns = require("i18n");
	var activeUser = require("store").get("user");
    var template="<div class='J-subnav'></div>"+
	"<div class='J-Statistics'></div>"+
	"<div class='J-VisitCount'></div>"+
	"<div class='J-VisitDetail'></div>"+
	"<div class='J-monthName hidden'></div>"+
	"</div>";
    var VisitedRegistrationStatistics = ELView.extend({
    	_setSubnavTitle : function (month, memberName, widget){
    		var subnav = widget.get("subnav");
    		subnav.setTitle("住院探望统计: " + subnav.getText("building") + " "
    		+ (memberName? memberName+" " : "")
    		+ subnav.getText("year") + "年"
    		+ (isNaN(parseInt(month))? "" : month + "月"));
    	},
    	events:{
    		"click .J-VisitMember-detail":function(ele){
    			var statistics =this.get("statistics");
    			var index = statistics.getIndex(ele.target);
    			var data = statistics.getData(index);
    			var visitCount= this.get("visitCount");
    			visitCount.refresh({
    				pkBuilding:data.building.pkBuilding,
					year:(isNaN(parseInt(data.year))?"":parseInt(data.year)),
					month:(isNaN(parseInt(data.month))?"":parseInt(data.month)),
    				fetchProperties:
    					"*,patientRegistration.pkPatientRegistration,"+
    					"patientRegistration.member.personalInfo.name," +
    					"patientRegistration.member.memberSigning.room.number," +
    					"patientRegistration.status,"+
    					"patientRegistration.disease," +
    					"patientRegistration.checkInDate," +
    					"patientRegistration.checkOutDate," +
    					"patientRegistration.hospital.name"
    			},function(result){
    				//最后一条数据为合计,不需要拼接会员房间号+姓名，循环结束后单独处理
    				for (var i = 0; i < result.length-1; i++){
    					result[i].memberName = result[i].patientRegistration.member.memberSigning.room.number 
					    					+ " " 
					    					+ result[i].patientRegistration.member.personalInfo.name;
    				}
    				result[result.length-1].memberName = "合计";
    				visitCount.setData(result);
    			});
    			$(".J-monthName").attr("data-key", data.month);
    			this._setSubnavTitle(data.month, null, this);
    			this.show(".J-VisitCount").hide(".J-Statistics,.J-VisitDetail");
    			this.get("subnav").show("return1").hide(["refresh"]);
    		},
    		"click .J-countVisit-memberdetail":function(ele){
    			var visitCount= this.get("visitCount");
    			var visitDetail= this.get("visitDetail");
    			var index = visitCount.getIndex(ele.target);
    			var data = visitCount.getData(index);
    			visitDetail.refresh({
    				patientRegistration:data.patientRegistration.pkPatientRegistration,
    				fetchProperties:
    					"patientRegistration.pkPatientRegistration,"+
    					"patientRegistration.member.personalInfo.name," +
    					"patientRegistration.member.memberSigning.room.number," +
    					"visitors.pkVisitor,"+
    					"visitors.name,"+
    					"visitDate,"+
    					"carryitems,"+
    					"situation,"+
    					"giftAllowance,"+
    					"carFare"
    			},function(result){
    				for (var i = 0; i < result.length; i++){
    					result[i].memberName = result[i].patientRegistration.member.memberSigning.room.number 
					    					+ " " 
					    					+ result[i].patientRegistration.member.personalInfo.name;
    				}
    				visitDetail.setData(result);
    			});
    			this._setSubnavTitle($(".J-monthName").attr("data-key"), data.memberName, this);
    			this.show(".J-VisitDetail").hide(".J-Statistics,.J-VisitCount");
    			this.get("subnav").show("return2").hide(["refresh","return1"]);
    		}
    	},
    	attrs:{
    		template:template
    	},
    	initComponent:function(params,widget){
    		var items=[];
			for(var i=0;i<=moment().format("YYYY")-2007;i++){
				var obj={};
				obj.key=parseInt(moment().format("YYYY"))-parseInt(i);
				obj.value=parseInt(moment().format("YYYY"))-parseInt(i);
				items.push(obj);
			}
    		var subnav=new Subnav({
    			parentNode:".J-subnav",
    			model:{
    				title:"住院探望统计",
    				items:[{
						id:"building",
						keyField:"pkBuilding",
	     				valueField:"name",
						type:"buttongroup",
						showAll:true,
	     				tip:"楼宇",
	     				items:activeUser.buildings,
						handler:function(key,element){
							widget.get("statistics").refresh();
						}
					},{
						id:"year",
						type:"buttongroup",
						items:items,	
						handler:function(key,element){
							widget.get("statistics").refresh();
						}
					},{
    					id:"refresh",
    					type:"button",
    					text:"刷新",
    					handler:function(){
    						widget.get("statistics").refresh();
    					}
    				},{
    					id:"return1",
    					type:"button",
    					text:"返回",
    					show:false,
    					handler:function(){
    						widget.show(".J-Statistics").hide([".J-VisitCount"]);
    						widget.get("subnav").hide(["return1"]).show(["refresh"]);
    						widget.get("subnav").setTitle("住院探望统计");
    						return false;
    					}
    				},{
    					id:"return2",
    					type:"button",
    					text:"返回",
    					show:false,
    					handler:function(){
    						widget.show(".J-VisitCount").hide([".J-VisitDetail"]);
    						widget.get("subnav").hide(["return2"]).show(["return1"]);
    						widget._setSubnavTitle($(".J-monthName").attr("data-key"), null, widget);
    						return false;
    					}
    				}]
    			}
    		});
    		this.set("subnav",subnav);
    		
    		var statistics=new Grid({
    			parentNode:".J-Statistics",
    			url:"api/visitedregistration/report",
    			params:function(){
    				var subnav=widget.get("subnav");
    				return {
    					building:subnav.getValue("building"),
    					year:subnav.getValue("year"),
    					fetchProperties:"building.pkBuilding,building.name,memberNumber,visitCount,giftAllowance,carFare,count" 	
    				};
    			},
    			model:{
    				columns:[{
    					key:"month",
    					name:"月份",
    					format:function(value,row){
    						if(value.size<2){
    							return value+"月";	
    						}else{									
    							return value;
    						}
    					}
    				},{
    					key:"visitCount",
    					name:"次数",
    					format:function(value){
    						return value;
    					},
    				},{
    					key:"memberNumber",
    					name:i18ns.get("sale_ship_owner","会员")+"数(人)",
    					format:function(value,row){
    						if(value!=0){
    							return "<a href='javascript:void(0);' style='color:red;' class='J-VisitMember-detail' >"+value+"</a>";	
    						}else{									
    							return 0;
    						}
    					}
    				},{
    					key:"giftAllowance",
    					name:"礼品费(元)",
    					format:function(value,row){
    						if(value){
    							return value.toFixed(2)
    						}else{
    							return value
    						}
    					}
    				},{
    					key:"carFare",
    					name:"交通费(元)",
    					format:function(value,row){
    						if(value){
    							return value.toFixed(2)
    						}else{
    							return value
    						}
    					}
    				},{
    					key:"count",
    					name:"费用合计(元)",
    					format:function(value,row){
    						if(value){
    							return value.toFixed(2)
    						}else{
    							return value
    						}
    					}
    				}]
    			}
    		});
    		this.set("statistics",statistics); 
    		
    		var visitCount=new Grid({
    			parentNode:".J-VisitCount",
    			autoRender:false,
    			show:false,
    			url:"api/visitedregistration/reportMemberDetails",
    			params:function(){
    				return {};
    			},
    			model:{
    				columns:[{
    					key:"memberName",
    					className:"oneHalfColumn",
    					name:i18ns.get("sale_ship_owner","会员")
    				},{
    					key:"patientRegistration.disease",
    					className:"twoColumn",
    					name:"入院原因"
    				},{
    					key:"patientRegistration.checkInDate",
    					className:"oneHalfColumn",
    					name:"住院日期",
    					format:"date"
    				},{
    					key:"patientRegistration.status.value",
    					className:"oneColumn",
    					name:"住院状态"
    				},{
    					key:"patientRegistration.hospital.name",
    					className:"twoColumn",
    					name:"医院名称",
    				},{
    					key:"memberVisit",
    					className:"oneColumn",
    					name:"探望次数",
    					format:function(value){
    						if(value!=0){
    							return "<a href='javascript:void(0);' style='color:red;' class='J-countVisit-memberdetail' >"+value+"</a>";
    						}else{									
    							return "";
    						}
    					}
    				},{
    					key:"giftAllowance",
    					className:"oneColumn",
    					name:"礼品费(元)",
    					format:function(value,row){
    						if(value){
    							return value.toFixed(2)
    						}else{
    							return value
    						}
    					}
    				},{
    					key:"carFare",
    					className:"oneColumn",
    					name:"交通费(元)",
    					format:function(value,row){
    						if(value){
    							return value.toFixed(2)
    						}else{
    							return value
    						}
    					}
    				},{
    					key:"sum",
    					className:"oneColumn",
    					name:"费用合计(元)",
    					format:function(value,row){
    						if(value){
    							return value.toFixed(2)
    						}else{
    							return value
    						}
    					}
    				}]
    			}
    		});
    		this.set("visitCount",visitCount);
    		
    		var visitDetail=new Grid({
    			parentNode:".J-VisitDetail",
    			autoRender:false,
    			show:false,
    			url:"api/visitedregistration/query",
    			model:{
    				columns:[{
    					key:"memberName",
    					name:i18ns.get("sale_ship_owner","会员")
    				},{
    					key:"visitors",
    					name:"探望人",
    					format:function(value,row){
    						var names= "";
    						for ( var i in value) {
    							names +=value[i].name + ",";
    						}
    						return names.substring(0, names.length-1);
    					}
    				},{
    					key:"visitDate",
    					name:"探望时间",
    					format:"date"
    				},{
    					key:"carryitems",
    					name:"探望礼品",
    				},{
    					key:"situation",
    					name:i18ns.get("sale_ship_owner","会员")+"情况",
    				},{
    					key:"giftAllowance",
    					name:"礼品费(元)",
    					format:function(value,row){
    						if(value){
    							return value.toFixed(2)
    						}else{
    							return value
    						}
    					}
    				},{
    					key:"carFare",
    					name:"交通费(元)",
    					format:function(value,row){
    						if(value){
    							return value.toFixed(2)
    						}else{
    							return value
    						}
    					}
    				}]
    			}
    		});
    		this.set("visitDetail",visitDetail);
    		
    	},
    	afterInitComponent:function(params,widget){
    		widget.hide(".J-VisitCount,.J-VisitDetail");
    	}
    });
	module.exports = VisitedRegistrationStatistics;
});