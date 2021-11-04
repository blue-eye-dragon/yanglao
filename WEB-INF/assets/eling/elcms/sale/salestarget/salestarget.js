/**
 * 销售指标设置
 * @author zp
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var Form = require("form");
	var salestargetcss=require("./salestarget.css");
	var template="<div class='el-salestarget'>"+
			 "<div class='J-subnav'></div>"+
			 "<div class='J-grid'></div>" +
			 "<div class='J-form hidden'></div>" +
			 "</div>";
	var years=[];
	for(var i=-5;i<=0;i++){
		years.push({
			key:moment().add(i,'year').year(),
			value:moment().add(i,'year').year()
		});
	}
	for(var i=1;i<=5;i++){
		years.push({
			key:moment().add(i,'year').year(),
			value:moment().add(i,'year').year()
		});
	}

    var salestarget = ELView.extend({
        attrs:{
        	template:template
        },
        events:{},
        initComponent:function(params,widget){
        	var subnav=new Subnav({
			parentNode:".J-subnav",
               model:{
            	    title:"销售指标设置",
            	    items : [{
						id : "search",
						type : "search",
						placeholder : "置业顾问",
						handler : function(str){
							var g=widget.get("grid");
    						g.loading();
    						aw.ajax({
    							url:"api/salestarget/search",
    							data:{
    								s:str,
    								"orderString":"effectiveDate:desc",
    								searchProperties:"salesUser.name",
    								fetchProperties:"pkSalesTarget," +
					                    			"salesUser," +
					                    			"salesUser.pkUser," +
					                    			"salesUser.name," +
					                    			"effectiveDate," +
					                    			"januaryTarget," +
					                    			"februaryTarget," +
					                    			"marchTarget," +
					                    			"apirlTarget," +
					                    			"mayTarget," +
					                    			"juneTarget," +
					                    			"julyTarget," +
					                    			"augustTarget," +
					                    			"septemberTarget," +
					                    			"octoberTarget," +
					                    			"novemberTarget," +
					                    			"decemberTarget," +
					                    			"yearTarget," +
					                    			"description," +
					                    			"version",
    							},
    							dataType:"json",
    							success:function(data){
    								g.setData(data);
    							}
    						});
						}
					},{
						id:"time",
						type : "buttongroup",
						tip:"生效年份",
						items:years,
						handler:function(time){
							subnav.setValue("search","");
							widget.get("grid").refresh();
						}
					},{
						id : "add",
						type : "button",
						text : "新增",
						handler : function(){
							subnav.setValue("search","");
							widget.get("form").reset();
							widget.get("form").setValue("effectiveDate",subnav.getValue("time"));
							widget.hide([".J-grid"]).show(".J-form");
							subnav.hide(["add","time","search"]).show(["return"]);
						}
					},{
						id : "return",
						type : "button",
						show : false,
						text : "返回",
						handler : function(){
							widget.show([".J-grid"]).hide(".J-form");
							subnav.show(["add","time","search"]).hide(["return"]);
						}
					}]
               	 }
			});
			this.set("subnav",subnav);
    			
            var grid=new Grid({
        		parentNode:".J-grid",
        		autoRender:false,
                model:{
                	url : "api/salestarget/query",
	            	params : function(){
	            		var year=widget.get("subnav").getValue("time");
	            		var start=moment([year,00,01]);
	                    return {
	                    	"effectiveDate":start.valueOf(),
	                    	"orderString":"salesUser.name:desc",
	                    	fetchProperties:"pkSalesTarget," +
			                    			"salesUser," +
			                    			"salesUser.pkUser," +
			                    			"salesUser.name," +
			                    			"effectiveDate," +
			                    			"januaryTarget," +
			                    			"februaryTarget," +
			                    			"marchTarget," +
			                    			"apirlTarget," +
			                    			"mayTarget," +
			                    			"juneTarget," +
			                    			"julyTarget," +
			                    			"augustTarget," +
			                    			"septemberTarget," +
			                    			"octoberTarget," +
			                    			"novemberTarget," +
			                    			"decemberTarget," +
			                    			"yearTarget," +
			                    			"description," +
			                    			"version",
	                    };
	                },
                    columns:[{
                        name:"salesUser.name",
                        label:"置业顾问",
                        issort: true,
                        className:"name"
                    },{
						name:"effectiveDate",
						label:"生效年份",
						issort: true,
						format:function(value,row){
							return moment(value).year();    								
						},
						className:"date"
					},{
						name:"firstQuarter",
						label:"一季度指标",
						className:"firstQuarter",
						format:function(value,row){
							var total=0;
							if(row.januaryTarget){
								total+=row.januaryTarget;
							}
							if(row.februaryTarget){
								total+=row.februaryTarget;
							}
							if(row.marchTarget){
								total+=row.marchTarget;
							}
							return total;    								
						},
					},{
						name:"secondQuarter",
						label:"二季度指标",
						className:"secondQuarter",
						format:function(value,row){
							var total=0;
							if(row.apirlTarget){
								total+=row.apirlTarget;
							}
							if(row.mayTarget){
								total+=row.mayTarget;
							}
							if(row.juneTarget){
								total+=row.juneTarget;
							}
							return total;    								
						},
					},{
						name:"thirdQuarter",
						label:"三季度指标",
						className:"thirdQuarter",
						format:function(value,row){
							var total=0;
							if(row.julyTarget){
								total+=row.julyTarget;
							}
							if(row.augustTarget){
								total+=row.augustTarget;
							}
							if(row.septemberTarget){
								total+=row.septemberTarget;
							}
							return total;    								
						},
					},{
						name:"fourthQuarter",
						label:"四季度指标",
						className:"fourthQuarter",
						format:function(value,row){
							var total=0;
							if(row.octoberTarget){
								total+=row.octoberTarget;
							}
							if(row.novemberTarget){
								total+=row.novemberTarget;
							}
							if(row.decemberTarget){
								total+=row.decemberTarget;
							}
							return total;    								
						},
					},{
						name:"yearTarget",
						label:"年度总指标",
						className:"yearTarget",
					},{
						name:"description",
						label:"备注",
						className:"description",
					},{
						name:"operate",
						label:"操作",
						className:"operate",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"icon-edit",
							handler:function(index,data,rowEle){
								widget.get("subnav").setValue("search","");
								widget.show(".J-form").hide([".J-grid"]);
								widget.get("subnav").hide(["search","add","time"]).show(["return"]);
								var form=widget.get("form");
								form.reset();
								form.setData(data);
								form.setValue("effectiveDate",moment(data.effectiveDate).year());
								return false;
							}
						},{
							key:"delete",
							icon:"icon-remove",
							handler:function(index,data,rowEle){
								widget.get("subnav").setValue("search","");
								aw.del("api/salestarget/" + data.pkSalesTarget + "/delete",function(){
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
                    id : "target",
                    saveaction:function(){
            			var form =widget.get("form").getData();
            			var uasrName=widget.get("form").getData("salesUser");
            			var effectiveDate=widget.get("form").getValue("effectiveDate");
            			if(form.januaryTarget!=""&& (form.januaryTarget.indexOf(".") > 0||isNaN(form.januaryTarget))){
            				Dialog.alert({
            					content:"一月指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.februaryTarget!=""&& (form.februaryTarget.indexOf(".") > 0||isNaN(form.februaryTarget))){
            				Dialog.alert({
            					content:"二月指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.marchTarget!=""&& (form.marchTarget.indexOf(".") > 0||isNaN(form.marchTarget))){
            				Dialog.alert({
            					content:"三月指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.apirlTarget!=""&& (form.apirlTarget.indexOf(".") > 0||isNaN(form.apirlTarget))){
            				Dialog.alert({
            					content:"四月指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.mayTarget!=""&& (form.mayTarget.indexOf(".") > 0||isNaN(form.mayTarget))){
            				Dialog.alert({
            					content:"五月指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.juneTarget!=""&& (form.juneTarget.indexOf(".") > 0||isNaN(form.juneTarget))){
            				Dialog.alert({
            					content:"六月指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.julyTarget!=""&& (form.julyTarget.indexOf(".") > 0||isNaN(form.julyTarget))){
            				Dialog.alert({
            					content:"七月份指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.augustTarget!=""&& (form.augustTarget.indexOf(".") > 0||isNaN(form.augustTarget))){
            				Dialog.alert({
            					content:"八月份指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.septemberTarget!=""&& (form.septemberTarget.indexOf(".") > 0||isNaN(form.septemberTarget))){
            				Dialog.alert({
            					content:"九月份指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.octoberTarget!=""&& (form.octoberTarget.indexOf(".") > 0||isNaN(form.octoberTarget))){
            				Dialog.alert({
            					content:"十月份指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.novemberTarget!=""&& (form.novemberTarget.indexOf(".") > 0||isNaN(form.novemberTarget))){
            				Dialog.alert({
            					content:"十一月份指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.decemberTarget!=""&& (form.decemberTarget.indexOf(".") > 0||isNaN(form.decemberTarget))){
            				Dialog.alert({
            					content:"十二月份指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.yearTarget!=""&& (form.yearTarget.indexOf(".") > 0||isNaN(form.yearTarget))){
            				Dialog.alert({
            					content:"年度总指标只能填写整数!"
            				});
            				return false;
            			}
            			if(form.effectiveDate){
            				form.effectiveDate=moment([form.effectiveDate,00,01]).valueOf();
            			}
            			aw.saveOrUpdate("api/salestarget/save",aw.customParam(form),function(data){
            				if(data.msg=="该销售人员本年销售指标已设置"){
            					var name="";
            					for(var i=0;i<uasrName.length;i++){
            						if(form.salesUser==uasrName[i].pkUser){
            							name=uasrName[i].name;
            						}
            					}
            					Dialog.alert({
            						content : name+effectiveDate+"年销售指标已设置!"
            					 });
            					return false;
            				}
            				widget.show(".J-grid").hide(".J-form");
            				widget.get("subnav").show(["search","time","add"]).hide(["return"]);
            				widget.get("grid").refresh();
    					});
            			
            		},
            		cancelaction:function(){
            			widget.show(".J-grid").hide(".J-form");
        				widget.get("subnav").show(["search","time","add"]).hide(["return"]);
    				},
                    items : [{
                    	name : "pkSalesTarget",
                        type : "hidden",
                    },{
                        name : "version",
                        type : "hidden",
                        defaultValue : 0
                    },{
                        name : "salesUser",
                        type : "select",
                        label : "置业顾问",
                        keyField : "pkUser",
                        valueField : "name",
                        validate:["required"],
                        url : "api/salestarget/querysaleuser",
                        params : function(){
                            return {
                            	fetchProperties:"pkUser,name",
                            };
                        },
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                    	 name : "effectiveDate",
                         type : "select",
                         label : "生效年份",
                         options : years,
                         validate:["required"],
                         className:{
 							container:"col-md-6",
 							label:"col-md-5"
 						}
                    },{
                        name : "januaryTarget",
                        label : "一月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "februaryTarget",
                        label : "二月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "marchTarget",
                        label : "三月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "apirlTarget",
                        label : "四月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "mayTarget",
                        label : "五月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "juneTarget",
                        label : "六月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "julyTarget",
                        label : "七月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "augustTarget",
                        label : "八月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "septemberTarget",
                        label : "九月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "octoberTarget",
                        label : "十月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "novemberTarget",
                        label : "十一月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "decemberTarget",
                        label : "十二月份指标",
                        className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "yearTarget",
                        label : "年度总指标",
                        validate:["required"],
                        className:{
                        	container:"col-md-6",
							label:"col-md-5"
						}
                    },{
                        name : "description",
                        type : "textarea",
                        label : "备注",
                        exValidate: function(value){
							if(value.length>510){
								return "不能超过500个字符";
							}else{
								return true;
							}
						},
						className:{
							container:"col-md-6",
							label:"col-md-5"
						}
                    }]
                }
            });
            this.set("form",form);
        },
        afterInitComponent:function(params,widget){
    		var subnav=widget.get("subnav");
    		subnav.setValue("time",moment().year());
    		widget.get("grid").refresh();
		}
    });
    module.exports = salestarget;
});