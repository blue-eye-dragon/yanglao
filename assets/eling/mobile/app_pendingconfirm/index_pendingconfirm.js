define(function(require,exports,module){
	
	var Backbone = require("backbone");
	
	var Action = require("eling/mobile/app_pendingconfirm/model_action");
	var ActionSize = require("eling/mobile/app_pendingconfirm/model_actionsize");
	var actionTPL = require("text!eling/mobile/app_pendingconfirm/view_list_item.html");
	
	require("moment");
	
	//视图基类
	var ELMView = require("elmview");
	
	var result=true;
	
	var loading=false;
	
//	var firstResult=Dom7('.J-detail-container .J-detail').length;
	
	var app = new ELMView({
		id : "app_pendingconfirm",
		model : {
			action : new Action.Collection(),
	        actionsize : new ActionSize.Model()
		},
		listener : {
			"add action" : "render_action",
		},
		setup : function(widget){
			this.render("view_list.html",{length : 0});
		},
		initComponent : function(widget){
		
			Dom7('.infinite-scroll').on('infinite', function(){
				if(loading) return;
				loading=true;
				if(result){
					widget.getActions(Dom7('.J-detail-container .J-detail').length);
				}else{
					Dom7('.infinite-scroll-preloader').remove();
				}
				
			});
		},
		afterInitComponent : function(widget){
			this.getActions(0);
			this.getSize();
		},
		
		/******************服务器交互********************* */
		//@test
		getActions : function(firstResult){
			this.model.action.fetch({
				data : {
					"typeIn":"CheckOutRoomConfirm,Repair,CheckOutRoomRepairConfirm",
					fetchProperties:"title,type.value,date",
					maxResults : 15,
					firstResult : firstResult
				},
				success : function(data){
					loading=false;
					if(data.length==15){
						result=true;
					}else{
						result=false;
					}
				}
			});
		},
		getSize : function(){
			this.model.actionsize.fetch({
				data : {
					"typeIn":"CheckOutRoomConfirm,Repair,CheckOutRoomRepairConfirm",
					fetchProperties:"count",
				},
				success : function(data){
					$('.navbar .center').text("待确认列表("+data.id+")")
				}
			});
		},
		
		/******************视图********************* */
		render_action : function(model){
			Dom7(".J-detail-container").append(Template7.compile(actionTPL)(model.toJSON()));
		}
	});
	
	return app;
});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

//			var firstResult= $$('.page-content .J-detail').length;
//	
//		  var datas = this.viewModels.list.toJSON();
//		 
//		  if (datas.length < maxResults) {
//		      // 加载完毕，则注销无限加载事件，以防不必要的加载
//		      f7.detachInfiniteScroll($$('.infinite-scroll'));
//		      // 删除加载提示符
//		      $$('.infinite-scroll-preloader').remove();
//		      return;
//		  }
//		 
//		    // 生成新条目的HTML
//		    var html = '';
//		    for (var i =0; i <=datas.length; i++) {
//		      html += '<div class="card approval-card J-detail">'
//		    	     +'<div class="card-header">'
//		   		     +'<div class="approval-name">'+datas[i].type.value+'</div>'
//		   		     +'<div class="approval-date">'+datas[i].date+'</div>'
//		   		     +'</div>'
//		   		     +'<div class="card-content">'
//		   		     +'<div class="card-content-inner">'+datas[i].title+'</div>'
//		   		     +'</div>'
//		   		     +'</div>';
//		    }
//		 
//		    // 添加新条目
//		    $$('.page-content').append(html);
//		 
//		    // 更新最后加载的序号
//		    firstResult = $$('.page-content .J-detail').length;
//		  }, 1000);
//	});          
