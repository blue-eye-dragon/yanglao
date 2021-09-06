/**
 * 活动费用
 * @author zp
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var Form = require("form");
	var EditGrid=require("editgrid");
	var template="<div class='el-activityfees'>"+
			 "<div class='J-subnav'></div>"+
			 "<div class='J-grid'></div>" +
			 "<div class='J-form hidden'></div>" +
			 "<div class='J-detailGrid hidden'></div>"+
			 "</div>";
	require("../../grid_css.css");

    var activityfees = ELView.extend({
        attrs:{
        	template:template
        },
        events:{
        	"click .J-detail" : function(e){
				var widget = this;
				
				var grid= widget.get("grid");
				var index = grid.getIndex(e.target);
				var data = grid.getData(index);
				
				var form= widget.get("form");
				var subnav= widget.get("subnav");
				form.reset();
				form.setData(data);
				form.setValue("activity.activityEndTime",data.activity.activityEndTime);
				form.setValue("activity.activityStartTime",data.activity.activityStartTime);
				
				form.setDisabled(true);
				
				widget.get("detailGrid").setDisabled(true);
				widget.get("detailGrid").setData(data.activityFeesDetails);
				
				widget.show([".J-form",".J-detailGrid"]).hide(".J-grid");
				subnav.hide(["add","time"]).show(["return"]);
				$(".J-grid-detailGrid-del").addClass("hidden");
				
			},
        	"change .J-form-fees-select-activity":function(e){
        		var widget = this;
				var form= widget.get("form");
				
				var actdata=form.getData("activity");
				var actvalue=form.getValue("activity");
				for(var i=0;i<actdata.length;i++){
					if(actdata[i].pkActivity==actvalue){
						form.setValue("activity.activityEndTime",actdata[i].activityEndTime);
						form.setValue("activity.activityStartTime",actdata[i].activityStartTime);
						break;
					}
				}
			},
			
//			"change .J-form-fees-text-totalFees":function(e){
//        		var widget = this;
//				var form= widget.get("form");
//				var totalPopulation=form.getValue("totalPopulation");
//				var totalFees=form.getValue("totalFees");
//				if(totalPopulation!="" && totalFees!=""){
//					form.setValue("avgFees",(totalFees/totalPopulation).toFixed(2));
//				}else{
//					form.setValue("avgFees","");
//				}
//				var avgFees=form.getValue("avgFees");
//				var memberPopulation=form.getValue("memberPopulation");
//				var nonmemberPopulation=form.getValue("nonmemberPopulation");
//				if(memberPopulation!="" && avgFees!=""){
//					form.setValue("memberTotalFees",((avgFees)*memberPopulation*0.5).toFixed(2));
//				}else{
//					form.setValue("memberTotalFees","");
//				}
//				if(nonmemberPopulation!="" && avgFees!=""){
//					form.setValue("nonmemberTotalFees",((avgFees)*nonmemberPopulation).toFixed(2));
//				}else{
//					form.setValue("nonmemberTotalFees","");
//				}
//			},
			"change .J-form-fees-text-totalPopulation":function(e){
        		var widget = this;
				var form= widget.get("form");
				var totalPopulation=form.getValue("totalPopulation");
				var totalFees=form.getValue("totalFees");
				if(totalPopulation!="" && totalFees!=""){
					form.setValue("avgFees",(totalFees/totalPopulation).toFixed(2));
				}else{
					form.setValue("avgFees","");
				}
				var avgFees=form.getValue("avgFees");
				var memberPopulation=form.getValue("memberPopulation");
				var nonmemberPopulation=form.getValue("nonmemberPopulation");
				if(memberPopulation!="" && avgFees!=""){
					form.setValue("memberTotalFees",((avgFees)*memberPopulation*0.5).toFixed(2));
				}else{
					form.setValue("memberTotalFees","");
				}
				if(nonmemberPopulation!="" && avgFees!=""){
					form.setValue("nonmemberTotalFees",((avgFees)*nonmemberPopulation).toFixed(2));
				}else{
					form.setValue("nonmemberTotalFees","");
				}
			},
			"change .J-form-fees-text-memberPopulation ":function(e){
        		var widget = this;
				var form= widget.get("form");
				var avgFees=form.getValue("avgFees");
				var memberPopulation=form.getValue("memberPopulation");
				if(memberPopulation!="" && avgFees!=""){
					form.setValue("memberTotalFees",((avgFees)*memberPopulation*0.5).toFixed(2));
				}else{
					form.setValue("memberTotalFees","");
				}
			},
			"change .J-form-fees-text-nonmemberPopulation":function(e){
        		var widget = this;
				var form= widget.get("form");
				var avgFees=form.getValue("avgFees");
				var nonmemberPopulation=form.getValue("nonmemberPopulation");
				if(nonmemberPopulation!="" && avgFees!=""){
					form.setValue("nonmemberTotalFees",((avgFees)*nonmemberPopulation).toFixed(2));
				}else{
					form.setValue("nonmemberTotalFees","");
				}
			},
        },
        refreshActivitySelect : function(widget){
        	aw.ajax({
				url : "api/activityfees/queryactivity",
				type : "POST",
				data : {
					"type":"happiness",
                	fetchProperties:"pkActivity,theme,activityStartTime,activityEndTime",
				},
				success : function(datas) {
					widget.get("form").setData("activity",datas);
				}
			});
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
			parentNode:".J-subnav",
               model:{
            	    title:"活动费用",
            	    items : [{
						id:"time",
	                    type:"daterange",
	                    tip :"活动开始时间",
	                    ranges : {
					        "本月": [moment().startOf("month"), moment().endOf("month")]
						},
						defaultRange : "本月",
						handler:function(time){
							widget.get("grid").refresh();
						}
					},{
						id : "add",
						type : "button",
						text : "新增",
						handler : function(){
							widget.get("detailGrid").setDisabled(false);
							widget.get("form").reset();
							widget.get("detailGrid").setData([]);
							subnav.hide(["add","time"]).show(["return","save"]);
							widget.show([".J-detailGrid",".J-form"]).hide([".J-grid"]);
						}
					},{
        				id:"return",
        				type : "button",
        				text:"返回",
        				show:false,
        				handler:function(){
        					widget.show(".J-grid").hide([".J-form",".J-detailGrid"]);
							widget.get("subnav").hide(["return","save"]).show(["add","time"]);
							widget.get("grid").refresh();
        				}
					},{
						id:"save",
						type : "button",
						text : "保存",
						show:false,
						handler:function(){
							var data =widget.get("form").getData();
							var activity = data.activity;
	            			var totalPopulation = data.totalPopulation;
	            			var totalFees = data.totalFees;
	            			var memberPopulation = data.memberPopulation;
	            			var nonmemberPopulation = data.nonmemberPopulation;
	            			var avgFees = data.avgFees;
	            			var memberTotalFees = data.memberTotalFees;
	            			var nonmemberTotalFees = data.nonmemberTotalFees;
	            			if(!activity){
	    	     				Dialog.alert({
	    								content : "请选择活动！"
	    							 });
	    	     				return false;
	    	     			}
	            			if(!totalPopulation){
	    	     				Dialog.alert({
	    								content : "请输入参加活动人数！"
	    							 });
	    	     				return false;
	    	     			}
	            			if(!memberPopulation){
	    	     				Dialog.alert({
	    								content : "请输入会员人数！"
	    							 });
	    	     				return false;
	    	     			}
	            			if(totalPopulation&&(isNaN(totalPopulation) || totalPopulation<0 || parseInt(totalPopulation)!=totalPopulation)){
	    	     				Dialog.alert({
	    								content : "参加活动人数只能为正整数！"
	    							 });
	    	     				return false;
	    	     			}
	            			if(totalFees&&(isNaN(totalFees) || totalFees<0 )){
	    	     				Dialog.alert({
	    								content : "活动总费用只能为正数！"
	    							 });
	    	     				return false;
	    	     			}
	            			if(avgFees&&(isNaN(avgFees) || avgFees<0 )){
	    	     				Dialog.alert({
	    								content : "平均费用只能为正数！"
	    							 });
	    	     				return false;
	    	     			}
	            			if(memberTotalFees&&(isNaN(memberTotalFees) || memberTotalFees<0 )){
	    	     				Dialog.alert({
	    								content : "会员总费用只能为正数！"
	    							 });
	    	     				return false;
	    	     			}
	            			if(nonmemberTotalFees&&(isNaN(nonmemberTotalFees) || nonmemberTotalFees<0) ){
	    	     				Dialog.alert({
	    								content : "非会员总费用只能为正数！"
	    							 });
	    	     				return false;
	    	     			}
	            			if(memberPopulation&&(isNaN(memberPopulation) || memberPopulation<0 || parseInt(memberPopulation)!=memberPopulation)){
	    	     				Dialog.alert({
	    								content : "会员人数只能为正整数！"
	    							 });
	    	     				return false;
	    	     			}
	            			if(nonmemberPopulation&&(isNaN(nonmemberPopulation) || nonmemberPopulation<0 || parseInt(nonmemberPopulation)!=nonmemberPopulation)){
	    	     				Dialog.alert({
	    								content : "非会员人数只能为正整数！"
	    							 });
	    	     				return false;
	    	     			}
	            			var datas =widget.get("detailGrid").getData();
	            			if(datas.length == 0){
								Dialog.alert({
									content : "请添加服务项目!"
								 });
								return false;
							}
	            			var list = [];
							for(var i in datas){
								list.push({
									pkActivityFeesDetails: datas[i].pkActivityFeesDetails || "",
									generalServiceItem : datas[i].generalServiceItem.pkGeneralServiceItem,
									fees : datas[i].fees,
									version : datas[i].version!=null?datas[i].version : null
								});
							}
							data.list = list;
	            			aw.saveOrUpdate("api/activityfees/save",aw.customParam(data),function(data){
	            				if(data){
	            					Dialog.alert({
	            						content : "保存成功!"
	            					 });
	            				}
	            				widget.refreshActivitySelect(widget);
	            				widget.show(".J-grid").hide([".J-form",".J-detailGrid"]);
	            				widget.get("subnav").show(["add","time"]).hide(["return","save"]);
	            				widget.get("grid").refresh({
	            					"pkActivityFees" : data.pkActivityFees,
	            					fetchProperties:"pkActivityFees," +
					            			        "totalPopulation,totalFees," +
					            			        "avgFees,memberPopulation,memberTotalFees," +
					            			        "nonmemberPopulation,nonmemberTotalFees,version," +
					            			        "activity.pkActivity," +
					            			        "activity.theme," +
					            			        "activity.activityStartTime," +
					            			        "activity.activityEndTime,"+
					            			        "activityFeesDetails.pkActivityFeesDetails," +
			                    			        "activityFeesDetails.fees," +
			                    			        "activityFeesDetails.generalServiceItem.pkGeneralServiceItem," +
			                    			        "activityFeesDetails.generalServiceItem.name," +
			                    			        "activityFeesDetails.version",
	            				},function(data){
	            					widget.get("subnav").setValue("time",{
	        							start:data[0].activity.activityStartTime,
	        							end:data[0].activity.activityStartTime,
	        					    });
	            				});
	            				
	    					});
						}
					}]
               	 }
			});
			this.set("subnav",subnav);
    			
            var grid=new Grid({
        		parentNode:".J-grid",
                model:{
                	url : "api/activityfees/query",
	            	params : function(){
	                    return {
	                    	"activity.activityStartTime":widget.get("subnav").getValue("time").start,
	                    	"activity.activityStartTimeEnd":widget.get("subnav").getValue("time").end,
	                    	fetchProperties:"pkActivityFees," +
	                    			        "totalPopulation,totalFees," +
	                    			        "avgFees,memberPopulation,memberTotalFees," +
	                    			        "nonmemberPopulation,nonmemberTotalFees,version," +
	                    			        "activity.pkActivity," +
	                    			        "activity.theme," +
	                    			        "activity.activityStartTime," +
	                    			        "activity.activityEndTime," +
	                    			        "activityFeesDetails.pkActivityFeesDetails," +
	                    			        "activityFeesDetails.fees," +
	                    			        "activityFeesDetails.generalServiceItem.pkGeneralServiceItem," +
	                    			        "activityFeesDetails.generalServiceItem.name," +
	                    			        "activityFeesDetails.version",
	                    };
	                },
                    columns:[{
                        name:"activity.theme",
                        label:"活动主题",
                        className:"threeColumn"
                    },{
						name:"activity.activityStartTime",
						label:"活动开始时间",
						className:"oneHalfColumn",
						format:"date"
					},{
						name:"activity.activityEndTime",
						label:"活动结束时间",
						className:"oneHalfColumn",
						format:"date"
					},{
						name:"totalPopulation",
						label:"参加活动人数",
						className:"oneHalfColumn",
					},{
						name:"totalFees",
						label:"总费用",
						className:"oneHalfColumn",
						format:function(value,row){
							return "<a href='javascript:void(0);' style='color:red;' class='J-detail' >"+Math.ceil(value)+"</a>";
						}
					},{
						name:"operate",
						label:"操作",
						className:"oneHalfColumn",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"icon-edit",
							handler:function(index,data,rowEle){
								var form=widget.get("form");
								form.reset();
								form.setData(data);
								form.setValue("activity.activityEndTime",data.activity.activityEndTime);
								form.setValue("activity.activityStartTime",data.activity.activityStartTime);
								widget.show([".J-form",".J-detailGrid"]).hide([".J-grid"]);
								widget.get("subnav").hide(["add","time"]).show(["return","save"]);
								widget.get("detailGrid").setDisabled(false);
								widget.get("detailGrid").setData(data.activityFeesDetails);
								return false;
							}
						},{
							key:"delete",
							icon:"icon-remove",
							handler:function(index,data,rowEle){
								aw.del("api/activityfees/" + data.pkActivityFees + "/delete",function(){
									widget.refreshActivitySelect(widget);
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
                    id : "fees",
                    defaultButton:false,
                    items : [{
                    	name : "pkActivityFees",
                        type : "hidden",
                    },{
                        name : "version",
                        type : "hidden",
                        defaultValue : 0
                    },{
                    	className:{
							container:"col-md-6",
							label:"col-md-4"
						},
                        name : "activity",
                        type : "select",
                        label : "活动",
                        keyField : "pkActivity",
                        valueField : "theme",
                        validate:["required"],
                        url : "api/activityfees/queryactivity",
                        params : function(){
                            return {
                            	"type":"happiness",
                            	fetchProperties:"pkActivity,theme,activityStartTime,activityEndTime",
                            };
                        },
                    },{
                    	className:{
							container:"col-md-6",
							label:"col-md-4"
						},
                        name : "totalPopulation",
                        label : "参加活动人数",
                        validate:["required"],
                    },{
                    	className:{
							container:"col-md-6",
							label:"col-md-4"
						},
                        name : "totalFees",
                        label : "活动总费用",
                        validate:["required"],
                        defaultValue:"0",  
                        readonly:true,
                    },{
                    	className:{
							container:"col-md-6",
							label:"col-md-4"
						},
                        name : "avgFees",
                        label : "平均费用",
                        validate:["required"],
                        defaultValue:"0",
                    },{
                    	className:{
							container:"col-md-6",
							label:"col-md-4"
						},
                        name : "memberPopulation",
                        label : "会员人数",
                        validate:["required"],
                    },{
                    	className:{
							container:"col-md-6",
							label:"col-md-4"
						},
                        name : "memberTotalFees",
                        label : "会员总费用"
                    },{
                    	className:{
							container:"col-md-6",
							label:"col-md-4"
						},
                        name : "nonmemberPopulation",
                        label : "非会员人数",
                    },{
                    	className:{
							container:"col-md-6",
							label:"col-md-4"
						},
                        name : "nonmemberTotalFees",
                        label : "非会员总费用",
                    },{
                    	className:{
							container:"col-md-6",
							label:"col-md-4"
						},
	                   	name : "activity.activityStartTime",
	                   	type : "date",
	                    label : "活动开始时间",
	                    readonly : true
	                },{
	                	className:{
							container:"col-md-6",
							label:"col-md-4"
						},
	                    name : "activity.activityEndTime",
	                    type : "date",
	                    label : "活动结束时间",
	                    readonly : true
	                }]
                }
            });
            this.set("form",form);
            var detailGrid = new EditGrid({
            	parentNode:".J-detailGrid",
				autoRender:false,
				model:{
					id:"detailGrid",
					columns : [{
						name:"generalServiceItem.name",
						label:"服务项目",
						editor : {
							type : "select",
							url:"api/generalServiceItem/query",
							keyField : "pkGeneralServiceItem",
							valueField : "name",
							params : function(){
								return {
									"state":"Using",
									fetchProperties:"pkGeneralServiceItem,name",
								}
							},
							onAdd : function(editors){
								var oldDatas = detailGrid.getData();
								var editor = editors["generalServiceItem.name"];
								var curMember = editor.getData(editor.getValue());
								var a = editor.getValue();
								if(a != ""){
									var validateRet = widget.generalServiceItemValidate(curMember,oldDatas);
									if(validateRet){
										detailGrid.add({
											fees:0,
											generalServiceItem : curMember,
										});
										return true;
									}
									return false;
								}
								return false;
							},
							onEdit : function(plugin,rowIndex,rowData){
								plugin.setValue(rowData.generalServiceItem);
							},
							onChange : function(plugin,rowIndex,rowData){
								var oldDatas = detailGrid.getData();
								var curMember = plugin.getData(plugin.getValue());
								var validateRet = widget.generalServiceItemValidate(curMember,oldDatas);
								if(validateRet){
									rowData.generalServiceItem = plugin.getData(plugin.getValue());
									detailGrid.update(rowIndex,rowData);
								}else{
									plugin.setValue(rowData.generalServiceItem);
								}
							}
						}
					},{
						name:"fees",
						label:"金额",
						editor : {
							type : "text",
							onEdit : function(editor,rowIndex,rowData){
								editor.setValue(rowData.fees);
							},
							onChange : function(plugin,index,rowData){
								if(plugin.getValue() =="" || isNaN(plugin.getValue())){
		    	     				Dialog.alert({
		    								content : "金额只能为数字！"
		    							 });
		    	     				return false;
		    	     			}else{
		    	     				widget.addtotalFees(plugin.getValue(),rowData.fees);
									rowData.fees = plugin.getValue();
		    	     				detailGrid.update(index,rowData)
		    	     			}
							}
						}
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							id:"del",
  							text:"删除",
  							handler:function(index,data,rowEle){
  								detailGrid.remove(rowEle);
  								widget.deltotalFees(data.fees);
  							}
						}]
					}]
				}
            })
			this.set("detailGrid",detailGrid);
        },
        generalServiceItemValidate:function(generalServiceItem,datas){
			for ( var i in datas) {
				if(generalServiceItem.pkGeneralServiceItem  == datas[i].generalServiceItem.pkGeneralServiceItem){
					Dialog.alert({
						content : "该服务项目已存在!"
					 });
					return false;
				}
			}
			return true;
       },
       deltotalFees:function(data){
    	   var form= this.get("form");
    	   var totalFees=form.getValue("totalFees");
    	   var totalPopulation=form.getValue("totalPopulation");
    	   var memberPopulation=form.getValue("memberPopulation"); 
    	   var nonmemberPopulation=form.getValue("nonmemberPopulation"); 
    	   form.setValue("totalFees",(parseInt(totalFees)-parseInt(data)).toFixed(2));
    	   if(totalPopulation != ""){
			   form.setValue("avgFees",((parseInt(totalFees)-parseInt(data))/parseInt(totalPopulation)).toFixed(2));
		   }else{
			   form.setValue("avgFees","");
		   }
		   if(memberPopulation != ""){
			   form.setValue("memberTotalFees",((parseInt(totalFees)-parseInt(data))/parseInt(totalPopulation)*parseInt(memberPopulation)*0.5).toFixed(2));
		   }else{
			   form.setValue("memberTotalFees","");
		   }
		   if(nonmemberPopulation != ""){
			   form.setValue("nonmemberTotalFees",((parseInt(totalFees)-parseInt(data))/parseInt(totalPopulation)*parseInt(nonmemberPopulation)).toFixed(2));
		   }else{
			   form.setValue("nonmemberTotalFees","");
		   }
       },
       addtotalFees:function(data,datas){
    	   var form= this.get("form");
    	   var totalFees=form.getValue("totalFees");
    	   var totalPopulation=form.getValue("totalPopulation");
    	   var memberPopulation=form.getValue("memberPopulation"); 
    	   var nonmemberPopulation=form.getValue("nonmemberPopulation"); 
    	   if(totalFees == ""){
    		   form.setValue("totalFees",(parseInt(data)-parseInt(datas)).toFixed(2));
    		   if(totalPopulation != ""){
    			   form.setValue("avgFees",((parseInt(data)-parseInt(datas))/parseInt(totalPopulation)).toFixed(2));
    		   }
    		   if(memberPopulation != ""){
    			   form.setValue("memberTotalFees",((parseInt(data)-parseInt(datas))/parseInt(totalPopulation)*parseInt(memberPopulation)*0.5).toFixed(2));
    		   }
    		   if(nonmemberPopulation != ""){
    			   form.setValue("nonmemberTotalFees",((parseInt(data)-parseInt(datas))/parseInt(totalPopulation)*parseInt(nonmemberPopulation)).toFixed(2));
    		   }
    	   }else{
    		   form.setValue("totalFees",(parseInt(totalFees)+parseInt(data)-parseInt(datas)).toFixed(2));
    		   if(totalPopulation != ""){
    			   form.setValue("avgFees",((parseInt(totalFees)+parseInt(data)-parseInt(datas))/parseInt(totalPopulation)).toFixed(2));
    		   }else{
    			   form.setValue("avgFees","");
    		   }
    		   if(memberPopulation != ""){
    			   form.setValue("memberTotalFees",((parseInt(totalFees)+parseInt(data)-parseInt(datas))/parseInt(totalPopulation)*parseInt(memberPopulation)*0.5).toFixed(2));
    		   }else{
    			   form.setValue("memberTotalFees","");
    		   }
    		   if(nonmemberPopulation != ""){
    			   form.setValue("nonmemberTotalFees",((parseInt(totalFees)+parseInt(data)-parseInt(datas))/parseInt(totalPopulation)*parseInt(nonmemberPopulation)).toFixed(2));
    		   }else{
    			   form.setValue("nonmemberTotalFees","");
    		   }
    	   }
       }
    });
    module.exports = activityfees;
});