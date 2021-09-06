/**
 * 会员政治面貌和离休明细
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var Grid=require("grid");
	var enums = require("enums");
	var buildings  =require("store").get("user").buildings;
	require("./memberotherpartyandretirementdetails.css");
	//多语
	var i18ns = require("i18n");
    var template="<div class='el-MemberOtherpartyAndRetirementDetails'>" +
    		"<div class='J-subnav'></div>"+
    		"<div class='J-grid' ></div>"+
    		"<div class='J-grid-printTitle' ></div>"+
    		"<div class='J-grid-printTime' ></div>"+
    		"<div class='J-grid-print' ></div>" +
    		"</div>";
    var cols =[{
			name:"member",
				label:i18ns.get("sale_ship_owner","会员"),
				format:function(value,row){
					return row.memberSigning.room.number+" "+row.personalInfo.name
				}
			},{
				name:"personalInfo.birthday",
				label:"年龄",
				format:"age"
			},{
				name:"personalInfo.idType.value",
				label:"证件类型"
			},{
				name:"personalInfo.idNumber",
				label:"证件号"
			},{
				name:"personalInfo.mobilePhone",
				label:"联系电话"
			},{
				name:"status.value",
				label:"状态"
			},{
				name:"personalInfo.otherParty.value",
				label:"党派"
			},{
				name:"specialTreatment.value",
				label:"离休类型",
			}];
	var MemberOtherpartyAndRetirementDetails = ELView.extend({
		attrs:{
			template:template 
		},
		initComponent : function(params,widget) { 
    		 var subnav=new Subnav({
    			 parentNode:".J-subnav",
    			 model:{
 					title:i18ns.get("sale_ship_owner","会员")+"政治面貌和离休明细",
 					items:[{
						id:"building",
						tip :"楼",
						type:"buttongroup",
						items:buildings,
						keyField : "pkBuilding",
						valueField : "name",
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
						id:"specialTreatment",
						tip :"离休类型",
						all : {
							show : true,
							text : "全部"
						},
						type:"buttongroup",
						items:enums["com.eling.elcms.member.model.SpecialTreatment"],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
 						id:"OtherParty", 
 						tip :"政治面貌",
 						all : {
							show : true,
							text : "全部",
							position : "bottom"
						},
 						type:"buttongroup",
 						items:enums["com.eling.elcms.basedoc.model.OtherParty"],
 						handler:function(key,element){
 							widget.get("grid").refresh(); 
 						}
 					},{
 						id:"print", 
 						text :"打印",
 						type:"button",
 						handler:function(key,element){
 							widget.get("printgrid").setData(widget.get("grid").getData());
 							$(".J-grid-printTitle").text(i18ns.get("sale_ship_owner","会员")+"信息");
 							$(".J-grid-printTime").text("打印日期:"+moment().format("YYYY-MM-DD"));
 							window.print();
 						}
 					}], 
                 }
    		 });
    		 this.set("subnav",subnav);
    		 
    		 var grid=new Grid({
    			parentNode:".J-grid",
 				url :"api/member/query", 
 				params:function(){
 					var subnav = widget.get("subnav");
 					return { 
 						"memberSigning.room.building.pkBuilding":subnav.getValue("building"),
 						specialTreatment:subnav.getValue("specialTreatment"),
 						"personalInfo.otherParty":subnav.getValue("OtherParty"),
 						fetchProperties:"status," +
 						"specialTreatment," +
 						"personalInfo.name," +
 						"personalInfo.birthday," +
 						"personalInfo.otherParty," +
 						"personalInfo.mobilePhone," +
 						"personalInfo.idType," +
 						"personalInfo.idNumber," +
 						"memberSigning.room.number,",
					}; 
				},
 				model:{
 					columns:cols
 				}
    		 });
    		 this.set("grid",grid);
    		 //打印
    		 var printgrid=new Grid({
     			parentNode:".J-grid-print",
     			autoRender:false,
  				model:{
  					isInitPageBar:false,
  					columns:cols
  				}
     		 });
     		 this.set("printgrid",printgrid);
    	 },
	});
	module.exports = MemberOtherpartyAndRetirementDetails;
});
