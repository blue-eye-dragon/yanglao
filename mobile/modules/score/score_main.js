require(["../../requirejs/config"],function(){
	require(["$","backbone","hbars!modules/score/score","loading","moment"],function($,Backbone,tpl,Loading){
		Loading.start();
		
		var secretaries = {};
		var overall = {
				emptyStars : null,
				stars : null
		};
		
		var familyCom = {
				emptyStars : null,
				stars : null
		};
		
		//查专属秘书 
		$.ajax({
			url:"api/serviceevaluation/querySecretaryByPkPersonalInfo",
			data:{
				pkPersonalInfo : location.hash.substring(1),
			},
			dataType : "json",
			async : false,
			success : function(data){
				for(var i=0 ; i<data.length ; i++){
					var pkUser = data[i].pkUser;
					secretaries[pkUser] = {};
					secretaries[pkUser].secretary = {};
					secretaries[pkUser].score = {};
					secretaries[pkUser].secretary.name = data[i].name;
					secretaries[pkUser].secretary.pkUser = data[i].pkUser;
					secretaries[pkUser].score.emptyStars = new Array(5);
				}
			}
		});
		
		//类
		var Model = Backbone.Model.extend({
			//主键
			idAttribute : "pkServiceEvaluation",
			load : function(){
				this.fetch({
					url : "api/serviceevaluation/queryByPkPersonalInfo",
					data : {
						pkPersonalInfo : location.hash.substring(1)
					},
					success : function(data){
						Loading.end();
					}
				});
			},
			parse : function(data){
				//处理data
				var secretaryScores = [];
				//if(data.length == 0){
					overall.emptyStars = new Array(5);
					familyCom.emptyStars = new Array(5);
				//}
				
				for(var i = 0 ; i < data.length ; i ++){
					if(data[i].evaluateType.key == "Overall"){
						overall.stars = new Array(data[i].score);
						overall.emptyStars = new Array(5 - data[i].score);
					}else if(data[i].evaluateType.key == "FamilyCommunication"){
						familyCom.stars = new Array(data[i].score);
						familyCom.emptyStars = new Array(5 - data[i].score);
					}else if(data[i].evaluateType.key == "Secretary"){
						secretaryScores.push(data[i]);
					}
				}
				if(secretaryScores.length != 0){
					for(var i in secretaries){
						for(var j = 0 ; j < secretaryScores.length ; j++){
							if(i == secretaryScores[j].appraisee.pkUser){
								secretaries[i].score.stars = new Array(secretaryScores[j].score);
								secretaries[i].score.emptyStars = new Array(5 - secretaryScores[j].score);
							}
						}
					}
				}
				
			    return {
			    	overall: overall,
			    	family : familyCom,
			    	secretaries : secretaries
			    };
			}
		});
		
		
		
		var View = Backbone.View.extend({
			el : "body",
			//绑定事件
			events : {
				"tap .icon" : function(e){
					$(e.target).removeClass("icon-star-empty").addClass("icon-star");
					$(e.target).prevAll("i").removeClass("icon-star-empty").addClass("icon-star");
					$(e.target).nextAll("i").removeClass("icon-star").addClass("icon-star-empty");
					
					var evaluateType = null;
					var score = null;
					var appraisee = null;
					if($(e.target).hasClass("overall")){
						score = $(".overall.icon-star").length;
						evaluateType = "Overall";
	    			}else if($(e.target).hasClass("family-commu")){
	    				score = $(".family-commu.icon-star").length;
						evaluateType = "FamilyCommunication";
	    			}else{
	    				appraisee = $(e.target).parent("div").parent("div").children("h4").attr("data-key");
	    				score = $(e.target).parent("div").children(".icon-star").length;
	    				evaluateType = "Secretary";
	    			}
					$.ajax({
						url : "api/serviceevaluation/save",
						data:{
							"personalInfo" : location.hash.substring(1),
							"evaluateDate" : moment().valueOf(),
							"appraisee" : appraisee,
							"score" : score,
							"evaluateType" : evaluateType
						},
						dataType : "json",
						success : function(data){
							
						}
					});
				},
			},
			initialize : function(){
				this.model = new Model();
				this.model.on("change",this.render,this);
			},
			render : function(){
				var data = this.model.toJSON();
				/**
				 * var data = {
				 * 		name : 1,
				 * 		b : {
				 * 			c : 2,
				 * 			d : 3
				 * 		}
					}	
				 */
				this.$el.html(tpl(this.model.toJSON()));
			}
		});
		
		var view = new View();
		view.model.load();
		view.render();
		
	});
});