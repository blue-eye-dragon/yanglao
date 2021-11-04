define(function(require, exports, module) {
    var ELView=require("elview");
    var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var EditGrid=require("editgrid-1.0.0");
	var Dialog = require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	var store=require("store");
    var loginUser=store.get("user");
	//多语
	var i18ns = require("i18n");
    var template ="<div class='J-subnav'></div>"+
				"<div class='J-grid'></div>"+
				"<div class='J-tickets hidden'></div>";
    var Accompanyhospitalize_Check = ELView.extend({
        attrs:{
        	template:template
        },
        setGridTitle:function(){
			var length = this.get("grid").getData().length;
			var title="共"+length+"位"+i18ns.get("sale_ship_owner","会员");
			this.get("grid").setTitle(title);
			this.get("printGrid").setTitle(title);
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
			grid.setTitle("合计支出金额："+totalMny+"元");
		},
		initComponent:function(params,widget){
			var subnav = new Subnav({
				parentNode:".J-subnav",
				
				model:{
        			title:"集体陪同就医核对费用",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide([".J-tickets"]).show([".J-grid"]);
							widget.get("subnav").hide(["return"]).show(["checkticket","building","papersStatus","time","datatype"]);
						}
    				},{
						id:"checkticket",
						text:"核对票款",
						handler:function(index,data,rowEle){
							widget.hide([".J-grid"]).show([".J-tickets"]);
							widget.get("ticket_grid").refresh();
							widget.get("subnav").show(["return"]).hide(["checkticket","building","time","papersStatus","datatype"]);
						}
    				}],
    				time:{
//						ranges:{
//							"今天": [moment().startOf("days"),moment().endOf("days")],
//							"本月": [moment().startOf("month"), moment().endOf("month")],
//							"上月":[moment().subtract(1,"months").startOf("month"), moment().subtract(1,"months").endOf("month")],
//							"三月内": [moment().subtract("month", 3).startOf("days"),moment().endOf("days")],
//							
//						},
						defaultTime:"本月",
						click:function(time){
							widget.get("grid").refresh();
						}
					},
					buttonGroup:[{
						id:"building",
						showAll:true, 
						handler:function(key,element){
							widget.get("grid").refresh(null,function(){
								widget.getTotalMny();
							});
						}
					},{
			   			id:"papersStatus",
			   			showAll:true,
			   			showAllFirst:true,
							items:[{
								key:"NotReceive",
								value:"未收取"
							},{
								key:"Receive",
								value:"已收取"
							},{
								key:"Restore",
								value:"已返还"
							}],
							handler:function(key,element){								
								widget.get("grid").refresh(null,function(){
									widget.getTotalMny();
								});
							}
					},{
    					id:"datatype",
                        items:[{
                    		key:"2",
                            value:"全部"
                        	},{
                            key:"0",
                            value:"票款未核对"
	                        },{
	                    		key:"1",
	                            value:"核对完"
	                        }],
						handler:function(key,element){
							widget.get("grid").refresh(null,function(){
								widget.getTotalMny();
							});
						}
                    }]
                }
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({	                        
//				autoRender:false,
				url:"api/accompanyhospitalize/query",
				parentNode:".J-grid",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						datatype:subnav.getValue("datatype"),
						date: subnav.getValue("time").start,
				    	dateEnd:  subnav.getValue("time").end,
						papersStatus:subnav.getValue("papersStatus"),
						flowStatus:"Printed",
						"member.memberSigning.room.building":subnav.getValue("building"),
						fetchProperties:"*,member.personalInfo.name,handoverPerson.name,handoverPerson.pkUser," +
							"member.memberSigning.room.building.name,papers.name,hospital.name,"+
							"member.memberSigning.room.number,member.personalInfo.sex,member.personalInfo.birthday"
					};
				},
                model:{
                	idAttribute:"pkAccompanyHospitalize",
                	head:{
                		title:""
                	},
                    columns:[{
                    	key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
                    },{
						key:"member.memberSigning.room.number",
						name : "房号"
                    }
                    ,{
						key:"money",
						name:"总金额(元)",
						format:function(value,row){
							return value ? "￥"+value : "";
						}
					},{
                        key:"invoiceAmount",
                        name : "核对票款",
                        format:function(value,row){
                        	if(value || value===0){
                        		return "核对完成";
                        	}else{
                        		return "未核对完成 ";
                        	}
                        }	
                    }
					,{
						key:"operate",
						name:"操作",
						//format:"button",
						format:function(value,row){
//							var flag1=true;
////							var flag2=true;
//							for(var i=0;i<row.buyMedicinePapers.length;i++){
//								if(row.buyMedicinePapers[i].checked==false){
//									flag1=false;
//									break;
//								}
//							}
//							for(var j=0;j<row.items.length;j++){
//								if(row.items[j].actualQuantity==null){
//									flag2=false;
//									break;
//								}
//							}
							if(row.money!=null){
								return "button";
							}else{
								return "";
							}   
 						},
						formatparams:[{
							key:"cancel",
							text:"取消核对",
							handler:function(index,data,rowEle){
		                            aw.ajax({
		                                url : "api/accompanyhospitalize/cancelcheck",
		                                type : "POST",
		                                data : {
		                                	pkAccompanyHospitalize:data.pkAccompanyHospitalize
		                                },
		                               success : function(data){
//		                            	   widget.getTotalMny();
		                            	   widget.get("grid").refresh(null,function(){
		       								widget.getTotalMny();
		       							});
		                            	  
		                                }
		                            });
							}
						}]
					}
					]
                }
            });
			this.set("grid",grid);
			
			var ticket_grid = new EditGrid({
				parentNode:".J-tickets",
				autoRender:false,
				url:"api/accompanyhospitalize/ticketquery",
				params:{
					fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name,invoiceAmount,money"
				},
				model:{
					idAttribute:"pkAccompanyHospitalize",
					head:{
						title:"核对票款",
						buttons:[{
							id:"add",
							icon:"icon-save",
							handler:function(){
								var pkType=widget.get("ticket_grid").getColumnsData("pkAccompanyHospitalize");
								var pkTypes="";
								for(var i=0;i<pkType.length;i++){
									pkTypes+=pkType[i]+",";
								}
							
		                     	var datas=widget.get("ticket_grid").getEditData();
								var tickets="";
								var moneys="";
								for(var i=0;i<datas.length;i++){
									if(!datas[i].ticket){
										datas[i].ticket=" ";
									}
									if(!datas[i].money){
										datas[i].money=" ";
									}
									tickets+=datas[i].ticket+";";
									moneys+=datas[i].money+"、";
								}
								aw.ajax({
									url:"api/accompanyhospitalize/ticketchecked",
									type:"POST",
									data:{
										pkTypes:pkTypes,
										tickets:tickets,
										moneys:moneys
									},
									success:function(data){	
										if(data.msg=="操作成功"){
											widget.hide([".J-tickets"]).show([".J-grid"]);
											widget.get("subnav").hide(["return"]).show(["checkticket","building","time","papersStatus"]);
			                            	widget.get("grid").refresh(null,function(){
			                            		widget.getTotalMny();
			                            	});
			                            	widget.get("ticket_grid").refresh();
										}else{
											Dialog.tip({
												content:"操作失败"
											});
										}
		                            }
								});	
							}
						}]
					},
					columns:[{
		                key : "member.personalInfo.name",
		                name : "姓名"
					},{
						key:"member.memberSigning.room.number",
						name : "房号"
		            },{
						key : "ticket",
						name : "票款核对",
						type:"text"
					},{
						key:"money",
						name:"支出金额(元)",
						type:"text"
					}]
				}
			});
			this.set("ticket_grid",ticket_grid);
			
		},
        
    });
    module.exports = Accompanyhospitalize_Check;
});