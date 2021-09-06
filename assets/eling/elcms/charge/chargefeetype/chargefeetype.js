/**
*收费项目设置
*elview
*/
define(function(require,exports,module){
	var ELView = require("elview");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var aw = require("ajaxwrapper");
	var Form = require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
	//多语
	var i18ns = require("i18n");
	var template="<div class='el-chargefeetype'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-Grid'></div>"+
	"<div class='J-Form hidden'></div>"+
	"</div>";
	var chargefeetype = ELView.extend({
		attrs:{
			template:template
		},
		initComponent:function(params,widget){
			var subnav = new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"收费项目设置",
					search:function(str){
						var g = widget.get("grid");
						g.loading();
						aw.ajax({
  						url:"api/chargefeetype/search",
							data:{
								s:str,
								properties:"name,catalog",
								fetchProperties:"*,",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
					buttonGroup:[{
						id:"catalog",
						showAll:true,
						showAllFirst:true,
						url:"api/enum/com.eling.elcms.charge.model.ChargeFeeType.Catalog",
						handler:function(){
							widget.get("grid").refresh();
						}
					}],
					buttons:[{
        				id:"add",
        				text:"新增",
						show:true,
						handler:function(){
							widget.get("form").reset();
							widget.show(".J-Form").hide([".J-Grid"]);
							widget.get("subnav").hide(["search","add","catalog"]).show(["return"]);
						}
        			},{
        				id:"return",
        				text:"返回",
        				show:false,
        				handler:function(){
        					widget.show(".J-Grid").hide([".J-Form"]);
							widget.get("subnav").hide(["return"]).show(["search","add","catalog"]);
        				}
        			}]
				},
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-Grid",
				url:"api/chargefeetype/query",
				params:function(){
					return {
						"catalog":widget.get("subnav").getValue("catalog"), 
						fetchProperties:"*,",
					}
				},
				model:{
					columns:[{
						key:"catalog.value",
						name:"项目大类",
					},{
						key:"number",
						name:"序号",
					},{
						key:"name",
						name:"项目名称",
					},{
						key:"price",
						name:i18ns.get("sale_ship_owner","会员")+"单价",
					},{
						key:"apartmentPrice",
						name:"公寓单价",
					},{
						key:"valuationUnit.value",
						name:"计价单位",
					},{
						key:"meterReading",
						name:"是否抄表",
						format:function(value,row){
							if(row.meterReading){
								return "是";
							}else{
								return "否";
							}
						}
					},{
						key:"",
						name:"操作",
						format:function(row,value){
							return "button";
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.show(".J-Form").hide([".J-Grid"]);
								widget.get("subnav").hide(["search","add","catalog"]).show(["return"]);
								widget.get("form").reset();
								widget.get("form").setData(data);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/chargefeetype/" + data.pkChargeFeeType + "/delete",function(){
		 	 						widget.get("grid").refresh();
		 	 					});
							}	
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var form = new Form({
				parentNode:".J-Form",
				saveaction:function(){
					aw.saveOrUpdate("api/chargefeetype/save",$("#chargefeetype").serialize(),function(data){
						var datas = widget.get("form").getData();
						if(data.msg == "同一个项目大类下项目名称不能重复"){
							Dialog.alert({
								content:"同一个项目大类下项目名称不能重复"
							});
							return {
								forward:false
							};
						}
						else{
							widget.get("grid").refresh();
							widget.show(".J-Grid").hide([".J-Form"]);
							widget.get("subnav").hide(["return"]).show(["search","add","catalog"]);
						}
					});
					
				},
				cancelaction:function(){
  					widget.show(".J-Grid").hide(".J-Form");
					widget.get("subnav").hide(["return"]).show(["search","add","catalog"]);
  				},
  				model:{
  					id:"chargefeetype",
  					items:[{
  						name:"pkChargeFeeType",
  						type:"hidden",
  					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"catalog",
						label:"项目大类",
						url:"api/enum/com.eling.elcms.charge.model.ChargeFeeType.Catalog",
						type:"select",
						validate:["required"]
					},{
						name:"number",
						label:"序号",
						validate:["required"]
					},{
						name:"name",
						label:"项目名称",
						validate:["required"]
					},{
						name:"price",
						label:i18ns.get("sale_ship_owner","会员")+"单价",
					},{
						name:"apartmentPrice",
						label:"公寓单价",
					},{
						name:"valuationUnit",
						label:"计价单位",
						type:"select",
						options:[{
							key:"YuanPerCubicMeter",
							value:"元/立方米"
						},{
							key:"YuanPerKilowattHour",
							value:"元/度"
						},{
							key:"YuanPerMonth",
							value:"元/月"
						}],
						validate:["required"]
					},{
						name:"meterReading",
						label:"是否抄表",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}],
						validate:["required"]
					}]
  				}
			});
			this.set("form",form);
		},
	});
	module.exports = chargefeetype;
});
