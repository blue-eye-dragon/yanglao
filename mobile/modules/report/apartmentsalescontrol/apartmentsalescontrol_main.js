define(["eling","backbone",
        "hbars!./modules/report/apartmentsalescontrol/apartmentsalescontrol",
        "hbars!./modules/report/apartmentsalescontrol/apartmentsalescontrol_item",
        "hbars!./modules/report/apartmentsalescontrol/building_item",
        "hbars!./modules/report/apartmentsalescontrol/roomtype_item"],
        function(eling,Backbone,tpl,tplItem,buildingItem,roomtypeItem){
	
	$(window).scroll(function(){
		var offsetHeight = $("body")[0].scrollHeight;
		var clientHieght = $(this).height();
		var scrollTop = $(this).scrollTop();
    	if (offsetHeight - clientHieght >= scrollTop - 5 && 
    			offsetHeight - clientHieght <= scrollTop + 5 && $(".el-mobile-report-apartmentsalescontrol .J-sidebar").hasClass("hidden")) {
    		firstResult += 10;
    		location.replace("#apartmentsalescontrol/query/"+new Date().getTime()+"/false");
    	}
	});
	
	var buildings = [], roomtypes = [];
	var status = [{key:"Empty",value:"空房"},{key:"OutRoomMaintenance",value:"退房"}];
	
	var params = {};
	var firstResult = 0;
	
	var Model = Backbone.Model.extend({
		idAttribute : "pkRoom"
	});
	
	var Collection = Backbone.Collection.extend({
		model : Model,
		url : "api/room/query",
		load : function(){
			var urlParams = "";
			for(var i in params){
				if(typeof params[i] === "object" && params[i].constructor === Array){
					var array = params[i];
					for(var j=0;j<array.length;j++){
						urlParams += (i + "=" + array[j]) + "&";
					}
				}else{
					urlParams += (i + "=" + params[i]) + "&";
				}
			}
			eling.loading(true);
			this.fetch({
				data : urlParams.substring(0,urlParams.length-1),
				success : function(){
					eling.loading(false);
				}
			});
		}
	});
	
	var View = Backbone.View.extend({
		el : "body",
		render : function(){
			this.$el.html(tpl({
				status : status
			}));
		},
		renderItem : function(model){
			$(".list-group").append(tplItem(model.toJSON()));
		},
		renderBuildings : function(data){
			var html = "";
			buildings = data;
			var result = data;
			for(var i=0;i<result.length;i++){
				html += buildingItem(result[i]);
			}
			$(".J-buildings").html(html);
		},
		renderRoomtypes : function(data){
			var html = "";
			roomtypes = data;
			var map ={"3" : [],"4" : [],"6" : [],"12" : []};
			for(var i=0;i<data.length;i++){
				if(data[i].name.indexOf("大套") != -1 || data[i].name.indexOf("中套") != -1 || data[i].name.indexOf("小套") != -1){
					if(data[i].name.length == 2){
						data[i].col = 3;
						map["3"].push(data[i]);
					}else if(data[i].name.length == 3 || data[i].name.length == 4){
						data[i].col = 4;
						map["4"].push(data[i]);
					}else if(4 < data[i].name.length && data[i].name.length < 8){
						data[i].col = 6;
						map["6"].push(data[i]);
					}else{
						data[i].col = 12;
						map["12"].push(data[i]);
					}
				}
			}
			for(var j in map){
				var datas = map[j];
				for(var k=0;k<datas.length;k++){
					html += roomtypeItem(datas[k]);
				}
			}
			$(".J-roomtype").html(html);
		},
		events : {
			"tap .J-search" : function(e){
				location.replace("#apartmentsalescontrol/search/"+$(".J-room-search").val());
			},
			"tap .J-condition" : function(e){
				var that = this;
				$(".header,.content").addClass("hidden");
				$(".J-sidebar").removeClass("hidden");
				
				if(buildings.length == 0){
					//加载楼宇
					$.ajax({
						url : "api/building/query",
						data : {
							useType : "Apartment"
						},
						dataType : "json",
						success : function(data){
							that.renderBuildings(data);
						}
					});
				}
				if(roomtypes.length == 0){
					$.ajax({
						url : "api/roomType/query",
						dataType : "json",
						success : function(data){
							that.renderRoomtypes(data);
						}
					});
				}
			},
			"tap .J-return-btn" : function(){
				location.replace("#apartmentsalescontrol/query/"+new Date().getTime()+"/true");
				firstResult = 0;
				$(".header,.content").removeClass("hidden");
				$(".J-sidebar").addClass("hidden");
			},
			"tap .J-condition-item" : function(e){
				$(e.target).toggleClass("active");
			}
		},
		reset : function(){
			$(".J-apartmentsalescontrol").empty();
		}
	});
	
	var Router = Backbone.Router.extend({
		routes : {
			"apartmentsalescontrol" : "index",
			"apartmentsalescontrol/search/:room" : "search",
			"apartmentsalescontrol/query/:ts/:reset" : "query"
		},
		index : function(){
			firstResult = 0;
			
			//1.初始化视图并且渲染视图
			this.view = new View();
			this.view.render();
			this.view.renderBuildings(buildings);
			this.view.renderRoomtypes(roomtypes);
			
			//2.初始化模型
			this.collection = new Collection();
			this.collection.on("add",this.view.renderItem,this.view);
			this.collection.on("reset",this.view.reset,this.view);
			
			//3.视图模型关联
			this.view.collection = this.collection;
			
			//4.加载数据
			params = {
				statusIn : ["Empty","OutRoomMaintenance"],
				useType : "Apartment",
				fetchProperties : "pkRoom,number,status",
				firstResult : firstResult,
				maxResults : 15
			};
			
			this.collection.load();
		},
		search : function(room){
			this.collection.reset();
			
			params = {
				number : room,
				fetchProperties : "pkRoom,number,status",
			}
			
			this.collection.load();
		},
		query : function(ts,reset){
			if(reset == "true"){
				this.collection.reset();
			}
			//组织查询条件
			//(1)楼
			var buildings = [];
			$(".J-buildings .J-condition-item.active").each(function(){
				buildings.push($(this).attr("data-key"));
			});
			//(2)状态
			var status = [];
			$(".J-status .J-condition-item.active").each(function(){
				status.push($(this).attr("data-key"));
			});
			//(3)房型
			var roomTypes = [];
			$(".J-roomtype .J-condition-item.active").each(function(){
				roomTypes.push($(this).attr("data-key"));
			});
			
			params = {
				useType : "Apartment",
				fetchProperties : "pkRoom,number,status",
				firstResult : firstResult,
				maxResults : 15,
				buildingIn : buildings,
				statusIn : status,
				typeIn : roomTypes
			}
			
			//查询
			this.collection.load();
		}
	});
	
	return Router;
});