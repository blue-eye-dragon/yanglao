define(function(require, exports, module) {
	var ELView=require("elview");
	var tpl=require("./livingstatus.tpl");
	var Subnav=require("subnav-1.0.0");
	var utils=require("./livingstatus_utils");
	require("./livingstatus.css");
	var aw=require("ajaxwrapper");
	var RoomGrid=require("./roomgrid");
	var MemberGrid=require("./membergrid");
	var NewmemberGrid=require("./newmembergrid");
	var AccompanyGrid=require("./accompanygrid");
	var NewAccompanyGrid=require("./newaccompanygrid");
	var MSRoomGrid=require("./msroomgrid");
	var Click =require("./clickevents");
	//多语
	var i18ns = require("i18n");
	var LivingStatus=ELView.extend({
		attrs:{
			template:tpl,
			isCloseNav : true
		},
		events:function(){
			return  Click(this);
		},
		properties:function(){
			return {
				roomfetchProperties:"number," +
						"telnumber",
				personfetchProperties:
				"pkMember,"+
				"personalInfo.name," +
				"personalInfo.phone," +
				"personalInfo.birthday," +
				"personalInfo.mobilePhone," +
				"memberSigning.room.number"
			};
		},
		_getData:function(param,widget){
			aw.ajax({
				url:"api/checkin/status",
				dataType:"json",
				data:param,
				success:function(data){
					var result={
						row1:[{
							key:"totalNumber",
							label:"公寓总数",
							value:data.room.totalNumber,
							isPercent:true,
							isNoPercent:true,
						},{
							key:"rcheckIn",
							label:"已入住",
							value:data.room.checkIn,
							isPercent:true,
							isNoPercent:false,
							percent:data.room.totalNumber ? Math.round((data.room.checkIn/data.room.totalNumber)*100) : 0
						},{
							key:"Waitting",
							label:"预入住",
							value:data.room.waitting,
							isPercent:true,
							isNoPercent:true,
							//percent:data.room.totalNumber ? Math.round((data.room.waitting/data.room.totalNumber)*100) : 0
						},{
							key:"NotLive",
							label:"选房不住",
							value:data.room.notLive,
							isPercent:true,
							isNoPercent:true,
							//percent:data.room.totalNumber ? Math.round((data.room.notLive/data.room.totalNumber)*100) : 0
						},{
							key:"Appoint",
							label:"已预约",
							value:data.room.appoint,
							isPercent:true,
							isNoPercent:true,
							//percent:data.room.totalNumber ? Math.round((data.room.appoint/data.room.totalNumber)*100) : 0
						},{
							key:"Occupy",
							label:i18ns.get("cm_room_control","占用"),
							value:data.room.occupy,
							isPercent:true,
							isNoPercent:true,
							//percent:data.room.totalNumber ? Math.round((data.room.occupy/data.room.totalNumber)*100) : 0
						}],
					row2:[{
							key:"market",
							label:"销售",
							value:data.room.market,
							isPercent:true,
							isNoPercent:true,
							//percent:data.room.totalNumber ? Math.round((data.room.market/data.room.totalNumber)*100) : 0
						},{
							key:"outRoomMaintenance",
							label:"退房维修",
							value:data.room.outRoomMaintenance,
							isPercent:true,
							isNoPercent:true,
							//percent:data.room.totalNumber ? Math.round((data.room.outRoomMaintenance/data.room.totalNumber)*100) : 0
						},{
							key:"empty",
							label:"空房",
							value:data.room.empty,
							isPercent:true,
							isNoPercent:true,
							//percent:data.room.totalNumber ? Math.round((data.room.empty/data.room.totalNumber)*100) : 0
						},{
							key:"repair",
							label:"维修中/户数",
							value:data.room.repair,
							isPercent:true,
							isNoPercent:true,
							//percent:data.room.totalNumber ? Math.round((data.room.repair/data.room.totalNumber)*100) : 0
						}],
						row3:[{
							key:"houses",
							label:"签约户数",
							value:data.member.houses,
							isPercent:true,
							isNoPercent:true,
						},{
							key:"total",
							label:i18ns.get("sale_ship_owner","会员")+"总数",
							value:data.member.total,
							isPercent:true,
							isNoPercent:true,
						},{
							key:"man",
							label:"签约男"+i18ns.get("sale_ship_owner","会员")+"数",
							value:data.member.man,
							isPercent:true,
							isNoPercent:false,
							percent:data.member.total ? Math.round((data.member.man/data.member.total)*100) : 0
						},{
							key:"women",
							label:"签约女"+i18ns.get("sale_ship_owner","会员")+"数",
							value:data.member.women,
							isPercent:true,
							isNoPercent:false,
							percent:data.member.total ? Math.round((data.member.women/data.member.total)*100) : 0
						},{
							key:"mcheckIn",
							label:"入住"+i18ns.get("sale_ship_owner","会员")+"数",
							value:data.member.checkintotal,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.total ? Math.round((data.member.checkintotal/data.member.total)*100) : 0
						},{
							key:"checkinman",
							label:"入住男"+i18ns.get("sale_ship_owner","会员")+"数",
							value:data.member.checkinman,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.total ? Math.round((data.member.checkinman/data.member.total)*100) : 0
						}],
					row5:[{
							key:"checkinwomen",
							label:"入住女"+i18ns.get("sale_ship_owner","会员")+"数",
							value:data.member.checkinwomen,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.total ? Math.round((data.member.checkinwomen/data.member.total)*100) : 0
						},{
							key:"goOut",
							label:"外出人数",
							value:data.member.goOut,
							isPercent:true,
							isNoPercent:true,
						},{
							key:"inHospital",
							label:"住院人数",
							value:data.member.inHospital,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.total ? Math.round((data.member.inHospital/data.member.total)*100) : 0
						},{
							key:"inNursingHome",
							label:"入住颐养院人数",
							value:data.member.inNursingHome,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.total ? Math.round((data.member.inNursingHome/data.member.total)*100) : 0
						},{
							key:"shack",
							label:"暂住人数",
							value:data.member.shack,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.total ? Math.round((data.member.shack/data.member.total)*100) : 0
						},{
							key:"accompany",
							label:"陪住人数",
							value:data.member.accompany,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.total ? Math.round((data.member.accompany/data.member.total)*100) : 0
						}],row4:[{
							key:"advancedAge",
							label:"高龄",
							value:data.member.advancedAge,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.total ? Math.round((data.member.checkinwomen/data.member.total)*100) : 0
						},{
							key:"livingALone",
							label:"独居",
							value:data.member.livingAlone,
							isPercent:true,
							isNoPercent:true,
						}],
						row6:[{
							key:"housesMonth",
							label:"当月入住户数",
							value:data.member.housesMonth,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.houses ? Math.round((data.member.housesMonth/data.member.houses)*100) : 0
						},{
							key:"totalMonth",
							label:"当月入住人数",
							value:data.member.totalMonth,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.total ? Math.round((data.member.totalMonth/data.member.total)*100) : 0
						},{
							key:"manMonth",
							label:"当月入住男"+i18ns.get("sale_ship_owner","会员")+"数",
							value:data.member.manMonth,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.total ? Math.round((data.member.manMonth/data.member.total)*100) : 0
						},{
							key:"womenMonth",
							label:"当月入住女"+i18ns.get("sale_ship_owner","会员")+"数",
							value:data.member.womenMonth,
							isPercent:true,
							isNoPercent:true,
							//percent:data.member.total ? Math.round((data.member.womenMonth/data.member.total)*100) : 0
						}
//						,{
//							key:"accompanyMonth",
//							label:"当月陪住人数",
//							value:data.member.accompanyMonth,
//							isPercent:true
//						},{
//							key:"shackMonth",
//							label:"当月暂住人数",
//							value:data.member.shackMonth,
//							isPercent:true
//						}
						]
					};
					widget.set("model",{
						data:result
					});
					widget.renderPartial(".J-el-livingstatus");
					utils.initPercent(result);
				}
			});
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"入住状态",
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget._getData({
								pkBuilding:key,
								date:moment().valueOf()
							},widget);
						}
					}],
					buttons:[{
			    	  	id:"return",
						text:"返回",
						show:false,	
						handler:function(key,element){
							 $(".J-el-livingstatus,.J-building").removeClass("hidden");
							 $(".J-return,.J-memberGrid,.J-newaccompanyGrid,.J-newmemberGrid,.J-accompanyGrid,.J-roomGrid,.J-msroomGrid").addClass("hidden");
							 widget.get("subnav").setTitle("入住状态");
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			RoomGrid.init();
			MemberGrid.init();
			NewmemberGrid.init();
			AccompanyGrid.init();
			NewAccompanyGrid.init();
			MSRoomGrid.init();
			
			this.set("roomgrid",RoomGrid);
			this.set("membergrid",MemberGrid);
			this.set("newmembergrid",NewmemberGrid);
			this.set("accompanygrid",AccompanyGrid);
			this.set("newaccompanygrid",NewAccompanyGrid);
			this.set("msroomgrid",NewAccompanyGrid);
			
			
			this._getData({
				pkBuilding:subnav.getValue("building"),
				date:moment().valueOf()
			},widget);
		}
	});
	
	module.exports = LivingStatus;
});