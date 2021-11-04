define(function(require,exports,module){
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var aw=require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var BuyMedicineApp_grid={
		init:function(widget){
			//列表
			return new Grid({
				parentNode:".J-main-grid",		
				url:"api/buymedicineapplication/query",
				fetchProperties:"*,member.personalInfo.name,member.memberSigning.room.number,"+
					"buyMedicinePapers.papertype.name,"+
					"buyMedicinePapers.papertype.pkPaperType,items.pkBuyMedicineItem",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						flowStatusIn:subnav.getValue("application"),
						"member.memberSigning.room.building":subnav.getValue("building")
					};
				},
				model:{
					isCheckbox:true,
					columns:[{
						key : "member",
						name : i18ns.get("sale_ship_owner","会员"),
						format:function(value,row){
							return value.memberSigning.room.number+" "+value.personalInfo.name;
						}
					},{
						key:"date",
						name:"清单日期",
						format:"date"
					},{
						key:"flowStatus.key",
						name:"状态",
						format:function(value,row){
							if(value=="Temporary"){
								return "button";
							}else{
								return "已提交";
							}
						},
						formatparams:[{
							key:"status",
							text:"提交",
							handler:function(index,data,rowEL){
								aw.ajax({
									url : "api/buymedicineapplication/submitapplication",
									type : "POST",
									data : {
										pkBuyMedicineApplication:data.pkBuyMedicineApplication
									},
									success : function(data){
										if(data.msg=="提交成功"){
											widget.get("grid").refresh();
										}else{
											Dialog.tip({
												title:data.msg
											});
										}
									}	
								});
							}
						}]
					},{
						key:"flowStatus",
						name:"操作",
						format:"button",
    					formatparams:[{
    						key:"edit",
    						icon:"edit",
    						handler:function(index,data,rowEL){
    							widget.get("form").setValue("member",data.member.pkMember);
    							$("select.J-form-pkBuyMedicineApplication-select-member").trigger("change");
    							widget.get("subnav").show(["return"]).hide(["add","application","batchSubmit"]);
    							widget.hide(".J-main-grid").show(".J-sub-grid,.J-form");
    						}
    					},{
    						key:"delete",
    						icon:"remove",
    						handler:function(index,data,rowEL){
    							aw.del("api/buymedicineapplication/" + data.pkBuyMedicineApplication + "/delete",function(){
    								widget.get("grid").refresh();	
    							});
    						}
    					}]
					}]
				}
			});
		}	
	};
	
	module.exports=BuyMedicineApp_grid;
});