define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	 var Grid=require("grid-1.0.0");
	var Form=require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
    var template="<div class='J-subnav'></div>"+
    		"<div class='J-grid' ></div>"+
    		"<div class='J-signinform hidden' ></div>"+
    		"<div class='J-signoutform hidden' ></div>";
	
	var NightSecretarySign = ELView.extend({
		 attrs:{
             template:template
    	 },
    	 initComponent : function(params,widget) {
    		 var subnav=new Subnav({
    			 parentNode:".J-subnav",
    			 model:{
    				 items:[{
 						id:"singIn",
 						text:"签到",
 						type:"button",
 						handler:function(){
 							$(".J-grid,.J-signoutform").addClass("hidden");
						    $(".J-signinform").removeClass("hidden");
						    widget.get("signinform").reset();
 						}
 					},{
 						id:"signOut",
 						text:"签退",		
 						type:"button",
 						handler:function(){
 							$(".J-grid,.J-signinform").addClass("hidden");
						    $(".J-signoutform").removeClass("hidden");
						    widget.get("signoutform").reset();
 						}
 					},{
 						id:"date",
 						type:"date",
 						handler:function(){
 							widget.get("grid").refresh();
 							widget.get("signinform").reset();
 							widget.get("signoutform").reset();
 						}
 					}],
 					title:"夜班秘书考勤",
 					
                 }
    		 });
    		 this.set("subnav",subnav);
    		 
    		 var grid=new Grid({
    			parentNode:".J-grid",
    			autoRender:false,
    			url:"api/nightsecretarysign/query",
				fetchProperties:"*,nightSecretary.name,nightSecretary.pkUser",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						workDate:subnav.getValue("date").start,
						workDateEnd:subnav.getValue("date").end						
						
					};
				},
 				model:{
 					columns:[{
						key:"nightSecretary.name",
						name:"姓名"					
					},{
						key:"signInDate",
						name:"签到日期",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"signOutDate",
						name:"签退日期",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					}]
 				}
    		 });
    		 this.set("grid",grid);
                  
    		 var signoutform=new Form({
 				parentNode:".J-signoutform",
 			   	saveaction:function(){
					aw.saveOrUpdate("api/nightsecretarysign/sign","status=signOut&"+$("#nightsecretaryscheduling1").serialize(),function(data){			 					   
					   $(".J-signoutform").addClass("hidden");
					   $(".J-grid").removeClass("hidden");
					   widget.get("grid").refresh();
					});
           		 	
  				},
 				//取消按钮
   				cancelaction:function(){
   					$(".J-signoutform").addClass("hidden");
 					$(".J-grid").removeClass("hidden");
   				},
 				model:{
 					id:"nightsecretaryscheduling1",
 					items:[{
 						name:"pkNightSecretaryScheduling",
 						type:"hidden",
 					},{
 						name:"username",
 						label:"用户名",
 						validate:["required"]
 					},{
 						name:"password",
 						label:"密码",
 						type:"password",
 						validate:["required"]
 					}]
 				}
 		
 			});
 			this.set("signoutform",signoutform); 
    		 
 			 var signinform=new Form({
				parentNode:".J-signinform",
			   	saveaction:function(){
						aw.saveOrUpdate("api/nightsecretarysign/sign","status=signIn&signDate="+widget.get("subnav").getValue("date").start+"&"+$("#nightsecretaryscheduling").serialize(),function(data){			 					   
						   $(".J-signinform").addClass("hidden");
						   $(".J-grid").removeClass("hidden");
						   widget.get("grid").refresh();
						});
          		 	
 				},
				//取消按钮
  				cancelaction:function(){
  					$(".J-signinform").addClass("hidden");
					$(".J-grid").removeClass("hidden");
  				},
				model:{
					id:"nightsecretaryscheduling",
					items:[{
						name:"pkNightSecretaryScheduling",
						type:"hidden",
					},{
						name:"username",
						label:"用户名",
						validate:["required"]
					},{
						name:"password",
						label:"密码",
						type:"password",
						validate:["required"]
					}]
				}
		
			});
			this.set("signinform",signinform); 
    	 },
    	 afterInitComponent:function(params,widget){
    		 if(moment().hours()<12){
    			 widget.get("subnav").setValue("date",moment().startOf("days").subtract("days",1).valueOf());
    		 }
    		 widget.get("grid").refresh();
    	 }
	});
	module.exports = NightSecretarySign;
});
