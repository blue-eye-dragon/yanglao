define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Grid = require("grid-1.0.0");
	var Subnav = require("subnav-1.0.0");	
	var Wizard = require("wizard");
	var Form = require("form-2.0.0")
	var Calendar=require("calendar");
	//多语
	var i18ns = require("i18n");
	var Reservation = ELView.extend({
        attrs:{
            template:"<div class='J-subnav'></div>"+
				"<div class='J-wizard '></div>"+
				"<div class='J-verform'></div>"+
				"<div class='J-calendar hidden'></div>"+
				"<div class='J-verform2 hidden'></div>"+
				"<div class='J-grid hidden'></div>"
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
					title:"活动室预定",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide([".J-calendar",".J-return",".J-verform2",".J-return2"]).show([".J-wizard"]);
						}
					},{
						id:"return2",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide([".J-wizard",".J-verform2",".J-return2"]).show([".J-calendar",".J-return"]);
						}
					}]
        		}
        	});
        	this.set("subnav",subnav);
        	
			var wizard=new Wizard({
				parentNode:".J-wizard",
				model:{
					items:[{
						id:"step1",
						title:"预定信息"
					},{
						id:"step2",
						title:"活动室信息"
					}]
				}
			});
			this.set("wizard",wizard);
			
             var verform = new Form({
                 parentNode:"#step1",
                 saveaction:function(){
                	 var data=$("#reservation").serializeArray();
                	 var startTime =  moment(data[2].value).valueOf();
                	 var endTime = moment(data[3].value).valueOf();
                	 if(endTime <= startTime){
                		 Dialog.tip("预定活动的结束时间不能小于或等于预定活动的开始时间");
                	 }else{
                		 aw.saveOrUpdate("api/reservation/queryactivitroom",{
                			 startTime:startTime,
                			 endTime:endTime,
                			 fetchProperties:"*,room.number"
                		 },function(data){
							if(data[0]!=0 & data.length!=0){
								var activityRoom=[];
	                     		for(var i=0;i<data.length;i++){
	                     			activityRoom = activityRoom.concat(data[i]);
	                     		}
	                     		widget.get("grid").setData(activityRoom);
	                     		widget.get("wizard").next();
							}
                		 });
 					}
                 },
                 model:{
 					id:"reservation",
 					items:[{
 						name:"version",
 						type:"hidden",
 						defaultValue:"0"
 					},{
 						name:"name",
 						label:"活动名称",
 						validate:["required"]
 					},{
 						name:"startTime",
						label:"开始时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
 					},{
 						name:"endTime",
						label:"结束时间 ",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
 					},{
 						name:"number",
 						label:"人数",
 						validate:["number"]
 					},{
 						name:"members",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						url:"api/member/query",
						params:{
							fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number",
						},
						label:i18ns.get("sale_ship_owner","会员")+"负责人",
						type:"select",
						multi:true,
						validate:["required"]
 					}]
 				},
				 cancelaction:function(){
					$("#step1").addClass("hidden");
					$("#step2,.J-grid").removeClass("hidden");
				 }
             });
             this.set("verform",verform);
             
           //卡片
 			var grid=new Grid({
 				parentNode:"#step2",
				dataType:"json",
 				model:{
 					isRadiobox:true,
 					head:{
 						buttons:[{
 							id:"add",
 							icon:"icon-save",
 							handler:function(){
 								var news=widget.get("grid").getSelectedData();
 	   							var pkActivityRoom="";
 	   							var crics="";
 	                         	for(var i=0; i<news.length;i++){
 	                         		pkActivityRoom=news[i].pkActivityRoom;
 	                         		if(news[i].circs.value == null || news[i].circs.value == ""){
 	                         			crics=null; 
 	                         		}else{
 	                         			crics=news[i].circs.value;
 	                         		}
 	                         		
 	                         	}
 	                         	if(crics=="非空闲"){
 	                         		Dialog.tip("活动室非空闲,不能预定");
 	                         		return false;
 	                         	}
 	                             aw.ajax({
 	                                 url : "api/reservation/save",
 	                                 data : $("#reservation").serialize()+"&activityRoom="+pkActivityRoom,
 	                                 dataType:"json",
 	                                 success : function(data){
 	                                	 Dialog.tip("预定成功");
 	                                	widget.get("verform").reset();
 	                                	widget.get("grid").refresh();
 	                                	widget.get("wizard").first();
 	                                	 
 	                                	
 	                                 }
 	                             });
 							}
 						}]
					},
 					columns:[{
 						key:"name",
						name:"名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								$(".J-wizard").addClass("hidden");
								$(".J-return2").addClass("hidden");
								$(".J-verform2").addClass("hidden");
								$(".J-calendar").removeClass("hidden");
								$(".J-return").removeClass("hidden");
								widget.get("calendar").refresh();
							}
						}]
 					},{
 						key:"room.number",
						name:"房间号 "
 					},{
 						key:"openingTime",
						name:"开始时间 ",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
 					},{
 						key:"endingTime",
						name:"结束时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
 					},{
						key:"circs.value",
						name:"使用情况"
					}]
 				}
 			});
 			this.set("grid",grid);
 			
 			var verform2 = new Form({
                parentNode:".J-verform2",
                model:{
					id:"reservation",
					items:[{
						name:"pkReservation",
						type:"hidden"
					},{
						name:"name",
						label:"活动名称"
					},{
 						name:"members",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						url:"api/member/query",
						params:{
							fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number",
						},
						label:i18ns.get("sale_ship_owner","会员")+"负责人",
						type:"select",
						multi:true
 					},{
						name:"startTime",
						label:"开始时间",
						type:"date",
						mode:"Y-m-d H:i"
					},{
						name:"endTime",
						label:"结束时间 ",
						type:"date",
						mode:"Y-m-d H:i"
					},{
						name:"number",
						label:"人数"
					}]
				}
 			});
 			widget.set("verform2",verform2);
 			
			var calendar=new Calendar({
				parentNode:".J-calendar",
				url:"api/reservation/query",
				fetchProperties:"*,activityRoom.room.number,activityRoom.room.pkRoom,members.personalInfo.name,members.personalInfo.pkPersonalInfo,",
				translate:{
					title:"name",
					start:"startTime",
					end:"endTime"
				},
				model:{
					calendar:{
						click:function(data,calEvent, jsEvent, view){
							if(!calEvent.id){
								return false;
							}
							widget.get("verform2").setDisabled(true);
							widget.get("verform2").setData(data);
							$(".J-calendar").addClass("hidden");
							$(".J-return").addClass("hidden");
							$(".J-verform2").removeClass("hidden");
							$(".J-return2").removeClass("hidden");
						}
					}
				}
			});
			widget.set("calendar",calendar);
        }
	});
    module.exports = Reservation;
});