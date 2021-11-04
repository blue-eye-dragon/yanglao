define(function(require, exports, module) {
	//多语
	var i18ns = require("i18n");
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Form = require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
	var template="<div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+
		"<div class='J-verform hidden'></div>"+
		"<div class='J-verform2 hidden'></div>";
	
	var housekeepingappointedfinish = ELView.extend({
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"保洁结束",
  					buttons:[{
  						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide(".J-verform2,.J-return,.J-verform").show([".J-grid,.J-building,.J-flowStatus"]);
						}
					}],
   					buttonGroup:[{
   						id:"building",
   						showAll:true,
						showAllFirst:true,
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
   					},{
   						id:"flowStatus",
   						items:[{
   		                    key:"Unfinished",
   		                    value:"未结束"
   						},{
   							key:"Unconfirmed",
   							value:"已结束"
   						}],
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
   					}]
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-grid",
				url:"api/housekeepingappointed/query",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"member.memberSigning.room.building":subnav.getValue("building"),
						flowStatus:subnav.getValue("flowStatus"),
						fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,member.memberSigning.room.pkRoom," +
							"housekeepingers.name,housekeepingers.phone,housekeepingType.name",
					};
				},
				model:{
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								var data = {
									roomNumber:data.member.memberSigning.room.number,
									member:data.member.personalInfo.name,
									phone:data.housekeepingers.phone,
									typeName:data.housekeepingType.name,
									appointedDate:moment(data.appointedDate).format("YYYY-MM-DD HH:mm"),
									beginDate:moment(data.beginDate).format("YYYY-MM-DD HH:mm"),
									finishDate:moment(data.finishDate).format("YYYY-MM-DD HH:mm"),
									name:data.housekeepingers.name,
									flowStatus:data.flowStatus.value,
									descriptionFinish:data.descriptionFinish
								};
								widget.get("verform").setData(data);
								widget.hide(".J-verform2,.J-grid").show(".J-verform,.J-return");
								return false;
							}
						}]
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						key:"housekeepingers",
						name:"电话",
						format:function(value,row){
							var phones= "";
							for ( var i in value) {
								phones +=value[i].phone + ",";
							}
							return phones.substring(0, phones.length-1);
						}
							
					},{
						key:"housekeepingType.name",
						name:"保洁类型"
					},{
						key:"appointedDate",
						name:"预约时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"beginDate",
						name:"服务时间",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"finishDate",
						name:"服务时长",
						format:function(value,row){
							var time=value-row.beginDate;
							if(time>=86400000){
								var day=time/86400000;
								return parseInt(day)+"天";
							}else if(time>=3600000 && time<86400000){
								var hours=time/3600000;
								return parseInt(hours)+"小时";
							}else if(time>=60000 && time<3600000){
								var minutes=time/60000;
								return parseInt(minutes)+"分钟";
							}
							else{
								return "";
							}
						}
					},{
                        key:"flowStatus.value",
                        name : "状态"
                    },{
						key:"descriptionFinish",
						name:"备注"
					},{
						key:"flowStatus",
						name : "操作",
						format:function(value,row){
							if(value.key=="Unfinished"){
								return "button";
							}else{
								return "";
							}
						},
						formatparams:[{
							key:"",
							text:"结束",
							handler:function(index,data,rowEL){
								widget.get("verform2").setData(data);
								widget.hide(".J-grid,.J-building,.J-flowStatus").show(".J-verform2,.J-return");
							}
						}]
					}]
				}
            });
            this.set("grid",grid);
            
            var verform = new Form({
            	parentNode:".J-verform",
				model:{
					items:[{
						name:"roomNumber",
						label:"房间号"
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员")
					},{
						name:"phone",
						label:"电话"
					},{
						name:"typeName",
						label:"保洁类型"
					},{
						name:"appointedDate",
						label:"预约时间",
					},{
						name:"beginDate",
						label:"服务时间",
					},{
						name:"finishDate",
						label:"服务时长",
					},{
						name:"name",
						label:"保洁员"
					},{
						name:"flowStatus",
						label:"状态"
					},{
						name:"descriptionFinish",
						label:"备注",
						type:"textarea"
					}]
				}
            });
            verform.setDisabled(true);
            this.set("verform",verform);
            
            var verform2 = new Form({
				parentNode:".J-verform2",
				saveaction:function(){
					aw.saveOrUpdate("api/housekeepingappointed/confirmend",$("#housekeepingappointed").serialize(),function(data){
						if(data.msg){
							Dialog.tip({
 								title:data.msg
 							});
						}
						widget.get("grid").refresh();
						widget.hide(".J-verform2,.J-return").show(".J-grid,.J-building,.J-flowStatus");
					});
				},
				cancelaction:function(){
					widget.hide(".J-verform2,.J-return").show(".J-grid,.J-building,.J-flowStatus");
	  			},
				model:{
					id:"housekeepingappointed",
					items:[{
						name:"pkHousekeepingAppointed",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:0
					},{
						name:"descriptionFinish",
						label:"备注",	
						type:"textarea",
						validate:["required"]
					}]
				}
			});
            this.set("verform2",verform2);
        }
	});
	module.exports = housekeepingappointedfinish;	
});