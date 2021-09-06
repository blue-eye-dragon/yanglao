	define(function(require, exports, module) {
	var ELView=require("elview");
	var tpl=require("./healthdatacollection.tpl");
	var Subnav=require("subnav-1.0.0");
	var utils=require("./healthdatacollection_utils");
	var store=require("store");
	
	require("./healthdatacollection.css");
	
	var HealthDataCollection=ELView.extend({
		attrs:{
			template:tpl
		},
		events:{
			"click #J-cgpicture" : function(){
				var height=window.screen.height-100;
				$(".J-bigPic").attr("src",$("#J-cgpicture").attr("src"));
				$(".J-bigPic-wrapper").removeClass("hidden");
			},
			"click .J-bigPic" : function(){
				$(".J-bigPic").parent().addClass("hidden");
			}
		},
		initComponent:function(params,widget){
			var buildings=store.get("user").buildings || [];
			var result=[];
			for(var i=0;i<buildings.length;i++){
				if(buildings[i].useType.key=="Apartment" || buildings[i].useType.key=="Demo"){
					result.push(buildings[i]);
				}
			}
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"健康数据总览",
					buttons:[{
						id:"fullscreen"
					},{
						id:"returnfullscreen"
					}],
					buttonGroup:[{
						id:"buildings",
						key:"pkBuilding",
						value:"name",
						items:result,
						handler:function(key,element){
							widget.get("subnav").load({
								id:"defaultMembers",
								params:{
									"memberSigning.room.building.pkBuilding":key,
									fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number",
								},
								callback:function(data){
									utils._drawHealthDataLine();
								}
							});
						}
					},{
						id:"defaultMembers",
						handler:function(key,element){
							utils._drawHealthDataLine();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			utils.setSubnav(subnav);
			//加载会员
			subnav.load({
				id:"defaultMembers",
				params:{
					"memberSigning.room.building.pkBuilding":subnav.getValue("buildings"),
					fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number",
				},
				callback:function(data){
					utils._drawHealthDataLine();
				}
			});
			
			var time=setInterval(utils._drawHealthDataLine, 5000);
			this.set("timer",time);
		},
		destroy:function(){
			window.clearInterval(this.get("timer"));
			HealthDataCollection.superclass.destroy.call(this,arguments);
		}
	});
	
	module.exports = HealthDataCollection;
});