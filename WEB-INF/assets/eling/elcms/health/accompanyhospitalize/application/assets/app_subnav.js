define(function(require,exports,module){
	var Subnav=require("subnav-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var aw=require("ajaxwrapper");
	
	var BuyMedicineApp_subnav={
		attrs:{},
		setAttribute:function(attr,value){
			this.attrs[attr]=value;
		},
		getAttribute:function(attr){
			return attrs[attr] || "";
		},
		init:function(widget){
			return new Subnav({
				parentNode:".J-subnav",
				
				model:{
					title:"集体陪同就医申请单",
					buttonGroup:[{
						id:"application",
						items:[{
							key:"Temporary",
							value:"未提交"
						},{
							key:"Commited",
							value:"已提交"
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
						id:"building",
						showAll:true,
						handler:function(key,element){
							widget.get("grid").refresh();
							widget.get("form").load("member");
						}
					}],
					buttons:[{
						id:"add",
						text:"申请",
						handler:function(){
							widget.get("form").reset();
							widget.get("subnav").show(["return"]).hide(["add","application","batchSubmit"]);
							widget.get("subgrid").setData([]);
							widget.hide(".J-main-grid").show(".J-sub-grid,.J-form");
						}
					},{
						id:"return",
						text:"返回",
						show:false,	
						handler:function(){
							widget.get("subnav").hide(["return"]).show(["add","application","batchSubmit"]);
							widget.show(".J-main-grid").hide(".J-sub-grid,.J-form");
						}
					}],
					search:function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/buymedicineapplication/search",
							data:{
								s:str,
								properties:"flowStatus,member.pkMember,pkBuyMedicineApplication," +
									"member.personalInfo.name," +
									"member.memberSigning.room.number," +
									"date",
									fetchProperties:"*," +
										"member.personalInfo.name," +
										"member.memberSigning.room.number," +
										"date"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					}
				}
			});
		}	
	};
	
	module.exports=BuyMedicineApp_subnav;
});