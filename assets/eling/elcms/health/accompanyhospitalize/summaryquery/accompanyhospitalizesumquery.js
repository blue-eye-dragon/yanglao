/*
 * 集体陪同就医查询
 */
define(function(require, exports, module){
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	//多语
	var i18ns = require("i18n");
//	var Form = require("form");
	var template="<div class='J-subnav'></div>"+
	 	"<div class='J-grid'></div>"+
	 	"<div class='J-grid2 hidden'></div>";
	 	
	 var accompanyhospitalizesumquery  = ELView.extend({
	    	attrs:{
	    		template:template
	    	},
	    	initComponent:function(params,widget){
	     		var subnav=new Subnav({
	     			parentNode:".J-subnav",
	     			model:{
	     				title:"集体陪同就医汇总查询",
	     				time:{
							ranges:{
								"上周":[moment().subtract(1,"weeks").startOf("week"), moment().subtract(1,"weeks").endOf("week")],
								"本周": [moment().startOf("week"), moment().endOf("week")],
								"本月": [moment().startOf("month"), moment().endOf("month")],
							},
							defaultTime:"本周",
							click:function(time){
								widget.get("grid").refresh();
							}
						},
						buttons:[{
							id:"return",
							text:"返回",
							show:false,
							handler:function(){
								widget.hide([".J-grid2"]).show([".J-grid"]);
								widget.get("subnav").hide(["return"]).show(["time"]);
							}
						}]
	     			}
	     		});
	     		this.set("subnav",subnav);
	     		
	     		var grid=new Grid({
	     			parentNode:".J-grid",
	     			url:"api/accompanyhospitalizesummary/query",
	     			params:function(){
	     				var subnav=widget.get("subnav");
						var time=subnav.getValue("time");
						return{
							date:time.start,
							dateEnd:time.end,
							fetchProperties:"*,principal.pkUser,principal.name,purchaser.name,summaryDate,apps.money",
							orderString:"summaryDate:desc"
						};
	     			},
					model:{
						columns:[{
							key:"summaryDate",
							name:"汇总单号",
							format:function(value,row){
								return moment(value).format("YYYYMMDDHHmm");
							}
						},{
							key:"principal.name",
							name:"负责人"
						},{
							key:"purchaser",
							name:"责任秘书",
							format:function(value,row){
								var ret="";
								if(value && value.length){
									for(var i=0;i<value.length;i++){
										ret+=value[i].name+"，";
									}
									return ret.substring(0,ret.length-1);
								}
								return "";
							}
						},{
							key:"accompanyDate",
							name:"陪同就医日期",
							format:"date"
						},{
							key:"totalMoney",
							name:"购买金额",
							format:function(row,value){
								if(row){
									if(row==0){
										return 0;
									}else{
										return row.toFixed(2);
									}
								}else{
									return 0;
								}
							}
						},{
							key:"operate",
							name:"查看详情",
							format:"button",
							formatparams:[{
								key:"detail",
								text:"查看详情",
								handler:function(index,data2,rowEle){
									aw.ajax({
										url:"api/accompanyhospitalizemanager/query",
										data:{
											summary:data2.pkAccompanyHospitalizeSummary,
											fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number," +
													"flowStatus.*,hospital.name,summary.summaryDate"
										},
										dataType:"json",
										success:function(data){
											if(data.length>0){
												widget.get("grid2").setData(data);
												var title=moment(data[0].summary.accompanyDate).format("YYYYMMDD");
												if(data2.principal){
													title+="（负责人："+data2.principal.name+"）";
												}
												widget.get("grid2").setTitle(title);
												widget.show([".J-grid2"]).hide([".J-grid"]);
												widget.get("subnav").show(["return"]).hide(["time"]);
											}else{
												Dialog.alert({
				        							content : "没有相应信息！"
				        						 });
				        		    			 return false;
											}
										}
									});
								}
							}]
						}]
					}
	     			
	     		});
	     		 this.set("grid",grid);
	     		 
	     		var grid2 = new Grid({
	     			parentNode:".J-grid2",
	            	model:{
	            		head:{
							title:""
						},
	            		columns:[{
							key : "member",
							name : i18ns.get("sale_ship_owner","会员"),
							col:2,
							format:function(value,row){
								return value.personalInfo.name + " " + value.memberSigning.room.number;
							}
						},{
							key:"hospital.name",
							name:"医院"
						},{
							key:"hospitalDepartment",
							name:"预约科室"
						},{
							key:"description",
							name:"描述",
						},{
							key:"money",
							name:"金额",
							col:2,
							format:function(row,value){
								if(row){
									if(row==0){
										return 0;
									}else{
										return row.toFixed(2);
									}
								}else{
									return 0;
								}
							}
						},{
							key:"flowStatus.value",
							name:"状态",
							col:1
						}]
					}
	     		});
	     		this.set("grid2",grid2);
	    },
    });
	 module.exports = accompanyhospitalizesumquery;	
});
	 	


















