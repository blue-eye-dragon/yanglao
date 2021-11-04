define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav"); 
	var Grid = require("grid");
	var aw = require("ajaxwrapper");
	var tpl=require("./capitaldaily.tpl");
	var capitaldaily = ELView.extend({
		attrs:{
        	template:tpl,
        	model:{
        		data:{}
        	}
        },
        events:{
        	"click .J-a-detail":function(e){
        		var widget = this;
        		var subnav =widget.get("subnav");
        		var date = moment(subnav.getValue("date")).format("YYYYMM")
        		var grid = widget.get("grid");
        		var data =grid.getData(grid.getIndex(e.target));
        		$(".J-detail").attr("data-fid",data.fid);
        		if(!data.capital){
        			return;
        		}
        		if(!data.fid){
        			return
        		}
        		var company ="公司名称:"+data.company;
        		var datestr = moment(subnav.getValue("date")).format("YYYY年MM月DD日")
        		var money = "金额："+(data.capital).toFixed(2)+"元";
        		$(".J-detail").attr("data-company",company);
        		$(".J-detail").attr("data-datestr",datestr);
        		$(".J-detail").attr("data-money",money);
        		aw.ajax({
        			url:"api/kingdee/queryDetail",
        			data:{
        				fid:"'"+data.fid+"'",
        				date:moment(subnav.getValue("date").start).subtract(1, "M").format("YYYYMM"),
        				start:moment(subnav.getValue("date")).format("YYYY-MM-DD HH:mm:ss"),
        				end:moment(subnav.getValue("date")).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        				monthStart:moment(subnav.getValue("date").start).startOf("month").format("YYYY-MM-DD HH:mm:ss")
        			},
    				dataType:"json",
					success : function(data) {
						data.company=company;
						data.datestr=datestr;
						data.money=money;
						var subnav =widget.get("subnav");
						var date = moment(subnav.getValue("date")).format("YYYYMM")
						$(".J-detail").attr("data-date",moment(subnav.getValue("date").start).subtract(1, "M").format("YYYYMM"));
						$(".J-detail").attr("data-start",moment(subnav.getValue("date")).format("YYYY-MM-DD HH:mm:ss"));
						$(".J-detail").attr("data-end",moment(subnav.getValue("date")).endOf("day").format("YYYY-MM-DD HH:mm:ss"));
						$(".J-detail").attr("data-monthStart",moment(subnav.getValue("date").start).startOf("month").format("YYYY-MM-DD HH:mm:ss"));
						widget.get("model").data = data;
						widget.renderPartial(".J-detail");
						subnav.hide("date").show("return");
						widget.hide(".J-grid").show(".J-detail");
					}	
        		})
        	}
		},  
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
					title:"货币资金日报表",
					items:[{
						id:"return",
						type : "button",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-grid").hide(".J-detail");
			        		widget.get("subnav").show("date").hide("return").show("toexcel");
						}
					},{
						id:"date",
						type : "date",
						tip:"日期",
						handler:function(){
							widget.get("grid").refresh()
						}
					},{
						id:"toexcel",
						type:"button",
						text:"导出",
						handler:function(){
							if($(".J-grid").is(":hidden")==false){
							var subnav = widget.get("subnav");
			        		var date = moment(subnav.getValue("date")).subtract(1, "month").format("YYYYMM");
			        		var start = moment(subnav.getValue("date")).startOf("month").format("YYYY-MM-DD HH:mm:ss");
			        		var end = moment(subnav.getValue("date")).endOf("day").format("YYYY-MM-DD HH:mm:ss");
							window.open("api/kingdee/toexcel?date="+date+"&start="+start
									+"&end="+end);
							return false;
							   }
							else{
								var fid = $(".J-detail").attr("data-fid")
								var monthStart =$(".J-detail").attr("data-monthStart");
								var date  = $(".J-detail").attr("data-date");
								var start = $(".J-detail").attr("data-start");
								var end = $(".J-detail").attr("data-end");
								var company = $(".J-detail").attr("data-company");
				        		var datestr= $(".J-detail").attr("data-datestr");
				        		var money = $(".J-detail").attr("data-money");
							window.open("api/kingdee/toexcels?date="+date+"&start="+start
									+"&end="+end+"&fid="+fid+"&monthStart="+monthStart+"&company="+company
									+"&datestr="+datestr+"&money="+money);
							return false;
								}
							}
							
							
					}]
				}
        	});
        this.set("subnav",subnav);
        
        var grid=new Grid({
        	parentNode:".J-grid",
        	url : "api/kingdee/query",
        	params:function(){
        		var subnav = widget.get("subnav");
        		var date = moment(subnav.getValue("date")).subtract(1, "month").format("YYYYMM")
        		var start = moment(subnav.getValue("date")).startOf("month").format("YYYY-MM-DD HH:mm:ss")
        		var end = moment(subnav.getValue("date")).endOf("day").format("YYYY-MM-DD HH:mm:ss")
        		return {
        			date:date,
        			start:start,
        			end:end
        		}
        	},
			model:{
				columns:[
				{
					name:"company",
					label:"单位"
				},{
					name:"capital",
					label:"资金余额",
					format:function(value,row){
						if(value){
							value = value.toFixed(2)
						}
						return "<a href='javascript:void(0);' class='J-a-detail' data-fid='1' style='color:red;text-align:center'>"+value+"</a>";
					}
				}]
			}
        });
        this.set("grid",grid);
        }
	})
	module.exports = capitaldaily;
	});