define(function(require,exports,module){
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var Dashboard=require("dashboard");
	
	var aw=require("ajaxwrapper");
	var properties=require("./properties");
	var FlotWrapper=require("flotwrapper");
	
	var template=require("./memberstatus.tpl");
	
	require("./memberstatus.css");
	
	var MemberStatus=ELView.extend({
		attrs:{
			template:template,
			model:{}
		},
		events:{
			"click .J-member-lifemodel" : function(e){
                var inParams = this.get("params");
                var flg;
                if(inParams&&inParams.flg==null){
                    flg="memberstatus";
                }else{
                    flg=inParams.flg;
                }
                var data=this.get("model").data;
                var subnav=this.get("subnav");
                this.openView({
                    url:"eling/elcms/lifemodelmember/lifemodelmember/lifemodelmember1",
                    params:{
                        pkMember:data.pkMember,
                        flg:flg,
						param:'lifemodel'
                    },
                    isAllowBack:true
                });
            },
			"click .J-member-baseinfo" : function(e){
				var inParams = this.get("params");
				var flg;
				if(inParams&&inParams.flg==null){
					flg="memberstatus";
				}else{
					flg=inParams.flg;
				}
				var data=this.get("model").data;
				var subnav=this.get("subnav");
				this.openView({
					url:"eling/elcms/membercenter/member/member",
					params:{
						pkMemberSigning:data.memberSigning.pkMemberSigning,
						pkCard:data.memberSigning.card.pkMemberShipCard,
						pkMember:data.pkMember,
						flg:flg,
						iorder:data.iorder,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
						pkBuilding:subnav.getValue("building")
					},
					isAllowBack:true
				});
			},
            "click .J-member-modeldata" : function(e){
                var inParams = this.get("params");
                var flg;
                if(inParams&&inParams.flg==null){
                    flg="memberstatus";
                }else{
                    flg=inParams.flg;
                }
                var data=this.get("model").data;
                var subnav=this.get("subnav");
                this.openView({
                    url:"eling/elcms/lifemodelmember/lifemodelmember/lifemodelmember2",
                    params:{
                        pkMember:data.pkMember,
                        flg:flg,
						param:'modeldata'
                    },
                    isAllowBack:true
                });
            },
			"click .J-member-lifeinfo" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/membercenter/memberlife/memberlife",
					params:{
						pkBuilding:this.get("subnav").getValue("building"),
						flg:"memberstatus",
						flgs:inParams.flg,
						pkMember:data.pkMember,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
					},
					isAllowBack:true
				});
			},
			"click .J-member-healinfo" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/membercenter/memberheaithy/memberheaithy",
					params:{
						pkBuilding:this.get("subnav").getValue("building"),
						flg:"memberstatus",
						flgs:inParams.flg,
						pkMember:data.pkMember,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
					},
					isAllowBack:true
				});
			},
			"click .J-member-hapyinfo" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/happiness/hpydb/hpybd",
					params:{
						pkBuilding:this.get("subnav").getValue("building"),
						flg:"memberstatus",
						flgs:inParams.flg,
						pkMember:data.pkMember,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
					},
					isAllowBack:true
				});
			},
			"click .J-member-activityinfo" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/membercenter/memberstatus/assest/memberactroomusetime",
					params:{
						pkBuilding:this.get("subnav").getValue("building"),
						flg:"memberstatus",
						flgs:inParams.flg,
						pkMember:data.pkMember,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
					},
					isAllowBack:true
				});
			},
			"click .J-dashboard-top-item-lifeDailyRecord" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/life/lifeDailyRecord/lifeDailyRecord",
					params:{
						flg:inParams.flg,
						pkMember:data.pkMember,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
						status:data.status,
						fatherNode:"eling/elcms/membercenter/memberstatus/memberstatus",
						fatherParams:{
							type:"secretary",
							pkBuilding:this.get("subnav").getValue("building")
						}
					},
					isAllowBack:true
				});
			},
			"click .J-dashboard-top-item-healthDailyRecord" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/health/healthDailyRecord/healthDailyRecord",
					params:{
						flg:data.status.key,
						pkRoom:data.memberSigning.room.pkRoom,
						pkMember:data.pkMember,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
						fatherNode:"eling/elcms/membercenter/memberstatus/memberstatus",
						fatherParams:{
							type:"secretary",
							pkBuilding:this.get("subnav").getValue("building")
						}
					},
					isAllowBack:true
				});
			},
			"click .J-dashboard-top-item-healthdataquery" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/health/healthdataquery/healthdataqueryNew",
					params:{
						flg:inParams.flg,
						"pkMember":inParams.pkMember,
						buildname:this.get("subnav").getText("building"),
						membername:data.personalInfo.name,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
						pkBuilding:this.get("subnav").getValue("building"),
					},
					isAllowBack:true
			});
					   
				
			},
			"click .J-dashboard-top-item-repair" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/property/repair/repair",
					params:{
						flg:inParams.flg,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
						pkBuilding:this.get("subnav").getValue("building"),
						pkRoom:data.memberSigning.room.pkRoom
					},
					forward:"memberstatus",
					isAllowBack:true
				});
			},
			"click .J-dashboard-top-item-activitysignup" : function(){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/happiness/activitysignup/activitysignup",
					params:{
						flg:data.status.key,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
						"pkMember":data.pkMember,
						pkBuilding:this.get("subnav").getValue("building"),
					},
					isAllowBack:true
				});
			},
			"click .J-dashboard-top-item-comment" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/life/familycommunication/familycommunication",
					params:{
						flg:inParams.flg,
						member:data.pkMember,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
						pkBuilding:this.get("subnav").getValue("building")
					},
					isAllowBack:true,
					forward:"memberstatus"
				});
			},
			"click .J-lifelog-detail" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/reports/liferecord/liferecord",
					params:{
						roomnumber:inParams.roomnumber,
						pkBuilding:this.get("subnav").getValue("building"),
						pkMember:data.pkMember,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
						flg:inParams.flg,
					},
					isAllowBack:true
				});
			},
			"click .J-healthlog-detail" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/reports/healthrecord/healthrecord",
					params:{
						pkBuilding:this.get("subnav").getValue("building"),
						pkMember:data.pkMember,
						pkRoom:data.memberSigning.room.pkRoom,
						name:data.memberSigning.room.number+" "+data.personalInfo.name,
						flg:inParams.flg,
					},
					isAllowBack:true
				});
			},
			"click .J-activity-detail" : function(e){
				var inParams = this.get("params");
				var data=this.get("model").data;
				this.openView({
					url:"eling/elcms/happiness/bymemberqueryactivity/bymemberqueryactivity",
					params:{
						pkMember:data.pkMember,
						flg:inParams.flg,
					},
					isAllowBack:true
				});
				
			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会员全景",
					buttonGroup:[{
						id:"building",
						show:params && params.flg&&params.flg=="deceasedmembers"? false:true,
						handler:function(key,element){
							widget.get("subnav").load({
								id:"defaultMembers",
								params:{
									fetchProperties:"personalInfo.name,pkMember,memberSigning.room.number,status",
									"memberSigning.room.building":key
								},
								callback:function(data){
									widget.queryDetail({
										pkMember:data[0].pkMember
									});
								}
							});
						}
					},{
						id:"defaultMembers",
						show:params && params.flg&&params.flg=="deceasedmembers"? false:true,
						handler:function(key,element){
							if(params && params.flg&&params.flg=="deceasedmembers"){
								widget.queryDetail({
									pkMember:params.pkMember
								});
							}else{
								widget.queryDetail({
									pkMember:key
								});
							}
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var dashboard=new Dashboard({
				parentNode:".J-dashboard",
				model:{
					top:{
						items:[{
							id:"lifeDailyRecord",
							color:"purple",
							icon:"icon-building",
							text:"生活日志"
						},{
							id:"healthDailyRecord",
							color:"blue",
							icon:"icon-pencil",
							text:"健康日志"
						},{
							id:"healthdataquery",
							color:"green",
							icon:"icon-star",
							text:"健康数据查询"
						},{
							id:"repair",
							color:"orange",
							icon:"icon-bell-alt",
							text:"报修"
						},{
							id:"activitysignup",
							color:"red",
							icon:"icon-refresh",
							text:"活动报名"
						},{
							id:"comment",
							color:"red",
							icon:"icon-comments",
							text:"家属沟通"
						}]
					}
				}
			});
			this.set("dashboard",dashboard);
		},
		setEpitaph:function(){
			var subnav=this.get("subnav");
			var inParams = this.get("params");
			return {
				pkBuilding:subnav.getValue("building"),
				pkMember:subnav.getValue("defaultMembers")?subnav.getValue("defaultMembers"):inParams.pkMember,
				flg:inParams.flg,
			};
		},
		afterInitComponent:function(params){
			var subnav=this.get("subnav");
			if(params&&params.flg&&params.flg=="deceasedmembers"&&params.pkBuilding==null){
				aw.ajax({
					url : "api/room/query",
					data : {
						"number":params.roomnumber,
						fetchProperties:"building.pkBuilding,building.name"
					},
					dataType:"json",
					success : function(datas) {
						if(datas){
							subnav.setValue("building",datas[0].building.pkBuilding);
						}
					}
				});
			}else{
				var pkBuilding=params.pkBuilding;
				//设置building
				if(pkBuilding){
					subnav.setValue("building",pkBuilding);
				}
			}
			//设置会员
			subnav.load({
				id:"defaultMembers",
				params:{
					"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
					fetchProperties:"personalInfo.name,pkMember,memberSigning.room.number,status",
					"memberSigning.room.building.pkBuilding":subnav.getValue("building")
				},
				callback:function(){
						subnav.setValue("defaultMembers",params.pkMember);
					
				}
			});
				this.queryDetail({
					pkMember:params.pkMember
				});
			
		},
		queryDetail:function(params){
			var widget=this;
			var queryParams=params || {};
			queryParams.fetchProperties=properties.mem_baseinfo;
			aw.ajax({
				url:"api/member/query",
				dataType:"json",
				data:queryParams,
				success:function(data){
					if(data && data[0]){
						var result=data[0];
						result.sexName=result.personalInfo.sex.key=="MALE" ? "男" : "女";
						result.age=moment().diff(result.personalInfo.birthday, 'years');
						result.phone=result.personalInfo.phone;
						result.mobilePhone=result.personalInfo.mobilePhone;
						if(result.memberSigning.checkInDate!=null){
							var d=moment(result.memberSigning.checkInDate);
							result.memberSigning.checkInDate=d.format("YYYY-MM-DD");
						}
						var emPersons=result.memberSigning.ecPersons || [];
						var retEMPersons=[];
						if(emPersons.length!=0){
							for(var i=0;i<emPersons.length;i++){
								var temp={};
								temp.index=(i+1);
								temp.emPerson=emPersons[i];
								retEMPersons.push(temp);
							}
						}else{
							retEMPersons.push({
								index:""
							});
						}
						result.emPersons=retEMPersons;
						var model=widget.get("model") || {};
						model.data=result;
						widget.renderPartial(".J-memberinfo");
						widget.$(".J-member-picture").attr("src","api/attachment/personalphoto/"+result.personalInfo.pkPersonalInfo);
					}
				}
			});
			
			//查询生活日志数量
			aw.ajax({
				url:"api/lifedata/queryLifeCount",
				dataType:"json",
				data:{
					pkMember:params.pkMember,
					date:moment().valueOf()
				},
				success:function(data){
					var result=widget._geneLineData(data);
					FlotWrapper.line({
						parentNode:"#stats-chart1",
					},[{
						data:result
					}],{
						xaxis:{
							ticks:widget._geneXfield()
						},
						yaxis:{
							min:0
						}
					});
				}
			});
			
			//查询健康日志数量
			aw.ajax({
				url:"api/healthdata/queryHealthCount",
				dataType:"json",
				data:{
					pkMember:params.pkMember,
					date:moment().valueOf()
				},
				success:function(data){
					var result=widget._geneLineData(data);
					FlotWrapper.line({
						parentNode:"#stats-chart2",
					},[{
						data:result
					}],{
						xaxis:{
							ticks:widget._geneXfield()
						},
						yaxis:{
							min:0
						}
					});
				}
			});
			
			//查询活动
			aw.ajax({
				url:"api/activity/queryactivityCount",
				dataType:"json",
				data:{
					pkMember:params.pkMember,
					date:moment().valueOf()
				},
				success:function(data){
					var happy=[];
					var health=[];
					var life=[];
					
					for(var i=0;i<data.length;i++){
						life.push(data[i].lifeNum || 0);
						health.push(data[i].healthNum || 0);
						happy.push(data[i].happinessNum || 0);
					}
					
					FlotWrapper.line({
						parentNode:"#stats-chart3",
					},[{
						label:"快乐活动",
						data:widget._geneLineData(happy),
						color:"#9564e2"
					},{
						label:"健康活动",
						data:widget._geneLineData(health),
						color:"#00acec"
					},{
						label:"生活活动",
						data:widget._geneLineData(life),
						color:"#f34541"
					}],{
						xaxis:{
							ticks:widget._geneXfield()
						},
						yaxis:{
							min:0
						}
					});
				}
			});
		},
		_geneLineData:function(data){
			var result=[];
			if(data){
				for(var i=0;i<data.length;i++){
					result.push([i,data[i]]);
				}
			}
			return result;
		},
		_geneXfield:function(){
			var date=moment();
			var month=date.month()+1;
			var xField=[];
			for(var i=0;i<12;i++){
				if(month+i>11){
					xField.push([i,month+i-11]);
				}else{
					xField.push([i,month+i+1]);
				}
			}
			return xField;
		}
	});
	
	module.exports=MemberStatus;
});