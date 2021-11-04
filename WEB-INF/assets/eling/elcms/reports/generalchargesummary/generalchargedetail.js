define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var store=require("store");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid'></div>";
	var generalchargedetail = ELView.extend({
		attrs:{
            template:template
		},
		initComponent : function(params,widget) {
			var years=[];
			for(var i=0;i<=moment().year()+5-2010;i++){
				var obj={};
				obj.key=2010+i;
				obj.value=2010+i;
				years.push(obj);
			}
			var months=[{
						key:01,value:"一月"
					},{
						key:02,value:"二月"
					},{
						key:03,value:"三月"
					},{
						key:04,value:"四月"
					},{
						key:05,value:"五月"
					},{
						key:06,value:"六月"
					},{
						key:07,value:"七月"
					},{
						key:08,value:"八月"
					},{
						key:09,value:"九月"
					},{
						key:10,value:"十月"
					},{
						key:11,value:"十一月"
					},{
						key:12,value:"十二月"
					}];
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"通用收费",
					items:[{
						id:"generalchargesSearch",
						type:"search",
						placeholder : "搜索",
						handler : function(str) {
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/generalservicecharge/search",
								data:{
									s:str,
									searchProperties:"member.personalInfo.name," +
											"member.memberSigning.room.number," +
											"paymentname," +
											"number," +
											"telephone," +
											"user.pkUser,"+
											"user.name,"+
											"chargeStatus," +
											"generalServiceItem.name," +
											"date",
									fetchProperties: "member.pkMember,"+
													 "member.personalInfo.name,"+
													 "member.memberSigning.room.number,"+
													 "paymentname,"+
													 "generalServiceItem.pkGeneralServiceItem,"+
													 "generalServiceItem.name,"+
													 "generalServiceItem.state,"+
													 "number,"+
													 "telephone,"+
													 "date,"+
													 "user.pkUser,"+
													 "user.name,"+
													 "chargeStatus,"+
													 "description,"+
													 "pkGeneralcharges,"+
													 "version",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						},
					},{
						id:"generalServiceItem",
        				tip:"服务项目",
        				type : "buttongroup",
        				keyField :"pkGeneralServiceItem",
        				valueField:"name",
        				autoRender:false,
        				url:"api/generalServiceItem/query",
        				params:{
        					fetchProperties:"pkGeneralServiceItem,name,state",
        				},
        				all : {
							show : true
						},
        				handler:function(key,element){
        					widget.get("grid").refresh();
        				}
					},{
						id:"year",
						tip:"年份",
        				type : "buttongroup",
					    items:years,	
					    handler:function(key,element){
						   widget.get("grid").refresh();
						   var year = widget.get("subnav").getValue("year");
						   var month = widget.get("subnav").getValue("month");
						   var monthFirstDay= year + "-" +month;
						   var title=moment(monthFirstDay).format("YYYY年MM月通用收费明细");
						   widget.get("subnav").setTitle(title);
					   }
					},{
						id:"month",
						tip:"月份",
        				type : "buttongroup",
					    items:months,	
					    handler:function(key,element){
						   widget.get("grid").refresh();
						   var year = widget.get("subnav").getValue("year");
						   var month = widget.get("subnav").getValue("month");
						   var monthFirstDay= year + "-" +month;
						   var title=moment(monthFirstDay).format("YYYY年MM月通用收费明细");
						   widget.get("subnav").setTitle(title);
					    }
					}]
				}
			});
			this.set("subnav",subnav);
			var grid=new Grid({
				parentNode:".J-grid",
				model:{
					url:"api/generalservicecharge/query",
					params:function(){
						var subnav=widget.get("subnav");
						var year = subnav.getValue("year");
						var month = subnav.getValue("month");
						var monthFirstDay= year + "-" +month;
						var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
						var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
						return {
							"member.memberSigning.room.building.pkBuilding":params.building,
							"generalServiceItem":subnav.getValue("generalServiceItem"),
							"date":moment(monthFirstDay,"YYYY-MM-DD").valueOf(),
							"dateEnd":moment(monthLastDay,"YYYY-MM-DD").valueOf(),
							fetchProperties: "member.pkMember,"+
											 "member.personalInfo.name,"+
											 "member.memberSigning.room.number,"+
											 "paymentName,"+
											 "number,"+
											 "telephone," +
											 "serviceType,"+
											 "generalServiceItem.pkGeneralServiceItem,"+
											 "generalServiceItem.name,"+
											 "generalServiceItem.state," +
											 "memberServicePackage.pkMemberServicePackage," +
											 "memberServicePackage.generalServicePackage.pkGeneralServicePackage," +
											 "memberServicePackage.generalServicePackage.name," +
											 "memberServicePackage.price,"+
											 "description,"+
											 "date,"+
											 "user.pkUser,"+
											 "user.name,"+
											 "chargeStatus,"+
											 "pkGeneralServiceCharge,"+
											 "version",
						};
				   },
				   columns:[{
						key:"member",
						name:"会员",
						format:function(value,data){
							return value.memberSigning.room.number+" "+value.personalInfo.name;
                       },
				   },{
					    key:"paymentName",
						name:"付款人"
				   },{
					    key:"serviceType.value",
						name:"服务类型",
				   },{
					    key:"serviceType",
						name:"服务项目/套餐",
						format:function(value,row){
							if(row.serviceType && row.serviceType.value=="服务套餐"){
								return row.memberServicePackage.generalServicePackage?row.memberServicePackage.generalServicePackage.name:"";
							}else if(row.serviceType && row.serviceType.value=="服务项目"){
								return row.generalServiceItem?row.generalServiceItem.name:"";
							}
						}
				   },{
					    key:"date",
						name:"收费日期",
						format:"date",
						formatparams :{
							mode : "YYYY-MM-DD HH:mm",
						}
				   },{
					    key:"number",
						name:"收费金额"
				   },{
					    key:"user.name",
						name:"收款人"
				   }]
				}
			});
			this.set("grid",grid);
		},
		afterInitComponent:function(params,widget){
			widget.get("subnav").setValue("year",params.year);
			widget.get("subnav").setValue("month",params.month);
			widget.get("subnav").load("generalServiceItem",	{callback:function(data){
					if (params.generalServiceItem){						
						widget.get("subnav").setValue("generalServiceItem", params.generalServiceItem);
					}
					widget.get("grid").refresh();
				}
			});
			var monthFirstDay= params.year + "-" +params.month;
			var title=moment(monthFirstDay).format("YYYY年MM月通用收费明细");
		    widget.get("subnav").setTitle(title);
		},
	});
	module.exports = generalchargedetail;
});