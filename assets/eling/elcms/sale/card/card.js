define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav=require("subnav");
	var Grid=require("grid");
	var Form=require("form");
	var Dialog=require("dialog");	
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-form hidden' ></div>";
	
	var MemberShipCard = ELView.extend({
		attrs:{
			template:template
		},
        events:{
        	"click .J-cardName ":function(e){
        		var widget = this;
        		var grid  = widget.get("grid");
        		var form  = widget.get("form")
        		var data = grid.getData(grid.getIndex(e.currentTarget));
        		if(data){
        			widget.get("subnav").show(["return"]).hide(["add","cardType","toBeStatus","cardStatus","search"]);
        			widget.show(".J-form").hide(".J-grid");
        			
        			var form = widget.get("form");
        			form.reset();
        			form.setData(data);
        			form.setValue("cardStatusText", (data.cardStatus ? data.cardStatus.value : ""));
        			form.setValue("toBeStatusText", (data.toBeStatus ? data.toBeStatus.value : ""));
        			form.setValue("cardStatus", (data.cardStatus ? data.cardStatus.key : ""));
        			form.setValue("toBeStatus", (data.toBeStatus ? data.toBeStatus.key : ""));								
        			
        			form.setDisabled(true);
        		}
        	}
        },
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					//title:"会籍卡信息维护",
					title : i18ns.get("sale_card_title","会籍卡信息维护"),
					items:[{
						id:"search",
						type:"search",
						handler : function(s){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/membershipcard/search",
								data:{
									s:s,
									properties:"name,cardType.name,cardStatus,toBeStatus",
									fetchProperties:"*,cardType.name",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
					},{
						id:"cardStatus",
						type:"buttongroup",
						tip: i18ns.get("sale_card_status","会籍状态"),
						showAll:true,
						showAllFirst:true,
						items:[{
							key:"Contracted",
							value: i18ns.get("sale_ship_contract","会籍签约")
						},{
							key:"Free",
							value:"自由"
						},{
							key:"Using",
							value:"使用中"
						},{
							key:"BackCard",
							value:"已退会"
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
						id:"toBeStatus",
						type:"buttongroup",
						tip:"调整状态",
						showAll:true,
						showAllFirst:true,
						items:[{
							key:"Normal",
							value:"正常"
						},{
							key:"Transfer",
							value:"转让"
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
						id:"cardType",
						type:"buttongroup",
						tip: i18ns.get("sale_card_type","卡类型"),
						keyField :"pkMemberShipCardType",
						valueField :"name",
						showAll:true,
						showAllFirst:true,
						url:"api/cardtype/query",
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
   						id:"add",
						type:"button",
						text:"新增",
						handler:function(){
							var forms = widget.get("form");
							forms.reset();
							widget.get("subnav").show(["return"]).hide(["add","cardType","toBeStatus","cardStatus","search"]);
							widget.show(".J-form").hide(".J-grid");
						}
   					},{
   						id:"return",
						type:"button",
   						text:"返回",
   						show:false,
   						handler:function(){
   							widget.get("subnav").hide(["return"]).show(["add","cardType","toBeStatus","cardStatus","search"]);
							widget.hide(".J-form").show(".J-grid");
   						}
   					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
				url : "api/card/query",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						cardStatus:subnav.getValue("cardStatus"),
						toBeStatus:subnav.getValue("toBeStatus"),
						cardType:subnav.getValue("cardType"),
						fetchProperties:"*,cardType.name"
					};
				},
				model:{
					columns:[{
						key:"name",
						name: i18ns.get("sale_card_name","卡号"),
						format:function(value,row){
                        	return  "<a href='javascript:void(0);' style='color:red;' class='J-cardName' data-index='"+row.pkMemberShipCard+"'>"+value+"</a>";
						}
					},{
						key:"cardType.name",
						name: i18ns.get("sale_card_type","卡号类型"),
					},{
						key:"cardStatus.value",
						name: i18ns.get("sale_card_status","会籍状态"),
					},{
						key:"toBeStatus.value",
						name:"调整状态"
					},{
						name:"查看权益人",
						format:"button",
						formatparams:[{
							key:"cardowner",
							text:"查看权益人",
							handler:function(index,data,rowEle){
								aw.ajax({
									url:"api/membershipcontract/query",
									dataType:"json",
									data:{
										pkMemberShipCard : data.pkMemberShipCard,
										status : "Normal"
									},
									success:function(data){
										if(data && data.length!=0){
											if(data[0].cardownerType=="ORGANIZATIONAL"){
												//机构
												widget.openView({
													url:"eling/elcms/sale/organpeople/organpeople",
													params:{
														pkMembershipContract : data[0].pkMembershipContract
													}
												});
											}else{
												//个人
												widget.openView({
													url:"eling/elcms/sale/people/people",
													params:{
														pkMembershipContract : data[0].pkMembershipContract
													}
												});
											}
										}else{
											Dialog.alert({
												content:"该会籍卡没有进行"+i18ns.get("sale_ship_contract","会籍签约")
											});
										}
									}
								});
							}
						}]
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"icon-edit",
							handler:function(index,data,rowEle){
								widget.get("subnav").show(["return"]).hide(["add","cardType","toBeStatus","cardStatus","search"]);
								widget.show(".J-form").hide(".J-grid");
								
								var form = widget.get("form");
			        			form.setDisabled(false);
								form.setData(data);
								form.setValue("cardStatusText", (data.cardStatus ? data.cardStatus.value : ""));
								form.setValue("toBeStatusText", (data.toBeStatus ? data.toBeStatus.value : ""));
								form.setValue("cardStatus", (data.cardStatus ? data.cardStatus.key : ""));
								form.setValue("toBeStatus", (data.toBeStatus ? data.toBeStatus.key : ""));		
								return false;
							}
						},{
							key:"delete",
							icon:"icon-remove",
							handler:function(index,data,rowEle){
								aw.del("api/card/" + data.pkMemberShipCard + "/delete",function(){
									widget.get("grid").refresh();
								});
								return false;
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var form = new Form({
				parentNode:".J-form",
				saveaction:function(){
					aw.saveOrUpdate("api/card/add",$("#card").serialize(),function(data){
						widget.get("subnav").hide(["return"]).show(["add","cardType","toBeStatus","cardStatus","search"]);
						widget.hide(".J-form").show(".J-grid");
						widget.get("grid").refresh();
					});
				},
				cancelaction:function(){
					widget.get("subnav").hide(["return"]).show(["add","cardType","toBeStatus","cardStatus","search"]);
					widget.hide(".J-form").show(".J-grid");
				},
				model:{
					id:"card",
					items:[{
						name:"pkMemberShipCard",
						type:"hidden"
					},{
						name:"name",
						label: i18ns.get("sale_card_name","卡号"),
						validate:["required"],
						exValidate: function(value){
							if(value.length>15){
								return "卡号不得超过15位";
							}else{
								return true;
							}
						}
					},{
						name:"cardType",
						label: i18ns.get("sale_card_type","卡号类型"),
						type:"select",
						url:"api/cardtype/query",
						key:"pkMemberShipCardType",
						value:"name",
						validate:["required"]
					},{
						name:"cardStatus",
						type:"hidden",
						defaultValue:"Free"
					},{
						name:"cardStatusText",
						label: i18ns.get("sale_card_status","会籍状态"),
						value:"key",
						defaultValue:"自由",
						readonly:true
					},{
						name:"toBeStatus",
						type:"hidden",
						defaultValue:"Normal"
					},{
						name:"toBeStatusText",
						label:"调整状态",
						defaultValue:"正常",
						readonly:true
					},{
						name:"backCardDate",
						label: i18ns.get("sale_card_backDate","退卡日期"),
						type:"date",
						readonly:true
					},{
						name:"backCardReason",
						label: i18ns.get("sale_card_backReason","退卡原因"),
						type:"textarea",
						height:"100",
						readonly:true
					}]
				}
			});
			this.set("form",form);
		},
		afterInitComponent:function(params,widget){
			
		}
	});
	module.exports = MemberShipCard;
});