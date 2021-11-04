/**
 * 维修情况汇总表
 */
define(function(require, exports, module) {
	var ELView=require("elview"); 
	var Subnav=require("subnav-1.0.0");
	var Form=require("form-2.0.0")
	var ReportGrid=require("reportgrid");
	var store=require("store");
	var activeUser= store.get("user");
	var buildings=activeUser.buildings || [];
	
	var RepairSummary = ELView.extend({
		events:{
			"click .J-form-queryform-checklist-allbuidling":function(e){
    			var widget=this;
    			var form=widget.get("form");
    			var all =  form.getValue("allbuidling");
    			if(all[0]){
    				var pks = [];
    				for(var i =0 ;i < buildings.length;i++ ){
    					pks[i]=buildings[i].pkBuilding
    				}
    				form.setValue("pkBuildings",pks);
    			}else{
    				form.setValue("pkBuildings","");
    			}
			},
			"click .J-form-queryform-checklist-allClassifys":function(e){
    			var widget=this;
    			var form=widget.get("form");
    			
    			var all =  form.getValue("allClassifys");
    			if(all[0]){
    				var pks = [];
    				var seldata=form.getData("pkRepairClassifys") ;
    				for(var i =0 ;i < seldata.length;i++ ){
    					pks[i]=seldata[i].pkRepairClassify
    				}
    				form.setValue("pkRepairClassifys",pks);
    			}else{
    				form.setValue("pkRepairClassifys","");
    			}
			},
			
		},
		attrs:{
			template:"<div class='J-subnav'></div>"+
			"<div class='J-form'></div>"+
			"<div class='J-list'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"维修情况汇总表",
					buttons:[
//					{
//						id:"print",
//						text:"打印",
//						handler:function(){
//							
//						}
//					},
					{
						id:"toExcel",
						text:"导出",
						show:false,
						handler:function(){
							var form=widget.get("form");
							
							var pkRepairClassifys=form.getValue("pkRepairClassifys");
							
							var pkBuildings=form.getValue("pkBuildings");
							var  showAll =false;
							if(pkBuildings.length==0){
								showAll=true;
								for(var i =0 ;i < buildings.length;i++ ){
									pkBuildings[i]=buildings[i].pkBuilding
			    				}
							}
							var params="api/repairsummary/toExcel?start="+form.getValue("start")
							+"&end="+form.getValue("end")
							+"&pkRepairClassifys="+pkRepairClassifys
							+"&pkBuildings="+pkBuildings
							+"&showAll="+showAll;
							window.open(params);	
							return false;
						}
					}],
				}
			});
			this.set("subnav",subnav);
			
			var form = new Form({
				parentNode:".J-form",
				saveaction:function(){
					widget.get("subnav").show("toExcel");
					var form=widget.get("form");
					var pkBuildings=form.getValue("pkBuildings");
					var  showAll =false;
					if(pkBuildings.length==0){
						showAll=true;
						for(var i =0 ;i < buildings.length;i++ ){
							pkBuildings[i]=buildings[i].pkBuilding
	    				}
					}
					widget.get("grid").refresh({
						pkBuildings:pkBuildings,
						pkRepairClassifys:form.getValue("pkRepairClassifys"),
						start:form.getValue("start"),
						end:form.getValue("end"),
						showAll:showAll
					})
					
				},
        		cancelaction:function(){
        			widget.get("form").reset();
        		},
        		model:{
        			id:"queryform",
        			saveText:"确定",
        			items:[{
        				name:"pkBuildings",
						label:"楼宇",
						type:"select",
						options:buildings,
						key:"pkBuilding",
						value:"name",
						multi:true,
						className:{
							container:"col-md-8",
							label:"col-md-3",
							valueContainer:"col-md-8"
						}
        			},{
        				name:"allbuidling",
						label:"全部楼",
						type:"checklist",
						list:[{
        					key:true,
        				}],
						className:{
							container:"col-md-3",
							label:"col-md-4"
						},
        			},{
        				name:"pkRepairClassifys",
						label:"维修类别",
						type:"select",
						url:"api/repairclassify/query",
						key:"pkRepairClassify",
						value:"name",
						multi:true,
						className:{
							container:"col-md-8",
							label:"col-md-3",
							valueContainer:"col-md-8"
						},
						validate:["required"]
        			},{
        				name:"allClassifys",
						label:"全部类别",
						type:"checklist",
						list:[{
        					key:true,
        				}],
						className:{
							container:"col-md-3",
							label:"col-md-4"
						},
        			},{
        				name:"start",
						label:"开始日期",
						type:"date",
						defaultValue:moment().startOf("month").valueOf(),
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        				
        			},{
        				name:"end",
						label:"结束日期",
						type:"date",
						defaultValue:moment().endOf("month").valueOf(),
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			}
        			]
        			}
			})
			this.set("form",form);
			
			var grid=new ReportGrid({
				autoRender:false,
				parentNode:".J-list",
				url:"api/report/repairsummary",
				model:{
					datas : {
						id:"count"
					}
				}
			});
			this.set("grid",grid);
		}
	});
	module.exports = RepairSummary;
});