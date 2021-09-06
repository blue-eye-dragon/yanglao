define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav=require("subnav-1.0.0");
	var Tab=require("tab");
	var Dialog = require("dialog-1.0.0");
	var MemHappReGrid=require("./assets/memHappReGrid");
	var MemHappReForm=require("./assets/memHappReForm");
	var HapActRepGrid=require("./assets/hapActRepGrid");
	var HapActRepForm=require("./assets/hapActRepForm");
	require("./assets/grid.css");
	//多语
	var i18ns = require("i18n");
	var happinessDailyRecord=ELView.extend({
		attrs:{
			template: "<div class='J-subnav'></div>"+
			"<div class='J-tab'></div>"+
			"<div class='J-main-date hidden'></div>"
		},
		events:{
			"change select.J-activity":function(e){
				var widget = this;
				var hapActRepForm = widget.get("hapActRepForm");
				var hapActRepGrid = widget.get("hapActRepGrid");
				var pk = hapActRepForm.getValue("activity");
				if(pk){
					var  datas =hapActRepGrid.getData();
					for ( var i in datas) {
						if(pk == datas[i].activity.pkActivity){
							Dialog.alert({
    							content:"该"+i18ns.get("sale_ship_owner","会员")+"已在"+datas[i].activity.theme+"活动完成报告，请重新选择活动！"
    						});
							hapActRepForm.setValue("activity","");
	         				return;
						}
					}
				}
			}
		},
		_initGrid:function(){
			this.get("memHappReGrid").refresh();
			this.get("hapActRepGrid").refresh();
		},
		getMember:function(){
			var params=this.get("params");
			if(params && params.pkMember){
				return params.pkMember;
			}else{
				return this.get("subnav").getValue("defaultMembers");
			}
		},
		initComponent:function(params,widget){
			var inParams=widget.get("params");
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"快乐日志",
					buttonGroup:[{
						id:"building",
						show:false,
						handler:function(key,element){
							widget.get("subnav").load({
								id:"defaultMembers",
								params:{
									"memberSigning.room.building":widget.get("subnav").getValue("building"),
									"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
									"memberSigning.status":"Normal",
									"memberSigning.houseingNotIn" : false,
									fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number,status"
								},
								callback:function(data){
									if(data.length > 0){
										widget._initGrid();
										widget.get("hapActRepForm").load("activity");
									}else{
										widget.get("memHappReGrid").setData([]);
										widget.get("hapActRepGrid").setData([]);
									}
								}
							});
						}
					},{
						id : "defaultMembers",
						handler : function(key, element) {
							widget._initGrid();
							widget.get("hapActRepForm").load("activity");
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var tab = new Tab({
				parentNode:".J-tab",
				model:{
					items:[{
						id:"memHappRe",
						title:"快乐记录"
					}
					,{
						id:"hapActRep",
						title:"快乐活动报告"
					}
					]
				}
			});
			
			//渲染页签1：快乐记录
			var memHappReForm=MemHappReForm.init(this,inParams);
			this.set("memHappReForm",memHappReForm);
			
			var memHappReGrid=MemHappReGrid.init(this,inParams);
			this.set("memHappReGrid",memHappReGrid);
			this.$("#memHappRe .el-form").addClass("hidden");
			
			

			//渲染页签2：快乐活动报告
			var hapActRepForm=HapActRepForm.init(this,inParams);
			this.set("hapActRepForm",hapActRepForm);
			
			var hapActRepGrid=HapActRepGrid.init(this,inParams);
			this.set("hapActRepGrid",hapActRepGrid);
			this.$("#hapActRep .el-profile").addClass("hidden");
			this.set("tab",tab);
		},
		afterInitComponent:function(params,widget){
			var subnav=this.get("subnav");
			if(params && params.name){
				subnav.setTitle("快乐日志："+params.name);
				$(".J-main-date").attr("data-key", params.date);
				this._initGrid();
			}else{
				subnav.show([0,1]);
				subnav.load({
					id:"defaultMembers",
					params:{
						"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized,Waitting",
						"memberSigning.status":"Normal",
						"memberSigning.houseingNotIn" : false,
						"memberSigning.room.building":widget.get("subnav").getValue("building"),
						fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number,status"
					},
					callback:function(data){
						if(data.length > 0){
							widget._initGrid();
							widget.get("hapActRepForm").load("activity");
						}
					}
				});
			}
		}
	});
	
	module.exports = happinessDailyRecord;
});