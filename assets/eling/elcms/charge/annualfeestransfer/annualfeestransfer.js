/**
 * 年费结转
 * @author zp
 */
define(function(require, exports, module) {
	var Dialog=require("dialog");
	var aw = require("ajaxwrapper");
    var Form =require("form");
    var ELView=require("elview");
	var Subnav = require("subnav"); 
	var Grid = require("grid");
	var store = require("store");
	var enums  = require("enums");
	var activeUser = store.get("user");
	
	var template="<div class='el-annualfeestransfer'>"+
	 "<div class='J-subnav' ></div>"+
	 "<div class='J-grid'></div>" +
	 "<div class='J-form hidden' ></div></div>";
	
	var annualfeestransfer = ELView.extend({
		events : {
			"focus .J-form-annualFeesTransfer-autocomplete-pkMemberSigning":function(e){
				var form=this.get("form");
				var  transferTime =form.getValue("transferTime");
				if(transferTime==""){
					Dialog.alert({
						content : "结转日期为空,请选择结转日期！"
					 });
					return false;
				}
			},
		},
		attrs:{
        	template:template
        },
        arrayPayer:function(form,data){
        	if(data.annualfees!=null){
				var annualfees="";
				var map={};
				var payers="";
				for(var i=0;i<data.annualfees.length;i++){
					
					if(i==(data.annualfees.length-1)){
						annualfees+=data.annualfees[i].pkAnnualFees;
					}else{
						annualfees+=data.annualfees[i].pkAnnualFees+",";
					}
					var pkPayer=data.annualfees[i].payer.pkPayer;
					if(!map[pkPayer]){
						map[pkPayer]=[];
					}
					map[pkPayer].push(data.annualfees[i].payer);
				}
				for(var j in map){/*遍历对象*/
					var data={
						pkPayer : j,
					};
					payers+=map[j][0].personalInfo.name+"("+map[j][0].personalInfo.mobilePhone+")";
				}
				form.setValue("payers",payers);
				form.setValue("annual",annualfees);
			}
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title : "服务费结转",
					items : [{
						id : "search",
						type : "search",
						placeholder : "搜索",
						handler : function(str){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url : "api/annualfeestransfer/search",
								data : {
									s : str,
									properties : "memberSigning.room.number," +
											"annualfees.payer.personalInfo.name," +
											"annualfees.payer.personalInfo.mobilePhone," +
											"chargedAnnualFees," +
											"chargeStatus," +
											"transferFees," +
											"operator.name," +
											"transferStatus",
									fetchProperties:"pkAnnualFeesTransfer," +
													"memberSigning.pkMemberSigning," +
													"memberSigning.room.number," +
													"annualfees," +
													"annualfees.pkAnnualFees," +
													"annualfees.payer.pkPayer," +
													"annualfees.payer.personalInfo.name," +
													"annualfees.payer.personalInfo.mobilePhone," +
													"chargedAnnualFees," +
													"chargeStatus.value," +
													"beginDate," +
													"endDate," +
													"transferFees," +
													"transferTime," +
													"operator.pkUser," +
													"operator.name," +
													"transferStatus.value," +
													"description,createType," +
													"version",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
					},{
			   			id : "transferStatus",
			   			type : "buttongroup",
			   			tip:"结转单状态",
			   			showAll:true,
			   			showAllFirst:true,
			   			items:enums["com.eling.elcms.charge.model.AnnualFeesTransfer.TransferStatus"],
						handler:function(key,element){
							widget.get("grid").refresh();
							subnav.setValue("search","");
						}
					},{
						id:"time",
		                type:"daterange",
		                tip :"结转日期",
		                ranges : {
					        "本月": [moment().startOf("month"), moment().endOf("month")],
					        "今年": [moment().startOf("year"), moment().endOf("year")] ,
					 		"去年":[moment().subtract(1,"year").startOf("year"), moment().subtract(1,"year").endOf("year")],
						},
						defaultRange : "本月",
						handler:function(time){
							widget.get("grid").refresh();
							subnav.setValue("search","");
						}
					},{
						id : "add",
						type : "button",
						text : "新增",
						handler : function(){
							subnav.setValue("search","");
							widget.get("form").reset();
//							widget.get("form").setValue("operator",activeUser);
							widget.get("subnav").show(["return"]).hide(["add","time","search","transferStatus","confirm"]);
							widget.show([".J-form"]).hide([".J-grid"]);
						}
					},{
						id : "confirm",
						type : "button",
						text : "确认",
						show:false,
						handler : function(){
							var form =widget.get("form");
							var pk = form.getData().pkAnnualFeesTransfer;
							Dialog.confirm({
								title : "提示",
								content : "确认提交？确认后将无法编辑和删除",
								confirm : function(){
									Dialog.mask(true);
									aw.ajax({
					   					url : "api/annualfeestransfer/confirm",
					   					type : "POST",
					   					data : {
					   						"pkAnnualFeesTransfer":pk,
					   					},
					   					success : function(data) {
					   						Dialog.mask(false);
					   						widget.get("subnav").setValue("transferStatus",data.transferStatus.key);
											widget.get("subnav").setValue("time",{
												start:data.transferTime,
												end:data.transferTime
											});
					   						widget.get("grid").refresh();
					   						widget.get("subnav").hide(["return","confirm"]).show(["add","time","search","transferStatus"]);
											widget.show([".J-grid"]).hide([".J-form"]);
					   					}
					   				});
								},
								cancel : function(){
									widget.get("grid").refresh();
								}
							});
						}
					},{
						id:"return",
						type : "button",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-grid").hide([".J-form"]);
							widget.get("subnav").hide(["return","confirm"]).show(["add","time","search","transferStatus"]);
							widget.get("grid").refresh();
						}
					}]
				}
			})
			 this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
				url : "api/annualfeestransfer/querytransfer",
				autoRender:false,
				params:function(){
					var subnav=widget.get("subnav");
					return {
						transferTime:widget.get("subnav").getValue("time").start,
						transferTimeEnd:widget.get("subnav").getValue("time").end,
						transferStatus:subnav.getValue("transferStatus"),
						fetchProperties:"pkAnnualFeesTransfer," +
								"memberSigning.pkMemberSigning," +
								"memberSigning.room.number," +
								"annualfees," +
								"annualfees.pkAnnualFees," +
								"annualfees.payer.pkPayer," +
								"annualfees.payer.personalInfo.name," +
								"annualfees.payer.personalInfo.mobilePhone," +
								"chargedAnnualFees," +
								"chargeStatus.value," +
								"beginDate," +
								"endDate," +
								"transferFees," +
								"transferTime," +
								"operator.pkUser," +
								"operator.name," +
								"transferStatus.value," +
								"description,createType," +
								"version",
					};
				},
				model:{
					columns:[{
						name:"memberSigning.room.number",
						label:"房间号",
					},{
						name:"annualfees",
						label:"付款人",
						format:function(value,row){
							if(value.length>0){
								var map={};
								var payers="";
								for(var i=0;i<value.length;i++){
									var pkPayer=value[i].payer.pkPayer;
									if(!map[pkPayer]){
										map[pkPayer]=[];
									}
									map[pkPayer].push(value[i].payer);
								}
								for(var j in map){/*遍历对象*/
									var data={
										pkPayer : j,
									};
									payers+=map[j][0].personalInfo.name+"("+map[j][0].personalInfo.mobilePhone+")";
								}
								return payers;
							}else{
								return "";
							}
						}
					},{
						name:"chargedAnnualFees",
						label:"已交服务费",
						className: "text-right",
						format:function(value,row){
							return value!=""?value.toFixed(2):Number(0).toFixed(2);
						},
					},{
						name:"chargeStatus.value",
						label:"收费状态",
					},{
						name:"transferFees",
						label:"结转金额",
						className: "text-right",
						format:function(value,row){
							return value!=""?value.toFixed(2):Number(0).toFixed(2);
						},
					},{
						name:"transferTime",
						label:"结转日期",
						format:"date",
					},{
						name:"operator.name",
						label:"经手人",
					},{
						name:"transferStatus.value",
						label:"结转状态",
					},{
						name:"operate",
						label:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"icon-edit",
							show:function(value,row){
								if(row.transferStatus&&row.transferStatus.key=="UnConfirm"){
									return true;
								}else{
									return false;
								} 
							},
							handler:function(index,data,rowEle){
								var form = widget.get("form");
								widget.show([".J-form"]).hide([".J-grid"]);
								widget.get("subnav").hide(["time","transferStatus","add","search","confirm"]).show(["return"]);
								form.reset();
								form.setData(data);
								form.setValue("memberSigning",data.memberSigning.pkMemberSigning);
								form.setValue("pkMemberSigning",data);
								widget.arrayPayer(form,data);
								var autocomplete = form.getPlugin("pkMemberSigning").element.find("input").data("autocompleter");
								autocomplete.setExtraParam("transferTime",data.transferTime!=null?data.transferTime:moment().valueOf());
							}
						},{
							key:"delete",
							icon:"icon-remove",
							show:function(value,row){
								if(row.transferStatus&&row.transferStatus.key=="UnConfirm"){
									return true;
								}else{
									return false;
								} 
							},
							handler:function(index,data,rowEle){
								if (data.createType.key == "Automatic"){
									Dialog.alert({
		                				content:"本条服务费结转单为换房时系统自动生成，无法删除！"
		                			});
		                			return false;
								}
								aw.del("api/annualfeestransfer/" + data.pkAnnualFeesTransfer + "/delete",function(data) {
									  widget.get("grid").refresh();
								});
							}
						},{
							key:"detil",
							text:"确认",
							show:function(value,row){
								if(row.transferStatus&&row.transferStatus.key=="UnConfirm"){
									return true;
								}else{
									return false;
								} 
							},
							handler:function(index,data,rowEle){
								var form = widget.get("form");
								widget.show([".J-form"]).hide([".J-grid"]);
								widget.get("subnav").hide(["time","transferStatus","add","search"]).show(["return","confirm"]);
								form.reset();
								form.setData(data);
								form.setValue("memberSigning",data.memberSigning.pkMemberSigning);
								form.setValue("pkMemberSigning",data);
								widget.arrayPayer(form,data);
								form.setDisabled(true);
							}
						}]
					}]
				}
			})
			this.set("grid",grid);
			
			var form = new Form({
				parentNode:".J-form",
				model:{
					id:"annualFeesTransfer",
					saveaction:function(){
						var form = widget.get("form");
						var datas = form.getData();
						var memberSigning = form.getValue("memberSigning");
						datas.memberSigning=memberSigning;
						var annualf = form.getValue("annual");
						var ms = form.getValue("memberSigning");
						var params=$("#annualFeesTransfer").serialize()+"&fees="+annualf+"&pkMS="+ms;
						aw.saveOrUpdate("api/annualfeestransfer/savetransfer",params,function(data){
							widget.get("subnav").setValue("transferStatus",data.transferStatus.key);
							widget.get("subnav").setValue("time",{
								start:data.transferTime,
								end:data.transferTime
							});
							widget.get("subnav").show(["time","transferStatus","add","search"]).hide(["return","confirm"]);
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("grid").refresh();
						});
					},
					cancelaction:function(){
							widget.get("subnav").show(["time","transferStatus","add","search"]).hide(["return"]);
							widget.show([".J-grid"]).hide([".J-form"]);
					},
					items:[{
						name:"pkAnnualFeesTransfer",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"annual",
						type:"hidden",
					},{
						name:"memberSigning",
						type:"hidden",
					},{
						name:"transferTime",
						label:"结转日期",
						validate:["required"],
						type:"date",
						handler : function(time){
							//TODO autocomplete取值
							var autocomplete = form.getPlugin("pkMemberSigning").element.find("input").data("autocompleter");
							autocomplete.setExtraParam("transferTime",time!=null?time:moment().valueOf());
						}
					},{
						name:"pkMemberSigning",
						label:"房间号",
						type:"autocomplete",
						url:"api/annualfeestransfer/queryTransferMemberSigning",
						keyField:"memberSigning.pkMemberSigning",
						queryParamName : "s",
						useCache:false,
						maxItemsToShow:10,
						params:function(){
							return{
								searchProperties : "room.number",
								fetchProperties:"pkAnnualFeesTransfer," +
										"memberSigning.pkMemberSigning," +
										"memberSigning.room.number," +
										"annualfees," +
										"annualfees.pkAnnualFees," +
										"annualfees.payer.pkPayer," +
										"annualfees.payer.personalInfo.name," +
										"annualfees.payer.personalInfo.mobilePhone," +
										"chargedAnnualFees," +
										"chargeStatus.value," +
										"beginDate," +
										"endDate," +
										"transferFees," +
										"transferTime," +
										"operator.pkUser," +
										"operator.name," +
										"transferStatus.value," +
										"description," +
										"version",
							}
						},
						search: function(event, ui){
							console.log(event);
							console.log(ui);
							var form=widget.get("form");
							var  transferTime =form.getValue("transferTime");
							if(!transferTime){
								Dialog.alert({
									content : "结转日期为空,请选择结转日期！"
								 });
								return false;
							}
						},
						format : function(data){//格式化返回的结果
							if(data.memberSigning!=null){
								return data.memberSigning.room.number;
							}
						},
						onItemSelect : function(data){//选择结果后的触发事件
							if(data){
								form.setValue("beginDate",data.beginDate);
								form.setValue("endDate",data.endDate);
								form.setValue("chargedAnnualFees",data.chargedAnnualFees);
								form.setValue("chargeStatus",data.chargeStatus);
								form.setValue("memberSigning",data.memberSigning.pkMemberSigning);
								//拼接付款人的值
								widget.arrayPayer(form,data);
							}
						},
						validate:["required"]
					},{
						name:"payers",
						label:"付款人",
						readonly:true,
						type:"text",
						validate:["required"]
					},{
						name:"beginDate",
						readonly:true,
						label:"起始日期",
						type:"date"
					},{
						name:"endDate",
						readonly:true,
						label:"到期日期",
						type:"date"
					},{
						name:"chargedAnnualFees",
						readonly:true,
						label:"已收服务费",
					},{
						name:"chargeStatus",
						label:"收费状态",
						type:"select",
						options:enums["com.eling.elcms.charge.model.AnnualFees.ChargeStatus"],
						readonly:true,
					},{
						name:"transferFees",
						label:"结转金额",
						validate:["required"]
					},{
						name:"operator",
						label:"经手人",
						type:"select",
	    				key:"pkUser",
	    				value:"name",
	    				url:"api/users",//TODO 用户角色：wulina
	    				params:{
							fetchProperties:"pkUser,name"
						},
						validate:["required"],
						defaultValue:activeUser
					},{
						name:"description",
						label:"备注",
						type:"textarea",
					}]
				}
			})
			this.set("form",form);
		},
        afterInitComponent:function(params,widget){
        	if(params && params.pkAnnualFeesTransfer){
        		widget.get("grid").refresh({
        			pkAnnualFeesTransfer : params.pkAnnualFeesTransfer,
        			fetchProperties:"pkAnnualFeesTransfer," +
					"memberSigning.pkMemberSigning," +
					"memberSigning.room.number," +
					"annualfees," +
					"annualfees.pkAnnualFees," +
					"annualfees.payer.pkPayer," +
					"annualfees.payer.personalInfo.name," +
					"annualfees.payer.personalInfo.mobilePhone," +
					"chargedAnnualFees," +
					"chargeStatus.value," +
					"beginDate," +
					"endDate," +
					"transferFees," +
					"transferTime," +
					"operator.pkUser," +
					"operator.name," +
					"transferStatus.value," +
					"description," +
					"version",
        		});
        	} else{
        		widget.get("grid").refresh();
        	}
        }
	});
	module.exports = annualfeestransfer;
});
