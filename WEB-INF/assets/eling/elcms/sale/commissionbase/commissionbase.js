define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav=require("subnav");
	var Grid = require("grid");
	var Form = require("form");
	var Dialog=require("dialog");
	var enums  = require("enums");
	require("./commissionbase.css");
	var template="<div class='el-commissionbase'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-grid'></div>"+
	"<div class='J-form hidden'></div>"+
	"</div>";
	var commissionbase = ELView.extend({ 
		events:{
			"change .J-form-commissionBase-select-checkInType":function(e){
				var form=this.get("form");
				var checkInType = form.getValue("checkInType");
				if(checkInType == "NotIn"){
					 form.setDisabled("type",true);
					 form.setValue("type","");
				}else{
					form.setDisabled("type",false);
				}
			}
		},
		attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"佣金基数设置",
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
        			 url : "api/commissionBase/query",
        			 params : function(){
        				  return {
        					  fetchProperties:"cardType.name,cardType.pkMemberShipCardType," +
        					  		"checkInType," +
        					  		"type.name," +
        					  		"type.pkRoomType," +
        					  		"promotecommission," +
        					  		"effectivedate," +
        					  		"description," +
        					  		"pkCommissionBase," +
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
        				 name : "type.name",
        				 label : "房型",
        				 className:"width_type",
        			 },{
        				 name : "promotecommission",
        				 label : "提佣基数",
        				 className:"width_promote",
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
								var checkInType = form.getValue("checkInType");
								if(checkInType == "NotIn"){
									form.setDisabled("type",true);
//									form.setValue("type","");
								}else{
									 form.setDisabled("type",false);
								}
								var cardType=form.getData("cardType");
								form.setData("cardType",cardType);
								form.setValue("cardType",data.cardType);
								var roomType=form.getData("type");
						   		widget.hide([".J-grid"]).show([".J-form"]);
							    subnav.hide(["add"]).show(["return"]);
	                           }
						},{
							id:"delete",
							text:"删除",
							handler:function(index,data,rowEle){
								aw.del("api/commissionBase/" + data.pkCommissionBase + "/delete",function(){
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
                	id:"commissionBase",
                    saveaction : function(){
                    	var form=widget.get("form");
                    	var data=form.getData();
                    	if(data.checkInType != "NotIn"){
							if(form.getValue("type") == null || form.getValue("type") == ""){
								Dialog.alert({
									content : "请选择房型" ,
								});
								return;
							}
                    	}
    					aw.saveOrUpdate("api/commissionBase/datecheck",aw.customParam(data),function(data){
							
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
						name:"pkCommissionBase",
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
                    	name:"type",
						label:"房型",
						type:"select",
						keyField:"pkRoomType",
						valueField:"name",
						url :"api/roomType/query",
						params : function(){
                            return {
                            	fetchProperties:"pkRoomType,name",
                            };
	                    },
                    },{
                    	name : "promotecommission",
                        label : "提佣基数",
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
        }, 
        afterInitComponent:function(params,widget){
        	
		}
	});
	module.exports=commissionbase;
});
