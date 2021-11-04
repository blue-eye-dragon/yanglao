define(function(require,exports,module){
	var BaseDoc=require("basedoc");
	var aw = require("ajaxwrapper");
	var RoomGrid=require("./roomgrid");
	var MemberGrid=require("./membergrid");
	var NewmemberGrid=require("./newmembergrid");
	var AccompanyGrid=require("./accompanygrid");
	var NewAccompanyGrid=require("./newaccompanygrid");
	var MSRoomGrid=require("./msroomgrid");
	//多语
	var i18ns = require("i18n");
	var events =function(widget){
		return {
			//公寓总数totalNumber
			"click .J-totalNumber-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-roomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("公寓总数");
				RoomGrid.refresh({
					url:"api/room/query",
					params:{
						"useType":"Apartment",
						"building":subnav.getValue("building"),
						fetchProperties:widget.properties().roomfetchProperties
					}
				});
			},
			//已入住rcheckIn
			"click .J-rcheckIn-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-roomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("已入住");
				RoomGrid.refresh({
					url:"api/room/query",
					params:{
						"status":"InUse",
						"useType":"Apartment",
						"building":subnav.getValue("building"),
						fetchProperties:widget.properties().roomfetchProperties
					}
				});
			},
			//预入住Waitting
			"click .J-Waitting-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-roomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("预入住");
				RoomGrid.refresh({
					url:"api/room/query",
					params:{
						"status":"Waitting",
						"building":subnav.getValue("building"),
						fetchProperties:widget.properties().roomfetchProperties
					}
				});
			},
			//选房不住NotLive
			"click .J-NotLive-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-roomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("选房不住");
				RoomGrid.refresh({
					url:"api/room/query",
					params:{
						"status":"NotLive",
						"building":subnav.getValue("building"),
						fetchProperties:widget.properties().roomfetchProperties
					}
				});
			},
			//已预约Appoint
			"click .J-Appoint-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-roomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("已预约");
				RoomGrid.refresh({
					url:"api/room/query",
					params:{
						"status":"Appoint",
						"building":subnav.getValue("building"),
						fetchProperties:widget.properties().roomfetchProperties
					}
				});
			},
			//占用Occupy
			"click .J-Occupy-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-roomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle(i18ns.get("cm_room_control","占用"));
				RoomGrid.refresh({
					url:"api/room/query",
					params:{
						"status":"Occupy",
						"useType":"Apartment",
						"building":subnav.getValue("building"),
						fetchProperties:widget.properties().roomfetchProperties
					}
				});
			},
			//销售market
			"click .J-market-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-roomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("销售");
				RoomGrid.refresh({
					url:"api/room/query",
					params:{
						"useType":"Apartment",
						"building":subnav.getValue("building"),
						"statusIn":"Waitting,InUse,NotLive",
						fetchProperties:widget.properties().roomfetchProperties
					}
				});
			},
			//退房维修outRoomMaintenance
			"click .J-outRoomMaintenance-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-roomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("退房维修");
				RoomGrid.refresh({
					url:"api/room/query",
					params:{
						"building":subnav.getValue("building"),
						"status":"OutRoomMaintenance",
						fetchProperties:widget.properties().roomfetchProperties
					}
				});
			},
			//空房empty
			"click .J-empty-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-roomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("空房");
				RoomGrid.refresh({
					url:"api/room/query",
					params:{
						"building":subnav.getValue("building"),
						"useType":"Apartment",
						"status":"Empty",
						fetchProperties:widget.properties().roomfetchProperties
					}
				});
			},
			//维修中/户数repair
			"click .J-repair-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-roomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("维修中/户数");
				RoomGrid.refresh({
					url:"api/repair/ciquery",
					params:{
						"place.room.building":subnav.getValue("building"),
						"place.room.building.useType":"Apartment",
						"place.room.useType":"Apartment",
						"flowStatusIn":"Unarrange,Unrepaired,Unconfirmed",
						"place.room.status":"InUse",
						fetchProperties:widget.properties().roomfetchProperties
					}
				});
			},
			//签约户数houses
			"click .J-houses-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-roomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("签约户数");
				RoomGrid.refresh({
					url:"api/room/query",
					params:{
						"useType":"Apartment",
						"statusIn":"Waitting,InUse",
						"building":subnav.getValue("building"),
						fetchProperties:widget.properties().roomfetchProperties
					}
				});
			},
			//会员总数total
			"click .J-total-value": function(e){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle(i18ns.get("sale_ship_owner","会员")+"总数");
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						fetchProperties:widget.properties().personfetchProperties
					}
				});
			},
			//签约男会员数
			"click .J-man-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("签约男"+i18ns.get("sale_ship_owner","会员")+"数");
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
						fetchProperties:widget.properties().personfetchProperties,
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"personalInfo.sex":"MALE"
					}
				});
			},
			//签约女会员数
			"click .J-women-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("签约女"+i18ns.get("sale_ship_owner","会员")+"数");
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
						fetchProperties:widget.properties().personfetchProperties,
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"personalInfo.sex":"FEMALE"
					}
				});
			},
			//入住会员数mcheckIn
			"click .J-mcheckIn-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("入住"+i18ns.get("sale_ship_owner","会员")+"数");
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
						fetchProperties:widget.properties().personfetchProperties,
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
					}
				});
			},
			//入住男会员数checkinman
			"click .J-checkinman-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("入住男"+i18ns.get("sale_ship_owner","会员")+"数");
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
						fetchProperties:widget.properties().personfetchProperties,
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"personalInfo.sex":"MALE"
					}
				});
			},
			//入住女会员数checkinwomen
			"click .J-checkinwomen-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("入住女"+i18ns.get("sale_ship_owner","会员")+"数");
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
						fetchProperties:widget.properties().personfetchProperties,
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"personalInfo.sex":"FEMALE"
					}
				});
			},
			//外出人数goOut
			"click .J-goOut-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("外出人数");
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"status":"Out",
						fetchProperties:widget.properties().personfetchProperties,
					}
				});
			},
			//住院人数inHospital
			"click .J-inHospital-value" : function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("住院人数");
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"status":"Behospitalized",
						fetchProperties:widget.properties().personfetchProperties,
					}
				});
			},
			//入住颐养院人数inNursingHome
			"click .J-inNursingHome-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("入住颐养院人数");
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"status":"Nursing",
						fetchProperties:widget.properties().personfetchProperties,
					}
				});
			},
			//暂住人数shack
			"click .J-shack-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-newmemberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("暂住人数");
				NewmemberGrid.refresh({
					url:"api/shackapply/query",
					params:{
						"member.memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"statusIn":"Approval,Postpone",
						"flowStatus":"Approval",
						fetchProperties:"member.personalInfo.name," +
						"member.personalInfo.phone," +
						"member.personalInfo.mobilePhone," +
						"member.memberSigning.room.number",
						
					}
				});
			},
			//陪住人数accompany
			"click .J-accompany-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-accompanyGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("陪住人数");
				AccompanyGrid.refresh({
					url:"api/accompanyperson/query",
					params:{
						"status":"Normal",
						fetchProperties:"personalInfo.name,"+
						"personalInfo.mobilePhone,"+
						"memberSigning.room.number",
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
					}
				});
			},
			//高龄advancedAge
			"click .J-advancedAge-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("高龄人数");
				MemberGrid.refresh({
					url:"api/healthdata/queryAdvancedAge",
					params:{
						pkBuilding:subnav.getValue("building"),
						fetchProperties:widget.properties().personfetchProperties,
					}
				});
			},
			//独居livingALone
			"click .J-livingALone-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("独居人数");
				MemberGrid.refresh({
					url:"api/healthdata/queryLivingALone",
					params:{
						pkBuilding:subnav.getValue("building"),
						fetchProperties:widget.properties().personfetchProperties,
					}
				});
			},
			//当月入住户数housesMonth
			"click .J-housesMonth-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-msroomGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("当月入住户数");
				MSRoomGrid.refresh({
					url:"api/membersign/query",
					params:{
						"status":"Normal",
						"houseingNotIn" : false,
						fetchProperties:"room.number,room.telnumber",
						"room.building.pkBuilding":subnav.getValue("building"),
						"checkInDate":moment().startOf("month").valueOf(),
						"checkInDateEnd":moment().endOf("month").valueOf(),
					}
				});
			},
			//当月入住人数
			"click .J-totalMonth-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("当月入住人数");
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized,Waitting",
						fetchProperties:widget.properties().personfetchProperties,
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"memberSigning.checkInDate":moment().startOf("month").valueOf(),
						"memberSigning.checkInDateEnd":moment().endOf("month").valueOf(),
					}
				});
			},
			
			//当月入住男会员manMonth
			"click .J-manMonth-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("当月入住男"+i18ns.get("sale_ship_owner","会员"));
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized,Waitting",
						fetchProperties:widget.properties().personfetchProperties,
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"memberSigning.checkInDate":moment().startOf("month").valueOf(),
						"memberSigning.checkInDateEnd":moment().endOf("month").valueOf(),
						"personalInfo.sex":"MALE"
					}
				});
			},
			//当月入住女会员womenMonth
			"click .J-womenMonth-value":function(){
				$(".J-el-livingstatus,.J-building").addClass("hidden");
				$(".J-memberGrid,.J-return").removeClass("hidden");
				var subnav=widget.get("subnav");
				subnav.setTitle("当月入住女"+i18ns.get("sale_ship_owner","会员"));
				MemberGrid.refresh({
					url:"api/member/query",
					params:{
						"statusIn":"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized,Waitting",
						fetchProperties:widget.properties().personfetchProperties,
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
						"memberSigning.checkInDate":moment().startOf("month").valueOf(),
						"memberSigning.checkInDateEnd":moment().endOf("month").valueOf(),
						"personalInfo.sex":"FEMALE"
					}
				});
			},
			
		}
	};
	
	module.exports=events;
});