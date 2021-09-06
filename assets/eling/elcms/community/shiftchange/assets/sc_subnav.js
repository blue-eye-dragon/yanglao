define(function(require,exports,module){
	var Subnav=require("subnav-1.0.0");
	var Form=require("form-2.0.0")
	var Dialog=require("dialog-1.0.0");
	var aw=require("ajaxwrapper");
	var week=["一","二","三","四","五","六","日"];
	var instance;
	
	var SC_subnav={
		init:function(widget,params){
			instance=widget;
			var that=this;
			return new Subnav({
				parentNode:".J-subnav",
				model:{
					title:params.type=="daytime"?"交接班":"夜班交接班",
					items:[{
						id:"date",
						type:"date",
						startDate:widget.get("model").startDate,
						maxDate:widget.get("model").maxDate,
						handler:function(a,b){
							var attrs=widget.attrs;
							params.startdate=a;
							params.enddate=b;
							$(".nodata").removeClass("nodata");
							for(var i in attrs){
								if(attrs[i] && attrs[i].value && typeof attrs[i].value.refresh === "function"){
									attrs[i].value.refresh();
								}
							}
							//设置周知事宜，交班事宜，物资交接
							widget.loadData(params);
							//如果不是当天隐藏交接班按钮
							if(!moment(moment().format("YYYY-MM-DD")).isSame(moment(a).format("YYYY-MM-DD"),"day")){
								widget.get("subnav").hide(["receive","send"]);	
								$(".J-matters").attr("readonly","readonly");
								$(".J-nightShiftAttention").attr("readonly","readonly");
								$(".J-dayShiftAttention").attr("readonly","readonly");
								$(".J-exchangeGoods").attr("readonly","readonly");
								$(".J-nightOthers").attr("readonly","readonly");
							};
							
						}
					},{
						id:"building",
						show:params && params.type == "daytime" ? true : false,
						type:"buttongroup",
						handler:function(key,el){
							var attrs=widget.attrs;
							$(".nodata").removeClass("nodata");
							for(var i in attrs){
								if(attrs[i] && attrs[i].value && typeof attrs[i].value.refresh === "function"){
									attrs[i].value.refresh();
								}
							}
							//设置周知事宜，交班事宜，物资交接
							widget.loadData(params);
							if(!moment(moment().format("YYYY-MM-DD")).isSame(moment(widget.get("subnav").getValue("date").start).format("YYYY-MM-DD"),"day")){
								widget.get("subnav").hide(["receive","send"]);	
								$(".J-matters").attr("readonly","readonly");
								$(".J-nightShiftAttention").attr("readonly","readonly");
								$(".J-dayShiftAttention").attr("readonly","readonly");
								$(".J-exchangeGoods").attr("readonly","readonly");
								$(".J-nightOthers").attr("readonly","readonly");
							};	
							
							
						}
					},{
						id:"send",
						text:"交班",
						show:false,
						type:"button",
						handler:function(){
							that.sendOrReceive("交班",params);
 							return false;
						}
					},{
						id:"receive",
						text:params.type=="daytime"?"接班":"夜班秘书汇总",
						show:false,
						type:"button",
						handler:function(){
							that.sendOrReceive(params.type=="daytime"?"接班":"夜班秘书汇总",params);
 							return false;
						}
					},{
						id:"print",
						text:"打印",
						type:"button",
						handler:function(){
							if(params.type=="daytime"){
								var title=moment(widget.get("subnav").getValue("date").start).format("YYYY.MM.DD");
								title+="（星期"+week[moment(widget.get("subnav").getValue("date").start).format("e")-1]+"）交接班";
								$(".J-shiftchange-title").text(title);
								//log
								var gridlog=widget.get("log");
								var data=gridlog.getData();
								if(data.length==0){
									$(".J-member-log-print").addClass("nodata");
								}else{
									widget.get("log-print").setData(data);
								}
								//interview
								var gridinterview=widget.get("interview");
								var data=gridinterview.getData();
								if(data.length==0){
									
								}else{
									widget.get("interview-print").setData(data);
								}
								//service
								var gridservice=widget.get("service");
								var data=gridservice.getData();
								if(data.length==0){
									$(".J-member-service-print").addClass("nodata");
								}else{
									widget.get("service-print").setData(data);
								}
								//visit
								var gridvisit=widget.get("visit");
								var data=gridvisit.getData();
								if(data.length==0){
									$(".J-member-visit-print").addClass("nodata");
								}else{
									widget.get("visit-print").setData(data);	
								}
								//activitysignup
								var gridactivitysignup=widget.get("activitysignup");
								var data=gridactivitysignup.getData();
								if(data.length==0){
									$(".J-member-activitysignup-print").addClass("nodata");
								}else{
									widget.get("activitysignup-print").setData(data);
								}
								//repair
								var gridrepair=widget.get("repair");
								var data=gridrepair.getData();
								if(data.length==0){
									$(".J-repair-print").addClass("nodata");
								}else{
									widget.get("repair-print").setData(data);	
								}
								//route
								var gridroute=widget.get("route");
								var data=gridroute.getData();
								if(data.length==0){
									$(".J-route-print").addClass("nodata");
								}else{
									widget.get("route-print").setData(data);
								}
								//goout
								var gridgoout=widget.get("goout");
								var data=gridgoout.getData();
								if(data.length==0){
									$(".J-goout-print").addClass("nodata");
								}else{
									widget.get("goout-print").setData(data);
								}
							}else{
								var title=moment(widget.get("subnav").getValue("date").start).format("YYYY.MM.DD");
								title+="（星期"+week[moment(widget.get("subnav").getValue("date").start).format("e")-1]+"）交接班";
								$(".J-shiftchange-title").text(title);
								//npanel
								var gridnpanel=widget.get("npanel");
								var data=gridnpanel.getData();
								if(data.length){
									$(".J-member-npanel-print").addClass("nodata");
								}else{
									widget.get("npanel-print").setData(data);
								}
								//log
								var gridlog=widget.get("log");
								var data=gridlog.getData();
								if(data.length==0){
									$(".J-member-log-print").addClass("nodata");
								}else{
									widget.get("log-print").setData(data);
								}
								//repair
								var gridrepair=widget.get("repair");
								var data=gridrepair.getData();
								if(data.length==0){
									$(".J-repair-print").addClass("nodata");
								}else{
									widget.get("repair-print").setData(data);	
								}
								//route
								var gridroute=widget.get("route");
								var data=gridroute.getData();
								if(data.length==0){
									$(".J-route-print").addClass("nodata");
								}else{
									widget.get("route-print").setData(data);
								}
								//nstt
								var gridnsatt=widget.get("nsatt");
								var data=gridnsatt.getData();
								if(data.length==0){
									$(".J-member-nsatt-print").addClass("nodata");
								}else{
									widget.get("nsatt-print").setData(data);
								}
							}
							if($(".J-matters").val()){
								$(".J-matters-print").html($("<pre></pre>").text($(".J-matters").val()));
							}else{
								$(".J-remark-detail").addClass("nodata");
							}
							if($(".J-nightShiftAttention").val()){
								$(".J-nightShiftAttention-print").html($("<pre></pre>").text($(".J-nightShiftAttention").val()));	
							}else{
								$(".J-night").addClass("nodata");
							}
							if($(".J-dayShiftAttention").val()){
								$(".J-dayShiftAttention-print").html($("<pre></pre>").text($(".J-dayShiftAttention").val()));
							}else{
								$(".J-day").addClass("nodata");
							}
							if($(".J-exchangeGoods").val()){
								$(".J-exchangeGoods-print").html($("<pre></pre>").text($(".J-exchangeGoods").val()));
							}else{
								$(".J-materialtransfer").addClass("nodata");
							}
							if($(".J-nightOthers").val()){
								$(".J-nightOthers-print").html($("<pre></pre>").text($(".J-nightOthers").val()));
							}else{
								$(".J-others").addClass("nodata");
							}
							window.print();
						}
					}]
				}
			});
		},
		getUserForm:function(){
			return new Form({
				model:{
					id:"userform",
					defaultButton:false,
					items:[{
						name:"usercode",
						label:"用户名",
						style:{
							label:"width:30%"
						},
						validate:["required"]
					},{
						name:"password",
						label:"密码",
						type:"password",
						style:{
							label:"width:30%"
						},
						validate:["required"]
					}]
				}
			});
		},
		validate:function(text,params){
			var that=this;
			var datas=$("#userform").serialize();
			aw.ajax({
				url:"api/user/validate?"+datas,
				success:function(data){
					if(data.pkUser != null){
						if(params.type=="daytime"){
							that.saveShiftChange(text,data,params);
						}else{
							that.saveNightShiftChange(text,data,params);
						}	
					}else{
						Dialog.alert({
							content:"用户名或密码错误，请重新输入"
						});
					}
				}
			});
		},
		sendOrReceive:function(text,params){
			var that=this;
			Dialog.showComponent({
				title:text,
				confirm:function(){
					that.validate(text,params);
				},
				setStyle:function(){
					$(".el-dialog .modal.fade.in").css({
						"top":"10%"
					});
				}
			},that.getUserForm());
			$(".J-password").off().on("keydown",function(e){
				var keyCode;
				//要进行完整的兼容性校验
				if (window.event) {// 兼容IE8
					keyCode = e.keyCode;
				} else {
					keyCode = e.which;
				}
				if (13 == keyCode) {
					// enter键搜索
					that.validate(text,params);
				}
			});
		},
		saveShiftChange:function(text,data,params){
			var that=this;
			var user=data;
			var data={};
			data.fetchProperties="*,startWork_user.name,finishWork_user.name";
			var numberFields=["countHouse","countMan","countWoman","countNewHouse","countNewMember","countOut","countInHospital","countPartner","countDied","countinNursingHome"];
			var textareaField=["nightShiftAttention","dayShiftAttention","matters","exchangeGoods"];
			for(var i=0;i<numberFields.length;i++){
				data[numberFields[i]]=$(".J-panel-"+numberFields[i]).text();
			}
			if(text=="接班"){
				for(var j=0;j<textareaField.length;j++){
					$(".J-"+textareaField[j]).val("");
					$(".J-"+textareaField[j]).attr("readonly",false);
					}
				data.startWork_user=user.pkUser;
				data.building=instance.get("subnav").getValue("building");
			}else{
				for(var j=0;j<textareaField.length;j++){
					data[textareaField[j]]=$(".J-"+textareaField[j]).val();
				}
				data.building=instance.get("subnav").getValue("building");
				data.pkShiftChange=$(".J-pkShiftChange").attr("data-key");	
				data.startWorkDate=$(".J-startWorkDate").attr("data-key");
				data.version=$(".J-version").attr("data-key");
				data.finishWork_user=user.pkUser;
				data.startWork_user=$(".J-shiftchange-start").attr("data-pk");
			}
			aw.ajax({
				url:"api/shiftchange/save",
				type:"POST",
				data:aw.customParam(data),
				success:function(data){
					if(data==null){
						Dialog.alert({
							content:text+"失败！"
						});
						
					}else{
						Dialog.alert({
							content:text+"成功!"
						});
						$(".J-pkShiftChange").attr("data-key",data.pkShiftChange);
						$(".J-version").attr("data-key",data.version);
						$(".J-nightShiftAttention").val(data.nightShiftAttention);
						$(".J-dayShiftAttention").val(data.dayShiftAttention);
						$(".J-matters").val(data.matters);
						$(".J-exchangeGoods").val(data.exchangeGoods);
						$(".J-shiftchange-start").attr("data-pk",data.startWork_user.pkUser);
						$(".J-startWorkDate").attr("data-key",data.startWorkDate);
						$(".J-shiftchange-startWorkDate").text(moment(data.startWorkDate).format("YYYY-MM-DD HH:mm:ss"));
						if(data.finishWorkDate){
							$(".J-shiftchange-finishWorkDate").text(moment(data.finishWorkDate).format("YYYY-MM-DD HH:mm:ss"));
						}else{
							$(".J-shiftchange-finishWorkDate").text("");
						}
						$(".J-version").attr("data-key",data.version);
						
						$(".J-shiftchange-startWorkUser").text(data.startWork_user.name);
						if(data.finishWork_user){
							$(".J-shiftchange-finishWorkUser").text(data.finishWork_user.name);
						}else{
							$(".J-shiftchange-finishWorkUser").text("");
						}
						instance.get("subnav").hide(["receive"]).show(["send"]);
						var attrs=instance.attrs;
						params.startdate=instance.get("subnav").getValue("date").start;
						params.enddate=instance.get("subnav").getValue("date").end;
						$(".nodata").removeClass("nodata");
						for(var i in attrs){
							if(attrs[i] && attrs[i].value && typeof attrs[i].value.refresh === "function"){
								attrs[i].value.refresh();
								
							}
						}
					
						
						
					}
				}
			});
		},
		saveNightShiftChange:function(text,data,params){
			var user=data;
			var data={};
			data.fetchProperties="*,startWork_user.name,finishWork_user.name";
			var textareaField=["matters","exchangeGoods","nightOthers"];
			for(var j=0;j<textareaField.length;j++){
				data[textareaField[j]]=$(".J-"+textareaField[j]).val();
			}
			if(text=="夜班秘书汇总"){
				data.startWork_user=user.pkUser;
			}else{
				data.pkNightShiftChange=$(".J-pkNightShiftChange").attr("data-key");
				data.version=$(".J-version").attr("data-key");
				data.startWorkDate=$(".J-startWorkDate").attr("data-key");
				data.finishWork_user=user.pkUser;
				data.startWork_user=$(".J-shiftchange-start").attr("data-pk");
				data.finishWorkDate=$(".J-startWorkDate").attr("data-key");
			}
			aw.ajax({
				url:"api/nightshiftchange/save",
				type:"POST",
				data:aw.customParam(data),
				success:function(data){
					if(data){
						Dialog.alert({
							content:text+"成功"
						});
						$(".J-pkNightShiftChange").attr("data-key",data.pkNightShiftChange);
						$(".J-matters").val(data.matters);
						$(".J-exchangeGoods").val(data.exchangeGoods);
						$(".J-nightOthers").val(data.nightOthers);
						$(".J-version").attr("data-key",data.version);
						if(data.startWork_user){
							$(".J-shiftchange-start").attr("data-pk",data.startWork_user.pkUser);
							$(".J-shiftchange-startWorkUser").text(data.startWork_user.name);
						}else{
							$(".J-shiftchange-startWorkUser").text("");
						}
						if(data.startWorkDate){
							$(".J-startWorkDate").attr("data-key",data.startWorkDate);
							$(".J-shiftchange-startWorkDate").text(moment(data.startWorkDate).format("YYYY-MM-DD HH:mm:ss"));
						}else{
							$(".J-shiftchange-startWorkDate").text("");
						}
						if(data.finishWork_user){
							$(".J-shiftchange-finishWorkUser").text(data.finishWork_user.name);
						}else{
							$(".J-shiftchange-finishWorkUser").text("");
						}
						if(data.finishWorkDate){
							$(".J-shiftchange-finishWorkDate").text(moment(data.finishWorkDate).format("YYYY-MM-DD HH:mm:ss"));
						}else{
							$(".J-shiftchange-finishWorkDate").text("");
						}
						instance.get("subnav").hide(["receive"]).show(["send"]);
						var attrs=instance.attrs;
						params.startdate=instance.get("subnav").getValue("date").start;
						params.enddate=instance.get("subnav").getValue("date").end;
						$(".nodata").removeClass("nodata");
						for(var i in attrs){
							if(attrs[i] && attrs[i].value && typeof attrs[i].value.refresh === "function"){
								attrs[i].value.refresh();
							}
						}
						
						
						
					}else{
						Dialog.alert({
							content:text+"失败"
						});
						
					}
					
					
					
					
				}
			});
		}
	};
	
	module.exports=SC_subnav;
});