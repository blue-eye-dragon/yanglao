define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var store=require("store");
	var loginUser =store.get("user");
	//多语
	var i18ns = require("i18n");
	var Company = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"入住订花",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/checkinimplement/search",
							data:{
								s:str,
								properties:"memberSigning.room.number,memberSigning.checkInDate,memberSigning.members.personalInfo.name,status",
								fetchProperties:"*,status.value,memberSigning.checkInDate,checkInOrderflowers.*,memberSigning.room.*,memberSigning.members,memberSigning.members.personalInfo.*"
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
						handler:function(){
							widget.list2Card(false);
							widget.show(".J-status,.J-checkInStatus,.J-time,.J-search").hide(".J-return");
							return false;
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
						id:"status",
						items:[{
		                    key:"Initial",
		                    value:"初始"
						},{
		                    key:"Booking",
		                    value:"已预订"
						},{
		                    key:"NoRequiement",
		                    value:"无要求"
						},{
		                    key:"Served",
		                    value:"已送达"
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
						"memberSigning.checkInDate":time.start, 
						"memberSigning.checkInDateEnd":time.end,
						status:widget.get("subnav").getValue("checkInStatus"),
						"checkInOrderflowers.status":widget.get("subnav").getValue("status"),
						fetchProperties:"*,status.value,memberSigning.checkInDate,checkInOrderflowers.*,memberSigning.room.*,memberSigning.members,memberSigning.members.personalInfo.*"
					};
				},
				autoRender:false,
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号"
					},{
						key:"memberSigning.checkInDate",
						name:"入住时间",
						format:"date"
					},{
						key:"memberSigning",
						name:i18ns.get("sale_ship_owner","会员"),
						format:function(value,row){
							if(value!=null){
//								var m=value.members[0].personalInfo.name;
								var ret="";
								for(var i=0;i<value.members.length;i++){
									ret+=value.members[i].personalInfo.name+",";
								}
								return ret;
							}
						}
					},{
						key:"status.value",
						name:"准备状态"
					},{
						key:"checkInOrderflowers.status.value",
						name:"订花状态"
					},{
						key:"checkInOrderflowers.orderTime",
						name:"订花时间",
						format:"date"
					},{
						key:"checkInOrderflowers.sendTime",
						name:"送花时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm:ss"
						}
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							text:"预定",
							show:function(value,row){
								if(row.checkInOrderflowers!=null){
									if(row.checkInOrderflowers.status.key == "Initial"){
										return true;
									}
									
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								

//								widget.hide(".J-status,.J-checkInStatus,.J-time,.J-search").show(".J-return");
//								widget.get("card").reset();
////								widget.get("card").removeAttribute("annualFeePerson","readonly");
////								widget.get("card").removeAttribute("annualFeePersonPhone","readonly");
//								var userSelect=widget.get("card").getData("orderUser","");
//								userSelect.push(loginUser);
//								widget.get("card").setModel("orderUser",userSelect);
//								widget.get("card").setValue("orderUser",loginUser);
//								widget.list2Card(true);
//							
								
								var m=data.checkInOrderflowers.pkCIOrderFlowers;
								widget.setData(data.checkInOrderflowers.pkCIOrderFlowers,data.memberSigning.checkInDate,widget); 
								widget.hide(".J-status,.J-checkInStatus,.J-time,.J-search").show(".J-return");
								widget.list2Card(true);
								return false;
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
					var data=widget.get("card").getData();
//					data.orderUser=store.get("user").pkUser;
					if(data.orderTime!=""&&moment(data.orderTime).isAfter(moment(Number(data.checkinDate)), 'day')){
						Dialog.alert({
							content:"订花时间不能在入住时间之后"
			    		});
						return;
					}
					if(data.sendTime!=""&&moment(data.sendTime).isAfter(moment(Number(data.checkinDate)), 'day')){
						Dialog.alert({
							content:"送花时间不能在入住时间之后"
			    		});
						return;
					}
					data.status="Booking";
					data.orderFlowers=true;
					widget.save("api/checkinorderflowers/save",data,function(data){
						widget.list2Card(false);
						widget.show(".J-status,.J-checkInStatus,.J-time,.J-search").hide(".J-return");
						widget.get("list").refresh({
							"checkInOrderflowers.pkCIOrderFlowers":data.pkCIOrderFlowers,
							fetchProperties:"*,status.value,memberSigning.checkInDate,checkInOrderflowers.*,memberSigning.room.*,memberSigning.members,memberSigning.members.personalInfo.*"
						});
						return false;
					});
				},
				//取消按钮
  				cancelaction:function(){
  					widget.list2Card(false);
					widget.show(".J-status,.J-checkInStatus,.J-time,.J-search").hide(".J-return");
					return false;
  				},
				model:{
					id:"orderflowers",
					items:[{
						name:"pkCIOrderFlowers",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"checkinDate",
						type:"hidden",
						fromat:"date"
					},{
						name:"orderTime",
						readonly:true,
						type:"date",
						label:"订花时间",
						validate:["required"]
					},{
						name:"orderFlowersMoney",
						label:"费用",
					},{
						name:"sendTime",
						type:"date",
						mode:"Y-m-d H:i",
						label:"送花时间",
						validate:["required"]
					},{
						name:"address",
						label:"送花地址",
					},{
						name:"shopName",
						label:"花店名称",
					},{
						name:"orderUser",
						label:"经手人",
						type:"select",
						key:"pkUser",
						value:"name",
						url:"api/users",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name"
						},
						validate:["required"]
//	    				defaultValue:loginUser ||""
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
		},
		setData:function(pkCIOrderFlowers,checkInDate,widget){
			aw.ajax({
				url:"api/checkinorderflowers/query",
				data:{
					pkCIOrderFlowers:pkCIOrderFlowers
				},
				success:function(data){
					
					if(data && data[0]){
//						data[0].orderUser=store.get("user").pkUser;
						if(data[0].sendTime){
							data[0].sendTime=moment(data[0].sendTime).format("YYYY-MM-DD HH:mm");
						}else{
							data[0].sendTime=checkInDate;
						}
						data[0].checkinDate=checkInDate;
//						var userSelect=widget.get("card").getData("orderUser","");
//						userSelect.push(loginUser);
//						widget.get("card").setModel("orderUser",userSelect);
//						widget.get("card").setValue("orderUser",loginUser);
//						data[0].orderUser=loginUser;
						widget.get("card").setData(data[0]);
					}
				}
			});
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			    widget.get("list").refresh({
			    	pkCIImplement:params.pkFather,
			    	fetchProperties:"*,status.value,memberSigning.checkInDate,checkInOrderflowers.*,memberSigning.room.*,memberSigning.members,memberSigning.members.personalInfo.*"
			    });
			}else if(params && params.CheckInImplement){
				widget.get("list").refresh({
					pkCIImplement:params.CheckInImplement,
					fetchProperties:"*,status.value,memberSigning.checkInDate,checkInOrderflowers.*,memberSigning.room.*,memberSigning.members,memberSigning.members.personalInfo.*"
				});
			} else {
				widget.get("list").refresh();
			}
		} 
	});
	module.exports = Company;
});