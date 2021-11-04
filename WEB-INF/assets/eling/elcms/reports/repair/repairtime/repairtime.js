define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var activeUser = require("store").get("user");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>";
	
	require("./repairTime.css");
	
	var repairTime = ELView.extend({
		_getTime : function(start, end){
			var date=end-start;  //时间差的毫秒数  
			//计算出相差年数  
			var years=Math.floor(date/(365*24*3600*1000)); 	
			//计算出相差天数  
			var days=Math.floor(date/(24*3600*1000)); 								   
			//计算出小时数
			var leave1=date%(24*3600*1000); //计算天数后剩余的毫秒数  
			var hours=Math.floor(leave1/(3600*1000));
			//计算相差分钟数  
			var leave2=leave1%(3600*1000);  //计算小时数后剩余的毫秒数  
			var minutes=Math.floor(leave2/(60*1000)); 
			var time = "";
			if (years!=0 && !isNaN(years)){
				time += years+"年 ";
			}
			if (days!=0 && !isNaN(days)){
				time += days+"天 ";
			}
			if (hours!=0 && !isNaN(hours)){
				time += hours+"小时 ";
			}
			if (minutes!=0 && !isNaN(minutes)){
				time += minutes+"分钟";
			}
			return time; 
		},
		_getQueryDate : function(key){
			var queryDate ;
			if(key == "2"){
				queryDate = moment().subtract(1,"month").add(1, 'day').valueOf();
			}else if(key == "3"){
				queryDate = moment().subtract(7, 'day').valueOf();
			}else{
				queryDate = "";
			}
			return queryDate;
		},
		attrs:{
            template:template
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"维修绩效",
					items:[{
						id:"flowStatus",
						type:"buttongroup",
						tip:"状态",
						items:[{
							key:"Unconfirmed,Unarrange,Unrepaired",
							value:"未结束"
						},{
							key:"Unarrange",
							value:"待派工"
								
						},{
							key:"Unconfirmed",
							value:"待确认"
						},{
							key:"Finish",
							value:"结束"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"dateTime",
						tip:"报修时间",
						type:"buttongroup",
						items: [{
							key:1,
							value:"全部"
						},{
							key:2,
							value:"大于一月"
						},{
							key:3,
							value:"大于一周"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"buildings",
						keyField:"pkBuilding",
	     				valueField:"name",
						type:"buttongroup",
						showAll:true,
	     				tip:"楼宇",
	     				items:activeUser.buildings,
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
        		parentNode:".J-grid",
				url:"api/repair/querybytime",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						createDateEnd:widget._getQueryDate(subnav.getValue("dateTime")),
						"place.building":subnav.getValue("buildings"),
						flowStatusIn:subnav.getValue("flowStatus"),
						fetchProperties:"*,place.name," +
						"repairClassify.name," +
						"repairClassify.description," +
						"assetCard.code," +
						"repairDetails.operateType," +
						"repairDetails.createDate," +
						"repairDetails.user," +
						"repairDetails.user.name," +
						"repairDetails.maintainer.name," +
						"repairDetails.maintainer.pkMaintainer," +
						"repairDetails.maintainer.phone," +
						"repairDetails.maintainer.supplier.name",
					};
				},
				model:{
					columns:[{
						key:"repairNo",
						name:"报修单号",
	                    className:"oneHalfColumn"
					},{
						key:"place.name",
						name:"位置",
	                    className:"oneColumn"
					},{
						key:"repairClassify.name",
						name:"分类",
	                    className:"oneColumn"
					},{
						key:"content",
						name:"内容",
						calssName:"twoHalfColumn"
					},{
						key:"repairDetails",
						name:"报修时间",
	                    className:"oneColumn",
						format:function(value,row){
							var time="";
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "RepairClaiming"){
									time = moment(value[i].createDate).format("YYYY-MM-DD");
									break;
								}
							}
							return time;
	 					},
					},{
						key:"repairDetails",
						name:"派工用时",
	                    className:"oneColumn",
						format:function(value,row){
							var createDate;
							var dispatchdate;
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "Dispatch"){
									dispatchdate = value[i].createDate;
									break;
								}
							}
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "RepairClaiming"){
									createDate = value[i].createDate;
									break;
								}
							}
							return widget._getTime(createDate, dispatchdate);
						}
					},{
						key:"repairDetails",
						name:"维修用时",
	                    className:"oneColumn",
						format:function(value,row){
							var finishDate;
							var expectedDate;
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "Dispatch"){
									expectedDate = value[i].createDate;
									break;
								}
							}
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "Finished"){
									finishDate = value[i].createDate;
									break;
								}
							}
							return widget._getTime(expectedDate, finishDate);
						}
					},{
						key:"repairDetails",
						name:"确认用时",
						calssName:"oneColumn",
						format:function(value,row){
							var confirmTime;
							var repairTimeEnd;
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "Confirmed"){
									confirmTime = value[i].createDate;
									break;
								}
							}
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "Finished"){
									repairTimeEnd = value[i].createDate;
									break;
								}
							}
							return widget._getTime(repairTimeEnd, confirmTime);
						}
					},{
						key:"repairDetails",
						name:"维修总用时",
						calssName:"oneColumn",
						format:function(value,row){
							var confirmTime;
							var createDate;
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "Confirmed"){
									confirmTime = value[i].createDate;
									break;
								}
							}
							for(var i=0;i<value.length;i++){
								if(value[i].operateType.key == "RepairClaiming"){
									createDate = value[i].createDate;
									break;
								}
							}
							return widget._getTime(createDate, confirmTime);
						}
					},{
						key:"flowStatus.value",
						calssName:"oneColumn",
						name:"状态"
					}]
				}
			});
            this.set("list",grid);
		}
	});
	module.exports = repairTime;
});