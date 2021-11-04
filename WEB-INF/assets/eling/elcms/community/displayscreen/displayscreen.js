define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav"); 
	var Grid = require("grid");
	var Form =require("form");
	var aw = require("ajaxwrapper");
	var Dialog = require("dialog");
	var tpl=require("./displayscreen.tpl");
	require("./grid.css");
	var fetchProperties = "pkDisplayScreen,code,name,place,description,speed,version";
	var DisplayScreen = ELView.extend({
		attrs:{
        	template:tpl
        },
        events:{
		},  
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
					title:"显示屏档案",
					items:[{
						id :"search",
						placeholder:"",
						type:"search",
						handler: function(str) {
							var g = widget.get("grid");
							aw.ajax({
								url:"api/displayscreen/search",
								data:{
									s:str,
									searchProperties:"code,name,place,description,speed",
									fetchProperties:fetchProperties
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
					},{
        				id:"all",
        				type : "button",
        				text:"全部",
						handler:function(){
							widget.get("grid").refresh();
						}
					},{
						id:"add",
						type : "button",
						text:"新增",
						handler:function(){
							widget.get("form").reset();
							widget.hide([".J-grid"]).show([".J-form"]);
							widget.get("subnav").hide(["all","add","search"]).show("return");
						}
					},{
						id:"return",
						type : "button",
						text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").show(["all","add","search"]).hide("return");
						}
					}]
				}
        	});
        this.set("subnav",subnav);
        
        var grid=new Grid({
        	parentNode:".J-grid",
        	url : "api/displayscreen/query",
			fetchProperties:fetchProperties,
			model:{
				columns:[{
					name:"code",
					label:"编码",
					className:"grid_10"
				},{
					name:"name",
					label:"名称",
					className:"grid_10"
				},{
					name:"speed",
					label:"滚屏速度",
					className:"grid_10"
				},{
					name:"place",
					label:"位置",
					className:"grid_20"
				},{
					name:"description",
					label:"备注",
					className:"grid_40"
				},{
					name:"operate",
					label:"操作",
					format:"button",
					formatparams:[{
						id:"edit",
						icon:"icon-edit",
						handler:function(index,data,rowEle){
							var form =widget.get("form");
							form.reset();
							form.setData(data);
							widget.get("subnav").hide(["all","add","search"]).show("return");
							widget.hide([".J-grid"]).show([".J-form"]);
							return false;
						}
					},{
						id:"delete",
						icon:"icon-remove",
						handler:function(index,data,rowEle){
							aw.del("api/displayscreen/" + data.pkDisplayScreen + "/delete",function(){
	 	 						widget.get("grid").refresh(); 
	 	 					});
							return false;
						}
					},{
						id:"preview",
						text:"预览",
						handler:function(index,data,rowEle){
							var pk =data.pkDisplayScreen;
							aw.ajax({
								url:"api/newannouncement/query",
								data:{
									flowStatus:"Approval",
									disabledTime:moment().valueOf(),
									displayScreens:data.pkDisplayScreen,
									fetchProperties:"pkNewannouncement",
								},
								dataType:"json",
								success:function(data){
									if(data.length == 0){
										Dialog.alert({
			                        		title:"提示",
			                        		content:"还没有发布在该显示屏的公告！"
			                        	});
										return;
									}else{
										var href=window.location.href;
										var  url = href.substr(0,href.lastIndexOf("/")+1)+"?view=eling/elcms/community/displayscreen/displayscreenpreview&parameters={\\\"" +
												"pkDisplayScreen\\\":\\\""+pk+"\\\"}";
										window.open(url);
									}
								}
							})
						}
					}]
				}]
			}
        });
        this.set("grid",grid);
        
        var form=new Form({
    		 parentNode:".J-form",
 			 model:{
				id:"displayscreen",
				saveaction : function() {
        			aw.saveOrUpdate("api/displayscreen/save",$("#displayscreen").serialize(),function(data){
						widget.hide([".J-form"]).show([".J-grid"]);
						widget.get("subnav").show(["add","all","search"]).hide(["return"]);
						widget.get("grid").refresh();
						return false;
					});
				 },
				 cancelaction:function(){
					 widget.hide([".J-form"]).show([".J-grid"]);
					 widget.get("subnav").show(["add","all","search"]).hide(["return"]);
					return false;
	  			 },
				items:[{
					name:"pkDisplayScreen",
					type:"hidden"
				},{
					name:"version",
					defaultValue:"0",
					type:"hidden"
				},{
					name : "code",
	                label : "编码",
	                validate:["required"]
				},{
					name : "name",
	                label : "名称",
	                validate:["required"]
				},{
					name : "speed",
	                label : "滚屏速度（秒）",
	                placeholder :"有效范围1~3600",
	                validate:["required"],
	                exValidate : function(value){
						if(isNaN(value)){
							return "请输入合适的秒数";
						}else{
							if(value > 3600 || value < 1){
								return "请输入合适的秒数";
							}
							return true;
						}
					}
				},{
					name : "place",
	                label : "位置",
				},{
	                name : "description",
	                type : "textarea",
	                label : "描述"
		        }]
			 }
        });
        this.set("form",form);
        }
	})
	module.exports = DisplayScreen;
	});