require(["eling","hbars!./modules/register/register","backbone"],
		function(eling,tpl,Backbone){
	var interval;
	
	var RegisterModel = Backbone.Model.extend({
		defaults:{
			openid:eling.getParameter("openid")
		}
	});
	
	var RegisterView = Backbone.View.extend({
		el:"body",
		initialize:function(){
			this.model = new RegisterModel();
		},
		render:function(){
			this.$el.html(tpl(this.model.toJSON()));
		},
		_tip:function(text){
			$("#wxtips").remove();
			$("#register").prepend("<h5 id='wxtips' style='color:red'>"+text+"</h5>");
		},
		events:{
			"click .J-save" : function(){
				if(!$('.J-phone').val()){
					this._tip("请输入电话号码");
					return false;
				} 
				if(!$('.J-validatacode').val()){
					this._tip("请输入验证码");
					return false;
				}
				
				this._tip("");
				var that = this;
				$.ajax({
					url:"api/wechat/submit",
					data:$("#register").serialize()+"&communityName="+$(".J-community").find("option:selected").text(),
					dataType:"json",
					success:function(data){
						$(".J-validatacode").val();
						if(data.exMessage){
							that._tip("注册发生异常");
						}else if(data.msg){
							that._tip(data.msg);
						}
					}
				});
			},
			"click .J-getvailcode" : function(){
				if(!$('.J-phone').val()){
					this._tip("请输入电话号码");
					return false;
				} 
				this._tip("");
				$(".J-getvailcode").attr('disabled','disabled');
				interval=setTimeCount();
		 		$.ajax({
		 			url:"api/wechat/getvalidatecode",
		 			data:$("#register").serialize(),
		 			error:function(){
		 				$("#register").prepend("<h5 id='wxtips' style='color:red'>请重新获取验证码</h5>");
						$(".J-getvailcode").text("获取验证码");
						$(".J-getvailcode").removeAttr('disabled','disabled');
						window.clearInterval(interval);
		 			}
		 		});
			}
		}
	});
	
	var view = new RegisterView();
	view.render();
	
	$.ajax({
		url:"api/wechat/community/getAll",
		dataType:"json",
		success:function(data){
			var ret="";
			for(var i=0;i<data.length;i++){
				ret+="<option value='"+data[i].code+"'>"+data[i].name+"</option>"
			}
			$(".J-community").html(ret);
		}
	})
	
	function setTimeCount(){
		var i=window.setInterval(function(){
			var current=$(".J-getvailcode").text().split("s")[0];
			if(current == "获取验证码"){
				current=60;
			}
			if(current>0){
				current=current-1;
				$(".J-getvailcode").text(current+"s");
			}else{
				$("#register").prepend("<h5 id='wxtips' style='color:red'>请重新获取验证码</h5>");
				$(".J-getvailcode").text("获取验证码");
				$(".J-getvailcode").removeAttr('disabled','disabled');
				window.clearInterval(interval);
			}
		}, 1000);
		return i;
	}
});