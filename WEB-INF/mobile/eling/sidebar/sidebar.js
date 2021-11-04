define(["store","backbone","hbars!./sidebar"],function(store,Backbone,tpl){
	var Sidebar = Backbone.View.extend({
		el:"body",
		initialize:function(options){
			this.options = options;
		},
		events:{
			"tap .J-sidebar-panel-item" : function(e){
				var that = this;
				//TODO hdz&lxc 响应时间太快导致在iphone上面会点击到底层元素，暂以此方法解决
				window.setTimeout(function(){
					//获取点击元素
					var el = $(e.target);
					if(!el.hasClass("J-sidebar-panel-item")){
						el = el.parents(".J-sidebar-panel-item");
					}
					if(el.hasClass("active")){
						return false;
					}
					//重新设置缓存
					var config = store.get("relatives");
					config.active = parseInt(el.attr("data-index"));
					store.set("relatives",config);
					//通过操作样式来实现切换
					$(".active.J-sidebar-panel-item").removeClass("active");
					el.addClass("active");
					
					//触发查询
					that.trigger("sidebar-member-change");
					that.hide();
				},300);
			},
			"tap .J-sidebar-reply" : function(e){
				this.hide();
			},
			"tap .J-showsidebar" : function(){
				this.show();
			}
		},
		show : function(){
			$(".el-mobile-sidebar").removeClass("hidden");
			$(".el-mobile-sidebar").animate({
				left:"0"
			},"slow");
		},
		hide : function(){
			$(".el-mobile-sidebar").animate({
				left:"-"+$("body").width()+"px"
			},"fast");
		},
		load:function(){
			var pkPersonalInfo = this.options.pkPersonalInfo;
			$.ajax({
				url:"api/member/queryRelatedMembers",
				async:false,
				data:{
					pkPersonalInfo : pkPersonalInfo,
					fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number,personalInfo.mobilePhone"
				},
				success:function(data){
					data[0].active = "active";
					store.set("relatives",{
						pkPersonalInfo : pkPersonalInfo,
						active : 0,
						relatives:data
					});
				}
			});
		},
		render:function(){
			this.$el.append(tpl({
				left:"-"+$("body").width()+"px",
				members:store.get("relatives").relatives
			}));
		},
		getMember:function(){
			var relativeConfig = store.get("relatives");
			return relativeConfig.relatives[relativeConfig.active];
		}
	});
	return Sidebar;
});