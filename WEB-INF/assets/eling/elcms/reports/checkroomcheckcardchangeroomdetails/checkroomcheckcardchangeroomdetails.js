define(function(require,exports,module){
	var ELView = require("elview");
	var aw=require("ajaxwrapper");
	var Subnav = require("subnav"); 
	var Tab = require("tab");
	var store =require("store");
	var activityUser =store.get("user");
	var saveCardGrid = require("./saveCardGrid");
	var andCardGrid = require("./andCardGrid");
	var changeGrid= require("./changeGrid");
	var checkroomcheckcardchangeroomdetails=ELView.extend({
		attrs : {
			template : "<div class='el-checkroomcheckcardchangeroomdetails'>" +
						"<div class='J-subnav'></div>"+
						"<div class='J-tab' style='width: 100%;overflow-x: scroll;'></div>" +
						"</div>"
		},
		
		_loadData:function(widget){
			widget.get("saveCardGrid").refresh();
			widget.get("andCardGrid").refresh();
			widget.get("changeGrid").refresh();
		},
		
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode : ".J-subnav",
				model:{
					title:"退房退卡明细表",
					items:[{
	     				   id:"building",
	     				   type:"buttongroup",
	     				   tip : "楼宇",
	     				   all : {
								show : true,
								text : "全部"
							},
	     				   items :activityUser.buildings,
	     				   keyField:"pkBuilding",
	     				   valueField:"name",
	    				   handler:function(key,element){
	    					   widget._loadData(widget);
	    				   }  
						},{
							id : "date",
							type : "daterange",
							ranges : {
								"今年": [moment().startOf("year"),moment().endOf("year")],
								"去年": [moment().startOf("year").subtract(1,"year"), moment().endOf("year").subtract(1,"year")],
								"前年": [moment().startOf("year").subtract(2,"year"), moment().endOf("year").subtract(2,"year")]
							},
							defaultRange : "今年",
							minDate: "1930-05-31",
							maxDate: "2020-12-31",
							handler : function(time){
								 widget._loadData(widget);
							},
							tip : "时间范围"
						},{
	                        id : "toexcel",
	                        text : "导出",
	                        type : "button" ,
	                        handler : function(){
	                        	var pkBuilding= widget.get("subnav").getValue("building");
	                        	var start=moment(subnav.getValue("date").start).format("YYYY-MM-DD");
								var end =moment(subnav.getValue("date").end).format("YYYY-MM-DD");
								var url = "";
	                           if($(".tabbable li[class='active']>a").attr("href")== "#saveCardGrid"){
	                        	  url="api/checkroomsavecarddetail/toexcel?"
	                           }else if($(".tabbable li[class='active']>a").attr("href")== "#andCardGrid"){
	                        	   url="api/checkroomandcarddetail/toexcel?"
	                           }else{
	                        	   url="api/changeroomdetail/toexcel?"
	                           }
	                        	window.open(url+"pkBuilding="+pkBuilding+"&start="+start+"&end="+end);
	                        	return false
	                        }
	                    }]
				}
			});
			this.set("subnav",subnav);
			
			var tab = new Tab({
				parentNode : ".J-tab",
				autoRender : true,
				model : {
					items:[{
						id : "saveCardGrid",
						title : "退房留卡"
					},{
						id : "andCardGrid",
						title : "退房退卡"
					},{
						id : "changeGrid",
						title : "换房"
					}]
				}
			});
			
			this.set("saveCardGrid",saveCardGrid.init(this,{
				parentNode : "#saveCardGrid"
			}));
			this.set("andCardGrid",andCardGrid.init(this,{
				parentNode : "#andCardGrid"
			}));
			this.set("changeGrid",changeGrid.init(this,{
				parentNode : "#changeGrid"
			}));
			$(".el-tab .row:first").css("width","3500px");
			
		},
	});
	
	module.exports=checkroomcheckcardchangeroomdetails;
});