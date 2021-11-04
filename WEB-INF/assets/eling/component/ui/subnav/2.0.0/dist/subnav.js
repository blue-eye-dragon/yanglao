define("eling/component/ui/subnav/2.0.0/dist/subnav",["eling/component/core/uicomponent/2.0.0/src/uicomponent","base","tools","handlebars","templatable","bootstrap","gallery/store/1.3.14/store-seajs","json","eling/component/utils/ajaxwrapper","dialog","store","gallery/handlebars/2.0.0/handlebars-seajs","eling/component/ui/button/1.0.0/dist/button","eling/component/ui/buttongroup/1.0.0/dist/buttongroup","eling/component/utils/tools/tools","eling/component/ui/date/1.0.0/dist/date","jquery/jquery-plugins/datetimepicker/jquery.datetimepicker","eling/component/ui/daterange/1.0.0/dist/daterange","bootstrap/bootstrap-plugins/daterangepicker/daterangepicker","eling/component/ui/text/1.0.0/dist/text","eling/component/ui/place/1.0.0/dist/place","eling/component/ui/admindivision/1.0.0/dist/admindivision","./subnav.tpl","./subnav.css"],function(a,b,c){var d=a("eling/component/core/uicomponent/2.0.0/src/uicomponent"),e=(a("gallery/store/1.3.14/store-seajs"),a("eling/component/utils/ajaxwrapper"),a("gallery/handlebars/2.0.0/handlebars-seajs"),a("eling/component/ui/button/1.0.0/dist/button")),f=a("eling/component/ui/buttongroup/1.0.0/dist/buttongroup"),g=a("eling/component/ui/date/1.0.0/dist/date"),h=a("eling/component/ui/daterange/1.0.0/dist/daterange"),i=a("eling/component/ui/text/1.0.0/dist/text"),j=a("eling/component/ui/place/1.0.0/dist/place"),k=a("./subnav.tpl");a("./subnav.css");var l={button:e,buttongroup:f,daterange:h,date:g,search:i,place:j},m=d.extend({attrs:{template:k,autoRender:!0,itemConfigs:{},itemPlugins:{},model:{items:[]}},initCustAttr:function(){var a=this.get("model"),b=a.items,c=this.get("itemConfigs");for(var d in b)!function(b,d){"search"==b.type&&(b.events={keydown:function(a){var c=window.event?a.keyCode:a.which;if(13==c){var e=d.$("."+b.id).find("input").val();e&&b.handler(e)}}}),"place"==b.type&&(b.triggerType="button"),"buttongroup"==b.type&&b.showAll&&void 0===b.all&&(b.all={show:!0,text:b.showAllText||"全部",position:b.showAllFirst?"top":"bottom"}),b.id="J-subnav-"+a.id+"-items-"+b.id,b.show===!1&&(b.className="hidden"),c[b.id]=b}(b[d],this)},_initMessage:function(){},afterRender:function(){this._initMessage();var a=this.get("model").items,b=this.get("itemPlugins");for(var c in a){var d=a[c].id,e=a[c].type,f=l[e];b[d]=new f({parentNode:this.$("."+d),model:a[c]})}},getItemConfig:function(a){return this.get("itemConfigs")["J-subnav-"+this.get("model").id+"-items-"+a]},getPlugin:function(a){return this.get("itemPlugins")["J-subnav-"+this.get("model").id+"-items-"+a]},setTitle:function(a){this.$(".J-subnav-title").text(a)},getTitle:function(){return this.$(".J-subnav-title").text()},hide:function(a){var b=this.get("model"),c=this.get("itemPlugins");a.constructor===String&&(a=[a]);for(var d in a){var e="J-subnav-"+b.id+"-items-"+a[d];this.$("."+e).addClass("hidden"),c[e].hide()}return this},show:function(a){var b=this.get("model"),c=this.get("itemPlugins");a.constructor===String&&(a=[a]);for(var d in a){var e="J-subnav-"+b.id+"-items-"+a[d];this.$("."+e).removeClass("hidden"),c[e].show()}return this},getValue:function(a){return this.getPlugin(a).getValue()},setValue:function(a,b){this.getPlugin(a).setValue(b)},getText:function(a){return this.getPlugin(a).getText()},setText:function(a,b){this.getPlugin(a).setText(b)},getData:function(a,b){return this.getPlugin(a).getData(b)},setData:function(a,b){this.getPlugin(a).setData(b)},load:function(a,b){this.getPlugin(a).load(b)},loading:function(a){this.getPlugin(a).loading()},destroy:function(){var a=this.get("itemPlugins");for(var b in a)a[b].destroy();m.superclass.destroy.call(this,arguments)}});c.exports=m}),define("eling/component/ui/subnav/2.0.0/dist/subnav.tpl",[],"<div id=\"{{this.id}}\" class=\"container el-subnav el-subnav-2\">\n	<div class='row'>\n		<div class='col-sm-12'>\n			<div class='page-header el-page-header J-subnav-head 3221'>\n				<h1 class='pull-left' style='float: none !important'>\n					<i class='icon-comments'></i>\n					<span class=\"J-subnav-title\">{{this.title}}</span>\n				</h1>\n				<div class='pull-right el-pull-right' style='float: none !important;margin-bottom: 20px;'>\n				{{#each this.items}}\n					<div class=\"btn-group ex-btn-group dropdown {{this.id}} {{this.className}}\"></div>\n				{{/each}}\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n"),define("eling/component/ui/subnav/2.0.0/dist/subnav.css",[],function(){seajs.importStyle(".el-subnav-2 .el-page-header{margin:0 0 5px;overflow:inherit}.el-subnav-2 .el-pull-right{margin-right:6%}")});