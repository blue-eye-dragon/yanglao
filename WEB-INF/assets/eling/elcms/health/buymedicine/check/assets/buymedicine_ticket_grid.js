define(function(require,exports,module){
	var EditGrid=require("editgrid-1.0.0");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var Dialog=require("dialog-1.0.0");
	var utils={
		init:function(params,widget){
			return new EditGrid({
				parentNode:".J-tickets",
				url:"api/buymedicineapplication/ticketquery",
				params:function(){
					return{
						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
						fetchProperties:"*,member.memberSigning.room.number,member.personalInfo.name,ticket,money"
					}
				},
				model:{
					idAttribute:"pkBuyMedicineApplication",
					head:{
						title:"核对票款",
						buttons:[{
							id:"add",
							icon:"icon-save",
							handler:function(){
								var pkType=widget.get("grid2").getColumnsData("pkBuyMedicineApplication");
								var pkTypes="";
								for(var i=0;i<pkType.length;i++){
									pkTypes+=pkType[i]+",";
								}
							
		                     	var datas=widget.get("grid2").getEditData();
								var tickets="";
								var moneys="";
								var flag  = false;
								var info = "如下"+i18ns.get("sale_ship_owner","会员");
								for(var i=0;i<datas.length;i++){
									datas[i].ticket=datas[i].ticket.trim();
									datas[i].money=datas[i].money.trim();
									if(!datas[i].ticket || ! datas[i].money){
										Dialog.alert({
			    							content:"请将信息填写完整！"
			    						});
			            				return;
									}
									if(datas[i].ticket!=""&&isNaN(datas[i].ticket)){
										Dialog.alert({
											content:"票款核对只能为数字！"
							    		});
										return;
									}
									if(datas[i].money!=""&&isNaN(datas[i].money)){
										Dialog.alert({
											content:"支出金额只能为数字！"
							    		});
										return;
									}
									if((!datas[i].ticket && datas[i].money)||(!/^\+?[1-9]\d*$/.test(datas[i].ticket)||!/(^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$)/.test(datas[i].money))){
										flag =  true;
										info +=widget.get("grid2").getSelectedData(i).member.personalInfo.name+",";
									}
									if(datas[i].ticket && ! datas[i].money ){
										flag =  true;
										info +=widget.get("grid2").getSelectedData(i).member.personalInfo.name+",";
									}
									tickets+=datas[i].ticket+";";
									moneys+=datas[i].money+"、";
								}
								Dialog.alert({
	                        		title:"提示",
	                        		showBtn:false,
	                        		content:"正在保存，请稍后……"
	                        	});
								aw.ajax({
									url:"api/buymedicineapplication/ticketchecked",
									type:"POST",
									data:{
										pkTypes:pkTypes,
										tickets:tickets,
										moneys:moneys
									},
									success:function(data){	
										Dialog.close();
										if(data.msg=="操作成功"){
											widget.hide([".J-tickets"]).show([".J-grid"]);
											widget.get("subnav").hide(["return"]).show(["checkticket","checkmedicine","checkpaper","datatype","building"]);
			                            	widget.get("grid").refresh(null,function(){
			                            		widget.getTotalMny();
			                            	});
			                            	widget.get("grid2").refresh();
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
						name : "票款核对(张)",
						type:"text"
					},{
						key:"money",
						name:"支出金额(元)",
						type:"text"
					}]
				}
			});
		}
	};
	
	module.exports=utils;
});