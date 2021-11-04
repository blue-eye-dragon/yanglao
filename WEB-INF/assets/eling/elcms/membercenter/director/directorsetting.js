define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	require("../../grid_css.css");
	var Dialog=require("dialog-1.0.0");
        var directorsetting  = BaseView.extend({
        	events : {
    			"change .J-form-member-select-building":function(e){
    				var card=this.get("card");
    				var pk =card.getValue("building");
    				if(pk){
    					card.load("directors",{
							params:{
								"memberSigning.room.building.pkBuilding":pk,
								fetchProperties:"pkMember,personalInfo.pkPersonalInfo,memberSigning.membershipContract.membershipCard.name,memberSigning.membershipContract.membershipCard.pkMemberShipCard,personalInfo.idNumber,memberSigning.room.pkRoom,personalInfo.nationality,personalInfo.citizenship.name,personalInfo.citizenship.pkCountry,pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone,personalInfo.email,personalInfo.sex,personalInfo.phone,personalInfo.address,personalInfo.nameEn"
		                	},callback:function(data){}
						})
						card.load("directorRelations",{
							params:{
								"memberSigning.room.building.pkBuilding":pk,
								fetchProperties:"pkMember,personalInfo.pkPersonalInfo,memberSigning.membershipContract.membershipCard.name,memberSigning.membershipContract.membershipCard.pkMemberShipCard,personalInfo.idNumber,memberSigning.room.pkRoom,personalInfo.nationality,personalInfo.citizenship.name,personalInfo.citizenship.pkCountry,pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone,personalInfo.email,personalInfo.sex,personalInfo.phone,personalInfo.address,personalInfo.nameEn"
		                	},callback:function(data){}
						})
    				}else{
    					card.setData("directors",[]);
    				}
    			},
    			"change .J-form-member-select-directors":function(e){
    				var card=this.get("card");
    				var directors=card.getValue("directors"); 
    				var rooms = [];
    				for ( var i in directors) {
    					 var  tmp =card.getData("directors",{
    						pk:directors[i]
    					 }) ;
    					 rooms.push(tmp.memberSigning.room.pkRoom);
					}
    				aw.ajax({
						url:"api/member/query",
						data:{
							"memberSigning.room.pkRoomIn":rooms.toString(),
							"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
							fetchProperties:"pkMember," +
									"personalInfo.name," +
									"memberSigning.room.number," +
									"memberSigning.room.pkRoom"
						},
						dataType:"json",
						success:function(data){
							for(var i =0 ;i<data.length;i++){
								for(var j =0 ;j<directors.length;j++){
									if(data[i].pkMember == directors[j]){
										data.splice(i,1);
									}
								}
							}
							card.setValue("directorRelations",data);
						}
					});
    			},
    		},
            initSubnav:function(widget){
        			return{
        				model:{
        					title:"理事设置",
        					buttonGroup:[{
        						id:"building",
        						showAll:true,
        						showAllFirst:true,
        						handler:function(key,element){
        							widget.get("list").refresh();
        						}
            				}],
        					buttons:[{
        						id:"return",
        						text:"返回",
        						show:false,
        						handler:function(){
        							var form= widget.get("card");
        							var subnav= widget.get("subnav");
        							form.reset();
        							widget.list2Card(false);
        							subnav.hide(["return"]).show(["building","add"]);
        						}
        					},{
        						id:"add",
        						text:"新增",
        						handler:function(){
        							var form= widget.get("card");
        							var subnav= widget.get("subnav");
        							form.reset();
        							form.load("building");
        							form.load("directors");
        							form.load("directorRelations");
        							subnav.hide(["add","building"]).show(["return"]);
    								widget.list2Card(true)
        						}
        					}],
        				}
    				};
              },
    			initList:function(widget){
    				return{
                	url : "api/buildingdirectors/query",
                	params:function(){
                		var subnav=widget.get("subnav");
                		return {
                			"building.pkBuilding":subnav.getValue("building"),
                    		fetchProperties:
                    			    "pkBuildingDirectors,"+
                    			    "building.pkBuilding,"+
                    			    "building.name,"+
                    				"directors.member.pkMember," +
                    				"directors.member.personalInfo.name," +
                    				"directors.member.memberSigning.room.number," +
                    				"directors.member.memberSigning.room.pkRoom,"+
                    				"directorRelations.member.pkMember," +
                    				"directorRelations.member.personalInfo.name," +
                    				"directorRelations.member.memberSigning.room.number," +
                    				"directorRelations.member.memberSigning.room.pkRoom," +
                    				"version"
                		};
                	},
                    model:{
                        columns:[{
                        	key:"building.name",
    						name:"楼宇",
    						className:"twoHalfColumn",
                        },{
                        	key:"directors",
    						name:"理事姓名",
    						className:"fourColumn",
    						format:function(value,row){
        							var name= "";
        							if(value.length>0){
        								for(var i =0 ;i<value.length;i++){
        									if(i<value.length-1){
        										name+= value[i].member.personalInfo.name+"、";
        									}else{
        										name+= value[i].member.personalInfo.name;
        									}
        								}
        							}else{
        								name="无";
        							}
        							return name;
        						}	
    					},{
                        	key:"directorRelations",
    						name:"理事关系人",
    						className:"fourColumn",
    						format:function(value,row){
        							var name= "";
        							if(value.length>0){
        								for(var i =0 ;i<value.length;i++){
        									if(i<value.length-1){
        										name+= value[i].member.personalInfo.name+"、";
        									}else{
        										name+= value[i].member.personalInfo.name;
        									}
        								}
        							}else{
        								name="无";
        							}
        							return name;
        						}	
    					},{
    						key:"change",
    						name:"操作",
    						format:"button",
    						formatparams:[{
    							key:"detail",
    							text:"修改",
    							handler:function(index,data,rowEle){
    								var subnav= widget.get("subnav");
    								subnav.hide(["building","add"]).show(["return"]);
    								var  card = widget.get("card");
    								widget.list2Card(true);
    								card.reset();
    								var buildings = card.getData("building");
    								buildings.push(data.building);
    								card.setData("building",buildings);
    								card.setData(data);
    								card.setAttribute("building","readonly",true);
    								var director=[];
									for(var j=0; j<data.directors.length;j++){
										if(data.directors[j].member!=null){
											director.push({pkMember:data.directors[j].member.pkMember,
												memberSigning:data.directors[j].member.memberSigning,
												personalInfo:data.directors[j].member.personalInfo})
										}
									}	
									card.load("directors",{
    									params:{
    										"memberSigning.room.building.pkBuilding":data.building.pkBuilding,
    										fetchProperties:"pkMember,personalInfo.pkPersonalInfo,memberSigning.membershipContract.membershipCard.name,memberSigning.membershipContract.membershipCard.pkMemberShipCard,personalInfo.idNumber,memberSigning.room.pkRoom,personalInfo.nationality,personalInfo.citizenship.name,personalInfo.citizenship.pkCountry,pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone,personalInfo.email,personalInfo.sex,personalInfo.phone,personalInfo.address,personalInfo.nameEn"
    				                	},callback:function(data){
    				                		card.setData("directors",data);
    				                		card.setValue("directors",director);
    				                	}
    								})
    								var directorRelation=[];
    								for(var j=0; j<data.directorRelations.length;j++){
										if(data.directorRelations[j].member!=null){
											directorRelation.push({pkMember:data.directorRelations[j].member.pkMember,
												memberSigning:data.directorRelations[j].member.memberSigning,
												personalInfo:data.directorRelations[j].member.personalInfo})
										}
									}	
									card.load("directorRelations",{
    									params:{
    										"memberSigning.room.building.pkBuilding":data.building.pkBuilding,
    										fetchProperties:"pkMember,personalInfo.pkPersonalInfo,memberSigning.membershipContract.membershipCard.name,memberSigning.membershipContract.membershipCard.pkMemberShipCard,personalInfo.idNumber,memberSigning.room.pkRoom,personalInfo.nationality,personalInfo.citizenship.name,personalInfo.citizenship.pkCountry,pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone,personalInfo.email,personalInfo.sex,personalInfo.phone,personalInfo.address,personalInfo.nameEn"
    				                	},callback:function(data){
    				                		card.setData("directorRelations",data);
    				                		card.setValue("directorRelations",directorRelation);
    				                	}
    								})
    							}
    						},{
    							key:"delete",	
    							text:"删除",
    							handler:function(index,data,rowEle){
    								aw.del("api/buildingdirectors/" + data.pkBuildingDirectors + "/delete",function(){
    									widget.get("list").refresh();
    								});
    							}
    						
    						}]
    					}]
    				}
    		     };
    		}, 
                initCard:function(widget){
        			return {
        				compType:"form-2.0.0",
        				saveaction:function(){
        					var card=widget.get("card");
        					var data = card.getData();
        					var datas ={};
        					var directorlist = [];
        					for(var i=0; i<data.directors.length;i++){
    							var director={
    									"member":data.directors[i],
            							"type":"Director",
            					};
    							directorlist.push(director);
    					    }
        					datas.directorlist = directorlist;
        					var directorRelationslist = [];
        					for(var i=0; i<data.directorRelations.length;i++){
    							var directorRelation={
    									"member":data.directorRelations[i],
            							"type":"DirectorRelation",
            					};
    							directorRelationslist.push(directorRelation);
    					    }
        					datas.directorRelationslist = directorRelationslist;
        					datas.building = data.building;
        					datas.pkBuildingDirectors = data.pkBuildingDirectors;
        					datas.version = data.version;
        					aw.saveOrUpdate("api/buildingdirectors/save",aw.customParam(datas),function(data){
        						widget.get("list").refresh();
        					});        	
        					var subnav= widget.get("subnav");
        					subnav.hide(["return"]).show(["building","add"]);
        					widget.list2Card(false);
        				},
        				//取消按钮
        				cancelaction:function(){
        					widget.get("card").reset();
        					widget.list2Card(false);
        					var subnav= widget.get("subnav");
        					subnav.hide(["return"]).show(["building","add"]);
        				},
        				model:{
        					id:"member",
        					items:[{
								name:"pkBuildingDirectors",
								type:"hidden",
							},{
								name:"version",
								type:"hidden",
							},{
								name:"building",
								label:"楼宇",
								url:"api/buildingdirectors/query/building",
        						key:"pkBuilding",
        						value:"name",
        						params:function(){
        							return {
        								"useType":"Apartment",
        								fetchProperties:"pkBuilding,name,"
        							};
        						},
        						type:"select",
             					validate:["required"],
        						
							},{
        						name:"directors",
        						label:"理事姓名",
        						url:"api/member/query",
        						params:function(){
        							return {
        								fetchProperties:"pkMember," +
        										"personalInfo.name," +
        										"memberSigning.room.number," +
        										"memberSigning.room.pkRoom"
        							};
        						},
        						key:"pkMember",
        						value:"memberSigning.room.number,personalInfo.name",
        						multi:true,
        						type:"select",
             					validate:["required"],
							},{
        						name:"directorRelations",
        						label:"理事关系人", 
        						url:"api/member/query",
        						params:function(){
        							return {
        								fetchProperties:"pkMember," +
										"personalInfo.name," +
										"memberSigning.room.number," +
										"memberSigning.room.pkRoom"
        							};
        						},
        						key:"pkMember",
        						value:"memberSigning.room.number,personalInfo.name",
        						multi:true,
        						type:"select",
							}]
        				}
        			};
        		}
        });
        module.exports = directorsetting ;
});

