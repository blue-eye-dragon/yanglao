<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import="org.springframework.security.web.WebAttributes,org.springframework.security.core.AuthenticationException,org.springframework.security.authentication.BadCredentialsException" %>
<!DOCTYPE html>
<html>
  <head>
    <title>登录</title>
    <meta content='text/html;charset=utf-8' http-equiv='content-type'>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>

    <link href="assets/bootstrap/bootstrap.css" media="all" rel="stylesheet" type="text/css"/>
    <link href="assets/flatty/light-theme.css" media="all" id="color-settings-body-color" rel="stylesheet" type="text/css"/>
    <link type="text/css" rel="stylesheet" href="assets/eling/elcms/signin/signin.css">
	  <link rel='shortcut icon' type='image/x-icon' class="J-logo" href="assets/eling/theme/eling/favicon.ico">
  </head>
  <body>
  		<div class="container el-container">
	  		<div class="middle row">
          <!-- <div>
            <div class="loginTitle">智慧养老云平台</div>
          </div> -->
          <div class="left">
            <img src="" alt="" class="left-bg J-signin-left">
          </div>
	  			<div class="right">
	  				<div class="right-bg">
	  					<div class="logo">
	  						<img class="J-signin-right"><div class="loginTitle">智慧养老云平台</div>
	  					</div>
	  					<div class="login-container">
	       					<form action="<c:url value="/j_spring_security_check"/>" class='validate-form' method='post'>
	          					<div class="form-group">
	          						<div class="controls with-icon-over-input">
	            						<input required placeholder="请输入用户名" class="form-control" name="j_username" id="j_username" type="text">
	            						<i class="icon-user text-muted"></i>
	          						</div>
	          					</div>
	          					<div class="form-group">
	          						<div class="controls with-icon-over-input">
	            						<input required placeholder="请输入密码" class="form-control" name="j_password" id="j_password" type="password">
	          							<i class="icon-lock text-muted"></i>
	  								</div>
	          					</div>
	           					<button id='j_btn_submite' class='loginBtn btn btn-block  '>登 录</button>
	           					<div class="forgetandregister">
	           						<%--<a href="html/findpwd.html" class="forget">忘记密码?</a>--%>
	           					</div>
	                  					<!-- 错误提示信息显示（封存，错误用户名） -->
					                      <%
					                      if("true".equals(request.getParameter("error"))){
					                    	  AuthenticationException ex=(AuthenticationException) request.getSession().getAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
					                    	  if(ex instanceof BadCredentialsException){
					                     	%>
					                    	<div style="color:red;clear: both;" class="error">用户名或密码错误，请重新输入</div>

					                     <%
					               			   }else {

					                     %>
					                    	  <div style="color:red;clear: both;"><%= ex.getMessage()%></div>

					                     <%
					               			   };
					                     	 };
					                    %>
	           				</form>
	         	 		</div>
	  				</div>
	  			</div>
	  		</div>
  		</div>
  		<div class="footer"></div>

  		<script type="text/javascript">
	    	localStorage.setItem("ctx","<c:url value='/'/>");
	    </script>

		<script id="seajsnode" type="text/javascript" src="assets/seajs/seajs/2.2.1/sea.js"></script>
		<script type="text/javascript" src="assets/config/sea_config.js?randomId=<%=Math.random()%>"></script>
		<script type="text/javascript">
			seajs.use(['$', 'store'], function($, store) {

				window.$ = window.jQuery = $;

				//设置左右图片
				var themeName = "<%=request.getParameter("theme")==null?"":request.getParameter("theme")%>"||store.get("theme")|| "eling";
				var search = window.location.search;
				if(search){
					search = search.substr(1);
					var m = search.match(new RegExp("theme=([^&]*)"));
					if(m){
						themeName = m[1];
					}
				}
				store.set("theme",themeName);

				$(".J-signin-left").attr("src","assets/eling/theme/" + themeName + "/slogan.png");
				$(".J-signin-right").attr("src","assets/eling/theme/" + themeName + "/signin_right.png");

				//1.获取最近使用用户名
				var user = store.get("user") || {};
				var usercode = user.code || "";

				//2.清空前台缓存
				store.remove("history");

				//3.设置最近使用用户
			    $("#j_username").val(usercode);
			    if(usercode){
			    	$("#j_password").focus();
			    }else{
			    	$("#j_username").focus();
			    }
			});
		</script>
  </body>
</html>
