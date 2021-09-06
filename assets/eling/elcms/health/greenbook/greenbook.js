define(function(require,exports,module){
	var ELView=require("elview");
	var template=require("./greenbook.tpl");
	var handlebars=require("handlebars");
	
	handlebars.registerHelper("diseases",function(context,option){
		var diseases=context.diseases;
		var ret="";
		for(var i in diseases){
			ret+="<section>"+diseases[i].healthInstruction+"</section>";
		}
		return ret;
	});
	
	var Subnav=require("subnav-1.0.0");
	var Grid=require("grid-1.0.0");
	
	//业务
	var Outline=require("./assets/outline");
	var Questionnaire=require("./assets/questionnaire");
	var Sports=require("./assets/sports");
	var Knowledge=require("./assets/knowledge");
	var Nutrition=require("./assets/nutrition");
	var Disease=require("./assets/disease");
	
	require("./greenbook.css");
	
	var GreenBook=ELView.extend({
		attrs:{
			template:template,
			model:{
				outline:Outline.getData(),
				questionnaire:Questionnaire.getData(),
				sports:Sports.getData(),
				knowledge:Knowledge.getData()
			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"健康绿皮书",
					buttonGroup:[{
						id:"building",
						handler:function(key,el){
							widget.get("subnav").load({
								id : "defaultMembers",
								params : {
									"memberSigning.room.building" : key,
									fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number,personalInfo.sex,personalInfo.birthday",
								},
								callback : function(data) {
									Questionnaire.queryQuestionnaireanswer(data[0].pkMember);
									Disease.getData(data[0].pkMember,widget);
									Nutrition.setCalorieText(data[0]);
								}
							});
						}
					},{
						id : "defaultMembers",
						handler : function(key, element) {
							Questionnaire.queryQuestionnaireanswer(key);
							Disease.getData(key,widget);
							Nutrition.setCalorieText(subnav.getData("defaultMembers", key));
						}
					}],
					buttons:[{
						id:"print",
						text:"打印",
						handler:function(){
							$("title").text("亲和源老年公寓健康管理部");
							window.print();
							$("title").text("壹零后养老云平台");
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var healthguide_grid=new Grid({
				parentNode:".J-healthguide-grid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					columns:[{
						key:"symptom",
						name:"症状",
						className:"healthguide_symptom"
					},{
						key:"attention",
						name:"注意事项",
						className:"healthguide_attention"
					}]
				}
			});
			this.set("healthguide_grid",healthguide_grid);
			
			var calorie_grid=new Grid({
				parentNode:".J-calorie-grid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					columns:[{
						key:"type",
						name:"食物种类"
					},{
						key:"intake1",
						name:"摄入量（克/日）"
					},{
						key:"intake2",
						name:"摄入量（两/日）"
					}]
				}
			});
			this.set("calorie_grid",calorie_grid);
			
			var suggest_grid=new Grid({
				parentNode:".J-suggest-grid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					columns:[{
						key:"mealtime",
						name:"餐次"
					},{
						key:"foodtype",
						name:"食物种类"
					},{
						key:"content",
						name:"内容"
					}]
				}
			});
			this.set("suggest_grid",suggest_grid);
			
			var valley_grid=new Grid({
				parentNode:".J-exchange-valley-grid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					head:{
						title:"1、等值谷薯类交换表"
					},
					columns:[{
						key:"food1",
						name:"食品"
					},{
						key:"weight1",
						name:"重量（g）"
					},{
						key:"food2",
						name:"食品"
					},{
						key:"weight2",
						name:"重量（g）"
					}]
				}
			});
			this.set("valley_grid",valley_grid);
			
			var meat_grid=new Grid({
				parentNode:".J-exchange-meat-grid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					head:{
						title:"2、等值肉类蛋类食品交换表"
					},
					columns:[{
						key:"food1",
						name:"食品"
					},{
						key:"weight1",
						name:"重量（g）"
					},{
						key:"food2",
						name:"食品"
					},{
						key:"weight2",
						name:"重量（g）"
					}]
				}
			});
			this.set("meat_grid",meat_grid);
			
			var vegetable_grid=new Grid({
				parentNode:".J-exchange-vegetable-grid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					head:{
						title:"3、等值蔬菜类交换表"
					},
					columns:[{
						key:"food1",
						name:"食品"
					},{
						key:"weight1",
						name:"重量（g）"
					},{
						key:"food2",
						name:"食品"
					},{
						key:"weight2",
						name:"重量（g）"
					}]
				}
			});
			this.set("vegetable_grid",vegetable_grid);
			
			var sports_grid=new Grid({
				parentNode:".J-sportsguide-grid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					head:{
						title:"下列内容提供您注意参考"
					},
					columns:[{
						key:"allow",
						name:"可为事件"
					},{
						key:"abandon",
						name:"禁忌事件"
					}]
				}
			});
			this.set("sports_grid",sports_grid);
		},
		afterInitComponent:function(params,widget){
			widget.get("healthguide_grid").setData(Sports.getGridData());
			widget.get("calorie_grid").setData(Nutrition.getCalorie());
			widget.get("suggest_grid").setData(Nutrition.getSuggest());
			widget.get("valley_grid").setData(Nutrition.getValley());
			widget.get("meat_grid").setData(Nutrition.getMeat());
			widget.get("vegetable_grid").setData(Nutrition.getVegetable());
			widget.get("sports_grid").setData(Nutrition.getSports());
			
			var subnav=widget.get("subnav");
			subnav.load({
				id:"defaultMembers",
				params : {
					"memberSigning.room.building" : subnav.getValue("building"),
					fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number,personalInfo.sex,personalInfo.birthday",
				},
				callback:function(data){
					Questionnaire.queryQuestionnaireanswer(data[0].pkMember);
					Disease.getData(data[0].pkMember,widget);
					Nutrition.setCalorieText(data[0]);
				}
			});
		}
	});
	
	module.exports=GreenBook;
});