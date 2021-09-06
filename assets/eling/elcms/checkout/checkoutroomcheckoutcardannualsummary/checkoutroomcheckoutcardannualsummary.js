/**
 * 疾病统计
 */
define(function(require,exports,module){
	var ELView = require("elview");
	var aw=require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0"); 
	var Tab = require("tab");
	var Grid = require("grid-1.0.0");
	//多语
	var i18ns = require("i18n");
	var CheckOutRoomAnnualDummary = require("./checkoutroomannualsummary");
	var CheckOutCardAnnualDummary = require("./checkoutcardannualsummary");
	var checkoutroomcheckoutcardannualsummary=ELView.extend({
		attrs : {
			template : "<div class='J-subnav'></div>"
				+ "<div class='J-tab'></div>"
		},
		events : {
			"click .nav>li":function(e){
				if($(e.currentTarget).find("a").attr("href")=="#checkoutroom"){
					this.get("subnav").show(["building","cardType","roomType","year"]).hide(["checkInType"]);
					return false;
				}else{
					this.get("subnav").show(["cardType","year","checkInType"]).hide(["roomType","building"]);
					return false;
				}
			}
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
				parentNode : ".J-subnav",
				model:{
					title:"退房、退卡年报",
					//新增按疾病类型查询
					buttonGroup:[{
     				   id:"building",
    				   showAll:true,
    				   showAllFirst:true,
    				   handler:function(key,element){
    					   widget.get("checkoutroomannualsummary").refresh();
    				   }  
					},{
						id:"cardType",
						tip:  i18ns.get("sale_card_type","卡类型"),
						key:"pkMemberShipCardType",
						showAll:true,
						showAllFirst:true,
						value:"name",
						url:"api/cardtype/query",
						handler:function(key,element){
							widget.get("checkoutroomannualsummary").refresh();
	    					widget.get("checkoutcardannualsummary").refresh();
						}
					},{
						id:"roomType",
						tip:"房间类型",
						key:"pkRoomType",
						showAll:true,
						showAllFirst:true,
						value:"name",
						url:"api/roomType/apartment",
						handler:function(key,element){
							widget.get("checkoutroomannualsummary").refresh();
						}
					},{
						id:"checkInType",
						tip:"入住类型",
						show:false,
						items:[{
							key:"",
							value:"全部"
						},{
							key:"CheckIn",
							value:"入住"
						},{
							key:"NotIn",
							value:"买卡不选房"
						},{
							key:"HouseingNotIn",
							value:"选房不入住"
						}],
						handler:function(key,element){
							widget.get("checkoutcardannualsummary").refresh();
						}
					},{
					   id:"year",
					   tip:"年份",
					   items:years,
					   handler:function(key,element){
						   widget.get("checkoutroomannualsummary").refresh();
    					   widget.get("checkoutcardannualsummary").refresh(); 
					   }
					}],
				}
			});
			this.set("subnav",subnav);
			var tab = new Tab({
				parentNode : ".J-tab",
				autoRender : true,
				model : {
					items:[{
						id : "checkoutroom",
						title : "退房年报"
					},{
						id : "checkoutcard",
						title : "退卡年报"
					}]
				}
			});
			
			this.set("checkoutroomannualsummary",CheckOutRoomAnnualDummary.init(this,{
				parentNode : "#checkoutroom",
			}));
			this.set("checkoutcardannualsummary",CheckOutCardAnnualDummary.init(this,{
				parentNode : "#checkoutcard",
			}));
		},
		afterInitComponent:function(params,widget){
			widget.get("subnav").setValue("year",moment().year());
			widget.get("checkoutroomannualsummary").refresh();
			widget.get("checkoutcardannualsummary").refresh();
		},
	});
	module.exports=checkoutroomcheckoutcardannualsummary;
});