define(function(require,exports,module){
	var ELView=require("elview");
	var template=require("./workbench.tpl");
	var Dashboard=require("dashboard");
	var Subnav=require("subnav-1.0.0");	
	var aw = require("ajaxwrapper");	
	var DashboardEngine = require("./dashboard_engine");
	
	var Dialog = require("dialog");
	
	var bottomConfig = {};
	
	var Workbench=ELView.extend({
		attrs:{
			id:"workbench",
			template:template
		},
		events : {
			"click .J-dashboard-bottom-item" : function(e){
				var el = $(e.target);
				if(!el.hasClass("J-dashboard-bottom-item")){
					el = el.parents(".J-dashboard-bottom-item");
				}
				var config = bottomConfig[el.attr("data-key")];
				var handler = config.handler;
				var params = typeof handler.params === "function" ? handler.params(this._getSubnavParams()) : handler.params;
				this.openView({
					url : handler.url,
					params : params,
					isAllowBack : true
				});
			}
		},
		_getSubnavParams : function(){
			var subnav = this.get("subnav");
			var subnavParams = {};
			var items = subnav.get("model").items || [];
			for(var j=0;j<items.length;j++){
				var id = items[j].id;
				subnavParams[id] = subnav.getValue(id);
			}
			return subnavParams;
		},
		_initSubnav : function(config,widget){
			var items = config.items || [];
			for(var j in items){
				(function(item){
					item.handler = function(){
						widget[item.business].call(widget);
					};
				})(items[j]);
				
			}
			
			var subnav = new Subnav({
				parentNode : ".J-subnav",
				model : config
			});
			this.set("subnav",subnav);
			
			return subnav;
		},
		_setSubnavParams : function(params){
			var subnav=this.get("subnav");
			var items = subnav.get("model").items || [];
			for(var i=0;i<items.length;i++){
				if(params && params[items[i].id] !== undefined){
					subnav.setValue(i, params[items[i].id]);
				}
			}
		},
		initComponent:function(params,widget){
			var type = params.type;
			require.async("./assets/"+type+"/config",function(Config){
				var config = DashboardEngine.resolve(Config,widget);
				widget.set("config",config);
				
				widget.set("subnav",widget._initSubnav(config.subnav,widget));
				//由于initComponent变成了一个异步操作，所以从其他节点返回工作台的时候,需要现根据参数设置导航条。
				widget._setSubnavParams(params);
				
				var dashboard=new Dashboard({
					parentNode:".J-dashboard",
					model:config.dashboard
				});
				widget.set("dashboard",dashboard);
				
				//加载dashboard底部数据
				widget.refreshWidgets();
			});
		},
		//当要跳转到其他页面后，需要保存的参数，以方便跳回时恢复页面状态
		setEpitaph:function(){
			return $.extend(true,this._getSubnavParams(),{type:this.get("params").type});
		},
		
		/*************************我是一条分界线********************************/
		//对外提供的接口
		refreshWidgets : function(){
			var dashboard = this.get("dashboard");
			
			//加载dashboard底部数据
			var widgets = this.get("config").widgets || [];
			var subnavParams = this._getSubnavParams();
			for(var i=0;i<widgets.length;i++){
				(function(widget){
					require.async(widget.path,function(option){
						option.id = widget.id;
						bottomConfig[widget.id] = option;
						
						dashboard.renderItem(option,"bottom");
						dashboard.loading(widget.id);
						
						var params = option.count.params ? option.count.params(subnavParams) : {};
						aw.ajax({
							url : option.count.url,
							dataType:"json",
							data : params,
							success : function(data){
								dashboard.setValue(option.id,data);
							}
						});
					});
				})(widgets[i]);
			}
		},
		searchMemberByRoomNameCardNO : function(){
			this.openView({
				url:"eling/elcms/membercenter/member/member",
				params:{
					search : this.get("subnav").getValue("searchMemberByRoomNameCardNO")
				},
				isAllowBack:true
			});
		},
		searchMemberByIdentify : function(){
			var that = this;
			aw.ajax({
				url : "api/member/query",
				data : {
					idNumber : this.get("subnav").getValue("searchMemberByIdentify"),
					fetchProperties:"pkMember,name,sex.*,birthday,phone,mobilePhone"
				},
				success : function(data){
					if(data.length == 0){
						Dialog.confirm({
							title : "提示",
							content : "没有搜索到该会员，是否新增会员？",
							confirm : function(){
								that.openView({
									url : "eling/elcms/health/memberinformation/memberinformation",
									params : {
										business : "addMember"
									},
									isAllowBack:true
								});
								Dialog.close();
							}
						});
					}else if(data.length == 1){
						that.openView({
							url:"eling/elcms/memberdetail/memberdetail_main",
							params:{
								member : data[0].pkMember
							},
							isAllowBack:true
						});
					}
					
				}
			});
		},
		searchMemberByIdentifyAndNumber : function(){
			var that = this;
			var obj={
					"status" : "Normal",
					fetchProperties:"pkMember,personalInfo.name,personalInfo.sex.*,personalInfo.birthday,personalInfo.phone,personalInfo.mobilePhone"
			};
			var str=this.get("subnav").getValue("searchMemberByIdentifyAndNumber");
			if(str && str.length == 8){
				obj["memberNumber"] = str;
			}else{
				obj["personalInfo.idNumber"] = str;				
			}
			aw.ajax({
				url : "api/memberpoint/queryserpointmember",
				data : obj,
				success : function(data){
					if(data.length == 0){
						Dialog.confirm({
							title : "提示",
							content : "没有搜索到该会员，是否新增会员？",
							confirm : function(){
								that.openView({
									url : "eling/elcms/healthinfo/memberinformation/memberinformation",
									params : {
										business : "addMember"
									},
									isAllowBack:true
								});
								Dialog.close();
							}
						});
					}else if(data.length == 1){
						that.openView({
							url:"eling/elcms/member/memberdetail/memberdetail_main",
							params:{
								member : data[0].pkMember
							},
							isAllowBack:true
						});
					}
					
				}
			});
		}
	});
	
	module.exports=Workbench;
});
