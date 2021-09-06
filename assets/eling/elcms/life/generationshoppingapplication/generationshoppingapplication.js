define(function(require,exports,module){
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	
	//依赖的业务
	var subnav=require("./assets/geneshopapp_subnav");
	var grid=require("./assets/geneshopapp_grid");
	var subgrid=require("./assets/geneshopapp_subgrid");
	var history=require("./assets/geneshopapp_history");
	
	var template=require("./generationshoppingapplication.tpl");
	
	var GenerationShoppingApplication=ELView.extend({
		attrs:{
			template:template
		},
		initComponent:function(params){
			this.set("subnav",subnav.init(this));
			this.set("grid",grid.init(this));
			this.set("subgrid",subgrid.init(this));
			this.set("history",history.init(this));
		},
		
		afterInitComponent:function(params,widget){
			var subnav=this.get("subnav");
			subnav.load({
				id:"defaultMembers",
				params:{
					"memberSigning.room.building":widget.get("subnav").getValue("building"),
					fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
				}
			});
		}
	});
	
	module.exports = GenerationShoppingApplication;
});