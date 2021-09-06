define(function(require,exports,module){
	
	var ELView = require("elview");
	var template = require("./personalization.tpl");
	
	var Subnav = require("subnav");
	var Grid = require("grid");
	
	var Dialog = require("dialog");
	var aw = require("ajaxwrapper");
	
	var instances = [], currentView = null;
	
	var UIComponent = require("uicomponent-2.0.0");
	
	var Components = {
		"profile": 	{
			instance : require("profile"),
			resolve : function(componentConfig){
				var items = componentConfig.items;
				for(var k in items){
					var children = items[k].children || [];
					for(var child in children){
						if(children[child].type != "hidden"){
							componentConfig.personalize.fields.push(children[child]);
						}
					}
				}
			}
		}
	};
	
	
	var exNodes = {
		"eling/elcms/membercenter/member/member" : function(view){
			return [view.get("memberSigningView").member_view.memBaseInfo.component];
		}
	};
	
	var Personalization = ELView.extend({
		
		attrs : {
			template : template
		},
		
		initComponent : function(params,widget){
			var subnav = new Subnav({
				parentNode : ".J-el-personalization-subnav",
				model : {
					title : "个性化配置",
					items : [{
						id : "return",
						type : "button",
						text : "返回",
						show : false,
						handler : function(){
							for(var i in instances){
								instances[i].destroy();
							}
							if(currentView){
								currentView.destroy();
							}
							widget.show([".J-el-personalization-grid"]).hide([".J-el-personalization-card"]);
							widget.get("subnav").hide(["return"]);
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode : ".J-el-personalization-grid",
				
				model : {
					url : "api/menuitem/query",
					columns : [{
						name : "code",
						label : "功能节点编号"
					},{
						name : "display",
						label : "名称"
					},{
						name : "enabled",
						label : "是否启用",
						format : function(value,row){
							return value ? "启用" : "未启用";
						}
					},{
						name : "operate",
						label : "操作",
						format : "button",
						formatparams : [{
							id : "gotoConfig",
							text : "配置",
							handler:function(index,data,rowEle){
								
								var that = this;
								
								var componentConfigs = [];
								
								var code = data.code;
								if(!code){
									Dialog.alert({
										content : "该节点没有配置code属性！！！"
									});
									return false;
								}
								
								require.async(data.path,function(View){
									
									if(View){
										var view = new View({
											autoRender : true,
											parentNode : ".J-elsystem-personalization-grid-configPage",
											params : data.parameter ? JSON.parse(data.parameter) : ""
										});
										
										/*
										 * config:{
										 * 		组件配置1:xxx,
										 * 		组件配置2:xxx,
										 * 		组件配置n:xxx,
										 * 		personalize: {
										 * 			code: "",
										 * 			title: "",
										 * 			fields: []
										 * 		}
										 * }
										 * 
										 **/
										
										var components = data.path in exNodes ? exNodes[data.path](view) : function(){
											
											var ret = [];
											
											var attrs = view.attrs;
											for(var i in attrs){
												if(attrs[i] && attrs[i].value instanceof UIComponent && attrs[i].value.get("personalization")){
													ret.push(attrs[i].value);
												}
											}
										}
										for(var i in components){
											var config = components[i].get("model");
											config.personalize = {
												viewCode : code,
												title: components[i].get("personalization").description,
												fields : []
											};
											for(var c in Components){
												if(components[i] instanceof Components[c].instance){
													config.personalize.type = c;
													break;
												}
											}
											
											Components[config.personalize.type].resolve(config);
											
											//查询已经保存的配置
											widget.queryConfig(config);
										}
										
										if(components.length == 0){
											Dialog.alert({
												content : "该节点暂无个性化配置的需求"
											});
											return false;
										}
										
										currentView = view;
										
										widget.hide([".J-el-personalization-grid"]).show([".J-el-personalization-card"]);
										widget.get("subnav").show(["return"]);
									}else{
										Dialog.alert({
											content : "该节点的path属性不存在！"
										});
										return false;
									}
								});
								return false;
							}
						}]
					}]
				}
			});
			
			this.set("grid",grid);
		},
		
		queryConfig : function(componentConfig){
			var that = this;
			aw.ajax({
				url : "api/datastorage/queryvalue",
				dataType : "json",
                data : {
                    key : componentConfig.id + "_" + componentConfig.personalize.viewCode,
                    type : "template"
                },
				success : function(data){
					that.initPersonalizeGrid(componentConfig);
					if(data){
						var custConfigs = JSON.parse(data);
						for(var i in custConfigs){
							if(custConfigs[i].isShow == true){
								$(".J-elsystem-personalization-"+i+"-isshow").prop("checked",true);
							}
						}
					}
				},
				error : function(){
					that.initPersonalizeGrid(componentConfig);
					//默认全部勾选
					$(".J-elsystem-personalization-isshow").prop("checked",true);
				}
			});
		},
		
		initPersonalizeGrid : function(componentConfig){
			var grid = new Grid({
				parentNode : ".J-elsystem-personalization-grid",
				model : {
					isInitPageBar : false,
					head : {
						title : componentConfig.personalize.title,
						buttons : [{
							id : "save",
							text : "保存",
							handler : function(){
								var datas = grid.getData();
								var params = {};
								for(var i in datas){
									params[datas[i].name] = {};
									params[datas[i].name].isShow = $(".J-elsystem-personalization-"+datas[i].name+"-isshow").prop("checked");
								}
								if(typeof componentConfig.id == "number"){
									Dialog.alert({
										content : "该列表没有配置id属性，请检查！！！"
									});
									return false;
								}
								aw.ajax({
									url : "api/datastorage/save",
									type : "POST",
									data : {
										key : componentConfig.id + "_" + componentConfig.personalize.viewCode,
										type : "template",
										value : JSON.stringify(params)
									},
									dataType : "json",
									success : function(data){
										Dialog.alert({
											content : "保存成功!"
										});
									}
								});
							}
						}]
					},
					columns : [{
						name : "label",
						label : "字段名"
					},{
						name : "isShow",
						label : "是否显示",
						format : function(value,row){
							return "<input type='checkbox' class='J-elsystem-personalization-isshow J-elsystem-personalization-"+row.name+"-isshow'>";
						}
					}]
				}
			});
			
			grid.setData(componentConfig.personalize.fields);
			instances.push(grid);
		},
		
		afterInitComponent : function(params,widget){
			$(".J-tip-container").addClass("hidden");
		},
		
		destroy : function(){
			$(".J-tip-container").removeClass("hidden");
			for(var i in gridInstances){
				instances[i].destroy();
			}
			if(currentView){
				currentView.destroy();
			}
		}
		
	});
	
	module.exports = Personalization;
});