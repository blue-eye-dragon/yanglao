/**
 * 入住会员明细
 */
define(function(require, exports, module) {
	var ELView = require("elview");
	var Subnav = require("subnav");
	var Grid = require("grid");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	 	"<div class='J-printGrid'></div>"+
	 	"<div class='J-grid'></div>";

	require("./checkinmemberdetail.css");
	
	var checkinmemberdetail=ELView.extend({
		attrs:{
			template:template
		},
		events:{
			"click .J-detail" : function(e){
				var subnav=this.get("subnav");
				this.openView({
					url:"eling/elcms/membercenter/member/member",
					params:{
						pkBuilding:$(e.target).attr("data-key5"),
						cardType:$(e.target).attr("data-key6"),
						memberStatus:$(e.target).attr("data-key7"),
						pkMemberSigning:$(e.target).attr("data-key2"),
						pkMember:$(e.target).attr("data-key"),
						pkCard:$(e.target).attr("data-key4"),
						orderBy:$(e.target).attr("data-key3"),
						start:subnav.getValue("time").start,
						end:subnav.getValue("time").end,
						flg:"checkinmemberdetail"
					},
				});
			}
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					//title:"入住会员明细",
					title : "入住"+i18ns.get("sale_ship_owner","会员")+"明细",
					items:[{
						id:"searchCode",
						type:"search",
						placeholder : "搜索",
						handler : function(str) {
							var g = widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/member/search",
								data:{
									s:str,
									properties:
										"personalInfo.name,"+
										"personalInfo.sex.value,"+
										"memberSigning.room.number,"+
										"memberSigning.card.name,"+
										"memberSigning.annualFee,"+
										"memberSigning.room.status.value",
										fetchProperties:"*,personalInfo.name,personalInfo.sex,memberSigning.card.name,"+
										"memberSigning.room.number,"+"memberSigning.signDate,memberSigning.annualFee,"+
										"memberSigning.checkInDate,memberSigning.room.status,"+
										"memberSigning.pkMemberSigning,memberSigning.card.pkMemberShipCard"
								},
								//未添加
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							})
						},
					},{
						id : "building",
						type : "buttongroup",
						tip:"楼号",
						keyField : "pkBuilding",
						valueField : "name",
						url : "api/building/query",
						all : {
							show : true
						},
						params : function(){
							return {
								"useType":"Apartment",
								fecthProperties:"pkBuilding,name"
							};
						}, 
						handler : function(key,element) {
							widget.get("grid").refresh(null,function(){
								widget.getTotalMember("grid");
							});
						}
					},{
						id:"orderBy",
						type : "buttongroup",
						tip:"排序",
						items:[{
							key:"memberSigning.room.number",
							value:"房间号"
						},{
							key:"memberSigning.checkInDate:desc",
							value:"入住日期"
						},{
							key:"memberSigning.card.name",
							//value:"会籍卡"
							value:i18ns.get("sale_card_name","会籍卡"),
						}],
						handler:function(key,element){
							widget.get("grid").refresh(null,function(){
								widget.getTotalMember("grid");
							});
						}
					},{
						id:"memberStatus",
						type : "buttongroup",
						//tip:"会员状态",
						tip:i18ns.get("sale_ship_owner","会员")+"状态",
						items:[{
							key:"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
							value:"全部"
						},{
							key:"Normal",
							value:"在住",
						},{
							key:"Out",
							value:"外出",
						},{
							key:"Nursing",
							value:"颐养",
						},{
							key:"Behospitalized",
							value:"住院"
						},{
							key:"NursingAndBehospitalized",
							value:"颐养且住院"
						}],
						handler:function(key,element){
							widget.get("grid").refresh(null,function(){
								widget.getTotalMember("grid");
							});
						}
					},{
						id : "cardType",
						type : "buttongroup",
						//tip:"卡类型",
						tip:i18ns.get("sale_card_type","卡类型"),
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
							widget.get("grid").refresh(null, function() {
								widget.getTotalMember("grid");
							});
						}
					},{
						id:"time",
						type : "daterange",
						tip:"入住日期",
						ranges:{
							"一个月内": [moment().subtract(1,"month").add(1, 'day'),moment()],
							"去年":[moment().subtract(1,"year").startOf("year"), moment().subtract(1,"year").endOf("year")],
							"今年": [moment().startOf("year"), moment().endOf("year")],
						},
						handler : function(time){
							widget.get("grid").refresh(null,function(){
								widget.getTotalMember("grid");
							});
						},
					},{
						id:"print",
						type:"button",
						text:"打印",
						handler:function(){
							var time = widget.get("subnav").getValue("time");
							var title = widget.get("grid").getTitle();
							var tempTitle = moment(time.start).format("YYYY-MM-DD")+"至"+moment(time.end).format("YYYY-MM-DD")+" : "+title;
							widget.get("printGrid").setTitle(tempTitle);
							var data=widget.get("grid").getData();
							widget.get("printGrid").setData(data);
							widget.get("subnav").hide(["searchCode","toexcel","print","time","cardType","memberStatus","orderBy","building"]);
							window.print();
							widget.get("subnav").show(["searchCode","toexcel","print","time","cardType","memberStatus","orderBy","building"]);
						}
					},{
						id:"toexcel",
						type:"button",
						text:"导出",
						handler:function(){ 
							window.open("api/checkinmemberdetail/toexcel?orderString="+widget.get("subnav").getValue("orderBy")+
									"&memberSigning.checkInDate="+widget.get("subnav").getValue("time").start+
									"&memberSigning.checkInDateEnd="+widget.get("subnav").getValue("time").end+
									"&memberSigning.room.building="+widget.get("subnav").getValue("building")+
									"&statusIn="+widget.get("subnav").getValue("memberStatus")+
									"&memberSigning.card.cardType="+widget.get("subnav").getValue("cardType")
							);
							return false;
						}				
					}]
				}
			});
			this.set("subnav",subnav);
			var grid = new Grid({
				parentNode:".J-grid",
				autoRender:false,
				model : {
					url:"api/member/query",
					params:function(){
						var subnav=widget.get("subnav");
						var time=subnav.getValue("time");
						return {
							"memberSigning.room.building":widget.get("subnav").getValue("building"),
							"statusIn":widget.get("subnav").getValue("memberStatus"),
							"memberSigning.card.cardType":widget.get("subnav").getValue("cardType"),
							"memberSigning.checkInDate":widget.get("subnav").getValue("time").start,
							"memberSigning.checkInDateEnd":widget.get("subnav").getValue("time").end,
							"orderString":widget.get("subnav").getValue("orderBy"),
							fetchProperties:"*,personalInfo.name,personalInfo.sex,memberSigning.card.name,"+
							"memberSigning.room.number,"+"memberSigning.signDate,memberSigning.annualFee,"+
							"memberSigning.checkInDate,memberSigning.room.status,"+
							"memberSigning.pkMemberSigning,memberSigning.card.pkMemberShipCard"
						};
						
					},
					head:{
						title:""
					},
					columns : [{
						name:"memberSigning.room.number",
						label:"房间号"
					},{
						name:"personalInfo.name",
						//label:"会员",
						label:i18ns.get("sale_ship_owner","会员"),
						format:function(value,row){
							return "<a href='javascript:void(0);' style='color:red;' " +
							"class='J-detail' data-key='"+row.pkMember+"' " +
							"data-key2='"+row.memberSigning.pkMemberSigning+"'  " +
							"data-key4='"+row.memberSigning.card.pkMemberShipCard+"'" +
							"data-key3='"+widget.get("subnav").getValue("orderBy")+"'" +
							" data-key5='"+widget.get("subnav").getValue("building")+"' " +
							"data-key6='"+widget.get("subnav").getValue("cardType")+"'" +
							" data-key7='"+widget.get("subnav").getValue("memberStatus")+"'>"+value+"</a>";
						}
					},{
						name:"status.value",
						//label:"会员状态"
						label:i18ns.get("sale_ship_owner","会员")+"状态",
					},{
						name:"memberSigning.card.name",
						//label:"会籍卡号"
						label:i18ns.get("sale_card_name","会籍卡号")	
					},{
						name:"memberSigning.signDate",
						issort: true,
						label:"签约日期",
						format:"date"
					},{
						name:"memberSigning.checkInDate",
						issort: true,
						label:"入住日期",
						format:"date"
					},{
						name:"memberSigning.annualFee",
						label:"服务费"
					},{
						name:"memberSigning.room.status.value",
						label:"入住状态"
					}]
				}
			});
			this.set("grid",grid);
			
			var printGrid=new Grid({
				parentNode:".J-printGrid",
				autoRender:false,
				model:{
					isInitPageBar:false,
					head:{
						title:""
					},
					columns:[{
						name:"memberSigning.room.number",
						label:"房间号"
					},{
						name:"personalInfo.name",
						//label:"会员"
					    label:i18ns.get("sale_ship_owner","会员"),
					},{
						name:"status.value",
						//label:"会员状态"
						label:i18ns.get("sale_ship_owner","会员")+"状态",
					},{
						name:"memberSigning.card.name",
						//label:"会籍卡号"
						label:i18ns.get("sale_card_name","会籍卡号"),
					},{
						name:"memberSigning.signDate",
						issort: true,
						label:"签约日期",
						format:"date"
					},{
						name:"memberSigning.checkInDate",
						issort: true,
						label:"入住日期",
						format:"date"
					},{
						name:"memberSigning.annualFee",
						label:"服务费"
					},{
						name:"memberSigning.room.status.value",
						label:"入住状态"
					}]
				}
			
			});
			this.set("printGrid",printGrid);
		},
		//表格上统计户数和会员数
		getTotalMember:function(widget){
			var list=this.get("grid");
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
			list.setTitle("户数："+totalHouse+"户"+","+i18ns.get("sale_ship_owner","会员")+"总数："+totalMember+"人"); 
		},
		
		afterInitComponent:function(params,widget){
			if(params!=null&&params.flg){
				if(params.start!=null&&params.end!=null){
					widget.get("subnav").setValue("time",{start:params.start,end:params.end});
				}
				if(params.flg=="checkinmemberdetail"){
					widget.get("subnav").setValue("building",params.pkBuilding);
					widget.get("subnav").setValue("cardType",params.cardType);
					if(params.memberStatus){
						widget.get("subnav").setValue("memberStatus",params.memberStatus);
					}
					if(params.orderBy){
						widget.get("subnav").setValue("orderBy",params.orderBy);
					}
				}
			}else{
				widget.get("subnav").setValue("time",{start:moment().startOf("year"),end:moment().endOf("year")});
			}
			widget.get("grid").refresh(null,function(data){
				widget.getTotalMember("grid");
			});
		}
	});
	module.exports=checkinmemberdetail;
});