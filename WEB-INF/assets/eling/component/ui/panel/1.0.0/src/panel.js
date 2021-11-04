define(function(require,exports,module){
	var UIComponent=require("uicomponent-2.0.0");
	var aw=require("ajaxwrapper");
	var handlebars=require("handlebars");
	require("./panel.css");
	var tools = require("tools");
	
	var Panel=UIComponent.extend({
		attrs:{
			template:require("./panel.tpl"),
			autoRender:true,
			model : {
				col:4
			}
		},
		_loadData:function(url,params){
			var that=this;
			var queryParams=params || this.get("params") || "";
			if(typeof queryParams === "function"){
				queryParams=queryParams();
			}
			var autoRender=this.get("autoRender");
			if(autoRender!=false){
				this.loading();
				aw.ajax({
					url:url,
					dataType:"json",
					type:"GET",
					data:queryParams,
					success:function(data){
						that.setData(data);
						that.element.find(".ajaxloader").remove();
					},
					error:function(data){
					}
				});
			}
		},
		refresh:function(params){
			this.set("autoRender",true);
			var url=this.get("url");
			this._loadData(url,params);
		},
		setup:function(){
			this.render();
			var url=this.get("url");
			if(url){
				this._loadData(url);
			}
		},
		setData:function(data){
			var model=this.get("model");
			model.data=data;
			var labelWidth=model.labelWidth;
			var valueWidth=model.valueWidth;
			var items=model.items || [];
			var col=model.col;
			for(var i=0;i<items.length;i++){
				var name=items[i].name;
				var value=tools._getValueWithPoint(name,data);
				var format=items[i].format;
				if(format){
					value=format(value,data);
				}
				items[i].value=value;
				if(i%col==0 && i!=0){
					items[i].n=true;
				}
				items[i].labelWidth=labelWidth+"%";
				items[i].valueWidth=valueWidth+"%";
				items[i].colWidth=(100/col-1)+"%";
			}
			this.renderPartial(".J-panel-content");
			this.loadPicture(data);
		},
		loadPicture:function(data){
			var img=this.get("model").img;
			if(img){
				this.$("img.J-panel-img").attr("src",img.url+(data[img.idAttribute] || "0"));
			}
		},
		loading:function(){
			this.element.find(".J-panel-content").html("<div class='ajaxloader'></div>");
			this.get("model").data=[];
		}
	});
	
	module.exports=Panel;
});