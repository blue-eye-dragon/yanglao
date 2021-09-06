define(function(require,exports,module){
	var ELView = require("elview");
	
	var template = require("./location.tpl");
	var Backbone = require("backbone");
	var tplMember = require("./memberlist.tpl");
	var tplMemberDetail = require("./memberdetail.tpl");
	var Handlebars = require("handlebars");
	
	var aw = require("ajaxwrapper");
	var Dialog = require("dialog");
	
	var Subnav = require("subnav-1.0.0");
	
	require("./location.css");
	
	/*****会员列表*****/
	var Member = Backbone.Model.extend({
		idAttribute : "pkMember"
	});
	
	var MemberCollection = Backbone.Collection.extend({
		model : Member,
		load : function(params){
			params = $.extend(true,{
				status:"Normal",
				fetchProperties:"pkMember,personalInfo.pkPersonalInfo,personalInfo.name,memberSigning.room.number,personalInfo.phone," +
					"personalInfo.mobilePhone,status,locStatus"
			},params);
			this.fetch({
				url : "api/location/member",
				reset : true,
				data : params
			});
		},
		search : function(params){
			params = $.extend(true,{
				status:"Normal",
				fetchProperties:"pkMember,personalInfo.pkPersonalInfo,personalInfo.name,memberSigning.room.number,personalInfo.phone," +
					"personalInfo.mobilePhone,locStatus"
			},params);
			this.fetch({
				url : "api/location/member/search",
				reset : true,
				data : params
			});
		},
		parse : function(data){
			for (var i = 0; i < data.length; i++){
				data[i].isOut = false;
				data[i].danger = false;
				data[i].noCard = false;
				data[i].noData = false;
				if(data[i].locStatus.key == "Out"){
					data[i].isOut = true;
				}else if (data[i].locStatus.key == "Danger"){
					data[i].danger = true;
				}else if (data[i].locStatus.key == "NoCard"){
					data[i].noCard = true;
				}else if (data[i].locStatus.key == "NoData"){
					data[i].noData = true;
				}
			}
			return data;
		}
	});

	var MemberView = Backbone.View.extend({
		el : ".J-members",
		initialize : function(coordinate){
			this.collection = new MemberCollection();
			this.collection.on("reset",this.render,this);
			
			this.coordinate = coordinate;
		},
		render : function(){
			this.$el.html(Handlebars.compile(tplMember)(this.collection.toJSON()));
		},
		events : {
			"click .item" : function(e){
				$("li.item").removeClass("active");
				$(e.currentTarget).addClass("active");
				
 				this.coordinate.load($(e.currentTarget).attr("data-key"));
 				$(".J-member-locStatus").attr("data-key", $(e.currentTarget).attr("data-locStatus"));
 				
 				//隐藏选择会员模板
 				$(".el-location-queryPanel").addClass("hidden");
			}
		}
	});
	
	/*****坐标*****/
	var Coordinate = Backbone.Model.extend({
		url : "api/location/locate/member",
		defaults : {
			pkMember : null,
			size : {
				percent : null,
				leftMargin : null,
				rightMargin : null,
				topMargin : null,
				bottomMargin : null,
				imgWidth : null,
				imgHeight : null,
				iconWidth : 28.5781,
				iconHeight : 51
			},
			x : 0,
			y : 0
		},
		load : function(pkMember){
			this.trigger("load");
			Dialog.loading(true);
			this.fetch({
				data : {
					member : pkMember
				},
				success : function(){
					Dialog.loading(false);
				},
				error : function(){
					Dialog.loading(false);
				}
			});
		},
		parse : function(data){
			if(data.x == "-1" && data.y == "-1"){
				return null;
			}
			var size = this.get("size");
			
			size.leftMargin = data.x*size.percent-size.iconWidth*(1-size.percent)/2;
			size.topMargin = data.y*size.percent-size.iconHeight*(1-size.percent);
			size.imgWidth = $(".J-picture").width();
			size.imgHeight = $(".J-picture").height();
			size.rightMargin = size.imgWidth - size.leftMargin;
			size.bottomMargin = size.imgHeight - size.topMargin;
			
			this.set({
				size : size,
				x : data.x,
				y : data.y
			});
			this.trigger("change");
		}
	});
	
	var CoordinateView = Backbone.View.extend({
		el : ".icon-map-marker",
		initialize : function(){
			this.model = new Coordinate();
			this.model.on("change",this.change,this);
			this.model.on("load",this.hide,this);
		},
		change : function(){
			var size = this.model.get("size");
			$(".icon-map-marker").removeClass("hidden").css({
				"color" : $(".J-member-locStatus").attr("data-key") == "Normal" ? "red" :"grey",
				"left" : size.leftMargin+"px",
				"top" : size.topMargin+"px"
			});
		},
		hide : function(){
			$(".icon-map-marker").addClass("hidden");
		}
	});
	
	/*****轨迹*****/
	var TrailCollection = Backbone.Collection.extend({
		url : "api/location/trail/query",
		load : function(params){
			this.fetch({
				reset : true,
				data : params
			});
		}
	});
	
	var TrailView = Backbone.View.extend({
		el : ".J-member-trail",
		initialize : function(){
			this.collection = new TrailCollection();
			this.collection.on("reset",this.render,this);
		},
		render : function(){
			var ret = "";
			var datas = this.collection.toJSON();
			for(var i in datas){
				ret += "<h4 class='col-md-4 text-right'>"+
							moment(datas[i].positionUpdateTime).format("HH:mm")+
						"</h4>" +
						"<h4 class='col-md-8 text-left'>"+
							datas[i].coordinatesName+
						"</h4>";
			}
			this.$el.html(ret);
		},
		loading : function(){
			$(".J-member-trail").html($("<h4></h4>").addClass("text-center").text("正在查询会员轨迹……"));
		},
		load : function(params){
			this.loading();
			this.collection.load(params);
		}
	});
	
	
	var Loacation = ELView.extend({
		attrs : {
			template : template,
			model : {
				date : moment().format("YYYY-MM-DD"),
				hasNext : 0
			}
		},
		events : {
			"mouseover .icon-map-marker" : function(e){
				var coordinate = this.get("coordinateView").model;
				
				var pkMember = $(".item.active").attr("data-key");
				
				if(coordinate.get("pkMember") != pkMember){
					var member = this.get("memberView").collection.get(pkMember).toJSON();
					$(".J-personalInfo").html(Handlebars.compile(tplMemberDetail)(member));
					$(".J-member-img").attr("src","api/attachment/personalphoto/"+member.personalInfo.pkPersonalInfo);
					
					//绘制轨迹
					this.get("trailView").load(this._getTrailParams());
					
					coordinate.set("pkMember",pkMember);
				}
				
				var size = coordinate.get("size");
				$(".J-member-detail,.tipContainer").removeClass("hidden").css({
					"left" : (size.rightMargin < 280 ? size.leftMargin-280 : size.leftMargin)+"px",
					"top" : (size.bottomMargin < 350 ? size.topMargin-350+25 : size.topMargin-25)+"px"
				});
			},
			"mouseover .J-picture" : function(e){
				$(".el-location-queryPanel").addClass("hidden");
			},
			"mouseleave .J-picture" : function(e){
				$(".J-member-detail,.tipContainer").addClass("hidden");
			},
			"click .J-prev" : function(){
				var model = this.get("model");
				model.date = moment($(".J-trail-date").text()).subtract("days",1).format("YYYY-MM-DD");
				model.hasNext += 1;
				this.renderPartial(".J-member-trail-date");
				
				this.get("trailView").load(this._getTrailParams());
			},
			"click .J-next" : function(){
				var model = this.get("model");
				model.date = moment($(".J-trail-date").text()).add("days",1).format("YYYY-MM-DD");
				model.hasNext -= 1;
				this.renderPartial(".J-member-trail-date");
				
				this.get("trailView").load(this._getTrailParams());
			},
			"mouseover .J-right-sidebar-container" : function(e){
				$(".el-location-queryPanel").removeClass("hidden");
			}
		},
		initComponent : function(params,widget){
			var subnav = new Subnav({
				parentNode : ".J-subnav",
				model : {
					search : {
						id : "searchmember",
						placeholder : "房间号/姓名",
						handler : function(str){
							widget.get("memberView").collection.search({
								properties:"personalInfo.name,memberSigning.room.number",
								s : str
							});
						}
					},
					buttonGroup : [{
						id : "building",
						handler : function(key,element){
							widget.get("memberView").collection.load({
								"memberSigning.room.building" : key
							});
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var coordinateView = new CoordinateView();
			this.set("coordinateView",coordinateView);
			
			var memberView = new MemberView(coordinateView.model);
			memberView.collection.load({
				"memberSigning.room.building" : subnav.getValue("building")
			});
			this.set("memberView",memberView);
			
			var trailView = new TrailView();
			this.set("trailView",trailView);
		},
		afterInitComponent : function(params,widget){
			$("body").addClass("main-nav-closed").removeClass("main-nav-opened");
			$(".J-picture").load(function(){
				widget.resize();
			});
			$(window).resize(function(){
				widget.resize();
			});
			$(".J-picture").attr("src","api/location/map/overall");
		},
		resize : function(){
			var coordinate = this.get("coordinateView").model;
			var img = $(".J-picture");
			var size = coordinate.get("size");
			//1.计算屏幕的宽度和高度，以及图片的宽度和高度
			var clientWidth = x = document.documentElement.clientWidth-45;
			var clientHeight = y = document.documentElement.clientHeight-40;
			
			var picWidth = a = img[0].naturalWidth || img[0].width;
			var picHeight = b = img[0].naturalHeight || img[0].height;
			
			//2.取宽度和高度中较小的值作为基数算出缩小和扩大的比例
			var realWidth = ap = null;
			var realHeight = bp = null;
			
			if(x/y < a/b){
				realWidth = clientWidth;
				realHeight = picHeight*clientWidth/picWidth;
			}else{
				realWidth = picWidth*clientHeight/picHeight;
				realHeight = clientHeight;
			}
			size.percent = realWidth/picWidth;
			
			//3.重新计算属性
			
			
			//4.设置新宽度和高度
			img.css({width : realWidth+"px", height : realHeight+"px"}).removeClass("hidden");
			
			//5.设置grid的位置
//			$(".el-location-queryPanel").css({left : realWidth+"px",width : (clientWidth - realWidth - 15)+"px"}).removeClass("hidden");
			
			//6.设置ul的高度
//			$(".J-members").css({height : (clientHeight - 85)+"px"});
			
			//7.重新设置已有的坐标点
			var x = coordinate.get("x");
			var y = coordinate.get("y");
			
			size.leftMargin = x*size.percent-$(".icon-map-marker").width()*(1-size.percent)/2;
			size.topMargin = y*size.percent-$(".icon-map-marker").height()*(1-size.percent);
			$(".icon-map-marker").css({
				"color" : $(".J-member-locStatus").attr("data-key") == "Normal" ? "red" :"grey",
				"left" : size.leftMargin+"px",
				"top" :size.topMargin+"px"
			});
		},
		_getTrailParams : function(){
			var model = this.get("model");
			var date = $(".J-trail-date").text();
			return {
				pkMember : $(".item.active").attr("data-key"),
				start : moment(date).startOf("days").valueOf(),
				end: moment(date).endOf("days").valueOf()
			};
		},
		destroy : function(){
			$("body").removeClass("main-nav-closed").addClass("main-nav-opened");
			Loacation.superclass.destroy.call(this,arguments);
		}
	});
	
	module.exports = Loacation;
});
