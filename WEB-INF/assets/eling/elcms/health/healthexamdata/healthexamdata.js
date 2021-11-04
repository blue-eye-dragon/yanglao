
define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
    var Dialog=require("dialog-1.0.0");
    var store=require("store");
    var loginUser=store.get("user");
	//多语
	var i18ns = require("i18n");
    var allowDeleData;
	var HealthExamData = BaseView.extend({
		events:{
			"change .J-form-healthexamdata-select-type" : function(e){ 
				var  pkType = this.get("card").getValue("type");
				var dataType = this.get("card").getData("type",{
					pk:pkType
				});
				if(dataType){
					if(dataType.name1){
						this.get("card").show("value1");
						this.get("card").setValue("value1");
						this.get("card").setLabel("value1",dataType.name1);
					}else{
						this.setValue("value","");
					}
					if(dataType.name2){
						this.get("card").show("value2"); 
						this.get("card").setValue("value2","");
						this.get("card").setLabel("value2",dataType.name2);
					}else{
						this.get("card").hide("value2"); 
						this.get("card").setValue("value2","");
					}
					if(dataType.name3){    
						this.get("card").show("value3"); 
						this.get("card").setValue("value3","");
						this.get("card").setLabel("value3",dataType.name3);
					}else{
						this.get("card").hide("value3");   
						this.get("card").setValue("value3","");
					}
					if(dataType.name4){    
						this.get("card").show("value4"); 
						this.get("card").setValue("value4","");
						this.get("card").setLabel("value4",dataType.name4);
					}else{
						this.get("card").hide("value4");  
						this.get("card").setValue("value4","");
					}
					if(dataType.name5){    
						this.get("card").show("value5");
						this.get("card").setValue("value5","");
						this.get("card").setLabel("value5",dataType.name5);
					}else{
						this.get("card").hide("value5");  
						this.get("card").setValue("value5","");
					}
					if(dataType.name6){    
						this.get("card").show("value6"); 
						this.get("card").setValue("value6","");
						this.get("card").setLabel("value6",dataType.name6);
					}else{
						this.get("card").hide("value6");   
						this.get("card").setValue("value6","");
					}
			}else{
					this.get("card").setLabel("value1","测量值1");
					this.get("card").show("value2");
					this.get("card").setLabel("value2","测量值2");
					this.get("card").show("value3");
					this.get("card").setLabel("value3","测量值3");
					this.get("card").show("value4");
					this.get("card").setLabel("value4","测量值4");
					this.get("card").show("value5");
					this.get("card").setLabel("value5","测量值5");
					this.get("card").show("value6");
					this.get("card").setLabel("value6","测量值6");
			   }
			}
		}, 
		initSubnav:function(widget){
			var params = widget.get("params");
			var tit;
			if(params&&params.allowDeleData=="true")
			{
				tit="健康设备数据清理";
				allowDeleData=true;
			}else{
				tit="健康数据日报";
				allowDeleData=false;
			}
			return {
				model:{
					title:tit,
					search : {
						placeholder : i18ns.get("sale_ship_owner","会员")+":房间号/"+i18ns.get("sale_ship_owner","会员")+"名",
						handler : function(str){
							var g=widget.get("list");
							g.loading();
							aw.ajax({
								url : "api/healthexamdata/querydevice",
								data : {
									s : str, 
									allowDeleData:allowDeleData,
									properties : "member.memberSigning.room.number,member.personalInfo.name",
									fetchProperties:"*,member.memberSigning.room.number,type.name,type.name1,type.name2,type.name3,type.name4" +
									",type.name5,type.name6,member.personalInfo.name,creator.name,hospital.pkHospital,hospital.name",
								},
								dataType : "json",
								success : function(data) {
										g.setData(data);
								}
							});
						}
					},
					buttons:[{
 						id:"toexcel",
 						text:"导出",
 						handler:function(){ 
 							var subnav=widget.get("subnav");
							var time=subnav.getValue("date");
							var building=subnav.getValue("building");
							var member=subnav.getValue("defaultMembers");
 							var	params ="api/healthexamdata/toExcel?createDate="+time.start+"&createDateEnd="+time.end;
 							if(building){
 								params+="&member.memberSigning.room.building="+building;
 								if(member){
 	 								params+="&member="+member;
 	 							}
 							}
 							window.open(params);
 							return false;
 	 					}				
 					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.get("subnav").show(["defaultMembers","date","building"]).hide(["return"]);
							widget.show(".J-list").hide(".J-card");
							return false;
						}
					}],
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							var subnav=widget.get("subnav");
							subnav.setValue("defaultMembers","");
							if(key){
								subnav.show(["defaultMembers"]);
								subnav.load({
									id:"defaultMembers",
									params:{
										fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number",
										"memberSigning.room.building.pkBuilding":key
									}
								});
							}else{
								subnav.hide(["defaultMembers"]);
							}
							widget.get("list").refresh();
							widget.get("card").load("member");
							widget.get("card").load("creator");
						}
					
					},{
						id:"defaultMembers",
						show:false,
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").setValue("member",key);
						}
					}],
					date:{
						click:function(date){
						    widget.get("list").refresh();
						}
					},
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/healthexamdata/query",
				params:function(){
					var subnav=widget.get("subnav");
					var source="";
					if(widget.get("params")&&widget.get("params").allowDeleData=="true"){
						source="Device";
					}
					var time=widget.get("subnav").getValue("date");
						return {
							source:source,
							createDate:time.start,
							createDateEnd:time.end,
							member:subnav.getValue("defaultMembers"),
							"member.memberSigning.room.building":subnav.getValue("building"),
							fetchProperties:"*,source,member.memberSigning.room.number,type.name,type.name1,type.name2,type.name3,type.name4" +
									",type.name5,type.name6,member.personalInfo.name,creator.name,hospital.pkHospital,hospital.name",
						};					
				},
				model:{
					columns:[{
						key:"createDate",
						className:"col-md-1",
						name:"测量时间",	
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"member.memberSigning.room.number",
						className:"col-md-1",
						name:"房间号",
					},{
						key:"member.personalInfo.name",
						className:"col-md-1",
						name:i18ns.get("sale_ship_owner","会员"),
					},{
						key:"type.name",
						className:"col-md-1",
						name:"测量名称"
					},{
						key:"description",
						className:"col-md-3",
						name:"测量值"
					},{
						key:"creator.name",
						className:"col-md-1",
						name:"记录人",
						format:function(value,row){
								return value;
						}
					},{
						key:"source",
						className:"col-md-1",
						name:"来源",
						format:function(value,row){
								return value.value;
						}
					},{
						key:"source",
						className:"col-md-1",
						name:"操作",
						format:function(value,row){
							var params = widget.get("params");
							if(params&&params.allowDeleData=="true")//设备
							{
								return "button";
							}else
							{
								return "";
							}
							
    					},
						formatparams:[{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/healthexamdata/" + data.pkHealthExamData + "/delete",function (data){
									var search=widget.get("subnav").getValue("search");
									if(search!=""&&search!=null){
										var g=widget.get("list");
										g.loading();
										aw.ajax({
											url : "api/healthexamdata/querydevice",
											data : {
												s : search, 
												allowDeleData:allowDeleData,
												properties : "member.memberSigning.room.number,member.personalInfo.name",
												fetchProperties:"*,member.memberSigning.room.number,type.name,type.name1,type.name2,type.name3,type.name4" +
												",type.name5,type.name6,member.personalInfo.name,creator.name,hospital.pkHospital,hospital.name",
											},
											dataType : "json",
											success : function(data) {
													g.setData(data);
											}
										});
									}else{
										widget.get("list").refresh();
									}
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
					widget.save("api/healthexamdata/save",$("#healthexamdata").serialize(),function(){					
           				widget.get("list").refresh();
           				widget.list2Card(false);
           				widget.get("subnav").show(["date","building","defaultMembers"]);
					});
				},
				cancelaction : function() {
					widget.list2Card(false);
					widget.get("subnav").show(["date","building","defaultMembers"]);
				},
				model:{
					id:"healthexamdata",
					items:[{
						name:"pkHealthExamData",
						type:"hidden",
					},{
						name:"source",
						defaultValue:"Manual",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/member/query",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							return {
								"memberSigning.room.building":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
     					validate:["required"]
					},{
						name:"createDate",
						label:"测量时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"type",
						label:"健康数据类型",
						url:"api/healthexamdatatype/query",
						key:"pkHealthExamDataType",
						value:"name",
						params:function(){
							return {								
								fetchProperties:"pkHealthExamDataType,name,name1,name2,name3,name4,name5,name6"
							};
					   },
					   type:"select",
					   validate:["required"]
					}, {
						name:"hospital",
						label:"医院",
						type:"select",
						key:"pkHospital",
						url:"api/hospital/query",
						value:"name",
					},{
						name:"value1",
						label:"测量值1",
						validate:["required"]
					},{
						name:"value2",
						label:"测量值2",
					},{
						name:"value3",
						label:"测量值3",
					},{
						name:"value4",
						label:"测量值4",
					},{
						name:"value5",
						label:"测量值5",
					},{
						name:"value6",
						label:"测量值6",
					},{
						name:"creator",
						label:"记录人",
						type:"select",
						key:"pkUser",
						value:"name",
						lazy:true,
						url:"api/user/building",//TODO 用户角色：wulina 健康秘书
						params:function(){
							return {
								pkBuilding:widget.get("subnav").getValue("building"),
								pkRole:20,
							    fetchProperties:"pkUser,name"
							};
						},
						validate:["required"]
					}]
				}
			};
		},
		 afterInitComponent:function(params,widget){
	        	if(params&&params.allowDeleData=="true"){
	        		var subnav = this.get("subnav");
	        		subnav.hide(["toexcel","building","date"]);
	        	}
		 }
	});
	module.exports = HealthExamData;
});