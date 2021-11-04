define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var store=require("store");
	//多语
	var i18ns = require("i18n");
	var Checkintelecom = BaseView.extend({
		
		events:{
			"click .J-phone" : function(e){
				Dialog.mask(true);
				var grid=this.get("list");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				var telstatus ="";
				if((data.checkInTelecom.ipTVOpened==true&&data.checkInTelecom.ipTVOpenConfirmed==true||data.checkInTelecom.ipTVOpened==false)
						&&(data.checkInTelecom.broadbandOpened==true&&data.checkInTelecom.broadbandOpenConfirmed==true||data.checkInTelecom.broadbandOpened==false)){
					telstatus="Pended"
				}else{
					telstatus="Pend"
				}
				if(data){
					aw.ajax({
						url : "api/checkintelecom/save",
						type : "POST",
						data : {
							pkCITelecom:data.checkInTelecom.pkCITelecom,
							status:telstatus,
							telePhoneOpenConfirmed:true,
							telePhoneOpenDate:moment().valueOf(),
							version:data.checkInTelecom.version
						},
						success:function(result){
							Dialog.mask(false);
							if(result){
								$(e.target).parents("td").text("已处理"),
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
				
				if((data.checkInTelecom.telePhoneOpened==true&&data.checkInTelecom.telePhoneOpenConfirmed==true||data.checkInTelecom.telePhoneOpened==false)
						&&(data.checkInTelecom.broadbandOpened==true&&data.checkInTelecom.broadbandOpenConfirmed==true||data.checkInTelecom.broadbandOpened==false)){
					telstatus="Pended"
				}else{
					telstatus="Pend"
				}
				if(data){
					aw.ajax({
						url : "api/checkintelecom/save",
						type : "POST",
						data : {
							pkCITelecom:data.checkInTelecom.pkCITelecom,
							status:telstatus,
							ipTVOpenConfirmed:true,
							ipTVOpenDate:moment().valueOf(),
							version:data.checkInTelecom.version
						},
						success:function(result){	
							Dialog.mask(false);
							if(result){
								$(e.target).parents("td").text("已处理"),
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
				
				if((data.checkInTelecom.ipTVOpened==true&&data.checkInTelecom.ipTVOpenConfirmed==true||data.checkInTelecom.ipTVOpened==false)
						&&(data.checkInTelecom.telePhoneOpened==true&&data.checkInTelecom.telePhoneOpenConfirmed==true||data.checkInTelecom.telePhoneOpened==false)){
					telstatus="Pended"
				}else{
					telstatus="Pend"
				}
				if(data){
					aw.ajax({
						url : "api/checkintelecom/save",
						type : "POST",
						data : {
							pkCITelecom:data.checkInTelecom.pkCITelecom,
							status:telstatus,
							broadbandOpenConfirmed:true,
							broadbandOpenDate:moment().valueOf(),
							version:data.checkInTelecom.version
						},
						success:function(result){	
							Dialog.mask(false);
							if(result){
								$(e.target).parents("td").text("已处理"),
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
					title:"电信开通处理",
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
		                    key:"Pending",
		                    value:"待处理"
						},{
		                    key:"Pend",
		                    value:"处理中"
						},{
		                    key:"Pended",
		                    value:"已处理"
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
                        			if(row.checkInTelecom.telePhoneOpenConfirmed==true){
                            			ret = "<div>已处理</div>"; 
                            		}else{
                            			return "button";
                            		}
                        		}else{
                        			ret = "";
                        		}
                        		
                        	}
							return ret; 
                        },
                        formatparams:[{
                        	key:"phone",
                        	text:"处理",
                        }]
                    },{
                    	key:"checkInTelecom.phoneNumber",
						name:"电话号码"
                    },{
						key:"checkInTelecom.telePhoneOpenDate",
						name:"电话开通时间",
						format:"date"
					},{
                        key:"checkInTelecom.ipTVOpened",
                        name :"IPTV",
                        format:function(value,row){
                        	if(value==false){
                        		ret = "<div>无需求</div>"; 
                        	}else if(value==true){
                        		if(row.status.key=="Doing"){
                        			if(row.checkInTelecom.ipTVOpenConfirmed==true){
                            			ret = "<div>已处理</div>"; 
                            		}else{
                            			return "button";
                            		}
                        		}else{
                        			ret= "";
                        		}
                        		
                        	}
							return ret; 
                        },
                        formatparams:[{
                        	key:"IPTV",
                        	text:"处理"
                        }]
                    },{
						key:"checkInTelecom.ipTVOpenDate",
						name:"IPTV开通时间 ",
						format:"date"
					},{
                        key:"checkInTelecom.broadbandOpened",
                        name : "宽带",
                        format:function(value,row){
                        	if(value==false){
                        		ret = "<div>无需求</div>"; 
                        	}else if(value==true){
                        		if(row.status.key=="Doing"){
                        			if(row.checkInTelecom.broadbandOpenConfirmed==true){
                            			ret = "<div>已处理</div>"; 
                            		}else{
                            			return "button";
                            		}
                        		}else{
                        			ret = "";
                        		}
                        	}
                        	return ret; 
                        },
                        formatparams:[{
                        	key:"broadband",
                        	text:"处理"
                        }]
                    },{
						key:"checkInTelecom.broadbandOpenDate",
						name:"宽带开通日期",
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
	module.exports = Checkintelecom;
});