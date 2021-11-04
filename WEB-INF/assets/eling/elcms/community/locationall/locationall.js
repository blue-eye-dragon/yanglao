define(function(require,exports,module){
	var ELView = require("elview");
	
	var template = require("./location.tpl");
	
	var aw = require("ajaxwrapper");
	var Dialog = require("dialog");
	//缓存当前占用摄像头的会员
	
	require("./location.css");
	
	var Loacation = ELView.extend({
		attrs : {
			template : template,
			model : {
				date : moment().format("YYYY-MM-DD"),
				hasNext : 0,
				data:{}
			}
		},
		events:{
				"click .emergencyHelp-info-guanbi":function(e){
					$(".emergencyHelp-panel").hide();
					//清空缓存的pkMember
					this.set("pkMember","");
					
					//取消当前显示求助摄像头在列表中的样式
					var pkMonitor=this.get("emMonitor");
					$("a[data-pkMonitor="+pkMonitor+"]").css("color","white");
					$(".J-monitor-li-monitor-img-"+pkMonitor).attr("src","assets/eling/elcms/community/locationall/assets/leibiao-shexiang-weixuanzgong.png");
									},
				"click .J-monitor-li-monitor":function(e){
					var widget =this;
					$(".el-locationall .img-icon").remove()
					var pkMonitor =$(e.target).attr("data-pkMonitor");
					$(".el-locationall li>img").attr("src","assets/eling/elcms/community/locationall/assets/leibiao-shexiang-weixuanzgong.png");
					$(".el-locationall li>a").css("color","white");
					if(pkMonitor){
						$("a[data-pkMonitor="+pkMonitor+"]").css("color","#33ffff");
						$(".J-monitor-li-monitor-img-"+pkMonitor).attr("src","assets/eling/elcms/community/locationall/assets/leibiao-shexiang-xuanzgong.png");
						
						//摄像头
						Dialog.loading(true);
						aw.ajax({
							url: "api/monitor/query",
							data:{
								pkMonitor:pkMonitor,
								fetchProperties:"monitor.name,monitor.pkMonitor,serverUrl,base64UrlMain,base64UrlSub,monitor.coordinate"
							},
							success: function(monitors){
								Dialog.loading(false);
								var data =monitors[0];
								var high=1;
								if(data.monitor.coordinate){
									
									var percent = widget.percent(percent);
									
									data.x =Number(data.monitor.coordinate.split(",")[0]);
									data.y =Number(data.monitor.coordinate.split(",")[1]);
									if(data.x == "-1" && data.y == "-1"){
										return null;
									}
									var leftMargin = data.x*percent+100;
									var topMargin = data.y*percent+40;
									var div = $("<img class='img-icon' src='assets/eling/elcms/community/locationall/assets/leibiao-shexiang-xuanzgong.png' />").css({
										"position":"absolute",
										"left":leftMargin + "px",
										"top":topMargin + "px"
									});
									widget.element.append(div);
								}
								//iframe pass 无法最大化
								Dialog.confirm({
				                    title : data.monitor.name,
				                    content : "<iframe allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' src='"+data.serverUrl+"/video/player/"+data.base64UrlSub+".do' width='100%' height='300px' frameborder='no'></iframe>",
					                    setStyle : function(){
				                        $(".el-dialog-modal .modal").css({
				                            top : "55%",
				                            /*width:"1200",
				                            height:"900",*/
				                            width : "30%",
				                            left  : "1%",
				                            "background-color": "rgba(0,0,0,0.65)"
				                        });
				                        $(".el-dialog-modal h3").css({
				                           color:"#33ffff"
				                        });
				                        $("h3").prepend("<img src='assets/eling/elcms/community/locationall/assets/leibiao-shexiang-xuanzgong.png'>")
				                        $(".J-dialog-cancel").css({
				                            display : "none"
				                        });

				                        $(".el-dialog-modal .modal-body pre").css({
				                            "padding": "0 9.5px",
				                            "margin-bottom": "0"
				                        });
				                        
				                    },
									confirm : function(){
										Dialog.close();
										$("a[data-pkMonitor="+pkMonitor+"]").css("color","white");
										$(".J-monitor-li-monitor-img-"+pkMonitor).attr("src","assets/eling/elcms/community/locationall/assets/leibiao-shexiang-weixuanzgong.png");
									}
				                });
								$("#videojsframe").attr("allowfullscreen","true");
								$(".J-dialog-confirm").text("关闭");
								$(".J-dialog-confirm").addClass("btn btn-danger J-dialog-confirm");
								
							}
						});
					}
				}
		},
		afterInitComponent : function(params,widget){
			
			var img = $(".J-picture")
			
			$("body").addClass("main-nav-closed").removeClass("main-nav-opened");
			
			//1.计算屏幕的宽度和高度，以及图片的宽度和高度
			var clientWidth = x = document.documentElement.clientWidth-45;
			var clientHeight = y = document.documentElement.clientHeight-40;
			var picWidth = a = img[0].naturalWidth || img[0].width;
			var picHeight = b = img[0].naturalHeight || img[0].height;
			
			//2.取宽度和高度中较小的值作为基数算出缩小和扩大的比例
			var realWidth = ap = null;
			var realHeight = bp = null;
			
			if(x/y < a/b){
				realWidth = clientWidth;
				realHeight = picHeight*clientWidth/picWidth;
			}else{
				realWidth = picWidth*clientHeight/picHeight;
				realHeight = clientHeight;
			}
			var percent = realWidth/picWidth;
			
			//4.设置新宽度和高度
			img.css({width : realWidth+"px", height : realHeight+"px"}).removeClass("hidden");
			Dialog.loading(true);
			
			//loadMapMarker
			$(".J-picture").load(widget.loadMapMark(widget),function(){
				var J_panel_left = $(".J-picture").width()*0.85;
				var J_panel_top = $(".J-picture").height()*0.2;
				$(".J-panel").css("margin-left",J_panel_left+"px");
				$(".J-panel").css("margin-top",J_panel_top+"px");
				$(".J-panel").show();
				var J_monitor_top = $(".J-picture").height()*0.2+$(".J-panel").height()+35;
				$(".J-monitor").css("margin-top",J_monitor_top+"px");
				$(".J-monitor").css("margin-left",J_panel_left+"px");
				$(".J-monitor").show();
			})
			
		//	摄像头
			aw.ajax({
				url: "api/monitor/query",
				data:{
					fetchProperties:"monitor.name,monitor.pkMonitor"
				},
				success: function(datas){
					datas.size =datas.length;
					widget.get("model").monitor = datas;
					widget.renderPartial(".J-monitor");
				}
			});
			
			//定时刷新20秒
			var timer=setInterval(function(){
				widget.loadMapMark(widget);
				widget.emergencyHelp(widget);
			},20*1000);
			this.set("timer",timer);
			$(".J-picture").attr("src","api/location/map/overall");
		},
		percent:function(widget){
			var img = $(".J-picture");
			
			//1.计算屏幕的宽度和高度，以及图片的宽度和高度
			var clientWidth = x = document.documentElement.clientWidth-45;
			var clientHeight = y = document.documentElement.clientHeight-40;
			var picWidth = a = img[0].naturalWidth || img[0].width;
			var picHeight = b = img[0].naturalHeight || img[0].height;
			
			//2.取宽度和高度中较小的值作为基数算出缩小和扩大的比例
			var realWidth = ap = null;
			var realHeight = bp = null;
			
			if(x/y < a/b){
				realWidth = clientWidth;
				realHeight = picHeight*clientWidth/picWidth;
			}else{
				realWidth = picWidth*clientHeight/picHeight;
				realHeight = clientHeight;
			}
			return realWidth/picWidth;
		},
		
		loadMapMark:function(widget){
			aw.ajax({
				url: "api/location/queryalllocationmember",
				success: function(datas){
					Dialog.loading(false);
					
					var percent = widget.percent(widget);
					var map = {}

					var  memberMapPosition =widget.get("memberMapPosition")?widget.get("memberMapPosition"):{};
					
					for(var i in datas){
						var data = datas[i];
						if(memberMapPosition[data.tagId]){
							if(memberMapPosition[data.tagId] != (data.x+""+data.y)){
								$("#marker-"+data.tagId).remove()
								widget.printMapMark(widget,map,data,percent);
							}
							
						}else{
							memberMapPosition[data.tagId] =data.x+""+data.y;
							widget.printMapMark(widget,map,data,percent);
						}
					}
					widget.set("memberMapPosition",memberMapPosition);
				}
			});
			
			aw.ajax({
				url: "api/location/queryalllocationmemberclassificationstatistics",
				success: function(data){
					widget.get("model").data = data;
					widget.renderPartial(".J-panel");
				}
			});
		},
		
		printMapMark:function(widget,map,data,percent){
			if(map[data.x+""+data.y]){
				if(map[data.x+""+data.y] > 12){
					return;
				}else{
					map[data.x+""+data.y]++;
				}
			}else{
				map[data.x+""+data.y] =1
			}
			if(data.x == "-1" && data.y == "-1"){
				return null;
			}
			
			if(data.y>880){
				var leftMargin = data.x*percent-14.5781*(1-percent)/2+30*percent+((Math.random()*10)-5)*15;
				var topMargin = data.y*percent-15*(1-percent)+((Math.random()*10)-5)*2.2;
			}else if(data.y<520 && data.y>850){
				var leftMargin = data.x*percent-14.5781*(1-percent)/2+30*percent+((Math.random()*10)-5)*15
				var topMargin = data.y*percent-15*(1-percent)+((Math.random()*10)-5)*2.2;
			}else if(data.y<200 ){
				var leftMargin = data.x*percent-14.5781*(1-percent)/2-40*percent+((Math.random()*10)-5)*15
				var topMargin = data.y*percent-15*(1-percent)+40*percent+((Math.random()*10)-5)*2.2;
			}
			else if(data.y>200 && data.y<350 && data.x<350){
				//左上角楼栋人员位置调整
				var leftMargin = data.x*percent-14.5781*(1-percent)/2+30*percent+((Math.random()*10)-5)*15
				var topMargin = data.y*percent-15*(1-percent)+5*percent+((Math.random()*10)-5)*2.2;
			}else{
				var leftMargin = data.x*percent-14.5781*(1-percent)/2+30*percent+((Math.random()*10)-5)*15;
				var topMargin = data.y*percent-15*(1-percent)+25*percent+((Math.random()*10)-5)*2.2;
			}
			
			var  color ="";
			if(data.locationStatus.key == "Out"){
				color ="#A500CC"
			}else if(data.locationStatus.key == "Danger"){
				color ="red"
			}else{
				color ="#FF8800"
			}
			var div = $("<i class='icon-map-marker' id='marker-"+data.tagId+"'></i>").css({
				"font-size":"20px",
				"position":"absolute",
				"color":color,
				"left":leftMargin + "px",
				"top":topMargin + "px"
			});
			widget.element.append(div);
		},
		
		emergencyHelp:function(widget){
			aw.ajax({
				url: "api/sos/alarmlocation",
				data:{
					fetchProperties:"member.pkMember,member.personalInfo.pkPersonalInfo,member.personalInfo.name,member.memberSigning.room.number,member.personalInfo.phone,monitorInfo.monitor.name,monitorInfo.monitor.pkMonitor,monitorInfo.base64UrlSub,monitorInfo.serverUrl"
				},
				success: function(data){
					var pkMember=widget.get("pkMember");
					if(data.member.pkMember){
						if(data.member.pkMember != pkMember){
							//加载报警界面
							widget.get("model").member = {
								name:data.member.personalInfo.name,
								phone:data.member.personalInfo.phone,
								room:data.member.memberSigning.room.number,
								pkPersonalInfo:data.member.personalInfo.pkPersonalInfo
							};
							widget.get("model").monitor ={
								name:data.monitorInfo.monitor.name
							} ;
							widget.renderPartial(".emergencyHelp-panel");
							//插入视频
							$(".emergencyHelp-monitor").
							prepend("<iframe allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' src='"+data.monitorInfo.serverUrl+"/video/player/"+data.monitorInfo.base64UrlSub+".do' width='500' height='600' frameborder='no'></iframe>")
							
							$(".emergencyHelp-panel").show();
							
							//缓存会员pk
							widget.set("pkMember",data.member.pkMember)
							
							if(data.monitorInfo.monitor){
								//在摄像头找到元素并改变样式
								var pkMonitor =data.monitorInfo.monitor.pkMonitor;
								$("a[data-pkMonitor="+pkMonitor+"]").parent().parent().scrollTop($("a[data-pkMonitor="+pkMonitor+"]").parent().position().top-49)
								$("a[data-pkMonitor="+pkMonitor+"]").css("color","#33ffff");
								$(".J-monitor-li-monitor-img-"+pkMonitor).attr("src","assets/eling/elcms/community/locationall/assets/leibiao-shexiang-xuanzgong.png");
								widget.set("emMonitor",data.monitorInfo.monitor.pkMonitor);
							}
						}
					}
				}
			});
		},
		
		destroy : function(){
			window.clearInterval(this.get("timer"));
			$("body").removeClass("main-nav-closed").addClass("main-nav-opened");
			Loacation.superclass.destroy.call(this,arguments);
		}
	});
	
	module.exports = Loacation;
});
