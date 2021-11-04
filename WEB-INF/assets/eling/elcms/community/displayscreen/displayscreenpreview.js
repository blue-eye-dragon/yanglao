define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog = require("dialog");
	var InnerEnvironment=require("inner_environment");
	var OuterEnvironment=require("outer_environment");
	require("jquery.carouFredSel");
	var UEUtil = require("ue.parse");
	var tpl=require("./displayscreenpreview.tpl");
	require("./displayscreen.css");
	var DisplayScreen = ELView.extend({
		attrs:{
        	template:tpl
        },
        initComponent:function(params,widget){
        	var pkDisplayScreen = params?params.pkDisplayScreen:"";
        	aw.ajax({
				url:"api/displayscreen/query",
				data:{
					pkDisplayScreen:pkDisplayScreen,
					fetchProperties:"pkDisplayScreen,speed",
					token: params && params.token ? params.token : ""
				},
				dataType:"json",
				success:function(displayScreen){
					aw.ajax({
						url:"api/newannouncement/query",
						data:{
							flowStatus:"Approval",
							disabledTime:moment().valueOf(),
							displayScreens:displayScreen[0].pkDisplayScreen,
							fetchProperties:"title,activityRoom.pkActivityRoom,activityRoom.name,content",
							token: params && params.token ? params.token : ""
						},
						dataType:"json",
						success:function(data){
								widget.show([".J-preview"]);
								$(".J-el-content").attr("style","margin-left: 0;")
								$("header").addClass("hidden");
								$(".J-return").removeClass("hidden");
								$("nav").addClass("hidden");
								var outer=new OuterEnvironment({
									parentNode:".J-out"
								});
								//渲染环境数据
								var inner=new InnerEnvironment({
									parentNode:".J-inner"
								});
								widget.set("inner",inner);
								//先把所有文本编辑的内容放入div，形成轮播
								widget.set("outer",outer);
								
								for ( var i in data) {
									var time =moment().valueOf();
									var richContent = $("<div class='rich-content"+time+"' style='height: 1080px;'>"+data[i].content+"</div>");
									var slide = $("<div class='slide' style = 'height:1080px;'></div>");
									slide.append(richContent);
									$(".J-notify-content").append(slide);
									UEUtil.UEParse(".rich-content"+time);
								}
								var i =0;
								$(".J-notify-content").carouFredSel({
									direction: 'left',
									circular: true,
									infinite: false,
									width : 1900,
								    height: 1080,
									items: 1,
									auto: true,
									onCreate : function(){
										outer.render();
										outer.initWeather();
										inner.render();
										$(".J-title").text(data[0].title);
										if(data[0].activityRoom){
											inner.refresh({
												last:true,
												pkActivityRoom:data[0].activityRoom.pkActivityRoom
											});
										}else{
											widget.hide([".J-inner",".J-out"]);
										}
									},
									scroll: {
										fx: 'none',
										timeoutDuration: displayScreen[0].speed*1000,
										onBefore: function() {
											var j  =0;
											if(i == data.length-1){
												j =0;
												outer.initWeather();
											}else{
												j=i+1;
											}
											if(data[j].activityRoom){
												widget.show([".J-inner",".J-out"]);
												inner.refresh({
													last:true,
													pkActivityRoom:data[j].activityRoom.pkActivityRoom
												});
											}else{
												widget.hide([".J-inner",".J-out"])
											}
										},
										onAfter: function() {
											$(".J-tip").remove()
											if(i == data.length-1){
												i =0;
											}else{
												i=i+1;
											}
											$(".J-title").text(data[i].title);
											if(data[i].activityRoom){
												widget.show([".J-inner",".J-out"]);
											}else{
												widget.hide([".J-inner",".J-out"])
											}
											
										}
									}
								});
						}
					})
				}
        	})
			
        },
        afterInitComponent:function(params,widget){
        	//定时刷新30分钟
			var timer=setInterval(function(){
				window.location.reload()
			},30*60*1000);
			this.set("timer",timer);
		},
		destroy:function(){
			window.clearInterval(this.get("timer"));
			DisplayScreen.superclass.destroy.call(this,arguments);
		}
	})
	module.exports = DisplayScreen;
	});