/**
 *入住会员明细
 *baseview 
 */
define(function(require,exports,module){
	var ELView=require("elview");
	var $=require("$");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Grid=require("grid-1.0.0");
	//多语
	var i18ns = require("i18n");
	require("./checkinmemberdetailnew.css");
	 var template="<div class='J-subnav'></div>" +
	 		"<div class='J-printGrid-title'></div>"+
	 	"<div class='J-printGrid'></div>"+
	 	"<div class='J-grid'></div>";
	 var checkinmemberdetailnew = ELView.extend({
		 attrs:{
				template:template
		 },
		 events:{
			 "click .J-detail" : function(e){
					var flg=$(e.target).attr("data-key3");
						this.openView({
							url:"eling/elcms/membercenter/member/member",
							params:{
								pkMemberSigning:$(e.target).attr("data-key2"),
								pkMember:$(e.target).attr("data-key"),
								pkCard:$(e.target).attr("data-key4"),
								flg:"checkinmemberdetailnew"
									}
								});
				}
		 },
		 
		 initComponent:function(params,widget){
			 var subnav=new Subnav({
				 parentNode:".J-subnav",
				 model:{
					title:"入住会员明细",
					search:function(str){
						var g = widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/member/search",
							data:{
								s:str,
								properties:
								"personalInfo.name,"+
								"personalInfo.sex.value,"+
//								"status.value,"+
								"memberSigning.room.number,"+
								"memberSigning.card.name,"+
								"memberSigning.signDate,"+
								"memberSigning.checkInDate,"+
								"memberSigning.annualFee,"+
								"memberSigning.room.status.value",
								fetchProperties:"*,personalInfo.name,"+
								"personalInfo.sex,"+
								"memberSigning.card.name,"+
								"memberSigning.room.number,"+
								"memberSigning.signDate,"+
								"memberSigning.annualFee,"+
							    "memberSigning.checkInDate,"+
							    "memberSigning.room.status",
							},
							//未添加
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						})
					},
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh(null,function(){
								widget.getTotalMember("list");
							});
						}
					},{
						id:"orderString",
						items:[{
							key:"memberSigning.checkInDate:desc",
							value:"入住日期"
						},{
							key:"memberSigning.room.number",
							value:"房间号"
						},{
							key:"memberSigning.card.name",
							value:"会籍卡"
						}],
						handler:function(key,element){
								widget.get("list").refresh({
									"memberSigning.room.building":widget.get("subnav").getValue("building"),
									"status":widget.get("subnav").getValue("memberStatus"),
									"memberSigning.room.status":widget.get("subnav").getValue("checkInStatus"),
									"memberSigning.card.cardType":widget.get("subnav").getValue("cardType"),
									"memberSigning.checkInDate":widget.get("subnav").getValue("time").start,
									"memberSigning.checkInDateEnd":widget.get("subnav").getValue("time").end,
									"orderString":key,
									fetchProperties:"*,personalInfo.name,personalInfo.sex,memberSigning.card.name,"+
														"memberSigning.room.number,"+"memberSigning.signDate,memberSigning.annualFee,"+"" +
													"memberSigning.checkInDate,memberSigning.room.status"
								});
							
							
						}
					},{
						id:"memberStatusIn",
						items:[{
							key:"Normal,Out",
							value:"全部"
						},{
							key:"Normal",
							value:"正常",
						},{
							key:"Out",
							value:"外出"
						}],
						handler:function(key,element){
							widget.get("list").refresh(null,function(){
								widget.getTotalMember("list");
							});
						}
					},{
						id:"checkInStatusIn",
						items:[{
							key:"InUse,Waitting",
							value:"全部"
						},{
							key:"InUse",
							value:"使用中"
						},{
							key:"Waitting",
							value:"待入住"
						}],
						handler:function(key,element){
							widget.get("list").refresh(null,function(){
								widget.getTotalMember("list");
						});
						
						}
					}, {
						id : "cardType",
						items : [ {
							value : "全部"
						}, {
							key : "1",
							value : "A卡"
						}, {
							key : "2",
							value : "B卡"
						}, {
							key : "3",
							value : "C卡"
						}, {
							key : "4",
							value : "E卡"
						}, {
							key : "5",
							value : "F卡"
						} ],
						handler : function(key, element) {
							widget.get("list").refresh(null, function() {
								widget.getTotalMember("list");
							});
						}
					}],
					time:{
						ranges:{
							"前年": [moment().subtract(2,"year").startOf("year"), moment().subtract(2,"year").endOf("year")],
							"去年":[moment().subtract(1,"year").startOf("year"), moment().subtract(1,"year").endOf("year")],
							"今年": [moment().startOf("year"), moment().endOf("year")],
						},
						defaultTime:"今年",
						click:function(time){
							widget.get("list").refresh(null,function(){
								widget.getTotalMember("list");
						});
						}
					},
					buttons:[{
						id:"print",
						text:"打印",
						handler:function(){
							$(".J-printGrid-title").text("入住会员明细");
							var data=widget.get("list").getData();
							widget.get("printgrid").setData(data);
							widget.getTotalMember("printgrid");
							window.print();
						}
					},{
						id:"toexcel",
						text:"导出",
						handler:function(){ 
							window.open("api/checkinmemberdetail/toexcel?orderString="+widget.get("subnav").getValue("orderString")+
									"&memberSigning.checkInDate="+widget.get("subnav").getValue("time").start+
									"&memberSigning.checkInDateEnd="+widget.get("subnav").getValue("time").end+
									"&memberSigning.room.building="+widget.get("subnav").getValue("building")+
									"&statusIn="+widget.get("subnav").getValue("memberStatusIn")+
									"&memberSigning.room.statusIn="+widget.get("subnav").getValue("checkInStatusIn")+
									"&memberSigning.card.cardType="+widget.get("subnav").getValue("cardType")
									);
							return false;
	 					}				
					}],
				 }
			 });
			 this.set("subnav",subnav);
			 
			 var list=new Grid({
				    parentNode:".J-grid",
				    autoRender:false,
					url:"api/member/query",
					params:function(){
						var subnav=widget.get("subnav");
						var time=subnav.getValue("time");
						return {
							"memberSigning.room.building":widget.get("subnav").getValue("building"),
							"statusIn":widget.get("subnav").getValue("memberStatusIn"),
							"memberSigning.room.statusIn":widget.get("subnav").getValue("checkInStatusIn"),
							"memberSigning.card.cardType":widget.get("subnav").getValue("cardType"),
							"memberSigning.checkInDate":widget.get("subnav").getValue("time").start,
							"memberSigning.checkInDateEnd":widget.get("subnav").getValue("time").end,
							"orderString":widget.get("subnav").getValue("orderString"),
							fetchProperties:"*,personalInfo.name,personalInfo.sex,memberSigning.card.name,"+
												"memberSigning.room.number,"+"memberSigning.signDate,memberSigning.annualFee,"+
											"memberSigning.checkInDate,memberSigning.room.status,"+
											"memberSigning.pkMemberSigning,memberSigning.card.pkMemberShipCard"
						};
						
					},
					model:{
						head:{
							title:""
						},
					columns:[{
						key:"personalInfo.name",
						name:"会员",
						format:function(value,row){
							return "<a href='javascript:void(0);' style='color:red;' class='J-detail' data-key='"+row.pkMember+"' data-key2='"+row.memberSigning.pkMemberSigning+"' data-key3='memberOne' data-key4='"+row.memberSigning.card.pkMemberShipCard+"'>"+value+"</a>";
						}
					},{
						key:"personalInfo.sex.value",
						name:"性别"
					},{
						key:"status.value",
						name:"会员状态"
					},{
						key:"memberSigning.room.number",
						name:"房间号"
					},{
						key:"memberSigning.card.name",
						name:i18ns.get("sale_card_name","会籍卡号"),
					},{
						key:"memberSigning.signDate",
						name:"签约日期",
						format:"date"
					},{
						key:"memberSigning.checkInDate",
						name:"入住日期",
						format:"date"
					},{
						key:"memberSigning.annualFee",
						name:"服务费"
					},{
						key:"memberSigning.room.status.value",
						name:"入住状态"
					}]
				},
			 });
			 this.set("list",list);
			 
			 var printgrid=new Grid({
				 parentNode:".J-printGrid",
				 autoRender:false,
				 isInitPageBar:false,
				 model:{
						head:{
							title:""
						},
					columns:[{
						key:"personalInfo.name",
						name:"会员",
					},{
						key:"personalInfo.sex.value",
						name:"性别"
					},{
						key:"status.value",
						name:"会员状态"
					},{
						key:"memberSigning.room.number",
						name:"房间号"
					},{
						key:"memberSigning.card.name",
						name:i18ns.get("sale_card_name","会籍卡号"),
					},{
						key:"memberSigning.signDate",
						name:"签约日期",
						format:"date"
					},{
						key:"memberSigning.checkInDate",
						name:"入住日期",
						format:"date"
					},{
						key:"memberSigning.annualFee",
						name:"服务费"
					},{
						key:"memberSigning.room.status.value",
						name:"入住状态"
					}]
				},
			 });
			 this.set("printgrid",printgrid);
		 },
		 getTotalMember:function(list){
				var list=this.get(list);
				var data=list.getData() || [];
				//会员总数
				var totalMember=data.length;		
	        	var houseList= new Array();
	        	for(var i=0;i<data.length;i++){
	    		        houseList[i]=(data[i].memberSigning.room.number);
	    	        }
	        	//房间总数，后一个房间号如果不等于上一个，房间数加1
	        	var houseListNew= new Array();
	        	var m=1;
	        	if(houseList.length==0){
	        		m=0;
	        	}
	        	for(var t=1;t<houseList.length;t++){	
	        		if(houseList[t]!=houseList[t-1]){
	        			m=m+1;
	        		}
	        	}
				var totalHouse=m;
				
				list.setTitle("会员总数："+totalMember+"人"+",房间总数："+totalHouse+"间"); 
		 },
		 afterInitComponent:function(params,widget){
		    	widget.get("list").refresh(null,function(data){
		    		widget.getTotalMember("list");
				});
		    }
	 });
	module.exports=checkinmemberdetailnew;
});