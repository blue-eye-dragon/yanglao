define(function(require,exports,module){
	
	var Backbone = require("backbone");
	
	var DepartmentView = require("eling/mobile/app_importtaskexecute/model_department");
	var ImportTaskExecutionView = require("eling/mobile/app_importtaskexecute/model_importtaskexecute");
	var ImportTaskExecutionNoView = require("eling/mobile/app_importtaskexecute/model_importtaskexecutenum");
	var StartWeek = require("eling/mobile/app_importtaskexecute/model_importtaskexecutestartweek");
	var importtaskexecuteTPL = require("text!eling/mobile/app_importtaskexecute/view_list_item.html");
	var departmentTPL = require("text!eling/mobile/app_importtaskexecute/view_list_department.html");
	
	
	//定义自定义模块
	
	//视图基类
	var ELMView = require("elmview");
	
	var $$ = Dom7;
	
	//framework7工具类
	var fw7 = require("f7");
	// 日期处理
	require("moment");
	
	var result=true;
	
	var loading=false;
	
	var start;
	
	var end;
	
	var week;
	
	var weekStart;
	
	var curDepartment;
	
	
	//利用Backbone.View进行视图扩展
	var ImportTaskExecute = new ELMView({
		id : "app_importtaskexecute",
		model : {
			department : new DepartmentView.Collection(),
			importtaskexecution : new ImportTaskExecutionView.Collection(),
			importtaskexecutionsize : new ImportTaskExecutionNoView.Model(),
			startweek : new StartWeek.Model()
		},
		listener : {
			"add importtaskexecution" : "render_importtaskexecution",
			"reset importtaskexecution" : "reset_importtaskexecution",
			"add department" : "render_department",
		},
		
		setup : function(widget){
			this.render("view_list.html",{title : "重点工作任务"});
		},
		
		initComponent : function(widget){
			
			var that = this;
			Dom7('.infinite-scroll').on('infinite', function(){
				if(loading) {
					return;
				}
				
				loading=true;
				
				if(result){
					var clickTime=that.myCalendar.value!=null?that.myCalendar.value[0]:null;
					widget.getImportTaskExecutionView(Dom7('.J-detail-container .J-detail').length,false,clickTime,curDepartment);
				}else{
					Dom7('.infinite-scroll-preloader').remove();
				}
				
			});
			this.myCalendar = this.app.calendar({
			    input: '#calendar-input',
			    value: [new Date()],
			    dayNamesShort:['日', '一', '二', '三', '四', '五', '六'],
			    monthNames:['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月' , '九月' , '十月', '十一月', '十二月'],
			    onDayClick : function(e,dayContainer, year, month, day){
			    	var mon=(Number(month)+1);
			    	var da=day;
			    	if((Number(month)+1)<10){
			    		mon="0"+(Number(month)+1);
			    	}
			    	if(parseInt(day)<10){
			    		da="0"+day;
			    	}
			    	var clickTime=new Date(year+"-"+(mon)+"-"+da).getTime();
			    	ImportTaskExecute.getImportTaskExecutionView(0,true,clickTime,curDepartment);
				    ImportTaskExecute.getSize(true,curDepartment);
			    }
			}); 
			
//			this.mySearchbar = this.app.searchbar('.searchbar', {
//			    searchList: '.list-block-search',
//			    searchIn: '.item-title',
//			    onSearch:function(s){
//			    	
//			    },
//			}); 
			
			$$('.pull-to-refresh-content').on('refresh',function(e){
		        // 下拉刷新
		        ImportTaskExecute.getImportTaskExecutionView(0,true,null,curDepartment);
		        ImportTaskExecute.getSize(true,curDepartment);
			});
		},
		
		afterInitComponent : function(widget){
			this.getStartWeek(null);
			this.getDepartment();
		},
		
		/******************服务器交互********************* */
		
		//@test
		getImportTaskExecutionView : function(firstResult,ifreset,clickTime,department){
			var that = this;
			if(clickTime){
				if((moment(clickTime).weekday() == 0 && weekStart!=0)||(moment(clickTime).weekday() < (weekStart)) ){//今天是周日
					start = moment(clickTime).weekday(weekStart-7);
					end = moment(clickTime).weekday(weekStart-1);
				}else{
					start=moment(clickTime).weekday(weekStart);
					end=moment(clickTime).weekday(weekStart+6);
				}
				week = moment(start).weeks();
			}
			this.model.importtaskexecution.fetch({
				reset : ifreset,
				data : {
					"user.department":department?department.id:"",
					"start":start.valueOf(),
					"end":end.valueOf(),
					fetchProperties:"pkWorkTaskPlan,no,work.content",
					maxResults : 15,
					firstResult : firstResult
				},
				success : function(data){
					loading=false;
					if(data.length==15){
						result=true;
					}else{
						result=false;
						Dom7('.infinite-scroll-preloader').remove();
					}
					
					that.app.pullToRefreshDone();
					that.myCalendar.close();
				} 
			});
		},
		getSize : function(ifreset,department){
			this.model.importtaskexecutionsize.fetch({
				reset : ifreset,
				data : {
					"user.department":department?department.id:"",
					"start":start.valueOf(),
					"end":end.valueOf(),
					fetchProperties:"num",
				},
				success : function(data){
					$('.navbar .center').text("重点工作任务("+data.id+")");
					var title = "";
					if(department){
						title += department.text;
					}
					title += end.format('YYYY')+"年第"+week+"周工作"+start.format('MM月DD日')+"~"+end.format('MM月DD日');
					$('.page-content .title').text(title);
				}
			});
		},
		getDepartment : function(){
			this.model.department.fetch({
				data : {
					fetchProperties:"pkDepartment,name",
				},
				success : function(data){
					var title = data;
				}
			});
		},
		getStartWeek : function(department){
			var that = this;
			this.model.startweek.fetch({
				data : {
					"code":"worktaskplan_weekstart",
					fetchProperties:"num",
				},
				success : function(data){
					if(data!=null){
						weekStart=data.id;
						var thisMonday;
						var thisSunday;
						var thisWeek;
						//计算本周日期范围
						if((moment().weekday() == 0 && weekStart!=0 )||(moment().weekday() < (weekStart))){
							thisMonday = moment().weekday(weekStart-7);
	    					thisSunday = moment().weekday(weekStart-1);
	    					thisWeek = moment().weeks()-1;
						}else{
							thisMonday=moment().weekday(weekStart);
	    					thisSunday=moment().weekday(weekStart+6);
	    					thisWeek = moment().weeks();
						}
						start=moment(thisMonday);
						end=moment(thisSunday);
						week=moment(start).weeks();
//						that.myCalendar.setValue(moment());
						var title=end.format('YYYY')+"年第"+week+"周工作"+start.format('MM月DD日')+"~"+end.format('MM月DD日');
						$('.page-content .title').text(title);
						ImportTaskExecute.getImportTaskExecutionView(0,false,moment().valueOf(),department);
					    ImportTaskExecute.getSize(false,department);
					}
				}
			});
		},
		
		/*************视图**************/
		render_importtaskexecution : function(model){
			Dom7(".J-detail-container").append(Template7.compile(importtaskexecuteTPL)(model.toJSON()));
		},
		render_department : function(model){
			Dom7(".J-department-container").append(Template7.compile(departmentTPL)(model.toJSON()));
		},
		
		reset_importtaskexecution : function(){
			Dom7(".J-detail-container").html("");
			
			var that = this;
			
			this.model.importtaskexecution.each(function(item){
				that.render_importtaskexecution(item);
			});

		},
		reset_department : function(){
			Dom7(".J-department-container").html("");
			
			var that = this;
			
			this.model.department.each(function(item){
				that.render_department(item);
			});

		},
		
		events : {
			"tap .open-picker" : function(){
				this.myCalendar.open();
			},
			"tap .depart-item" : function(e){
				curDepartment = $(e.target)[0];
				this.getImportTaskExecutionView(0,true,null,curDepartment);
				this.getSize(true,curDepartment);
			},
		}
	});
	
	return ImportTaskExecute;
});