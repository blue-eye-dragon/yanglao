/*
 * 预约房间查询
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var Form =require("form")
	var Dialog = require("dialog-1.0.0");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-form hidden'></div>";
	var depositroomquery = ELView.extend({
		attrs:{
        	template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
				model : {
					title:"预约房间查询",
					search : function(str) {
						var g = widget.get("grid");
						aw.ajax({
							url:"api/deposit/search",
							data:{
								s : str,
								properties : "room.number,name,mobilePhone,phoneNumber,operator.name",
								fetchProperties : "*,room.number,room.status,operator.name,operator.pkUser"
							},
							dataType : "json",
							success : function(data) {
								g.setData(data);
							}
						});
					},
					buttonGroup:[{
     				   id:"building",
     				   tip:"楼宇",
    				   showAll:true,
    				   showAllFirst:true,
    				   handler:function(key,element){
							   widget.get("grid").refresh();
						   }  
    			    }],
    			    buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").hide(["return"]).show(["time","search","building"]);
						}
					}],
					time:{
     				   click:function(time){
     					   widget.get("grid").refresh();
     				   }
     			   }
				}
        	});
        	this.set("subnav",subnav);
        	
        	var grid=new Grid({
        		parentNode:".J-grid",
        		url : "api/deposit/query",
				params : function() {
					var subnav = widget.get("subnav");
					if(params&&params.depositlockroom){
						params=params.depositlockroom;
					}else if(params&&params.pkDeposit){
						params=params.pkDeposit;
					}
					return {
						pkDeposit:params,
						"room.building.pkBuilding":widget.get("subnav").getValue("building"),
						"chargeTime":widget.get("subnav").getValue("time").start,
						"chargeTimeEnd":widget.get("subnav").getValue("time").end,
//						"chargeStatus":"Receiving",
						"room.status":"Appoint",
						fetchProperties:"*,room.number,room.status,operator.name,operator.pkUser"
					}
				},
	        	model:{
	        		columns:[{
	        			key:"room.number",
	        			name:"房间号"
	        		},{
	        			key:"room.status.value",
	        			name:"房间状态"
	        		},{
	        			key:"name",
	        			name:"交款人"
	        		},{
						key:"phoneNumber",
						name:"联系电话"
					},{
						key:"realDeposit",
						name: i18ns.get("charge_deposit_depmoney","预约")+"金额",
						className: "text-right",
						format:"thousands"
					},{
						key:"chargeTime",
						name:"收款日期",
						format:"date"
					},{
						key:"operator.name",
						name:"经手人"
					},{
						key:"operate",
						name:"操作",
						format:function(row,value){
							if(value.room!=null&&value.room.status.key=="Appoint"){
								return "button";
							}else{
								return "";
							}
						},
						formatparams:[{
							key:"edit",
							text:"修改",
							handler:function(index,data,rowEle){
								var form = widget.get("form");
								form.reset();
								form.setData(data);
//								form.setValue("pkDeposit",data.pkDeposit);
								form.setValue("pkRoom",data.room.pkRoom);
    							//form.setValue("version",data.version);
    							form.setValue("roomstatus",data.room.status.value);
    							form.setValue("operator",data.operator.pkUser);
								widget.show([".J-form"]).hide([".J-grid"]);
								widget.get("subnav").show(["return"]).hide(["search","time","building"]);
							}
						},{
							key:"remove",
							text:"解除预约",
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否解除预约？",
									confirm:function(){
										aw.ajax({
											url:"api/deposit/changeroomstatus",
											data:{
												pkDeposit:data.pkDeposit,
												version:data.version
											},
											dataType:"json",
											success:function(data){
												widget.get("grid").refresh();
											}
										});
									}
								});
							}
						}]
					}]
	        	}
        	});
        	this.set("grid",grid);
        	var form = new Form({
        		show:false,
         		parentNode:".J-form",
         		saveaction : function() {
         			var form=widget.get("form");
					var  data = form.getData();
					//var oldroom = data.pkRoom;
					var params=$("#depositroom").serialize()+"&"+"oldroom="+data.pkRoom;
					aw.saveOrUpdate("api/deposit/updateRoom",params,function(data){
						widget.hide([".J-form"]).show([".J-grid"]);
						widget.get("subnav").show(["search","building","time"]).hide("return");
						widget.get("grid").refresh();
						form.load("room",{
							params:{
								"statusIn":"Empty",
								"useType":"Apartment",
								fetchProperties:"pkRoom,number,type.pkRoomType",
		                	},callback:function(data){}
						});
					});
         		},
         		cancelaction:function(){
					widget.hide(".J-form").show(".J-grid");
					widget.get("subnav").show(["search","building","time"]).hide("return");
					return false;
				},
         		model:{
         			id:"depositroom",
         			items:[{
         				name:"pkDeposit",
         				type:"hidden"
         			},{
         				name : "version",
						defaultValue : "0",
						type : "hidden"
         			},{
         				name:"pkRoom",
         				type:"hidden"
         			},{
         				name:"room",
						label:"房间号",
						keyField :"pkRoom",
						type:"select",
						url:"api/room/query",
						params:function(){
							return{
								"statusIn":"Empty",
								"useType":"Apartment",
								fetchProperties:"pkRoom,number,type.pkRoomType",
							};
						},
						valueField :"number"
         			},{
         				name:"roomstatus",
						label:"房间状态",
						readonly:true
         			},{
         				name:"name",
						label:"交款人",
						readonly:true
         			},{
         				name:"phoneNumber",
						label:"联系电话",
						readonly:true
         			},{
         				name:"realDeposit",
						label: i18ns.get("charge_deposit_depmoney","预约")+"金额",
						readonly:true
         			},{
         				name:"chargeTime",
						label:"收款日期",
						readonly:true
         			},{
         				name:"operator",
						label:"经手人",
						key:"pkUser",
						type:"select",
						url:"api/users",//TODO 用户角色：wulina
						params:{
							fetchProperties:"pkUser,name"
						},
						value:"name",
						readonly:true
         			}]
         		}
        	});
        	this.set("form",form);
        },
		afterInitComponent : function(params,widget) {
		}
	});
	module.exports = depositroomquery;
});











