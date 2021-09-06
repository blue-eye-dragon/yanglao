define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var store = require("store");
	var enums = require("enums");
	//多语
	var i18ns = require("i18n");
	var buildings = store.get("user").buildings
	var template="<div class='el-salescommission'>"+
			 "<div class='J-subnav'></div>"+
			 "<div class='J-grid'></div>" +
			 "</div>";

    var equityperson = ELView.extend({
        attrs:{
        	template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
			parentNode:".J-subnav",
               model:{
            	    title:"权益人查询",
            	    items : [{
            	    	id:"search",
            	    	type:"search",
            	    	placeholder : "合同号/权益人/"+i18ns.get("sale_ship_owner","会员"),
						handler : function(s){
							var  grid = widget.get("grid");
							aw.ajax({
								url:"api/membershipcontract/searchequityperson",
								data:{
									s:s,
									fetchProperties:""
								},
								datetype:"json",
								success:function(data){
									grid.setData(data);
								}
							})
						}
            	    },{
   						id:"building",
   						tip:"楼宇",
   						type:"buttongroup",
   						keyField:"pkBuilding",
   						all : {
							show : true,
							text : "全部"
						},
   						valueField:"name",
   						items : buildings,
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
   					},{
   						id:"chekintype",
   						tip:"入住类型",
   						all : {
							show : true,
							text : "全部"
						},
   						type:"buttongroup",
   						items : enums["com.eling.elcms.sale.model.MembershipContract.CheckInType"],
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
   					},{

						id : "date",
						type : "daterange",
						ranges : {
							"本年": [moment().startOf("year"), moment().endOf("year")],
   					 		"去年": [moment().subtract(1,"year").startOf("year"),moment().subtract(1,"year").endOf("year")],
   							"前年": [moment().subtract(2,"year").startOf("year"),moment().subtract(2,"year").endOf("year")],
						},
						defaultRange : "本年",
						minDate: "1930-05-31",
						maxDate: "2020-12-31",
						handler : function(time){
							widget.get("grid").refresh();
						},
						tip : "签约时间"
					
   					}]
               	 }
			});
			this.set("subnav",subnav);
    			
			var grid=new Grid({
				parentNode:".J-grid",
				model:{
					url:"api/membershipcontract/queryequityperson",
					params:function(){
					var subnav=widget.get("subnav");
					return {
						"pkBuilding":subnav.getValue("building"),
						"start":subnav.getValue("date").start,
						"end":subnav.getValue("date").end,
						"checkintype":subnav.getValue("chekintype")
					};
				},
				
					columns:[{
						key:"cardname",
						name: i18ns.get("sale_card_name","卡号"),
					},{
						key:"pname",
						name:"权益人",
					},{
						key:"mname",
						name:i18ns.get("sale_ship_owner","会员")+"姓名",
					},{
						key:"mobliephone",
						name:"电话",
					},{
						key:"building",
						name:"楼栋",
					},{
						key:"room",
						name:"房间号",
					},{
						key:"checkintype",
						name:"入住类型",
					},{
						key:"signDate",
						name:"签约时间",
						format:"date"
					},{
						key:"checkInDate",
						name:"入住时间",
						format:"date"
					}]
				}
			});
			this.set("grid",grid);
        },
    });
    module.exports = equityperson;
});