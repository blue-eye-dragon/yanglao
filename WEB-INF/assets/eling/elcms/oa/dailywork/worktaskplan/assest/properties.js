define(function(require,exports,module){
	var aw = require("ajaxwrapper");
	var store = require("store");
	var activeUser = store.get("user");
	var Properties={
		/*查询用户对应部门*/
		querydepartment : function(pk){
			aw.ajax({
				url:"api/department/query",
				data:{
					"pkDepartment":pk,
					fetchProperties:"pkDepartment,name"
				},
				dataType:"json",
				success:function(datas){
					$(".J-worktaskplan-department").text(datas[0].name);
				}
			});
		},
		/*查询当前用户是否存在上级领导*/
		queryleader : function(){
			aw.ajax({
				url:"api/worktaskplan/queryLeader",
				dataType:"json",
				success:function(datas){
					if(datas.length>0){
						$(".J-leader").text("true");
					}else{
						$(".J-leader").text("false");
					}
					
				}
			});
		},
		/*设置隐藏元素*/
		sethiddentime : function(start1,end1,week1,start2,end2,userpk){
			$(".J-weektimestart1").text(start1.format());
			$(".J-weektimeend1").text(end1.format());
			
			$(".J-weektimestart2").text(start2.format());
			$(".J-weektimeend2").text(end2.format());
			
			$(".J-userpk").text(userpk);
		},
		
		/*设置detilgrid的title*/
		setdetilgridtitle1 : function(m,start1,end1,title1,thisMonday,thisSunday){
			if(start1.isSame(thisMonday,'day')&&end1.isSame(thisSunday,'day')){
				$(".J-nextweek").addClass("hidden");
				m.get("griddetail1").setTitle("本周工作"+title1);
			}else if(start1.isAfter(thisMonday,'day')&&end1.isAfter(thisSunday,'day')){
				$(".J-nextweek").addClass("hidden");
				m.get("griddetail1").setTitle("未来工作"+title1);
			}else{
				$(".J-nextweek").removeClass("hidden");
				m.get("griddetail1").setTitle("历史工作"+title1);
			}
		},
		/*设置detilgrid的title*/
		setdetilgridtitle2 : function(m,start1,end1,title2,thisMonday,thisSunday,lastMonday,lastSunday){
			if(start1.isSame(lastMonday,'day')&&end1.isSame(lastSunday,'day')){
				m.get("griddetail2").setTitle("本周计划"+title2);
			}else if(start1.isSame(thisMonday,'day')&&end1.isSame(thisSunday,'day')){
				m.get("griddetail2").setTitle("下周计划"+title2);
			}else if(start1.isAfter(thisMonday,'day')&&end1.isAfter(thisSunday,'day')){
				m.get("griddetail2").setTitle("未来计划"+title2);
			}else{
				m.get("griddetail2").setTitle("历史计划"+title2);
			}
		},
		
		/*加载周报详情detilgrid*/
		loaddetilgrid1 : function(m,start1,end1,userpk,type){
			if(type=="edit"||type==""){
				m.get("griddetail1").refresh({
					"start":start1.valueOf(),
					"end":end1.valueOf(),
					"user.pkUser":userpk
			    },function(data){
					for(var i=0;i<data.length;i++){
						data[i].ggg = i+1;
					}
					m.get("griddetail1").setData(data);
					if(end1.isBefore(moment(),'day')){
						$(".J-edituser1").addClass("hidden");
						$(".J-delete1").addClass("hidden");
					}
			    });
			}else if(type=="detil"){
				m.get("griddetail1").refresh({
						"start":start1.valueOf(),
						"end":end1.valueOf(),
						"user.pkUser":userpk
				},function(data){
					for(var i=0;i<data.length;i++){
						data[i].ggg = i+1;
					}
					m.get("griddetail1").setData(data);
					$(".J-gridedit").addClass("hidden");
					$(".J-edituser1").addClass("hidden");
					$(".J-delete1").addClass("hidden");
				});
			}
			
		},
		/*加载周报详情detilgrid*/
		loaddetilgrid2 : function(m,start2,end2,userpk,type){
			if(type=="edit"||type==""){
				m.get("griddetail2").refresh({
					"start":start2.valueOf(),
					"end":end2.valueOf(),
					"user.pkUser":userpk
				},function(data){
					for(var i=0;i<data.length;i++){
						data[i].ggg = i+1;
					}
					m.get("griddetail2").setData(data);
					if(end2.isBefore(moment(),'day')){
						$(".J-edituser2").addClass("hidden");
						$(".J-delete2").addClass("hidden");
					}
				});
			}else if(type=="detil"){
				m.get("griddetail2").refresh({
						"start":start2.valueOf(),
						"end":end2.valueOf(),
						"user.pkUser":userpk
				},function(data){
					for(var i=0;i<data.length;i++){
						data[i].ggg = i+1;
					}
					m.get("griddetail2").setData(data);
					$(".J-edit2").addClass("hidden");
					$(".J-edituser2").addClass("hidden");
					$(".J-delete2").addClass("hidden");
				});
			}
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
			var userpk=widget.get("subnav").getValue("user");
			var edgeM;
			var edgeS;
			if(userpk==activeUser.pkUser){
				edgeM=thisMonday;//本人只能修该自己本周任务
				edgeS=thisSunday;
			}else{
				edgeM=lastMonday;
				edgeS=lastSunday;
			}
			
			this.sethiddentime(start1,end1,week1,start2,end2,userpk);
			
			var title1=end1.format('YYYY')+"年第"+week1+"周工作"+start1.format('MM月DD日')+"~"+end1.format('MM月DD日');
			var title2=end2.format('YYYY')+"年第"+week2+"周工作"+start2.format('MM月DD日')+"~"+end2.format('MM月DD日');
			this.setdetilgridtitle1(widget,start1,end1,title1,thisMonday,thisSunday);
			this.setdetilgridtitle2(widget,start1,end1,title2,thisMonday,thisSunday,lastMonday,lastSunday);
			
			if(start1.isBefore(thisMonday,'day')&&end1.isBefore(thisSunday,'day')){
				widget.get("griddetail1").hide(["detilgridadd1"]);
				widget.get("griddetail2").hide(["detilgridadd2"]);
				$(".J-nextweek").removeClass("hidden");
			}else{
				widget.get("griddetail1").show(["detilgridadd1"]);
				widget.get("griddetail2").show(["detilgridadd2"]);
			}
			//上一周本人不能修该
			if(start1.isBefore(edgeM,'day')&&end1.isBefore(edgeS,'day')){
				this.loaddetilgrid1(widget,start1,end1,userpk,"detil");
			}else{
				this.loaddetilgrid1(widget,start1,end1,userpk,"edit");
			}
			if(start2.isBefore(edgeM,'day')&&end2.isBefore(edgeS,'day')){
				this.loaddetilgrid2(widget,start2,end2,userpk,"detil");
			}else{
				this.loaddetilgrid2(widget,start2,end2,userpk,"edit");
			}
		}
		
	}
	module.exports=Properties;
});