define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Verform = require("form-1.0.0");
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var template="<div class='J-subnav'></div>"+"<div class='J-grid'></div>"+"<div class='J-MedicineInformationGrid hidden'></div>";

	var generationshoppingreceive = ELView.extend({
		attrs:{
			template:template
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
            	parentNode:".J-subnav",
            	model:{
            	  title:"代购物发放",
  					buttons:[{
  						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-grid,.J-building,.J-flowStatus").hide(".J-MedicineInformationGrid,.J-return");
						}
					}],
   					buttonGroup:[{
   						id:"building",
   						showAll:true,
   						showAllFirst:true,
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
   					},{
   						id:"flowStatus",
   						items:[{
   							key:"Bought,Closed",
                            value:"全部"
                        },{
   		                    key:"Bought",
   		                    value:"未发放"
   						},{
   							key:"Closed",
   							value:"已发放"
   						}],
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
   					}]
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-grid",
				url:"api/generationshoppingapplication/query",
				fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,"+
								"shoppinglists.name,provideUser.name,summary.billcode,summary.shoppingDate",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"member.memberSigning.room.building":subnav.getValue("building"),
    					flowStatusIn:subnav.getValue("flowStatus")
					};
				},
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"member.memberSigning.room.number",
						name : "房号"
					},{
						key : "member.personalInfo.name",
						name : "姓名",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								aw.ajax({
									url : "api/generationshoppingapplication/shoppingqueryall",
									data:{
										pkGenerationShoppingApplication:data.pkGenerationShoppingApplication
									},
									type : "POST",
									success : function(datas){
										widget.get("medicineinformationgrid").setData(datas);
			                     		widget.hide(".J-grid,.J-building,.J-flowStatus").show(".J-MedicineInformationGrid,.J-return");
									}
								});
							}
						}]
					},{
						key:"applicationDate",
						name:"申请日期",
						format:"date"
					},{
						key:"summary.shoppingDate",
						name:"购物日期",
						format:"date"
					},{
						key:"money",
						name:"金额(元)",
						format:function(value,row){
							return value ? "￥"+(parseFloat(value)).toFixed(2) : "";
						}
					},{
						key:"provideUser.name",
						name:"发放人"
					},{
                        key:"flowStatus",
                        name : "操作",
                        format:function(value,row){
                           if(value=="Bought"){
                        	   return "button";
                           }else{
                        	   return ""; 
                          }
                        },
                        formatparams:[{
                        	id:"send",
                        	text:"发放",
                        	handler:function(index,data,rowEle){
                        		Dialog.confirm({
            						title:"提示",
            						content:"本次"+data.member.personalInfo.name+"的购物金额为：￥"+(data.money).toFixed(2)+"元",
            						confirm:function(){
            							aw.ajax({
            								url : "api/generationshoppingapplication/closedapplication",
            								data : {
        		                            	 pkGenerationShoppingApplication:data.pkGenerationShoppingApplication
        		                             },
            								dataType:"json",
            								type : "POST",
            								success : function(data){
            									widget.get("grid").refresh();
            								}
            							});
            						}
            					});
                        	}
                        }]
                    }]
				}
            });
            this.set("grid",grid);
            
            var medicineinformationgrid=new  Grid({
				parentNode:".J-MedicineInformationGrid",
				autoRender:false,
				model:{
					columns:[{
						key : "name",
						name : "物品名称"
					},{
						key:"quantity",
						name:"数量"
					},{
						key:"description",
						type:"textarea",
						name:"描述"
					}]
				}
			});
			this.set("medicineinformationgrid",medicineinformationgrid);
		}
//		,
//        afterInitComponent:function(params,widget){
//        	this.get("grid").refresh(null,function(data){
//        		if(data.length!=0){
//        			widget.get("grid").setTitle("汇总单"+data[0].summary.billcode);
//        		}
//        	});
//        }
    });
    module.exports = generationshoppingreceive;	
});