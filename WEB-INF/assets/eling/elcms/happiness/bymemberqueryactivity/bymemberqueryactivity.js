define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
    var Dialog=require("dialog-1.0.0");
  //多语
	var i18ns = require("i18n");
	var bymemberqueryactivity = BaseView.extend({
		
		initSubnav:function(widget){
			var inParams = this.get("params");
			return {
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"报名活动查询",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide(".J-card,.J-return").show(".J-list,.J-cancel");
					        return false;
						}
					}]
				}
			};
		},
		initList:function(widget){
			return{
				url:"api/activity/bymemberqueryactivity",
				params:{
					fetchProperties:"*,users.name,members.personalInfo.name,interestGroups.description",
					pkMember:widget.get("params") ? widget.get("params").pkMember : ""
				},
				model:{
					columns:[{
						key:"theme",
                        name:"主题",
                        format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								widget.edit("detail",data);
								$(".J-return").removeClass("hidden");
								$(".J-cancel").addClass("hidden");
								return false;
							}
						}]
					},{
						key:"activitySite",
						name:"活动地点"
					},{
						key:"activityStartTime",
						name:"活动开始时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"activityEndTime",
						name:"活动结束时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"type",
						name:"活动类型",
						format:function(value,row){
							if(value=="happiness"){
								return "快乐";
							}else if(value=="life"){
								return "生活";
							}else if(value=="health"){
								return "健康";
							}
						}
					}]
				}
			};
		},
		initCard:function(widget){
			return{
				compType:"form-1.0.0",
				model:{
					id:"activity",
					items:[{
						name:"pkActivity",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"theme",
						label:"主题",
						validate:["required"]
					},{
						name:"activityDescription",
						label:"活动描述",
						type:"textarea"
					},{
						name:"activitySite",
						label:"活动地点",
						validate:["required"]
					},{
						name:"scope",
						label:"活动范围",
						type:"select",
						options:[{
							key:"Inner",
							value:"社区内"
						},{
							key:"Outer",
							value:"社区外"
						}],
						validate:["required"]
					},{
						name:"sportIntensity",
						label:"活动强度",
						type:"select",
						options:[{
							key:"High",
							value:"高"
						},{
							key:"Centre",
							value:"中"
						},{
							key:"Low",
							value:"低"
						}],
						validate:["required"]
					},{
						name:"affirm",
						label:"健康状态确认",
						type:"radiolist",
						list:[{
							key:true,
							value:"需要"
						},{
							key:false,
							value:"不需要"
						}],
						validate:["required"]
					},{
						name:"mostActivityNumber",
						label:"最多活动人数",
						validate:["required"]
					},{
						name:"contactInformation",
						label:"联系方式",
						validate:["required"]
					},{
						name:"activityStartTime",
						label:"活动开始时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"activityEndTime",
						label:"活动结束时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"registrationStartTimen",
						label:"报名开始时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					},{
						name:"registrationEndTimen",
						label:"报名结束时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"]
					}]
				}
			};
		}
	});
	module.exports = bymemberqueryactivity;
});