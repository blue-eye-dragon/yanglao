define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Dialog = require("dialog-1.0.0");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var template=require("./servicegrade.tpl");

	var ServiceConditions = ELView.extend({
		attrs : {
			template : template
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode : ".J-subnav",
				model:{
					title:"服务等级定义",
					search:true,
					buttons:[{
						id:"cancel",
						text:"返回",
						show:false,
						handler:function(){
							if ($(".J-condList").hasClass("hidden")){
								widget.hide([".J-list",".J-indicList"]).show([".J-cancel",".J-condList"]);
								var condG=widget.get("condGrid");
								condG.setTitle($(".J-pkService").attr("data-name"));
								widget.get("condGrid").set("url","api/service/" + $(".J-pkService").attr("data-key") +"/conditions");		
								widget.get("condGrid").refresh();
							}
							else{
								widget.hide([".J-indicList",".J-cancel",".J-condList"]).show([".J-list"]);
							}
							return false;
						}
					}]
				}
			});
			this.set("subnav",subnav);
			//渲染服务grid
			var svcGrid=new Grid({
				parentNode : ".J-list",
				url : "api/service/query",
				model:{
					columns:[{
						key:"code",
						name:"服务编码"
					},{
						key:"name",
						name:"服务名称",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEL){
								widget.hide([".J-list",".J-indicList"]).show([".J-cancel",".J-condList"]);
								var condG=widget.get("condGrid");
								condG.setTitle(data.name);
								condG.set("url","api/service/" + data.pkService +"/conditions");
								$(".J-pkService").attr("data-key",data.pkService);
								$(".J-pkService").attr("data-name",data.name);
								condG.refresh();
								return false;
							}
						}]
					}]
				}
			});
			this.set("svcGrid",svcGrid);
			//渲染服务等级Grid			
			var condGrid = new Grid({
				parentNode : ".J-condList",
				autoRender : false,
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								$(".J-indicList .J-checked").removeAttr("checked");		
								widget.hide([".J-list",".J-condList"]).show([".J-cancel",".J-indicList"]);							
							}
						}]
					},
					columns:[{
						key:"description",
						name:"服务等级内容",
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								if (parseInt($(".J-pkService").attr("data-key")) <= 3){
									Dialog.alert({
										content:"系统预置服务等级，不能删除"
									});
								}else{
									aw.del("api/service/" + $(".J-pkService").attr("data-key") + "/condition/" + data.pkServiceCondition + "/delete",function(){
										widget.get("condGrid").refresh();
										widget.hide([".J-list",".J-indicList"]).show([".J-cancel",".J-condList"]);
									});
								}
							}
						}]
					}]
				}
			});
			this.set("condGrid",condGrid);
			//渲染内容grid
			var indicGrid=new Grid({
				parentNode : ".J-indicList",
				url : "api/serviceindicators",
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								if (parseInt($(".J-pkService").attr("data-key"))>=1 && parseInt($(".J-pkService").attr("data-key")) <= 3){
									Dialog.alert({
										content:"系统预置服务等级，不能修改"
									});
								}else{
									var ret="";
									var data = widget.get("indicGrid").getSelectedData();
									if (data.length!=0){
										for(var i=0;i<data.length;i++){
											ret+="pkIndic="+data[i].pkServiceIndicator+"&";
										}
									}
									aw.saveOrUpdate("api/service/"+ $(".J-pkService").attr("data-key") +"/indicators/add",ret,function(){
										widget.get("condGrid").refresh();
										widget.hide([".J-list",".J-indicList"]).show([".J-cancel",".J-condList"]);
									});		
								}
							}
						}]
					},
					isCheckbox:true,
					columns:[{
						key:"code",
						name:"指标编码"
					},{
						key:"name",
						name:"指标名称"
					},{
						key:"description",
						name:"指标描述"
					}]
				}
			});
			this.set("indicGrid",indicGrid);
		}
	});
	module.exports = ServiceConditions;
});