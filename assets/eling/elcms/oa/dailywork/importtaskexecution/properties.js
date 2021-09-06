define(function(require,exports,module){
	var aw = require("ajaxwrapper");
	var Properties={
		/*设置隐藏元素*/
		sethiddentime : function(start1,end1,week1,start2,end2){
			$(".J-weektimestart1").text(start1.format());
			$(".J-weektimeend1").text(end1.format());
			
			$(".J-weektimestart2").text(start2.format());
			$(".J-weektimeend2").text(end2.format());
			
		},
		
		/*设置detilgrid的title*/
		setdetilgridtitle1 : function(m,start1,end1,title1,thisMonday,thisSunday){
			if(start1.isSame(thisMonday,'day')&&end1.isSame(thisSunday,'day')){
				m.get("grid1").setTitle("本周工作"+title1);
			}else if(start1.isAfter(thisMonday,'day')&&end1.isAfter(thisSunday,'day')){
				m.get("grid1").setTitle(title1);
			}else{
				m.get("grid1").setTitle("历史工作"+title1);
			}
		},
		/*设置detilgrid的title*/
		setdetilgridtitle2 : function(m,start1,end1,title2,thisMonday,thisSunday,lastMonday,lastSunday){
			if(start1.isSame(thisMonday,'day')&&end1.isSame(thisSunday,'day')){
				m.get("grid2").setTitle("下周工作"+title2);
			}else if(start1.isAfter(thisMonday,'day')&&end1.isAfter(thisSunday,'day')){
				m.get("grid2").setTitle(title2);
			}else{
				m.get("grid2").setTitle("历史工作"+title2);
			}
		},
		
		/*加载周报详情detilgrid*/
		loaddetilgrid1 : function(m,start1,end1){
				m.get("grid1").refresh({
						"start":start1.valueOf(),
						"end":end1.valueOf(),
						"pkDepartment" : m.get("subnav").getValue("department"),
						"priority" : m.get("subnav").getValue("priority"),
				});
		},
		/*加载周报详情detilgrid*/
		loaddetilgrid2 : function(m,start2,end2){
			m.get("grid2").refresh({
					"start":start2.valueOf(),
					"end":end2.valueOf(),
					"pkDepartment" : m.get("subnav").getValue("department"),
					"priority" : m.get("subnav").getValue("priority"),
			});
		},
		/*加载周报详情detilgrid*/
		refreshdetilgrid : function(widget,thisMonday,thisSunday,lastMonday,lastSunday){
			var startWeekTime=widget.get("subnav").getValue("time").start;
			var endWeekTime=widget.get("subnav").getValue("time").end;
			var start1=moment(startWeekTime);
			var end1=moment(endWeekTime);
			var week1=moment(start1).weeks();
			
			var start2=moment(startWeekTime).add(7,'day');
			var end2=moment(endWeekTime).add(7,'day');
			var week2=moment(start2).weeks();
			
			this.sethiddentime(start1,end1,week1,start2,end2);
			
			var title1=end1.format('YYYY')+"年第"+week1+"周工作"+start1.format('MM月DD日')+"~"+end1.format('MM月DD日');
			var title2=end2.format('YYYY')+"年第"+week2+"周工作"+start2.format('MM月DD日')+"~"+end2.format('MM月DD日');
			this.setdetilgridtitle1(widget,start1,end1,title1,thisMonday,thisSunday);
			this.setdetilgridtitle2(widget,start1,end1,title2,thisMonday,thisSunday,lastMonday,lastSunday);
			
			//上一周本人不能修该
			this.loaddetilgrid1(widget,start1,end1);
			this.loaddetilgrid2(widget,start2,end2);
		}
		
	}
	module.exports=Properties;
});