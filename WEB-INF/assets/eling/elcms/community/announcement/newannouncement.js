define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav"); 
	var Grid = require("grid");
	var Form =require("form");
	var aw = require("ajaxwrapper");
	var enmu = require("enums");
	var tpl=require("./newannouncement.tpl");
	require("./newannouncement.css");
	var Dialog = require("dialog");
	var activityUser  =require("store").get("user");
	var InnerEnvironment=require("inner_environment");
	var OuterEnvironment=require("outer_environment");
	
	var UEUtil = require("ue.parse");
	
	var fetchProperties = "pkNewAnnouncement," +
						"title," +
						"createTime," +
						"disabledTime," + 
						"creator.pkUser," +
						"creator.name," +
						"approver.pkUser," +
						"approver.name," +
						"content," +
						"displayScreens.pkDisplayScreen," +
						"displayScreens.name," +
						"activityRoom.pkActivityRoom," +
						"activityRoom.name," +
						"flowStatus," +
						"description," +
						"version"  
	
	
	var newannouncement = ELView.extend({ 
		attrs:{
        	template:tpl
        },
        events:{
			"change .J-form-newannouncement-select-activityRoom":function(e){
				var widget = this;
				var pk = widget.get("form").getValue("activityRoom");
				if(pk){
					$(".J-contentMsg").text("文本编辑器内容显示为半屏");
				}else{
					$(".J-contentMsg").text("文本编辑器内容显示为全屏");
				}
			},
			"click .J-return" : function(e){
				var widget = this;
				$(".J-el-content").attr("style","");
				$(".J-notify-content").html("");
				widget.show([".J-grid",".J-subnav"]).hide([".J-preview",".J-form",".J-notify-content"]);
				$(".J-activityRoom").text("");
				$("header").removeClass("hidden");
				$("nav").removeClass("hidden");
				$(".J-return").addClass("hidden");
				if(this.get("inner")){
					this.get("inner").destroy();
				}
				if(this.get("outer")){
					this.get("outer").destroy();
				}
				return false;
			}
		},
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
				model : {
					title:"公告发布",
					items:[{
						id :"search",
						placeholder:"",
						type:"search",
						handler: function(str) {
							var g = widget.get("grid");
							aw.ajax({
								url:"api/newannouncement/search",
								data:{
									s:str,
									searchProperties:"title,displayScreens.name,activityRoom.name,description",
									fetchProperties:fetchProperties
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
					},{
						id : "flowStatus",
						tip : "类型",
						all : {
							show : true,
							text : "全部",
							position : "bottom"
						},
						type : "buttongroup",
    					items : enmu["com.eling.elcms.community.model.NewAnnouncement.FlowStatus"],
						handler : function(key, element) {
							widget.get("grid").refresh();
						}
					},{
						id:"add",
						text:"新增",
						type : "button",
						show:true,
						handler:function(){
							widget.get("form").reset();
							var  subnav =widget.get("subnav"); 
							$(".J-contentMsg").text("文本编辑器内容显示为全屏");
							widget.hide([".J-grid"]).show([".J-form"]);
							subnav.show(["return"]).hide(["add","flowStatus","search","createTime"]);
						}
					},{
    					id:"return",
						text:"返回",
						className : "hidden",
						type : "button",
						handler:function(){
							widget.hide([".J-form"]).show([".J-grid"]);
							widget.get("subnav").show(["add","flowStatus","search","createTime"]).hide(["return"]);
						}
					},{
						id : "createTime",
						type : "daterange",
						tip : "创建时间",
						ranges : {
					        "本月": [moment().startOf("month"), moment().endOf("month")],
					        "三月内":[moment().subtract(3, 'month'), moment().endOf("day")],
					        "半年内": [moment().subtract(6, 'month'), moment().endOf("day")]
						},
						defaultRange : "本月",
						handler : function(time){
							widget.get("grid").refresh();
						},
					}]
				}
        	});
        	this.set("subnav",subnav);
        	
        	var grid=new Grid({
        		parentNode:".J-grid",
        		model : {
        			url : "api/newannouncement/query",
            		params : function() {
            			var subnav = widget.get("subnav");
    					return {
    						flowStatus:subnav.getValue("flowStatus"),
    						createTime:subnav.getValue("createTime").start,
    						createTimeEnd:subnav.getValue("createTime").end,
    						fetchProperties:fetchProperties  
    					} 
            		},
        			columns : [{
						name:"title",
						label:"主题",
						className:"grid_title"
					},{
						name:"createTime",
						label:"创建时间",
						format:"date",
						className:"grid_createTime"
					},{
						name:"disabledTime",
						label:"失效时间",
						format:"date",
						className:"grid_disabledTime"
					},{
						name:"displayScreens",
						label:"显示屏",
						format:function(value,row){
							if(value.length>0){
								var name ="";
								for ( var i in value) {
									name += value[i].name+","
								}
								return name.substr(0, name.length-1);
							}else{
								return ""
							}
						},
						className:"grid_displayScreens"
					},{
						name:"creator.name",
						label:"发布人",
						className:"grid_creator"
					},{
						name:"description",
						label:"描述",
						className:"grid_description"
					},{
						name:"flowStatus.value",
						label:"状态"	,
						className:"grid_flowStatus"
					},{
						name:"operate",
						label:"操作",
						format:"button",
						formatparams:[{
							id:"edit",
							icon:"icon-edit",
							handler:function(index,data,rowEle){
								var  subnav =widget.get("subnav"); 
								var  form =widget.get("form");
								form.reset();
								if(data.activityRoom){
									$(".J-contentMsg").text("文本编辑器内容显示为半屏");
								}
								form.setData(data);
								widget.hide([".J-grid"]).show([".J-form"]);
								subnav.show(["return"]).hide(["add","flowStatus","search","createTime","search","createTime"]);
							}
						},{
							id:"commit",
							text:"提交",
							show :function(value,row){
								if(row.flowStatus.key == "Initial"){
									return true
								}else{
									return false
								}
							},
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否提交？",
									confirm:function(){
										aw.ajax({
			    							url:"api/newannouncement/save",
			    							data:{
			    								flowStatus:"Submit",
			    								pkNewAnnouncement:data.pkNewAnnouncement,
			    								version:data.version
			    							},
			    							dataType:"json",
			    							success:function(data){
			    								widget.get("grid").refresh();
			    							}
			    						});
									}
								})
							}
						},{
							id:"delete",
							text:"删除",
							handler:function(index,data,rowEle){
								aw.del("api/newannouncement/" + data.pkNewAnnouncement + "/delete",function(){
		 	 						widget.get("grid").refresh(); 
		 	 					});
							}						
						},{
							id:"preview",
							text:"预览",
							handler:function(index,data,rowEle){
								$(".J-el-content").attr("style","margin-left: 0;")
								widget.hide([".J-grid",".J-form",".J-subnav"]).show([".J-preview",".J-notify-content"]);
								$("header").addClass("hidden");
								$(".J-return").removeClass("hidden");
								$("nav").addClass("hidden");
								if(data.activityRoom){
									widget.show([".J-inner",".J-out"])
									var outer=new OuterEnvironment({
										parentNode:".J-out"
									});
									outer.render();
									outer.initWeather();
									widget.set("outer",outer);
									//渲染环境数据
									var inner=new InnerEnvironment({
										parentNode:".J-inner"
									});
									inner.render();
									inner.refresh({
										last:true,
										pkActivityRoom:data.activityRoom.pkActivityRoom
									});
									widget.set("inner",inner);
								}else{
									widget.hide([".J-inner",".J-out"])
								}
								$(".J-title").text(data.title);
								var time =moment().valueOf();
								var richContent = $("<div class='rich-content"+time+"' style='width:1920px; height: 1080px;'></div>");
								richContent.html(data.content);
								$(".J-notify-content").append(richContent);
								UEUtil.UEParse(".rich-content"+time);
							}
						}]
					}]
        		}
    		 });
    		 this.set("grid",grid);
        	
        	 var form=new Form({
         		 parentNode:".J-form",
	  			 model:{
					id:"newannouncement",
					saveaction : function() {
	         			var form = widget.get("form");
	         			var disabledTime = form.getValue("disabledTime");
	         			var createTime=form.getValue("createTime");
	         			if(moment(createTime).isAfter(disabledTime)){
	         				Dialog.alert({
    							content:"失效时间不能早于创建时间！"
    						});
	         				return;
	         			}
	         			var data = form.getData();
	         			if(data.content){
	         				data.content = data.content.replace(/\&/g,"%26");
	         			}
	         			aw.saveOrUpdate("api/newannouncement/save",aw.customParam(data),function(data){
							widget.hide([".J-form"]).show([".J-grid"]);
							widget.get("subnav").show(["add","flowStatus","search","createTime"]).hide(["return"]);
							widget.get("grid").refresh();
							return false;
						});
					 },
					 cancelaction:function(){
						 widget.hide([".J-form"]).show([".J-grid"]);
						 widget.get("subnav").show(["add","flowStatus","search","createTime"]).hide(["return"]);
						return false;
		  			 },
					items:[{
						name:"pkNewAnnouncement",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name : "title",
		                label : "标题",
		                validate:["required"]
					},{
						name:"creator",
						label:"创建人",
						keyField:"pkUser",
						valueField:"name",
						url:"api/users/nofreeze",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name",
							seal:false
						}, 
						defaultValue:activityUser.pkUser,
						type:"select",
						readonly:true
					},{
						name : "createTime",
	                    label : "创建日期",
	                    type : "date",
	                    validate:["required"]
					},{
						name : "disabledTime",
	                    label : "失效日期",
	                    type : "date",
	                    validate:["required"]
					},{
						name : "displayScreens",
	                    label : "显示屏",
                        type : "select",
                        multi : true,
                        keyField : "pkDisplayScreen",
                        valueField : "name",
                        url : "api/displayscreen/query",
                        params : function(){
                        	return {
                        	  fetchProperties:"pkDisplayScreen,name"
                        	};
                        },
                      validate:["required"]
					},{
		                  name : "description",
		                  type : "textarea",
		                  label : "描述"
			        },{
						name : "activityRoom",
	                    label : "活动室",
                        type : "select",
                        keyField : "pkActivityRoom",
                        valueField : "name",
                        url : "api/activityroom/query",
                        params : function(){
                        	return {
                        	  fetchProperties:"pkActivityRoom,name"
                        	};
                        }
					},{
						name : "flowStatus",
	                    label : "流程状态",
                        type : "select",
                        options : enmu["com.eling.elcms.community.model.NewAnnouncement.FlowStatus"],
                        defaultValue:"Initial",
                        readonly:true
					},{
						name : "content",
	                    label : "文本编辑器",
                        type : "richtexteditor",
                        options:{
        					initialFrameHeight:"300"  //设置富文本高度
        				}
					}]
				 }
        	 });
        	 this.set("form",form);
        	 $(".J-form-newannouncement-select-flowStatus").append("<span class='J-contentMsg' style='color: #b94a48;font-size: 18px;border: beige;'>文本编辑器内容显示为全屏</span>");
        },
	})
	module.exports = newannouncement;
});