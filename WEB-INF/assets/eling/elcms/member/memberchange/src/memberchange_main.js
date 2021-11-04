/**
 * 会员变更管理
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var template= require("./assets/tpl/memberchange_main.tpl");
	require("./assets/css/memberchange_main.css");
	var memberchange_subnav= require("./component/memberchangeSubnavComp.js");
	var memberchange_grid= require("./component/memberchangeGridComp.js");
	var memberchange_form= require("./component/memberchangeFormComp.js");
	var memberchange_membergrid= require("./component/memberchangeMemberGridComp.js");
    var memberchange = ELView.extend({
    	 attrs:{
         	template:template
         },
         events:{
        	"change .J-form-memberchange_form-select-memberSigning":function(e){
        		var widget=this;
        		var form = widget.get("form");
        		var membergrid =widget.get("membergrid");
        		var memberSigning= form.getPlugin("memberSigning").getData(form.getValue("memberSigning"));
        		//form 赋值
        		var personalCardowners ="";
        		for ( var i in memberSigning.membershipContract.personalCardowners) {
        			personalCardowners += memberSigning.membershipContract.personalCardowners[i].personalInfo.name+ ",";
				}
        		form.setValue("memberSigning.membershipContract.membershipCard.name",memberSigning.membershipContract.membershipCard.name);
        		form.setValue("memberSigning.signDate",memberSigning.signDate);
        		form.setValue("personalCardowners",personalCardowners.substring(0, personalCardowners.length-1));
        		form.setValue("memberSigning.checkInDate",memberSigning.checkInDate);
        		//加载会员列表
        		var memberitems =[];
        		for ( var i in memberSigning.members) {
					var member =memberSigning.members[i];
					if(member.status.key !="Checkout"){
						var item ={
								member:member,
								changeTime:moment().valueOf()
						}
						memberitems.push(item);
					}
				}
        		//如果只有一个会员补入一个空数据
        		if(memberitems.length == 1){
        			var item ={
							changeTime:moment().valueOf()
					}
        			memberitems.push(item);
        		}
        		
        		membergrid.setData(memberitems);
        		//查询服务费
        		aw.ajax({
					url:"api/annualfees/query",
					data:{
						memberSigning:memberSigning.pkMemberSigning,
						endDate:form.getValue("changeDate"),
						chargeStatus:"Receiving",
						refund:false,
						fetchProperties:"realAnnualFees"
					},
					dataType:"json",
					success:function(data){
	                	var hisAnnualFees =0;
	                	for ( var i in data) {
	                		hisAnnualFees +=data[i].realAnnualFees;
						}
	                	form.setValue("hisAnnualFees",hisAnnualFees);
					},
				});
        		
        	},
        	"change .J-form-memberchange_form-radio-carryOver":function(e){
        		var widget=this;
        		var form = widget.get("form");
        		var carryOver =form.getValue("carryOver");
        		form.setReadonly("carOverFees",!carryOver);
        		var memberSigning= form.getPlugin("memberSigning").getData(form.getValue("memberSigning"));
        		if(!form.getValue("changeDate")){
        			return
        		}
        		if(!memberSigning){
        			return
        		}
        		if(carryOver){
        			//查询服务费
            		aw.ajax({
    					url:"api/annualfees/query",
    					data:{
    						memberSigning:memberSigning.pkMemberSigning,
    						endDate:form.getValue("changeDate"),
    						chargeStatus:"Receiving",
    						refund:false,
    						fetchProperties:"realAnnualFees"
    					},
    					dataType:"json",
    					success:function(data){
    	                	var hisAnnualFees =0;
    	                	for ( var i in data) {
    	                		hisAnnualFees +=data[i].realAnnualFees;
    						}
    	                	form.setValue("hisAnnualFees",hisAnnualFees);
    					},
    				});
        		}
        	},
        	"change .J-form-memberchange_form-date-changeDate":function(e){
        		var widget=this;
        		var form = widget.get("form");
        		var memberSigning= form.getPlugin("memberSigning").getData(form.getValue("memberSigning"));
        		if(!form.getValue("changeDate")){
        			return
        		}
        		if(!memberSigning){
        			return
        		}
        		//查询服务费
        		aw.ajax({
					url:"api/annualfees/query",
					data:{
						memberSigning:memberSigning.pkMemberSigning,
						endDate:form.getValue("changeDate"),
						chargeStatus:"Receiving",
						refund:false,
						fetchProperties:"realAnnualFees"
					},
					dataType:"json",
					success:function(data){
	                	var hisAnnualFees =0;
	                	for ( var i in data) {
	                		hisAnnualFees +=data[i].realAnnualFees;
						}
	                	form.setValue("hisAnnualFees",hisAnnualFees);
					},
				});
        	}
        	 
         },
         initComponent:function(params,widget){
        	var subnav=memberchange_subnav.init(params,widget);
     		this.set("subnav",subnav);
     		
             var grid=memberchange_grid.init(params,widget);
             this.set("grid",grid);
             
             var form=memberchange_form.init(params,widget);
             this.set("form",form);
             
             var membergrid=memberchange_membergrid.init(params,widget);
             this.set("membergrid",membergrid);
         },
         
         afterInitComponent:function(params,widget){
        	 
         }
    });
    	module.exports = memberchange;
});