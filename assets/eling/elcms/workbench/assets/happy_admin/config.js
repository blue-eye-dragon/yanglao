define(function(require,exports,module){
	var i18ns = require("i18n");
	module.exports = {
			title : "快乐管理工作台",
		isSearch : true,
		top : [
				{
					id : "apartmentstatus",
					color : "purple",
					icon : "icon-building",
					text : "入住全景",
					url : "eling/elcms/community/apartment/status/status"
				},
				{
					id : "apartmentstatus",
					color : "blue",
					icon : "icon-gift",
					text : i18ns.get("sale_ship_owner","会员")+"生日",
					url : "eling/elcms/reports/birthday/birthday"
				},
				{
					id : "activitysignup",
					color : "red",
					icon : "icon-refresh",
					text : "活动发布",
					url : "eling/elcms/happiness/activity/activity",
					params : '{"activityType":"happiness"}'
				},
				{
					id : "activitysignup",
					color : "orange",
					icon : "icon-refresh",
					text : "活动报名",
					url : "eling/elcms/happiness/activitysignup/activitysignup"
				},
				{
					id : "activiescount",
					color : "green",
					icon : "icon-smile",
					text : "活动统计",
					url : "eling/elcms/reports/activitystatistics/activitystatistics"
				},
				{
					id : "activitysignup",
					color : "purple",
					icon : "icon-refresh",
					text : "活动室",
					url : "eling/elcms/happiness/activityroom/statusoverview/statusoverview"
				}, {
					id : "apartmentstatus",
					color : "blue",
					icon : "icon-gift",
					text : "公告发布",
					url : "eling/elcms/community/announcement/newannouncement"
				}, {
					id : "lifeDailyRecord",
					color : "orange",
					icon : "icon-bell-alt",
					text : "公告审核",
					url : "eling/elcms/community/announcement/newannounceedit"
				}, {
					id:"lifemodelmember",
					color:"green",
					icon:"icon-building",
					text:"生活模型",
					url:"eling/elcms/lifemodelmember/lifemodelmember/lifemodelmember"
				} ]
}
});
