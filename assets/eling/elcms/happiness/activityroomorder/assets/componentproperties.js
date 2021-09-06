define(function(require, exports, module) {
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Form=require("form")
	var Dialog=require("dialog");
	var Grid = require("grid");
	var MultiRowGrid=require("multirowgrid");
	var emnu = require("enums");
	var FunctionProperties = require("./functionproperties");
	var ComponentProperties={
		getSubnav : function(widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
					model:{
						title:"活动室预订",
						items:[{
							id:"date",
							type:"date",
							defaultDate:new Date(moment().valueOf()),
							handler:function(a,b){
								widget.get("list").refresh();
							}
						},{
							id:"choose",
							type:"button",
							text:"预定",
							handler:function(){
								widget.get("form").reset();
								widget.get("form").hide(["cycleType","week"]).show(["activity"]);
								widget.hide([".J-grid"]).show([".J-form"]);
								$(".J-form").show();
								widget.get("subnav").hide(["date","choose","cancle"]).show(["return"]);
							}
						},{
							id:"return",
							type:"button",
							text:"返回",
							show:false,
							handler:function(){
								widget.hide([".J-form",".J-canclegrid"]).show([".J-grid"]);
								widget.get("subnav").hide(["return"]).show(["date","choose","cancle"]);
								widget.get("list").refresh();
								widget.get("canclegrid").refresh();
							}
						},{
							id:"cancle",
							type:"button",
							text:"取消",
							handler:function(){
								widget.hide([".J-grid"]).show([".J-canclegrid"]);
								$(".J-canclegrid").show();
								widget.get("subnav").hide(["date","choose","cancle"]).show(["return"]);
								widget.get("canclegrid").refresh();
							}
						}]
					}
			});
			return subnav;
		},
		getList : function(widget){
			var list=new MultiRowGrid({
				parentNode:".J-grid",
				url : "api/activityroomreserve/queryactivityroomreserve",
				params:function(){
					 var subnav =widget.get("subnav");
					return{
						startTime :subnav.getValue("date"),
						isNotBegin : false
					}
				},
				model:{
					multiField:"list",
					head:{
						title:""
					},
					columns:[{
						key:"name",
						name : "名称",
						format:function(value,row){
							var name=row.name;
							if(value.length>0){
								name+= "("+moment(row.endingTime).format('HH:mm')+"-"+moment(row.openingTime).format('HH:mm')+")";
							}
							return name;
						},
						className:"name",
					},{
						key:"roomNumber",
						name : "房间号",
						className:"roomNumber",
					},{
						key:"list",
						multiKey:"theme",
						name:"(活动)主题",
						isMulti:true,
						className:"theme",
						format:function(index,data,rowIndex){
							var type;
							var theme;
							var pkActivity;
							var activityStartTime;
							var activityEndTime;
							var isCycle;
							if(data.list.length==0){
								type = "";
								theme = "";
								pkActivity = "";
								activityStartTime = "";
								isCycle = ""
							}else{
								type = data.list[rowIndex].type;
								theme = data.list[rowIndex].theme;
								pkActivity = data.list[rowIndex].pkActivity;
								activityStartTime = data.list[rowIndex].activityStartTime;
								activityEndTime = data.list[rowIndex].activityEndTime;
								isCycle =  data.list[rowIndex].isCycle;
							}
							if(pkActivity==null){
								return theme;
							}else{
								return '<a data-isCycle="'+isCycle+'" data-type="'+type+'" data-activityStartTime="'+activityStartTime+'" data-activityEndTime="'+activityEndTime+'" data-pkActivity="'+pkActivity+'" class="J-theme-detail" style="color:#f34541;" href="javascript:void(0);">'+
								theme+'</a>';
							}
							
						}
					},{
						key:"list",
						multiKey:"usersname",
						name:"秘书负责人",
						className:"usersname",
						isMulti:true
					},{
						key:"list",
						multiKey:"contactInformation",
						name:"联系方式",
						className:"contactInformation",
						isMulti:true
					},{
						key:"list",
						multiKey:"activityStartTime",
						name:"(活动)开始时间",
						format:"date",
						className:"activityStartTime",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						isMulti:true
					},{
						key:"list",
						multiKey:"activityEndTime",
						name:"(活动)结束时间",
						className:"activityEndTime",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						isMulti:true
					},
//					{
//						key:"list",
//						multiKey:"particulars",
//						name:"备注",
//						className:"particulars",
//						isMulti:true
//					},
					{
						key:"list",
						multiKey:"pkActivityRoomReserve",
						className:"pkActivityRoomReserve",
						name:"操作",
						format:function(index,data,rowIndex){
							if(data.list.length==0){
								return "";
							}else{
								var endTime = data.list[rowIndex].activityEndTime;
								if(endTime>moment().valueOf()){
									return '<a data-pkActivityRoomReserve="'+data.list[rowIndex].pkActivityRoomReserve+'" style="margin-left:5px;color:white;background:#f34541" class="J-edit btn btn-xs" href="javascript:void(0);"><i class="icon-edit"></i></a>'
								}else{
									return "已结束"
								}
							}
						},
						isMulti:true
					}]
				}
			});
			return list;
		},
		getCancleGrid : function(widget){
			var canclegrid=new MultiRowGrid({
				parentNode:".J-canclegrid",
				url : "api/activityroomreserve/queryactivityroomreserve",
				params:function(){
					 var subnav =widget.get("subnav");
					return{
						startTime :moment().valueOf(),
						isNotBegin : true
					}
				},
				model:{
					multiField:"list",
					head:{
						title:""
					},
					columns:[{
						key:"name",
						name : "名称",
						className:"name",
					},{
						key:"roomNumber",
						name : "房间号",
						className:"roomNumber",
					},{
						key:"list",
						multiKey:"theme",
						name:"(活动)主题",
						className:"theme",
						isMulti:true,
						format:function(index,data,rowIndex){
							var type;
							var theme;
							var pkActivity;
							var activityStartTime;
							var activityEndTime;
							var isCycle;
							if(data.list.length==0){
								type = "";
								theme = "";
								pkActivity = "";
								activityStartTime = "";
								isCycle = ""
							}else{
								type = data.list[rowIndex].type;
								theme = data.list[rowIndex].theme;
								pkActivity = data.list[rowIndex].pkActivity;
								activityStartTime = data.list[rowIndex].activityStartTime;
								activityEndTime = data.list[rowIndex].activityEndTime;
								isCycle =  data.list[rowIndex].isCycle;
							}
							if(pkActivity==null){
								return theme;
							}else{
								return '<a data-isCycle="'+isCycle+'" data-type="'+type+'" data-activityStartTime="'+activityStartTime+'" data-activityEndTime="'+activityEndTime+'" data-pkActivity="'+pkActivity+'" class="J-theme-detail" style="color:#f34541;" href="javascript:void(0);">'+
								theme+'</a>';
							}
							
						}
					},{
						key:"list",
						multiKey:"usersname",
						name:"秘书负责人",
						className:"usersname",
						isMulti:true
					},{
						key:"list",
						multiKey:"contactInformation",
						name:"联系方式",
						className:"contactInformation",
						isMulti:true
					},{
						key:"list",
						multiKey:"activityStartTime",
						name:"(活动)开始时间",
						format:"date",
						className:"activityStartTime",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						isMulti:true
					},{
						key:"list",
						multiKey:"activityEndTime",
						name:"(活动)结束时间",
						format:"date",
						className:"activityEndTime",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						},
						isMulti:true
					},{
						key:"list",
						multiKey:"particulars",
						name:"备注",
						className:"particulars",
						isMulti:true
					},{
						key:"list",
						multiKey:"pkActivityRoomReserve",
						name:"操作",
						className:"pkActivityRoomReserve",
						format:function(index,data,rowIndex){
							if(data.list.length==0){
								return "";
							} else {
								var cycle;
								var pkActivityRoomReserveCycle;
								if(data.list[rowIndex].isCycle){
									cycle = data.list[rowIndex].isCycle;
								}else{
									cycle = false;
								}
								if(data.list[rowIndex].pkActivityRoomReserveCycle){
									pkActivityRoomReserveCycle = data.list[rowIndex].pkActivityRoomReserveCycle;
								}else{
									pkActivityRoomReserveCycle = ""
								}
								return '<a data-pkActivityRoomReserve="'+data.list[rowIndex].pkActivityRoomReserve+'" data-cycle="'+cycle+'" data-pkActivityRoomReserveCycle="'+pkActivityRoomReserveCycle+'" style="margin-left:5px;color:white;background:#f34541" class="J-cancle btn btn-xs" href="javascript:void(0);">取消</a>';
							}
						},
						isMulti:true
					}]
				}
			});
			return canclegrid;
		},
		getForm : function(widget){
			var form = new Form({
				parentNode:".J-form",
				model : {
					id : "form",
					saveaction : function(){
						//活动室周期预定和活动室单次预定分开操作；分开保存
						var form = widget.get("form");
						var pkActivity = form.getValue("activity");
						var cycle = form.getValue("cycle");
						var pkActivityRoomReserveCycle = form.getValue("pkActivityRoomReserveCycle")
						if(cycle == true){
							if(pkActivityRoomReserveCycle==""){
								aw.saveOrUpdate("api/activityroomreservecycle/save",aw.customParam(form.getData()),function(data){
									widget.show([".J-grid"]).hide([".J-form"]);
									widget.get("subnav").show(["date","choose","cancle"]).hide(["return"]);
									widget.get("list").refresh();
								});
							}else{
								//周期的活动室预定
								Dialog.alert({
									title : "提示",
									content : "本次活动室预定为活动室周期预定，您想修改所有未开始的预定还是只修改本次预定?",
									defaultButton : false,
									buttons : [{
										id : "cycle",
										text : "修改所有",
										className : "btn-primary",
										handler : function(){
											Dialog.close();
											//只需要pkpkActivityRoomReserveCycle
											var formdata = {
													pkActivityRoomReserveCycle : form.getValue("pkActivityRoomReserveCycle")
											}
											aw.saveOrUpdate("api/activityroomreservecycle/save",aw.customParam(form.getData()),function(data){
												widget.show([".J-grid"]).hide([".J-form"]);
												widget.get("subnav").show(["date","choose","cancle"]).hide(["return"]);
												widget.get("list").refresh();
											});
										}
									},{
										id : "single",
										text : "修改本次",
										handler : function(){
											Dialog.close();
											aw.saveOrUpdate("api/activityroomreserve/save",aw.customParam(form.getData()),function(data){
												widget.show([".J-grid"]).hide([".J-form"]);
												widget.get("subnav").show(["date","choose","cancle"]).hide(["return"]);
												widget.get("list").refresh();
											});
										}
									}]
								});
							}
						}else{
							if(pkActivity){
								//如果pkActivity存在
								//则只向后台提交pkActivity，pkActivityRoom，version
								var activityRoom = form.getValue("activityRoom");
								var pkActivityRoomReserve = form.getValue("pkActivityRoomReserve");
								var version = form.getValue("version");
								var particulars = form.getValue("particulars");
								if(pkActivityRoomReserve){
									var datas = {
											pkActivityRoomReserve : pkActivityRoomReserve,
											activity : pkActivity,
											activityRoom : activityRoom,
											version : version,
											particulars : particulars
										}
								}else{
									var datas = {
											activity : pkActivity,
											activityRoom : activityRoom,
											version : version,
											particulars : particulars
										}
								}
								aw.saveOrUpdate("api/activityroomreserve/save",aw.customParam(datas),function(data){
									FunctionProperties.refreshActivitySelect(widget);
									widget.show([".J-grid"]).hide([".J-form"]);
									widget.get("subnav").show(["date","choose","cancle"]).hide(["return"]);
									widget.get("list").refresh();
								});
							}else{
								//如果pkActivity为空，则提交表单到后台
								aw.saveOrUpdate("api/activityroomreserve/save",aw.customParam(form.getData()),function(data){
									widget.show([".J-grid"]).hide([".J-form"]);
									widget.get("subnav").show(["date","choose","cancle"]).hide(["return"]);
									widget.get("list").refresh();
								});
							}
						}
                    },
                    cancelaction : function(){
                    	FunctionProperties.refreshActivitySelect(widget);
                    	widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("subnav").show(["date","choose","cancle"]).hide(["return"]);
                    },
                    items : [{
                        name : "pkActivityRoomReserveCycle",
                        type : "hidden",
                    },{
                        name : "pkActivityRoomReserve",
                        type : "hidden",
                    },{
                    	name : "version",
                    	type : "hidden",
                    	defaultValue : "0"
                    },{
        				name : "cycle",
                        type : "radio",
                        label : "是否周期预定",
                        defaultValue : "false",
                        list : [{
                            key : true,
                            value : "是"
                        },{
                            key : false,
                            value : "否"
                        }]
        			},{
						name:"activity",
    					label:"单次活动",
    					type:"select",
    					url : "api/activityroomreserve/queryactivity",
    					keyField :"pkActivity",
    					value : "theme",
                        params : function(){
                            return {
                            	fetchProperties:"pkActivity,theme",
                            };
                        },
					},{
                    	name:"theme",
        				label:"主题",
        				validate:["required"],
                    },{
        				name:"description",
        				label:"(活动)描述",
        				type:"textarea"
        			},{
        				name : "cycleType",
        				label : "周期类型",
        				//目前只支持单周预定,给定默认值为“单周”，不可编辑
        				defaultValue : "单周",
        				readonly : true
        			},{
        				name:"startTime",
        				label:"(活动)开始时间",
        				type:"date",
        				mode:"YYYY-MM-DD HH:mm",
						step:30,
        				validate:["required"]
        			},{
        				name:"endTime",
        				label:"(活动)结束时间",
        				type:"date",
        				mode:"YYYY-MM-DD HH:mm",
        				step:30,
        				validate:["required"]
        			},{
        				name : "week",
        				label : "星期",
        				readonly : true
        			},{
                    	name:"activityRoomName",
        				readonly:true,
        				label:"活动室",
        				validate:["required"],
                    },{
                    	name:"users",
        				key:"pkUser",
        				value:"name",
        				url:"api/user/role",//TODO 用户角色：wulina 秘书
        				params:{
        					roleIn:"6,11,12,18,19,20,21",
        					fetchProperties:"pkUser,name"
        				},
        				label:"秘书负责人",
        				type:"select",
        				multi:true,
        				validate:["required"]
        			},{
                    	name:"activityRoom",
                    	type : "hidden"
                    },{
        				name:"participants",
        				label:"最多活动(参加)人数",
        				validate:["required"]
        			},{
        				name:"contactInformation",
        				label:"联系方式",
        				validate:["required"]
        			},{
        				name:"particulars",
        				label:"备注",
        				type:"textarea"
        			}]
				}
			});
			return form;
		},
	}
	module.exports=ComponentProperties;
})