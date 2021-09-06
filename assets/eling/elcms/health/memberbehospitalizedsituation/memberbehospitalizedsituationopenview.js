/**
 * 会员状态
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var Form=require("form-2.0.0")
	var Grid=require("grid-1.0.0");
	//多语
	var i18ns = require("i18n");
    var template="<div class='J-subnav'></div>"+
    		"<div class='J-grid' ></div>";
	var memberbehospitalizedsituationopenview = ELView.extend({
		attrs:{
			template:template 
		},
		initComponent : function(params,widget) { 
    		 var subnav=new Subnav({
    			 parentNode:".J-subnav",
    			 model:{
 					title:"住院"+i18ns.get("sale_ship_owner","会员"),
 					items:[{
						id:"building",
						type:"buttongroup",
						showAll:true,
						handler:function(key,element){
							widget.get("grid").refresh(); 
						}
					},{
 						 id:"status", 
 						 tip :i18ns.get("sale_ship_owner","会员")+"状态",
 						 type:"buttongroup",
					   	 items:[{
							key:"Nursing",
							value:"颐养" 	
						 },{
							key:"behospitalizedbsq",
							value:"住院(本社区医院)"
						 },{
							key:"behospitalizedwy",
							value:"住院(外院)" 
						 },{
							 key:"col",
							 value:"全部"
						 }],
						 handler:function(key,element){
							 widget.get("grid").refresh(); 
						 }
 					}], 
                 }
    		 });
    		 this.set("subnav",subnav);
    		 
    		 var grid=new Grid({
    			parentNode:".J-grid",
    			url :"api/memberstatus/query",
    			autoRender : false,
 				params:function(){
 					return { 
 						pkBuilding:widget.get("subnav").getValue("building"),
 						flag:widget.get("subnav").getValue("status")
					}; 
				},
 				model:{
 					columns:[{
 						key:"number",
 						name:"房间"
 					},{
 						key:"name",
 						name:i18ns.get("sale_ship_owner","会员")
 					},{
 						key:"sex",
 						name:"性别"
 					},{
 						key:"age",
 						name:"年龄",
 						format:"age"
 					},{
 						key:"status",
 						name:"状态"
 					},{
 						key:"hospital",
 						name:"住院医院"
 					},{
 						key:"hosRoomNumber",
 						name:"科室床位/颐养院房间号"
 					}]
 				}
    		 });
    		 this.set("grid",grid);
    	 },
		afterInitComponent:function(params,widget){
			if(params){
				widget.get("subnav").setValue("status",params.flag);
				widget.get("subnav").setValue("building",params.pkBuilding);
				widget.get("grid").refresh({
					pkBuilding:params.pkBuilding,
					flag:params.flag,
				});
				
			}
			
		}
	});
	module.exports = memberbehospitalizedsituationopenview;
});
