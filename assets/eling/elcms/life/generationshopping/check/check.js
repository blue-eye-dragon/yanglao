define(function(require, exports, module) {
    var ELView=require("elview");
    var aw = require("ajaxwrapper");
    var template=require("./check.tpl");
    var Form=require("form-2.0.0")
    var Subnav = require("subnav-1.0.0");
    var Grid = require("grid-1.0.0");
    var MultiRowGrid = require("multirowgrid");

    var Check = ELView.extend({
        attrs:{
        	template:template
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
			var length = grid.getTitle().indexOf(" ");
			//grid.setTitle("合计金额："+totalMny+"元");
			var title = grid.getTitle().substring(0,length);
			return grid.setTitle(title+" 合计金额："+totalMny+"元");
		},
		  getTitles:function(title){
				var grid=this.get("grid");
				grid.setTitle("汇总单"+title);
			},
        initComponent:function(params,widget){
        	//初始化subnav
            var subnav=new Subnav({
            	parentNode:".J-subnav",
                model:{
                   title:"代购物核对",
				   buttonGroup:[{
						id:"building",
						showAll:true,
						handler:function(key,element){
							widget.get("grid").refresh(null,function(data){
								widget.getTotalMny();
							});
						}
					},{
    					id:"flowStatus",
                        items:[{
                        	key:"Printed,Bought",
                            value:"全部"
                        },{
                            key:"Printed",
                            value:"未核对"
                        },{
                            key:"Bought",
                            value:"已核对"
                        }],
						handler:function(key,element){
							widget.get("grid").refresh(null,function(data){
								widget.getTotalMny();
							});
						}
					}],
					buttons:[{
 						id:"return",
 						text:"返回",
 						show:false,
 						handler:function(){
 							widget.show(".J-grid,.J-building").hide(".J-verform,.J-return,.J-applicationList");
 							return false;
 						}
					}]
                }
            });
            this.set("subnav",subnav);
            
            var grid=new Grid({
				url:"api/generationshoppingapplication/query",
				fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,summary.pkGenerationShoppingApplicationSummary,summary.billcode,summary.shoppingDate",
				parentNode:".J-grid",
				autoRender:false,
				params:function(){
					return {
						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
    					flowStatusIn:widget.get("subnav").getValue("flowStatus")
					};
				},
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.name",
						name:"姓名"
					},{
						key:"money",
						name:"总金额(元)",
						format:function(value,row){
							return value ? "￥"+value : "";
						}
					},{
						key:"applicationDate",
						name:"申请日期",
						format:"date"
					},{
						key:"summary.shoppingDate",
						name:"购物日期",
						format:"date"
					},{
						key:"flowStatus",
						name:"状态",
						format:function(value,row){
							if(value == 'Printed'){
								return "未核对";
							}else{
								return "已核对";
							}
						}
					},{
						key:"flowStatus",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"cancelCheck",
							text:"取消核对",
							show:function(data,row){
								if(data=="Bought"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,rowData,rowEle){
		                         aw.ajax({
		                              url : "api/generationshoppingapplication/cancelcheck",
		                              fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,summary.pkGenerationShoppingApplicationSummary,summary.billcode,summary.shoppingDate",
		                              type : "POST",
		                              data : {
		                            	  pkGenerationShoppingApplication:rowData.pkGenerationShoppingApplication
		                              },
		                              success : function(data){
		                            	  widget.get("grid").refresh(null,function(data){
		                            		  widget.getTotalMny();
		      							});
		                                }
		                            });
							}
						},{
							key:"check",
							text:"核对",
							show:function(data,row){
								if(data=="Printed"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rolEle){
		    					widget.get("verform").setData(data);
		    					widget.get("applicationList").refresh({
		    						pkGenerationShoppingApplication:data.pkGenerationShoppingApplication,
		    		   			});
		    					widget.show(".J-verform,.J-return,.J-applicationList").hide(".J-grid,.J-building");
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var verform = new Form({
            	parentNode:".J-verform",
            	saveaction:function(){
            		var data=$("#generationshoppingapplication").serializeArray();
            		aw.saveOrUpdate("api/generationshoppingapplication/check",$("#generationshoppingapplication").serialize(),function(data){
            			widget.get("grid").refresh(null,function(data){
            				widget.getTotalMny();
                    	});
			   			widget.show(".J-grid,.J-building").hide(".J-verform,.J-return,.J-applicationList");
					});
            	},
 				//取消按钮
  				cancelaction:function(){
  					widget.show(".J-grid,.J-building").hide(".J-verform,.J-return,.J-applicationList");
  				},
				model:{
					id:"generationshoppingapplication",
					items:[{
						name:"pkGenerationShoppingApplication",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"money",
						label:"总金额(元)",
						validate:["required","money"]
					},{
						name:"remark",
						label:"备注",
						type:"textarea"
					}]
				}
             });
    		 this.set("verform",verform);
    		 
    		 var applicationList=new MultiRowGrid({
    			//不自动加载
 				autoRender:false,
 				url:"api/generationshoppingapplication/queryM",
 				fetchProperties:"*,shoppinglists.name,shoppinglists.quantity,shoppinglists.description,summary.pkGenerationShoppingApplicationSummary,summary.billcode",
 				parentNode:".J-applicationList",
 				model:{
 					multiField:"shoppinglists",
 					columns:[{
 						key:"shoppinglists",
 						multiKey:"name",
 						name:"物品名称",
 						isMulti:true
 					},{
 						key:"shoppinglists",
 						multiKey:"quantity",
 						name:"数量",
 						isMulti:true
 					},{
 						key:"shoppinglists",
 						multiKey:"description",
 						name:"描述",
 						isMulti:true
 					},{
 						key:"flowStatus",
 						name:"申请单状态",
 						format:function(value,row){
 							if(value == "Commited"){
 								return "已提交";
 							}
 							else if(value == "Printed"){
 								return "购买中";
 							}
 							else if(value == "Bought"){
 								return "已买回";
 							}
 							else{
 								return "";
 							}
 						}
 					}]
 				}
 			});
 			this.set("applicationList",applicationList);
        },
        afterInitComponent:function(params,widget){
        	widget.get("grid").refresh(null,function(data){
				if(data.length!=0){
        			widget.get("grid").setTitle("汇总单"+data[0].summary.billcode+" ");
        			widget.getTotalMny();
        		}else{
        			widget.get("grid").setTitle("");
        		}
			});
        }
    });
    module.exports = Check;
});