define(function(require, exports, module) {
    var ELView=require("elview");
    var template=require("./check.tpl");
    
    var BuyMedicine_Subnav=require("./assets/buymedicine_subnav");
    var BuyMedicine_Grid=require("./assets/buymedicine_grid");
    var BuyMedicine_Paper_Grid=require("./assets/buymedicine_paper_grid");
    var BuyMedicine_Ticket_Grid=require("./assets/buymedicine_ticket_grid");
    var BuyMedicine_Medicine_Grid=require("./assets/buymedicine_medicine_grid");
    
    var BuyMedicine_Check = ELView.extend({
        attrs:{
        	template:template
        },
        initComponent:function(params,widget){
        	this.set("subnav",BuyMedicine_Subnav.init(params,widget));
        	this.set("grid",BuyMedicine_Grid.init(params,widget));
        	this.set("grid1",BuyMedicine_Paper_Grid.init(params,widget));  
        	this.set("grid2",BuyMedicine_Ticket_Grid.init(params,widget));
        	this.set("grid3",BuyMedicine_Medicine_Grid.init(params,widget));
        },
        getTotalMny:function(){
			//重新计算金额
			var grid=this.get("grid");
			var totalMny=0;
			var data=grid.getData() || [];
			for(var i=0;i<data.length;i++){
				totalMny+=data[i].money || 0;
			}
			totalMny=Math.round(totalMny*100)/100;
			grid.setTitle("合计支出金额："+totalMny+"元");
		}
    });
    module.exports = BuyMedicine_Check;
});