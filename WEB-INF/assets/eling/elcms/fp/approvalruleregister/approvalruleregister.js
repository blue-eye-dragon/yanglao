define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var Form=require("form")
	var store = require("store");
	var activeUser = store.get("user");
	var template="<div class='J-subnav'></div>"+
 				"<div class='J-grid'></div>"+ 
 				"<div class='J-form hidden'></div>";
        var approvalruleregister  = ELView.extend({
        	events:{
        	},
            attrs:{
            	template:template
            },
            initComponent:function(params,widget){
        			var subnav=new Subnav({
        				parentNode:".J-subnav",
        				model:{
        					title:"审批规则设置",
        					items:[{
        						id:"return",
        						text:"返回",
        						type:"button",
        						show:false,
        						handler:function(){
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							widget.hide([".J-form"]).show(".J-grid");
        							subnav.hide(["return"]);
        						}
        					},{
        						id:"add",
        						text:"新增",
        						type:"button",
        						handler:function(){
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							form.reset();
        							widget.show([".J-form"]).hide(".J-grid");
        							subnav.hide(["return"]);
        						}
        					}],
        				}
    				});
        			this.set("subnav",subnav);
            		
                    var grid=new Grid({
                    	parentNode:".J-grid",
                    	url : "api/approvalruleregister/query",
                    	params:function(){
                    		return {
                        		fetchProperties:"pkApprovalRuleRegister," +
                        				"version," +
                        				"code," +
                        				"name," +
                        				"ruleClass"
                    		};
                    	},
                        model:{
                            columns:[{
                            	name:"name",
        						label:"描述"
                            },{
        						name:"ruleClass",
        						label:"设置时间"
        					},{
        						name:"operate",
        						label:"操作",
        						format:"button",
        						formatparams:[{
        							id:"edit",
        							icon:"icon-edit",
        							handler:function(index,data,rowEle){
        								var form= widget.get("form");
	        							var subnav= widget.get("subnav");
	        							form.reset();
										form.setData(data);
	        							widget.show([".J-form"]).hide(".J-grid");
	        							subnav.show(["return"]);
        							}
        						},{

        							id:"delete",
        							icon:"icon-remove",
        							handler:function(index,data,rowEle){
        								aw.del("api/card/" + data.pkMemberShipCard + "/delete",function(){
        									widget.get("grid").refresh();
        								});
        								return false;
        							}
        						
        						}]
        					}]
        				}
                    });
                    this.set("grid",grid);
                        
                    var form=new Form({
        				parentNode:".J-form",
        				model:{
        					id:"approvalRuleRegisterForm",
        					saveaction:function(){
        						aw.saveOrUpdate("api/approvalruleregister/save",$("#approvalRuleRegisterForm").serialize(),function(data){
        							var form= widget.get("form");
        							var subnav= widget.get("subnav");
        							widget.hide([".J-form"]).show(".J-grid");
        							subnav.hide(["return"]);
        							widget.get("grid").refresh();
        						});
        					},
        					cancelaction:function(){
        						var form= widget.get("form");
    							var subnav= widget.get("subnav");
    							widget.hide([".J-form"]).show(".J-grid");
    							subnav.hide(["return"]);
        					},
        					items:[{
        						name:"pkApprovalRuleRegister",
        						type:"hidden",
        					},{
        						name:"version",
        						defaultValue:"0",
        						type:"hidden"
        					},{
        						name:"name",
        						label:"名称",
        						validate:["required"]
        					},{
        						name:"ruleClass",
        						label:"规则实现类"
        					}]
        				}
        			});
        			this.set("form",form);
                },
        });
        module.exports = approvalruleregister ;
});
