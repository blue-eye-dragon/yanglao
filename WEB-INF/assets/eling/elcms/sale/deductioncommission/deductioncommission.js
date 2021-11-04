define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav=require("subnav");
	var Grid = require("grid");
	var Form = require("form");
	var Dialog=require("dialog");
	require("./deductioncommission.css");
	var template="<div class='el-deductioncommission'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-grid'></div>"+
	"<div class='J-form hidden'></div>"+
	"</div>";
	var deductioncommission = ELView.extend({
		attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"扣佣基数设置",
        			items:[{
        			   id:"add",
					   type:"button",
					   text:"新增",
					   handler:function(key,element){
						   form.reset();
						   widget.hide([".J-grid"]).show([".J-form"]);
						   subnav.hide(["add"]).show(["return"]);
					   }
        			},{
        				id : "return",
                        type:"button",
                        text : "返回",
                        show:false,
                        handler : function(){
                        	widget.hide([".J-form"]).show([".J-grid"]);
							subnav.hide(["return"]).show(["add"]);
                        }
        			}]
        		}
        	});
        	this.set("subnav",subnav);
        	var grid = new Grid({
        		parentNode : ".J-grid",
        		model:{
        			url : "api/deductionCommission/query",
        			params : function(){
      				  return {
      					fetchProperties:"cardType.name,cardType.pkMemberShipCardType," +
				  		"checkInType," +
				  		"checkmonth," +
				  		"deductproportion," +
				  		"effectivedate," +
				  		"description," +
				  		"pkDeductionCommission," +
				  		"version"
                      };
      			    },
      			    columns:[{
      			    	name : "cardType.name",
                        label : "会籍卡类型",
                        className:"width_card",
      			    },{
      			    	name : "checkInType.value",
        				label : "入住类型",
        				className:"width_checkIn",
      			    },{
      			    	name : "deductproportion",
        				label : "扣除已发佣金比例",
        				format:function(value,row){
        					return value+"%";
        				},
        				className:"width_deductproportion",
      			    },{
      			    	name : "effectivedate",
       				    label : "生效日期",
       				    format: "date",
       				    className:"width_effective",
      			    },{
      			    	name : "description",
       				    label : "备注",
       				    className:"width_description",
      			    },{
       				    name : "operate",
       				    label : "操作",
       				    format:"button",
       				    className:"width_op",
       				    formatparams:[{
       					  id : "edit",
       					  text:"修改",
							  handler : function(index,data,rowEL){
								  form.reset();
								  form.setData(data);
						   		  widget.hide([".J-grid"]).show([".J-form"]);
							      subnav.hide(["add"]).show(["return"]);
	                             }
						  },{
							  id:"delete",
							  text:"删除",
							  handler:function(index,data,rowEle){
							  	  aw.del("api/deductionCommission/" + data.pkDeductionCommission + "/delete",function(){
									  widget.get("grid").refresh();
								  });
							  }						
						 }]
      			    }]
        		}
        	});
        	this.set("grid",grid);
        	var form = new Form({
        		parentNode : ".J-form",
        		model : {
        			id:"deductioncommission",
        			saveaction : function(){
                    	var form=widget.get("form");
                    	var data=form.getData();
                    	var deductproportion = widget.get("form").getValue("deductproportion");
                    	if(!(0 <= Number(deductproportion) &&  Number(deductproportion) <= 100)){
    						Dialog.alert({
    							content : "扣佣比例只能为0-100的数字！"
    						 });
    						return false;
    					}
    					aw.saveOrUpdate("api/deductionCommission/datecheck1",aw.customParam(data),function(data){
							if(data.msg == "已存在"){
								Dialog.alert({
									content : "已存在" ,
								});
								return;
							}else{
								widget.get("grid").refresh();
								widget.hide([".J-form"]).show([".J-grid"]);
								subnav.hide(["return"]).show(["add"]);
							}
    					});
                    },
        			cancelaction : function(){
        				widget.get("form").reset();
                    	widget.hide([".J-form"]).show([".J-grid"]);
						subnav.hide(["return"]).show(["add"]);
        			},
        			items : [{
        				name:"pkDeductionCommission",
						type:"hidden"
        			},{
        				name :"version",
						defaultValue:0,
						type:"hidden"
        			},{
        				name : "cardType",
                        label : "会籍卡类型",
                        type:"select",
                        keyField:"pkMemberShipCardType",
                        valueField:"name",
                        url:"api/cardtype/query",
                        params : function(){
                            return {
                            	fetchProperties:"pkMemberShipCardType,name",
                            };
                        },
                        validate:["required"],
        			},{
        				name : "checkInType",
                        label : "入住类型",
                        type:"select",
                        url:"api/enum/com.eling.elcms.sale.model.MembershipContract.CheckInType",
                        validate:["required"],
        			},{
        				name : "deductproportion",
                        label : "扣除已发佣金比例",
                        validate:["required"],
        			},{
        				name : "effectivedate",
                        label : "生效时间",
                        type:"date",
                        validate:["required"],
        			},{
        				name : "description",
                    	label : "备注",
                    	type : "textarea",
        			}]
        		}
        	});
            this.set("form",form);
        }
	});
	module.exports=deductioncommission;
});
