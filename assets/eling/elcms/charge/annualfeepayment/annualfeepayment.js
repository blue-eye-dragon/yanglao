
/**
 * 服务费收款
 * ELVIEW
 * subnav 
 * grid 
 * form
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog");
	var Form =require("form-2.0.0")
	var store = require("store");
	var activeUser = store.get("user");
	var fetchProperties="pkAnnualFees," +
	"phone," +
	"beginDate," +
	"endDate,dueAnnualFees,realAnnualFees,chargeStatus," +
	"chargeTime,version," +
	"memberSigning.pkMemberSigning," +
	"memberSigning.room.pkRoom," +
	"memberSigning.room.number," +
	"payer.memberSigning.room.pkRoom," +
	"payer.memberSigning.room.number," +
	"payer.personalInfo.name," +
	"operator.pkUser," +
	"operator.name," +
	"confirm.pkUser," +
	"confirm.name," +
	"invoice.pkUser," +
	"invoice.name," +
	"payer.personalInfo.mobilePhone," +
	"payer.personalInfo.phone," +
	"payer.pkPayer,"+
	"payer.memberSigning.card.name";
	
	function numtochinese(Num) 
	{ 
		Num += "";
		for(i=Num.length-1;i>=0;i--) 
		{ 
			Num = Num.replace(",","")//替换tomoney()中的“,” 
			Num = Num.replace(" ","")//替换tomoney()中的空格 
		} 
		
		Num = Num.replace("￥","")//替换掉可能出现的￥字符 
		if(isNaN(Num))    
		{ 
			//验证输入的字符是否为数字 
			alert("请检查小写金额是否正确"); 
			return; 
		} 
		//---字符处理完毕，开始转换，转换采用前后两部分分别转换---// 
		part = String(Num).split("."); 
		newchar = "";    
		//小数点前进行转化 
		for(i=part[0].length-1;i>=0;i--) 
		{ 
			if(part[0].length > 10){ alert("位数过大，无法计算");return "";}//若数量超过拾亿单位，提示 
			tmpnewchar = "" 
				perchar = part[0].charAt(i); 
			switch(perchar){ 
			case "0": tmpnewchar="零" + tmpnewchar ;break; 
			case "1": tmpnewchar="壹" + tmpnewchar ;break; 
			case "2": tmpnewchar="贰" + tmpnewchar ;break; 
			case "3": tmpnewchar="叁" + tmpnewchar ;break; 
			case "4": tmpnewchar="肆" + tmpnewchar ;break; 
			case "5": tmpnewchar="伍" + tmpnewchar ;break; 
			case "6": tmpnewchar="陆" + tmpnewchar ;break; 
			case "7": tmpnewchar="柒" + tmpnewchar ;break; 
			case "8": tmpnewchar="捌" + tmpnewchar ;break; 
			case "9": tmpnewchar="玖" + tmpnewchar ;break; 
			} 
			switch(part[0].length-i-1) 
			{ 
			case 0: tmpnewchar = tmpnewchar +"元" ;break; 
			case 1: if(perchar!=0)tmpnewchar= tmpnewchar +"拾" ;break; 
			case 2: if(perchar!=0)tmpnewchar= tmpnewchar +"佰" ;break; 
			case 3: if(perchar!=0)tmpnewchar= tmpnewchar +"仟" ;break;    
			case 4: tmpnewchar= tmpnewchar +"万" ;break; 
			case 5: if(perchar!=0)tmpnewchar= tmpnewchar +"拾" ;break; 
			case 6: if(perchar!=0)tmpnewchar= tmpnewchar +"佰" ;break; 
			case 7: if(perchar!=0)tmpnewchar= tmpnewchar +"仟" ;break; 
			case 8: tmpnewchar= tmpnewchar +"亿" ;break; 
			case 9: tmpnewchar= tmpnewchar +"拾" ;break; 
			} 
			newchar = tmpnewchar + newchar; 
		} 
		//小数点之后进行转化 
		if(Num.indexOf(".")!=-1) 
		{ 
			if(part[1].length > 2) 
			{ 
				alert("小数点之后只能保留两位,系统将自动截段"); 
				part[1] = part[1].substr(0,2) 
			} 
			for(i=0;i<part[1].length;i++) 
			{ 
				tmpnewchar = "" 
					perchar = part[1].charAt(i) 
					switch(perchar){ 
					case "0": tmpnewchar="零" + tmpnewchar ;break; 
					case "1": tmpnewchar="壹" + tmpnewchar ;break; 
					case "2": tmpnewchar="贰" + tmpnewchar ;break; 
					case "3": tmpnewchar="叁" + tmpnewchar ;break; 
					case "4": tmpnewchar="肆" + tmpnewchar ;break; 
					case "5": tmpnewchar="伍" + tmpnewchar ;break; 
					case "6": tmpnewchar="陆" + tmpnewchar ;break; 
					case "7": tmpnewchar="柒" + tmpnewchar ;break; 
					case "8": tmpnewchar="捌" + tmpnewchar ;break; 
					case "9": tmpnewchar="玖" + tmpnewchar ;break; 
					} 
				if(i==0)tmpnewchar =tmpnewchar + "角"; 
				if(i==1)tmpnewchar = tmpnewchar + "分"; 
				newchar = newchar + tmpnewchar; 
			} 
		} 
		//替换所有无用汉字 
		while(newchar.search("零零") != -1) {			
			newchar = newchar.replace("零零", "零"); 
		}
		newchar = newchar.replace("零亿", "亿"); 
		newchar = newchar.replace("亿万", "亿"); 
		newchar = newchar.replace("零万", "万");    
		newchar = newchar.replace("零元", "元"); 
		newchar = newchar.replace("零角", ""); 
		newchar = newchar.replace("零分", ""); 
		
		if (newchar.charAt(newchar.length-1) == "元" || newchar.charAt(newchar.length-1) == "角") 
			newchar = newchar+"整" 
			return newchar; 
	};
	
	var template = require("./annualfeepayment.tpl");
	
	require("./annualfeepayment.css");
	
	var annualfeepayment = ELView.extend({
		attrs:{
			template:template,
			model:{
				printData:{}
			}
		},
		setPayer:function(form,pkMemberSiging){
			aw.ajax({
				url:"api/annualfeepayer/query",
				data:{
					"memberSigning":pkMemberSiging,
					"memberSigning.status":"Normal",
					"status":"Normal",
					fetchProperties:"pkPayer,personalInfo.name,personalInfo.mobilePhone,personalInfo.phone"
							
				},
				dataType:"json",
				success:function(data){
					if(data.length >0){
						var payer = data[0]
						form.setData("payer",data);
						form.setValue("payer",payer.pkPayer);
						form.setValue("payerpersonalInfophone",payer.personalInfo.phone);
						form.setValue("payerpersonalInfomobilePhone",payer.personalInfo.mobilePhone);
					}
				}
			})
		},
		events:{
			"change .J-form-annualfeepaymentForm-select-payermemberSigningroom":function(e){
				var widget=this;
				var form=widget.get("form");
				var pkRoom =  form.getValue("payermemberSigningroom");
				var chargeCycle = $(".J-chargeCycle").attr("data-key") || "year";
				aw.ajax({
					url:"api/annualfees/addQuery",
					data:{
						"memberSigning.room.pkRoom":pkRoom,
						"memberSigning.status":"Normal",
						"status":"Normal",
						"chargeCycle":chargeCycle,
						fetchProperties:"payer.memberSigning.annualFee,payer.pkPayer,payer.personalInfo.name," +
								"payer.personalInfo.phone,payer.personalInfo.mobilePhone,startDate,endDate"
					},
					dataType:"json",
					success:function(data){
						if(data && data.payer){
							form.setData("payer",[data.payer]);
							form.setValue("payer",data.payer.pkPayer);
							form.setValue("payerpersonalInfophone",(data.payer.personalInfo.phone==null?"":data.payer.personalInfo.phone));
							form.setValue("payerpersonalInfomobilePhone",(data.payer.personalInfo.mobilePhone==null?"":data.payer.personalInfo.mobilePhone));
							form.setValue("beginDate",moment(data.startDate));
							form.setValue("endDate",moment(data.endDate).format("YYYY-MM-DD"));
							form.setValue("dueAnnualFees",data.payer.memberSigning.annualFee);
						}
						
					}
				});
			},
			"change .J-form-annualfeepaymentForm-text-quantity":function(e){
				var widget=this;
				var form=widget.get("form");
				var chargeCycle = $(".J-chargeCycle").attr("data-key") || "year";
				var quantity = form.getValue("quantity");
				
				if(!/^\+?[1-9]\d*$/.test(quantity)
						||quantity =="" 
							||quantity >= 9){
					Dialog.alert({
						content:"请填入正确的数量!"
					});
					form.setValue("quantity",1);
					return false;
				}else{
					var pk = form.getValue("payermemberSigningroom");
					if(pk){
						var data = form.getData("payermemberSigningroom",{
							pk:pk
						}); 
						if (chargeCycle == "year") {
							form.setValue("endDate",moment(form.getValue("beginDate")).add("year",1*Number(quantity)).subtract("days",1).format("YYYY-MM-DD"));
						}else{
							form.setValue("endDate",moment(form.getValue("beginDate")).add("months",3*Number(quantity)).subtract("days",1).format("YYYY-MM-DD"));
						}
						form.setValue("dueAnnualFees",Number(data.annualFee)*Number(quantity));
						
					}
				}
			},
			"change .J-form-annualfeepaymentForm-date-beginDate":function(e){
				var widget=this;
				var form=widget.get("form");
				var chargeCycle = $(".J-chargeCycle").attr("data-key") || "year";
				var quantity = form.getValue("quantity");
				
				var pk = form.getValue("payermemberSigningroom");
				if(pk){
					var data = form.getData("payermemberSigningroom",{
						pk:pk
					}); 
					if (chargeCycle == "year") {
						form.setValue("endDate",moment(form.getValue("beginDate")).add("year",1*Number(quantity)).subtract("days",1).format("YYYY-MM-DD"));
					}else{
						form.setValue("endDate",moment(form.getValue("beginDate")).add("months",3*Number(quantity)).subtract("days",1).format("YYYY-MM-DD"));
					}
					form.setValue("dueAnnualFees",Number(data.annualFee)*Number(quantity));
					
				}
			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"服务费收款",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/annualfees/search",
							data:{
								s:str,
								orderString:"endDate:decs",
								properties:
									"endDate," +
									"dueannualfees," +
									"realannualfees," +
									"ChargeStatus," +
									"chargeTime," +
									"confirmTime," +
									"invoiceTime," +
									"payer.memberSigning.room.number," +
									"payer.personalInfo.name," +
									"memberSigning.room.number," +
									"confirm.name," +
									"payer.personalInfo.mobilePhone," +
									"payer.personalInfo.phone",
									fetchProperties:fetchProperties
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								
							}
						});
					},
					
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						frist:true,
						handler:function(){
							widget.show(".J-Grid").hide(".J-Form");
							widget.get("subnav").hide(["return"]).show(["search","building","add","chargeStatus","time"]);
							return false;
						}
					
					},{
						id:"add",
						text:"新增",
						handler:function(key,element){
							var form =widget.get("form");
							widget.get("form").reset();
							widget.show(".J-Form").hide(".J-Grid");
							widget.get("subnav").hide(["search","add","chargeStatus","time"]).show(["return","building"]);
							form.setValue("dataSource","Manual");
							form.setValue("chargeTime",moment());
							form.setAttribute("payer","readonly",true);
							form.setAttribute("payermemberSigningroom","readonly",false);
							form.setAttribute("invoiceStatus","readonly",true);
//							form.setAttribute("chargeStatus","readonly",true);
							form.setValue("chargeStatus","UnCharge");
							//当前用户是管理员时，让operator可用
							var userSelect=form.getData("operator","");
							var flag = false;
							for(var  i =  0 ; i<userSelect.length;i++ ){
								if(userSelect[i].pkUser == activeUser.pkUser){
									flag= true;
									break;
								}
							}
							if(flag){
								form.setValue("operator",activeUser.pkUser);
							}
						}  
					}],
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
							widget.get("form").load("payer.memberSigning.room");
						}  
					},{
						id:"chargeStatus",
						tip:"收费状态",
						items:[{
							key:"UnCharge",
							value:"未收费"
						},{
							key:"Charged",
							value:"已收费"  
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}],
					time:{
						tip:"起始时间",
						click:function(time){
							widget.get("grid").refresh();
						}
					}
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-Grid",
				autoRender:false,
				url:"api/annualfees/query",
				params:function(){
					return {
						"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
						"chargeStatus":widget.get("subnav").getValue("chargeStatus"),
						"beginDate":widget.get("subnav").getValue("time").start,
						"beginDateEnd":widget.get("subnav").getValue("time").end,
						fetchProperties:fetchProperties
					};
				},
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号"
					},{
						key:"payer.personalInfo.name",
						name:"付款人"
					},{
						key:"phone",
						name:"移动电话/电话",
						format:function(row,value){
							if(!value.payer){
								return ""
							}
							var mobilePhone = value.payer.personalInfo.mobilePhone==null?"无":value.payer.personalInfo.mobilePhone;
							var phone = value.payer.personalInfo.phone==null?"无":value.payer.personalInfo.phone;
							if(value.payer.personalInfo){
								return  mobilePhone+"/"+ phone;
							}else{
								return "";
							}
						}
					},{
						key:"beginDate",
						name:"起始日期",
						format:"date"
					},{
						key:"endDate",
						name:"到期日期",
						format:"date"
					},{
						key:"dueAnnualFees",
						name:"应收服务费"
					},{
						key:"realAnnualFees",
						name:"实际应收服务费"
					},{
						key:"chargeStatus.value",
						name:"收费状态"
					},{
						key:"chargeTime",
						name:"收费日期",
						format:"date"
					},{
						key:"operator.name",
						name:"经手人",
					},{
						key:"operate",
						name : "操作",
						format:"button",
						formatparams:[{
							key:"edit",
							text:"编辑",
							handler:function(index,data,rowEle){
								widget.get("form").reset();
								var temp = {};
//								temp = data;
								temp.pkAnnualFees = data.pkAnnualFees;
								temp.version = data.version;
								temp.operator = data.operator;
								var form = widget.get("form");
								if(data.payer){
									var payer = data.payer;
									form.setData("payer",[payer]);
									temp.payer = payer.pkPayer;
									form.setAttribute("payer","readonly",true);
									temp.payermemberSigningroom = payer.memberSigning.room;
									temp.payermemberSigningroom.room = payer.memberSigning.room;
									temp.payerpersonalInfophone = payer.personalInfo.phone;
									temp.payerpersonalInfomobilePhone = payer.personalInfo.mobilePhone;
								}else{
									widget.setPayer(form,data.memberSigning.pkMemberSigning);
									form.setAttribute("payer","readonly",false);
									temp.payermemberSigningroom={};
									temp.payermemberSigningroom.room = data.memberSigning.room;
								}
								
								temp.dueAnnualFees = data.dueAnnualFees;
								temp.realAnnualFees = data.realAnnualFees;
								temp.chargeStatus = data.chargeStatus;
								widget.get("form").setData(temp);
								widget.show(".J-Form").hide(".J-Grid");
								
								widget.get("subnav").hide(["search","building","add","chargeStatus","time"]).show(["return"]);
								form.setValue("dataSource","ManualPush");
								//当前用户是管理员时，让operator可用
								var userSelect=form.getData("operator","");
								var flag = false;
								for(var  i =  0 ; i<userSelect.length;i++ ){
									if(userSelect[i].pkUser == activeUser.pkUser){
										flag= true;
										break;
									}
								}
								if(flag){
									form.setValue("operator",activeUser.pkUser);
								}
								var chargeCycle = $(".J-chargeCycle").attr("data-key") || "year";
								if(chargeCycle=="year"){
									form.setValue("quantity",(moment(data.endDate).diff(data.beginDate, 'years')+1));
								}else{
									form.setValue("quantity",(moment(data.endDate).diff(data.beginDate, 'months')+1)/3);
								}
								form.setValue("beginDate",moment(data.beginDate));
								form.setValue("endDate",moment(data.endDate).format("YYYY-MM-DD"));
								form.setValue("chargeTime",moment());
								form.setAttribute("payermemberSigningroom","readonly",true);
								form.setAttribute("invoiceStatus","readonly",true);
//								form.setAttribute("realAnnualFees","readonly",false);
								if(data.invoiceTime){
									form.setValue("invoiceTime",moment(data.invoiceTime).format("YYYY-MM-DD HH:mm:ss"));
								}
								if(data.confirmTime){
									form.setValue("confirmTime",moment(data.confirmTime).format("YYYY-MM-DD HH:mm:ss"));
								}
								if(data.invoice){
									form.setValue("invoiceName",data.invoice.name);
								}
								if(data.confirm){
									form.setValue("confirmName",data.confirm.name);
								}
								
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								if(data.chargeStatus.key=="Receiving"){
									Dialog.alert({
										content:"该收费单已到账无法删除！"
									});
									return;
								}
								aw.del("api/annualfees/"+ data.pkAnnualFees + "/delete",function() {
									widget.get("grid").refresh();
								}
								);
							}
						},{
							key:"print",
							text:"打印",
							handler:function(index,data,rowEL){
								data.beginDateStr = moment(data.beginDate).format("YYYY.MM.DD");
								data.endDateStr = moment(data.endDate).format("YYYY.MM.DD");
								data.capitalMny = numtochinese(data.realAnnualFees);
								widget.get("model").printData = data;
								widget.renderPartial(".J-annualfeepayment-print");
								window.print();
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			var form=new Form({
				parentNode:".J-Form",
				saveaction:function(){
					var form = widget.get("form");
					var money =form.getValue("realAnnualFees");
					var payer =form.getValue("payer");
					var dueAnnualFees =form.getValue("dueAnnualFees");
					if(!payer){
						Dialog.alert({
							content:"该房间没有付款人！"
						});
						return;
					}
					if(Number(money)>Number(dueAnnualFees)){
						Dialog.alert({
							content:"实收服务费大于应收服务费！"
						});
						return;
					}
					var status =form.getValue("chargeStatus");
					var beginTime = form.getValue("beginDate");
					var endTime = form.getValue("endDate");
					if(beginTime>endTime){
						Dialog.alert({
							content:"起始日期不能大于到期日期！"
						});
						return;
					}
					aw.saveOrUpdate("api/annualfees/save",$("#annualfeepaymentForm").serialize(),function(data){
						widget.show(".J-Grid").hide(".J-Form");
						widget.get("subnav").hide(["return"]).show(["search","building","add","chargeStatus","time"]);
						widget.get("grid").refresh({
							pkAnnualFees:data.pkAnnualFees,
							fetchProperties:fetchProperties
						});
					});
					return false;
					
				},
				cancelaction:function(){
					widget.show(".J-Grid").hide(".J-Form");
					widget.get("subnav").hide(["return"]).show(["search","building","add","chargeStatus","time"]);
					return false;
				},
				model:{
					id:"annualfeepaymentForm",
					items:[{
						name:"pkAnnualFees",
						type:"hidden"	
					},{
						name:"version",
						type:"hidden"
					},{
						name:"refund",
						defaultValue:"false",
						type:"hidden"
					},{
						name:"ifCreateNext",
						type:"hidden",
						defaultValue:"false"
					},{
						name:"dataSource",
						type:"hidden",
						defaultValue:"Manual"
					},{
						name:"payermemberSigningroom",
						label:"房间",
						key:"room.pkRoom",
						type:"select",
						url:"api/membersign/query",
						params:function(){
							return{
								"status":"Normal",
								"room.building.pkBuilding":widget.get("subnav").getValue("building")||"",
								"room.statusIn":"InUse,Waitting,NotLive",
								"room.useType":"Apartment",
								fetchProperties:"room.pkRoom,room.number,annualFee",
							};
						},
						value:"room.number",
						validate:["required"]	
					},{
						name:"payer",
						label:"付款人",
						key:"pkPayer",
						type:"select",
						readonly:true,
						value:"personalInfo.name",
						validate:["required"]	
					},{
						name:"payerpersonalInfophone",
						label:"电话",
						readonly:true
					},{
						name:"payerpersonalInfomobilePhone",
						label:"移动电话",
						readonly:true
					},{
						name:"quantity",
						label:" ",
						defaultValue:1,
						validate:["required"]
					},{
						name:"beginDate",
						label:"起始日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"endDate",
						label:"到期日期",
						readonly:true,
						validate:["required"]
					},{
						name:"dueAnnualFees",
						label:"应收服务费",
						defaultValue:0,
						validate:["required","money"]
					},{
						name:"realAnnualFees",
						label:"实收服务费",
						defaultValue:0,
						validate:["required","money"]
					},{
						name:"chargeStatus",
						label:"收费状态",
						type:"select",
						options:[{
							key:"UnCharge",
							value:"未收费"
						},{
							key:"Charged",
							value:"已收费"
						}],
						validate:["required"]
					},{
						name:"chargeTime",
						label:"收费日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"operator",
						label:"经手人",
						key:"pkUser",
						type:"select",
						url:"api/users",//TODO 用户角色：wulina
						params:{
							fetchProperties:"pkUser,name"
						},
						value:"name",
						validate:["required"]	
						
					}
					,{
						name:"confirmTime",
						label:"到账日期",
						readonly:true
					},{
						name:"confirmName",
						label:"确认人",
						readonly:true
					},{
						name:"invoiceStatus",
						label:"开票状态",
						type:"select",
						options:[{
							key:"Invoiced",
							value:"已开票"
						},{
							key:"UnInvoice",
							value:"未开票"
						}],
						defaultValue:"UnInvoice",
						readonly:true
					},{
						name:"invoiceAmount",
						label:"开票金额",
						readonly:true
					},{
						name:"invoiceTime",
						label:"开票日期",
						readonly:true
					},{
						name:"invoiceName",
						label:"开票人",
						readonly:true
					}]
				}
			});
			this.set("form",form);
		},
		afterInitComponent:function(params,widget){
			aw.ajax({
				url : "api/sysparameter/annualfee_chargeCycle",
				type : "POST",
				data : {
					fetchProperties:"value"
				},
				success : function(data) {
					if(data!=null){
						chargeCycle=data;
						$(".J-chargeCycle").attr("data-key", chargeCycle);
						if(chargeCycle == "month"){
							widget.get("form").setLabel("quantity","收费期数（季）");
						}else if(chargeCycle == "year"){
							widget.get("form").setLabel("quantity","收费期数（年）");
						}
					}
				}
			});
			if(params){
				if(params.pkAnnualFees){
					widget.get("grid").refresh({
						pkAnnualFees:params.pkAnnualFees,
						fetchProperties:fetchProperties
					});
				}else if(params.pkMemberSigning){
					widget.get("grid").refresh({
						memberSigning:params.pkMemberSigning,
						fetchProperties:fetchProperties
					});
				}else{
					widget.get("grid").refresh();
				}
			}
		}
	});
	module.exports = annualfeepayment;	
});
