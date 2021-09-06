define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Form=require("form-2.0.0")
	var Dialog = require("dialog-1.0.0");
	var MultiRowGrid=require("multirowgrid");
	var emnu = require("enums");
	//多语
	var i18ns = require("i18n");
	require("./membercheckinhistoryreport.css");
	 var template="<div class='J-subnav'></div>"+
	 	"<div class='J-printGrid'></div>"+
		"<div class='J-form'></div>"+
	 	"<div class='J-grid'></div>";
	
	 var MemberCheckInHistory = ELView.extend({
		 attrs:{
			 template:template
		 },
		 events:{
			 "click .J-detail" : function(e){
				 var flg=$(e.target).attr("data-key3");
				 if(flg=="memberOne"){
					 this.openView({
						 url:"eling/elcms/membercenter/member/member",
						 params:{
							 pkMemberSigning:$(e.target).attr("data-key2"),
							 pkMember:$(e.target).attr("data-key"),
							 pkCard:$(e.target).attr("data-key4"),
							 name:$(e.target).text(),
							 flg:"memberhistorty"
						 }
					 });
				 }else if(flg=="memberTwo"){
					 this.openView({
						 url:"eling/elcms/membercenter/member/member",
						 params:{
							 pkMemberSigning:$(e.target).attr("data-key2"),
							 pkMember:$(e.target).attr("data-key"),
							 pkCard:$(e.target).attr("data-key4"),
							 name:$(e.target).text(),
							 flg:"memberhistorty"
						 }
					 });
				 }
			 },
			 //入住结束日期添加校验，必须在入住开始日期之后
			 "change .J-form-queryform-date-checkInEnd" : function(e){
				 var form = this.get("form");
				 var checkInEnd = form.getValue("checkInEnd");
				 var checkInStart = form.getValue("checkInStart");
				 if(checkInEnd){
					 if(moment(checkInStart).isAfter(checkInEnd,"minutes")){
						 Dialog.alert({
							 content:"入住结束日期不能早于入住开始日期！"
						 });
						 form.setValue("checkInEnd",moment().valueOf());
						 return;
					 }
				 }
			 },
			 "change .J-form-queryform-date-stopDateEnd" : function(e){
				 var form = this.get("form");
				 var stopDateEnd = form.getValue("stopDateEnd");
				 var stopDateStart = form.getValue("stopDateStart");
				 if(stopDateEnd){
					 if(moment(stopDateStart).isAfter(stopDateEnd,"minutes")){
						 Dialog.alert({
							 content:"退住结束日期不能早于退住开始日期！"
						 });
						 form.setValue("stopDateEnd",moment().valueOf());
						 return;
					 }
				 }
			 },
			 
			 
		 },
		 initComponent:function(params,widget){		
			 var subnav=new Subnav({
				 parentNode:".J-subnav",
				 model:{
					 title:"历史入住"+i18ns.get("sale_ship_owner","会员"),
					 search : function(str) {
						 widget.get("list").loading();
						 aw.ajax({
							 url:"api/membersignhistory/membercheckinhistorysearch",
							 data:{
								 s:str,
								 searchProperties:"member.memberSigning.membershipContract.membershipCard.name," +
								 "member.memberSigning.membershipContract.membershipCard.cardStatus,"+
								 "member.personalInfo.name," +
								 "member.personalInfo.sex," +
								 "member.memberSigning.stopReason," +
								 "member.memberSigning.room.status," +
								 "member.memberSigning.room.number," +
								 "member.memberSigning.annualFee",
								 fetchProperties:"pkMemberShipCard," +
								 "pkMembershipContract," +
								 "pkMemberSigning,"+
								 "pkMemberShipCard," +
								 "memberShipCard," +
								 "memberShipStatus," +
								 "cardFee," +
								 "backCardDate," +
								 "memberFirst," +
								 "memberSecond," +
								 "roomnumber," +
								 "checkInDate," +
								 "stopDate," +
								 "signDate," +
								 "status," +
								 "stopReason," +
								 "annualFee," +
								 "members.pkMember," +
								 "members.name," +
								 "members.sex," +
								 "members.birthday"
							 },
							 dataType:"json",
							 success:function(data){
								 widget.get("list").setData(data);
								 widget.hide([".J-form"]); 
								 widget.get("subnav").show(["search","toexcel","print","return"]).hide(["toggle"]);
								 widget.show([".J-grid"]);
							 }
						 });
					 },
					 buttons:[{
						 id:"toexcel",
						 text:"导出",
						 show:false,
						 handler:function(){
							 var form=widget.get("form");
							 var fetchProperties="pkMemberShipCard," +
							 "pkMembershipContract," +
							 "pkMemberSigning,"+
							 "pkMemberShipCard," +
							 "memberShipCard," +
							 "memberShipStatus," +
							 "cardFee," +
							 "backCardDate," +
							 "memberFirst," +
							 "memberSecond," +
							 "roomnumber," +
							 "checkInDate," +
							 "stopDate," +
							 "signDate," +
							 "status," +
							 "stopReason," +
							 "annualFee," +
							 "members.pkMember," +
							 "members.name," +
							 "members.sex," +
							 "members.birthday"
							 window.open("api/membercheckinhistoryreport/toexcel?memberSigning.room.building="+form.getValue("pkBuildings")
									 +"&memberSigning.checkInDate="+form.getValue("checkInStart")
									 +"&memberSigning.checkInDateEnd="+form.getValue("checkInEnd")
									 +"&checkOutDate="+form.getValue("stopDateStart")
									 +"&checkOutDateEnd="+form.getValue("stopDateEnd")
									 +"&memberSigning.membershipContract.membershipCard.cardStatus="+form.getValue("cardStatus")
									 +"&memberSigning.membershipContract.membershipCard.cardType="+form.getValue("cardType")
									 +"&checkOutReason="+form.getValue("stopReason") 
									 +"&fetchProperties="+fetchProperties
							 );
							 
							 return false;
						 }				
					 },{
						 id:"print",
						 text:"打印",
						 show:false,
						 handler:function(){
							 widget.hide([".J-form"]);
							 var title="历史入住"+i18ns.get("sale_ship_owner","会员");
							 $(".J-grid-title").text(title);
							 var data=widget.get("list").getData();
							 widget.get("grid").setData(data);
							 window.print();
							 widget.show([".J-form"]);
						 } 
					 },{
						 id:"toggle",
						 text:"条件▲",
						 handler:function(){
							 $(".J-form").slideToggle(1000);
							 if($(".J-btn-toggle").val()=="条件▲"){
								 $(".J-btn-toggle").val("条件▼");
							 }else if($(".J-btn-toggle").val()=="条件▼"){
								 $(".J-btn-toggle").val("条件▲");
							 }
						 }
					 }
					 ,{
						 id:"return",
						 text:"返回",
						 show:false,
						 handler:function(){
							 widget.get("subnav").show(["search","toexcel","print","toggle"]).hide(["return"]);
							 widget.show([".J-form"]);
						 }
					 }
					 ],
				 }
			 });
			 this.set("subnav",subnav);
			 var form = new Form({
				 parentNode:".J-form",
				 saveaction:function(){
					 var form=widget.get("form");
					 var pkBuildings=form.getValue("pkBuildings");
					 $(".J-btn-toggle").trigger('click');
					 widget.get("list").refresh();
					 widget.get("subnav").show(["toexcel","print"]);
				 },
				 cancelaction:function(){
					 widget.get("form").reset();
				 },
				 model:{
					 id:"queryform",
					 saveText:"确定",
					 items:[{
						 name:"pkBuildings",
						 label:"楼号",
						 url:"api/building/query",
						 key:"pkBuilding",
						 value:"name",
						 emptyText:"全部",
						 params:function(){
							 return {
								 "useType":"Apartment",
								 fetchProperties:"pkBuilding,name"
							 };
						 },
						 type:"select",
						 className:{
							 container:"col-md-6",
							 label:"col-md-4"
						 }                                       
					 },{
						 name:"cardType",
						 label:i18ns.get("sale_card_type","卡类型"),
						 url:"api/cardtype/query",
						 key:"pkMemberShipCardType",
						 value:"name",
						 emptyText:"全部",
						 params:function(){
							 return {
								 fetchProperties:"pkMemberShipCardType,name"
							 };
						 },
						 type:"select",
						 className:{
							 container:"col-md-6",
							 label:"col-md-4"
						 }                                       
					 },{
						 name:"checkInStart",
						 label:"入住开始日期",
						 type:"date",
						 className:{
							 container:"col-md-6",
							 label:"col-md-4"
						 }
					 
					 },{
						 name:"checkInEnd",
						 label:"入住结束日期",
						 type:"date",
						 className:{
							 container:"col-md-6",
							 label:"col-md-4"
						 }
					 },{
						 name:"stopDateStart",
						 label:"退住开始日期",
						 type:"date",
						 defaultValue:moment().startOf("year").valueOf(),
						 className:{
							 container:"col-md-6",
							 label:"col-md-4"
						 }
					 
					 },{
						 name:"stopDateEnd",
						 label:"退住结束日期",
						 type:"date",
						 defaultValue:moment().endOf("year").valueOf(),
						 className:{
							 container:"col-md-6",
							 label:"col-md-4"
						 }
					 },{
						 name:"cardStatus",
						 label:i18ns.get("sale_card_status","卡状态"),
						 emptyText:"全部",
						 options : [{
							 key : "Contracted",
							 value :i18ns.get("sale_ship_contract","会籍签约"),
						 },{
							 key : "Using",
							 value : "使用中"
						 },{
							 key : "BackCard",
							 value : "已退会"
						 }],
						 type:"select",
						 className:{
							 container:"col-md-6",
							 label:"col-md-4"
						 }                                       
					 },{
						 name:"stopReason",
						 label:"退住原因",
						 emptyText:"全部",
						 options:emnu["com.eling.elcms.checkout.model.CheckOutLiving.CheckOutReason"],
						 type:"select",
						 className:{
							 container:"col-md-6",
							 label:"col-md-4"
						 }                                       
					 }]
				 }
			 })
			 this.set("form",form);
			 var list=new MultiRowGrid({
				 parentNode:".J-grid",
				 autoRender:false,
				 url : "api/membersignhistory/membercheckinhistory",
				 params:function(){
					 var  form =  widget.get("form");
					 return{
						 "memberSigning.room.building":form.getValue("pkBuildings"),
						 "memberSigning.checkInDate":form.getValue("checkInStart"),
						 "memberSigning.checkInDateEnd":form.getValue("checkInEnd"),
						 "checkOutDate":form.getValue("stopDateStart"),
						 "checkOutDateEnd":form.getValue("stopDateEnd"),
						 "memberSigning.membershipContract.membershipCard.cardStatus":form.getValue("cardStatus"),
						 "memberSigning.membershipContract.membershipCard.cardType":form.getValue("cardType"),
						 "checkOutReason":form.getValue("stopReason"),
						 
						 "fetchProperties":"pkMemberShipCard," +
						 "pkMembershipContract," +
						 "pkMemberSigning,"+
						 "pkMemberShipCard," +
						 "memberShipCard," +
						 "memberShipStatus," +
						 "cardFee," +
						 "backCardDate," +
						 "memberFirst," +
						 "memberSecond," +
						 "roomnumber," +
						 "checkInDate," +
						 "stopDate," +
						 "signDate," +
						 "status," +
						 "stopReason," +
						 "annualFee," +
						 "members.pkMember," +
						 "members.name," +
						 "members.sex," +
						 "members.birthday"
					 }
				 },
				 model:{
					 multiField:"members",
					 head:{
						 title:""
					 },
					 columns:[{
						 key:"memberShipCard",
						 name : i18ns.get("sale_card_name","会籍卡")
					 },{
						 key:"memberShipStatus",
						 //name:"会籍状态",
						 name:i18ns.get("sale_ship_status","会籍状态")
					 },{
						 key:"checkInDate",
						 name:"入住日期",
						 format:"date"
					 },{
						 key:"annualFee",
						 name:"服务费"
					 },{
						 key:"roomnumber",
						 name:"房间号"
					 },{
						 key:"members",
						 multiKey:"name",
						 //name:"会员",
						 name:i18ns.get("sale_ship_owner","会员"),
						 isMulti:true,
						 format:function(value,row){
							 if(value){
								 var pk = "";
								 for ( var i in row.members) {
									 if(row.members[i].name == value){
										 pk=row.members[i].pkMember;
									 }
								 }
								 return "<a href='javascript:void(0);' style='color:red;' class='J-detail' data-key='"+pk+"' data-key2='"+row.pkMemberSigning+"' data-key3='memberOne' data-key4='"+row.pkMemberShipCard+"'>"+value+"</a>";
							 }else{
								 return "";
							 }
						 }
					 },{
						 key:"members",
						 multiKey:"sex.value",
						 name:"性别",
						 isMulti:true
					 },{
						 key:"members",
						 multiKey:"birthday",
						 name:"出生日期",
						 isMulti:true
					 },{
						 key:"members",
						 multiKey:"stopDate",
						 name:"退住日期",
						 format:"date",
						 isMulti:true
					 },{
						 key:"members",
						 multiKey:"stopReason",
						 name:"退住原因",
						 isMulti:true
					 }]
				 }
			 });
			 this.set("list",list);
			 var grid=new MultiRowGrid({
				 parentNode:".J-printGrid",
				 autoRender:false,
				 isInitPageBar:false,
				 model:{
					 multiField:"members",
					 head:{
						 title:""
					 },
					 columns:[{
						 key:"roomnumber",
						 name:"房间号"
					 },{
						 key:"memberShipCard",
						 //name : "会籍卡"
						 name : i18ns.get("sale_card_name","会籍卡")
					 },{
						 key:"memberShipStatus",
						 //name:"会籍状态"
						 name:i18ns.get("sale_ship_status","会籍状态")
					 },{
						 key:"checkInDate",
						 name:"入住日期",
						 format:"date"
					 },{
						 key:"annualFee",
						 name:"服务费"
					 },{
						 key:"members",
						 multiKey:"name",
						 //name:"会员",
						 name:i18ns.get("sale_ship_owner","会员"),
						 isMulti:true,
						 format:function(value,row){
							 if(value){
								 var pk = "";
								 for ( var i in row.members) {
									 if(row.members[i].name == value){
										 pk=row.members[i].pkMember;
									 }
								 }
								 return "<a href='javascript:void(0);' style='color:red;' class='J-detail' data-key='"+pk+"' data-key2='"+row.pkMemberSigning+"' data-key3='memberOne' data-key4='"+row.pkMemberShipCard+"'>"+value+"</a>";
							 }else{
								 return "";
							 }
						 }
					 },{
						 key:"members",
						 multiKey:"sex.value",
						 name:"性别",
						 isMulti:true
					 },{
						 key:"members",
						 multiKey:"birthday",
						 name:"出生日期",
						 isMulti:true
					 },{
						 key:"members",
						 multiKey:"stopDate",
						 name:"退住日期",
						 format:"date",
						 isMulti:true
					 },{
						 key:"members",
						 multiKey:"stopReason",
						 name:"退住原因",
						 isMulti:true
					 }]
				 }
			 
			 });
			 this.set("grid",grid);
		 }	
	 });
	module.exports = MemberCheckInHistory;
});
