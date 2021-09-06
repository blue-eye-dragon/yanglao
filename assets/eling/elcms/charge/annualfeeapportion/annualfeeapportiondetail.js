/**
 * 服务费分摊
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog");
	var Form =require("form-2.0.0")
	var store = require("store");
	var activeUser = store.get("user");
	var param;
	var template="<div class='el-annualfeeapportiondetail'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid' style='width:50%'></div>"+
		"</div>";
	var annualfeeapportiondetail = ELView.extend({
    	attrs:{
    		template:template
        },
        thousand:function(data){
			var precision = data && data.precision !== undefined ? data.precision : 2;
			var value =  parseFloat(data);
			if(value !== undefined && value !== null && !isNaN(value)){
				value = value.toFixed(precision);
				value = value+"";
				return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
			}else{
				return "0.00";
			}
		},
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"服务费分摊明细",
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-Grid",
            	autoRender:false,
            	isInitPageBar:false,
				url:"api/annualfeeapportiondetail/query",
				model:{
					columns:[{
						key:"annualfeeApportion.annualFees.payer.memberSigning.room.number",
						name:"房间号",
						className: "text-center",
						format:"detail",
 						formatparams:[{
 							key:"detail",
							handler:function(index,data,rowEle){
								widget.openView({
									url:"eling/elcms/charge/annualfeeapportion/annualfeeapportion",
									params:{
										father:"annualfeeapportionstatistics",
										pkAnnualFeesApportion:data.annualfeeApportion.pkAnnualFeesApportion,
									},
									isAllowBack:true
								});
							}
 						}]
					},{
						key:"annualfeeApportion.annualFees.realAnnualFees",
						name:"服务费",
						className: "text-right",
						format:"thousands"
					},{
						key:"apportionMoney",
						name:"分摊金额",
						className: "text-right",
						format:"thousands"
					}]
				}
            });
            this.set("grid",grid);
        },
		afterInitComponent:function(params,widget){
			if(params&&params.year&&params.month){
				param=params;
				var title=moment(params.year+"-"+params.month).format("YYYY年MM月")+params.name+("服务费分摊明细");
				widget.get("subnav").setTitle(title);
				aw.ajax({
					url:"api/annualfeeapportiondetail/query",
					data:{
						"orderString":"annualfeeApportion.annualFees.payer.memberSigning.room.number",
						"annualfeeApportion.annualFees.payer.memberSigning.room.building.useType":"Apartment",
						"annualfeeApportion.annualFees.payer.memberSigning.room.building":params.pkBuilding,
						"date":moment(params.year+"-"+params.month).startOf("month").valueOf(),
						"dateEnd":moment(params.year+"-"+params.month).endOf("month").valueOf(),
						fetchProperties:"*,annualfeeApportion.endDate,annualfeeApportion.beginDate,"+
						"annualfeeApportion.annualFees.payer.memberSigning.room.number,"+
						"annualfeeApportion.annualFees.realAnnualFees," +
						"annualfeeApportion.annualFees.beginDate," +
						"annualfeeApportion.annualFees.endDate," +
						"annualfeeApportion.annualFees.payer.personalInfo.name," +
						"annualfeeApportion.annualFees.chargeTime"
						},
					dataType:"json",
					success:function(data){
						var apportionMoney=0;
						var realAnnualFees=0;
						for(var i=0;i<data.length;i++){
							apportionMoney+=data[i].apportionMoney;
							realAnnualFees+=data[i].annualfeeApportion.annualFees.realAnnualFees;
						}
						widget.get("grid").setData(data);
						widget.element.find(".J-grid-table").append("<tr data-idattribute><td class='J-date text-center'><pre>合计</pre></td><td class='J-annualfeeApportion text-right'><pre>"+widget.thousand(realAnnualFees)+"</pre></td><td class='J-apportionMoney text-right'><pre>"+widget.thousand(apportionMoney)+"</pre></td></tr>");
					}
				});
			}
		},
		//openview时设置缓存,保存当时所选时间
		setEpitaph : function(){
			return {
				year:param.year,
				month:param.month,
				pkBuilding:param.pkBuilding,
				name:param.name
			};
		}
	});
	module.exports = annualfeeapportiondetail;	
});
