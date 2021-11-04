define(["eling","backbone","hbars!./modules/report/died/list",
        "hbars!./modules/report/died/list_item",
        "hbars!./modules/report/died/detail"],
	function(eling,Backbone,tplList,tplMonth,tplDetail){
	
	var hasNext, start, end;
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkDeceasedMemberRegistration"
	});
	
	var Collection = Backbone.Collection.extend({
		model : Model,
		url : "api/deceasedmemberregistration/query",
		parse : function(datas){
			var results = [] , i=0 , map = {};
			
			var year = start.format("YYYY");
			var months = [year+"-01",year+"-02",year+"-03",year+"-04",year+"-05",year+"-06",
			              year+"-07",year+"-08",year+"-09",year+"-10",year+"-11",year+"-12"];
			for(i=0;i<12;i++){
				map[months[i]] = {
					id : i,
					month : months[i],
					male : 0,
					female : 0,
					details : []
				};
			}
			
			for(var i=0;i<datas.length;i++){
				var month = moment(datas[i].deceasedDate).format("YYYY-MM");
				
				datas[i].member.personalInfo.sex.key == "MALE" ? map[month].male++ : map[month].female++;
				datas[i].dateStr = moment(datas[i].deceasedDate).format("YYYY-MM-DD");
				datas[i].age = moment().diff(datas[i].member.personalInfo.birthday,"years");
				
				map[month].details.push(datas[i]);
			}
			
			for(var j in map){
				results.push(map[j]);
			}
			
			return results;
		},
		load : function(){
			eling.loading(true);
			this.fetch({
				data : {
					deceasedDate : start.valueOf(),
					deceasedDateEnd : end.valueOf(),
					orderString:"deceasedDate",
					fetchProperties : "member.personalInfo.sex,member.personalInfo.name," +
							"member.memberSigning.room.number,deceasedDate,member.personalInfo.birthday"
				},
				success : function(){
					eling.loading(false);
				}
			});
		}
	});
	
	var View = Backbone.View.extend({
		el : "body",
		events : {
			"tap .J-prev" : function(){
				start.subtract("year",1);
				end.subtract("year",1);
				location.replace("#dead/query/"+(++hasNext));
			},
			"tap .J-next" : function(){
				start.add("year",1);
				end.add("year",1);
				location.replace("#dead/query/"+(--hasNext));
			}
		},
		list : function(){
			this.$el.html(tplList({
				date : start.format("YYYY"),
				hasNext : hasNext
			}));
		},
		renderListItem : function(model){
			$("ul").append(tplMonth(model.toJSON()));
		},
		detail : function(model){
			this.$el.html(tplDetail(model));
		}
	});
	
	var Router = Backbone.Router.extend({
		routes : {
			"dead/list" : "list",
			"dead/detail/:index" : "detail",
			"dead/query/:index" : "query"
		},
		list : function(){
			//0.初始化条件
			hasNext = 0;
			start = moment().startOf("year");
			end = moment().endOf("year");
			
			//1.初始化视图
			this.view = new View();
			this.view.list();
			
			//2.初始化模型
			this.collection = new Collection();
			this.collection.on("add",this.view.renderListItem,this.view);
			
			//3.模型和视图关联
			this.view.collection = this.collection;
			
			//4.加载数据
			this.collection.load();
		},
		detail : function(index){
			var data = this.collection.at(index).toJSON();
			var details = data.details;
			this.view.detail(data);
		},
		query : function(index){
			this.view.list();
			this.collection.load();
		}
	});
	
	return Router;
	
});
