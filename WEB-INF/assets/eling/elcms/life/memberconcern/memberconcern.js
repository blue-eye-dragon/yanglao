define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Form=require("form-1.0.0");
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	require("./memberconcern.css");
	//多语
	var i18ns = require("i18n");
	 var template="<div class='J-subnav'></div>"+
		"<div class='J-grid'></div>" +		
		"<div class='J-printGrid hidden'></div>" +
		"<div class='J-verform hidden'></div>";
	
	var MemberConcern = ELView.extend({
		attrs:{
			template:template
		},

		initComponent:function(params,widget){		
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:  i18ns.get("sale_ship_owner","会员")+"注意事项",
					time:{
						click:function(time){
							subnav.load({
								id:"member",
								callback:function(data){
									widget.get("grid").refresh();
									widget.get("printGrid").refresh();
								}
							});
						}
					},
					buttonGroup:[{
						id:"member",
						key:"pkMember",
						value:"personalInfo.name",						
						url:"api/member/querybytime",
						params:function(){
							var time=widget.get("subnav").getValue("time");
							return {
								fetchProperties:"personalInfo.name,pkMember",
								start:time.start,
								end:time.end
							};
						},
						lazy:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					
					}],
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							$(".J-printGrid,.J-verform,.J-return").addClass("hidden");
							$(".J-grid,.J-print,.J-adds,.J-member,.J-time").removeClass("hidden");						
						}
					},{
						id:"adds",
						text:"新增",
						handler:function(){
							if (widget.get("subnav").getValue("member")){	
								$(".J-printGrid,.J-grid,.J-print,.J-adds").addClass("hidden");
								$(".J-verform,.J-return,.J-member,.J-time").removeClass("hidden");
								var data={
										level:{key:"Common",value:"一般"}							 	
								};
								widget.get("verform").setData(data);
								return false;
							}else{
								Dialog.alert({
									content : "请选取在指定时间内签约的"+i18ns.get("sale_ship_owner","会员")+"!"
								 });
							}
						}
					},{
						id:"print",
						text:"打印",						
						handler:function(){										
							$(".J-grid,.J-verform,.J-adds,.J-time,.J-print,.J-member").addClass("hidden");
							$(".J-printGrid,.J-return").removeClass("hidden");
							window.print();
						}
					}]
					
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				url:"api/memberconcern/query",				
				params:function(){
					return {
						pkMember:widget.get("subnav").getValue("member")
					};
				},
				parentNode:".J-grid",
				model:{
					columns:[{
						key:"attentionContent",
						name:"注意事项描述",										
					},{
						key:"level.value",
						name:"重要程度"
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
								$(".J-printGrid,.J-grid,.J-print,.J-adds").addClass("hidden");
								$(".J-verform,.J-return").removeClass("hidden");
								widget.get("verform").setData(data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/memberconcern/" + data.pkMemberConcern + "/delete",function(){
									widget.get("grid").refresh();
		 	 					});
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var printGrid=new Grid({
				url:"api/memberconcern/query",
				params:function(){
					return {
						pkMember:widget.get("subnav").getValue("member")
					};
				},
				isInitPageBar:false,
				parentNode:".J-printGrid",
				model:{
					columns:[{
						key:"attentionContent",
						name:"注意事项描述",										
					},{
						key:"level.value",
						name:"重要程度"
					},{
						key:"description",
						name:"备注"
					}]
				}
			});
			this.set("printGrid",printGrid);
			
			var verform=new Form({
				parentNode:".J-verform",
			   	saveaction:function(){
					aw.saveOrUpdate("api/memberconcern/save","member.pkMember="+widget.get("subnav").getValue("member")+"&"+$("#memberconcern").serialize(),function(data){			 
					   widget.get("grid").refresh();
					   $(".J-verform,.J-return").addClass("hidden");
					   $(".J-grid,.J-print,.J-adds,.J-member,.J-time").removeClass("hidden");
					});
 				},
				//取消按钮
  				cancelaction:function(){
  					$(".J-verform,.J-return").addClass("hidden");
					$(".J-grid,.J-print,.J-adds,.J-member,.J-time").removeClass("hidden");
  				},
				model:{
					id:"memberconcern",
					items:[{
						name:"pkMemberConcern",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"attentionContent",
						label:"注意事项描述",
						type:"textarea",
						validate:["required"]	
					},{
						name:"level",
						label:"重要程度",						
						type:"radiolist",
						list:[{
							key:"Common",
							value:"一般"
						},{
							key:"Important",
							value:"重要"
						}],
					    validate:["required"]
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
		
			});
			this.set("verform",verform);
			
			this.get("subnav").load({
				id:"member",
				callback:function(){
					widget.get("grid").refresh();
					widget.get("printGrid").refresh();
				}
			});
		}
	});
	module.exports = MemberConcern;
});