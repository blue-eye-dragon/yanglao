/**
 * 住院会员情况
 * elview
 */


define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Form =require("form-2.0.0")
	var param;
	//多语
	var i18ns = require("i18n");
	var template="<div class='el-memberbehospitalizedsituation'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"</div>";
	var memberbehospitalizedsituation = ELView.extend({
		attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"住院"+i18ns.get("sale_ship_owner","会员")+"情况",
                }
        	});
        	this.set("subnav",subnav); 
        	
        	var grid=new Grid({
        		parentNode:".J-Grid",
            	isInitPageBar:false,
            	url:"api/memberBehospitalizedSituation/query",
            	model:{
            		columns:[{
						key:"building",
						name:"楼宇"
					},{
						key:"nursingCount",
						name:"颐养",
						className: "text-right",
						format:"detail",
 						formatparams:[{
 							key:"Nursing",
							handler:function(index,data,rowEle){
								if(data.nursingCount == "0"){
									return false;
								}
								widget.openView({
									url:"eling/elcms/health/memberbehospitalizedsituation/memberbehospitalizedsituationopenview",
									params:{
										pkBuilding:data.pkBuilding,
										flag:"Nursing",
									},
									isAllowBack:true
								});
							}
 						}]
					},{
						key:"behospitalizedCountqhy",
						name:"住院(本社区医院)",
						className: "text-right",
						format:"detail",
 						formatparams:[{
 							key:"behospitalizedCountbsqcount",
							handler:function(index,data,rowEle){
								if(data.behospitalizedCountqhy == "0"){
									return false;
								}
								widget.openView({
									url:"eling/elcms/health/memberbehospitalizedsituation/memberbehospitalizedsituationopenview",
									params:{
										pkBuilding:data.pkBuilding,
										flag:"behospitalizedbsq",
									},
									isAllowBack:true
								});
							}
 						}]
					},{
						key:"behospitalizedCountwy",
						name:"住院（外院）",
						className: "text-right",
						format:"detail",
 						formatparams:[{
 							key:"behospitalizedCountwycount",
							handler:function(index,data,rowEle){
								if(data.behospitalizedCountwy == "0"){
									return false;
								}
								widget.openView({
									url:"eling/elcms/health/memberbehospitalizedsituation/memberbehospitalizedsituationopenview",
									params:{
										pkBuilding:data.pkBuilding,
										flag:"behospitalizedwy",
									},
									isAllowBack:true
								});
							}
 						}]
					},{

						key:"colTotal",
						name:"合计",
						className: "text-right",
						format:"detail",
 						formatparams:[{
 							key:"colTotalCount",
							handler:function(index,data,rowEle){
								if(data.colTotal == "0"){
									return false;
								}
								widget.openView({
									url:"eling/elcms/health/memberbehospitalizedsituation/memberbehospitalizedsituationopenview",
									params:{
										pkBuilding:data.pkBuilding,
										flag:"col",
									},
									isAllowBack:true
								});
							}
 						}]
					
					}]
            	}
            	
        	});
        	this.set("grid",grid);
        }
	});
	module.exports = memberbehospitalizedsituation;	
})