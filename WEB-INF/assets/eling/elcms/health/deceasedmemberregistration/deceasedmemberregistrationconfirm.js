define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
    var Dialog=require("dialog");
	//多语
	var i18ns = require("i18n");
	var deceasedmemberregistration = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"过世"+i18ns.get("sale_ship_owner","会员")+"确认",
					buttonGroup:[{
						id:"building",
     				   showAll:true,
     				   showAllFirst:true,
     				   handler:function(key,element){
     					    widget.get("list").refresh();
							widget.get("card").load("member");
						   }  
					},{
						id:"orderString",
						items:[{
							key:"deceasedDate:desc",
							value:"过世日期"
						},{
							key:"member.memberSigning.room.number",
							value:"房间号"
						}],
						handler:function(key,element){
							widget.get("list").refresh({
								"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
								"flowStatus":widget.get("subnav").getValue("flowStatus"),
								"orderString":key,
								fetchProperties:"*,"+
								"member.personalInfo.name,"+
								"member.memberSigning.room.number,"+
								"member.memberSigning.room.pkRoom",
							});
						
						
					}
					},{
						id:"flowStatus",
						showAll:true,
					    showAllFirst:true,
						items:[{
							key:"NotConfirm",
							value:"未确认"
						},{
							key:"Confirm",
							value:"已确认"
						}],
						handler:function(key,element){
						//如果是查看确认数据，隐藏确认按钮
							if(key=="Confirm"){
								widget.get("subnav").hide(["confirm"]);	
							}else{
								widget.get("subnav").show(["confirm"]);	
							}
							widget.get("list").refresh();
						}
					}],
					buttons:[{
						id:"confirm",
						text:"确认",
						handler:function(){
							var old=widget.get("list").getSelectedData();
							if(old.length==0){
								 Dialog.alert({
										content:"请选择记录！"
								   });
								 return;
							}
							Dialog.mask(true);
							var pks ="";
							for( var i =0;i< old.length;i++){
								if(i==old.length-1){
									pks+=old[i].pkDeceasedMemberRegistration;
								}else{
									pks+=old[i].pkDeceasedMemberRegistration+",";
								}	
								
							}
                            aw.ajax({
                                url : "api/deceasedmemberregistration/confirm",
                                type : "POST",
                                data : {
                               	 	pks:pks,
                                },
                               success : function(data){
                            	   Dialog.mask(false);
                            	   if(data.msg){
                            		   Dialog.alert({
											content:data.msg
									   });
                            	   }
                            	   widget.get("list").refresh();
                                }
                            });
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/deceasedmemberregistration/query",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
						"orderString":widget.get("subnav").getValue("orderString"),
						flowStatus:subnav.getValue("flowStatus"),
						fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,member.memberSigning.room.pkRoom"
					};
				},
				model:{
					isCheckbox:true,
					columns:[{
						col:1,
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员")
					},{
						col:1,
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						col:1,
						key:"deceasedDate",
						name:"过世日期",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
						col:2,
						key:"diedPlace",
						name:"过世地点  "
					},{
						col:2,
						key:"causes",
						name:"过世原因  "
					},{
						col:3,
						key:"description",
						name:"备注"
					},{
						col:1,
						key:"flowStatus.value",
						name:"状态"
					}]
				}
			};
		}
	});
	module.exports = deceasedmemberregistration;
});