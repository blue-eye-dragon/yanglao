define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var template=require("./application.tpl");
	
	//依赖的业务
	var subnav=require("./assets/app_subnav");
	var grid=require("./assets/app_grid");
	var subgrid=require("./assets/app_subgrid");
	var form=require("./assets/app_form");
	
	var Application = ELView.extend({
		attrs:{
			template:template
		},
		geneSelect:function(data){
			var ret = "";
			for(var i=0;i<data.length;i++){
				ret+="<option value='"+data[i].pkMedicine+"'>"+data[i].name+"</option>";
			}
			return ret;
		},
		events:{
			"change .J-form-pkBuyMedicineApplication-select-member" : function(e){
				var subgrid=this.get("subgrid");
				var form=this.get("form");
				var pkMember=form.getValue("member");
				if(pkMember){
					aw.ajax({
						url:"api/buymedicineapplication/query",
						data:{
							member:pkMember,
							flowStatusIn:"Temporary,Commited",
							fetchProperties:"*,items.quantity,items.medicine.*,buyMedicinePapers.papertype.pkPaperType"
						},
						success:function(data){
							if(data && data[0]){
								//设置subgrid
								var items=data[0].items;
								var subgridData=[];
								for(var i=0;i<items.length;i++){
									items[i].medicine.quantity=items[i].quantity;
									subgridData.push(items[i].medicine);
								}
								subgrid.setData(subgridData);
								//subgrid.disabledRow(null,[0,1]);
								
								//设置form
								var papers=[];
								var buyMedicinePapers=data[0].buyMedicinePapers || [];
								for(var j=0;j<buyMedicinePapers.length;j++){
									papers.push(buyMedicinePapers[j].papertype);
								}
								data[0].buymedicinepapers=papers;
								form.setData(data[0]);
							}else{
								subgrid.setData([]);
								form.reset();
								form.setValue("member",pkMember);
							}
						}
					});
				}else{
					subgrid.setData([]);
					form.reset();
				}
			}
		},
		initComponent:function(params,widget){
			this.set("subnav",subnav.init(this));
			this.set("grid",grid.init(this));
			this.set("subgrid",subgrid.init(this));
			this.set("form",form.init(this));
		}
	});
	module.exports = Application;
});