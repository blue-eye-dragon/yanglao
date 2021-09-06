define(function(require, exports, module) {
	var BaseView=require("baseview");
	//多语
	var i18ns = require("i18n");
	var Interest = BaseView.extend({
		initSubnav:function(widget){
			var min=moment().format("YYYY年MM月");
			return {
				model:{
					time:{
						click:function(time){
							widget.get("list").refresh();
						    var title="公寓月报："+moment(time.start).format("YYYY年MM月");
						    widget.get("subnav").setTitle(title);
						},
						ranges:function(){
							tmp = {};
							for(var i=0;i<6;i++){
								tmp[moment().subtract(i, "month").format("YYYY年MM月")] = [moment().startOf("month").subtract("month",i), moment().endOf("month").subtract("month",i)];	
								min=moment().subtract(i, "month").format("YYYY年MM月");
							}
							return tmp;
						}
					},
					title:min,
					buttons:[]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/report/apartmentmonthly",
				params:function(){
					var time=widget.get("subnav").getValue("time");
					return {
						starTime:time.start,
				    	endTime:time.end
					};
				},
				model:{
					columns:[{
						key:"buildingName",
						name:"楼号"
					},{
						key:"houses",
						name:i18ns.get("sale_ship_owner","会员")+"户数"
					},{
						key:"man",
						name:"男"+i18ns.get("sale_ship_owner","会员")
					},{
						key:"women",
						name:"女"+i18ns.get("sale_ship_owner","会员")
					},{
						key:"total",
						name:i18ns.get("sale_ship_owner","会员")+"总数"
					},{
						key:"aloneHouses",
						name:"独居户数"
					},{
						key:"housesMonth",
						name:"本月新增"+i18ns.get("sale_ship_owner","会员")+"户数"
					},{
						key:"totalMonth",
						name:"本月新增"+i18ns.get("sale_ship_owner","会员")+"数"
					},{
						key:"exchangeHousesMonth",
						name:"本月换房 户数"
					},{
						key:"outHousesMonth",
						name:"本月退房 户数"
					},{
						key:"outTotalMonth",
						name:"本月退房 人数"
					},{
						key:"diedManMonth",
						name:"本月过世男"+i18ns.get("sale_ship_owner","会员")
					},{
						key:"diedwomanMonth",
						name:"本月过世女"+i18ns.get("sale_ship_owner","会员")
					},{
						key:"diedTotalMonth",
						name:"本月过世"+i18ns.get("sale_ship_owner","会员")+"数"
					},{
						key:"diedTotalYearly",
						name:"年度过世"+i18ns.get("sale_ship_owner","会员")+"人数"
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			var time = widget.get("subnav").getValue("time");
			var titleinit="公寓月报："+moment(time.start).format("YYYY年MM月");
		    widget.get("subnav").setTitle(titleinit);
		}
	});
	module.exports = Interest;
});