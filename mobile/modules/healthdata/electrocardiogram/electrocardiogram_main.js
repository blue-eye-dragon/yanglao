define(["eling","backbone","store",
        "hbars!./modules/healthdata/electrocardiogram/electrocardiogram"],
        function(eling,Backbone,store,tpl){
	
	var Model = Backbone.Model.extend({
		url : "api/device/ecgStruct/query",
		load : function(params){
			eling.loading(true);
			this.fetch({
				data : params,
				success : function(){
					eling.loading(false);
				}
			});
		},
		parse : function(data){
			if(data.length != 0){
				var last = data[data.length-1];
				if(last.isarrhythmia == "心律失常" || last.heartrate == "心率过慢" || last.heartrate == "心率过块"){
					last.description = "不正常";
				}else{
					last.description = "正常";
				}
				this.set(last);
			}
			this.trigger("change");
		}
	});
	
	var View = Backbone.View.extend({
		el : ".J-content",
		initialize : function(options){
			this.options = options;
			this.$el.off();
		},
    	events:{
			"tap .J-prev" : function(){
				location.replace("#"+this.options.pkPersonalInfo + "/electrocardiogram/query/" + (++this.options.hasNext));
			},
			"tap .J-next" : function(){
				location.replace("#"+this.options.pkPersonalInfo + "/electrocardiogram/query/" + (--this.options.hasNext));
			}
		},
		render : function(){
			var relativesConfig = store.get("relatives");
			this.$el.html(tpl({
				title : relativesConfig.relatives[relativesConfig.active].personalInfo.name,
				date :  moment().format("YYYY.MM.DD")
			}));
		},
		renderDate : function(){
			this.$el.find(".J-currentDate").html(this.model.get("date"));
			var nextBtn = this.$el.find(".J-next");
			this.options.hasNext ? nextBtn.removeClass("hidden") : nextBtn.addClass("hidden");
		},
		renderHeartrate: function(){
			var data = this.model.toJSON();
			this.$el.find(".J-isarrhythmia").html(data.isarrhythmia || "无心律信息");
		},
		renderIsarrhythmia : function(){
			var data = this.model.toJSON();
			this.$el.find(".J-heartrate").html(data.heartrate || "无心率信息");
		},
		renderDescription : function(){
			var data = this.model.toJSON();
			this.$el.find(".J-description").html(data.description || "无心电图信息");
		}
	});
	
	var Router = Backbone.Router.extend({
		routes : {
			":pkPersonalInfo/electrocardiogram/index/:pkHealthExamType" : "index",
			":pkPersonalInfo/electrocardiogram/query/:beforeDay" : "query"
		},
		index : function(pkPersonalInfo,pkHealthExamType){
			//初始化视图
			var view = new View({
				pkPersonalInfo : pkPersonalInfo,
				pkHealthExamType : pkHealthExamType,
				hasNext : 0
			});
			view.render();
			
			//初始化模型
			var model = new Model();
			model.on("change:date",view.renderDate,view);
			model.on("change:isarrhythmia",view.renderIsarrhythmia,view);
			model.on("change:heartrate",view.renderHeartrate,view);
			model.on("change:description",view.renderDescription,view);
			
			//视图模型关联
			view.model = model;
			
			//加载数据
			model.load(this._getQueryParams());
			
			this.model = model;
			this.type = pkHealthExamType;
		},
		query : function(pkPersonalInfo,beforeDay){
			try{
				this.model.set("date",moment().subtract(parseInt(beforeDay),"days").format("YYYY.MM.DD"));
				this.model.load(this._getQueryParams(beforeDay));
			}catch(e){
				this.navigate("#"+pkPersonalInfo, {trigger : true, replace : true});
			}
		},
		_getQueryParams : function(beforeDay){
			beforeDay = beforeDay === undefined ? 0 : parseInt(beforeDay);
			var relativesConfig = store.get("relatives");
			return {
				"member.pkMember" : relativesConfig.relatives[relativesConfig.active].pkMember,
			};
		}
	});
	
	return Router;
});
