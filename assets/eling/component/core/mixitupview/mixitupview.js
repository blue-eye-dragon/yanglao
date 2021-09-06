define(function(require,exports,module){
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0"); 
	var aw=require("ajaxwrapper");
	require("mixitup");
	
	var MixitupView=ELView.extend({
		afterRender:function(){
			this._initSubnav();
		},
		_initSubnav:function(){
			var params=this.initSubnav(this) || {};
			var subnav=new Subnav(params);
			this.set("subnav",subnav);
		},
		
		_initMixitup:function(){
			var that=this;
			var container=that.element.find('.J-mixitup-content');
			if(container.mixItUp("isLoaded")){
				container.mixItUp("destroy",true);
			}
			that.element.find('.J-mixitup-content').mixItUp();
		},
		_loadData:function(params){
			var that=this;
			var queryParams=params || that.get("params");
			queryParams=$.extend(true,queryParams,{
				fetchProperties:this.get("fetchProperties")
			});
			aw.ajax({
				url:that.get("url"),
				data:queryParams,
				dataType:"json",
				success:function(data){
					that.setData(data);
					that._initMixitup();
				}
			});
		},
		//子类覆写
		initSubnav:function(){},
		
		//子类覆写
		setData:function(data){},
		
		refresh:function(params){
			this._loadData(params);
		}
	});
	
	module.exports=MixitupView;
});