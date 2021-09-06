define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	var form = require("form-2.0.0")
	
	var visa=BaseView.extend({
		events:{
			"change .J-endTime":function(e){
				var widget=this;
				var card =widget.get("card");
				var endTime = card.getValue("endTime");
				if(endTime){
					card.setValue("remindTime",moment(endTime).subtract("months",1).format("YYYY-MM-DD"));
				}
				
			}
			
		},
		
		initSubnav:function(widget){
			return {
				model:{
					title:"外籍签证登记",
					buttonGroup:[{
						id:"building",
						showAll:true,
						handler:function(key,element){
							//点击楼宇，切换会员
							widget.get("subnav").load({
								id:"members",
								callback:function(data){
									widget.get("list").refresh();
								},
							});
						}
					},{
    					id:"members",
    					key:"pkMember",
    					value:"nameAndCountry",
    					url:"api/membercountry/query",
    					params:function(){
    						return {
    							pkBuilding:widget.get("subnav").getValue("building")
    						};
						},
						lazy:true,
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
			      buttons:[{
						key:"return",
						text:"返回",
						show:false,	
						handler:function(){
							$(".J-card,.J-return").addClass("hidden");
							$(".J-building,.J-members,.J-list,.J-et").removeClass("hidden");
						}
					},{
						id:"et",
						text:"新增",
						handler:function(){
							//1.获取第1个下拉框的值
							var pkFirst=widget.get("subnav").getValue("members");
							var index=$(".J-members ul .J-btngroup-members[data-key='"+pkFirst+"']").parents("li").prevAll().size();
							var item = widget.get("subnav").getData(1,index);
							
							var subnav=widget.get("subnav");
							var data={
								nameAndCountry:subnav.getValue("members"),
								nameAndCountryValue:subnav.getText("members"),
								membernumber:item.membernumber
							};
							widget.get("card").setData(data);
							$(".J-list,.J-et").addClass("hidden");
							$(".J-card,.J-return").removeClass("hidden");
						}
					}],
				}
			};
		},
		initList:function(widget){
			return {
				url:"api/visa/visaquery",
				params:function(){
					return {
						pkMember:widget.get("subnav").getValue("members"),
						pkBuilding:widget.get("subnav").getValue("building"),
						fetchProperties:"*,member.personalInfo.name,member.personalInfo.nameEn,member.personalInfo.pkPersonalInfo,member.memberSigning.room.number"
					};
				},
				autoRender : false,
				model:{
					columns:[{
 						key:"member.memberSigning.room.number",
 						name:"房间号", 
 						format:"detail",
 						formatparams:[{
 							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
 						}]
 					},{
						key:"member.personalInfo.name",
						name:"会员姓名"
					},{
						key:"member.personalInfo.nameEn",
						name:"英文名"
					},{
						key:"startTime",
						name:"签证开始日期",
						format:"date"
					},{
						key:"endTime",
						name:"签证结束日期",
						format:"date"
					},{
						key:"remindTime",
						name:"提醒办理日期",
						format:"date"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								 $(".J-list,.J-et").addClass("hidden");
								 $(".J-card,.J-return").removeClass("hidden");
								 var subnav=widget.get("subnav");
								 data.nameAndCountry=subnav.getValue("members"),
								 data.nameAndCountryValue=subnav.getText("members"),
								 data.membernumber=data.member.memberSigning.room.number,
								 data.remindTime=moment(data.remindTime).format("YYYY-MM-DD");
								 widget.get("card").setData(data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/visa/" + data.pkVisa + "/delete");
							}
						}]
					}]
				}
			};
		},
		
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					var params="member="+widget.get("subnav").getValue("members")+"&"+$("#visa").serialize();
					widget.save("api/visa/save",params,function(){
						widget.get("list").refresh();
						$(".J-list,.J-et").removeClass("hidden");
						$(".J-card,.J-return").addClass("hidden");
					});
				},
				//取消按钮
				 cancelaction:function(){
					 $(".J-card,.J-return").addClass("hidden");
					$(".J-building,.J-members,.J-list,.J-et").removeClass("hidden");
				 },
				model:{
					id:"visa",
					items:[{
						name:"pkVisa",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
					},{
						name:"status",
						type:"hidden",
						defaultValue:'Normal'
					},{
						name:"nameAndCountry",
						type:"hidden"
					},{
						name:"nameAndCountryValue",
						label:"会员",
						readonly:true
					},{
						name:"membernumber",
						label:"房间号",
						readonly:true
					},{
						name:"startTime",
						label:"签证日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"endTime",
						label:"截止日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"remindTime",
						label:"提醒时间",
						readonly:true,
						validate:["required"]
					}]
				}
			};
		},		
		afterInitComponent : function(params,widget) {
			if (params && params.pkFather) {
				var subnav=this.get("subnav");
				var pkBuilding=params.pkBuilding;
				var pkMember=params.pkMember;
				//设置building
				if(pkBuilding){
					subnav.setValue("building",pkBuilding);
				}
				//设置会员
				subnav.load({
					id:"members",
					params:{
						pkBuilding:subnav.getValue("building")
					},
					callback:function(){
						subnav.setValue("members",pkMember);
						widget.get("list").refresh();
					}
				});
			}else{
				//加载会员
				var grid=this.get("list");
				grid.loading();
				this.get("subnav").load({
					id:"members",
					callback:function(data){
						grid.refresh();
					}
				});
			}
    	 }
	});
	module.exports=visa;
});
