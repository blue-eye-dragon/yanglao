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
	var Impgrid =require("./impgrid.js");
	require("../complainapply/complainapply.css");
	//var visitgrid =require("./visitgrid.js");
	var template="<div class='el-complaint'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"<div class='J-Form hidden'></div>"+
		"<div class='J-impgrid hidden'></div>"+
	//	"<div class='J-visitgrid hidden'></div>"+
		"</div>";
	var fetchProperties="pkComplain," +
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
						"version," +
						"complainImplements.followUser.pkUser," +
						"complainImplements.followUser.name," +
						"complainImplements.implementDate," +
						"complainImplements.context," +
						"complainImplements.version";
	var complainimplement = ELView.extend({
    	attrs:{
    		template:template
        },
        events:{
        	"click .J-memberSigningDetails ":function(e){
        		var widget = this;
        		var grid  = widget.get("grid");
        		var form  = widget.get("form");
        		var impgrid = widget.get("impgrid");
        		//取数据
        		var data = grid.getData(grid.getIndex(e.currentTarget));
        		if(data){
        			var form =widget.get("form");
					widget.hide(".J-Grid").show([".J-Form"
					                             ,".J-impgrid"
//					                             ,".J-visitgrid"
					                             ]);
    				widget.get("subnav").show(["return"]).hide(["search","status","acceptDate","building"]);
					form.reset();
					if(!data.tmpstatus){
						data.tmpstatus =data.status
					}else{
						data.status =data.tmpstatus
					}
					data.status =data.status.key
					//设置主表
					form.setData(data);
					form.setDisabled(true);
					//设置子表,落实进程
					impgrid.setData(data.complainImplements);
					impgrid.setDisabled(true);
        		}
        	}
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"投诉落实",
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
    								fetchProperties:fetchProperties
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
     				   id:"status",
     				   tip : "状态",
     				   type:"buttongroup",
     				   items:enums["com.eling.elcms.operation.model.Complain.Status"],
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
							widget.show(".J-Grid").hide([".J-Form"
							                             ,".J-impgrid"
//							                             ,".J-visitgrid"
							                             ]);
	        				widget.get("subnav").hide(["return","save"]).show(["search","status","acceptDate","building"]);
	        				widget.get("form").setDisabled(false);
	        				widget.get("impgrid").setDisabled(false);
	        				$(".J-impgrid .el-date input").val("");
	        				$(".J-impgrid .el-textarea textarea").val("");
	        				
						}
					},{
						id:"save",
        				type:"button",
        				text:"保存",
        				show:false,
						handler:function(){
							var impgrid = widget.get("impgrid");
							var form =widget.get("form");
							var data ={};
							//校验状态
							var status = form.getValue("status");
							if(!status){
								Dialog.alert({
									content : "落实状态不能为空!"
								 });
								return false;
							}
							//设置主表数据
							data.status = status
							data.pkComplain =form.getValue("pkComplain");
							data.version =form.getValue("version");
							var implist = impgrid.getData();
							if(implist.length == 0){
								Dialog.alert({
									content : "请添加落实记录!"
								 });
								return false;
							};
							for ( var i in implist) {
								
								//校验
								if(!implist[i].implementDate){
									Dialog.alert({
										content : "时间不可为空!"
									 });
									return false;
								}
								if(!implist[i].context){
									Dialog.alert({
										content : "内容不可为空!"
									 });
									return false;
								}
								//处理跟进人
								implist[i].followUser=implist[i].followUser.pkUser
							};
							data.implist = implist;
							data.fetchProperties="memberSigning.room.building.pkBuilding,status";
							aw.saveOrUpdate("api/complain/implement",aw.customParam(data),function(data){
								var  subnav =widget.get("subnav");
	            				subnav.setValue("building",data.memberSigning.room.building.pkBuilding);
	            				subnav.setValue("status",data.status.key);
								widget.get("grid").refresh();
								widget.show(".J-Grid").hide([".J-Form"
								                             ,".J-impgrid"
//								                             ,".J-visitgrid"
								                             ]);
		        				subnav.hide(["return","save"]).show(["search","status","acceptDate","building"]);
							});
							
						}
					}],
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-Grid",
            	autoRender:false,
				model:{
					url:"api/complain/query",
					params:function(){
						var subnav=widget.get("subnav")
						return {
							"memberSigning.room.building":subnav.getValue("building"),
							"status":subnav.getValue("status"),
							"acceptDate":subnav.getValue("acceptDate").start,
							"acceptDateEnd":subnav.getValue("acceptDate").end,
							"fetchProperties":fetchProperties
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
                        	//格式化form数据
                        	{
	                        	row.memberSigningString =value.room.number +"-" + names.substring(0, names.length -1);
	                        	row.cname = row.complainter.name;
	                        	row.aname=row.acceptUser.name;
	                        	row.acceptDateString =moment(row.acceptDate).format("YYYY-MM-DD");
	                        	row.ddname =row.dutyDepartment.name;
	                        	row.dname =row.dutyUser.name
	                        	row.rdname = row.relationDepartment?row.relationDepartment.name:"";
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
					}
//					,{
//						name:"nowvisitdate",
//						label:"受理时间",
//						format:function(value,row){
//							
//						}
//					}
					,{
						name:"status.value",
						label:"状态"
					},{
						key:"operate",
						name : "操作",
						format: "button",
						formatparams:[{
							key:"implement",
							text:"落实",
							show:function(value,row){
								if(row.status.key == "UnImplement"){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								var cloneData = $.extend(true,{},data);
								var form = widget.get("form");
								var impgrid = widget.get("impgrid");
								
								
								widget.hide(".J-Grid").show([".J-Form"
								                             ,".J-impgrid"
//								                             ,".J-visitgrid"
								                             ]);
		        				widget.get("subnav").show(["return","save"]).hide(["search","status","acceptDate","building"]);
								form.reset();
								if(!data.tmpstatus){
									data.tmpstatus =data.status
								}else{
									data.status =data.tmpstatus
								}
								data.status =data.status.key
								//设置卡片数据
								form.setData(data);
								//设置列表数据，落实进程
								impgrid.setData(cloneData.complainImplements);
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
        			defaultButton:false,
        			items:[{
        				name:"pkComplain",
        				type:"hidden"	
        			},{
        				name:"version",
        				type:"hidden"
        			},{
                        name : "memberSigningString",
                        label : "房间",
                        readonly:true
        			},{
        				name : "cname",
                        label : "投诉人",
                        readonly:true
        			},{
        				name:"aname",
						label:"受理人",
						readonly:true
        			},{
        				name : "acceptDateString",
                        label : "受理日期",
                        readonly:true
        			},{
        				name:"ddname",
						label:"责任部门",
						readonly:true
        			},{
        				name:"dname",
						label:"责任人",
						readonly:true
        			},{
        				name:"rdname",
						label:"关系部门",
						readonly:true
        			},{
    				  name : "context",
                      type : "textarea",
                      label : "投诉内容",
                      readonly:true
        			},{
    				  name : "status",
                      label : "落实状态",
                      type : "select",
                      options:[{
                    	  key:"UnImplement",
                    	  value:"待落实"
                      },{
                    	  key:"End",
                    	  value:"完成" 
                      }],
                      validate:["required"]
        			}]
        		}
        	});
        	this.set("form",form);
        	this.set("impgrid",Impgrid.init(this,{
				parentNode : ".J-impgrid",
			}));
        },
        afterInitComponent:function(params,widget){
        //TODO:聂 设置导航条默认值
        	widget.get("subnav").setValue("status","UnImplement");
        	 widget.get("grid").refresh();
        	
        },
        compare:function(datas){
       	datas= datas.sort(function(a,b){
       		return a.implementDate- b.implementDate;
       	 });
       	this.get("impgrid").setData(datas);
        }
	});
	module.exports = complainimplement;	
});

