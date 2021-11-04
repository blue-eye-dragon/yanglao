define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Profile = require("profile");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Properties=require("./properties");
	require("../../grid_css.css");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-profile hidden'></div>";
	var actRoomData = {};
        var Activity = ELView.extend({
        	 queryActRoom :function(startTime,endTime,grid){
        		 var data = {};
        		 data.startTime=startTime;
        		 data.endTime=endTime;
        		 data.fetchProperties="pkActivityRoom," +
        		 	"name," +
					"room.number," +
					"galleryful," +
					"theme," +
					"openingTime," +
					"endingTime"
        		 aw.ajax({
						url:"api/activityroom/queryIdlebyTimes",
						data:aw.customParam(data),
						dataType:"json",
						success:function(data){
							grid.setData(data);
							actRoomData = data;
						}
 				})
             },
             activityRoomGrid : function(widget){
            	 return new Grid({
            		 isInitPageBar:false,
                     model:{
                         columns:[{
                             key:"name",
                             name:"活动室"
                         },{
                         	key:"room.number",
                         	name:"房间号"
                         },{
     						key:"galleryful",
     						name:"可容纳人数"
     					},{
     						key:"theme",
     						name:"主题"
     					},{
     						key:"openingTime",
     						name:"开放时间",
     						format:"date"
     					},{
     						key:"endingTime",
     						name:"结束时间",
     						format:"date"
     					},{
     						key:"operate",
     						name:"操作",
     						format:"button",
     						formatparams:[{
     							key:"order",
     							text:"预订",
     							handler:function(index,data,rowEle){
     								var profile=widget.get("profile");
     								profile.setValue("activityRoom",data.pkActivityRoom);
     								profile.setValue("activityRoomName",data.name);
     								Dialog.close();
     							}
     						}]
     					}]
     				}
             });
            },
        	events:{
        		"change .J-scope":function(e){
        			var  profile = this.get("profile");
        			if(profile.getValue("scope") != "Inner"){
        				profile.setValue("activityRoom","");
						profile.setValue("activityRoomName","");
        			}
        		},
        		"change .J-registrationStartTimen":function(e){
        			var  profile = this.get("profile");
        			registrationStartTimen = profile.getValue("registrationStartTimen");
        			activityStartTime = profile.getValue("activityStartTime");
        			var registrationEndTimen = profile.getValue("registrationEndTimen");
        			if(registrationStartTimen!=null){
        				if(moment(registrationStartTimen).isAfter(moment(activityStartTime))){
        					Dialog.alert({
                        		title:"提示",
                        		content:"报名开始时间应在活动开始时间之前！"
                        	});
        					profile.setValue("registrationStartTimen",null);
            				return;
        				}
        				if(moment(registrationStartTimen).isAfter(moment(registrationEndTimen))){
        					Dialog.alert({
                        		title:"提示",
                        		content:"报名开始时间不能晚于报名结束时间！"
                        	});
        					profile.setValue("registrationStartTimen",null);
            				return;
        				}
        			}
        		},
        		"change .J-registrationEndTimen":function(e){
        			var  profile = this.get("profile");
        			var activityStartTime = profile.getValue("activityStartTime");
        			var registrationEndTimen = profile.getValue("registrationEndTimen");
        			var registrationStartTimen = profile.getValue("registrationStartTimen");
    				var activityEndTime = profile.getValue("activityEndTime");
    				if(registrationEndTimen){
    					if(moment(registrationEndTimen).isAfter(moment(activityEndTime))){
            				Dialog.alert({
                        		title:"提示",
                        		content:"报名结束时间不能晚于活动结束时间！"
                        	});
            				profile.setValue("registrationEndTimen",null);
                    		return;
            			}
    					if(moment(registrationStartTimen).isAfter(moment(registrationEndTimen))){
            				Dialog.alert({
                        		title:"提示",
                        		content:"报名结束时间不能早于报名开始时间！"
                        	});
            				profile.setValue("registrationEndTimen",null);
                    		return;
            			}
    				}
        		},
        		"change .J-activityEndTime":function(e){
        			var  profile = this.get("profile");
        			var activityStartTime = profile.getValue("activityStartTime");
    				var activityEndTime = profile.getValue("activityEndTime");
    				var registrationEndTimen = profile.getValue("registrationEndTimen");
					if(moment(activityEndTime).isBefore(moment(activityStartTime))){
        				Dialog.alert({
                    		title:"提示",
                    		content:"活动结束时间不能早于活动开始时间！"
                    	});
        				profile.setValue("activityEndTime",null);
                		return;
        			}
					if(activityEndTime){
						if(moment(activityEndTime).isBefore(moment(registrationEndTimen))){
							Dialog.alert({
	                    		title:"提示",
	                    		content:"活动结束时间不能早于报名结束时间！"
	                    	});
	        				profile.setValue("activityEndTime",null);
	                		return;
						}
					}
					var activityroom = profile.getValue("activityRoomName");
					if(activityroom){
						profile.setValue("activityRoomName","");
					}
        		},
        		"change .J-activityStartTime":function(e){
        			var  profile = this.get("profile");
        			var activityStartTime = profile.getValue("activityStartTime");
        			var activityEndTime = profile.getValue("activityEndTime");
        			var registrationStartTimen = profile.getValue("registrationStartTimen");
        			var scope = profile.getValue("scope");
        			var activityRoomName = profile.getValue("activityRoomName");
        			if(scope=="Inner"&&activityRoomName!=""){
        				if (moment(activityStartTime).diff(moment(),"days") > 13 ) {
        					Dialog.alert({
                        		title:"提示",
                        		content:"活动开始日期请在两周以内，请重新选择活动开始日期和结束日期！"
                        	});
        					profile.setValue("activityStartTime",null);
            				profile.setValue("activityEndTime",null);
                    		return;
    					}
        			}
					if(activityEndTime){
    					if(moment(activityEndTime).isBefore(moment(activityStartTime))){
            				Dialog.alert({
                        		title:"提示",
                        		content:"活动开始时间不能晚于活动结束时间！"
                        	});
            				profile.setValue("activityEndTime",null);
                    		return;
            			}
    				}
					if(activityStartTime){
						if(moment(activityStartTime).isBefore(moment(registrationStartTimen))){
            				Dialog.alert({
                        		title:"提示",
                        		content:"活动开始时间不能早于活动报名时间！"
                        	});
            				profile.setValue("activityStartTime",null);
                    		return;
            			}
					}
					var activityroom = profile.getValue("activityRoomName");
					if(activityroom){
						profile.setValue("activityRoomName","");
					}
        		},
        		"blur .J-mostActivityNumber":function(e){
        			var  profile = this.get("profile");
        			mostActivityNumber = profile.getValue("mostActivityNumber");
        			var activityRoomMostNumber ;
        			activityRoom = profile.getValue("activityRoom");
    				for(var i=0;i<actRoomData.length;i++){
    					if(activityRoom==actRoomData[i].pkActivityRoom){
    						activityRoomMostNumber = actRoomData[i].galleryful;
    						break;
    					}
    				}
    				if(mostActivityNumber){
    					if(mostActivityNumber>activityRoomMostNumber){
    						Dialog.alert({
                        		title:"提示",
                        		content:"最多活动人数不能大于所选活动室可容纳人数！"
                        	});
    						profile.setValue("mostActivityNumber",activityRoomMostNumber);
    						return;
    					}
    				}
        		},
        		"change .J-activityStart" : function(e){
        			var  profile = this.get("profile");
        			var activityroom = profile.getValue("activityRoomName");
        			if(activityroom){
						profile.setValue("activityRoomName","");
					}
        		},
        		"change .J-activityEnd" : function(e){
        			var  profile = this.get("profile");
        			var activityroom = profile.getValue("activityRoomName");
        			if(activityroom){
						profile.setValue("activityRoomName","");
					}
        		},
        		"click .J-activityRoomName":function(e){
        			var widget =this;
        			var  profile = widget.get("profile");
        			var start  ;
    				var end ;
        			var activityroomgrid =widget.activityRoomGrid(widget);
        			var scope = profile.getValue("scope");
        			if(!widget.get("params").isCycle){
        				var activityStartTime = profile.getValue("activityStartTime");
            			var activityEndTime = profile.getValue("activityEndTime");
        			}
        			if(scope != "Inner"){
    					Dialog.alert({
                    		title:"提示",
                    		content:"活动范围请选择为社区内！"
                    	});
                		return;
        			}
        			if(!widget.get("params").isCycle){
        				if(scope=="Inner"){
            				if (moment(activityStartTime).diff(moment(),"days") > 13 ) {
            					Dialog.alert({
                            		title:"提示",
                            		content:"活动开始日期请在两周以内，请重新选择活动开始日期和结束日期！"
                            	});
                				profile.setValue("activityStartTime",null);
                				profile.setValue("activityEndTime",null);
                        		return;
        					}
            			}
        			}
        			if(widget.get("params").isCycle){
        				var activityType = profile.getValue("activityType");
        				var week = profile.getValue("week");
        				var activityStart =$(".J-activityStart").val();
        				var activityEnd = $(".J-activityEnd").val();
        				
        				if(!activityType){
        					Dialog.alert({
                        		title:"提示",
                        		content:"请先选择周期类型！"
                        	});
                    		return;
        				}
        				if(!week){
        					Dialog.alert({
                        		title:"提示",
                        		content:"请先选择星期！"
                        	});
                    		return;
        				}
        				if(!activityStart){
        					Dialog.alert({
                        		title:"提示",
                        		content:"请先输入活动开始时间！"
                        	});
                    		return;
        				}
        				if(!activityEnd){
        					Dialog.alert({
                        		title:"提示",
                        		content:"请先输入活动结束时间！"
                        	});
                    		return;
        				}
        				var curdayofweek = moment().weekday();
        				var  fweek = 0;
        				switch (week) {
						case "one":
							fweek =1
							break;
						case "two":
							fweek =2
							break;
						case "three":
							fweek =3
							break;
						case "four":
							fweek =4
							break;
						case "five":
							fweek =5
							break;
						case "six":
							fweek =6
							break;
						}
        				if(fweek < curdayofweek){
        					var cyc ;
        					switch (activityType) {
    						case "weekActivities":
    							cyc =7
    							break;
    						case "doubleWeekActivities":
    							cyc =14
    							break;
    						}
        					start = moment(moment().weekday(cyc+fweek).format("YYYY-MM-DD")+" "+activityStart).valueOf()
        					end = moment(moment().weekday(cyc+fweek).format("YYYY-MM-DD")+" "+activityEnd).valueOf()
        				}else{
        					start = moment(moment().weekday(curdayofweek).format("YYYY-MM-DD")+" "+activityStart).valueOf()
        					end = moment(moment().weekday(curdayofweek).format("YYYY-MM-DD")+" "+activityEnd).valueOf()
        				}
        				
        			}else{
        				start = profile.getValue("activityStartTime");
        				end = profile.getValue("activityEndTime");
        				if(!start){
        					Dialog.alert({
                        		title:"提示",
                        		content:"请先输入活动开始时间！"
                        	});
                    		return;
        				}
        				if(!end){
        					Dialog.alert({
                        		title:"提示",
                        		content:"请先输入活动结束时间！"
                        	});
                    		return;
        				}
        				
        			}
        			widget.queryActRoom([start],[end],activityroomgrid);
        			Dialog.showComponent(activityroomgrid,{ 
    					title : "活动室预订",
    					defaultButton : false,
    					buttons : [{
    						id : "activityreset",
                            text : "清空",
                            handler : function(){
                            	profile.setValue("activityRoom","");
								profile.setValue("activityRoomName","");
                            	Dialog.close();
                            }
    					},{
                            id : "activityreturn",
                            text : "返回",
                            handler : function(){
                            	Dialog.close();
                            }
                        }],
    					setStyle:function(){
    						$(".modal").css({
    							"overflow": "visible",
    							"height":" 500px",
    						    "width": "80%",
    							"margin-left":" -20%",
    							"top":" 15%",
							});
    						$(".modal-body").css({
    							"overflow": "overlay",
    							"height":" 350px",
							});
    					}
    				});
        		}
        	},
            attrs:{
            	template:template
            },
            initComponent:function(params,widget){
    			var subnav=new Subnav({
    				parentNode:".J-subnav",
                       model:{
    					title:params&&params.isCycle?"周期活动发布":"单次活动发布",
						search : function(str) {
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:params&&params.isCycle?"api/activitycycle/search":"api/activity/search",
								data:{
									s:str,
									searchProperties:
											"theme," +
											"activitySite," +
											"activityRoom.name," +
											"users.name," +
											"members.personalInfo.name," +
											"interestGroups.description," +
											"mostActivityNumber," +
											"mostQueueNumber," +
											"contactInformation,",
									fetchProperties:"*," +
											"users.name," +
											"members.personalInfo.name," +
											"interestGroups.description," +
											"activityRoom.pkActivityRoom," +
											"activityRoom.name",
											
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
									
								}
							});
						},
    					buttonGroup:params&&params.isCycle?[]:Properties.activity_subnav_buttonGroup(widget),
    					buttons:Properties.activity_subnav_buttons(widget),
                    }
    				});
        			this.set("subnav",subnav);
        			
        			
                    var grid=new Grid({
                    	url :widget.get("params")&&widget.get("params").isCycle? "api/activitycycle/queryBydescribing":"api/activity/queryBydescribing",
            			autoRender:false,
                    	params:function(){
                    		var subnav=widget.get("subnav");
                			if(widget.get("params")){
                				return{
                					type:widget.get("params").activityType,
                					describing:widget.get("params")&&widget.get("params").isCycle?4:subnav.getValue("describing")
                				};
                			}else{
                				return{
                					describing:widget.get("params")&&widget.get("params").isCycle?4:subnav.getValue("describing")
                				};
                			}
        				},
                    	fetchProperties:"*," +
                    			"users.pkUser," +
                    			"users.name," +
                    			"members.pkMember," +
                    			"members.personalInfo.name," +
                    			"interestGroups.pkInterestGroup," +
                    			"interestGroups.name," +
                    			"interestGroups.description," +
                    			"activityRoom.pkActivityRoom," +
                    			"activityRoom.name",
                        parentNode:".J-grid",
                            model:{
                                columns:[{
                                    key:"theme",
                                    name:"主题",
                                    className:"oneHalfColumn",
                                	format:"detail",
            						formatparams:[{
            							key:"detail", 
            							handler:function(index,data,rowEle){
            								var subnav =widget.get("subnav");
            	                        	var grid =widget.get("grid");
            	                        	var  profile =widget.get("profile");
            	                        	profile.reset();
            	                        	profile.loadPicture("api/attachment/activityphoto/"+data.pkActivity);
            								$(".J-img").attr("src",data.pkActivity);
            								if(data.activityRoom){
            									if(data.activityRoom.pkActivityRoom ){
            										data.tmpActivityRoom =data.activityRoom;
                									data.activityRoomName=data.activityRoom.name;
                    								data.activityRoom=data.activityRoom.pkActivityRoom;	
            									}else{
            										data.activityRoomName=data.tmpActivityRoom.name;
                    								data.activityRoom=data.tmpActivityRoom.pkActivityRoom;	
            									}
            								}
            								if(!widget.get("params")||widget.get("params").isCycle==false||!widget.get("params").isCycle){
                    							data.cycle="false"; 
            								}else{
            									data.cycle="true";
            									data.activityStart=data.activityStartTime;
            									data.activityEnd=data.activityEndTime;
            									var d=moment(data.activityStartTime);
            									var s=d.days();
            									if(s==1){
            										data.week="one";
            									}
            									if(s==2){
            										data.week="two";
            									}
            									if(s==3){
            										data.week="three";
            									}
            									if(s==4){
            										data.week="four";
            									}
            									if(s==5){
            										data.week="five";
            									}
            									if(s==6){
            										data.week="six";
            									}
            									if(s==0){
            										data.week="seven";
            									}
            								}
            								profile.setData(data);
            								profile.setDisabled(true);
            								if(widget.get("params")&&widget.get("params").isCycle==false){
            									subnav.hide(["describing"]);
            								}
            								subnav.hide(["adds","search"]).show("return");
            								widget.show(".J-profile").hide(".J-grid");
            							} 
            						}]
                                },{
                                	key:"activityStartTime",
                                	name:"活动开始时间",
                                	className:"oneColumn",
                                	format:"date",
            						formatparams:{
            							mode:"YYYY-MM-DD HH:mm"
            						}
                                },{
                                	key:"activityEndTime",
                                	name:"活动结束时间",
                                	className:"oneColumn",
                                	format:"date",
            						formatparams:{
            							mode:"YYYY-MM-DD HH:mm"
            						}
                                },{
            						key:"activitySite",
            						name:"活动地点",
            						className:"oneColumn",
            					},{
            						key:"activityRoom.name",
            						name:"活动室",
            						className:"oneColumn",
            					},{
            						key:"users",
            						name:"秘书负责人",
            						className:"oneColumn",
            						format:function(value,row){
            							var names = "";
            							for (var i=0;i<value.length;i++) {
            								names += value[i].name+" ";
            							}
            							return names;
            						}
            					},{
            						key:"members",
            						className:"oneColumn",
            						name:i18ns.get("sale_ship_owner","会员")+"负责人",
            						format:function(value,row){ 
            							var names = "";
            							for(var i=0;i<value.length;i++){
            								names += value[i].personalInfo.name+" ";
            							}
            							return names;
            						}
            					},{
            						key:"interestGroups",
            						name:"活动类型",
            						className:"oneColumn",
            						format:function(value,row){
            							var descriptions = "";
            							for(var i=0;i<value.length;i++){
            								descriptions += value[i].name+" ";
            							}
            							return descriptions;
            						}
            					},{
            						key:"mostActivityNumber",
            						name:"最多活动人数",
            						className:"halfColumn",
            					},{
            						key:"mostQueueNumber",
            						name:"最多排队人数",
            						className:"halfColumn",
            					},{
            						key:"contactInformation",
            						name:"联系方式",
            						className:"oneColumn",
            					},{
            						key:"operate",
            						name:"操作",
            						className:"oneColumn",
            						format:"button",
            						formatparams:[{
            							key:"edit",
            							icon:"edit",
            							handler:function(index,data,rowEle){
            								var subnav =widget.get("subnav");
            	                        	var grid =widget.get("grid"); 
            	                        	var profile=widget.get("profile");
            	                        	var params =	widget.get("params");
            	                        	profile.reset();
            	                        	profile.loadPicture("api/attachment/activityphoto/"+data.pkActivity);
            								$(".J-img").attr("src",data.pkActivity);
            								if(data.activityRoom){
            									if(data.activityRoom.pkActivityRoom ){
            										data.tmpActivityRoom =data.activityRoom;
                									data.activityRoomName=data.activityRoom.name;
                    								data.activityRoom=data.activityRoom.pkActivityRoom;	
            									}else{
            										data.activityRoomName=data.tmpActivityRoom.name;
                    								data.activityRoom=data.tmpActivityRoom.pkActivityRoom;	
            									}
            								}
            								if(data.sportIntensity=="Low"){
            									data.sportIntensity={key:"Low",value:"低"};
            								}
            								else if(data.sportIntensity=="Centre"){
            									data.sportIntensity={key:"Centre",value:"中"};
            								}
            								else if(data.sportIntensity=="High"){
            									data.sportIntensity={key:"High",value:"高"};
            								}
            								if(params&&params.isCycle==true){
            									//弹出修改本次活动还是修改系列活动？
            									Dialog.confirm({
                									title:"提示",
                									content:"修改周期系列全部活动?",
            		 	    						confirm:function(){
            		 	    							//是
                    									data.activityStart=data.activityStartTime;
                    									data.activityEnd=data.activityEndTime;
                    									$(".J-update").val("all");
            		 	    						},
            		 		    					cancel:function(){
                    									$(".J-update").val("one");
            		 		    					}
            		 	    					});
            									data.activityStart=data.activityStartTime;
            									data.activityEnd=data.activityEndTime;
            									var d=moment(data.activityStartTime);
            									data.cycle="true";
            									var s=d.days();
            									if(s==1){
            										data.week="one";
            									}
            									if(s==2){
            										data.week="two";
            									}
            									if(s==3){
            										data.week="three";
            									}
            									if(s==4){
            										data.week="four";
            									}
            									if(s==5){
            										data.week="five";
            									}
            									if(s==6){
            										data.week="six";
            									}
            									if(s==0){
            										data.week="seven";
            									}
            								}
            								profile.setData(data);
            								if(widget.get("params")&&widget.get("params").isCycle==false){
            									subnav.hide(["describing"]);
            								}
            								subnav.hide(["adds","search"]).show("return");
            								widget.show(".J-profile").hide(".J-grid");
            							}
            						},{
            							key:"delete",
            							icon:"remove",
            							handler:function(index,data,rowEle){
            								var params = widget.get("params");
            								if(params.isCycle){

	            									Dialog.confirm({
	            									title:"提示",
	            									content:"删除周期系列全部活动?",
	        		 	    						confirm:function(){
	        		 	    							//是
	        		 	    							aw.ajax({
	        		 	    								url : "api/activitycycle/" + data.pkActivityCycle + "/delete",
	        		 	    								data : {
	        		 	    									pkActivity:data.pkActivityCycle,
	        		 			                             },
	        		 	    								dataType:"json",
	        		 	    								type : "POST",
	        		 	    								success : function(data){
	        		 	    									widget.get("grid").refresh();
	        		 	    								}
	        		 	    							});
	        		 	    						},
	            									});
	            								}else{
	            									aw.del("api/activity/" + data.pkActivity + "/delete",function(){
	            										widget.get("grid").refresh();
	            			 	 					});
	            								}
            							}
            						}]
            					}]
            				}
                    });
                    this.set("grid",grid);
                    
                    var profile=new Profile({
        				parentNode:".J-profile",
                        saveaction:function(){
                        	//校验活动室容纳人数和填写的最多活动人数
                        	var profile = widget.get("profile");
                        	mostActivityNumber = profile.getValue("mostActivityNumber");
                			var activityRoomMostNumber ;
                			activityRoom = profile.getValue("activityRoom");
            				for(var i=0;i<actRoomData.length;i++){
            					if(activityRoom==actRoomData[i].pkActivityRoom){
            						activityRoomMostNumber = actRoomData[i].galleryful;
            						break;
            					}
            				}
            				if(mostActivityNumber){
            					if(mostActivityNumber>activityRoomMostNumber){
            						Dialog.alert({
                                		title:"提示",
                                		content:"最多活动人数不能大于所选活动室可容纳人数！"
                                	});
            						profile.setValue("mostActivityNumber",activityRoomMostNumber);
            						return;
            					}
            				}
                        	var theme=widget.get("profile").getValue("theme");
                        	if(theme.length>30){
                        		Dialog.alert({
                            		title:"提示",
                            		content:"主题字符长度不能大于30！"
                            	});
                        		return;
                        	}
                        	var subnav =widget.get("subnav");
                        	var grid =widget.get("grid");
                        	var params =widget.get("params");
                        	var url ="";
                        	if(params&&params.isCycle){
                        		url="api/activitycycle/save"
                        			
                        	}else{
                        		url="api/activity/save";
                        	}
                        	//TODO:modelfill自动填充model，如果主动意图为清空，则无法实现，以下为特殊处理，前台传一个空字符串目的保留members字段
                        	var members=widget.get("profile").getValue("members");
                        	var data=$("#activity").serialize();
                        	if(members.length==0){
                        		data+="&members=";
                        	}
                        	Dialog.alert({
                        		title:"提示",
                        		defaultButton : false,
                        		content:"正在保存，请稍后……"
                        	});
                        	aw.saveOrUpdate(url,data,function(data){
                        		Dialog.close();
                        		var  uploadstr = "";
                        		var  returnpk = "";
                        		if(params&&params.isCycle){
                        			uploadstr="api/attachment/activityphoto/"+data.pkActivityCycle;
                        			returnpk=data.pkActivityCycle;
                        		}else{
                        			uploadstr="api/attachment/activityphoto/"+data.pkActivity;
                        			returnpk=data.pkActivity;
                        		}
                        		if(returnpk){
                        			//上传图片
                        			profile.upload(uploadstr);
                        		}
                        		grid.refresh();
                        		if(widget.get("params")&&widget.get("params").isCycle==false){
									subnav.show(["describing"]);
								}
                        		subnav.hide("return").show(["adds","search"]);
                				widget.show(".J-grid").hide(".J-profile");
                        	},function(data){
								Dialog.close();
							});
                        },
                        cancelaction : function(){
                        	var subnav =widget.get("subnav");
        					if(widget.get("params")&&widget.get("params").isCycle==false){
        						subnav.show(["describing"]);
        					}
        					subnav.hide("return").show(["adds","search"]);
        					widget.show(".J-grid").hide(".J-profile");
                        },
                        model:{
        					id:"activity",
        					items:[{
        						title:"活动信息",
        						icon:"bitbucket",
        						img:{
        							idAttribute:widget.get("params")&&widget.get("params").isCycle?"pkActivityCycle":"pkActivity",
        							url:widget.get("params")&&widget.get("params").isCycle?"api/attachment/activityphoto/":"api/attachment/activityphoto/",
        						},
        						children:Properties.getActivityForm(widget)
        					}],
        				},
                });
                this.set("profile",profile);
            },
            afterInitComponent:function(params,widget){
            	//修改活动室鼠标移入时间改变的图标
            	$(".J-activityRoomName").css({
            		"cursor":"pointer"
            	})
            	if(params && params.pkActivity!=null){
            		//判断跳转过来的活动的状态，动态设置describing的值
            		var describing ;
            		var activityStartTime = params.activityStartTime;
    				var activityEndTime = params.activityEndTime;
    				var now = moment().valueOf(); 
    				if(activityStartTime>now){
    					//则表示活动为开始
    					describing = 1;
    				}
    				if(activityStartTime<=now && activityEndTime>now){
    					//则表示活动为进行中
    					describing = 2;
    				}
    				if(activityEndTime<now){
    					//则表示活动为已结束(三个月内)
    					describing = 3;
    				}
    				widget.get("subnav").setValue("describing",describing);
            		var g=widget.get("grid");
					g.loading();
					aw.ajax({
						url :"api/activity/queryBydescribing",
						data:{
							pkActivity : params.pkActivity,
							describing : describing,
							type : params.activityType,
							fetchProperties:"*," +
                			"users.pkUser," +
                			"users.name," +
                			"members.pkMember," +
                			"members.personalInfo.name," +
                			"interestGroups.pkInterestGroup," +
                			"interestGroups.description," +
                			"activityRoom.pkActivityRoom," +
                			"activityRoom.name",
						},
						dataType:"json",
						success:function(data){
							g.setData(data);
						}
					});
            	}else{
            		widget.get("grid").refresh();
            	}
            } 
        });
        module.exports = Activity;
});