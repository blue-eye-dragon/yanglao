define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav");	
	var Grid=require("grid");
	var Dialog=require("dialog");
	var Form =require("form")
	var store = require("store");
	var activeUser = store.get("user");
	var enums  = require("enums");
	require("./complainapply.css");
	var template="<div class='el-complaint'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"<div class='J-Form hidden'></div>"+
		"</div>";
	var complain = ELView.extend({
    	attrs:{
    		template:template
        },
        events:{
        	"change .J-form-complainForm-select-memberSigning ":function(e){
        		var widget = this;
        		var form  = widget.get("form")
        		var memberSigning = form.getValue("memberSigning");
        		if(memberSigning){
        			form.load("complainter");
        		}else{
        			form.setData("complainter",[]);
        		}
        	},
        	"click .J-memberSigningDetails ":function(e){
        		var widget = this;
        		var grid  = widget.get("grid");
        		var form  = widget.get("form")
        		var data = grid.getData(grid.getIndex(e.currentTarget));
        		if(data){
        			var form =widget.get("form");
					widget.hide(".J-Grid").show(".J-Form");
    				widget.get("subnav").show(["return"]).hide(["search","add","acceptDate","building"]);
					form.reset();
					if(!data.tmpstatus){
						data.tmpstatus =data.status
					}else{
						data.status =data.tmpstatus
					}
					data.status =data.status.key
					form.setData(data);
					form.setDisabled(true);
        		}
        	}
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"投诉申请",
					items:[{
						id : "search",
						placeholder : "搜索",
                        type : "search",
                        handler : function(s){
                        	var g=widget.get("grid");
    						g.loading();
    						aw.ajax({
    							url:"api/complain/search",
    							data:{
    								s:s,
    								properties:"memberSigning.members.personalInfo.name," +
    										"memberSigning.room.number," +
    										"complainter.name," +
    										"acceptUser.name," +
    										"dutyDepartment.name," +
    										"dutyUser.name," +
    										"relationDepartment.name," +
    										"context," +
    										"status",
    								fetchProperties:"pkComplain," +
    										"memberSigning.pkMemberSigning," +
    										"memberSigning.members.personalInfo.name," +
    										"memberSigning.room.number," +
    										"memberSigning.room.building.pkBuilding,"+
    										"complainter.pkPersonalInfo," +
    										"complainter.name," +
    										"acceptDate," +
    										"acceptUser.pkUser," +
    										"acceptUser.name," +
    										"dutyDepartment.pkDepartment," +
    										"dutyDepartment.name," +
    										"dutyUser.pkUser," +
    										"dutyUser.name," +
    										"relationDepartment.pkSupplier," +
    										"relationDepartment.name," +
    										"context," +
    										"status," +
    										"version"
    										
    							},
    							dataType:"json",
    							success:function(data){
    								g.setData(data);
    							}
    						});
                        }
					},{
     				   id:"building",
     				   tip : "楼宇",
     				   type:"buttongroup",
     				   keyField : "pkBuilding",
     				   valueField : "name",
     				   items:activeUser.buildings,
     				   handler:function(key,element){
							   widget.get("grid").refresh();
     				   }  
					},{
						id : "acceptDate",
						tip : "受理时间",
						type : "daterange",
						ranges : {
					        "本月": [moment().startOf("month"), moment().endOf("month")]
						},
						defaultRange : "本月",
						minDate: "1930-05-31",
						maxDate: "2020-12-31",
						handler : function(time){
							 widget.get("grid").refresh();
						}
					},{
        				id:"return",
        				type:"button",
        				text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-Grid").hide(".J-Form");
	        				widget.get("subnav").hide(["return"]).show(["search","add","acceptDate","building"]);
	        				widget.get("form").setDisabled(false);
						}
					},{
						id:"add",
        				type:"button",
        				text:"新增",
						handler:function(){
							form.reset();
							widget.hide(".J-Grid").show(".J-Form");
	        				widget.get("subnav").show(["return"]).hide(["search","add","acceptDate","building"]);
						}
					}],
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-Grid",
				model:{
					url:"api/complain/query",
					params:function(){
						var subnav=widget.get("subnav")
						return {
							"memberSigning.room.building":subnav.getValue("building"),
							"acceptDate":subnav.getValue("acceptDate").start,
							"acceptDateEnd":subnav.getValue("acceptDate").end,
							"fetchProperties":"pkComplain," +
									"memberSigning.pkMemberSigning," +
									"memberSigning.members.personalInfo.name," +
									"memberSigning.room.number," +
									"memberSigning.room.building.pkBuilding,"+
									"complainter.pkPersonalInfo," +
									"complainter.name," +
									"acceptDate," +
									"acceptUser.pkUser," +
									"acceptUser.name," +
									"dutyDepartment.pkDepartment," +
									"dutyDepartment.name," +
									"dutyUser.pkUser," +
									"dutyUser.name," +
									"relationDepartment.pkSupplier," +
									"relationDepartment.name," +
									"context," +
									"status," +
									"version"
						};
					},
					columns:[{
						name:"memberSigning",
						label:"房间号",
						format:function(value,row){
							var  names = "";
                        	if(value.members.length > 0){
                        		for ( var i in value.members) {
									names += value.members[i].personalInfo.name+","
								}
                        	}
                        	return  "<a href='javascript:void(0);' style='color:red;' class='J-memberSigningDetails' data-index='"+row.pkMemberSigning+"'>"+value.room.number +"-" + names.substring(0, names.length -1)+"</a>";
						}
					},{
						name:"complainter.name",
						label:"投诉人"
					},{
						name:"context",
						className:"width_context",
						label:"投诉内容"
					},{
						name:"acceptUser.name",
						label:"受理人"
					},{
						name:"acceptDate",
						label:"受理时间",
						format:"date" 
					},{
						name:"status.value",
						label:"状态"
					},{
						key:"operate",
						name : "操作",
						format: "button",
						formatparams:[{
							key:"edit",
							text:"修改",
							show:function(value,row){
								if(row.status.key == "Initial"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								var form =widget.get("form");
								widget.hide(".J-Grid").show(".J-Form");
		        				widget.get("subnav").show(["return"]).hide(["search","add","acceptDate","building"]);
								form.reset();
								if(!data.tmpstatus){
									data.tmpstatus =data.status
								}else{
									data.status =data.tmpstatus
								}
								data.status =data.status.key
								form.setData(data);
							}
						},{
							key:"commit",
							text:"提交",
							show:function(value,row){
								if(row.status.key == "Initial"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否提交？",
									confirm:function(){
										aw.ajax({
			    							url:"api/complain/save",
			    							data:{
			    								status:"UnImplement",
			    								pkComplain:data.pkComplain,
			    								version:data.version
			    							},
			    							dataType:"json",
			    							success:function(data){
			    								widget.get("grid").refresh();
			    							}
			    						});
									}
								})
							}
						}]
					}]
				}
            });
            this.set("grid",grid);
        	var form=new Form({
        		parentNode:".J-Form",
        		model:{
        			id:"complainForm",
        			saveaction:function(){
            			var form =widget.get("form");
            			var pkBuilding = form.getPlugin("memberSigning").getData(form.getValue("memberSigning")).room.building.pkBuilding;
            			aw.saveOrUpdate("api/complain/save",form.getData(),function(data){
            				var  subnav =widget.get("subnav");
            				subnav.setValue("building",pkBuilding);
            				widget.get("grid").refresh();
            				widget.show(".J-Grid").hide(".J-Form");
            				subnav.hide(["return"]).show(["search","add","acceptDate","building"]);
            			});
            		},
            		cancelaction:function(){
            			widget.show(".J-Grid").hide(".J-Form");
        				widget.get("subnav").hide(["return"]).show(["search","add","acceptDate","building"]);
    					return false;
    				},
        			items:[{
        				name:"pkComplain",
        				type:"hidden"	
        			},{
        				name:"version",
        				type:"hidden"
        			},{
        				name:"status",
        				defaultValue :"Initial",
        				type:"hidden"
        			},{
                        name : "memberSigning",
                        type : "select",
                        label : "房间",
                        keyField : "pkMemberSigning",
                        format : function(data){
                        	var  names = "";
                        	if(data.members.length > 0){
                        		for ( var i in data.members) {
									names += data.members[i].personalInfo.name+","
								}
                        	}
                        	return data.room.number +"-" + names.substring(0, names.length -1)
                        },
                        valueField : "room.number",
                        url : "api/membersign/queryroom",
                        params : function(){
                            return {
                            	status:"Normal",
								"houseingNotIn" : false,
                            	fetchProperties:"pkMemberSigning,members.personalInfo.name,room.number,room.building.pkBuilding"
                            };
                        },
                        validate:["required"]
        			},{
        				lazy:true,
        				name : "complainter",
                        type : "select",
                        label : "投诉人",
                        keyField : "pkPersonalInfo",
                        valueField : "name",
                        url : "api/personalinfo/queryRelatedPersonnelByMemberSigning",
                        params : function(){
                            return {
                            	memberSigning:widget.get("form").getValue("memberSigning"),
                            	fetchProperties:"pkPersonalInfo,name"
                            };
                        },
                        validate:["required"]
        			},{
        				name:"acceptUser",
						label:"受理人",
						keyField:"pkUser",
						valueField:"name",
						url:"api/users/nofreeze",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name",
							seal:false
						}, 
						type:"select",
						defaultValue:activeUser.pkUser,
						validate:["required"]
        			},{
        				name : "acceptDate",
                        type : "date",
                        label : "受理日期",
                        defaultValue :moment().valueOf(),
                        validate:["required"]
        			},{
        				name:"dutyDepartment",
						label:"责任部门",
						keyField:"pkDepartment",
						valueField:"name",
						url:"api/department/query",
						params:{
							fetchProperties:"pkDepartment,name"
						},
						type:"select",
						validate:["required"]
        			},{
        				name:"dutyUser",
						label:"责任人",
						keyField:"pkUser",
						valueField:"name",
						url:"api/users/nofreeze",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name",
							seal:false
						}, 
						type:"select",
						validate:["required"]
        			},{
        				name:"relationDepartment",
						label:"关系部门",
						keyField:"pkSupplier",
						valueField:"name",
						url:"api/supplier/query",
						params:{
							fetchProperties:"pkSupplier,name"
						},
						type:"select"
        			},{
    				  name : "context",
                      type : "textarea",
                      label : "投诉内容",
                      validate:["required"]
        			},{
    				  name : "statusString",
                      label : "落实状态",
                      defaultValue :"初始",
                      readonly:true,
                      validate:["required"]
        			}]
        		}
        	});
        	this.set("form",form);
        },
	});
	module.exports = complain;	
});

