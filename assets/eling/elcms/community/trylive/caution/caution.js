define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Form=require("form-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var Grid=require("grid-1.0.0");
	require("./caution.css");
	//多语
	var i18ns = require("i18n");
	 var template="<div class='J-subnav'></div>"+
		"<div class='J-grid'></div>" +		
		"<div class='J-printGrid hidden'></div>" +
		"<div class='J-verform hidden'></div>";
	
	var TryLiveCaution = ELView.extend({
		attrs:{
			template:template
		},
		getMember:function(){
			return this.get("subnav").getValue("trylivemember");
		},
		initComponent:function(params,widget){		
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"体验"+i18ns.get("sale_ship_owner","会员")+"注意事项",
					time:{
						click:function(time){
							var subnav=widget.get("subnav");
							subnav.load({
								id:"trylivemember",
								url:"api/trylivemember/querybytime",
								params:{
									fetchProperties:"customer.name,pkTryLiveMember,customer.phoneNumber",
									start:time.start,
									end:time.end
								},
								callback:function(data){
									if(widget.get("subnav").getValue("trylivemember")){
										widget.get("grid").refresh();
										widget.get("printGrid").refresh();
									}else{
										widget.get("grid").setData([]);
										widget.get("printGrid").setData([]);
									}
								}
							});
						}
					},
					buttonGroup:[{
						id:"trylivemember",
						key:"pkTryLiveMember",
						value:"customer.name",						
						url:"api/trylivemember/querybytime",
//						params:function(){
//							return{
//								fetchProperties:"customer.name,customer.mobilePhone"
//							};
//						},
						lazy:true,
						handler:function(key,element){
							if(widget.get("subnav").getValue("trylivemember")){
								widget.get("grid").refresh();
								widget.get("printGrid").refresh();
							}else{
								widget.get("grid").setData([]);
								widget.get("printGrid").setData([]);
							}
						}
					
					}
					],
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							$(".J-printGrid,.J-verform,.J-return").addClass("hidden");
							$(".J-grid,.J-print,.J-adds,.J-trylivemember,.J-time").removeClass("hidden");						
						}
					},{
						id:"adds",
						text:"新增",
						handler:function(){
							if (widget.get("subnav").getValue("trylivemember")){								
								$(".J-printGrid,.J-grid,.J-print,.J-adds").addClass("hidden");
								$(".J-verform,.J-return,.J-trylivemember,.J-time").removeClass("hidden");
								var data={
									level:{key:"Common",value:"一般"}							 	
								};
								widget.get("verform").setData(data);
								return false;
							}else{
								Dialog.alert({
									content : "请选取在指定时间内参加体验的"+i18ns.get("sale_ship_owner","会员")+"!"
								 });
							}
						}
					},{
						id:"print",
						text:"打印",						
						handler:function(){	
							$(".J-grid,.J-verform,.J-adds,.J-time,.J-print,.J-trylivemember").addClass("hidden");
							$(".J-printGrid,.J-return").removeClass("hidden");
							var trymember = widget.get("subnav").getData("trylivemember",widget.getMember());
							var title=trymember.customer.name+"("+trymember.customer.phoneNumber+")";
						    widget.get("printGrid").setTitle(title);
							window.print();
						}
					/*handler:function(){
					widget.hide([".J-form"]);
					var title="历史入住会员";
					$(".J-grid-title").text(title);
					var data=widget.get("list").getData();
					widget.get("grid").setData(data);
					window.print();
					widget.show([".J-form"]);*/
					}]
					
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
            	autoRender:false,            	
				url:"api/trylivecaution/query",				
				params:function(){
					return {
						pkTryLiveMember:widget.get("subnav").getValue("trylivemember")
					};
				},		
				model:{
					columns:[{
						key:"category.value",
						name:"事项分类"									
					},{
						key:"attentionContent",
						name:"注意事项描述"									
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
								widget.get("verform").reset();
								widget.get("verform").setData(data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/trylivecaution/" + data.pkTryLiveCaution + "/delete",function(){
									widget.get("grid").refresh();
		 	 					});
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var printGrid=new Grid({
				parentNode:".J-printGrid",
				isInitPageBar:false,
				url:"api/trylivecaution/query",	
				params:function(){
					return {
						pkTryLiveMember:widget.get("subnav").getValue("trylivemember")
					};
				},		
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"category.value",
						name:"事项分类"									
					},{
						key:"attentionContent",
						name:"注意事项描述",										
					},{
						key:"level",
						name:"重要程度",
						format:function(value,row){
							return value.value;
						}
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
			   		var params="trylivemember.pkTryLiveMember="+widget.get("subnav").getValue("trylivemember")+"&"+$("#trylivecaution").serialize();
					aw.saveOrUpdate("api/trylivecaution/save",params,function(data){			 
						widget.get("grid").refresh();
					    $(".J-verform,.J-return").addClass("hidden");
					    $(".J-grid,.J-print,.J-adds,.J-trylivemember,.J-time").removeClass("hidden");
					});
					
 				},
				//取消按钮
  				cancelaction:function(){
  					$(".J-verform,.J-return").addClass("hidden");
					$(".J-grid,.J-print,.J-adds,.J-trylivemember,.J-time").removeClass("hidden");
  				},
				model:{
					id:"trylivecaution",
					items:[{
						name:"pkTryLiveCaution",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"category",
						label:"事项分类",						
						type:"select",
						options:[{
							key:"Health",
							value:"健康"
						},{
							key:"Eating",
							value:"饮食"
						},{
							key:"Cleaning",
							value:"保洁"
						},{
							key:"Hoppy",
							value:"喜好"
						},{
							key:"Other",
							value:"其他"
						}],
					    validate:["required"]
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
				id:"trylivemember",
				params:{
					fetchProperties:"customer.name,pkTryLiveMember,customer.phoneNumber",
					start:this.get("subnav").getValue("time").start,
					end:this.get("subnav").getValue("time").end
				},
				callback:function(){
					if(widget.get("subnav").getValue("trylivemember")){
						widget.get("grid").refresh();
						widget.get("printGrid").refresh();
					}else{
						widget.get("grid").setData([]);
						widget.get("printGrid").setData([]);
					}
				}
			});
		},
		afterInitComponent:function(params,widget){
			if(widget.get("subnav").getValue("trylivemember")){
				widget.get("grid").refresh();
				widget.get("printGrid").refresh();
			}else{
				widget.get("grid").setData([]);
				widget.get("printGrid").setData([]);
			}
		}
	});
	module.exports = TryLiveCaution;
});