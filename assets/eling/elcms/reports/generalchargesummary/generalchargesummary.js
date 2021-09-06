define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav=require("subnav");
	var Tab=require("tab");
	var Summarystatistics = require("./summarystatistics");
	var Servicestatistics = require("./servicestatistics");
	var template="<div class='el-generalchargesummary'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-tab'></div>"
	"</div>";
	var generalchargesummary = ELView.extend({
		attrs:{
        	template:template
        },
        events : {
			"click .nav>li":function(e){
				if($(e.currentTarget).find("a").attr("href")=="#serviceStatistics"){
					this.get("tab").setActive($(e.currentTarget).prevAll().size());
					this.get("subnav").show(["generalServiceItem"]);
					var year = this.get("subnav").getValue("year");
					var generalServiceItem = this.get("subnav").getText("generalServiceItem");
					var title = moment(year).format("YYYY年通用收费")+generalServiceItem+("服务统计");
				    this.get("subnav").setTitle(title);
					//this.get("servicestatistics").refresh();
				    this.get("servicestatistics").refresh(null,function(){
	    				$(".J-reportgrid-table thead tr th:first").text("楼栋").css("text-align","center");
	    			});
					//this.get("summarystatistics").refresh(); 
					return false;
				}else{
					this.get("tab").setActive($(e.currentTarget).prevAll().size());
					this.get("subnav").hide(["generalServiceItem"]);
					var year = this.get("subnav").getValue("year");
					var title = moment(year).format("YYYY年通用收费汇总统计");
				    this.get("subnav").setTitle(title);
					this.get("summarystatistics").refresh(); 
					this.get("summarystatistics").refresh(null,function(){
		    				$(".J-reportgrid-table thead tr th:first").text("楼栋").css("text-align","center");
		    		});
					//this.get("servicestatistics").refresh();
					return false;
				}
			},
			
		},
        initComponent:function(params,widget){
        	var years=[];
			for(var i=0;i<=10;i++){
				var obj={};
				obj.key=(parseInt(moment().format("YYYY"))-5)+i;
				obj.value=(parseInt(moment().format("YYYY"))-5)+i;
				years.push(obj);
			}
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"通用收费汇总",
        			items : [{
        				id:"generalServiceItem",
        				tip:"服务项目",
        				type : "buttongroup",
        				keyField :"pkGeneralServiceItem",
        				valueField:"name",
        				url:"api/generalServiceItem/query",
        				autoRender:false,
        				params:{
        					fetchProperties:"pkGeneralServiceItem,name,state",
        				},
        				show : false,
        				handler:function(key,element){
        					var year = widget.get("subnav").getValue("year");
        					var generalServiceItem = widget.get("subnav").getText("generalServiceItem");
        					var title = moment(year).format("YYYY年通用收费")+generalServiceItem+("服务统计");
        				    widget.get("subnav").setTitle(title);
        					widget.get("servicestatistics").refresh();
        					//widget.get("summarystatistics").refresh(); 
        				}
        			},{
        				id:"year",
        				tip:"年份",
        				type : "buttongroup",
        				items:years,
        				handler:function(key,element){
        					var year = widget.get("subnav").getValue("year");
        					var s = widget.get("tab").getActive()
        					if(s==0){
        						var title = moment(year).format("YYYY年通用收费汇总统计");
            					widget.get("subnav").setTitle(title);
        					}else{
	        					var generalServiceItem = widget.get("subnav").getText("generalServiceItem");
	        					var title = moment(year).format("YYYY年通用收费")+generalServiceItem+("服务统计");
	        					widget.get("subnav").setTitle(title);
        				    }
        					widget.get("servicestatistics").refresh(null,function(){
        	    				$(".J-reportgrid-table thead tr th:first").text("楼栋").css("text-align","center");
        	    			});
        					widget.get("summarystatistics").refresh(null,function(){
        	    				$(".J-reportgrid-table thead tr th:first").text("楼栋").css("text-align","center");
        	    			}); 
 					   }
        			}]
        		}
        	});
            this.set("subnav",subnav);
            
            var tab = new Tab({
				parentNode:".J-tab",
				autoRender : true,
				model:{
					items:[{
						id:"summaryStatistics",
						title:"汇总统计"
					}
//					,{
//						id:"serviceStatistics",
//						title:"服务统计"
//					}
					]
				}
			});
            this.set("tab",tab);
            
            var summarystatistics=Summarystatistics.init(this,{
				parentNode : "#summaryStatistics",
			});
            this.set("summarystatistics",summarystatistics);
            
            var servicestatistics=Servicestatistics.init(this,{
            	parentNode : "#serviceStatistics",
            });
            this.set("servicestatistics",servicestatistics);
        },
        setEpitaph:function(){
        	var subnav = this.get("subnav");
        	return {
				"generalServiceItem":subnav.getValue("generalServiceItem"),
				 year:subnav.getValue("year"),
				 flg:this.get("tab").getActive(),
    		}
        },
        afterInitComponent:function(params,widget){
        	//设置交叉报表的第一个格显示 楼栋
        	//$(".J-reportgrid-table tr th:first").text("楼栋").css("text-align","center")
        	if(params!=""){
        		widget.get("subnav").setValue("year",params.year);
        		if(params.flg == 1){
        			widget.get("subnav").load("generalServiceItem",{callback:function(data){
    					if (params.generalServiceItem){
    	        			widget.get("subnav").show(["generalServiceItem"]);
    						widget.get("subnav").setValue("generalServiceItem", params.generalServiceItem);
    						widget.get("tab").$("li").eq(1).trigger("click");
    						widget.get("servicestatistics").refresh(null,function(){
    							$(".J-reportgrid-table thead tr th:first").text("楼栋").css("text-align","center");
    						})
    					}
    				  }
    			    });
        		}else{
        			//widget.get("subnav").setValue("year",moment().year());
        			var title=moment(params.year).format("YYYY年通用收费汇总统计");
        		    widget.get("subnav").setTitle(title);
        		    widget.get("summarystatistics").refresh(null,function(){
        				$(".J-reportgrid-table thead tr th:first").text("楼栋").css("text-align","center");
        			});
        		}
        		//widget.get("servicestatistics").refresh();
        	}else{
        		widget.get("subnav").setValue("year",moment().year());
    			var title=moment(params.year).format("YYYY年通用收费汇总统计");
    		    widget.get("subnav").setTitle(title);
    		    widget.get("summarystatistics").refresh(null,function(){
    				$(".J-reportgrid-table thead tr th:first").text("楼栋").css("text-align","center");
    			});
    			widget.get("servicestatistics").refresh(null,function(){
    				$(".J-reportgrid-table thead tr th:first").text("楼栋").css("text-align","center");
    			});
        	}
		},
	});
	module.exports = generalchargesummary;
});