define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var store=require("store");
	//多语
	var i18ns = require("i18n");
	var CheckintelecomAccept = BaseView.extend({
		events:{
			"click .J-phone" : function(e){
				Dialog.mask(true);
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var telstatus ="";
				
				if((data.checkInTelecom.ipTVOpened==true&&data.checkInTelecom.ipTVAcceptConfirmed==true||data.checkInTelecom.ipTVOpened==false)
						&&(data.checkInTelecom.broadbandOpened==true&&data.checkInTelecom.broadbandAcceptConfirmed==true||data.checkInTelecom.broadbandOpened==false)){
					telstatus="Acceptance"
				}else{
					telstatus="Pended"
				}
				if(data){
					aw.ajax({
						url : "api/checkintelecom/save",
						type : "POST",
						data : {
							pkCITelecom:data.checkInTelecom.pkCITelecom,
							status:telstatus,
							telePhoneAcceptConfirmed:true,
							telePhoneAcceptDate:moment().valueOf(),
							version:data.checkInTelecom.version
							
						},
						success:function(result){
							Dialog.mask(false);
							if(result){
								$(e.target).parents("td").text("已验收"),
								grid.refresh({
									pkCIImplement:data.pkCIImplement,
									fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
									"checkInTelecom.*,status.value,checkInTelecom.disposeUser.*,checkInTelecom.acceptanceUser.*"
									
								})
								
							}
						}
					});
				}
			},
			"click .J-IPTV" : function(e){
				Dialog.mask(true);
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var telstatus ="";
				
				if((data.checkInTelecom.telePhoneOpened==true&&data.checkInTelecom.telePhoneAcceptConfirmed==true||data.checkInTelecom.telePhoneOpened==false)
						&&(data.checkInTelecom.broadbandOpened==true&&data.checkInTelecom.broadbandAcceptConfirmed==true||data.checkInTelecom.broadbandOpened==false)){
					telstatus="Acceptance"
				}else{
					telstatus="Pended"
				}	
				if(data){
					aw.ajax({
						url : "api/checkintelecom/save",
						type : "POST",
						data : {
							pkCITelecom:data.checkInTelecom.pkCITelecom,
							status:telstatus,
							ipTVAcceptConfirmed:true,
							ipTVAcceptDate:moment().valueOf(),
							version:data.checkInTelecom.version
						},
						success:function(result){
							Dialog.mask(false);
							if(result){
								$(e.target).parents("td").text("已验收"),
								grid.refresh({
									pkCIImplement:data.pkCIImplement,
									fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
									"checkInTelecom.*,status.value,checkInTelecom.disposeUser.*,checkInTelecom.acceptanceUser.*"
									
								})
							}
						}
					});
				}
			},
			"click .J-broadband" : function(e){
				Dialog.mask(true);
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var telstatus ="";
				
				if((data.checkInTelecom.ipTVOpened==true&&data.checkInTelecom.ipTVAcceptConfirmed==true||data.checkInTelecom.ipTVOpened==false)
						&&(data.checkInTelecom.telePhoneOpened==true&&data.checkInTelecom.telePhoneAcceptConfirmed==true||data.checkInTelecom.telePhoneOpened==false)){
					telstatus="Acceptance"
				}else{
					telstatus="Pended"
				}
				if(data){
					aw.ajax({
						url : "api/checkintelecom/save",
						type : "POST",
						data : {
							pkCITelecom:data.checkInTelecom.pkCITelecom,
							status:telstatus,
							broadbandAcceptConfirmed:true,
							broadbandAcceptDate:moment().valueOf(),
							version:data.checkInTelecom.version
						},
						success:function(result){
							Dialog.mask(false);
							if(result){
								$(e.target).parents("td").text("已验收"),
								grid.refresh({
									pkCIImplement:data.pkCIImplement,
									fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
									"checkInTelecom.*,status.value,checkInTelecom.disposeUser.*,checkInTelecom.acceptanceUser.*"
									
								})
							}
						}
					});
				}
			}
		},
		initSubnav:function(widget){
			return {
				model:{
					title:"电信开通验收",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/checkinimplement/search",
							data:{
								s:str,
								properties:"memberSigning.room.number,memberSigning.checkInDate,memberSigning.members.personalInfo.name,status",
								fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
								"checkInTelecom.*,status.value,checkInTelecom.disposeUser.*,checkInTelecom.acceptanceUser.*"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(key,element){
							widget.list2Card(false);
							widget.get("subnav").show(["time","handle","checkInStatus"]);
						}
					}],
					buttonGroup:[{
						id:"checkInStatus",
						items:[{
		                    key:"Doing",
		                    value:"准备中"
						},{
		                    key:"Initial",
		                    value:"初始"
						},{
		                    key:"Edited",
		                    value:"已设置"
						},{
		                    key:"Confirmed",
		                    value:"已确认"
						},{
							key:"",
		                    value:"全部"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"handle",
						items:[{
		                    key:"Pended",
		                    value:"已处理"
						},{
		                    key:"Pending",
		                    value:"待处理"
						},{
		                    key:"Pend",
		                    value:"处理中"
						},{
		                    key:"NoRequiement",
		                    value:"无要求"
						},{
		                    key:"UnConfirmed",
		                    value:"未确认"
						},{
							key:"",
		                    value:"全部"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
					time:{
						ranges:{
							 "本月": [moment().startOf("month"), moment().endOf("month")], 
						     "今年": [moment().startOf("year"), moment().endOf("year")] 
						},
						defaultTime:"今年",
						click:function(time){
							widget.get("list").refresh();
						}
					}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/checkInImplement/query",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						status:subnav.getValue("checkInStatus"),
						"checkInTelecom.status":subnav.getValue("handle"),
						"memberSigning.checkInDate":time.start, 
						"memberSigning.checkInDateEnd":time.end,
						fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
							"checkInTelecom.openType.value,checkInTelecom.*,status.value,checkInTelecom.disposeUser.*,checkInTelecom.acceptanceUser.*"
					};
				},
				autoRender:false,
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号",
					},{
						key:"memberSigning.checkInDate",
						name:"入住时间",
						format:"date"
					},{
						key:"memberSigning.members.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
						format:function(row,value){
							var name="";
							for(var i in value.memberSigning.members){
								name+=value.memberSigning.members[i].personalInfo.name+",";
							}
							return name.substr(0,name.length-1);
						}
					},{
						key:"status.value",
						name:"入住准备状态"
					},{
						key:"checkInTelecom.status.value",
						name:"电信开通状态"
					},{
						key:"checkInTelecom.openType.value",
						name:"开通方式"
					},{
                        key:"checkInTelecom.telePhoneOpened",
                        name : "电话",
                        format:function(value,row){
                        	if(value==false){
                        		ret = "<div>无需求</div>"; 
                        	}else if(value==true){
                        		if(row.status.key=="Doing"){
                        			if(row.checkInTelecom.telePhoneAcceptConfirmed==true){
                            			ret = "<div>已验收</div>"; 
                            		}else if((row.checkInTelecom.telePhoneAcceptConfirmed==null||row.checkInTelecom.telePhoneAcceptConfirmed==false)&&row.checkInTelecom.telePhoneOpenConfirmed==true){
                            			return "button";
                            		}else{
                            			return "";
                            		}
                        		}else{
                        			ret="";
                        		}
                        		
                        	}
							return ret; 
                        },
                        formatparams:[{
                        	key:"phone",
                        	text:"验收",
                        }]
                    },{
                    	key:"checkInTelecom.phoneNumber",
						name:"电话号码"
                    },{
						key:"checkInTelecom.telePhoneAcceptDate",
						name:"电话验收时间",
						format:"date"
					},{
                        key:"checkInTelecom.ipTVOpened",
                        name :"IPTV",
                        format:function(value,row){
                        	if(value==false){
                        		ret = "<div>无需求</div>"; 
                        	}else if(value==true){
                        		if(row.status.key=="Doing"){
                        			if(row.checkInTelecom.ipTVAcceptConfirmed==true){
                            			ret = "<div>已验收</div>"; 
                            		}else if((row.checkInTelecom.ipTVAcceptConfirmed==null||row.checkInTelecom.ipTVAcceptConfirmed==false)&&row.checkInTelecom.ipTVOpenConfirmed==true){
                            			return "button";
                            		}else {
                            			return "";
                            		}
                        		}else{
                        			ret="";
                        		}
                        		
                        	}
							return ret; 
                        },
                        formatparams:[{
                        	key:"IPTV",
                        	text:"验收"
                        }]
                    },{
						key:"checkInTelecom.ipTVAcceptDate",
						name:"IPTV验收时间 ",
						format:"date"
					},{
                        key:"checkInTelecom.broadbandOpened",
                        name : "宽带",
                        format:function(value,row){
                        	if(value==false){
                        		ret = "<div>无需求</div>"; 
                        	}else if(value==true){
                        		if(row.status.key=="Doing"){
                        			if(row.checkInTelecom.broadbandAcceptConfirmed==true){
                            			ret = "<div>已验收</div>"; 
                            		}else if((row.checkInTelecom.broadbandAcceptConfirmed==null||row.checkInTelecom.broadbandAcceptConfirmed==false)&&row.checkInTelecom.broadbandOpenConfirmed==true){
                            			return "button";
                            		}else{
                            			return "";
                            		}
                        		}else{
                        			ret=""
                        		}
                        		
                        	}
							return ret; 
                        },
                        formatparams:[{
                        	key:"broadband",
                        	text:"验收"
                        }]
                    },{
						key:"checkInTelecom.broadbandAcceptDate",
						name:"宽带验收日期",
						format:"date"
					}]
				}
			};
		},
		
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			    widget.get("list").refresh({
			    	pkCIImplement:params.pkFather,
			    	fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
					"checkInTelecom.*,status.value,checkInTelecom.disposeUser.*,checkInTelecom.acceptanceUser.*"
			    });
			}else if(params && params.CheckInImplement){
				  widget.get("list").refresh({
					  pkCIImplement:params.CheckInImplement,
					  fetchProperties:"*,memberSigning.checkInDate,memberSigning.members.personalInfo.name,memberSigning.room.number," +
						"checkInTelecom.*,status.value,checkInTelecom.disposeUser.*,checkInTelecom.acceptanceUser.*"
				  });
			} else {
				widget.get("list").refresh();
			}
		}
	});
	module.exports = CheckintelecomAccept;
});