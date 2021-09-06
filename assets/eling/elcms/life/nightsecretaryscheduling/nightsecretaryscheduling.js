define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	
	var NightSecretaryScheduling = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"夜班秘书排班",
					time:{
						click:function(time){
							widget.get("list").refresh();
						}
					}
				}
			};
		},
		initList:function(widget){
			return {
				url:"api/nightsecretaryscheduling/query",
				fetchProperties:"*,nightSecretary.name,nightSecretary.pkUser",
				params:function(){
					return {
						workDate:widget.get("subnav").getValue("time").start,
						workDateEnd:widget.get("subnav").getValue("time").end
					};					
				},
				model:{
					columns:[{
						key:"workDate",
						name:"日期",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
						key:"nightSecretary",
						name:"秘书",			
						format:function(value,row){ 
							var val="";							
							for (var int = 0; int < value.length; int++) {
							val=val+"、"+value[int].name; 
						 }	
							return value ? val.substr(1) : "" ;
						}
					},{
						key:"description",
						name:"备注"
					},{					
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								if(moment().startOf("days").valueOf()>data.workDate){
									Dialog.alert({
										content:"当前排班已发生，不能修改"
									});
									return false;
								}else{
									widget.edit("edit",data);
								}
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/nightsecretaryscheduling/" + data.pkNightSecretaryScheduling + "/delete");
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
					widget.save("api/nightsecretaryscheduling/save",$("#nightsecretaryscheduling").serialize());
				},
				model:{
					id:"nightsecretaryscheduling",
					items:[{
						name:"pkNightSecretaryScheduling",
						type:"hidden",
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"workDate",
						label:"日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"nightSecretary",
						key : "pkUser",
						label : "秘书",
						value : "name",
						type : "select",
						url:"api/user/role",//TODO 用户角色：wulina 秘书
        				params:{
        					roleIn:"6,11,12,18,19,20,21",
							fetchProperties:"pkUser,name"
						},						
						multi:true,
						validate : [ "required" ]
					},{
						name:"description",
						label:"备注",
						type:"textarea",
						height:100
					}]
				}
			};
		}
	});
	module.exports = NightSecretaryScheduling;
});