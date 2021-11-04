define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var Grid=require("grid-1.0.0");
	//多语
	var i18ns = require("i18n");
	var memberagesegment = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"+"<div class='J-Grid'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"入住概况及"+i18ns.get("sale_ship_owner","会员")+"情况统计",
					buttons:[{
						id:"refersh",
						text:"刷新",
						handler:function(){
							 widget.get("grid").refresh();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			var grid=new Grid({
				parentNode:".J-Grid",
				url:"api/checkin/forReport",
				model:{
					textAlign:"center",
					columns:[{
						key:"building",
						name:"楼号 "
					},{
						key:"room.totalNumber",
						name:"公寓总数 "
					},{
						key:"room.occupy",
						name:i18ns.get("cm_room_control","占用")+"数"
					},{
						key:"room.empty",
						name:"空房数"
					},{
						key:"room.outRoomMaintenance",
						name:"退房维修数"
					},{
						key:"member.houses",
						name:"签约户数"
					},{
						key:"room.checkIn",
						name:"已入住户数"
					},{
						key:"room.waitting",
						name:"预入住户数"
					},{
						key:"room.notLive",
						name:"选房不住"
					},{
						key:"member.total",
						name: i18ns.get("sale_ship_owner","会员")+"总数"
					},{
						key:"member.checkintotal",
						name:"入住"+i18ns.get("sale_ship_owner","会员")+"总数"
					},{
						key:"member.checkinman",
						name:"入住男"+i18ns.get("sale_ship_owner","会员")+"数"
					},{
						key:"member.checkinwomen",
						name:"入住女"+i18ns.get("sale_ship_owner","会员")+"数"
					},{
						key:"member.waittingtotal",
						name:"预入住总数"
					},{
						key:"member.passAway",
						name:"过世总数"
					}]
				}
			});
			this.set("grid",grid);
		}
	});
	module.exports = memberagesegment;
});